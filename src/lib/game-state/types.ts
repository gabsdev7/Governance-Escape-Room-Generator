/**
 * Game State Types
 * 
 * Defines the structure for game session state management.
 */

import { Scenario } from '@/lib/scenarios/types';
import { GradingResult } from '@/lib/grading/types';
import { HintResult } from '@/lib/hints/types';

/**
 * Game status states
 */
export type GameStatus = 'idle' | 'playing' | 'submitted' | 'results';

/**
 * The complete game state
 */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  /** The currently active scenario (null if not playing) */
  currentScenario: Scenario | null;
  /** IDs of controls the user has selected */
  selectedControlIds: string[];
  /** Number of hints used in this game */
  hintsUsed: number;
  /** History of hints received */
  hintHistory: HintResult[];
  /** Grading result (populated after submission) */
  gradingResult: GradingResult | null;
  /** When the game started */
  startedAt: string | null;
  /** When the user submitted */
  submittedAt: string | null;
}

/**
 * Actions that can be dispatched to update game state
 */
export type GameAction =
  | { type: 'START_GAME'; scenario: Scenario }
  | { type: 'SELECT_CONTROL'; controlId: string }
  | { type: 'DESELECT_CONTROL'; controlId: string }
  | { type: 'TOGGLE_CONTROL'; controlId: string }
  | { type: 'ADD_HINT'; hint: HintResult }
  | { type: 'SUBMIT_ANSWERS'; gradingResult: GradingResult }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };

/**
 * Initial game state
 */
export const initialGameState: GameState = {
  status: 'idle',
  currentScenario: null,
  selectedControlIds: [],
  hintsUsed: 0,
  hintHistory: [],
  gradingResult: null,
  startedAt: null,
  submittedAt: null,
};

/**
 * localStorage key for persisting game state
 */
export const GAME_STATE_STORAGE_KEY = 'governance-escape-room-state';
