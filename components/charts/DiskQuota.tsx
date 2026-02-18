/**
 * Disk Quota Component
 * Displays disk usage with quota (used/total) for each partition
 */

'use client';

import { memo } from 'react';
import { HardDrive } from 'lucide-react';
import { getThresholdColor } from '@/lib/utils/formatters';

interface DiskPartition {
  device: string;
  mountpoint: string;
  total_gb: number;
  used_gb: number;
  available_gb: number;
  usage_percent: number;
}

interface DiskQuotaProps {
  partitions: DiskPartition[];
}

export const DiskQuota = memo(function DiskQuota({ partitions }: DiskQuotaProps) {
  if (!partitions || partitions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-zinc-500 dark:text-zinc-500">
        No disk partitions available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {partitions.map((partition) => {
        const color = getThresholdColor(partition.usage_percent);

        return (
          <div
            key={partition.device}
            className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
          >
            {/* Partition Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {partition.device}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    {partition.mountpoint}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-2xl font-bold"
                  style={{ color }}
                >
                  {partition.usage_percent.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${partition.usage_percent}%`,
                  backgroundColor: color,
                }}
              />
            </div>

            {/* Quota Details */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {partition.used_gb.toFixed(1)} GB
                </span>
                {' used'}
              </div>
              <div className="text-zinc-500 dark:text-zinc-500">
                of {partition.total_gb.toFixed(1)} GB
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {partition.available_gb.toFixed(1)} GB
                </span>
                {' free'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
