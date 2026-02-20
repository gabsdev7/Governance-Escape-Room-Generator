/**
 * Grading Engine Types
 * 
 * Defines the structure for grading results and feedback
 */

import { AdminRole } from '@/lib/controls/types';

/**
 * Feedback for a single control selection
 */
export interface ControlFeedback {
  /** The control ID */
  controlId: string;
  /** The control display name */
  controlName: string;
  /** Why this control is correct/incorrect */
  rationale: string;
  /** Suggested improvement (for missed picks) */
  improvedApproach?: string;
}

/**
 * Admin role mapping for a control
 */
export interface AdminRoleMapping {
  /** The control ID */
  controlId: string;
  /** The control display name */
  controlName: string;
  /** Admin roles required to implement this control */
  requiredRoles: AdminRole[];
  /** Role display names */
  requiredRoleNames: string[];
}

/**
 * Score breakdown by category
 */
export interface ScoreBreakdown {
  /** Points earned from required controls (0-70) */
  requiredCoverage: number;
  /** Maximum points possible for required controls */
  requiredMaxPoints: number;
  /** Points earned from recommended controls (0-30) */
  recommendedCoverage: number;
  /** Maximum points possible for recommended controls */
  recommendedMaxPoints: number;
  /** Points deducted for anti-patterns (0 to -20) */
  antiPatternPenalty: number;
  /** Number of required controls selected */
  requiredSelected: number;
  /** Total number of required controls */
  requiredTotal: number;
  /** Number of recommended controls selected */
  recommendedSelected: number;
  /** Total number of recommended controls */
  recommendedTotal: number;
  /** Number of anti-pattern controls selected */
  antiPatternSelected: number;
}

/**
 * The complete grading result
 */
export interface GradingResult {
  /** Overall score 0-100 */
  score: number;
  /** Letter grade */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Detailed score breakdown */
  breakdown: ScoreBreakdown;
  /** Controls that were correctly selected */
  correctPicks: ControlFeedback[];
  /** Required/recommended controls that were missed */
  missedPicks: ControlFeedback[];
  /** Controls that were selected but are anti-patterns */
  unnecessaryPicks: ControlFeedback[];
  /** Implementation gotchas */
  gotchas: string[];
  /** Suggested improved approach */
  improvedApproach: string;
  /** Required admin roles mapped to selected controls */
  adminRoles: AdminRoleMapping[];
  /** Standard disclaimer about admin roles */
  adminRoleDisclaimer: string;
}

/**
 * Grading configuration constants
 */
export const GRADING_CONFIG = {
  /** Points allocated to required controls */
  REQUIRED_POINTS: 70,
  /** Points allocated to recommended controls */
  RECOMMENDED_POINTS: 30,
  /** Penalty per anti-pattern selection */
  ANTI_PATTERN_PENALTY: 4,
  /** Maximum anti-pattern penalty */
  MAX_ANTI_PATTERN_PENALTY: 20,
  /** Minimum possible score */
  MIN_SCORE: 0,
  /** Maximum possible score */
  MAX_SCORE: 100,
} as const;

/**
 * Grade thresholds
 */
export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
} as const;
