import express from 'express';
import { getOutletStatus, generateReports } from '../controllers/adminController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative endpoints
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/admin/outlets:
 *   get:
 *     summary: Get outlet statuses
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Outlet status data
 */
router.get('/outlets', getOutletStatus);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Generate system reports
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Report data
 */
router.get('/reports', generateReports);

export default router; 