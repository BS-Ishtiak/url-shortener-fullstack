import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { CreateUrlPayload, UrlResponse, UrlListResponse, AnalyticsResponse } from '@/types';

class UrlService {
  private getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async createUrl(payload: CreateUrlPayload, token: string): Promise<UrlResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.URLS.CREATE}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create shortened URL');
    }

    return response.json();
  }

  async getUrls(token: string): Promise<UrlListResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.URLS.LIST}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch URLs');
    }

    return response.json();
  }

  async getUrlDetail(id: string, token: string): Promise<UrlResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.URLS.DETAIL(id)}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch URL details');
    }

    return response.json();
  }

  async deleteUrl(id: string, token: string): Promise<UrlResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.URLS.DELETE(id)}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete URL');
    }

    return response.json();
  }

  async getAnalytics(id: string, token: string): Promise<AnalyticsResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.URLS.ANALYTICS(id)}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch analytics');
    }

    return response.json();
  }
}

export default new UrlService();
