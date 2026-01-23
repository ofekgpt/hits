'use client';

import { MusicCard } from './MusicCard';
import { TokenDisplay } from '../ui/TokenDisplay';
import type { Player, PlacedCard } from '@/types/game';

interface PlayerTimelineProps {
  player: Player;
  isCurrentPlayer: boolean;
  isDj: boolean;
  showPlacementSlots?: boolean;
  onPlaceCard?: (position: number) => void;
}

export function PlayerTimeline({
  player,
  isCurrentPlayer,
  isDj,
  showPlacementSlots = false,
  onPlaceCard,
}: PlayerTimelineProps) {
  const timeline = player.timeline || [];

  return (
    <div
      className={`p-3 rounded-xl transition-all ${
        isCurrentPlayer
          ? 'bg-gray-800/80 border-2 border-purple-500 ring-2 ring-purple-500/30'
          : 'bg-gray-800/50 border border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <span className="font-semibold text-white">{player.name}</span>
          {player.isHost && <span className="text-xs text-gray-400">(Host)</span>}
          {isCurrentPlayer && (
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
              Current Turn
            </span>
          )}
          {isDj && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              🎧 DJ
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{timeline.length} cards</span>
          <TokenDisplay count={player.tokens} size="sm" />
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-2 min-h-[60px]">
        {showPlacementSlots && onPlaceCard && (
          <button
            onClick={() => onPlaceCard(0)}
            className="w-4 h-16 flex-shrink-0 border-2 border-dashed border-green-500 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors flex items-center justify-center"
            title="Place card here"
          >
            <span className="text-green-400 text-xs">▼</span>
          </button>
        )}

        {timeline.length === 0 ? (
          <div className="text-gray-500 text-sm">No cards yet</div>
        ) : (
          timeline.map((card, index) => (
            <div key={card.id} className="flex items-center gap-1">
              <MusicCard card={card} size="sm" />
              {showPlacementSlots && onPlaceCard && (
                <button
                  onClick={() => onPlaceCard(index + 1)}
                  className="w-4 h-16 flex-shrink-0 border-2 border-dashed border-green-500 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors flex items-center justify-center"
                  title="Place card here"
                >
                  <span className="text-green-400 text-xs">▼</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
