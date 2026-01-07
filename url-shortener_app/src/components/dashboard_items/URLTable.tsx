'use client';

import React from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/common';
import { ShortenedUrl } from '@/types';

interface URLTableProps {
  paginatedUrls: ShortenedUrl[];
  fetchingUrls: boolean;
  error: string | null;
  urls: ShortenedUrl[];
  onCopyShortUrl: (shortUrl: string) => void;
  onDeleteClick: (id: string) => void;
  getShortUrlDisplay: (shortCode: string) => string;
}

export default function URLTable({
  paginatedUrls,
  fetchingUrls,
  error,
  urls,
  onCopyShortUrl,
  onDeleteClick,
  getShortUrlDisplay,
}: URLTableProps) {
  if (fetchingUrls) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-red-50 border-t border-red-200 p-6 text-red-700 text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-slate-600 font-medium">No shortened URLs yet</p>
          <p className="text-slate-500 text-sm mt-1">Create one above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Original URL</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Short Code</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900 text-sm">Clicks</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900 text-sm">Date</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUrls.map((url, index) => (
              <tr
                key={url.id}
                className={`border-b border-slate-200 transition-colors ${
                  index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <td className="py-4 px-6">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 truncate block max-w-xs font-medium text-sm"
                    title={url.originalUrl}
                  >
                    {url.originalUrl}
                  </a>
                </td>
                <td className="py-4 px-6">
                  <code
                    className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded font-mono text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
                    onClick={() => onCopyShortUrl(getShortUrlDisplay(url.shortCode))}
                    title={`Click to copy: ${getShortUrlDisplay(url.shortCode)}`}
                  >
                    {url.shortCode}
                  </code>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-slate-900 font-semibold">{url.clicks}</span>
                </td>
                <td className="py-4 px-6 text-center text-slate-600 text-sm">
                  {new Date(url.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onCopyShortUrl(getShortUrlDisplay(url.shortCode))}
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Copy short URL"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(url.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Delete URL"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
