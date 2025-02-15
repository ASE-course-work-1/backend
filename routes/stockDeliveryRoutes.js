import express from 'express';
import { 
  updateStock, 
  scheduleDelivery, 
  confirmDelivery,
  createDelivery
} from '../controllers/stockDeliveryController.js';
import { verifyToken, checkRoles } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock & Delivery
 *   description: Inventory management and delivery scheduling
 */

router.use(verifyToken);
router.use(checkRoles(['admin', 'outlet_manager']));

/**
 * @swagger
 * /api/stock/deliveries:
 *   post:
 *     summary: Create a new delivery schedule
 *     tags: [Stock & Delivery]
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
 *               - scheduledDate
 *             properties:
 *               outletId:
 *                 type: string
 *                 example: 65f7b1e66a2d4c3a74e3f4a2
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-03-20T14:30:00Z
 *               requestId:
 *                 type: string
 *                 example: 65f7b1e66a2d4c3a74e3f4a1
 *     responses:
 *       201:
 *         description: Successfully created new delivery schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Invalid input data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/deliveries', createDelivery);

/**
 * @swagger
 * /api/stock/confirm/{deliveryId}:
 *   post:
 *     summary: Confirm delivery completion
 *     tags: [Stock & Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a3
 *     responses:
 *       200:
 *         description: Delivery confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Server error
 */
router.post('/confirm/:deliveryId', confirmDelivery);

/**
 * @swagger
 * /api/stock/{outletId}:
 *   post:
 *     summary: Update outlet stock (Admin/Manager only)
 *     tags: [Stock & Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: outletId
 *         required: true
 *         schema:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a2
 *         description: Valid MongoDB ID of the outlet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 500
 *                 description: New stock quantity to set
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Outlet'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Outlet not found
 *       500:
 *         description: Server error
 */
router.post('/:outletId', updateStock);

/**
 * @swagger
 * /api/stock/schedule/{outletId}:
 *   get:
 *     summary: Get scheduled deliveries
 *     tags: [Stock & Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: outletId
 *         required: true
 *         schema:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a2
 *     responses:
 *       200:
 *         description: List of scheduled deliveries
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 */
router.get('/schedule/:outletId', scheduleDelivery);

export default router; 