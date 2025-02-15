import express from 'express';
import { 
  requestGas, 
  checkAvailability, 
  getTokenStatus 
} from '../controllers/gasRequestController.js';
import { verifyToken, checkRoles } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gas Requests
 *   description: Gas cylinder request management
 */

router.use(verifyToken, checkRoles(['consumer']));

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
 *               - quantity
 *               - address
 *             properties:
 *               outletId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 2
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Colombo"
 *     responses:
 *       201:
 *         description: Request created and outlet manager notified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 consumerId:
 *                   type: string
 *                 outletId:
 *                   type: string
 *                 token:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 address:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 _id: 65f7b1e66a2d4c3a74e3f4a3
 *                 consumerId: 65f7b1e66a2d4c3a74e3f4a1
 *                 outletId: 65f7b1e66a2d4c3a74e3f4a2
 *                 token: TKN-384752
 *                 quantity: 1
 *                 address: "123 Main Street, Colombo"
 *                 status: pending
 *                 createdAt: 2024-03-18T12:34:56.789Z
 *       400:
 *         description: Gas not available at selected outlet
 */
router.post('/', 
  verifyToken, checkRoles(['consumer']),
  requestGas
);

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