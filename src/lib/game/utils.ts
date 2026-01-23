import type { Game, Player, Song, PlacedCard } from '@/types/game';

// Get current player from game state
export function getCurrentPlayer(game: Game): Player | null {
  if (!game.players || game.players.length === 0) {
    return null;
  }
  return game.players[game.currentPlayerIndex] || null;
}

// Get current DJ from game state
export function getCurrentDj(game: Game): Player | null {
  if (!game.players || game.players.length === 0) {
    return null;
  }
  return game.players[game.currentDjIndex] || null;
}

// Get next player index
export function getNextPlayerIndex(game: Game): number {
  return (game.currentPlayerIndex + 1) % game.players.length;
}

// Get next DJ index
export function getNextDjIndex(game: Game): number {
  return (game.currentDjIndex + 1) % game.players.length;
}

// Format year for display
export function formatYear(year: number): string {
  return year.toString().slice(-2).padStart(2, '0');
}

// Check if player is current player
export function isCurrentPlayer(game: Game, playerId: string): boolean {
  const currentPlayer = getCurrentPlayer(game);
  return currentPlayer?.id === playerId;
}

// Check if player is DJ
export function isDj(game: Game, playerId: string): boolean {
  const dj = getCurrentDj(game);
  return dj?.id === playerId;
}

// Parse JSON safely
export function parseJson<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

// Stringify JSON for storage
export function stringifyJson<T>(value: T): string {
  return JSON.stringify(value);
}

// Convert DB game to typed Game
export function dbGameToGame(dbGame: {
  id: string;
  roomCode: string;
  hostPlayerId: string | null;
  status: string;
  gameMode: string;
  currentPlayerIndex: number;
  currentDjIndex: number;
  currentCard: string | null;
  phase: string;
  deck: string;
  createdAt: Date;
  players: {
    id: string;
    gameId: string;
    name: string;
    color: string;
    tokens: number;
    timeline: string;
    isHost: boolean;
    joinedAt: Date;
  }[];
}): Game {
  return {
    ...dbGame,
    status: dbGame.status as Game['status'],
    gameMode: dbGame.gameMode as Game['gameMode'],
    phase: dbGame.phase as Game['phase'],
    currentCard: parseJson<Song | null>(dbGame.currentCard, null),
    deck: parseJson<Song[]>(dbGame.deck, []),
    createdAt: dbGame.createdAt.toISOString(),
    players: dbGame.players.map(p => ({
      ...p,
      timeline: parseJson<PlacedCard[]>(p.timeline, []),
      joinedAt: p.joinedAt.toISOString(),
    })),
  };
}
