/**
 * Metrics History Hook
 * Loads historical metrics data using PromQL friendly format
 */

'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useMetricsStore } from '../stores/metricsStore';
import type { MetricDataPoint, NetworkDataPoint, LoadAverageDataPoint } from '../types/metrics';

/**
 * PromQL queries for historical data
 */
const QUERIES = {
  cpu: '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
  memory: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
  disk: 'avg((node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100)',
  networkRx: 'rate(node_network_receive_bytes_total{device!~"lo|docker.*"}[5m]) * 8 / 1000000',
  networkTx: 'rate(node_network_transmit_bytes_total{device!~"lo|docker.*"}[5m]) * 8 / 1000000',
  load1: 'node_load1',
  load5: 'node_load5',
  load15: 'node_load15',
};

export function useMetricsHistory(range: string = '1h', step: string = '1m') {
  const token = useAuthStore((state) => state.token);
  const setHistory = useMetricsStore((state) => state.setHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all metrics in parallel
        const [cpuRes, memoryRes, diskRes, networkRxRes, networkTxRes, load1Res, load5Res, load15Res] = await Promise.all([
          apiClient.queryPrometheusFriendly(QUERIES.cpu, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.memory, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.disk, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.networkRx, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.networkTx, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.load1, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.load5, range, step),
          apiClient.queryPrometheusFriendly(QUERIES.load15, range, step),
        ]);

        // Transform to internal format
        const cpuHistory: MetricDataPoint[] = cpuRes.data.series[0]?.data.map((d: any) => ({
          timestamp: d.timestamp * 1000,
          value: d.value,
        })) || [];

        const memoryHistory: MetricDataPoint[] = memoryRes.data.series[0]?.data.map((d: any) => ({
          timestamp: d.timestamp * 1000,
          value: d.value,
        })) || [];

        const diskHistory: MetricDataPoint[] = diskRes.data.series[0]?.data.map((d: any) => ({
          timestamp: d.timestamp * 1000,
          value: d.value,
        })) || [];

        // Combine RX and TX into NetworkDataPoint[]
        const rxData = networkRxRes.data.series[0]?.data || [];
        const txData = networkTxRes.data.series[0]?.data || [];
        const networkHistory: NetworkDataPoint[] = rxData.map((rx: any, idx: number) => ({
          timestamp: rx.timestamp * 1000,
          rx: rx.value,
          tx: txData[idx]?.value || 0,
        }));

        // Combine load averages into LoadAverageDataPoint[]
        const load1Data = load1Res.data.series[0]?.data || [];
        const load5Data = load5Res.data.series[0]?.data || [];
        const load15Data = load15Res.data.series[0]?.data || [];
        const loadHistory: LoadAverageDataPoint[] = load1Data.map((l1: any, idx: number) => ({
          timestamp: l1.timestamp * 1000,
          load1: l1.value,
          load5: load5Data[idx]?.value || 0,
          load15: load15Data[idx]?.value || 0,
        }));

        // Update store
        setHistory({
          cpu: cpuHistory,
          memory: memoryHistory,
          disk: diskHistory,
          network: networkHistory,
          load: loadHistory,
        });

        setIsLoading(false);
      } catch (err) {
        console.error('[useMetricsHistory] Failed to load history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load historical data');
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [token, range, step, setHistory]);

  return { isLoading, error };
}
