'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { PlayerList } from './PlayerList';
import type { Game } from '@/types/game';

interface WaitingRoomProps {
  game: Game;
  currentPlayerId: string | null;
  onStartGame: () => void;
}

export function WaitingRoom({ game, currentPlayerId, onStartGame }: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);
  const isHost = game.players.find(p => p.id === currentPlayerId)?.isHost;
  const canStart = game.players.length >= 2;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(game.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-2">Share this code with friends</p>
        <div className="flex items-center justify-center gap-2">
          <div className="bg-gray-800 px-6 py-4 rounded-xl border-2 border-purple-600">
            <span className="text-4xl font-bold text-white tracking-widest">
              {game.roomCode}
            </span>
          </div>
          <Button variant="secondary" size="sm" onClick={copyRoomCode}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <PlayerList players={game.players} />

      {isHost && (
        <Button
          onClick={onStartGame}
          disabled={!canStart}
          className="w-full"
          size="lg"
        >
          {canStart ? 'Start Game' : 'Need at least 2 players'}
        </Button>
      )}

      {!isHost && (
        <div className="text-center text-gray-400 py-4">
          Waiting for host to start the game...
        </div>
      )}
    </div>
  );
}
