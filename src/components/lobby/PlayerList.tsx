'use client';

import type { Player } from '@/types/game';

interface PlayerListProps {
  players: Player[];
  maxPlayers?: number;
}

export function PlayerList({ players, maxPlayers = 10 }: PlayerListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>Players</span>
        <span>{players.length}/{maxPlayers}</span>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 glass-panel rounded-xl"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: player.color,
                boxShadow: `0 0 8px ${player.color}80`,
              }}
            />
            <span className="flex-1 text-text-primary font-medium">{player.name}</span>
            {player.isHost && (
              <span className="text-xs bg-neon-cyan/15 text-neon-cyan px-2.5 py-0.5 rounded-lg border border-neon-cyan/25 font-bold">
                Host
              </span>
            )}
          </div>
        ))}
        {players.length < 2 && (
          <div className="text-center text-text-dim py-4 text-sm">
            Waiting for more players to join...
          </div>
        )}
      </div>
    </div>
  );
}
