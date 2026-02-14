/**
 * Game Flow Integration Tests
 * 
 * Tests the complete game flow from start to results.
 * Uses React Testing Library to simulate user interactions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameStateProvider } from '@/lib/game-state/context';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch for hint API
global.fetch = jest.fn();

// Simple test component that exercises the game state
import React from 'react';
import { useGameStateContext } from '@/lib/game-state/context';

function TestGameComponent() {
  const {
    state,
    startGame,
    toggleControl,
    submitAnswers,
    resetGame,
    canSubmit,
    isPlaying,
    hasResults,
  } = useGameStateContext();

  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="scenario-id">{state.currentScenario?.id ?? 'none'}</div>
      <div data-testid="selected-count">{state.selectedControlIds.length}</div>
      <div data-testid="score">{state.gradingResult?.score ?? 'none'}</div>
      <div data-testid="is-playing">{isPlaying.toString()}</div>
      <div data-testid="has-results">{hasResults.toString()}</div>
      <div data-testid="can-submit">{canSubmit.toString()}</div>

      <button data-testid="start-game" onClick={startGame}>
        Start Game
      </button>
      <button
        data-testid="select-control"
        onClick={() => toggleControl('least-privilege-access')}
      >
        Select Control
      </button>
      <button data-testid="submit" onClick={() => submitAnswers()}>
        Submit
      </button>
      <button data-testid="reset" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}

describe('Game Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <GameStateProvider>
        <TestGameComponent />
      </GameStateProvider>
    );
  };

  it('should start in idle state', () => {
    renderWithProvider();

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('scenario-id')).toHaveTextContent('none');
    expect(screen.getByTestId('is-playing')).toHaveTextContent('false');
  });

  it('should transition to playing state when game starts', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));

    expect(screen.getByTestId('status')).toHaveTextContent('playing');
    expect(screen.getByTestId('scenario-id')).not.toHaveTextContent('none');
    expect(screen.getByTestId('is-playing')).toHaveTextContent('true');
  });

  it('should track control selection', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
    expect(screen.getByTestId('can-submit')).toHaveTextContent('false');

    fireEvent.click(screen.getByTestId('select-control'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    expect(screen.getByTestId('can-submit')).toHaveTextContent('true');
  });

  it('should toggle control selection on/off', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));
    
    // Select
    fireEvent.click(screen.getByTestId('select-control'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    
    // Deselect
    fireEvent.click(screen.getByTestId('select-control'));
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });

  it('should grade submission and transition to results', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('select-control'));
    fireEvent.click(screen.getByTestId('submit'));

    expect(screen.getByTestId('status')).toHaveTextContent('results');
    expect(screen.getByTestId('score')).not.toHaveTextContent('none');
    expect(screen.getByTestId('has-results')).toHaveTextContent('true');
  });

  it('should produce a numeric score', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('select-control'));
    fireEvent.click(screen.getByTestId('submit'));

    const score = parseInt(screen.getByTestId('score').textContent ?? '0', 10);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should reset game to initial state', () => {
    renderWithProvider();

    // Start and play
    fireEvent.click(screen.getByTestId('start-game'));
    fireEvent.click(screen.getByTestId('select-control'));

    // Reset
    fireEvent.click(screen.getByTestId('reset'));

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('scenario-id')).toHaveTextContent('none');
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });

  it('should not allow submit without selections', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('start-game'));
    expect(screen.getByTestId('can-submit')).toHaveTextContent('false');

    // Try to submit anyway
    fireEvent.click(screen.getByTestId('submit'));

    // Should still be playing (no state change)
    expect(screen.getByTestId('status')).toHaveTextContent('playing');
  });
});
