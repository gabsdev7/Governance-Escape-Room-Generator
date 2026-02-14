import React from 'react';
import { ControlCard } from './ControlCard';
import {
  groupControlsByCategory,
  categoryDisplayOrder,
  ControlCategory,
  ControlCategoryLabels,
} from '@/lib/controls';

interface ControlLibraryProps {
  selectedIds: string[];
  onToggle: (controlId: string) => void;
  disabledIds?: string[];
}

/**
 * Grid of governance controls grouped by category
 */
export function ControlLibrary({
  selectedIds,
  onToggle,
  disabledIds = [],
}: ControlLibraryProps) {
  const controlsByCategory = groupControlsByCategory();
  const selectedSet = new Set(selectedIds);
  const disabledSet = new Set(disabledIds);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Select Governance Controls
        </h3>
        <p className="text-slate-600">
          Choose the controls and principles that would mitigate the risk in
          this scenario.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
          <span className="text-primary-700 font-medium">
            {selectedIds.length} selected
          </span>
        </div>
      </div>

      {categoryDisplayOrder.map((category) => {
        const controls = controlsByCategory[category];
        if (!controls || controls.length === 0) return null;

        return (
          <div key={category} role="group" aria-labelledby={`category-${category}`}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                {getCategoryIcon(category)}
              </div>
              <h4
                id={`category-${category}`}
                className="text-lg font-semibold text-slate-900"
              >
                {ControlCategoryLabels[category]}
              </h4>
            </div>

            {/* Controls grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {controls.map((control) => (
                <ControlCard
                  key={control.id}
                  control={control}
                  selected={selectedSet.has(control.id)}
                  disabled={disabledSet.has(control.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Get icon for category
 */
function getCategoryIcon(category: ControlCategory): React.ReactNode {
  const icons: Record<ControlCategory, string> = {
    [ControlCategory.DATA_ACCESS]: '🔒',
    [ControlCategory.INFORMATION_PROTECTION]: '🏷️',
    [ControlCategory.DLP_COMPLIANCE]: '🛡️',
    [ControlCategory.IDENTITY_ACCESS]: '👤',
    [ControlCategory.AGENT_SAFETY]: '🤖',
    [ControlCategory.MONITORING_LIFECYCLE]: '📊',
  };
  return <span className="text-xl">{icons[category]}</span>;
}
