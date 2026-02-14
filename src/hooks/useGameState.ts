/**
 * useGameState Hook
 * 
 * Convenience hook that wraps the game state context
 * with a simpler API.
 */

import { useGameStateContext } from '@/lib/game-state/context';

export function useGameState() {
  const context = useGameStateContext();
  return context;
}
