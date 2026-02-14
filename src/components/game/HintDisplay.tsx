import React from 'react';
import { HintResult } from '@/lib/hints/types';
import { Badge } from '@/components/ui/Badge';

interface HintDisplayProps {
  hints: HintResult[];
}

/**
 * Display received hints
 */
export function HintDisplay({ hints }: HintDisplayProps) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
        <span className="text-lg">💡</span>
        Hints Received
      </h4>
      <div className="space-y-2">
        {hints.map((hint, index) => (
          <div
            key={index}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-amber-900 flex-1">{hint.hint}</p>
              <Badge
                variant={hint.source === 'mcp' ? 'info' : 'neutral'}
                size="sm"
              >
                {hint.source === 'mcp' ? 'MS Learn' : 'Local'}
              </Badge>
            </div>
            {hint.learnMoreUrl && (
              <a
                href={hint.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-amber-700 hover:text-amber-800 hover:underline"
              >
                Learn more
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
