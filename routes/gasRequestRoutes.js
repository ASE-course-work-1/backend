import express from "express";
import {
  requestGas,
  checkAvailability,
  getTokenStatus,
  getAllRequests,
  getRequestById,
  getRequestsByOutlet,
  getManagerOutletRequests,
} from "../controllers/gasRequestController.js";
import { verifyToken, checkRoles } from "../utils/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gas Requests
 *   description: Gas cylinder request management
 */

router.use(verifyToken, checkRoles(["consumer"]));

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
router.post("/", verifyToken, checkRoles(["consumer"]), requestGas);

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
router.get("/availability", checkAvailability);

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
router.get("/status/:token", getTokenStatus);

/**
 * @swagger
 * /api/requests/all:
 *   get:
 *     summary: Get all gas requests (Public)
 *     tags: [Gas Requests]
 *     description: Retrieve a list of all gas requests with consumer and outlet details. No authentication required.
 *     responses:
 *       200:
 *         description: List of all gas requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Request ID
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   token:
 *                     type: string
 *                     description: Request token
 *                     example: TKN-384752
 *                   quantity:
 *                     type: number
 *                     description: Number of cylinders requested
 *                     example: 1
 *                   status:
 *                     type: string
 *                     enum: [pending, processing, delivered, cancelled]
 *                     example: pending
 *                   address:
 *                     type: string
 *                     description: Delivery address
 *                     example: "123 Main Street, Colombo"
 *                   consumerId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "0712345678"
 *                   outletId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Main Branch"
 *                       location:
 *                         type: string
 *                         example: "City Center"
 *                       district:
 *                         type: string
 *                         example: "Colombo"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-18T12:34:56.789Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-18T12:34:56.789Z"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get("/all", getAllRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get gas request by ID (Public)
 *     tags: [Gas Requests]
 *     description: Retrieve detailed information about a specific gas request. No authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the gas request
 *         example: 65f7b1e66a2d4c3a74e3f4a3
 *     responses:
 *       200:
 *         description: Gas request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f7b1e66a2d4c3a74e3f4a3
 *                 token:
 *                   type: string
 *                   example: TKN-384752
 *                 quantity:
 *                   type: number
 *                   example: 1
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, delivered, cancelled]
 *                   example: pending
 *                 address:
 *                   type: string
 *                   example: "123 Main Street, Colombo"
 *                 consumerId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phone:
 *                       type: string
 *                       example: "0712345678"
 *                 outletId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Main Branch"
 *                     location:
 *                       type: string
 *                       example: "City Center"
 *                     district:
 *                       type: string
 *                       example: "Colombo"
 *                     contact:
 *                       type: string
 *                       example: "0112345678"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-18T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-18T12:34:56.789Z"
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request not found
 *       500:
 *         description: Server error
 */

router.get("/:id", getRequestById);

/**
 * @swagger
 * /api/requests/outlet/{outletId}:
 *   get:
 *     summary: Get all gas requests for a specific outlet (Public)
 *     tags: [Gas Requests]
 *     description: Retrieve all gas requests for a specific outlet/branch. Sorted by creation date (newest first).
 *     parameters:
 *       - in: path
 *         name: outletId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the outlet
 *         example: 65f7b1e66a2d4c3a74e3f4a2
 *     responses:
 *       200:
 *         description: List of gas requests for the specified outlet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   token:
 *                     type: string
 *                     example: TKN-384752
 *                   quantity:
 *                     type: number
 *                     example: 1
 *                   status:
 *                     type: string
 *                     enum: [pending, processing, delivered, cancelled]
 *                   address:
 *                     type: string
 *                     example: "123 Main Street, Colombo"
 *                   consumerId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "0712345678"
 *                   outletId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Main Branch"
 *                       location:
 *                         type: string
 *                         example: "City Center"
 *                       district:
 *                         type: string
 *                         example: "Colombo"
 *                       contact:
 *                         type: string
 *                         example: "0112345678"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get("/outlet/:outletId", getRequestsByOutlet);

/**
 * @swagger
 * /api/requests/manager/requests:
 *   get:
 *     summary: Get all gas requests for logged-in manager's outlet
 *     tags: [Gas Requests]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all gas requests for the outlet where the authenticated manager is assigned
 *     responses:
 *       200:
 *         description: List of gas requests for manager's outlet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   token:
 *                     type: string
 *                     example: TKN-384752
 *                   quantity:
 *                     type: number
 *                     example: 1
 *                   status:
 *                     type: string
 *                     enum: [pending, processing, delivered, cancelled]
 *                     example: pending
 *                   address:
 *                     type: string
 *                     example: "123 Main Street, Colombo"
 *                   consumerId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "0712345678"
 *                   outletId:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Main Branch"
 *                       location:
 *                         type: string
 *                         example: "City Center"
 *                       district:
 *                         type: string
 *                         example: "Colombo"
 *                       contact:
 *                         type: string
 *                         example: "0112345678"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (not an outlet manager)
 *       404:
 *         description: No outlet found for this manager
 *       500:
 *         description: Server error
 */

router.get(
  "/manager/requests",
  verifyToken,
  checkRoles(["outlet_manager"]),
  getManagerOutletRequests
);

export default router;
