import express from 'express';
import { sendEmailNotification, getNotifications } from '../controllers/notificationController.js';
import { verifyToken, checkRoles } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: SMS and email notifications
 */

router.use(verifyToken, checkRoles(['consumer', 'outlet_manager', 'admin']));

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

router.get('/', verifyToken, checkRoles(['consumer', 'outlet_manager', 'admin']), getNotifications);

export default router; 