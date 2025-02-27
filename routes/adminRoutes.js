import express from 'express';
import { getOutletStatus, generateReports, updateUser ,getUsers} from '../controllers/adminController.js';
import { verifyToken, checkRoles } from '../utils/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative endpoints
 */

router.use(verifyToken);
router.use(checkRoles(['admin']));

/**
 * @swagger
 * /api/admin/outlets:
 *   get:
 *     summary: Get outlet statuses
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Outlet status data
 */
router.get('/outlets', getOutletStatus);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Generate system reports
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Report data
 */
router.get('/reports', generateReports);

router.put('/users/:id', verifyToken, checkRoles(['admin']), updateUser);
router.get('/users', verifyToken, checkRoles(['admin']), getUsers);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with selected fields(filters can give eg-/api/users?role=admin){admin only}
 *     description: Retrieve a list of all users, returning only the name, email, phone, and NIC.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with selected fields
 *         
 */


export default router; 