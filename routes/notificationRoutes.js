import express from 'express';
import { sendEmailNotification } from '../controllers/notificationController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: SMS and email notifications
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/notifications/email:
 *   post:
 *     summary: Send email
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *               html:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 */
router.post('/email', sendEmailNotification);

export default router; 