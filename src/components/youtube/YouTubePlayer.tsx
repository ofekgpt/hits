'use client';

import { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubePlayer as YTPlayer } from 'react-youtube';
import { Button } from '../ui/Button';

interface YouTubePlayerProps {
  videoId: string;
  onSongPlayed: () => void;
  onSkipSong?: () => void;
  isDj: boolean;
  djName?: string;
}

export function YouTubePlayer({ videoId, onSongPlayed, onSkipSong, isDj, djName }: YouTubePlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [useExternalPlayer, setUseExternalPlayer] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  // Check if we're on HTTP (not HTTPS) - YouTube embeds are unreliable on HTTP
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      // On HTTP, give embedded player a chance but be ready to fallback
      const timeout = setTimeout(() => {
        if (!isReady) {
          setUseExternalPlayer(true);
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isReady]);

  // Non-DJ players see waiting state
  if (!isDj) {
    return <WaitingForSong djName={djName || 'DJ'} />;
  }

  // Get origin for YouTube API
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const opts = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      origin: origin,
    },
  };

  const handleReady = (event: { target: YTPlayer }) => {
    playerRef.current = event.target;
    setIsReady(true);
    setIsPlaying(true);
    setUseExternalPlayer(false);
  };

  const handleStateChange = (event: { data: number }) => {
    // YouTube states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering
    setIsPlaying(event.data === 1);
  };

  const handleError = () => {
    console.error('YouTube player error for video:', videoId);
    setHasError(true);
    setUseExternalPlayer(true);
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-2 font-semibold">
        🎧 YOU ARE THE DJ - Play the song!
      </div>

      {hasError || useExternalPlayer ? (
        <div className="p-6 text-center bg-gray-900">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-white font-semibold mb-2">Play the song externally</p>
          <p className="text-gray-400 text-sm mb-4">
            Open YouTube and play the song out loud for everyone to hear
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg font-semibold text-lg"
            >
              ▶️ Open in YouTube
            </a>
            {onSkipSong && (
              <button
                onClick={onSkipSong}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Skip to Different Song
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-900">
          {/* Hidden YouTube player - only for audio */}
          <div className="absolute opacity-0 pointer-events-none" style={{ width: '1px', height: '1px', overflow: 'hidden' }}>
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={handleReady}
              onStateChange={handleStateChange}
              onError={handleError}
            />
          </div>

          {/* Custom audio controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl animate-pulse">🎵</div>
            <p className="text-white text-lg font-semibold">
              {isReady ? (isPlaying ? 'Song Playing...' : 'Song Paused') : 'Loading...'}
            </p>

            {/* Play/Pause button */}
            <button
              onClick={togglePlayPause}
              disabled={!isReady}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                isReady
                  ? 'bg-purple-600 hover:bg-purple-500 cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            {/* Animated bars when playing */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-8">
                <div className="w-2 bg-purple-500 animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                <div className="w-2 bg-purple-500 animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                <div className="w-2 bg-purple-500 animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                <div className="w-2 bg-purple-500 animate-bounce" style={{ height: '80%', animationDelay: '450ms' }} />
                <div className="w-2 bg-purple-500 animate-bounce" style={{ height: '50%', animationDelay: '600ms' }} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-900 space-y-2">
        <Button
          onClick={onSongPlayed}
          className="w-full bg-green-600 hover:bg-green-500"
        >
          Song Played - Let Player Guess!
        </Button>
        <div className="flex gap-2 text-xs">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-gray-400 hover:text-white py-1"
          >
            Open in YouTube ↗
          </a>
          {onSkipSong && (
            <button
              onClick={onSkipSong}
              className="flex-1 text-gray-400 hover:text-white py-1"
            >
              Skip Song
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function WaitingForSong({ djName }: { djName: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-center border border-gray-700">
      <div className="animate-bounce text-5xl mb-4">🎵</div>
      <p className="text-white text-lg font-semibold mb-2">
        {djName} is playing the song...
      </p>
      <p className="text-gray-400 text-sm">Listen carefully and guess the year!</p>
      <div className="mt-4 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
