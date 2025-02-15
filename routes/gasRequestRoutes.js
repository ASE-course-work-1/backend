import express from 'express';
import { 
  requestGas, 
  checkAvailability, 
  getTokenStatus 
} from '../controllers/gasRequestController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gas Requests
 *   description: Gas cylinder request management
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create new gas request
 *     tags: [Gas Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - outletId
 *             properties:
 *               outletId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created
 */
router.post('/', requestGas);

/**
 * @swagger
 * /api/requests/availability:
 *   get:
 *     summary: Check gas availability
 *     tags: [Gas Requests]
 *     responses:
 *       200:
 *         description: List of outlets with stock
 */
router.get('/availability', checkAvailability);

/**
 * @swagger
 * /api/requests/status/{token}:
 *   get:
 *     summary: Check token status
 *     tags: [Gas Requests]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token status details
 */
router.get('/status/:token', getTokenStatus);

export default router; 