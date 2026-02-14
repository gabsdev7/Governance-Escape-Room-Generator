'use client';

import React, { useState } from 'react';
import { ControlFeedback } from '@/lib/grading/types';

interface FeedbackSectionProps {
  correctPicks: ControlFeedback[];
  missedPicks: ControlFeedback[];
  unnecessaryPicks: ControlFeedback[];
  improvedApproach: string;
}

type Tab = 'correct' | 'missed' | 'unnecessary';

/**
 * Tabbed feedback section showing control selections
 */
export function FeedbackSection({
  correctPicks,
  missedPicks,
  unnecessaryPicks,
  improvedApproach,
}: FeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('correct');

  const tabs: { key: Tab; label: string; count: number; icon: string }[] = [
    { key: 'correct', label: 'Correct', count: correctPicks.length, icon: '✓' },
    { key: 'missed', label: 'Missed', count: missedPicks.length, icon: '✗' },
    { key: 'unnecessary', label: 'Unnecessary', count: unnecessaryPicks.length, icon: '⚠' },
  ];

  const renderFeedbackItems = (items: ControlFeedback[], type: Tab) => {
    if (items.length === 0) {
      const messages = {
        correct: 'No controls were correctly selected.',
        missed: 'Great job! You didn\'t miss any important controls.',
        unnecessary: 'Great job! You avoided all anti-pattern selections.',
      };
      return (
        <p className="text-slate-500 italic text-center py-4">
          {messages[type]}
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.controlId}
            className={`
              p-4 rounded-lg border
              ${type === 'correct' ? 'bg-success-50 border-success-200' : ''}
              ${type === 'missed' ? 'bg-amber-50 border-amber-200' : ''}
              ${type === 'unnecessary' ? 'bg-danger-50 border-danger-200' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">
                {type === 'correct' && '✓'}
                {type === 'missed' && '✗'}
                {type === 'unnecessary' && '⚠'}
              </span>
              <div>
                <h4
                  className={`
                    font-medium
                    ${type === 'correct' ? 'text-success-800' : ''}
                    ${type === 'missed' ? 'text-amber-800' : ''}
                    ${type === 'unnecessary' ? 'text-danger-800' : ''}
                  `}
                >
                  {item.controlName}
                </h4>
                <p
                  className={`
                    text-sm mt-1
                    ${type === 'correct' ? 'text-success-700' : ''}
                    ${type === 'missed' ? 'text-amber-700' : ''}
                    ${type === 'unnecessary' ? 'text-danger-700' : ''}
                  `}
                >
                  {item.rationale}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
              ${
                activeTab === tab.key
                  ? 'bg-slate-50 text-slate-900 border-b-2 border-primary-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }
            `}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
            <span
              className={`
                ml-2 px-2 py-0.5 rounded-full text-xs
                ${activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}
              `}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="p-6">
        <div
          id="panel-correct"
          role="tabpanel"
          hidden={activeTab !== 'correct'}
        >
          {renderFeedbackItems(correctPicks, 'correct')}
        </div>
        <div
          id="panel-missed"
          role="tabpanel"
          hidden={activeTab !== 'missed'}
        >
          {renderFeedbackItems(missedPicks, 'missed')}
          {missedPicks.length > 0 && (
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="font-medium text-primary-800 mb-2">
                💡 Improved Approach
              </h4>
              <p className="text-sm text-primary-700">{improvedApproach}</p>
            </div>
          )}
        </div>
        <div
          id="panel-unnecessary"
          role="tabpanel"
          hidden={activeTab !== 'unnecessary'}
        >
          {renderFeedbackItems(unnecessaryPicks, 'unnecessary')}
        </div>
      </div>
    </div>
  );
}
