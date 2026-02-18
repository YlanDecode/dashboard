/**
 * Dashboard Layout
 * Layout for authenticated dashboard pages with auth check and header
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2
                   bg-white dark:bg-zinc-900
                   border border-zinc-200 dark:border-zinc-800
                   rounded-lg shadow-sm
                   text-zinc-700 dark:text-zinc-300
                   hover:bg-zinc-50 dark:hover:bg-zinc-800
                   transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}
