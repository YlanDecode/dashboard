/**
 * Metric Card Component
 * Reusable container for dashboard metrics
 */

import { ReactNode } from 'react';

interface MetricCardProps {
  children: ReactNode;
  className?: string;
}

export function MetricCard({ children, className = '' }: MetricCardProps) {
  return (
    <div
      className={`
        rounded-lg border border-zinc-200 dark:border-zinc-800
        bg-white dark:bg-zinc-900
        p-6
        shadow-sm hover:shadow-md
        transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
