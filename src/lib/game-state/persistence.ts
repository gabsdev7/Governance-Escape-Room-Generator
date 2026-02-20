/**
 * Game State Persistence
 * 
 * Utilities for saving/loading game state to/from localStorage.
 */

import { GameState, GAME_STATE_STORAGE_KEY, initialGameState } from './types';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(GAME_STATE_STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('[Persistence] Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const serialized = window.localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized) as GameState;
    
    // Validate the loaded state has expected shape
    if (!validateGameState(parsed)) {
      console.warn('[Persistence] Invalid saved state, ignoring');
      clearGameState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('[Persistence] Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear game state from localStorage
 */
export function clearGameState(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.removeItem(GAME_STATE_STORAGE_KEY);
  } catch (error) {
    console.warn('[Persistence] Failed to clear game state:', error);
  }
}

/**
 * Validate that a loaded state has the expected shape
 */
function validateGameState(state: unknown): state is GameState {
  if (!state || typeof state !== 'object') return false;

  const s = state as Record<string, unknown>;

  // Check required fields exist
  if (typeof s.status !== 'string') return false;
  if (!['idle', 'playing', 'scenario-complete', 'submitted', 'results'].includes(s.status)) return false;
  if (!Array.isArray(s.selectedControlIds)) return false;
  if (typeof s.hintsUsed !== 'number') return false;

  return true;
}

/**
 * Merge loaded state with initial state to handle schema changes
 */
export function mergeWithInitialState(
  loaded: GameState | null
): GameState {
  if (!loaded) return initialGameState;

  return {
    ...initialGameState,
    ...loaded,
    // Ensure arrays are present
    scenarios: loaded.scenarios ?? [],
    currentScenarioIndex: loaded.currentScenarioIndex ?? 0,
    selectedControlIds: loaded.selectedControlIds ?? [],
    hintHistory: loaded.hintHistory ?? [],
    scenarioResults: loaded.scenarioResults ?? [],
  };
}
