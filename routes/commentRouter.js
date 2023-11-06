import Router from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  getAllComments,
  createComment,
  updateComment,
  getComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = Router();

/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments:
 *   get:
 *     summary: Get all comments for a specific blog
 *     description: Retrieve all comments associated with a specific blog.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog for which to retrieve comments.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Blog not found
 */
/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment with the provided information.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: Post Comment
 *         description: Post a new comment.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               description: The content of the comment. (Required)
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/v1/blogs/{blogsId}/comments/{commentId}:
 *   get:
 *     summary: Get a specific comment by ID
 *     description: Retrieve a specific comment by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: The ID of the comment to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments/{commentId}:
 *   patch:
 *     summary: Update a specific comment by ID
 *     description: Update a specific comment by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: The ID of the comment to delete.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: Update Comment
 *         description: Update a comment.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *               description: The content of the comment. (Required)
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
/**
 * @swagger
 * /api/v1/blogs/{blogId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a specific comment by ID
 *     description: Delete a specific comment by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         description: The ID of the blog.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: The ID of the comment to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router
  .route('/:blogId/comments')
  .get(getAllComments)
  .post(verifyToken, createComment);
router
  .route('/:blogId/comments/:commentId')
  .get(getComment)
  .patch(verifyToken, updateComment)
  .delete(verifyToken, deleteComment);

export default router;
