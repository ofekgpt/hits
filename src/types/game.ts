export type GamePhase =
  | 'LOBBY'
  | 'PLAYING_SONG'
  | 'PLACING_CARD'
  | 'CHALLENGE'
  | 'REVEAL'
  | 'RESULT'
  | 'GAME_OVER';

export type GameStatus = 'waiting' | 'playing' | 'finished';

export type GameMode = 'ORIGINAL' | 'PRO' | 'EXPERT';

export interface Song {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  year: number;
  albumArt: string | null;
  spotifyUri: string;
}

export interface PlacedCard extends Song {
  placedAt: number; // timestamp
}

export interface Player {
  id: string;
  gameId: string;
  name: string;
  color: string;
  tokens: number;
  timeline: PlacedCard[];
  isHost: boolean;
  joinedAt: string;
}

export interface Game {
  id: string;
  roomCode: string;
  hostPlayerId: string | null;
  status: GameStatus;
  gameMode: GameMode;
  currentPlayerIndex: number;
  currentDjIndex: number;
  currentCard: Song | null;
  phase: GamePhase;
  deck: Song[];
  createdAt: string;
  players: Player[];
}

export interface GameState {
  game: Game | null;
  players: Player[];
  currentPlayerId: string | null;
  isConnected: boolean;
}

// Socket events
export interface ServerToClientEvents {
  'game-state': (game: Game) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  'join-room': (roomCode: string, playerId: string) => void;
  'leave-room': (roomCode: string) => void;
  'game-update': (data: { roomCode: string; gameState: Partial<Game> }) => void;
  'start-game': (roomCode: string) => void;
  'play-song': (roomCode: string) => void;
  'song-played': (roomCode: string) => void;
  'place-card': (data: { roomCode: string; playerId: string; position: number }) => void;
  'challenge': (data: { roomCode: string; challengerId: string; position: number }) => void;
  'reveal-card': (roomCode: string) => void;
  'skip-turn': (data: { roomCode: string; playerId: string }) => void;
  'skip-song': (roomCode: string) => void;
  'free-card': (data: { roomCode: string; playerId: string }) => void;
  'next-turn': (roomCode: string) => void;
}

// Player colors
export const PLAYER_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#22C55E', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];
