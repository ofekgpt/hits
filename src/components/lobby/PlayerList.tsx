'use client';

import type { Player } from '@/types/game';

interface PlayerListProps {
  players: Player[];
  maxPlayers?: number;
}

export function PlayerList({ players, maxPlayers = 10 }: PlayerListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Players</span>
        <span>{players.length}/{maxPlayers}</span>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span className="flex-1 text-white font-medium">{player.name}</span>
            {player.isHost && (
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                Host
              </span>
            )}
          </div>
        ))}
        {players.length < 2 && (
          <div className="text-center text-gray-500 py-4 text-sm">
            Waiting for more players to join...
          </div>
        )}
      </div>
    </div>
  );
}
