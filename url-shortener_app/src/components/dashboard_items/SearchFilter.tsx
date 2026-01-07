'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/common';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  resultCount: number;
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  onClear,
  resultCount,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by original URL..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pr-12"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {searchTerm && (
        <p className="text-sm text-slate-600 mt-3">
          Found <span className="font-semibold text-slate-900">{resultCount}</span> URL(s) matching your search
        </p>
      )}
    </div>
  );
}
