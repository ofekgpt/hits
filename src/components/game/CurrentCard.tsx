'use client';

import type { Song } from '@/types/game';

interface CurrentCardProps {
  card: Song | null;
  showYear?: boolean;
  phase: string;
}

export function CurrentCard({ card, showYear = false, phase }: CurrentCardProps) {
  if (!card) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
        <div className="text-4xl mb-2">🎵</div>
        <p className="text-gray-400">No card in play</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-gray-900 rounded-xl p-6 border border-purple-700/50">
      <div className="text-center">
        {showYear || phase === 'REVEAL' || phase === 'RESULT' ? (
          <>
            <div className="text-5xl font-bold text-white mb-2">{card.year}</div>
            <div className="text-lg text-gray-200 font-semibold">{card.title}</div>
            <div className="text-gray-400">{card.artist}</div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🎵</div>
            <div className="text-lg text-gray-200 font-semibold">???</div>
            <div className="text-sm text-gray-400">
              {phase === 'PLAYING_SONG' ? 'Listen to guess the year!' : 'Place in your timeline'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
