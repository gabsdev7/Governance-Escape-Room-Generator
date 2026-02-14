import React from 'react';
import { Scenario } from '@/lib/scenarios/types';

interface ScenarioStoryProps {
  scenario: Scenario;
}

/**
 * Displays the scenario narrative, risk statement, and objective
 */
export function ScenarioStory({ scenario }: ScenarioStoryProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl">{scenario.icon}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {scenario.title}
          </h2>
          <p className="text-sm text-slate-500">{scenario.topic}</p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(scenario.story) }}
        />
      </div>

      {/* Risk and Objective */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Risk Statement */}
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-danger-800 mb-1">
                Risk Statement
              </h3>
              <p className="text-sm text-danger-700">
                {scenario.riskStatement}
              </p>
            </div>
          </div>
        </div>

        {/* Governance Objective */}
        <div className="bg-success-50 border border-success-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-success-800 mb-1">
                Governance Objective
              </h3>
              <p className="text-sm text-success-700">
                {scenario.governanceObjective}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple markdown-like formatting
 */
function formatMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    })
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23])/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1');
}
