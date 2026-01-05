import pool from '../config/database';
import { generateShortCode, isValidUrl } from '../utils/shortCode';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors';

export interface CreateUrlPayload {
  originalUrl: string;
}

export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  shortUrl: string;
}

// Create shortened URL
export const createUrl = async (
  userId: string,
  payload: CreateUrlPayload
): Promise<UrlResponse> => {
  const { originalUrl } = payload;

  // Validate URL
  if (!originalUrl) {
    throw new ValidationError('Original URL is required');
  }

  if (!isValidUrl(originalUrl)) {
    throw new ValidationError('Invalid URL format');
  }

  // Generate unique short code
  let shortCode = generateShortCode();
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const existing = await pool.query(
      'SELECT id FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (existing.rows.length === 0) break;

    shortCode = generateShortCode();
    attempts++;
  }

  if (attempts === maxAttempts) {
    throw new ConflictError('Failed to generate unique short code');
  }

  // Insert into database
  const result = await pool.query(
    'INSERT INTO urls (user_id, original_url, short_code) VALUES ($1, $2, $3) RETURNING id, original_url, short_code, clicks, created_at',
    [userId, originalUrl, shortCode]
  );

  const url = result.rows[0];

  return {
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks,
    createdAt: url.created_at,
    shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/urls/${url.short_code}`,
  };
};

// Get URL by short code and increment clicks
export const getUrlByShortCode = async (shortCode: string): Promise<UrlResponse> => {
  const result = await pool.query(
    'SELECT id, original_url, short_code, clicks, created_at, user_id FROM urls WHERE short_code = $1',
    [shortCode]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('URL');
  }

  const url = result.rows[0];

  // Increment clicks
  await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE id = $1', [url.id]);

  return {
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks + 1,
    createdAt: url.created_at,
    shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/urls/${url.short_code}`,
  };
};

// Get URL by ID
export const getUrlById = async (id: string, userId: string): Promise<UrlResponse> => {
  const result = await pool.query(
    'SELECT id, original_url, short_code, clicks, created_at FROM urls WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('URL');
  }

  const url = result.rows[0];

  return {
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks,
    createdAt: url.created_at,
    shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/urls/${url.short_code}`,
  };
};

// Get all URLs for user
export const getUserUrls = async (userId: string) => {
  const result = await pool.query(
    'SELECT id, original_url, short_code, clicks, created_at FROM urls WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  return result.rows.map((url) => ({
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    clicks: url.clicks,
    createdAt: url.created_at,
    shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/api/urls/${url.short_code}`,
  }));
};

// Delete URL
export const deleteUrl = async (id: string, userId: string): Promise<void> => {
  const result = await pool.query(
    'DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('URL');
  }
};
