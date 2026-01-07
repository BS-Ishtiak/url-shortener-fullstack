'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/common';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
