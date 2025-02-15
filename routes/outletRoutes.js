import express from 'express';
import { createOutlet, getOutlets, getOutlet, updateOutlet, deleteOutlet, getOutletsPublic, getPublicOutlets, assignManager } from '../controllers/outletController.js';
import { verifyToken, checkRoles } from '../utils/authMiddleware.js';
import { registerOutletManager } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicOutlets);

// Protected routes
router.post('/', verifyToken, checkRoles(['admin']), createOutlet);
router.get('/', verifyToken, checkRoles(['admin', 'outlet_manager']), getOutlets);
router.get('/:id', verifyToken, checkRoles(['admin', 'outlet_manager']), getOutlet);
router.put('/:id', verifyToken, checkRoles(['admin']), updateOutlet);
router.delete('/:id', verifyToken, checkRoles(['admin']), deleteOutlet);
router.post('/managers', verifyToken, checkRoles(['admin']), registerOutletManager);
router.put('/:id/manager', verifyToken, checkRoles(['admin']), assignManager);

/**
 * @swagger
 * tags:
 *   name: Outlets
 *   description: Gas outlet management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Outlet:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - district
 *         - contact
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         district:
 *           type: string
 *         contact:
 *           type: string
 *         manager:
 *           type: string
 *           description: User ID of outlet manager
 *         capacity:
 *           type: number
 */

/**
 * @swagger
 * /api/outlets:
 *   post:
 *     summary: Create a new outlet (Admin only)
 *     tags: [Outlets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               district:
 *                 type: string
 *               contact:
 *                 type: string
 *               capacity:
 *                 type: number
 *               manager:
 *                 type: string
 *                 required: false
 *             example:
 *               name: "Main Outlet"
 *               location: "City Center"
 *               district: "Colombo"
 *               contact: "0112345678"
 *               capacity: 1000
 *     responses:
 *       201:
 *         description: Outlet created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/outlets/{id}/manager:
 *   put:
 *     summary: Assign manager to outlet (Admin only)
 *     tags: [Outlets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - managerId
 *             properties:
 *               managerId:
 *                 type: string
 *                 example: "65f7b1e66a2d4c3a74e3f4a3"
 *     responses:
 *       200:
 *         description: Manager assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Outlet'
 *       400:
 *         description: Invalid manager assignment
 *       404:
 *         description: Outlet not found
 */

/**
 * @swagger
 * /api/outlets/managers:
 *   post:
 *     summary: Register new outlet manager (Admin only)
 *     tags: [Outlets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - nic
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               nic:
 *                 type: string
 *     responses:
 *       201:
 *         description: Manager registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/outlets/public:
 *   get:
 *     summary: Get public outlet information (No authentication required)
 *     tags: [Outlets]
 *     responses:
 *       200:
 *         description: List of outlets with basic info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicOutlet'
 */

// Add similar docs for GET, GET by ID, PUT, DELETE

export default router; 