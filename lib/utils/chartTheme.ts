/**
 * ECharts Theme Configuration
 * Provides light and dark theme configurations for charts
 */

/**
 * Get chart theme based on system preference
 */
export function getChartTheme(isDark: boolean = false) {
  return isDark ? darkTheme : lightTheme;
}

/**
 * Light theme configuration
 */
const lightTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#6b7280', // zinc-500
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  title: {
    textStyle: {
      color: '#18181b', // zinc-900
      fontWeight: 600,
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 0,
    smooth: true,
  },
  grid: {
    borderColor: '#e5e7eb', // zinc-200
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#e5e7eb',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#e5e7eb',
      },
    },
    axisLabel: {
      show: true,
      color: '#71717a', // zinc-500
    },
    splitLine: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: '#71717a',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#f4f4f5', // zinc-100
        type: 'dashed',
      },
    },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: {
      color: '#18181b',
    },
  },
  color: [
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
  ],
};

/**
 * Dark theme configuration
 */
const darkTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#9ca3af', // zinc-400
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  title: {
    textStyle: {
      color: '#fafafa', // zinc-50
      fontWeight: 600,
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 0,
    smooth: true,
  },
  grid: {
    borderColor: '#3f3f46', // zinc-700
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3f3f46',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#3f3f46',
      },
    },
    axisLabel: {
      show: true,
      color: '#71717a', // zinc-500
    },
    splitLine: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: true,
      color: '#71717a',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#27272a', // zinc-800
        type: 'dashed',
      },
    },
  },
  tooltip: {
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#3f3f46',
    borderWidth: 1,
    textStyle: {
      color: '#fafafa',
    },
  },
  color: [
    '#60a5fa', // blue-400
    '#a78bfa', // violet-400
    '#34d399', // emerald-400
    '#fbbf24', // amber-400
    '#f87171', // red-400
    '#22d3ee', // cyan-400
    '#f472b6', // pink-400
  ],
};

/**
 * Common chart options that can be merged with specific configs
 */
export const commonChartOptions = {
  animation: true,
  animationDuration: 300,
  animationEasing: 'cubicOut',
};
