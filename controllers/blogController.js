import Blog from '../models/Blog.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';

export const getAllBlogs = async (req, res) => {
  const userId = req.user.userId;

  try {
    const blogs = await Blog.find({ author: userId })
      .populate([
        {
          path: 'author',
          select: 'full_name',
        },
        {
          path: 'co_authors',
          select: 'email',
        },
      ])
      .select('-__v');

    const formattedBlogs = blogs.map((blog) => ({
      blogId: blog._id,
      authorId: blog.author._id,
      title: blog.title,
      content: blog.content,
      authorName: blog.author.full_name,
      coAuthors: blog.co_authors.map((coAuthor) => coAuthor.email),
      likes: blog.likes.length,
      view_count: blog.view_count,
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
    const author = await User.findById(userId);

    if (!author) {
      throw new Error('Author not found');
    }

    let co_authors = [];

    if (req.body.co_authors) {
      co_authors = await Promise.all(
        req.body.co_authors.map(async (co_author) => {
          const user = await User.findOne({ email: co_author });
          if (user) {
            return user._id;
          }
          return null;
        })
      );
      co_authors = co_authors.filter((co_author) => co_author !== null);
    }

    const blog = await Blog.create({
      title,
      content,
      author: userId,
      co_authors,
    });

    res.status(StatusCodes.CREATED).json({
      blog: {
        ...blog._doc,
        author: author.full_name,
        co_authors: co_authors,
      },
    });
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
    // Fetch the specific blog by ID and populate the 'author' and 'co_authors' fields
    const blog = await Blog.findById(blogId).populate([
      {
        path: 'author',
        select: 'full_name',
      },
      {
        path: 'co_authors',
        select: 'email',
      },
    ]);

    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Blog not found' });
    }

    blog.view_count = blog.view_count + 1;
    await blog.save();

    // Extract email addresses of co-authors
    const coAuthorsEmails = blog.co_authors.map((coAuthor) => coAuthor.email);

    // Create a modified blog object with email addresses of co-authors
    const modifiedBlog = {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      authorId: blog.author._id,
      authorName: blog.author.full_name,
      coAuthors: coAuthorsEmails,
      likes: blog.likes.length,
      view_count: blog.view_count,
    };

    res.status(StatusCodes.OK).json({ blog: modifiedBlog });
  } catch (error) {
    console.error('Get blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};

export const updateBlog = async (req, res) => {
  const blogId = req.params.blogId; // Extract the blog ID from the route parameters
  const { title, content, co_authors } = req.body; // Extract the updated title, content, and co_authors from the request body

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

    // Add new co-authors to the blog
    if (co_authors && Array.isArray(co_authors)) {
      for (const email of co_authors) {
        const user = await User.findOne({ email });
        if (user) {
          // Check if the user is not already a co-author
          if (!updatedBlog.co_authors.includes(user._id)) {
            updatedBlog.co_authors.push(user._id);
          }
        }
      }
      // Save the updated blog with new co-authors
      await updatedBlog.save();
    }

    // Get the author's data
    const author = await User.findById(updatedBlog.author);

    // Extract email addresses of co-authors
    const coAuthorsEmails = [];
    for (const coAuthorId of updatedBlog.co_authors) {
      const coAuthor = await User.findById(coAuthorId);
      if (coAuthor) {
        coAuthorsEmails.push(coAuthor.email);
      }
    }

    // Create a modified blog object with email addresses of co-authors
    const modifiedBlog = {
      _id: updatedBlog._id,
      title: updatedBlog.title,
      content: updatedBlog.content,
      authorId: updatedBlog.author,
      authorName: author ? author.full_name : 'Unknown Author',
      coAuthors: coAuthorsEmails,
    };

    res.status(StatusCodes.OK).json({ updatedBlog: modifiedBlog });
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

export const likeBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user.userId;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Blog not found' });
    }
    if (blog.likes.includes(userId)) {
      const index = blog.likes.indexOf(userId);
      if (index > -1) {
        blog.likes.splice(index, 1);
        await blog.save();
        return res.status(StatusCodes.OK).json({
          msg: 'Blog like removed successfully',
          likes: blog.likes.length,
        });
      }
    }
    blog.likes.push(userId);
    await blog.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Blog liked successfully', likes: blog.likes.length });
  } catch (error) {
    console.error('Like blog error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal server error' });
  }
};
