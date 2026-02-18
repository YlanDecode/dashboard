/**
 * Network Chart Component
 * Displays network RX/TX traffic with dual lines
 */

'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatTimestamp, formatMbps } from '@/lib/utils/formatters';
import type { NetworkDataPoint } from '@/lib/types/metrics';

interface NetworkChartProps {
  data: NetworkDataPoint[];
}

export const NetworkChart = memo(function NetworkChart({ data }: NetworkChartProps) {
  const option = useMemo(() => {
    const timestamps = data.map(d => d.timestamp);
    const rxValues = data.map(d => d.rx);
    const txValues = data.map(d => d.tx);

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#18181b',
        },
        formatter: (params: any) => {
          const time = formatTimestamp(params[0].axisValue);
          const rx = formatMbps(params[0].value);
          const tx = formatMbps(params[1].value);
          return `
            <div style="font-size: 12px;">
              <div style="color: #71717a; margin-bottom: 4px;">${time}</div>
              <div style="margin: 2px 0;"><span style="color: #10b981;">▼</span> RX: ${rx}</div>
              <div style="margin: 2px 0;"><span style="color: #3b82f6;">▲</span> TX: ${tx}</div>
            </div>
          `;
        },
      },
      legend: {
        data: ['Receive (RX)', 'Transmit (TX)'],
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
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLabel: {
          formatter: formatTimestamp,
          color: '#71717a',
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => formatMbps(v),
          color: '#71717a',
          fontSize: 11,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f4f4f5',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: 'Receive (RX)',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#10b981', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#10b98140' },
                { offset: 1, color: '#10b98105' },
              ],
            },
          },
          data: rxValues,
        },
        {
          name: 'Transmit (TX)',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#3b82f6', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f640' },
                { offset: 1, color: '#3b82f605' },
              ],
            },
          },
          data: txValues,
        },
      ],
      animation: true,
      animationDuration: 300,
    };
  }, [data]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '250px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
});
