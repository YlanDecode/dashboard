/**
 * Data Windowing Utilities
 * Functions for managing time-series data windows and downsampling
 */

/**
 * Maintain a fixed window of data points
 * Keeps only the last N items in the array
 */
export function maintainWindow<T>(
  data: T[],
  newItem: T,
  maxSize: number = 100
): T[] {
  const updated = [...data, newItem];
  return updated.length > maxSize ? updated.slice(-maxSize) : updated;
}

/**
 * Downsample data by taking every Nth point
 * Used when displaying large datasets
 */
export function downsampleData<T extends { timestamp: number }>(
  data: T[],
  targetPoints: number
): T[] {
  if (data.length <= targetPoints) {
    return data;
  }

  const step = Math.ceil(data.length / targetPoints);
  return data.filter((_, index) => index % step === 0);
}

/**
 * Downsample using average (for smoother charts)
 */
export function downsampleWithAverage<T extends { timestamp: number; value: number }>(
  data: T[],
  targetPoints: number
): T[] {
  if (data.length <= targetPoints) {
    return data;
  }

  const bucketSize = Math.ceil(data.length / targetPoints);
  const downsampled: T[] = [];

  for (let i = 0; i < data.length; i += bucketSize) {
    const bucket = data.slice(i, i + bucketSize);
    const avgValue = bucket.reduce((sum, item) => sum + item.value, 0) / bucket.length;
    const midTimestamp = bucket[Math.floor(bucket.length / 2)].timestamp;

    downsampled.push({
      ...bucket[0],
      timestamp: midTimestamp,
      value: avgValue,
    });
  }

  return downsampled;
}

/**
 * Get data for a specific time range
 */
export function getDataInRange<T extends { timestamp: number }>(
  data: T[],
  startTime: number,
  endTime: number
): T[] {
  return data.filter(
    (item) => item.timestamp >= startTime && item.timestamp <= endTime
  );
}

/**
 * Get last N minutes of data
 */
export function getLastMinutes<T extends { timestamp: number }>(
  data: T[],
  minutes: number
): T[] {
  const now = Date.now();
  const cutoff = now - minutes * 60 * 1000;
  return data.filter((item) => item.timestamp >= cutoff);
}
