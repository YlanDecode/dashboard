/**
 * Metrics Stream Hook
 * Connects directly to backend SSE endpoint and updates metrics store
 */

'use client';

import { useEffect } from 'react';
import { useSSE } from './useSSE';
import { useMetricsStore } from '../stores/metricsStore';
import { useAuthStore } from '../stores/authStore';
import type { CurrentMetrics, SSEMetricsResponse } from '../types/metrics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const SSE_INTERVAL = 30; // seconds

/**
 * Transform backend SSE response to internal CurrentMetrics format
 */
function transformSSEResponse(response: SSEMetricsResponse): CurrentMetrics {
  // Get primary network interface (first one)
  const primaryNetwork = response.network.interfaces[0];

  return {
    cpu: response.cpu.value,
    memory: response.memory.percent,
    disk: response.disk.value,
    uptime: response.uptime.value,
    networkRx: primaryNetwork?.rx_mbps || 0,
    networkTx: primaryNetwork?.tx_mbps || 0,
    load1: response.load.load_1m,
    load5: response.load.load_5m,
    load15: response.load.load_15m,
    timestamp: new Date(response.timestamp).getTime(),
    // Include detailed disk partitions
    diskPartitions: response.disk.partitions,
    // Include disk I/O devices
    diskIODevices: response.disk_io?.devices || [],
  };
}

export function useMetricsStream() {
  const token = useAuthStore((state) => state.token);
  const {
    updateCurrent,
    appendToHistory,
    setConnectionStatus,
    setError,
  } = useMetricsStore();

  // Build SSE URL - connect directly to backend
  const sseUrl = token
    ? `${API_BASE_URL}/api/v1/metrics/dashboard/stream/?token=${encodeURIComponent(token)}&interval=${SSE_INTERVAL}`
    : '';

  /**
   * Handle incoming SSE messages
   */
  const handleMessage = (data: SSEMetricsResponse) => {
    try {
      // Transform to internal format
      const metrics = transformSSEResponse(data);

      // Update current snapshot
      updateCurrent(metrics);

      // Append to history
      appendToHistory(metrics);
    } catch (err) {
      console.error('[useMetricsStream] Failed to transform data:', err);
      setError('Failed to parse metrics data');
    }
  };

  /**
   * Handle SSE errors
   */
  const handleError = (error: Event) => {
    setError('SSE connection error');
  };

  /**
   * Connect to SSE
   */
  const { status, lastUpdate, error, reconnect } = useSSE({
    url: sseUrl,
    onMessage: handleMessage,
    onError: handleError,
    enabled: !!token, // Only connect if authenticated
  });

  /**
   * Update connection status in store
   */
  useEffect(() => {
    setConnectionStatus(status);
  }, [status, setConnectionStatus]);

  /**
   * Update error in store
   */
  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return {
    status,
    lastUpdate,
    error,
    reconnect,
  };
}
