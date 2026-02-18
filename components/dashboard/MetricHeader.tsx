/**
 * Metric Header Component
 * Header for metric cards with title and optional icon
 */

import { LucideIcon } from 'lucide-react';

interface MetricHeaderProps {
  title: string;
  icon?: LucideIcon;
  subtitle?: string;
}

export function MetricHeader({ title, icon: Icon, subtitle }: MetricHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {Icon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-blue-400/10">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
