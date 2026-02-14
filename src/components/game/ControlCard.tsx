import React from 'react';
import { Control } from '@/lib/controls/types';
import { CategoryBadge } from '@/components/ui/Badge';
import type { ControlCategoryBadgeVariant } from '@/components/ui/Badge';

interface ControlCardProps {
  control: Control;
  selected: boolean;
  disabled?: boolean;
  onToggle: (controlId: string) => void;
}

/**
 * Individual selectable control card
 */
export function ControlCard({
  control,
  selected,
  disabled = false,
  onToggle,
}: ControlCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onToggle(control.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onToggle(control.id);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      aria-label={`${control.name}: ${control.description}`}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          selected
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-sm'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${
            selected
              ? 'bg-primary-500 border-primary-500'
              : 'bg-white border-slate-300'
          }
        `}
      >
        {selected && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="pr-8">
        {/* Icon and title */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl flex-shrink-0">{control.icon}</span>
          <div>
            <h4 className="font-semibold text-slate-900 leading-tight">
              {control.name}
            </h4>
            <CategoryBadge
              category={control.category as ControlCategoryBadgeVariant}
              size="sm"
              className="mt-1"
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {control.description}
        </p>
      </div>
    </div>
  );
}
