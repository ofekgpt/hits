'use client';

import { Button } from '../ui/Button';
import type { Player } from '@/types/game';

interface TokenActionsProps {
  player: Player | null;
  isCurrentPlayer: boolean;
  phase: string;
  onSkip: () => void;
  onFreeCard: () => void;
}

export function TokenActions({ player, isCurrentPlayer, phase, onSkip, onFreeCard }: TokenActionsProps) {
  if (!player || !isCurrentPlayer) return null;

  const canSkip = player.tokens >= 1 && (phase === 'PLAYING_SONG' || phase === 'PLACING_CARD');
  const canFreeCard = player.tokens >= 3 && phase === 'PLACING_CARD';

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={onSkip}
        disabled={!canSkip}
        className="flex-1"
      >
        Skip (1 token)
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onFreeCard}
        disabled={!canFreeCard}
        className="flex-1"
      >
        Free Card (3 tokens)
      </Button>
    </div>
  );
}
