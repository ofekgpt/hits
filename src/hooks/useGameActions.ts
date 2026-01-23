'use client';

import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/game';

export function useGameActions(roomCode: string, socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null) {
  const startGame = useCallback(() => {
    console.log('startGame called, socket connected:', socket?.connected, 'roomCode:', roomCode);
    if (socket?.connected) {
      socket.emit('start-game', roomCode);
    } else {
      console.error('Socket not connected!');
    }
  }, [roomCode, socket]);

  const playSong = useCallback(() => {
    console.log('playSong called, socket connected:', socket?.connected, 'roomCode:', roomCode);
    if (socket?.connected) {
      socket.emit('play-song', roomCode);
    } else {
      console.error('Socket not connected!');
    }
  }, [roomCode, socket]);

  const songPlayed = useCallback(() => {
    console.log('songPlayed called, socket connected:', socket?.connected);
    if (socket?.connected) {
      socket.emit('song-played', roomCode);
    }
  }, [roomCode, socket]);

  const placeCard = useCallback((playerId: string, position: number) => {
    console.log('placeCard called, position:', position);
    if (socket?.connected) {
      socket.emit('place-card', { roomCode, playerId, position });
    }
  }, [roomCode, socket]);

  const challenge = useCallback((challengerId: string, position: number) => {
    if (socket?.connected) {
      socket.emit('challenge', { roomCode, challengerId, position });
    }
  }, [roomCode, socket]);

  const skipTurn = useCallback((playerId: string) => {
    if (socket?.connected) {
      socket.emit('skip-turn', { roomCode, playerId });
    }
  }, [roomCode, socket]);

  const freeCard = useCallback((playerId: string) => {
    if (socket?.connected) {
      socket.emit('free-card', { roomCode, playerId });
    }
  }, [roomCode, socket]);

  const nextTurn = useCallback(() => {
    if (socket?.connected) {
      socket.emit('next-turn', roomCode);
    }
  }, [roomCode, socket]);

  const skipSong = useCallback(() => {
    // Skip current broken video and draw a new card
    if (socket?.connected) {
      socket.emit('skip-song', roomCode);
    }
  }, [roomCode, socket]);

  return {
    startGame,
    playSong,
    songPlayed,
    placeCard,
    challenge,
    skipTurn,
    skipSong,
    freeCard,
    nextTurn,
  };
}
