/**
 * Scenario Types
 * 
 * Defines the structure for governance escape room scenarios
 * and their associated scoring rubrics.
 */

/**
 * Difficulty levels for scenarios
 * MVP uses only 'standard'
 */
export type ScenarioDifficulty = 'standard';

/**
 * A governance escape room scenario
 */
export interface Scenario {
  /** Unique identifier for the scenario */
  id: string;
  /** Display title */
  title: string;
  /** Icon for display (emoji) */
  icon: string;
  /** Topic/theme of the scenario */
  topic: string;
  /** The narrative story (supports markdown) */
  story: string;
  /** What could go wrong - the risk statement */
  riskStatement: string;
  /** What "good" looks like - the governance objective */
  governanceObjective: string;
  /** Difficulty level (fixed for MVP) */
  difficulty: ScenarioDifficulty;
}

/**
 * Scoring rubric for a scenario
 */
export interface ScenarioRubric {
  /** Scenario this rubric applies to */
  scenarioId: string;
  /** Controls that must be selected for full credit */
  requiredControls: string[];
  /** Controls that are good but not essential */
  recommendedControls: string[];
  /** Controls that are incorrect or counterproductive */
  antiPatternControls: string[];
  /** Explanation for why each control is required/recommended/anti-pattern */
  controlRationales: Record<string, string>;
  /** Implementation gotchas for real-world deployment */
  gotchas: string[];
  /** Suggested improved approach text for feedback */
  improvedApproach: string;
}

/**
 * Combined scenario with its rubric
 */
export interface ScenarioWithRubric extends Scenario {
  rubric: ScenarioRubric;
}
