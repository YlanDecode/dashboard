/**
 * Connection Status Component
 * Displays the current SSE connection status
 */

'use client';

import { Circle, WifiOff, Loader2 } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils/formatters';
import type { ConnectionStatus as Status } from '@/lib/types/metrics';

interface ConnectionStatusProps {
  status: Status;
  lastUpdate: number;
}

export function ConnectionStatus({ status, lastUpdate }: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      icon: Circle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      label: 'Connected',
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      label: 'Disconnected',
    },
    reconnecting: {
      icon: Loader2,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      label: 'Reconnecting...',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg border
      ${config.bgColor} ${config.borderColor}
    `}>
      <Icon
        className={`
          h-4 w-4 ${config.color}
          ${status === 'reconnecting' ? 'animate-spin' : ''}
        `}
      />
      <div className="flex items-center gap-2 text-sm">
        <span className={`font-medium ${config.color}`}>
          {config.label}
        </span>
        {lastUpdate > 0 && status === 'connected' && (
          <>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {formatTimestamp(lastUpdate)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
