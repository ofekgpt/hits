'use client';

import { useState, useCallback, useRef } from 'react';

interface YouTubePlayerState {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
}

export function useYouTubePlayer() {
  const [state, setState] = useState<YouTubePlayerState>({
    isPlaying: false,
    isReady: false,
    currentTime: 0,
    duration: 0,
  });
  const playerRef = useRef<any>(null);

  const onReady = useCallback((event: any) => {
    playerRef.current = event.target;
    setState((prev) => ({
      ...prev,
      isReady: true,
      duration: event.target.getDuration(),
    }));
  }, []);

  const onPlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const onPause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const onEnd = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const onStateChange = useCallback((event: any) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    if (event.data === 1) {
      onPlay();
    } else if (event.data === 2) {
      onPause();
    } else if (event.data === 0) {
      onEnd();
    }
  }, [onPlay, onPause, onEnd]);

  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  }, []);

  return {
    ...state,
    onReady,
    onStateChange,
    onEnd,
    play,
    pause,
    seekTo,
    playerRef,
  };
}
