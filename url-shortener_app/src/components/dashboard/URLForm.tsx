'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Input, Button } from '@/components/common';

const LINK_LIMIT = 100;

interface URLFormProps {
  originalUrl: string;
  onUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  fetchingUrls: boolean;
  onRefresh: () => void;
  urlCount: number;
}

export default function URLForm({
  originalUrl,
  onUrlChange,
  onSubmit,
  loading,
  fetchingUrls,
  onRefresh,
  urlCount,
}: URLFormProps) {
  const limitReached = urlCount >= LINK_LIMIT;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <form onSubmit={onSubmit} className="flex gap-3">
        <Input
          type="url"
          placeholder="Enter your long URL (e.g., https://example.com/very/long/url)"
          value={originalUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          disabled={loading || limitReached}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          disabled={loading || limitReached}
        >
          Shorten
        </Button>
        <button
          onClick={onRefresh}
          disabled={fetchingUrls}
          className="px-4 py-2 cursor-pointer rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          title="Refresh URLs"
        >
          <RefreshCw size={18} className={fetchingUrls ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </form>
    </div>
  );
}
