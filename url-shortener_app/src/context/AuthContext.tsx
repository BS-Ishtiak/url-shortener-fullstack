'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import authService from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = authService.getAccessToken();
        const storedUser = authService.getUser();

        if (storedUser && accessToken) {
          // Validate token by fetching profile
          const response = await authService.getProfile(accessToken);
          const user = response.data;
          
          // Preserve accessToken and refreshToken from localStorage
          user.accessToken = accessToken;
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            user.refreshToken = refreshToken;
          }
          
          setUser(user);
        } else {
          // No stored data, user is not authenticated
          setUser(null);
        }
      } catch (error) {
        // Token is invalid or expired, clear storage and logout
        authService.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    authService.setTokens(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authService.clearTokens();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setLoading: setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
