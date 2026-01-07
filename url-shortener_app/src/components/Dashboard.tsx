'use client';

import React, { useState } from 'react';
import { Copy, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks';
import { MainLayout } from '@/layouts';
import { Input, Button, LoadingSpinner, ConfirmationModal } from '@/components/common';
import { useToast } from '@/context/ToastContext';
import urlService from '@/services/url.service';
import { useCopyToClipboard } from '@/hooks';
import { ShortenedUrl } from '@/types';

export default function DashboardPage() {
  useAuthGuard();

  const { user, isLoading } = useAuth();
  const { addToast } = useToast();
  const { copy } = useCopyToClipboard();

  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [fetchingUrls, setFetchingUrls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Fetch URLs on mount and when auth is ready
  React.useEffect(() => {
    if (!isLoading && user?.accessToken) {
      loadUrls();
      
      // Auto-refresh every 30 seconds to show updated click counts
      const interval = setInterval(() => {
        loadUrls();
      }, 30000);
      
      return () => clearInterval(interval);
    } else if (!isLoading && !user?.accessToken) {
      setFetchingUrls(false);
    }
  }, [isLoading, user?.accessToken]);

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

    setLoading(true);
    try {
      const response = await urlService.createUrl(
        { originalUrl },
        user.accessToken
      );

      const newUrl = response.data;
      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
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
      addToast('✅ URL deleted successfully', 'success');
      
      // Close modal after a brief delay to ensure toast is visible
      setTimeout(() => {
        setDeleteModalOpen(false);
        setUrlToDelete(null);
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

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await loadUrls();
    setRefreshLoading(false);
    addToast('✅ Data refreshed', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!user?.accessToken) return;

    try {
      await urlService.deleteUrl(id, user.accessToken);
      setUrls(urls.filter((url) => url.id !== id));
      addToast('URL deleted successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete URL';
      addToast(errorMessage, 'error');
    }
  };

  const handleCopyShortUrl = async (shortUrl: string) => {
    const success = await copy(shortUrl);
    if (success) {
      addToast('✅ Copied to clipboard!', 'success');
    } else {
      addToast('Failed to copy', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Create URL Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Create Shortened URL</h2>

          <form onSubmit={handleCreateUrl} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter your long URL (e.g., https://example.com/very/long/url)"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
            >
              Shorten URL
            </Button>
          </form>
        </div>

        {/* URLs List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">📊</div>
                <h2 className="text-2xl font-bold text-gray-900">Your Shortened URLs</h2>
                {urls.length > 0 && (
                  <span className="ml-auto bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {urls.length} URL{urls.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw size={20} className={refreshLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {fetchingUrls ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          ) : urls.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No shortened URLs yet. Create one above to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-400">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-r border-gray-400">Original URL</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-r border-gray-400">Short Code</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-r border-gray-400">Clicks</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-r border-gray-400">Created</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url, index) => (
                    <tr key={url.id} className={`border-b border-gray-300 transition-colors ${index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'}`}>
                      <td className="py-4 px-6 border-r border-gray-400">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 hover:underline truncate block max-w-xs font-medium text-sm"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </a>
                      </td>
                      <td className="py-4 px-6 border-r border-gray-400">
                        <code className="bg-gray-100 text-gray-800 px-3 py-1 rounded font-mono text-sm font-semibold">
                          {url.shortCode}
                        </code>
                      </td>
                      <td className="py-4 px-6 border-r border-gray-400">
                        <span className="text-gray-900 font-semibold">{url.clicks}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm border-r border-gray-400">
                        {new Date(url.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleCopyShortUrl(url.shortUrl)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                            title="Copy URL"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(url.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
          )}
        </div>

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
    </MainLayout>
  );
}
