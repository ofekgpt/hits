import type { PlacedCard, Song } from '@/types/game';

// Check if a card placement is valid (sorted by year)
export function isValidPlacement(timeline: PlacedCard[], newCard: Song, position: number): boolean {
  if (timeline.length === 0) {
    return true;
  }

  const newTimeline = [...timeline];
  newTimeline.splice(position, 0, newCard as PlacedCard);

  // Check if timeline is sorted by year
  for (let i = 0; i < newTimeline.length - 1; i++) {
    if (newTimeline[i].year > newTimeline[i + 1].year) {
      return false;
    }
  }

  return true;
}

// Get valid placement positions for a card
export function getValidPositions(timeline: PlacedCard[], cardYear: number): number[] {
  if (timeline.length === 0) {
    return [0];
  }

  const positions: number[] = [];

  // Check each possible position
  for (let i = 0; i <= timeline.length; i++) {
    const leftYear = i > 0 ? timeline[i - 1].year : -Infinity;
    const rightYear = i < timeline.length ? timeline[i].year : Infinity;

    if (cardYear >= leftYear && cardYear <= rightYear) {
      positions.push(i);
    }
  }

  return positions;
}

// Check win condition
export function checkWinCondition(cardsCount: number, targetCards: number = 10): boolean {
  return cardsCount >= targetCards;
}

// Token costs
export const TOKEN_COSTS = {
  SKIP: 1,
  CHALLENGE: 1,
  FREE_CARD: 3,
} as const;

// Check if player can afford action
export function canAffordAction(tokens: number, action: keyof typeof TOKEN_COSTS): boolean {
  return tokens >= TOKEN_COSTS[action];
}
