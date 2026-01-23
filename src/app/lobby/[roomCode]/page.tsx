'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useGameActions } from '@/hooks/useGameActions';
import { WaitingRoom } from '@/components/lobby/WaitingRoom';

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after first render (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Get player ID from localStorage
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    } else {
      // No player ID - redirect to home to join
      router.push('/');
    }
  }, [mounted, router]);

  const { socket, gameState, isConnected, error: socketError } = useSocket(roomCode, mounted ? playerId : null);
  const { startGame } = useGameActions(roomCode, socket);

  useEffect(() => {
    if (gameState?.status === 'playing') {
      router.push(`/game/${roomCode}`);
    }
  }, [gameState?.status, roomCode, router]);

  useEffect(() => {
    if (socketError) {
      setError(socketError);
    }
  }, [socketError]);

  const handleStartGame = () => {
    startGame();
  };

  // Show loading during SSR and initial client render
  if (!mounted || !playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.push('/')}
          className="text-purple-400 hover:text-purple-300"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="text-white mb-2">Connecting to room {roomCode}...</div>
        <div className="text-gray-500 text-sm">
          {isConnected ? 'Loading game data...' : 'Connecting to server...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-purple-500">🎵</span> HITSTER
          </h1>
        </div>

        <WaitingRoom
          game={gameState}
          currentPlayerId={playerId}
          onStartGame={handleStartGame}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}
