import { Scenario, ScenarioWithRubric, ScenarioRubric } from './types';
import { scenario1LeakySharepoint } from './scenario-1-leaky-sharepoint';
import { scenario2LabelLockdown } from './scenario-2-label-lockdown';
import { scenario3DlpTripwires } from './scenario-3-dlp-tripwires';
import { scenario4PromptInjection } from './scenario-4-prompt-injection';
import { scenario5ShadowConnector } from './scenario-5-shadow-connector';

export * from './types';

/**
 * All scenarios with their rubrics
 */
export const scenariosWithRubrics: ScenarioWithRubric[] = [
  scenario1LeakySharepoint,
  scenario2LabelLockdown,
  scenario3DlpTripwires,
  scenario4PromptInjection,
  scenario5ShadowConnector,
];

/**
 * All scenarios (without rubrics, for display)
 */
export const scenarios: Scenario[] = scenariosWithRubrics.map(
  ({ rubric: _rubric, ...scenario }) => scenario
);

/**
 * Scenario IDs as constants
 */
export const SCENARIO_IDS = {
  LEAKY_SHAREPOINT: 'scenario-1-leaky-sharepoint',
  LABEL_LOCKDOWN: 'scenario-2-label-lockdown',
  DLP_TRIPWIRES: 'scenario-3-dlp-tripwires',
  PROMPT_INJECTION: 'scenario-4-prompt-injection',
  SHADOW_CONNECTOR: 'scenario-5-shadow-connector',
} as const;

/**
 * Map of scenarios by ID for quick lookup
 */
const scenariosByIdMap = new Map<string, ScenarioWithRubric>(
  scenariosWithRubrics.map((s) => [s.id, s])
);

/**
 * Get all scenarios
 */
export function getAllScenarios(): Scenario[] {
  return scenarios;
}

/**
 * Get a scenario by ID (without rubric)
 */
export function getScenarioById(id: string): Scenario | undefined {
  const withRubric = scenariosByIdMap.get(id);
  if (!withRubric) return undefined;
  const { rubric: _rubric, ...scenario } = withRubric;
  return scenario;
}

/**
 * Get a scenario with its rubric by ID
 */
export function getScenarioWithRubricById(
  id: string
): ScenarioWithRubric | undefined {
  return scenariosByIdMap.get(id);
}

/**
 * Get the rubric for a scenario
 */
export function getRubricByScenarioId(
  scenarioId: string
): ScenarioRubric | undefined {
  const scenario = scenariosByIdMap.get(scenarioId);
  return scenario?.rubric;
}

/**
 * Select a random scenario (uniform distribution)
 */
export function selectRandomScenario(): Scenario {
  const index = Math.floor(Math.random() * scenarios.length);
  return scenarios[index];
}

/**
 * Select a random scenario with its rubric
 */
export function selectRandomScenarioWithRubric(): ScenarioWithRubric {
  const index = Math.floor(Math.random() * scenariosWithRubrics.length);
  return scenariosWithRubrics[index];
}

/**
 * Get scenario count
 */
export function getScenarioCount(): number {
  return scenarios.length;
}
