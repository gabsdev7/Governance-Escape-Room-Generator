/**
 * Grading Engine Tests
 */

import { gradeSubmission } from '@/lib/grading/grader';
import { GRADING_CONFIG } from '@/lib/grading/types';
import { SCENARIO_IDS } from '@/lib/scenarios';

describe('Grading Engine', () => {
  const scenarioId = SCENARIO_IDS.LEAKY_SHAREPOINT;

  // Scenario 1 rubric:
  // Required: least-privilege-access, sharepoint-permissions-audit, site-collection-scoping
  // Recommended: restricted-sharepoint-search, audit-logging
  // Anti-patterns: mfa-enforcement, connector-allowlist, prompt-hardening

  describe('gradeSubmission', () => {
    it('should return a perfect score when all required and recommended controls are selected', () => {
      const selectedControls = [
        'least-privilege-access',
        'sharepoint-permissions-audit',
        'site-collection-scoping',
        'restricted-sharepoint-search',
        'audit-logging',
      ];

      const result = gradeSubmission(scenarioId, selectedControls);

      expect(result.score).toBe(100);
      expect(result.grade).toBe('A');
      expect(result.breakdown.requiredSelected).toBe(3);
      expect(result.breakdown.requiredTotal).toBe(3);
      expect(result.breakdown.recommendedSelected).toBe(2);
      expect(result.breakdown.recommendedTotal).toBe(2);
      expect(result.breakdown.antiPatternSelected).toBe(0);
    });

    it('should return 0 when no controls are selected', () => {
      const result = gradeSubmission(scenarioId, []);

      expect(result.score).toBe(0);
      expect(result.grade).toBe('F');
      expect(result.breakdown.requiredSelected).toBe(0);
      expect(result.breakdown.recommendedSelected).toBe(0);
      expect(result.correctPicks).toHaveLength(0);
      expect(result.missedPicks.length).toBeGreaterThan(0);
    });

    it('should calculate partial score for partial required controls', () => {
      // Select 1 of 3 required controls = 70 * (1/3) = 23 points (rounded)
      const selectedControls = ['least-privilege-access'];

      const result = gradeSubmission(scenarioId, selectedControls);

      expect(result.breakdown.requiredSelected).toBe(1);
      expect(result.breakdown.requiredCoverage).toBe(23); // 70/3 = 23 (rounded)
      expect(result.breakdown.recommendedCoverage).toBe(0);
      expect(result.score).toBe(23);
    });

    it('should apply anti-pattern penalties', () => {
      // Select required but also anti-patterns
      const selectedControls = [
        'least-privilege-access',
        'sharepoint-permissions-audit',
        'site-collection-scoping',
        'mfa-enforcement', // anti-pattern
        'connector-allowlist', // anti-pattern
      ];

      const result = gradeSubmission(scenarioId, selectedControls);

      // 70 (required) - 8 (2 anti-patterns * 4) = 62
      expect(result.breakdown.requiredCoverage).toBe(70);
      expect(result.breakdown.antiPatternSelected).toBe(2);
      expect(result.breakdown.antiPatternPenalty).toBe(-8);
      expect(result.score).toBe(62);
      expect(result.unnecessaryPicks).toHaveLength(2);
    });

    it('should cap anti-pattern penalty at maximum', () => {
      const selectedControls = [
        'mfa-enforcement',
        'connector-allowlist',
        'prompt-hardening',
        // Add more if there were more anti-patterns
      ];

      const result = gradeSubmission(scenarioId, selectedControls);

      // 3 anti-patterns * 4 = 12 penalty
      expect(result.breakdown.antiPatternPenalty).toBe(-12);
      // Score should be clamped to 0 minimum
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should clamp score to 0-100 range', () => {
      // Even with many anti-patterns, score shouldn't go below 0
      const result = gradeSubmission(scenarioId, [
        'mfa-enforcement',
        'connector-allowlist',
        'prompt-hardening',
      ]);

      expect(result.score).toBeGreaterThanOrEqual(GRADING_CONFIG.MIN_SCORE);
      expect(result.score).toBeLessThanOrEqual(GRADING_CONFIG.MAX_SCORE);
    });

    it('should include rationales in feedback', () => {
      const selectedControls = ['least-privilege-access', 'mfa-enforcement'];

      const result = gradeSubmission(scenarioId, selectedControls);

      // Check correct pick has rationale
      const correctPick = result.correctPicks.find(
        (p) => p.controlId === 'least-privilege-access'
      );
      expect(correctPick).toBeDefined();
      expect(correctPick?.rationale).toBeTruthy();

      // Check anti-pattern has rationale
      const antiPattern = result.unnecessaryPicks.find(
        (p) => p.controlId === 'mfa-enforcement'
      );
      expect(antiPattern).toBeDefined();
      expect(antiPattern?.rationale).toContain('ANTI-PATTERN');
    });

    it('should include gotchas in result', () => {
      const result = gradeSubmission(scenarioId, []);

      expect(result.gotchas).toBeDefined();
      expect(result.gotchas.length).toBeGreaterThan(0);
    });

    it('should include admin role mappings for correct picks', () => {
      const selectedControls = ['least-privilege-access'];
      const result = gradeSubmission(scenarioId, selectedControls);

      expect(result.adminRoles.length).toBeGreaterThan(0);
      expect(result.adminRoles[0].requiredRoles).toBeDefined();
      expect(result.adminRoles[0].requiredRoleNames).toBeDefined();
    });

    it('should include admin role disclaimer', () => {
      const result = gradeSubmission(scenarioId, []);
      
      expect(result.adminRoleDisclaimer).toBeTruthy();
      expect(result.adminRoleDisclaimer).toContain('Verify');
    });

    it('should assign correct letter grades', () => {
      // Test grade thresholds
      const testCases = [
        { expected: 'A', controls: ['least-privilege-access', 'sharepoint-permissions-audit', 'site-collection-scoping', 'restricted-sharepoint-search', 'audit-logging'] },
        { expected: 'F', controls: [] },
      ];

      testCases.forEach(({ expected, controls }) => {
        const result = gradeSubmission(scenarioId, controls);
        expect(result.grade).toBe(expected);
      });
    });

    it('should throw error for invalid scenario ID', () => {
      expect(() => {
        gradeSubmission('invalid-scenario', []);
      }).toThrow('Rubric not found');
    });
  });
});
