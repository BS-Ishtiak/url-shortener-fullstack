import { Request, Response, NextFunction } from 'express';
import {
  createUrl,
  getUrlByShortCode,
  getUrlById,
  getUserUrls,
  deleteUrl,
} from '../services/url.service';
import { logClick, getUrlAnalytics, getRecentVisits } from '../services/analytics.service';
import { successResponse } from '../utils/response';

// Create shortened URL
export const createUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const result = await createUrl(userId, req.body);

    res.status(201).json(successResponse('URL shortened successfully', result));
  } catch (error) {
    next(error);
  }
};

// Redirect to original URL (with analytics tracking)
export const redirectUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const urlData = await getUrlByShortCode(shortCode);

    // Log analytics data
    await logClick({
      urlId: urlData.id,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] as string | undefined,
    });

    // Redirect to original URL
    res.redirect(301, urlData.originalUrl);
  } catch (error) {
    next(error);
  }
};

// Get URL details
export const getUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const result = await getUrlById(id, userId);

    res.status(200).json(successResponse('URL retrieved', result));
  } catch (error) {
    next(error);
  }
};

// Get all user URLs
export const getUserUrlsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const results = await getUserUrls(userId);

    res.status(200).json(successResponse('URLs retrieved', results));
  } catch (error) {
    next(error);
  }
};

// Delete URL
export const deleteUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const { id } = req.params;
    await deleteUrl(id, userId);

    res.status(200).json(successResponse('URL deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Get URL analytics
export const getAnalyticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id as string;
    const { id } = req.params;

    // Verify URL belongs to user
    await getUrlById(id, userId);

    // Get analytics
    const analytics = await getUrlAnalytics(id);
    const recentVisits = await getRecentVisits(id, 10);

    res.status(200).json(
      successResponse('Analytics retrieved', {
        ...analytics,
        recentVisits,
      })
    );
  } catch (error) {
    next(error);
  }
};
