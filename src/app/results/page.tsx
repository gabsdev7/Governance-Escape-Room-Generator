'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/Button';
import {
  ScoreDisplay,
  FeedbackSection,
  GotchasSection,
  AdminRolesTable,
} from '@/components/results';

export default function ResultsPage() {
  const router = useRouter();
  const { state, resetGame } = useGameState();

  // Redirect to home if no results
  useEffect(() => {
    if (!state.gradingResult || state.status !== 'results') {
      router.push('/');
    }
  }, [state.gradingResult, state.status, router]);

  const handlePlayAgain = () => {
    resetGame();
    router.push('/');
  };

  if (!state.gradingResult || !state.currentScenario) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const result = state.gradingResult;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">{state.currentScenario.icon}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {state.currentScenario.title}
        </h1>
        <p className="text-slate-600">
          Here&apos;s how you did on this governance challenge
        </p>
      </div>

      {/* Score display */}
      <div className="mb-8">
        <ScoreDisplay result={result} />
      </div>

      {/* Feedback section */}
      <div className="mb-8">
        <FeedbackSection
          correctPicks={result.correctPicks}
          missedPicks={result.missedPicks}
          unnecessaryPicks={result.unnecessaryPicks}
          improvedApproach={result.improvedApproach}
        />
      </div>

      {/* Gotchas section */}
      <div className="mb-8">
        <GotchasSection gotchas={result.gotchas} />
      </div>

      {/* Admin roles table */}
      <div className="mb-8">
        <AdminRolesTable
          adminRoles={result.adminRoles}
          disclaimer={result.adminRoleDisclaimer}
        />
      </div>

      {/* Actions */}
      <div className="text-center space-y-4">
        <Button variant="primary" size="lg" onClick={handlePlayAgain}>
          Play Again
        </Button>
        <p className="text-sm text-slate-500">
          Try another scenario to test your governance knowledge!
        </p>
      </div>

      {/* Game stats */}
      <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Game Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {state.selectedControlIds.length}
            </p>
            <p className="text-sm text-slate-600">Controls Selected</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-600">
              {state.hintsUsed}
            </p>
            <p className="text-sm text-slate-600">Hints Used</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success-600">
              {result.correctPicks.length}
            </p>
            <p className="text-sm text-slate-600">Correct Picks</p>
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
            <p className="text-sm text-slate-600">Time Taken</p>
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
