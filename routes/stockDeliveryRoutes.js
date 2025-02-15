import express from 'express';
import { 
  updateStock, 
  scheduleDelivery, 
  confirmDelivery 
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

/**
 * @swagger
 * /api/stock/confirm/{deliveryId}:
 *   post:
 *     summary: Confirm delivery completion
 *     tags: [Stock & Delivery]
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *     responses:
 *       200:
 *         description: Delivery confirmed
 */
router.post('/confirm/:deliveryId', confirmDelivery);

export default router; 