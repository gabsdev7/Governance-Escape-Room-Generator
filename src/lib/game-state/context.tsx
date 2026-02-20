'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  GameState,
  GameAction,
  initialGameState,
} from './types';
import {
  saveGameState,
  loadGameState,
  clearGameState,
  mergeWithInitialState,
} from './persistence';
import { getAllScenarios } from '@/lib/scenarios';
import { gradeSubmission, GradingResult } from '@/lib/grading';
import { HintResult } from '@/lib/hints/types';

/**
 * Shuffle an array using Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Game state reducer
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const scenarios = action.scenarios;
      return {
        ...initialGameState,
        status: 'playing',
        scenarios,
        currentScenarioIndex: 0,
        currentScenario: scenarios[0] ?? null,
        startedAt: new Date().toISOString(),
      };
    }

    case 'SELECT_CONTROL':
      if (state.selectedControlIds.includes(action.controlId)) {
        return state; // Already selected
      }
      return {
        ...state,
        selectedControlIds: [...state.selectedControlIds, action.controlId],
      };

    case 'DESELECT_CONTROL':
      return {
        ...state,
        selectedControlIds: state.selectedControlIds.filter(
          (id) => id !== action.controlId
        ),
      };

    case 'TOGGLE_CONTROL':
      if (state.selectedControlIds.includes(action.controlId)) {
        return {
          ...state,
          selectedControlIds: state.selectedControlIds.filter(
            (id) => id !== action.controlId
          ),
        };
      }
      return {
        ...state,
        selectedControlIds: [...state.selectedControlIds, action.controlId],
      };

    case 'ADD_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        hintHistory: [...state.hintHistory, action.hint],
      };

    case 'SUBMIT_ANSWERS': {
      const isLastScenario =
        state.currentScenarioIndex >= state.scenarios.length - 1;

      const scenarioResult = {
        scenario: state.currentScenario!,
        selectedControlIds: [...state.selectedControlIds],
        gradingResult: action.gradingResult,
        hintsUsed: state.hintsUsed,
      };

      return {
        ...state,
        status: isLastScenario ? 'results' : 'scenario-complete',
        gradingResult: action.gradingResult,
        scenarioResults: [...state.scenarioResults, scenarioResult],
        submittedAt: new Date().toISOString(),
      };
    }

    case 'ADVANCE_SCENARIO': {
      const nextIndex = state.currentScenarioIndex + 1;
      if (nextIndex >= state.scenarios.length) {
        return { ...state, status: 'results' };
      }
      return {
        ...state,
        status: 'playing',
        currentScenarioIndex: nextIndex,
        currentScenario: state.scenarios[nextIndex],
        selectedControlIds: [],
        hintsUsed: 0,
        hintHistory: [],
        gradingResult: null,
      };
    }

    case 'RESET_GAME':
      return initialGameState;

    case 'RESTORE_STATE':
      return action.state;

    default:
      return state;
  }
}

/**
 * Context value type
 */
interface GameStateContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Convenience actions
  startGame: () => void;
  selectControl: (controlId: string) => void;
  deselectControl: (controlId: string) => void;
  toggleControl: (controlId: string) => void;
  addHint: (hint: HintResult) => void;
  submitAnswers: () => GradingResult | null;
  advanceScenario: () => void;
  resetGame: () => void;
  // Computed values
  isPlaying: boolean;
  isScenarioComplete: boolean;
  hasResults: boolean;
  canSubmit: boolean;
  totalScenarios: number;
  currentScenarioNumber: number;
  isLastScenario: boolean;
}

const GameStateContext = createContext<GameStateContextValue | null>(null);

/**
 * Game State Provider
 */
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      const mergedState = mergeWithInitialState(savedState);
      // Only restore if there's an active game
      if (
        (mergedState.status === 'playing' || mergedState.status === 'scenario-complete') &&
        mergedState.currentScenario
      ) {
        dispatch({ type: 'RESTORE_STATE', state: mergedState });
      }
    }
  }, []);

  // Save state on every change
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Convenience actions
  const startGame = useCallback(() => {
    const allScenarios = getAllScenarios();
    const shuffled = shuffleArray(allScenarios);
    dispatch({ type: 'START_GAME', scenarios: shuffled });
  }, []);

  const selectControl = useCallback((controlId: string) => {
    dispatch({ type: 'SELECT_CONTROL', controlId });
  }, []);

  const deselectControl = useCallback((controlId: string) => {
    dispatch({ type: 'DESELECT_CONTROL', controlId });
  }, []);

  const toggleControl = useCallback((controlId: string) => {
    dispatch({ type: 'TOGGLE_CONTROL', controlId });
  }, []);

  const addHint = useCallback((hint: HintResult) => {
    dispatch({ type: 'ADD_HINT', hint });
  }, []);

  const submitAnswers = useCallback((): GradingResult | null => {
    if (!state.currentScenario) return null;
    if (state.selectedControlIds.length === 0) return null;

    const result = gradeSubmission(
      state.currentScenario.id,
      state.selectedControlIds
    );
    dispatch({ type: 'SUBMIT_ANSWERS', gradingResult: result });
    return result;
  }, [state.currentScenario, state.selectedControlIds]);

  const advanceScenario = useCallback(() => {
    dispatch({ type: 'ADVANCE_SCENARIO' });
  }, []);

  const resetGame = useCallback(() => {
    clearGameState();
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Computed values
  const isPlaying = state.status === 'playing';
  const isScenarioComplete = state.status === 'scenario-complete';
  const hasResults = state.status === 'results' && state.scenarioResults.length > 0;
  const canSubmit = isPlaying && state.selectedControlIds.length > 0;
  const totalScenarios = state.scenarios.length;
  const currentScenarioNumber = state.currentScenarioIndex + 1;
  const isLastScenario = state.currentScenarioIndex >= state.scenarios.length - 1;

  const value: GameStateContextValue = {
    state,
    dispatch,
    startGame,
    selectControl,
    deselectControl,
    toggleControl,
    addHint,
    submitAnswers,
    advanceScenario,
    resetGame,
    isPlaying,
    isScenarioComplete,
    hasResults,
    canSubmit,
    totalScenarios,
    currentScenarioNumber,
    isLastScenario,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

/**
 * Hook to access game state context
 */
export function useGameStateContext(): GameStateContextValue {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error(
      'useGameStateContext must be used within a GameStateProvider'
    );
  }
  return context;
}
