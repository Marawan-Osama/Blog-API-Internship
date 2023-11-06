import Router from 'express';
import { login, register } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information.
 *     parameters:
 *       - in: body
 *         name: Register
 *         description: Register a new user.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             full_name:
 *               type: string
 *               description: The full name of the user. (Required)
 *             email:
 *               type: string
 *               description: The email address of the user. (Required)
 *             password:
 *               type: string
 *               description: The password for the user. (Required)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User with the provided email already exists
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user by providing email and password and set authentication cookies.
 *     parameters:
 *       - in: body
 *         name: Login
 *         description: Login.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email address of the user. (Required)
 *             password:
 *               type: string
 *               description: The password for the user. (Required)
 *     responses:
 *       200:
 *         description: User authenticated successfully and cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating successful authentication
 *       401:
 *         description: Authentication failed
 */

router.route('/register').post(register);
router.route('/login').post(login);

export default router;
