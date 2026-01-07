'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border rounded-lg p-4 shadow-md ${getBackgroundColor(
            toast.type
          )} ${getTextColor(toast.type)} flex items-center gap-3 max-w-sm`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
