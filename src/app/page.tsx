'use client';

import { useState } from 'react';
import { CreateGame } from '@/components/lobby/CreateGame';
import { JoinGame } from '@/components/lobby/JoinGame';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            <span className="text-purple-500">🎵</span> HITSTER
          </h1>
          <p className="text-gray-400">The music timeline game</p>
        </div>

        {mode === 'choose' && (
          <div className="space-y-4">
            <Button
              onClick={() => setMode('create')}
              className="w-full py-6 text-xl"
              size="lg"
            >
              Create Game
            </Button>
            <Button
              onClick={() => setMode('join')}
              variant="secondary"
              className="w-full py-6 text-xl"
              size="lg"
            >
              Join Game
            </Button>
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Create New Game</h2>
            <CreateGame />
            <button
              onClick={() => setMode('choose')}
              className="mt-4 text-gray-400 hover:text-white text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Join Game</h2>
            <JoinGame />
            <button
              onClick={() => setMode('choose')}
              className="mt-4 text-gray-400 hover:text-white text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>All players must be on the same WiFi network</p>
        </div>
      </div>
    </div>
  );
}
