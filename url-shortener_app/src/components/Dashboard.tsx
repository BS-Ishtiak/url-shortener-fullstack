'use client';

import React, { useState } from 'react';
import { Copy, Trash2, LogOut, Link2, RefreshCw, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard, useSocket } from '@/hooks';
import { Input, Button, LoadingSpinner, ConfirmationModal } from '@/components/common';
import { useToast } from '@/context/ToastContext';
import urlService from '@/services/url.service';
import { useCopyToClipboard } from '@/hooks';
import { ShortenedUrl } from '@/types';
import { useRouter } from 'next/navigation';

const LINK_LIMIT = 100;

export default function DashboardPage() {
  useAuthGuard();

  const { user, isLoading, logout } = useAuth();
  const { addToast } = useToast();
  const { copy } = useCopyToClipboard();
  const router = useRouter();
  
  // Initialize Socket.io connection for real-time updates
  const { onUrlClicked } = useSocket({ userId: user?.id || null, enabled: !!user?.id });

  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [fetchingUrls, setFetchingUrls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch URLs on mount and when auth is ready
  React.useEffect(() => {
    if (!isLoading && user?.accessToken) {
      loadUrls();
    } else if (!isLoading && !user?.accessToken) {
      setFetchingUrls(false);
    }
  }, [isLoading, user?.accessToken]);

  // Listen for real-time click updates
  React.useEffect(() => {
    const unsubscribe = onUrlClicked((data: { urlId: string; clicks: number; timestamp: string }) => {
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === data.urlId ? { ...url, clicks: data.clicks } : url
        )
      );
      addToast(`URL "${data.urlId.slice(0, 8)}" was clicked! (${data.clicks} total)`, 'info');
    });

    return unsubscribe;
  }, [onUrlClicked, addToast]);

  const loadUrls = async () => {
    if (!user?.accessToken) return;

    try {
      setFetchingUrls(true);
      const response = await urlService.getUrls(user.accessToken);
      setUrls(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load URLs';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setFetchingUrls(false);
    }
  };

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      addToast('Please enter a URL', 'warning');
      return;
    }

    if (!user?.accessToken) {
      addToast('Not authenticated', 'error');
      return;
    }

    if (urls.length >= LINK_LIMIT) {
      addToast('Link limit reached. Upgrade to create more links.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await urlService.createUrl(
        { originalUrl },
        user.accessToken
      );

      const newUrl = response.data;
      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
      setCurrentPage(1);
      addToast('URL shortened successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create URL';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setUrlToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!urlToDelete || !user?.accessToken) return;

    setDeleteLoading(true);
    try {
      await urlService.deleteUrl(urlToDelete, user.accessToken);
      setUrls(urls.filter((url) => url.id !== urlToDelete));
      addToast('URL deleted successfully', 'success');

      // Close modal after a brief delay to ensure toast is visible
      setTimeout(() => {
        setDeleteModalOpen(false);
        setUrlToDelete(null);
        setDeleteLoading(false);
      }, 300);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete URL';
      addToast(errorMessage, 'error');
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setUrlToDelete(null);
  };

  const handleCopyShortUrl = async (shortUrl: string) => {
    const success = await copy(shortUrl);
    if (success) {
      addToast('Short URL copied to clipboard!', 'success');
    } else {
      addToast('Failed to copy', 'error');
    }
  };

  const getShortUrlDisplay = (shortCode: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${shortCode}`;
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully!', 'success');
    router.push('/auth/login');
  };

  const limitPercentage = (urls.length / LINK_LIMIT) * 100;
  const limitReached = urls.length >= LINK_LIMIT;

  // Filter URLs based on search term
  const filteredUrls = urls.filter((url) =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUrls = filteredUrls.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Link2 size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">URLShort</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Usage Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Links Used</h2>
              <span className="text-sm font-medium text-slate-600">{urls.length} of {LINK_LIMIT}</span>
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

          {/* URL Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <form onSubmit={handleCreateUrl} className="flex gap-3">
              <Input
                type="url"
                placeholder="Enter your long URL (e.g., https://example.com/very/long/url)"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
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
                onClick={loadUrls}
                disabled={fetchingUrls}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                title="Refresh URLs"
              >
                <RefreshCw size={18} className={fetchingUrls ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </form>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by original URL..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pr-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-slate-600 mt-3">
                Found <span className="font-semibold text-slate-900">{filteredUrls.length}</span> URL(s) matching your search
              </p>
            )}
          </div>

          {/* URL Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {fetchingUrls ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-t border-red-200 p-6 text-red-700 text-sm font-medium">
                {error}
              </div>
            ) : urls.length === 0 ? (
              <div className="p-12 text-center">
                <Link2 size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No shortened URLs yet</p>
                <p className="text-slate-500 text-sm mt-1">Create one above to get started</p>
              </div>
            ) : (
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
                            onClick={() => handleCopyShortUrl(getShortUrlDisplay(url.shortCode))} 
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
                              onClick={() => handleCopyShortUrl(getShortUrlDisplay(url.shortCode))}
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-2 rounded-lg transition-colors cursor-pointer"
                              title="Copy short URL"
                            >
                              <Copy size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(url.id)}
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

                {/* Pagination Footer */}
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
                          onChange={handleItemsPerPageChange}
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
                        Showing {filteredUrls.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredUrls.length)} of {filteredUrls.length} URLs
                      </div>

                      {/* Right: Pagination buttons */}
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Prev
                        </button>

                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
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
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        title="Delete URL"
        message="Are you sure you want to delete this shortened URL? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        isDangerous
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
