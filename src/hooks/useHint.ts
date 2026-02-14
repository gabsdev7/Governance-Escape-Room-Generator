'use client';

import { useState, useCallback } from 'react';
import { useGameState } from './useGameState';
import { HintResult, HINT_CONFIG, HintContext } from '@/lib/hints/types';
import { ControlCategory } from '@/lib/controls/types';

interface UseHintReturn {
  /** Request a new hint */
  requestHint: (category?: ControlCategory) => Promise<HintResult | null>;
  /** Current hint (most recent) */
  currentHint: HintResult | null;
  /** All hints received this game */
  hintHistory: HintResult[];
  /** Number of hints remaining */
  hintsRemaining: number;
  /** Whether a hint request is in progress */
  isLoading: boolean;
  /** Error message if last request failed */
  error: string | null;
  /** Whether more hints are available */
  canRequestHint: boolean;
}

/**
 * Hook for requesting and managing hints
 */
export function useHint(): UseHintReturn {
  const { state, addHint } = useGameState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hintsRemaining = HINT_CONFIG.MAX_HINTS_PER_GAME - state.hintsUsed;
  const canRequestHint = hintsRemaining > 0 && state.status === 'playing';

  const currentHint =
    state.hintHistory.length > 0
      ? state.hintHistory[state.hintHistory.length - 1]
      : null;

  const requestHint = useCallback(
    async (category?: ControlCategory): Promise<HintResult | null> => {
      if (!canRequestHint || !state.currentScenario) {
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const context: HintContext = {
          scenarioId: state.currentScenario.id,
          category,
          selectedControlIds: state.selectedControlIds,
          hintsUsed: state.hintsUsed,
        };

        const response = await fetch('/api/hints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(context),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error ?? 'Failed to get hint');
        }

        const hint: HintResult = await response.json();
        addHint(hint);
        return hint;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get hint';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [canRequestHint, state.currentScenario, state.selectedControlIds, state.hintsUsed, addHint]
  );

  return {
    requestHint,
    currentHint,
    hintHistory: state.hintHistory,
    hintsRemaining,
    isLoading,
    error,
    canRequestHint,
  };
}
