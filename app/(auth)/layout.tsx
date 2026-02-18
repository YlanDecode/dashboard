/**
 * Auth Layout
 * Simple centered layout for authentication pages
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - System Metrics Dashboard',
  description: 'Login to access the system metrics dashboard',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
