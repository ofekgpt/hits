'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import type { Game, Player, PlacedCard } from '@/types/game';

interface ChallengeButtonProps {
  game: Game;
  currentPlayerId: string | null;
  onChallenge: (position: number) => void;
}

export function ChallengeButton({ game, currentPlayerId, onChallenge }: ChallengeButtonProps) {
  const [showPositions, setShowPositions] = useState(false);

  const currentPlayer = game.players[game.currentPlayerIndex];
  const myPlayer = game.players.find(p => p.id === currentPlayerId);

  // Can't challenge if:
  // - Not in challenge phase
  // - You are the current player
  // - You don't have enough tokens
  const canChallenge =
    game.phase === 'CHALLENGE' &&
    currentPlayer?.id !== currentPlayerId &&
    myPlayer &&
    myPlayer.tokens >= 1;

  if (!canChallenge) {
    return null;
  }

  const timeline = myPlayer?.timeline || [];

  if (showPositions) {
    return (
      <div className="bg-yellow-900/50 border border-yellow-600 rounded-xl p-4">
        <p className="text-yellow-400 text-sm mb-3">Where should this card go in YOUR timeline?</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => {
              onChallenge(0);
              setShowPositions(false);
            }}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm"
          >
            Start
          </button>
          {timeline.map((card, index) => (
            <button
              key={card.id}
              onClick={() => {
                onChallenge(index + 1);
                setShowPositions(false);
              }}
              className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm"
            >
              After '{card.year.toString().slice(-2)}'
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPositions(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowPositions(true)}
      className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 text-xl animate-pulse"
    >
      🎯 HITSTER! (1🪙)
    </Button>
  );
}
