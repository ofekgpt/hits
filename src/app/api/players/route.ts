import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PLAYER_COLORS } from '@/types/game';

// POST /api/players - Join a game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, playerName } = body;

    if (!roomCode || !playerName) {
      return NextResponse.json({ error: 'Room code and player name are required' }, { status: 400 });
    }

    // Find the game
    const game = await prisma.game.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        players: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'waiting') {
      return NextResponse.json({ error: 'Game has already started' }, { status: 400 });
    }

    if (game.players.length >= 10) {
      return NextResponse.json({ error: 'Game is full (max 10 players)' }, { status: 400 });
    }

    // Check for duplicate name
    const existingPlayer = game.players.find(
      (p) => p.name.toLowerCase() === playerName.trim().toLowerCase()
    );
    if (existingPlayer) {
      return NextResponse.json({ error: 'Player name already taken' }, { status: 400 });
    }

    // Get next color
    const usedColors = game.players.map((p) => p.color);
    const availableColor = PLAYER_COLORS.find((c) => !usedColors.includes(c)) || PLAYER_COLORS[0];

    // Create player
    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        name: playerName.trim(),
        color: availableColor,
        isHost: false,
      },
    });

    // Get updated game
    const updatedGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: {
        players: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      player,
      game: updatedGame,
    });
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
