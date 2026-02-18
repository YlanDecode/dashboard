/**
 * Metrics Store using Zustand
 * Manages system metrics state globally
 */

import { create } from 'zustand';
import type {
  CurrentMetrics,
  MetricsHistory,
  MetricDataPoint,
  NetworkDataPoint,
  LoadAverageDataPoint,
  DiskIODataPoint,
  ConnectionStatus,
} from '../types/metrics';

interface MetricsStore {
  // State
  current: CurrentMetrics | null;
  history: MetricsHistory;
  connectionStatus: ConnectionStatus;
  lastUpdate: number;
  error: string | null;

  // Actions
  updateCurrent: (metrics: CurrentMetrics) => void;
  appendToHistory: (metrics: CurrentMetrics) => void;
  setHistory: (history: Partial<MetricsHistory>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_POINTS = 100;

/**
 * Maintain a fixed window of data points
 */
function maintainWindow<T>(data: T[], newItem: T, maxSize: number = MAX_HISTORY_POINTS): T[] {
  const updated = [...data, newItem];
  return updated.length > maxSize ? updated.slice(-maxSize) : updated;
}

export const useMetricsStore = create<MetricsStore>((set, get) => ({
  // Initial state
  current: null,
  history: {
    cpu: [],
    memory: [],
    disk: [],
    network: [],
    load: [],
    diskIO: [],
  },
  connectionStatus: 'disconnected',
  lastUpdate: 0,
  error: null,

  /**
   * Update current metrics snapshot
   */
  updateCurrent: (metrics: CurrentMetrics) => {
    set({
      current: metrics,
      lastUpdate: Date.now(),
      error: null,
    });
  },

  /**
   * Append new metrics to history (maintains window size)
   */
  appendToHistory: (metrics: CurrentMetrics) => {
    const { history } = get();

    const cpuPoint: MetricDataPoint = {
      timestamp: metrics.timestamp,
      value: metrics.cpu,
    };

    const memoryPoint: MetricDataPoint = {
      timestamp: metrics.timestamp,
      value: metrics.memory,
    };

    const diskPoint: MetricDataPoint = {
      timestamp: metrics.timestamp,
      value: metrics.disk,
    };

    const networkPoint: NetworkDataPoint = {
      timestamp: metrics.timestamp,
      rx: metrics.networkRx,
      tx: metrics.networkTx,
    };

    const loadPoint: LoadAverageDataPoint = {
      timestamp: metrics.timestamp,
      load1: metrics.load1,
      load5: metrics.load5,
      load15: metrics.load15,
    };

    set({
      history: {
        ...history,
        cpu: maintainWindow(history.cpu, cpuPoint),
        memory: maintainWindow(history.memory, memoryPoint),
        disk: maintainWindow(history.disk, diskPoint),
        network: maintainWindow(history.network, networkPoint),
        load: maintainWindow(history.load, loadPoint),
        // diskIO remains unchanged (updated separately if needed)
      },
    });
  },

  /**
   * Set entire history (used for initial historical data load)
   */
  setHistory: (newHistory: Partial<MetricsHistory>) => {
    set((state) => ({
      history: {
        ...state.history,
        ...newHistory,
      },
    }));
  },

  /**
   * Set connection status
   */
  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Clear all history
   */
  clearHistory: () => {
    set({
      history: {
        cpu: [],
        memory: [],
        disk: [],
        network: [],
        load: [],
        diskIO: [],
      },
    });
  },
}));
