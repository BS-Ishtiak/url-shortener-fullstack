'use client';

import React from 'react';

const LINK_LIMIT = 100;

interface UsageIndicatorProps {
  currentUsage: number;
}

export default function UsageIndicator({ currentUsage }: UsageIndicatorProps) {
  const limitPercentage = (currentUsage / LINK_LIMIT) * 100;
  const limitReached = currentUsage >= LINK_LIMIT;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">Links Used</h2>
        <span className="text-sm font-medium text-slate-600">{currentUsage} of {LINK_LIMIT}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            limitPercentage >= 90
              ? 'bg-red-500'
              : limitPercentage >= 70
              ? 'bg-yellow-500'
              : 'bg-teal-500'
          }`}
          style={{ width: `${Math.min(limitPercentage, 100)}%` }}
        />
      </div>
      {limitReached && (
        <p className="text-xs text-red-600 mt-3 font-medium">
          Free tier limit reached. Upgrade for unlimited links.
        </p>
      )}
    </div>
  );
}
