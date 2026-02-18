/**
 * Time Series Chart Component
 * Line chart for displaying metrics over time
 */

'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatTimestamp } from '@/lib/utils/formatters';
import type { MetricDataPoint } from '@/lib/types/metrics';

interface TimeSeriesChartProps {
  data: MetricDataPoint[];
  color?: string;
  yAxisFormatter?: (value: number) => string;
  areaGradient?: boolean;
}

export const TimeSeriesChart = memo(function TimeSeriesChart({
  data,
  color = '#3b82f6',
  yAxisFormatter = (v) => `${v.toFixed(1)}`,
  areaGradient = true,
}: TimeSeriesChartProps) {
  const option = useMemo(() => {
    const timestamps = data.map(d => d.timestamp);
    const values = data.map(d => d.value);

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
          const param = params[0];
          return `
            <div style="font-size: 12px;">
              <div style="color: #71717a; margin-bottom: 4px;">${formatTimestamp(param.axisValue)}</div>
              <div style="font-weight: 600;">${yAxisFormatter(param.value)}</div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
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
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: yAxisFormatter,
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
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color,
            width: 2,
          },
          areaStyle: areaGradient
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: `${color}40` },
                    { offset: 1, color: `${color}05` },
                  ],
                },
              }
            : undefined,
          data: values,
        },
      ],
      animation: true,
      animationDuration: 300,
    };
  }, [data, color, yAxisFormatter, areaGradient]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '250px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
});
