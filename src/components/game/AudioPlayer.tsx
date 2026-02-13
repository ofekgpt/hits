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
          {/* Waveform bars — only visible indicator */}
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-neon-green flex-shrink-0"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-text-muted text-sm font-display">
              Listening...
            </span>
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

          {/* Hidden Spotify embed — plays audio, not visible */}
          <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/track/${currentCard.spotifyId}?utm_source=generator&theme=0&autoplay=1`}
              width="300"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ colorScheme: 'normal' }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
