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
    advanceScenario,
    canSubmit,
    resetGame,
    totalScenarios,
    currentScenarioNumber,
    isLastScenario,
    isScenarioComplete,
  } = useGameState();

  // Redirect to home if no active scenario
  useEffect(() => {
    if (
      !state.currentScenario &&
      state.status !== 'results' &&
      state.status !== 'scenario-complete'
    ) {
      router.push('/');
    }
  }, [state.currentScenario, state.status, router]);

  // Redirect to results when all scenarios are done
  useEffect(() => {
    if (state.status === 'results') {
      router.push('/results');
    }
  }, [state.status, router]);

  const handleSubmit = () => {
    submitAnswers();
  };

  const handleNextScenario = () => {
    if (isLastScenario) {
      router.push('/results');
    } else {
      advanceScenario();
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

  // Inter-scenario results screen
  if (isScenarioComplete && state.gradingResult) {
    const result = state.gradingResult;
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Challenge {currentScenarioNumber} of {totalScenarios} Complete
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{
                width: `${(currentScenarioNumber / totalScenarios) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Scenario result card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">{state.currentScenario.icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {state.currentScenario.title}
          </h2>
          <p className="text-slate-500 mb-6">{state.currentScenario.topic}</p>

          {/* Score */}
          <div className="mb-6">
            <div
              className={`
                inline-flex items-center justify-center w-24 h-24 rounded-full mb-2
                ${result.score >= 90 ? 'bg-success-100 text-success-700' : ''}
                ${result.score >= 70 && result.score < 90 ? 'bg-primary-100 text-primary-700' : ''}
                ${result.score >= 50 && result.score < 70 ? 'bg-warning-100 text-warning-700' : ''}
                ${result.score < 50 ? 'bg-danger-100 text-danger-700' : ''}
              `}
            >
              <div>
                <div className="text-3xl font-bold">{result.score}</div>
                <div className="text-xs opacity-75">/ 100</div>
              </div>
            </div>
            <p className="text-slate-600">
              Grade: <span className="font-bold text-lg">{result.grade}</span>
            </p>
          </div>

          {/* Quick feedback */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-success-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-success-600">
                {result.correctPicks.length}
              </div>
              <div className="text-success-700">Correct</div>
            </div>
            <div className="bg-warning-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-warning-600">
                {result.missedPicks.length}
              </div>
              <div className="text-warning-700">Missed</div>
            </div>
            <div className="bg-danger-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-danger-600">
                {result.unnecessaryPicks.length}
              </div>
              <div className="text-danger-700">Anti-pattern</div>
            </div>
          </div>

          {/* Next button */}
          <Button variant="primary" size="lg" onClick={handleNextScenario}>
            {isLastScenario ? 'View Final Results' : `Next Challenge (${currentScenarioNumber + 1} of ${totalScenarios})`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Challenge {currentScenarioNumber} of {totalScenarios}
          </span>
          <Button variant="ghost" size="sm" onClick={handleQuit}>
            Quit Game
          </Button>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentScenarioNumber - 1) / totalScenarios) * 100 +
                (state.selectedControlIds.length > 0
                  ? ((1 / totalScenarios) * 50)
                  : 0)}%`,
            }}
          />
        </div>
        {/* Scenario dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {state.scenarios.map((s, i) => (
            <div
              key={s.id}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${i < state.currentScenarioIndex
                  ? 'bg-success-100 text-success-700 border-2 border-success-300'
                  : i === state.currentScenarioIndex
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'}
              `}
              title={s.title}
            >
              {i < state.currentScenarioIndex ? '✓' : i + 1}
            </div>
          ))}
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
