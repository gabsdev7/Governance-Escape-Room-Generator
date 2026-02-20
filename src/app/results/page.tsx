'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/Button';
import {
  ScoreDisplay,
  FeedbackSection,
  GotchasSection,
  AdminRolesTable,
} from '@/components/results';
import { ScenarioSessionResult } from '@/lib/game-state/types';

export default function ResultsPage() {
  const router = useRouter();
  const { state, resetGame } = useGameState();

  // Redirect to home if no results
  useEffect(() => {
    if (state.scenarioResults.length === 0 && state.status !== 'results') {
      router.push('/');
    }
  }, [state.scenarioResults.length, state.status, router]);

  const handlePlayAgain = () => {
    resetGame();
    router.push('/');
  };

  // Compute aggregate stats
  const aggregateStats = useMemo(() => {
    const results = state.scenarioResults;
    if (results.length === 0) return null;

    const totalScore = results.reduce(
      (sum, r) => sum + r.gradingResult.score,
      0
    );
    const avgScore = Math.round(totalScore / results.length);
    const totalHints = results.reduce((sum, r) => sum + r.hintsUsed, 0);
    const totalCorrect = results.reduce(
      (sum, r) => sum + r.gradingResult.correctPicks.length,
      0
    );
    const totalMissed = results.reduce(
      (sum, r) => sum + r.gradingResult.missedPicks.length,
      0
    );
    const totalControls = results.reduce(
      (sum, r) => sum + r.selectedControlIds.length,
      0
    );

    return {
      avgScore,
      totalScore,
      totalHints,
      totalCorrect,
      totalMissed,
      totalControls,
      scenarioCount: results.length,
    };
  }, [state.scenarioResults]);

  if (state.scenarioResults.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🏆</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Final Results
        </h1>
        <p className="text-slate-600">
          You completed all {aggregateStats?.scenarioCount} governance challenges!
        </p>
      </div>

      {/* Overall score */}
      {aggregateStats && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div
                className={`
                  w-32 h-32 rounded-full flex items-center justify-center
                  ${aggregateStats.avgScore >= 90 ? 'bg-gradient-to-br from-success-400 to-success-600' : ''}
                  ${aggregateStats.avgScore >= 70 && aggregateStats.avgScore < 90 ? 'bg-gradient-to-br from-primary-400 to-primary-600' : ''}
                  ${aggregateStats.avgScore >= 50 && aggregateStats.avgScore < 70 ? 'bg-gradient-to-br from-warning-400 to-warning-600' : ''}
                  ${aggregateStats.avgScore < 50 ? 'bg-gradient-to-br from-danger-400 to-danger-600' : ''}
                `}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {aggregateStats.avgScore}
                  </div>
                  <div className="text-sm text-white/80">avg score</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Overall Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary-600">
                    {aggregateStats.totalControls}
                  </p>
                  <p className="text-sm text-slate-600">Controls Selected</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-600">
                    {aggregateStats.totalCorrect}
                  </p>
                  <p className="text-sm text-slate-600">Correct Picks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-600">
                    {aggregateStats.totalMissed}
                  </p>
                  <p className="text-sm text-slate-600">Missed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-600">
                    {aggregateStats.totalHints}
                  </p>
                  <p className="text-sm text-slate-600">Hints Used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-scenario results */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Scenario Breakdown
      </h2>

      <div className="space-y-6">
        {state.scenarioResults.map(
          (scenarioResult: ScenarioSessionResult, index: number) => {
            const result = scenarioResult.gradingResult;
            return (
              <details
                key={scenarioResult.scenario.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group"
              >
                <summary className="cursor-pointer p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${result.score >= 90 ? 'bg-success-100' : ''}
                      ${result.score >= 70 && result.score < 90 ? 'bg-primary-100' : ''}
                      ${result.score >= 50 && result.score < 70 ? 'bg-warning-100' : ''}
                      ${result.score < 50 ? 'bg-danger-100' : ''}
                    `}
                  >
                    <span className="text-2xl">
                      {scenarioResult.scenario.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {index + 1}. {scenarioResult.scenario.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {scenarioResult.scenario.topic}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className={`
                        text-2xl font-bold
                        ${result.score >= 90 ? 'text-success-600' : ''}
                        ${result.score >= 70 && result.score < 90 ? 'text-primary-600' : ''}
                        ${result.score >= 50 && result.score < 70 ? 'text-warning-600' : ''}
                        ${result.score < 50 ? 'text-danger-600' : ''}
                      `}
                    >
                      {result.score}
                    </div>
                    <div className="text-xs text-slate-500">
                      Grade {result.grade}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <div className="px-6 pb-6 space-y-6 border-t border-slate-100 pt-6">
                  {/* Score display */}
                  <ScoreDisplay result={result} />

                  {/* Feedback */}
                  <FeedbackSection
                    correctPicks={result.correctPicks}
                    missedPicks={result.missedPicks}
                    unnecessaryPicks={result.unnecessaryPicks}
                    improvedApproach={result.improvedApproach}
                  />

                  {/* Gotchas */}
                  <GotchasSection gotchas={result.gotchas} />

                  {/* Admin roles */}
                  <AdminRolesTable
                    adminRoles={result.adminRoles}
                    disclaimer={result.adminRoleDisclaimer}
                  />
                </div>
              </details>
            );
          }
        )}
      </div>

      {/* Actions */}
      <div className="text-center space-y-4 mt-12">
        <Button variant="primary" size="lg" onClick={handlePlayAgain}>
          Play Again
        </Button>
        <p className="text-sm text-slate-500">
          Try all five challenges again to improve your scores!
        </p>
      </div>

      {/* Game stats */}
      <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Session Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {state.scenarioResults.length}
            </p>
            <p className="text-sm text-slate-600">Challenges Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-600">
              {aggregateStats?.totalHints ?? 0}
            </p>
            <p className="text-sm text-slate-600">Total Hints Used</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success-600">
              {aggregateStats?.totalCorrect ?? 0}
            </p>
            <p className="text-sm text-slate-600">Total Correct Picks</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-600">
              {state.startedAt && state.submittedAt
                ? formatDuration(
                    new Date(state.submittedAt).getTime() -
                      new Date(state.startedAt).getTime()
                  )
                : '-'}
            </p>
            <p className="text-sm text-slate-600">Total Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}
