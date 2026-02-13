'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Song } from '@/types/game';

interface AudioPlayerProps {
  currentCard: Song | null;
  isPlaying: boolean;
}

export function AudioPlayer({ currentCard, isPlaying }: AudioPlayerProps) {
  if (!currentCard || !isPlaying) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 glass-panel border-t border-glass-border-hover z-40"
        style={{ backdropFilter: 'blur(30px)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Track info + waveform */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div
                className="w-2 h-2 rounded-full bg-neon-green flex-shrink-0"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <div className="min-w-0">
                <div className="text-text-primary font-semibold text-sm truncate">
                  {currentCard.title}
                </div>
                <div className="text-text-muted text-xs truncate">
                  {currentCard.artist}
                </div>
              </div>
            </div>

            {/* Waveform bars */}
            <div className="flex items-end gap-[3px] h-6 flex-shrink-0">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-neon-cyan rounded-full"
                  animate={{
                    height: ['6px', '24px', '10px', '20px', '6px'],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Spotify embed */}
          <iframe
            src={`https://open.spotify.com/embed/track/${currentCard.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
            style={{ colorScheme: 'normal' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
