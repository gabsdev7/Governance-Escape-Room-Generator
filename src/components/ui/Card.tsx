import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function Card({
  children,
  className = '',
  selected = false,
  disabled = false,
  onClick,
  as: Component = 'div',
}: CardProps) {
  const isInteractive = !!onClick && !disabled;

  const baseClasses = 'bg-white rounded-xl border transition-all duration-200';

  const stateClasses = selected
    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 shadow-md'
    : 'border-slate-200 shadow-sm';

  const interactiveClasses = isInteractive
    ? 'cursor-pointer hover:shadow-md hover:border-primary-300'
    : '';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  if (isInteractive) {
    return (
      <Component
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-disabled={disabled}
        onClick={onClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${baseClasses} ${stateClasses} ${interactiveClasses} ${disabledClasses} ${className}`}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-4 py-2 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-4 pt-2 pb-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  );
}
