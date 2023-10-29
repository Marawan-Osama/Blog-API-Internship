import Blog from '../models/Blog.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

export const getAllBlogs = async (req, res) => {
  const userId = req.user.userId; // Assuming you've stored the user ID in the token

  try {
    // Fetch all blogs and populate the 'author' field with the user's 'full_name'
    const blogs = await Blog.find({ author: userId })
      .populate('author', 'full_name')
      .select('-__v');

    // Modify the response to include 'blogId' and 'authorId' fields
    const formattedBlogs = blogs.map((blog) => ({
      blogId: blog._id,
      authorId: blog.author._id,
      title: blog.title,
      content: blog.content,
      authorName: blog.author.full_name,
    }));

    res.status(StatusCodes.OK).json({ blogs: formattedBlogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;

  try {
    const blog = await Blog.create({
      title,
      content,
      author: userId,
    });

    const author = await User.findById(userId);

    if (!author) {
      throw new Error('Author not found'); // Handle the case where the author doesn't exist
    }

    res
      .status(StatusCodes.CREATED)
      .json({ blog: { ...blog._doc, author: author.full_name } });
  } catch (error) {
    console.error('Create blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const getBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    // Fetch the specific blog by ID
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Blog not found' });
    }

    res.status(StatusCodes.OK).json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const updateBlog = async (req, res) => {
  const blogId = req.params.blogId; // Extract the blog ID from the route parameters
  const { title, content } = req.body; // Extract the updated title and content from the request body

  try {
    // Query the database to find the blog by its ID and update it
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Blog not found' });
    }

    res.status(StatusCodes.OK).json({ updatedBlog });
  } catch (error) {
    console.error('Update blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const deleteBlog = async (req, res) => {
  const blogId = req.params.blogId; // Extract the blog ID from the route parameters

  try {
    // Query the database to find the blog by its ID and delete it
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Blog not found' });
    }

    res.status(StatusCodes.OK).json({ msg: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};
