import express from 'express';
import { 
  updateStock, 
  scheduleDelivery, 
  confirmDelivery 
} from '../controllers/stockDeliveryController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock & Delivery
 *   description: Inventory management and delivery scheduling
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/stock/{outletId}:
 *   post:
 *     summary: Update outlet stock
 *     tags: [Stock & Delivery]
 *     parameters:
 *       - in: path
 *         name: outletId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stock updated
 */
router.post('/:outletId', updateStock);

/**
 * @swagger
 * /api/stock/schedule/{outletId}:
 *   get:
 *     summary: Get scheduled deliveries
 *     tags: [Stock & Delivery]
 *     parameters:
 *       - in: path
 *         name: outletId
 *         required: true
 *     responses:
 *       200:
 *         description: List of scheduled deliveries
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