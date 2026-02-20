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
export type GameStatus = 'idle' | 'playing' | 'scenario-complete' | 'submitted' | 'results';

/**
 * Result for a single completed scenario within a session
 */
export interface ScenarioSessionResult {
  /** The scenario that was played */
  scenario: Scenario;
  /** Controls selected for this scenario */
  selectedControlIds: string[];
  /** Grading result for this scenario */
  gradingResult: GradingResult;
  /** Number of hints used for this scenario */
  hintsUsed: number;
}

/**
 * The complete game state
 */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  /** All scenarios in play order for this session */
  scenarios: Scenario[];
  /** Index of the current scenario (0-based) */
  currentScenarioIndex: number;
  /** The currently active scenario (null if not playing) */
  currentScenario: Scenario | null;
  /** IDs of controls the user has selected for the current scenario */
  selectedControlIds: string[];
  /** Number of hints used for the current scenario */
  hintsUsed: number;
  /** History of hints received for the current scenario */
  hintHistory: HintResult[];
  /** Grading result for the current/latest scenario */
  gradingResult: GradingResult | null;
  /** Completed scenario results */
  scenarioResults: ScenarioSessionResult[];
  /** When the game started */
  startedAt: string | null;
  /** When the user submitted */
  submittedAt: string | null;
}

/**
 * Actions that can be dispatched to update game state
 */
export type GameAction =
  | { type: 'START_GAME'; scenarios: Scenario[] }
  | { type: 'SELECT_CONTROL'; controlId: string }
  | { type: 'DESELECT_CONTROL'; controlId: string }
  | { type: 'TOGGLE_CONTROL'; controlId: string }
  | { type: 'ADD_HINT'; hint: HintResult }
  | { type: 'SUBMIT_ANSWERS'; gradingResult: GradingResult }
  | { type: 'ADVANCE_SCENARIO' }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };

/**
 * Initial game state
 */
export const initialGameState: GameState = {
  status: 'idle',
  scenarios: [],
  currentScenarioIndex: 0,
  currentScenario: null,
  selectedControlIds: [],
  hintsUsed: 0,
  hintHistory: [],
  gradingResult: null,
  scenarioResults: [],
  startedAt: null,
  submittedAt: null,
};

/**
 * localStorage key for persisting game state
 */
export const GAME_STATE_STORAGE_KEY = 'governance-escape-room-state';
