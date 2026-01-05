import { Router } from 'express';
import {
  createUrlController,
  redirectUrlController,
  getUrlController,
  getUserUrlsController,
  deleteUrlController,
  getAnalyticsController,
} from '../controllers/url.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/urls:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/URL'
 *       400:
 *         description: Invalid URL
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, createUrlController);

/**
 * @swagger
 * /api/urls/{shortCode}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       301:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */
router.get('/:shortCode', redirectUrlController);

/**
 * @swagger
 * /api/urls/list/all:
 *   get:
 *     summary: Get all user's URLs
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URLs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/URL'
 *       401:
 *         description: Unauthorized
 */
router.get('/list/all', authMiddleware, getUserUrlsController);

/**
 * @swagger
 * /api/urls/detail/{id}:
 *   get:
 *     summary: Get URL details by ID
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: URL retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/URL'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: URL deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found
 */
router.get('/detail/:id', authMiddleware, getUrlController);
router.delete('/detail/:id', authMiddleware, deleteUrlController);

/**
 * @swagger
 * /api/urls/analytics/{id}:
 *   get:
 *     summary: Get analytics for a shortened URL
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Analytics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClicks:
 *                       type: number
 *                     uniqueVisitors:
 *                       type: number
 *                     topReferrers:
 *                       type: array
 *                     recentVisits:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found
 */
router.get('/analytics/:id', authMiddleware, getAnalyticsController);

export default router;
