'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`${sizeClass} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-40">
        {spinner}
      </div>
    );
  }

  return spinner;
}
