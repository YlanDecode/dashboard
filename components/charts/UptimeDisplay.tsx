/**
 * Uptime Display Component
 * Simple text display for system uptime
 */

'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import { formatUptime } from '@/lib/utils/formatters';

interface UptimeDisplayProps {
  uptime: number; // in seconds
}

export const UptimeDisplay = memo(function UptimeDisplay({ uptime }: UptimeDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[200px]">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 dark:bg-blue-400/10 mb-4">
        <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {formatUptime(uptime)}
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          System Uptime
        </div>
      </div>
    </div>
  );
});
