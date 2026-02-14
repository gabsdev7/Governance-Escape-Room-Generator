'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/Button';
import {
  ScenarioStory,
  ControlLibrary,
  HintButton,
  HintDisplay,
} from '@/components/game';

export default function GamePage() {
  const router = useRouter();
  const {
    state,
    toggleControl,
    submitAnswers,
    canSubmit,
    resetGame,
  } = useGameState();

  // Redirect to home if no active scenario
  useEffect(() => {
    if (!state.currentScenario && state.status !== 'results') {
      router.push('/');
    }
  }, [state.currentScenario, state.status, router]);

  // Redirect to results if already submitted
  useEffect(() => {
    if (state.status === 'results') {
      router.push('/results');
    }
  }, [state.status, router]);

  const handleSubmit = () => {
    const result = submitAnswers();
    if (result) {
      router.push('/results');
    }
  };

  const handleQuit = () => {
    if (
      window.confirm(
        'Are you sure you want to quit? Your progress will be lost.'
      )
    ) {
      resetGame();
      router.push('/');
    }
  };

  if (!state.currentScenario) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading scenario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Game in Progress</span>
          <Button variant="ghost" size="sm" onClick={handleQuit}>
            Quit Game
          </Button>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                state.selectedControlIds.length > 0
                  ? 50 + (state.selectedControlIds.length * 5)
                  : 25
              }%`,
            }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scenario story - left column on large screens */}
        <div className="lg:col-span-2">
          <ScenarioStory scenario={state.currentScenario} />

          {/* Hint section */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Need Help?</h3>
              <HintButton />
            </div>
            <HintDisplay hints={state.hintHistory} />
          </div>
        </div>

        {/* Sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 space-y-4">
            {/* Selection summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Your Selections
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {state.selectedControlIds.length === 0
                  ? 'Select controls from the library below'
                  : `${state.selectedControlIds.length} control${
                      state.selectedControlIds.length === 1 ? '' : 's'
                    } selected`}
              </p>
              <Button
                variant="primary"
                className="w-full"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Submit Answers
              </Button>
              {!canSubmit && (
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Select at least one control to submit
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control library - full width */}
      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <ControlLibrary
          selectedIds={state.selectedControlIds}
          onToggle={toggleControl}
        />
      </div>

      {/* Bottom submit bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            {state.selectedControlIds.length} selected
          </div>
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Submit Answers
          </Button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
