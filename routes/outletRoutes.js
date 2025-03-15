import express from "express";
import {
  createOutlet,
  getOutlets,
  getOutlet,
  updateOutlet,
  deleteOutlet,
  getOutletsPublic,
  getPublicOutlets,
  assignManager,
  getUnassignedManagers,
  getUnassignedOutlets,
} from "../controllers/outletController.js";
import { verifyToken, checkRoles } from "../utils/authMiddleware.js";
import { registerOutletManager } from "../controllers/authController.js";
import { updateRequestStatus } from "../controllers/gasRequestController.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicOutlets);
router.get("/managers/unassigned", getUnassignedManagers);
router.get("/unassigned", getUnassignedOutlets); // Correct endpoint placement

// Protected routes
router.post("/", verifyToken, checkRoles(["admin"]), createOutlet);
router.get(
  "/",
  verifyToken,
  checkRoles(["admin", "outlet_manager"]),
  getOutlets
);
router.get(
  "/:id",
  verifyToken,
  checkRoles(["admin", "outlet_manager"]),
  getOutlet
);
router.put("/:id", verifyToken, checkRoles(["admin"]), updateOutlet);
router.delete("/:id", verifyToken, checkRoles(["admin"]), deleteOutlet);
router.post(
  "/managers",
  verifyToken,
  checkRoles(["admin"]),
  registerOutletManager
);
router.put("/:id/manager", verifyToken, checkRoles(["admin"]), assignManager);
router.put(
  "/requests/:id/status",
  verifyToken,
  checkRoles(["outlet_manager"]),
  updateRequestStatus
);

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a3
 *         consumerId:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a1
 *         outletId:
 *           type: string
 *           example: 65f7b1e66a2d4c3a74e3f4a2
 *         token:
 *           type: string
 *           example: TKN-384752
 *         quantity:
 *           type: number
 *           example: 1
 *         address:
 *           type: string
 *           example: "123 Main Street, Colombo"
 *         status:
 *           type: string
 *           enum: [pending, processing, delivered, cancelled]
 *           example: processing
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-18T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-18T12:35:10.123Z
 */

/**
 * @swagger
 * /api/outlets/requests/{id}/status:
 *   put:
 *     summary: Update gas request status (Outlet Manager only)
 *     description: Update the status of a gas request and notify the consumer via email
 *     tags: [Outlets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the gas request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, delivered, cancelled]
 *                 description: New status of the request
 *                 example: processing
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid status value or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid status value"
 *       403:
 *         description: Unauthorized access (manager not assigned to outlet)
 *       404:
 *         description: Gas request not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/outlets/managers/unassigned:
 *   get:
 *     summary: Get outlet managers without assigned outlets (Public)
 *     tags: [Outlets]
 *     description: Retrieve a list of outlet managers who are not assigned to any outlet. No authentication required.
 *     responses:
 *       200:
 *         description: List of unassigned outlet managers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Manager's ID
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   name:
 *                     type: string
 *                     description: Manager's full name
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: Manager's email address
 *                     example: john@example.com
 *                   phone:
 *                     type: string
 *                     description: Manager's contact number
 *                     example: "0712345678"
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

/**
 * @swagger
 * /api/outlets/unassigned:
 *   get:
 *     summary: Get outlets without assigned managers (Public)
 *     tags: [Outlets]
 *     description: Retrieve a list of outlets that don't have managers assigned. No authentication required.
 *     responses:
 *       200:
 *         description: List of unassigned outlets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Outlet ID
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   name:
 *                     type: string
 *                     description: Outlet name
 *                     example: "Main Branch"
 *                   location:
 *                     type: string
 *                     description: Outlet location
 *                     example: "City Center"
 *                   district:
 *                     type: string
 *                     description: Outlet district
 *                     example: "Colombo"
 *                   contact:
 *                     type: string
 *                     description: Contact number
 *                     example: "0112345678"
 *                   capacity:
 *                     type: number
 *                     description: Storage capacity
 *                     example: 1000
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

// Add similar docs for GET, GET by ID, PUT, DELETE

export default router;
