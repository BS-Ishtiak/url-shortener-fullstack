import pool from '../config/database';
import { NotFoundError } from '../utils/errors';

export interface AnalyticsData {
  urlId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

// Log a click/visit
export const logClick = async (data: AnalyticsData): Promise<void> => {
  try {
    await pool.query(
      'INSERT INTO analytics (url_id, ip_address, user_agent, referrer) VALUES ($1, $2, $3, $4)',
      [data.urlId, data.ipAddress || null, data.userAgent || null, data.referrer || null]
    );
  } catch (error) {
    console.error('Error logging click:', error);
    
  }
};

// Get analytics for a URL
export const getUrlAnalytics = async (urlId: string) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_clicks,
      COUNT(DISTINCT ip_address) as unique_visitors,
      referrer,
      COUNT(*) as click_count
    FROM analytics 
    WHERE url_id = $1
    GROUP BY referrer
    ORDER BY click_count DESC
    LIMIT 10`,
    [urlId]
  );

  return {
    totalClicks: parseInt(result.rows[0]?.total_clicks || '0'),
    uniqueVisitors: parseInt(result.rows[0]?.unique_visitors || '0'),
    topReferrers: result.rows.map((row) => ({
      referrer: row.referrer || 'direct',
      clicks: parseInt(row.click_count),
    })),
  };
};

// Get recent visits for a URL
export const getRecentVisits = async (urlId: string, limit: number = 20) => {
  const result = await pool.query(
    `SELECT 
      id,
      ip_address,
      user_agent,
      referrer,
      created_at
    FROM analytics 
    WHERE url_id = $1
    ORDER BY created_at DESC
    LIMIT $2`,
    [urlId, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    referrer: row.referrer || 'direct',
    timestamp: row.created_at,
  }));
};
