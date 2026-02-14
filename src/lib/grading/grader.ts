/**
 * Grading Engine
 * 
 * Deterministic rule-based grading for governance escape room submissions.
 * Scores are calculated based on:
 * - Required controls: 60 points total
 * - Recommended controls: 30 points total  
 * - Anti-pattern penalties: up to -20 points
 */

import {
  GradingResult,
  ControlFeedback,
  AdminRoleMapping,
  ScoreBreakdown,
  GRADING_CONFIG,
  GRADE_THRESHOLDS,
} from './types';
import { getRubricByScenarioId } from '@/lib/scenarios';
import { getControlById, AdminRoleLabels } from '@/lib/controls';

/**
 * Calculate the letter grade from a numeric score
 */
function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  if (score >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

/**
 * Grade a submission for a given scenario
 * 
 * @param scenarioId - The scenario being graded
 * @param selectedControlIds - Array of control IDs the user selected
 * @returns Complete grading result with score, feedback, and recommendations
 */
export function gradeSubmission(
  scenarioId: string,
  selectedControlIds: string[]
): GradingResult {
  const rubric = getRubricByScenarioId(scenarioId);
  
  if (!rubric) {
    throw new Error(`Rubric not found for scenario: ${scenarioId}`);
  }

  const selectedSet = new Set(selectedControlIds);

  // Calculate required controls coverage
  const requiredSelected = rubric.requiredControls.filter((id) =>
    selectedSet.has(id)
  );
  const requiredMissed = rubric.requiredControls.filter(
    (id) => !selectedSet.has(id)
  );

  // Calculate recommended controls coverage
  const recommendedSelected = rubric.recommendedControls.filter((id) =>
    selectedSet.has(id)
  );
  const recommendedMissed = rubric.recommendedControls.filter(
    (id) => !selectedSet.has(id)
  );

  // Calculate anti-pattern penalties
  const antiPatternSelected = rubric.antiPatternControls.filter((id) =>
    selectedSet.has(id)
  );

  // Points calculation
  const requiredPoints =
    rubric.requiredControls.length > 0
      ? (requiredSelected.length / rubric.requiredControls.length) *
        GRADING_CONFIG.REQUIRED_POINTS
      : GRADING_CONFIG.REQUIRED_POINTS;

  const recommendedPoints =
    rubric.recommendedControls.length > 0
      ? (recommendedSelected.length / rubric.recommendedControls.length) *
        GRADING_CONFIG.RECOMMENDED_POINTS
      : GRADING_CONFIG.RECOMMENDED_POINTS;

  const antiPatternPenalty = Math.min(
    antiPatternSelected.length * GRADING_CONFIG.ANTI_PATTERN_PENALTY,
    GRADING_CONFIG.MAX_ANTI_PATTERN_PENALTY
  );

  // Final score (clamped to 0-100)
  const rawScore = requiredPoints + recommendedPoints - antiPatternPenalty;
  const score = Math.max(
    GRADING_CONFIG.MIN_SCORE,
    Math.min(GRADING_CONFIG.MAX_SCORE, Math.round(rawScore))
  );

  // Build score breakdown
  const breakdown: ScoreBreakdown = {
    requiredCoverage: Math.round(requiredPoints),
    requiredMaxPoints: GRADING_CONFIG.REQUIRED_POINTS,
    recommendedCoverage: Math.round(recommendedPoints),
    recommendedMaxPoints: GRADING_CONFIG.RECOMMENDED_POINTS,
    antiPatternPenalty: -antiPatternPenalty,
    requiredSelected: requiredSelected.length,
    requiredTotal: rubric.requiredControls.length,
    recommendedSelected: recommendedSelected.length,
    recommendedTotal: rubric.recommendedControls.length,
    antiPatternSelected: antiPatternSelected.length,
  };

  // Build correct picks feedback
  const correctPicks: ControlFeedback[] = [
    ...requiredSelected,
    ...recommendedSelected,
  ].map((controlId) => {
    const control = getControlById(controlId);
    return {
      controlId,
      controlName: control?.name ?? controlId,
      rationale:
        rubric.controlRationales[controlId] ??
        'This is a relevant governance control for this scenario.',
    };
  });

  // Build missed picks feedback
  const missedPicks: ControlFeedback[] = [
    ...requiredMissed,
    ...recommendedMissed,
  ].map((controlId) => {
    const control = getControlById(controlId);
    return {
      controlId,
      controlName: control?.name ?? controlId,
      rationale:
        rubric.controlRationales[controlId] ??
        'This control would have helped address the scenario.',
      improvedApproach: rubric.improvedApproach,
    };
  });

  // Build unnecessary picks feedback (anti-patterns)
  const unnecessaryPicks: ControlFeedback[] = antiPatternSelected.map(
    (controlId) => {
      const control = getControlById(controlId);
      return {
        controlId,
        controlName: control?.name ?? controlId,
        rationale:
          rubric.controlRationales[controlId] ??
          'This control is not directly relevant to the scenario.',
      };
    }
  );

  // Build admin roles mapping for all correct picks
  const adminRoles: AdminRoleMapping[] = correctPicks
    .map((pick) => {
      const control = getControlById(pick.controlId);
      if (!control || control.adminRoles.length === 0) return null;
      return {
        controlId: pick.controlId,
        controlName: pick.controlName,
        requiredRoles: control.adminRoles,
        requiredRoleNames: control.adminRoles.map(
          (role) => AdminRoleLabels[role]
        ),
      };
    })
    .filter((mapping): mapping is AdminRoleMapping => mapping !== null);

  return {
    score,
    grade: calculateGrade(score),
    breakdown,
    correctPicks,
    missedPicks,
    unnecessaryPicks,
    gotchas: rubric.gotchas,
    improvedApproach: rubric.improvedApproach,
    adminRoles,
    adminRoleDisclaimer:
      'Verify specific role requirements in your tenant as custom roles or Privileged Identity Management may apply. Role requirements may change based on Microsoft updates.',
  };
}
