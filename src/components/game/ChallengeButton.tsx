'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import type { Game } from '@/types/game';

interface ChallengeButtonProps {
  game: Game;
  currentPlayerId: string | null;
  onChallenge: (position: number) => void;
}

export function ChallengeButton({ game, currentPlayerId, onChallenge }: ChallengeButtonProps) {
  const [showPositions, setShowPositions] = useState(false);

  const currentPlayer = game.players[game.currentPlayerIndex];
  const myPlayer = game.players.find(p => p.id === currentPlayerId);

  const canChallenge =
    game.phase === 'CHALLENGE' &&
    currentPlayer?.id !== currentPlayerId &&
    myPlayer &&
    myPlayer.tokens >= 1;

  if (!canChallenge) {
    return null;
  }

  const timeline = myPlayer?.timeline || [];

  return (
    <AnimatePresence mode="wait">
      {showPositions ? (
        <motion.div
          key="positions"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel rounded-2xl p-4 border border-neon-amber/30"
        >
          <p className="text-neon-amber text-sm mb-3 font-semibold">
            Where should this card go in YOUR timeline?
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => { onChallenge(0); setShowPositions(false); }}
              className="px-3 py-2 bg-neon-amber/15 hover:bg-neon-amber/25 text-neon-amber rounded-xl text-sm font-bold border border-neon-amber/30 transition-colors cursor-pointer"
            >
              Start
            </button>
            {timeline.map((card, index) => (
              <button
                key={card.id}
                onClick={() => { onChallenge(index + 1); setShowPositions(false); }}
                className="px-3 py-2 bg-neon-amber/15 hover:bg-neon-amber/25 text-neon-amber rounded-xl text-sm font-bold border border-neon-amber/30 transition-colors cursor-pointer"
              >
                After &apos;{card.year.toString().slice(-2)}&apos;
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowPositions(false)}>
            Cancel
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <button
            onClick={() => setShowPositions(true)}
            className="w-full py-4 text-xl font-display font-extrabold text-neon-amber bg-neon-amber/10 border-2 border-neon-amber/40 rounded-2xl animate-pulse-neon cursor-pointer hover:bg-neon-amber/20 transition-colors"
          >
            HITSTER! (1 token)
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
