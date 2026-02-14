import React from 'react';
import { GradingResult } from '@/lib/grading/types';

interface ScoreDisplayProps {
  result: GradingResult;
}

/**
 * Display score with visual indicator and breakdown
 */
export function ScoreDisplay({ result }: ScoreDisplayProps) {
  const { score, grade, breakdown } = result;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score circle */}
        <div className="relative">
          <div
            className={`
              w-32 h-32 rounded-full flex items-center justify-center
              ${getScoreBackgroundClass(score)}
            `}
            role="img"
            aria-label={`Score: ${score} out of 100, Grade: ${grade}`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{score}</div>
              <div className="text-sm text-white/80">/ 100</div>
            </div>
          </div>
          {/* Grade badge */}
          <div
            className={`
              absolute -bottom-2 left-1/2 -translate-x-1/2
              w-10 h-10 rounded-full flex items-center justify-center
              font-bold text-lg shadow-lg
              ${getGradeBackgroundClass(grade)}
            `}
          >
            {grade}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="flex-1 w-full">
          <h3 className="font,  -semibold text-slate-900 mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            <BreakdownBar
              label="Required Controls"
              value={breakdown.requiredCoverage}
              max={breakdown.requiredMaxPoints}
              color="primary"
              detail={`${breakdown.requiredSelected} of ${breakdown.requiredTotal}`}
            />
            <BreakdownBar
              label="Recommended Controls"
              value={breakdown.recommendedCoverage}
              max={breakdown.recommendedMaxPoints}
              color="secondary"
              detail={`${breakdown.recommendedSelected} of ${breakdown.recommendedTotal}`}
            />
            {breakdown.antiPatternSelected > 0 && (
              <BreakdownBar
                label="Anti-pattern Penalty"
                value={Math.abs(breakdown.antiPatternPenalty)}
                max={20}
                color="danger"
                detail={`${breakdown.antiPatternSelected} selected`}
                isNegative
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BreakdownBarProps {
  label: string;
  value: number;
  max: number;
  color: 'primary' | 'secondary' | 'danger';
  detail: string;
  isNegative?: boolean;
}

function BreakdownBar({
  label,
  value,
  max,
  color,
  detail,
  isNegative,
}: BreakdownBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    danger: 'bg-danger-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className={isNegative ? 'text-danger-600' : 'text-slate-600'}>
          {isNegative ? '-' : '+'}
          {value} pts ({detail})
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function getScoreBackgroundClass(score: number): string {
  if (score >= 80) return 'bg-gradient-to-br from-success-400 to-success-600';
  if (score >= 60) return 'bg-gradient-to-br from-warning-400 to-warning-600';
  return 'bg-gradient-to-br from-danger-400 to-danger-600';
}

function getGradeBackgroundClass(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-success-500 text-white';
    case 'B':
      return 'bg-success-400 text-white';
    case 'C':
      return 'bg-warning-500 text-white';
    case 'D':
      return 'bg-warning-600 text-white';
    default:
      return 'bg-danger-500 text-white';
  }
}
