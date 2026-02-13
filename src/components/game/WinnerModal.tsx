'use client';

import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Game } from '@/types/game';

interface WinnerModalProps {
  game: Game;
  onClose: () => void;
}

export function WinnerModal({ game, onClose }: WinnerModalProps) {
  const winner = game.players.reduce((prev, current) => {
    const prevCards = prev.timeline?.length || 0;
    const currentCards = current.timeline?.length || 0;
    return currentCards > prevCards ? current : prev;
  }, game.players[0]);

  return (
    <Modal isOpen={game.phase === 'GAME_OVER'} onClose={onClose} showClose={false}>
      <div className="text-center py-4">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-display font-extrabold text-text-primary mb-2">Game Over!</h2>
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-panel"
            style={{
              borderColor: winner?.color,
              borderWidth: '2px',
              boxShadow: `0 0 20px ${winner?.color}40`,
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: winner?.color,
                boxShadow: `0 0 10px ${winner?.color}`,
              }}
            />
            <span className="text-xl font-display font-bold text-text-primary">{winner?.name}</span>
          </div>
          <p className="text-text-muted mt-2 text-sm">
            Wins with {winner?.timeline?.length || 0} cards!
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="text-xs text-text-muted font-semibold uppercase tracking-wider">Final Standings</h3>
          {[...game.players]
            .sort((a, b) => (b.timeline?.length || 0) - (a.timeline?.length || 0))
            .map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-2.5 glass-panel rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-text-dim w-5 text-sm">{index + 1}.</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: player.color,
                      boxShadow: `0 0 6px ${player.color}80`,
                    }}
                  />
                  <span className="text-text-primary font-semibold">{player.name}</span>
                </div>
                <span className="text-text-muted text-sm">{player.timeline?.length || 0} cards</span>
              </div>
            ))}
        </div>

        <Button onClick={onClose} className="w-full" size="lg">
          Return to Lobby
        </Button>
      </div>
    </Modal>
  );
}
