'use client';

import React, { useState } from 'react';

interface GotchasSectionProps {
  gotchas: string[];
}

/**
 * Display implementation gotchas
 */
export function GotchasSection({ gotchas }: GotchasSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (gotchas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        aria-expanded={isExpanded}
        aria-controls="gotchas-content"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <h3 className="font-semibold text-slate-900">
            Implementation Gotchas
          </h3>
          <span className="px-2 py-0.5 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">
            {gotchas.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
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
      </button>

      {isExpanded && (
        <div id="gotchas-content" className="px-6 pb-6">
          <p className="text-sm text-slate-600 mb-4">
            Watch out for these common pitfalls when implementing these controls
            in your environment:
          </p>
          <ul className="space-y-3">
            {gotchas.map((gotcha, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-warning-600 text-sm font-bold">!</span>
                </span>
                <p className="text-sm text-slate-700">{gotcha}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
