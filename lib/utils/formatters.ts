/**
 * Formatting Utilities
 * Helper functions for formatting numbers, dates, and metrics
 */

import { format } from 'date-fns';

/**
 * Format percentage value
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format MB to human-readable format
 */
export function formatMB(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
}

/**
 * Format Mbps (megabits per second)
 */
export function formatMbps(mbps: number): string {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  }
  return `${mbps.toFixed(2)} Mbps`;
}

/**
 * Format timestamp to time string (HH:mm:ss)
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return '--:--:--';
  }
  try {
    return format(new Date(timestamp), 'HH:mm:ss');
  } catch {
    return '--:--:--';
  }
}

/**
 * Format timestamp to date and time
 */
export function formatDateTime(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return 'Invalid date';
  }
  try {
    return format(new Date(timestamp), 'MMM dd, HH:mm:ss');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format uptime in seconds to human-readable format
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Get color based on threshold (for gauges)
 */
export function getThresholdColor(value: number): string {
  if (value < 70) return '#10b981'; // green
  if (value < 85) return '#f59e0b'; // yellow/orange
  return '#ef4444'; // red
}
