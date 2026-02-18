/**
 * Generic SSE Hook
 * Manages Server-Sent Events connection with automatic reconnection
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ConnectionStatus } from '../types/metrics';

interface UseSSEOptions {
  url: string;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  enabled?: boolean;
}

interface UseSSEReturn {
  status: ConnectionStatus;
  lastUpdate: number;
  error: string | null;
  reconnect: () => void;
}

export function useSSE({
  url,
  onMessage,
  onError,
  enabled = true,
}: UseSSEOptions): UseSSEReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(() => {
    if (!enabled) return;

    console.log('[SSE] Connecting to:', url);
    setStatus('reconnecting');

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('open', () => {
        console.log('[SSE] Connected');
        setStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
      });

      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastUpdate(Date.now());
          onMessage?.(data);
        } catch (err) {
          console.error('[SSE] Failed to parse message:', err);
          setError('Failed to parse SSE message');
        }
      });

      eventSource.addEventListener('error', (event) => {
        console.error('[SSE] Error:', event);
        setStatus('disconnected');
        setError('Connection error');
        eventSource.close();

        onError?.(event);

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );
        reconnectAttemptsRef.current++;

        console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      });
    } catch (err) {
      console.error('[SSE] Failed to create EventSource:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setStatus('disconnected');
    }
  }, [url, enabled, onMessage, onError]);

  /**
   * Manually trigger reconnection
   */
  const reconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  /**
   * Initialize connection
   */
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      console.log('[SSE] Cleanup');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, connect]);

  return {
    status,
    lastUpdate,
    error,
    reconnect,
  };
}
