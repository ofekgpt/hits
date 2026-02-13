'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { PlacedCard, Song } from '@/types/game';

interface SongCardProps {
  card: PlacedCard | Song;
  faceUp?: boolean;
  size?: 'sm' | 'md' | 'lg';
  result?: 'correct' | 'wrong' | null;
}

const sizeConfig = {
  sm: { w: 'w-[72px]', h: 'h-[100px]', year: 'text-lg', title: 'text-[10px]', artist: 'text-[9px]', note: 'text-2xl' },
  md: { w: 'w-[120px]', h: 'h-[170px]', year: 'text-3xl', title: 'text-xs', artist: 'text-[10px]', note: 'text-4xl' },
  lg: { w: 'w-[160px]', h: 'h-[224px]', year: 'text-5xl', title: 'text-sm', artist: 'text-xs', note: 'text-6xl' },
};

export function SongCard({ card, faceUp = false, size = 'md', result = null }: SongCardProps) {
  const [isFlipped, setIsFlipped] = useState(faceUp);
  const s = sizeConfig[size];

  useEffect(() => {
    setIsFlipped(faceUp);
  }, [faceUp]);

  const rotateY = useMotionValue(isFlipped ? 180 : 0);
  const frontOpacity = useTransform(rotateY, [0, 90, 180], [1, 0, 0]);
  const backOpacity = useTransform(rotateY, [0, 90, 180], [0, 0, 1]);

  const resultBorder = result === 'correct'
    ? 'border-neon-green glow-green'
    : result === 'wrong'
    ? 'border-neon-red glow-red'
    : '';

  const resultAnimation = result === 'wrong'
    ? { x: [0, -6, 6, -6, 6, 0] }
    : result === 'correct'
    ? { scale: [1, 1.05, 1] }
    : {};

  return (
    <motion.div
      className={`${s.w} ${s.h} perspective-1000 flex-shrink-0`}
      animate={resultAnimation}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* FACE DOWN (front side — visible when rotateY = 0) */}
        <motion.div
          className={`absolute inset-0 backface-hidden rounded-2xl glass-panel border-2 border-neon-magenta/30 flex items-center justify-center overflow-hidden ${resultBorder}`}
          style={{ opacity: frontOpacity }}
        >
          <div className="absolute inset-0 animate-shimmer" />
          <motion.span
            className={`${s.note} relative z-10 select-none`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🎵
          </motion.span>
        </motion.div>

        {/* FACE UP (back side — visible when rotateY = 180) */}
        <motion.div
          className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-neon-cyan/40 ${resultBorder || 'glow-cyan'}`}
          style={{ rotateY: 180, opacity: backOpacity }}
        >
          {/* Album art background */}
          {card.albumArt ? (
            <Image
              src={card.albumArt}
              alt={`${card.title} album art`}
              fill
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20" />
          )}

          {/* Dark overlay for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Card content */}
          <div className="absolute inset-0 flex flex-col justify-end p-2.5">
            <div className={`font-display font-extrabold text-neon-cyan ${s.year} leading-none mb-1 text-glow-cyan`}>
              {card.year}
            </div>
            <div className={`text-text-primary font-bold ${s.title} leading-tight line-clamp-2`}>
              {card.title}
            </div>
            <div className={`text-text-muted ${s.artist} leading-tight line-clamp-1`}>
              {card.artist}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
