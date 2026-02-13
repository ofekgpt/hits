'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Player } from '@/types/game';
import { SongCard } from './SongCard';

interface TimelineProps {
  player: Player;
  isCurrentPlayer: boolean;
  isDj: boolean;
  isMe: boolean;
  showPlacementSlots?: boolean;
  onPlaceCard?: (position: number) => void;
}

export function Timeline({
  player,
  isCurrentPlayer,
  isDj,
  isMe,
  showPlacementSlots = false,
  onPlaceCard,
}: TimelineProps) {
  const timeline = player.timeline || [];
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl glass-panel ${
        isMe
          ? isCurrentPlayer
            ? 'border-2 border-neon-cyan/50 glow-cyan'
            : 'border border-neon-cyan/20'
          : 'border border-glass-border'
      }`}
    >
      {/* Player header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{
              backgroundColor: player.color,
              boxShadow: `0 0 8px ${player.color}80`,
            }}
          />
          <span className="font-display font-bold text-base text-text-primary">
            {player.name}
          </span>
          {isMe && (
            <span className="text-[10px] text-text-muted">(You)</span>
          )}
          {isCurrentPlayer && (
            <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/15 text-neon-cyan text-[10px] font-bold border border-neon-cyan/25">
              Turn
            </span>
          )}
          {isDj && (
            <span className="px-2 py-0.5 rounded-lg bg-neon-magenta/15 text-neon-magenta text-[10px] font-bold border border-neon-magenta/25">
              DJ
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span>{timeline.length} cards</span>
          <span>{player.tokens} tokens</span>
        </div>
      </div>

      {/* Horizontal scrollable timeline */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 min-h-[116px]">
        {/* Leading drop slot */}
        {showPlacementSlots && onPlaceCard && (
          <DropSlot
            position={0}
            isHovered={hoveredSlot === 0}
            onHover={() => setHoveredSlot(0)}
            onLeave={() => setHoveredSlot(null)}
            onClick={() => onPlaceCard(0)}
          />
        )}

        <AnimatePresence mode="popLayout">
          {timeline.length === 0 && !showPlacementSlots ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-dim text-sm italic px-4"
            >
              No cards yet
            </motion.div>
          ) : (
            timeline.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center gap-1.5"
              >
                <SongCard card={card} faceUp={true} size="sm" />

                {/* Drop slot after each card */}
                {showPlacementSlots && onPlaceCard && (
                  <DropSlot
                    position={index + 1}
                    isHovered={hoveredSlot === index + 1}
                    onHover={() => setHoveredSlot(index + 1)}
                    onLeave={() => setHoveredSlot(null)}
                    onClick={() => onPlaceCard(index + 1)}
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DropSlot({
  position,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  position: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`w-8 h-[100px] rounded-xl border-2 border-dashed flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
        isHovered
          ? 'border-neon-green bg-neon-green/15 glow-green'
          : 'border-glass-border-hover bg-glass hover:border-neon-green/40'
      }`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className={`text-lg ${isHovered ? 'text-neon-green' : 'text-text-dim'}`}
        animate={isHovered ? { y: [0, -4, 0] } : { y: 0 }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
      >
        ▼
      </motion.span>
    </motion.button>
  );
}
