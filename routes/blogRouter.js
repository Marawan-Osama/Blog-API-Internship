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

// Use verifyToken middleware to check the user's token
router.route('/').get(verifyToken, getAllBlogs).post(verifyToken, createBlog);
router
  .route('/:blogId')
  .get(verifyToken, getBlog)
  .patch(verifyToken, updateBlog)
  .delete(verifyToken, deleteBlog);

router.route('/:blogId/like').patch(verifyToken, likeBlog);

export default router;
