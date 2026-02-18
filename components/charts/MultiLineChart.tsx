/**
 * Multi-Line Chart Component
 * Displays multiple time series on the same chart (for Load Average)
 */

'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatTimestamp } from '@/lib/utils/formatters';
import type { LoadAverageDataPoint } from '@/lib/types/metrics';

interface MultiLineChartProps {
  data: LoadAverageDataPoint[];
  colors?: string[];
}

export const MultiLineChart = memo(function MultiLineChart({
  data,
  colors = ['#3b82f6', '#8b5cf6', '#10b981'],
}: MultiLineChartProps) {
  const option = useMemo(() => {
    const timestamps = data.map(d => d.timestamp);
    const load1Values = data.map(d => d.load1);
    const load5Values = data.map(d => d.load5);
    const load15Values = data.map(d => d.load15);

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#18181b',
        },
      },
      legend: {
        data: ['1 min', '5 min', '15 min'],
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
          formatter: (v: number) => v.toFixed(2),
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
          name: '1 min',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: colors[0], width: 2 },
          data: load1Values,
        },
        {
          name: '5 min',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: colors[1], width: 2 },
          data: load5Values,
        },
        {
          name: '15 min',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: colors[2], width: 2 },
          data: load15Values,
        },
      ],
      animation: true,
      animationDuration: 300,
    };
  }, [data, colors]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '250px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
});
