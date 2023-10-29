import Comment from '../models/Comment.js';
import { StatusCodes } from 'http-status-codes';

export const getAllComments = async (req, res) => {
  const blogId = req.params.blogId;

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate('user', 'full_name')
      .exec();

    // Map comments to include comment ID, content, and user's name (if available)
    const commentsData = comments.map((comment) => {
      const userName = comment.user ? comment.user.full_name : 'Unknown User';
      return {
        _id: comment._id,
        content: comment.content,
        userName,
      };
    });

    res.status(StatusCodes.OK).json({ comments: commentsData });
  } catch (error) {
    console.error('Get all comments error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const createComment = async (req, res) => {
  const blogId = req.params.blogId; // Extract the blog ID from the route parameters

  try {
    const { content } = req.body; // Extract comment content from the request body
    const user = req.user; // Access user information from the verified JWT
    console.log(req.user);

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Unauthorized - User not found in the JWT token' });
    }

    // Create a new comment with the provided content, user, and blog
    const newComment = new Comment({
      content,
      user: user.userId, // Use the authenticated user's ID
      blog: blogId, // Blog ID
    });

    // Save the new comment to the database
    const createdComment = await newComment.save();

    res.status(StatusCodes.CREATED).json({ comment: createdComment });
  } catch (error) {
    console.error('Create comment error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const getComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId).populate(
      'user',
      'full_name'
    );

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Comment not found' });
    }

    // Extract the relevant information from the comment and user
    const commentData = {
      _id: comment._id,
      content: comment.content,
      userName: comment.user ? comment.user.full_name : 'Unknown User',
    };

    res.status(StatusCodes.OK).json({ comment: commentData });
  } catch (error) {
    console.error('Get comment error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const user = req.user;

  try {
    // Get the authenticated user
    const { content } = req.body; // Extract the updated content from the request body

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Comment not found' });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.user.toString() !== user.userId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'You are not authorized to update this comment' });
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    res.status(StatusCodes.OK).json({ comment: updatedComment });
  } catch (error) {
    console.error('Update comment error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const user = req.user;
  try {
    // Get the authenticated user

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: 'Comment not found' });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.user.toString() !== user.userId.toString()) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'You are not authorized to delete this comment' });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(StatusCodes.OK).json({ msg: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};
