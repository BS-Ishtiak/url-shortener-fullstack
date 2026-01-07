
// API Configuration - uses NEXT_PUBLIC_API_URL from .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

export { API_BASE_URL };
export const API_VERSION = '/api';

export const API_ENDPOINTS = {
 
  AUTH: {
    SIGNUP: `${API_VERSION}/auth/signup`,
    LOGIN: `${API_VERSION}/auth/login`,
    PROFILE: `${API_VERSION}/auth/profile`,
  },

  URLS: {
    CREATE: `${API_VERSION}/urls`,
    LIST: `${API_VERSION}/urls/list/all`,
    DETAIL: (id: string) => `${API_VERSION}/urls/detail/${id}`,
    DELETE: (id: string) => `${API_VERSION}/urls/detail/${id}`,
    ANALYTICS: (id: string) => `${API_VERSION}/urls/analytics/${id}`,
    REDIRECT: (shortCode: string) => `/api/urls/${shortCode}`,
  },
};
