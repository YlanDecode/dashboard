/**
 * API Client with JWT Authentication
 * Handles all HTTP requests to the CRM Metrics API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://crm-api.bluevaloris.com';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface SystemSnapshot {
  timestamp: string;
  cpu: CpuData;
  memory: MemoryData;
  disk: DiskData[];
  network: NetworkData[];
}

export interface CpuData {
  usage_percent: number | null;
  idle_percent: number | null;
  cores: number | null;
  load_average: [number, number, number] | null;
}

export interface MemoryData {
  total_mb: number | null;
  used_mb: number | null;
  available_mb: number | null;
  usage_percent: number | null;
  swap_total_mb: number | null;
  swap_used_mb: number | null;
}

export interface DiskData {
  device: string | null;
  mountpoint: string | null;
  total_gb: number | null;
  used_gb: number | null;
  available_gb: number | null;
  usage_percent: number | null;
}

export interface NetworkData {
  interface: string | null;
  receive_bytes_per_sec: number | null;
  receive_mbps: number | null;
  transmit_bytes_per_sec: number | null;
  transmit_mbps: number | null;
}

export class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Set the JWT token for authenticated requests
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear the JWT token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Generic request method with automatic JWT injection
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Merge with options headers if any
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.detail || errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  /**
   * Login to get JWT tokens
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/v1/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Refresh the access token
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    return this.request<{ access: string }>('/api/v1/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  /**
   * Get system metrics snapshot
   */
  async getSystemSnapshot(
    range?: '1h' | '6h' | '24h' | '7d',
    step?: '15s' | '1m' | '5m' | '15m' | '1h'
  ): Promise<SystemSnapshot> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (step) params.append('step', step);

    const query = params.toString();
    const endpoint = `/api/v1/metrics/system/snapshot/${query ? `?${query}` : ''}`;

    return this.request<SystemSnapshot>(endpoint);
  }

  /**
   * Get CPU metrics
   */
  async getCpuMetrics(
    range?: '1h' | '6h' | '24h' | '7d',
    step?: '15s' | '1m' | '5m' | '15m' | '1h'
  ): Promise<any> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (step) params.append('step', step);

    const query = params.toString();
    const endpoint = `/api/v1/metrics/system/cpu/${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Get memory metrics
   */
  async getMemoryMetrics(
    range?: '1h' | '6h' | '24h' | '7d',
    step?: '15s' | '1m' | '5m' | '15m' | '1h'
  ): Promise<any> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (step) params.append('step', step);

    const query = params.toString();
    const endpoint = `/api/v1/metrics/system/memory/${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Get disk metrics
   */
  async getDiskMetrics(
    range?: '1h' | '6h' | '24h' | '7d',
    step?: '15s' | '1m' | '5m' | '15m' | '1h'
  ): Promise<any> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (step) params.append('step', step);

    const query = params.toString();
    const endpoint = `/api/v1/metrics/system/disk/${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Get network metrics
   */
  async getNetworkMetrics(
    range?: '1h' | '6h' | '24h' | '7d',
    step?: '15s' | '1m' | '5m' | '15m' | '1h'
  ): Promise<any> {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (step) params.append('step', step);

    const query = params.toString();
    const endpoint = `/api/v1/metrics/system/network/${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Execute custom PromQL query (requires Manager+ role)
   */
  async queryPrometheus(
    query: string,
    range?: string,
    step?: string
  ): Promise<any> {
    return this.request('/api/v1/metrics/system/query/', {
      method: 'POST',
      body: JSON.stringify({ query, range, step }),
    });
  }

  /**
   * Execute PromQL query with friendly format (optimized for frontend)
   * Automatically converts units (bytes → GB, bytes/s → Mbps, etc.)
   */
  async queryPrometheusFriendly(
    query: string,
    range?: string,
    step?: string
  ): Promise<any> {
    return this.request('/api/v1/metrics/system/query/', {
      method: 'POST',
      body: JSON.stringify({
        query,
        range,
        step,
        format: 'friendly',
      }),
    });
  }
}

// Singleton instance
export const apiClient = new APIClient();
