import 'dotenv/config';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { PrismaClient } from '../src/generated/prisma/client';
import type { ServerToClientEvents, ClientToServerEvents, Game, Song, PlacedCard } from '../src/types/game';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Helper to parse JSON safely
function parseJson<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

// Convert DB game to typed Game
function dbGameToGame(dbGame: any): Game {
  return {
    ...dbGame,
    currentCard: parseJson<Song | null>(dbGame.currentCard, null),
    deck: parseJson<Song[]>(dbGame.deck, []),
    createdAt: dbGame.createdAt.toISOString(),
    players: dbGame.players.map((p: any) => ({
      ...p,
      timeline: parseJson<PlacedCard[]>(p.timeline, []),
      joinedAt: p.joinedAt.toISOString(),
    })),
  };
}

// Check if card placement is valid
function isValidPlacement(timeline: PlacedCard[], newCard: Song, position: number): boolean {
  if (timeline.length === 0) return true;

  const newTimeline = [...timeline];
  newTimeline.splice(position, 0, newCard as PlacedCard);

  for (let i = 0; i < newTimeline.length - 1; i++) {
    if (newTimeline[i].year > newTimeline[i + 1].year) {
      return false;
    }
  }
  return true;
}

// Broadcast game state to all players in room
async function broadcastGameState(roomCode: string) {
  const game = await prisma.game.findUnique({
    where: { roomCode },
    include: { players: { orderBy: { joinedAt: 'asc' } } },
  });

  if (game) {
    io.to(roomCode).emit('game-state', dbGameToGame(game));
  }
}

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log('Player connected:', socket.id);

  // Join a game room
  socket.on('join-room', async (roomCode: string, playerId: string) => {
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.playerId = playerId;
    console.log(`Player ${playerId} joined room ${roomCode}`);
    await broadcastGameState(roomCode);
  });

  // Leave room
  socket.on('leave-room', (roomCode: string) => {
    socket.leave(roomCode);
    console.log(`Player left room ${roomCode}`);
  });

  // Start game
  socket.on('start-game', async (roomCode: string) => {
    console.log('start-game event received for room:', roomCode);
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      if (game.players.length < 2) {
        socket.emit('error', 'Need at least 2 players to start');
        return;
      }

      // Get the deck from the game
      const deck = parseJson<Song[]>(game.deck, []);

      if (deck.length === 0) {
        socket.emit('error', 'No songs in deck');
        return;
      }

      // Give each player their starting card
      for (const player of game.players) {
        const startingCard = deck.pop();
        if (startingCard) {
          await prisma.player.update({
            where: { id: player.id },
            data: {
              timeline: JSON.stringify([{ ...startingCard, placedAt: Date.now() }]),
            },
          });
        }
      }

      // Update game state
      await prisma.game.update({
        where: { roomCode },
        data: {
          status: 'playing',
          phase: 'PLAYING_SONG',
          deck: JSON.stringify(deck),
          currentPlayerIndex: 0,
          currentDjIndex: 0,
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('error', 'Failed to start game');
    }
  });

  // Play song (DJ action)
  socket.on('play-song', async (roomCode: string) => {
    console.log('play-song event received for room:', roomCode);
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const deck = parseJson<Song[]>(game.deck, []);

      if (deck.length === 0) {
        socket.emit('error', 'No more cards in deck');
        return;
      }

      const currentCard = deck.pop();

      await prisma.game.update({
        where: { roomCode },
        data: {
          currentCard: JSON.stringify(currentCard),
          deck: JSON.stringify(deck),
          phase: 'PLAYING_SONG',
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error playing song:', error);
      socket.emit('error', 'Failed to play song');
    }
  });

  // Song played (DJ signals done)
  socket.on('song-played', async (roomCode: string) => {
    try {
      await prisma.game.update({
        where: { roomCode },
        data: { phase: 'PLACING_CARD' },
      });
      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  });

  // Place card
  socket.on('place-card', async ({ roomCode, playerId, position }) => {
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const currentCard = parseJson<Song | null>(game.currentCard, null);
      if (!currentCard) {
        socket.emit('error', 'No current card');
        return;
      }

      const player = game.players.find(p => p.id === playerId);
      if (!player) {
        socket.emit('error', 'Player not found');
        return;
      }

      const timeline = parseJson<PlacedCard[]>(player.timeline, []);

      // Store the position for reveal phase
      await prisma.game.update({
        where: { roomCode },
        data: {
          phase: 'CHALLENGE',
          // Store placement info temporarily
        },
      });

      // Start challenge window - will auto-reveal after timeout
      await broadcastGameState(roomCode);

      // After 5 seconds, move to reveal phase if still in challenge
      setTimeout(async () => {
        const currentGame = await prisma.game.findUnique({ where: { roomCode } });
        if (currentGame && currentGame.phase === 'CHALLENGE') {
          // Check if placement is valid
          const isValid = isValidPlacement(timeline, currentCard, position);

          if (isValid) {
            // Add card to timeline
            const newTimeline = [...timeline];
            newTimeline.splice(position, 0, { ...currentCard, placedAt: Date.now() });

            await prisma.player.update({
              where: { id: playerId },
              data: { timeline: JSON.stringify(newTimeline) },
            });
          }

          // Check win condition
          const updatedPlayer = await prisma.player.findUnique({ where: { id: playerId } });
          const updatedTimeline = parseJson<PlacedCard[]>(updatedPlayer?.timeline || '[]', []);

          if (updatedTimeline.length >= 10) {
            await prisma.game.update({
              where: { roomCode },
              data: {
                phase: 'GAME_OVER',
                status: 'finished',
                currentCard: null,
              },
            });
          } else {
            // Move to next turn
            const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
            const nextDjIndex = (game.currentDjIndex + 1) % game.players.length;

            await prisma.game.update({
              where: { roomCode },
              data: {
                phase: 'REVEAL',
                currentPlayerIndex: nextPlayerIndex,
                currentDjIndex: nextDjIndex,
              },
            });

            // Brief reveal phase, then back to playing song
            setTimeout(async () => {
              const revealGame = await prisma.game.findUnique({ where: { roomCode } });
              if (revealGame && revealGame.phase === 'REVEAL') {
                await prisma.game.update({
                  where: { roomCode },
                  data: {
                    phase: 'PLAYING_SONG',
                    currentCard: null,
                  },
                });
                await broadcastGameState(roomCode);
              }
            }, 3000);
          }

          await broadcastGameState(roomCode);
        }
      }, 5000);

    } catch (error) {
      console.error('Error placing card:', error);
      socket.emit('error', 'Failed to place card');
    }
  });

  // Challenge (HITSTER!)
  socket.on('challenge', async ({ roomCode, challengerId, position }) => {
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game || game.phase !== 'CHALLENGE') {
        socket.emit('error', 'Cannot challenge now');
        return;
      }

      const challenger = game.players.find(p => p.id === challengerId);
      if (!challenger || challenger.tokens < 1) {
        socket.emit('error', 'Not enough tokens');
        return;
      }

      const currentCard = parseJson<Song | null>(game.currentCard, null);
      if (!currentCard) {
        socket.emit('error', 'No current card');
        return;
      }

      // Deduct token from challenger
      await prisma.player.update({
        where: { id: challengerId },
        data: { tokens: challenger.tokens - 1 },
      });

      const challengerTimeline = parseJson<PlacedCard[]>(challenger.timeline, []);
      const isValid = isValidPlacement(challengerTimeline, currentCard, position);

      if (isValid) {
        // Challenger wins - card goes to them
        const newTimeline = [...challengerTimeline];
        newTimeline.splice(position, 0, { ...currentCard, placedAt: Date.now() });

        await prisma.player.update({
          where: { id: challengerId },
          data: { timeline: JSON.stringify(newTimeline) },
        });
      }

      // Move to reveal phase
      const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      const nextDjIndex = (game.currentDjIndex + 1) % game.players.length;

      await prisma.game.update({
        where: { roomCode },
        data: {
          phase: 'REVEAL',
          currentPlayerIndex: nextPlayerIndex,
          currentDjIndex: nextDjIndex,
        },
      });

      await broadcastGameState(roomCode);

      // After reveal, continue to next turn
      setTimeout(async () => {
        const revealGame = await prisma.game.findUnique({ where: { roomCode } });
        if (revealGame && revealGame.phase === 'REVEAL') {
          await prisma.game.update({
            where: { roomCode },
            data: {
              phase: 'PLAYING_SONG',
              currentCard: null,
            },
          });
          await broadcastGameState(roomCode);
        }
      }, 3000);

    } catch (error) {
      console.error('Error handling challenge:', error);
      socket.emit('error', 'Failed to process challenge');
    }
  });

  // Skip turn
  socket.on('skip-turn', async ({ roomCode, playerId }) => {
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const player = game.players.find(p => p.id === playerId);
      if (!player || player.tokens < 1) {
        socket.emit('error', 'Not enough tokens');
        return;
      }

      // Deduct token
      await prisma.player.update({
        where: { id: playerId },
        data: { tokens: player.tokens - 1 },
      });

      // Draw new card and move to playing song phase
      await prisma.game.update({
        where: { roomCode },
        data: {
          phase: 'PLAYING_SONG',
          currentCard: null,
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error skipping turn:', error);
    }
  });

  // Free card
  socket.on('free-card', async ({ roomCode, playerId }) => {
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const player = game.players.find(p => p.id === playerId);
      if (!player || player.tokens < 3) {
        socket.emit('error', 'Not enough tokens (need 3)');
        return;
      }

      const currentCard = parseJson<Song | null>(game.currentCard, null);
      const timeline = parseJson<PlacedCard[]>(player.timeline, []);

      if (currentCard) {
        // Find the correct position for the card
        let position = 0;
        for (let i = 0; i <= timeline.length; i++) {
          const leftYear = i > 0 ? timeline[i - 1].year : -Infinity;
          const rightYear = i < timeline.length ? timeline[i].year : Infinity;
          if (currentCard.year >= leftYear && currentCard.year <= rightYear) {
            position = i;
            break;
          }
        }

        const newTimeline = [...timeline];
        newTimeline.splice(position, 0, { ...currentCard, placedAt: Date.now() });

        // Deduct tokens and add card
        await prisma.player.update({
          where: { id: playerId },
          data: {
            tokens: player.tokens - 3,
            timeline: JSON.stringify(newTimeline),
          },
        });
      }

      // Move to next turn
      const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      const nextDjIndex = (game.currentDjIndex + 1) % game.players.length;

      await prisma.game.update({
        where: { roomCode },
        data: {
          phase: 'PLAYING_SONG',
          currentPlayerIndex: nextPlayerIndex,
          currentDjIndex: nextDjIndex,
          currentCard: null,
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error getting free card:', error);
    }
  });

  // Skip song (video doesn't work - draw new card, no penalty)
  socket.on('skip-song', async (roomCode: string) => {
    console.log('skip-song event received for room:', roomCode);
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
      });

      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      const deck = parseJson<Song[]>(game.deck, []);

      if (deck.length === 0) {
        socket.emit('error', 'No more cards in deck');
        return;
      }

      // Draw a new card (discard the broken one)
      const currentCard = deck.pop();

      await prisma.game.update({
        where: { roomCode },
        data: {
          currentCard: JSON.stringify(currentCard),
          deck: JSON.stringify(deck),
          phase: 'PLAYING_SONG',
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error skipping song:', error);
      socket.emit('error', 'Failed to skip song');
    }
  });

  // Next turn (manual advance)
  socket.on('next-turn', async (roomCode: string) => {
    try {
      const game = await prisma.game.findUnique({
        where: { roomCode },
        include: { players: { orderBy: { joinedAt: 'asc' } } },
      });

      if (!game) return;

      const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      const nextDjIndex = (game.currentDjIndex + 1) % game.players.length;

      await prisma.game.update({
        where: { roomCode },
        data: {
          phase: 'PLAYING_SONG',
          currentPlayerIndex: nextPlayerIndex,
          currentDjIndex: nextDjIndex,
          currentCard: null,
        },
      });

      await broadcastGameState(roomCode);
    } catch (error) {
      console.error('Error advancing turn:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

// Railway sets PORT, fallback to SOCKET_PORT for local dev
const PORT = process.env.PORT || process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
