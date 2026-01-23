'use client';

import { PlayerTimeline } from './PlayerTimeline';
import type { Game, Player } from '@/types/game';

interface AllTimelinesProps {
  game: Game;
  currentPlayerId: string | null;
  onPlaceCard?: (position: number) => void;
}

export function AllTimelines({ game, currentPlayerId, onPlaceCard }: AllTimelinesProps) {
  const currentPlayer = game.players[game.currentPlayerIndex];
  const currentDj = game.players[game.currentDjIndex];
  const isCurrentPlayerTurn = currentPlayer?.id === currentPlayerId;
  const canPlace = game.phase === 'PLACING_CARD' && isCurrentPlayerTurn;

  return (
    <div className="space-y-3 overflow-y-auto">
      {game.players.map((player) => (
        <PlayerTimeline
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayer?.id}
          isDj={player.id === currentDj?.id}
          showPlacementSlots={canPlace && player.id === currentPlayerId}
          onPlaceCard={player.id === currentPlayerId ? onPlaceCard : undefined}
        />
      ))}
    </div>
  );
}
