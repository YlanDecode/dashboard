/**
 * Disk I/O Chart Component
 * Horizontal bar chart showing disk I/O per device
 */

'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { DiskIODataPoint } from '@/lib/types/metrics';

interface DiskIOChartProps {
  data: DiskIODataPoint[];
}

export const DiskIOChart = memo(function DiskIOChart({ data }: DiskIOChartProps) {
  const option = useMemo(() => {
    // Get unique devices from the latest data points
    const latestDevices = new Map<string, { read: number; write: number }>();

    // Get the most recent data for each device
    data.slice(-5).forEach(point => {
      latestDevices.set(point.device, {
        read: point.readMBps,
        write: point.writeMBps,
      });
    });

    const devices = Array.from(latestDevices.keys());
    const readValues = Array.from(latestDevices.values()).map(v => v.read);
    const writeValues = Array.from(latestDevices.values()).map(v => v.write);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#18181b',
        },
        formatter: (params: any) => {
          return `
            <div style="font-size: 12px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
              <div style="margin: 2px 0;"><span style="color: #3b82f6;">■</span> Read: ${params[0].value.toFixed(2)} MB/s</div>
              <div style="margin: 2px 0;"><span style="color: #f59e0b;">■</span> Write: ${params[1].value.toFixed(2)} MB/s</div>
            </div>
          `;
        },
      },
      legend: {
        data: ['Read', 'Write'],
        bottom: 0,
        textStyle: {
          color: '#71717a',
          fontSize: 11,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => `${v} MB/s`,
          color: '#71717a',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: '#f4f4f5',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: devices,
        axisLabel: {
          color: '#71717a',
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
      },
      series: [
        {
          name: 'Read',
          type: 'bar',
          data: readValues,
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [0, 4, 4, 0],
          },
        },
        {
          name: 'Write',
          type: 'bar',
          data: writeValues,
          itemStyle: {
            color: '#f59e0b',
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
      animation: true,
      animationDuration: 300,
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-zinc-500 dark:text-zinc-500">
        No disk I/O data available
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: '250px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
});
