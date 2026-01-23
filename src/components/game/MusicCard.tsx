'use client';

import type { PlacedCard, Song } from '@/types/game';

interface MusicCardProps {
  card: PlacedCard | Song;
  faceUp?: boolean;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
  onClick?: () => void;
}

export function MusicCard({ card, faceUp = true, size = 'md', highlight = false, onClick }: MusicCardProps) {
  const sizes = {
    sm: 'w-14 h-14 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  const year = card.year ? card.year.toString() : '??';

  if (!faceUp) {
    return (
      <div
        className={`${sizes[size]} bg-gradient-to-br from-purple-800 to-purple-950 rounded-lg flex items-center justify-center border-2 border-purple-600 shadow-lg ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
        onClick={onClick}
      >
        <span className="text-2xl">🎵</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex flex-col items-center justify-center p-1 border-2 ${highlight ? 'border-yellow-400 shadow-yellow-400/30' : 'border-gray-600'} shadow-lg ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
      title={`${card.title} - ${card.artist} (${card.year})`}
    >
      <span className="font-bold text-white">{year}</span>
    </div>
  );
}
