// Auth Types
export interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

// URL Types
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface CreateUrlPayload {
  originalUrl: string;
}

export interface UrlResponse {
  success: boolean;
  message: string;
  data: ShortenedUrl;
}

export interface UrlListResponse {
  success: boolean;
  message: string;
  data: ShortenedUrl[];
}

// Analytics Types
export interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topReferrers: Array<{
    referrer: string;
    clicks: number;
  }>;
  recentVisits: Array<{
    id: string;
    ipAddress: string;
    userAgent: string;
    referrer: string;
    timestamp: string;
  }>;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: Analytics;
}

// API Response Types
export interface ApiErrorResponse {
  error: string;
  message: string;
  requestId: string;
}
