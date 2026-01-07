'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks';
import { MainLayout } from '@/layouts';
import { Input, Button, LoadingSpinner } from '@/components/common';
import { useToast } from '@/context/ToastContext';
import urlService from '@/services/url.service';
import { useCopyToClipboard } from '@/hooks';
import { ShortenedUrl } from '@/types';

export default function DashboardPage() {
  useAuthGuard();

  const { user } = useAuth();
  const { addToast } = useToast();
  const { copy } = useCopyToClipboard();

  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [fetchingUrls, setFetchingUrls] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch URLs on mount
  React.useEffect(() => {
    if (user?.accessToken) {
      loadUrls();
    }
  }, [user?.accessToken]);

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
      addToast('Copied to clipboard!', 'success');
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Your Shortened URLs</h2>

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
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Original URL</th>
                    <th className="text-left py-3 px-4">Short Code</th>
                    <th className="text-left py-3 px-4">Clicks</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <tr key={url.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block max-w-xs"
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </a>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{url.shortCode}</td>
                      <td className="py-3 px-4">{url.clicks}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyShortUrl(url.shortUrl)}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(url.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
