'use client';

import type { Game } from '@/types/game';

interface GameHeaderProps {
  game: Game;
  currentPlayerId: string | null;
  onLeaveRoom?: () => void;
}

const phaseLabels: Record<string, string> = {
  LOBBY: 'Waiting in Lobby',
  PLAYING_SONG: 'DJ Playing Song',
  PLACING_CARD: 'Place Your Card',
  CHALLENGE: 'Challenge Window',
  REVEAL: 'Revealing Card',
  RESULT: 'Round Result',
  GAME_OVER: 'Game Over',
};

export function GameHeader({ game, currentPlayerId, onLeaveRoom }: GameHeaderProps) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const currentDj = game.players[game.currentDjIndex];
  const isMyTurn = currentPlayer?.id === currentPlayerId;
  const amDj = currentDj?.id === currentPlayerId;

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">Room:</span>
          <span className="font-display font-bold text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-lg border border-neon-cyan/25 text-sm tracking-wider">
            {game.roomCode}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            {game.deck.length} cards left
          </span>
          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="text-xs text-neon-red/70 hover:text-neon-red border border-neon-red/20 hover:border-neon-red/50 px-2.5 py-1 rounded-lg transition-colors font-display"
            >
              Leave
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-text-muted text-sm">Turn: </span>
          <span className={`font-display font-bold ${isMyTurn ? 'text-neon-cyan text-glow-cyan' : 'text-text-primary'}`}>
            {currentPlayer?.name || '---'}
            {isMyTurn && ' (You)'}
          </span>
        </div>
        <div>
          <span className="text-text-muted text-sm">DJ: </span>
          <span className={`font-display font-bold ${amDj ? 'text-neon-magenta text-glow-magenta' : 'text-text-primary'}`}>
            {currentDj?.name || '---'}
            {amDj && ' (You)'}
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span
          className={`inline-block px-4 py-1.5 rounded-xl text-sm font-bold ${
            game.phase === 'PLACING_CARD' && isMyTurn
              ? 'bg-neon-green/15 text-neon-green border border-neon-green/40 glow-green'
              : game.phase === 'CHALLENGE'
              ? 'bg-neon-amber/15 text-neon-amber border border-neon-amber/40 glow-amber'
              : game.phase === 'PLAYING_SONG' && amDj
              ? 'bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/40'
              : 'glass-panel text-text-primary'
          }`}
        >
          {phaseLabels[game.phase] || game.phase}
        </span>
      </div>
    </div>
  );
}
