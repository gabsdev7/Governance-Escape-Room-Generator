/**
 * Scenario Selector Tests
 */

import {
  selectRandomScenario,
  getAllScenarios,
  getScenarioById,
  SCENARIO_IDS,
} from '@/lib/scenarios';

describe('Scenario Selector', () => {
  describe('getAllScenarios', () => {
    it('should return exactly 5 scenarios', () => {
      const scenarios = getAllScenarios();
      expect(scenarios).toHaveLength(5);
    });

    it('should return scenarios with all required fields', () => {
      const scenarios = getAllScenarios();

      scenarios.forEach((scenario) => {
        expect(scenario.id).toBeTruthy();
        expect(scenario.title).toBeTruthy();
        expect(scenario.icon).toBeTruthy();
        expect(scenario.topic).toBeTruthy();
        expect(scenario.story).toBeTruthy();
        expect(scenario.riskStatement).toBeTruthy();
        expect(scenario.governanceObjective).toBeTruthy();
        expect(scenario.difficulty).toBe('standard');
      });
    });
  });

  describe('getScenarioById', () => {
    it('should return scenario for valid ID', () => {
      const scenario = getScenarioById(SCENARIO_IDS.LEAKY_SHAREPOINT);
      
      expect(scenario).toBeDefined();
      expect(scenario?.id).toBe(SCENARIO_IDS.LEAKY_SHAREPOINT);
      expect(scenario?.title).toBe('The Leaky SharePoint Library');
    });

    it('should return undefined for invalid ID', () => {
      const scenario = getScenarioById('invalid-id');
      expect(scenario).toBeUndefined();
    });

    it('should be accessible for all defined scenario IDs', () => {
      Object.values(SCENARIO_IDS).forEach((id) => {
        const scenario = getScenarioById(id);
        expect(scenario).toBeDefined();
        expect(scenario?.id).toBe(id);
      });
    });
  });

  describe('selectRandomScenario', () => {
    it('should return a valid scenario', () => {
      const scenario = selectRandomScenario();
      
      expect(scenario).toBeDefined();
      expect(scenario.id).toBeTruthy();
      expect(scenario.title).toBeTruthy();
    });

    it('should produce a roughly uniform distribution over many runs', () => {
      const runs = 1000;
      const counts: Record<string, number> = {};

      for (let i = 0; i < runs; i++) {
        const scenario = selectRandomScenario();
        counts[scenario.id] = (counts[scenario.id] ?? 0) + 1;
      }

      const scenarioIds = Object.keys(counts);
      expect(scenarioIds).toHaveLength(5);

      // Each scenario should appear between 10% and 30% of the time
      // (expected is 20% = 200 per scenario for 1000 runs)
      const minExpected = runs * 0.10; // 100
      const maxExpected = runs * 0.30; // 300

      scenarioIds.forEach((id) => {
        const count = counts[id];
        expect(count).toBeGreaterThanOrEqual(minExpected);
        expect(count).toBeLessThanOrEqual(maxExpected);
      });
    });

    it('should return scenarios without rubric data', () => {
      // Ensure the public scenario object doesn't leak rubric data
      const scenario = selectRandomScenario();
      
      // Type check: scenario should not have 'rubric' property
      expect((scenario as Record<string, unknown>).rubric).toBeUndefined();
    });
  });
});
