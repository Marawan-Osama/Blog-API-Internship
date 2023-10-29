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
