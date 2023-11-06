import Router from 'express';
import {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from '../controllers/blogController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get a list of all blogs
 *     description: Retrieve a list of all blogs created by the authenticated user.
 *     responses:
 *       200:
 *         description: A list of blogs
 */

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog with the provided parameters.
 *     parameters:
 *       - in: body
 *         name: Blog
 *         description: The blog.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The title of the blog. (Required)
 *             content:
 *               type: string
 *               description: The content of the blog. (Required)
 *             co_authors:
 *               type: array
 *               items:
 *                 type: string
 *                 description: An array of co-authors' IDs (optional).
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *   get:
 *     summary: Get a specific blog by ID
 *     description: Retrieve a specific blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *   patch:
 *     summary: Update a blog by ID
 *     description: Update a specific blog with the provided data.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: Update Blog
 *         description: Blog Update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: The title of the blog. (Required)
 *             content:
 *               type: string
 *               description: The content of the blog. (Required)
 *            co_authors:
 *              type: array
 *             items:
 *              type: string
 *             description: An array of co-authors' IDs (optional).
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
 *                   description: Message indicating successful authentication and Blog updated successfully
 *       404:
 *         description: Blog not found
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/v1/blogs/{blogId}:
 *   delete:
 *     summary: Delete a specific blog by ID
 *     description: Delete a specific blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 */

router.route('/').get(verifyToken, getAllBlogs).post(verifyToken, createBlog);
router
  .route('/:blogId')
  .get(verifyToken, getBlog)
  .patch(verifyToken, updateBlog)
  .delete(verifyToken, deleteBlog);
/**
 * @swagger
 * /api/v1/blogs/{blogId}/like:
 *   patch:
 *     summary: Like a specific blog by ID
 *     description: Like a specific blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog to like.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog liked successfully
 *       404:
 *         description: Blog not found
 */
router.route('/:blogId/like').patch(verifyToken, likeBlog);

export default router;
