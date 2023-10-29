import Router from 'express';
import {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

// Use verifyToken middleware to check the user's token
router.route('/').get(verifyToken, getAllBlogs).post(verifyToken, createBlog);
router
  .route('/:blogId')
  .get(verifyToken, getBlog)
  .patch(verifyToken, updateBlog)
  .delete(verifyToken, deleteBlog);

export default router;
