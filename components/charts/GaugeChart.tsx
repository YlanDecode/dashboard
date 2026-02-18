/**
 * Gauge Chart Component
 * Displays a circular gauge for percentage metrics (CPU, Memory, Disk)
 */

'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThresholdColor } from '@/lib/utils/formatters';

interface GaugeChartProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
}

export const GaugeChart = memo(function GaugeChart({
  value,
  max = 100,
  label,
  unit = '%',
}: GaugeChartProps) {
  const color = getThresholdColor(value);

  const option = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max,
        radius: '90%',
        center: ['50%', '70%'],
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [value / max, color],
              [1, 'rgba(156, 163, 175, 0.15)'], // zinc-400 with opacity
            ],
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit}`,
          color: 'inherit',
          fontSize: 28,
          fontWeight: 'bold',
          offsetCenter: [0, '-10%'],
        },
        data: [
          {
            value: value.toFixed(1),
            name: label,
            title: {
              offsetCenter: [0, '30%'],
              fontSize: 14,
              color: '#9ca3af', // zinc-400
            },
          },
        ],
      },
    ],
    animation: true,
    animationDuration: 300,
  }), [value, max, label, unit, color]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '200px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
});
