'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Song } from '@/types/game';

interface AudioPlayerProps {
  currentCard: Song | null;
  isPlaying: boolean;
}

export function AudioPlayer({ currentCard, isPlaying }: AudioPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);

  // Listen for Spotify iFrame API ready message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://open.spotify.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.type === 'ready') {
          setEmbedReady(true);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Try to auto-play via iFrame API when embed is ready
  useEffect(() => {
    if (embedReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ command: 'toggle' }, '*');
    }
  }, [embedReady]);

  // Handle user tap to play (fallback for browsers that block autoplay)
  const handleTapToPlay = useCallback(() => {
    setHasInteracted(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ command: 'toggle' }, '*');
    }
  }, []);

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
          {/* Waveform bars + tap-to-play indicator */}
          <div className="flex items-center justify-center gap-3 mb-2">
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

          {/* Spotify embed — blurred to hide track info */}
          <div className="relative rounded-lg overflow-hidden">
            {/* Blur overlay to hide song name/artist in embed */}
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              onClick={handleTapToPlay}
            >
              {!hasInteracted && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-text-muted text-xs font-display animate-pulse">
                    Tap to play ▶
                  </span>
                </div>
              )}
            </div>

            <iframe
              ref={iframeRef}
              src={`https://open.spotify.com/embed/track/${currentCard.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="eager"
              className="rounded-lg"
              style={{ colorScheme: 'normal' }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
