'use client';

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Game } from '@/types/game';

interface WinnerModalProps {
  game: Game;
  onClose: () => void;
}

export function WinnerModal({ game, onClose }: WinnerModalProps) {
  // Find the winner (player with most cards, or first to 10)
  const winner = game.players.reduce((prev, current) => {
    const prevCards = prev.timeline?.length || 0;
    const currentCards = current.timeline?.length || 0;
    return currentCards > prevCards ? current : prev;
  }, game.players[0]);

  return (
    <Modal isOpen={game.phase === 'GAME_OVER'} onClose={onClose} showClose={false}>
      <div className="text-center py-4">
        <div className="text-6xl mb-4">🎉🏆🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
        <div className="mb-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: winner?.color + '20', borderColor: winner?.color }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: winner?.color }}
            />
            <span className="text-xl font-bold text-white">{winner?.name}</span>
          </div>
          <p className="text-gray-400 mt-2">
            Wins with {winner?.timeline?.length || 0} cards!
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="text-sm text-gray-400 font-medium">Final Standings</h3>
          {[...game.players]
            .sort((a, b) => (b.timeline?.length || 0) - (a.timeline?.length || 0))
            .map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-4">{index + 1}.</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="text-white">{player.name}</span>
                </div>
                <span className="text-gray-400">{player.timeline?.length || 0} cards</span>
              </div>
            ))}
        </div>

        <Button onClick={onClose} className="w-full">
          Return to Lobby
        </Button>
      </div>
    </Modal>
  );
}
