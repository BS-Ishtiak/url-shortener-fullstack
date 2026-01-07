'use client';

import React from 'react';

interface PaginationFooterProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalUrls: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PaginationFooter({
  totalPages,
  currentPage,
  itemsPerPage,
  startIndex,
  endIndex,
  totalUrls,
  onPageChange,
  onItemsPerPageChange,
}: PaginationFooterProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Rows per page */}
        <div className="flex items-center gap-3">
          <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700">
            Rows per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Center: Info text */}
        <div className="text-sm text-slate-600 font-medium">
          Showing {totalUrls === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalUrls)} of {totalUrls} URLs
        </div>

        {/* Right: Pagination buttons */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-teal-500 text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
