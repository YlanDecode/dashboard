/**
 * Authentication Store using Zustand
 * Manages JWT token and authentication state globally
 */

import { create } from 'zustand';
import { apiClient } from '../api/client';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string, refreshToken?: string) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

/**
 * Get token from sessionStorage
 */
const getStoredToken = (): { token: string | null; refreshToken: string | null } => {
  if (typeof window === 'undefined') {
    return { token: null, refreshToken: null };
  }

  return {
    token: sessionStorage.getItem('auth_token'),
    refreshToken: sessionStorage.getItem('refresh_token'),
  };
};

/**
 * Store token in sessionStorage
 */
const storeToken = (token: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('auth_token', token);
  if (refreshToken) {
    sessionStorage.setItem('refresh_token', refreshToken);
  }
};

/**
 * Remove token from sessionStorage
 */
const removeToken = (): void => {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('refresh_token');
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Initialize auth state from sessionStorage
   */
  initializeAuth: () => {
    const { token, refreshToken } = getStoredToken();

    if (token) {
      apiClient.setToken(token);
      set({
        token,
        refreshToken,
        isAuthenticated: true
      });
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.login({ email, password });

      // Store tokens
      storeToken(response.access, response.refresh);
      apiClient.setToken(response.access);

      set({
        token: response.access,
        refreshToken: response.refresh,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      set({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  /**
   * Logout and clear all authentication data
   */
  logout: () => {
    removeToken();
    apiClient.clearToken();

    set({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Manually set token (useful for token refresh)
   */
  setToken: (token: string, refreshToken?: string) => {
    storeToken(token, refreshToken);
    apiClient.setToken(token);

    set({
      token,
      refreshToken: refreshToken || get().refreshToken,
      isAuthenticated: true,
    });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
