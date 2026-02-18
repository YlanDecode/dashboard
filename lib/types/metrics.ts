/**
 * Metrics Type Definitions
 * Business logic types for system metrics
 */

/**
 * Single data point for time series
 */
export interface MetricDataPoint {
  timestamp: number; // Unix timestamp in milliseconds
  value: number;
}

/**
 * Network data point with RX and TX
 */
export interface NetworkDataPoint {
  timestamp: number;
  rx: number; // Receive in Mbps
  tx: number; // Transmit in Mbps
}

/**
 * Load average data point
 */
export interface LoadAverageDataPoint {
  timestamp: number;
  load1: number;  // 1 minute
  load5: number;  // 5 minutes
  load15: number; // 15 minutes
}

/**
 * Disk I/O data point
 */
export interface DiskIODataPoint {
  timestamp: number;
  device: string;
  readMBps: number;
  writeMBps: number;
}

/**
 * Backend SSE Response Format
 */
export interface SSEMetricsResponse {
  timestamp: string;
  uptime: {
    value: number;
    unit: string;
    display: string;
  };
  cpu: {
    value: number;
    unit: string;
    cores: number;
  };
  memory: {
    percent: number;
    used_gb: number;
    total_gb: number;
    unit: string;
  };
  disk: {
    value: number;
    unit: string;
    partitions: Array<{
      device: string;
      mountpoint: string;
      total_gb: number;
      used_gb: number;
      available_gb: number;
      usage_percent: number;
    }>;
  };
  disk_io: {
    devices: Array<{
      device: string;
      read_mbps: number;
      write_mbps: number;
    }>;
  };
  network: {
    interfaces: Array<{
      interface: string;
      rx_mbps: number;
      tx_mbps: number;
    }>;
  };
  load: {
    load_1m: number;
    load_5m: number;
    load_15m: number;
  };
}

/**
 * Current snapshot of all metrics (normalized for internal use)
 */
export interface CurrentMetrics {
  cpu: number;              // Percentage 0-100
  memory: number;           // Percentage 0-100
  disk: number;             // Percentage 0-100
  uptime: number;           // Seconds
  networkRx: number;        // Mbps
  networkTx: number;        // Mbps
  load1: number;            // Load average 1 min
  load5: number;            // Load average 5 min
  load15: number;           // Load average 15 min
  timestamp: number;        // Unix timestamp
  // Detailed disk partitions for quota display
  diskPartitions?: Array<{
    device: string;
    mountpoint: string;
    total_gb: number;
    used_gb: number;
    available_gb: number;
    usage_percent: number;
  }>;
  // Disk I/O data
  diskIODevices?: Array<{
    device: string;
    read_mbps: number;
    write_mbps: number;
  }>;
}

/**
 * Time series history for all metrics
 */
export interface MetricsHistory {
  cpu: MetricDataPoint[];
  memory: MetricDataPoint[];
  disk: MetricDataPoint[];
  network: NetworkDataPoint[];
  load: LoadAverageDataPoint[];
  diskIO: DiskIODataPoint[];
}

/**
 * Connection status for SSE
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

/**
 * Complete metrics state
 */
export interface MetricsState {
  current: CurrentMetrics | null;
  history: MetricsHistory;
  connectionStatus: ConnectionStatus;
  lastUpdate: number;
  error: string | null;
}

/**
 * Friendly Format Query Response (from /api/v1/metrics/system/query/ with format=friendly)
 */
export interface FriendlyQueryResponse {
  timestamp: string;
  query: string;
  range?: string;
  step?: string;
  format: 'friendly';
  data: {
    type: 'timeseries' | 'scalar';
    count: number;
    series: Array<{
      labels: Record<string, string>;
      label: string;
      data: Array<{
        timestamp: number;
        value: number;
        unit: string;
      }>;
    }>;
  };
}
