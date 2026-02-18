/**
 * Dashboard Grid Component
 * Main dashboard layout that orchestrates all metric visualizations
 */

'use client';

import { Cpu, MemoryStick, HardDrive, Activity, Network, Clock } from 'lucide-react';
import { useMetricsStream } from '@/lib/hooks/useMetricsStream';
import { useMetricsHistory } from '@/lib/hooks/useMetricsHistory';
import { useMetricsStore } from '@/lib/stores/metricsStore';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { MetricCard } from './MetricCard';
import { MetricHeader } from './MetricHeader';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { MultiLineChart } from '@/components/charts/MultiLineChart';
import { NetworkChart } from '@/components/charts/NetworkChart';
import { DiskIOLive } from '@/components/charts/DiskIOLive';
import { UptimeDisplay } from '@/components/charts/UptimeDisplay';
import { DiskQuota } from '@/components/charts/DiskQuota';
import { formatPercent } from '@/lib/utils/formatters';

export function DashboardGrid() {
  // Historical data loading disabled for now (SSE provides real-time data)
  // Uncomment to enable PromQL historical data loading:
  // const { isLoading: isLoadingHistory, error: historyError } = useMetricsHistory('1h', '1m');

  // Connect to SSE stream for real-time updates
  const { status, lastUpdate } = useMetricsStream();

  // Get metrics from store
  const current = useMetricsStore((state) => state.current);
  const history = useMetricsStore((state) => state.history);
  const connectionStatus = useMetricsStore((state) => state.connectionStatus);

  // Show loading state while waiting for initial SSE data
  if (!current && connectionStatus === 'reconnecting') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <LoadingSpinner size={48} text="Connecting to metrics stream..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              System Metrics Dashboard
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Real-time monitoring powered by SSE
            </p>
          </div>
          <ConnectionStatus status={connectionStatus} lastUpdate={lastUpdate} />
        </div>

        {/* Row 1: Gauges for instant metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ErrorBoundary>
            <MetricCard>
              <MetricHeader title="CPU Usage" icon={Cpu} />
              <GaugeChart
                value={current?.cpu || 0}
                label="CPU"
              />
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader title="Memory Usage" icon={MemoryStick} />
              <GaugeChart
                value={current?.memory || 0}
                label="Memory"
              />
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader title="Disk Usage" icon={HardDrive} />
              <GaugeChart
                value={current?.disk || 0}
                label="Disk"
              />
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader title="System Uptime" icon={Clock} />
              <UptimeDisplay uptime={current?.uptime || 0} />
            </MetricCard>
          </ErrorBoundary>
        </div>

        {/* Row 2: Time series charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="CPU Usage Over Time"
                subtitle="Last 100 data points"
              />
              {history.cpu.length > 0 ? (
                <TimeSeriesChart
                  data={history.cpu}
                  color="#3b82f6"
                  yAxisFormatter={formatPercent}
                />
              ) : (
                <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
                  Waiting for data...
                </div>
              )}
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="Memory Usage Over Time"
                subtitle="Last 100 data points"
              />
              {history.memory.length > 0 ? (
                <TimeSeriesChart
                  data={history.memory}
                  color="#8b5cf6"
                  yAxisFormatter={formatPercent}
                />
              ) : (
                <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
                  Waiting for data...
                </div>
              )}
            </MetricCard>
          </ErrorBoundary>
        </div>

        {/* Row 3: Load average and Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="System Load Average"
                icon={Activity}
                subtitle="1, 5, and 15 minute averages"
              />
              {history.load.length > 0 ? (
                <MultiLineChart data={history.load} />
              ) : (
                <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
                  Waiting for data...
                </div>
              )}
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="Network Traffic"
                icon={Network}
                subtitle="Receive and Transmit rates"
              />
              {history.network.length > 0 ? (
                <NetworkChart data={history.network} />
              ) : (
                <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
                  Waiting for data...
                </div>
              )}
            </MetricCard>
          </ErrorBoundary>
        </div>

        {/* Row 4: Disk Trends and I/O */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="Disk Usage Trend"
                subtitle="Last 100 data points"
              />
              {history.disk.length > 0 ? (
                <TimeSeriesChart
                  data={history.disk}
                  color="#f59e0b"
                  yAxisFormatter={formatPercent}
                />
              ) : (
                <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
                  Waiting for data...
                </div>
              )}
            </MetricCard>
          </ErrorBoundary>

          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="Disk I/O"
                icon={HardDrive}
                subtitle="Real-time Read/Write rates"
              />
              <DiskIOLive devices={current?.diskIODevices || []} />
            </MetricCard>
          </ErrorBoundary>
        </div>

        {/* Row 5: Disk Quota (Storage Details) */}
        <div className="grid grid-cols-1 gap-4">
          <ErrorBoundary>
            <MetricCard>
              <MetricHeader
                title="Storage Quota"
                icon={HardDrive}
                subtitle="Disk usage by partition (used / total)"
              />
              <DiskQuota partitions={current?.diskPartitions || []} />
            </MetricCard>
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-500 pt-4">
          Dashboard updates every 15 seconds via Server-Sent Events
        </div>
      </div>
    </div>
  );
}
