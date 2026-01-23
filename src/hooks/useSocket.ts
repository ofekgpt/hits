'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import type { Game, Player, ServerToClientEvents, ClientToServerEvents } from '@/types/game';

interface UseSocketReturn {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  gameState: Game | null;
  isConnected: boolean;
  error: string | null;
  joinRoom: (roomCode: string, playerId: string) => void;
  leaveRoom: (roomCode: string) => void;
}

export function useSocket(roomCode: string, playerId: string | null): UseSocketReturn {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [gameState, setGameState] = useState<Game | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const joinedRef = useRef(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    // Only run on client side and when we have playerId
    if (typeof window === 'undefined' || !playerId) {
      return;
    }

    let mounted = true;

    // Dynamic import to avoid SSR issues
    import('@/lib/socket').then(({ connectSocket }) => {
      if (!mounted) return;

      const s = connectSocket();
      socketRef.current = s;
      setSocket(s);

      const handleConnect = () => {
        console.log('Socket connected');
        if (mounted) {
          setIsConnected(true);
          setError(null);
        }

        // Join room once connected
        if (roomCode && playerId && !joinedRef.current) {
          console.log('Joining room:', roomCode, 'as player:', playerId);
          s.emit('join-room', roomCode, playerId);
          joinedRef.current = true;
        }
      };

      const handleDisconnect = () => {
        console.log('Socket disconnected');
        if (mounted) {
          setIsConnected(false);
        }
        joinedRef.current = false;
      };

      const handleGameState = (state: Game) => {
        console.log('Received game state:', state);
        if (mounted) {
          setGameState(state);
        }
      };

      const handlePlayerJoined = (player: Player) => {
        console.log('Player joined:', player);
      };

      const handlePlayerLeft = (leftPlayerId: string) => {
        console.log('Player left:', leftPlayerId);
      };

      const handleError = (message: string) => {
        console.error('Socket error:', message);
        if (mounted) {
          setError(message);
        }
      };

      s.on('connect', handleConnect);
      s.on('disconnect', handleDisconnect);
      s.on('game-state', handleGameState);
      s.on('player-joined', handlePlayerJoined);
      s.on('player-left', handlePlayerLeft);
      s.on('error', handleError);

      // If already connected, join room immediately
      if (s.connected && roomCode && playerId && !joinedRef.current) {
        console.log('Already connected, joining room:', roomCode);
        s.emit('join-room', roomCode, playerId);
        joinedRef.current = true;
      }
    });

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('game-state');
        socketRef.current.off('player-joined');
        socketRef.current.off('player-left');
        socketRef.current.off('error');
      }
    };
  }, [roomCode, playerId]);

  const joinRoom = useCallback((code: string, pId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', code, pId);
      joinedRef.current = true;
    }
  }, []);

  const leaveRoom = useCallback((code: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', code);
      joinedRef.current = false;
    }
  }, []);

  return {
    socket,
    gameState,
    isConnected,
    error,
    joinRoom,
    leaveRoom,
  };
}
