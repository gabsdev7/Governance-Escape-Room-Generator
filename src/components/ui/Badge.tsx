import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'info',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    info: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-danger-100 text-danger-800',
    neutral: 'bg-slate-100 text-slate-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Category-specific badge for governance control categories
export type ControlCategoryBadgeVariant =
  | 'DATA_ACCESS'
  | 'INFORMATION_PROTECTION'
  | 'DLP_COMPLIANCE'
  | 'IDENTITY_ACCESS'
  | 'AGENT_SAFETY'
  | 'MONITORING_LIFECYCLE';

const categoryConfig: Record<
  ControlCategoryBadgeVariant,
  { label: string; variant: BadgeProps['variant'] }
> = {
  DATA_ACCESS: { label: 'Data Access', variant: 'info' },
  INFORMATION_PROTECTION: { label: 'Info Protection', variant: 'success' },
  DLP_COMPLIANCE: { label: 'DLP & Compliance', variant: 'warning' },
  IDENTITY_ACCESS: { label: 'Identity & Access', variant: 'neutral' },
  AGENT_SAFETY: { label: 'Agent Safety', variant: 'danger' },
  MONITORING_LIFECYCLE: { label: 'Monitoring', variant: 'info' },
};

export function CategoryBadge({
  category,
  size = 'md',
  className = '',
}: {
  category: ControlCategoryBadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const config = categoryConfig[category];
  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
