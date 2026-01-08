'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard, useSocket } from '@/hooks';
import { ConfirmationModal } from '@/components/common';
import { useToast } from '@/context/ToastContext';
import urlService from '@/services/url.service';
import { useCopyToClipboard } from '@/hooks';
import { ShortenedUrl } from '@/types';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard_items/DashboardHeader';
import UsageIndicator from '@/components/dashboard_items/UsageIndicator';
import URLForm from '@/components/dashboard_items/URLForm';
import SearchFilter from '@/components/dashboard_items/SearchFilter';
import URLTable from '@/components/dashboard_items/URLTable';
import PaginationFooter from '@/components/dashboard_items/PaginationFooter';

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
  React.useEffect(() => {
    if (!isLoading && user?.accessToken) {
      loadUrls();
    } else if (!isLoading && !user?.accessToken) {
      setFetchingUrls(false);
    }
  }, [isLoading, user?.accessToken]);

  // Listen for real-time click updates
  React.useEffect(() => {
    if (!user?.id) {
      console.log('⏳ Waiting for user ID...');
      return;
    }

    console.log('🎧 Setting up click listener for user:', user.id);
    
    const unsubscribe = onUrlClicked((data: { urlId: string; clicks: number; timestamp: string }) => {
      console.log('📬 Dashboard received click update:', data);
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === data.urlId ? { ...url, clicks: data.clicks } : url
        )
      );
      addToast(`URL "${data.urlId.slice(0, 8)}" was clicked! (${data.clicks} total)`, 'info');
    });

    return unsubscribe;
  }, [user?.id, onUrlClicked, addToast]);

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

    if (urls.length >= 100) {
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
      <DashboardHeader userEmail={user?.email} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Usage Indicator */}
          <UsageIndicator currentUsage={urls.length} />

          {/* URL Form */}
          <URLForm
            originalUrl={originalUrl}
            onUrlChange={setOriginalUrl}
            onSubmit={handleCreateUrl}
            loading={loading}
            fetchingUrls={fetchingUrls}
            onRefresh={loadUrls}
            urlCount={urls.length}
          />

          {/* Search and Filter */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClear={() => setSearchTerm('')}
            resultCount={filteredUrls.length}
          />

          {/* URL Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <URLTable
              paginatedUrls={paginatedUrls}
              fetchingUrls={fetchingUrls}
              error={error}
              urls={urls}
              onCopyShortUrl={handleCopyShortUrl}
              onDeleteClick={handleDeleteClick}
              getShortUrlDisplay={getShortUrlDisplay}
            />

            {/* Pagination Footer */}
            {!fetchingUrls && !error && urls.length > 0 && (
              <PaginationFooter
                totalPages={totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalUrls={filteredUrls.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
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
