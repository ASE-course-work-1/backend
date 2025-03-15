import express from "express";
import {
  register,
  login,
  verifyIdentity,
  getAllUsers,
} from "../controllers/authController.js";
import { check } from "express-validator";
import { verifyToken, checkRoles } from "../utils/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *               role:
 *                 type: string
 *                 enum: [consumer, outlet_manager, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/verify-identity:
 *   post:
 *     summary: Verify user email with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *     security:
 *       - []
 */
router.post("/verify-identity", verifyIdentity);

// Add new public route for getting all users
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (Public)
 *     tags: [Authentication]
 *     description: Retrieve a list of all users with basic information. No authentication required.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                     example: 65f7b1e66a2d4c3a74e3f4a3
 *                   name:
 *                     type: string
 *                     description: User's full name
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                     example: john@example.com
 *                   phone:
 *                     type: string
 *                     description: User's contact number
 *                     example: "0712345678"
 *                   role:
 *                     type: string
 *                     description: User's role in the system
 *                     enum: [consumer, outlet_manager, admin]
 *                     example: consumer
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

export default router;
