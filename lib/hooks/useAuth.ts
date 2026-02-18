/**
 * useAuth Hook
 * Convenient wrapper around the auth store
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const {
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
}
