/**
 * Loading Spinner Component
 * Simple animated spinner for loading states
 */

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 24, className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={size} />
      {text && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
      )}
    </div>
  );
}
