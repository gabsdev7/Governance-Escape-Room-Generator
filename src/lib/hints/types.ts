/**
 * Hint System Types
 * 
 * Defines the interface for hint providers and hint responses.
 */

import { ControlCategory } from '@/lib/controls/types';

/**
 * Context for requesting a hint
 */
export interface HintContext {
  /** The scenario being played */
  scenarioId: string;
  /** Optional: specific category to get hints about */
  category?: ControlCategory;
  /** Controls already selected (to avoid hinting about them) */
  selectedControlIds: string[];
  /** Number of hints already used */
  hintsUsed: number;
}

/**
 * Result from a hint request
 */
export interface HintResult {
  /** The hint text */
  hint: string;
  /** Where the hint came from */
  source: 'mcp' | 'local';
  /** Optional: link to learn more */
  learnMoreUrl?: string;
  /** Optional: category this hint relates to */
  category?: ControlCategory;
}

/**
 * Interface for hint providers
 */
export interface HintProvider {
  /** Get a hint for the given context */
  getHint(context: HintContext): Promise<HintResult>;
  /** Name of this provider */
  readonly name: string;
}

/**
 * Hint configuration
 */
export const HINT_CONFIG = {
  /** Maximum hints per game */
  MAX_HINTS_PER_GAME: 3,
  /** Timeout for MCP requests in milliseconds */
  MCP_TIMEOUT_MS: 5000,
} as const;
