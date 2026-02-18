/**
 * Dashboard Page
 * Main entry point for the system metrics dashboard
 */

'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamically import DashboardGrid with no SSR
const DashboardGrid = dynamic(
  () => import('@/components/dashboard/DashboardGrid').then((mod) => ({ default: mod.DashboardGrid })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} text="Loading dashboard..." />
      </div>
    ),
  }
);

export default function DashboardPage() {
  return <DashboardGrid />;
}
