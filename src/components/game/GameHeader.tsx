'use client';

import type { Game } from '@/types/game';

interface GameHeaderProps {
  game: Game;
  currentPlayerId: string | null;
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

export function GameHeader({ game, currentPlayerId }: GameHeaderProps) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const currentDj = game.players[game.currentDjIndex];
  const isMyTurn = currentPlayer?.id === currentPlayerId;
  const amDj = currentDj?.id === currentPlayerId;

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Room:</span>
          <span className="font-bold text-white bg-gray-700 px-2 py-0.5 rounded">
            {game.roomCode}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          {game.deck.length} cards left
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-400">Turn: </span>
          <span className={`font-semibold ${isMyTurn ? 'text-purple-400' : 'text-white'}`}>
            {currentPlayer?.name || '---'}
            {isMyTurn && ' (You)'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">DJ: </span>
          <span className={`font-semibold ${amDj ? 'text-blue-400' : 'text-white'}`}>
            🎧 {currentDj?.name || '---'}
            {amDj && ' (You)'}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            game.phase === 'PLACING_CARD' && isMyTurn
              ? 'bg-green-600 text-white'
              : game.phase === 'CHALLENGE'
              ? 'bg-yellow-600 text-white'
              : game.phase === 'PLAYING_SONG' && amDj
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {phaseLabels[game.phase] || game.phase}
        </span>
      </div>
    </div>
  );
}
