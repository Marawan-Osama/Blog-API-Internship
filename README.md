# Blog API

A simple RESTful API for managing and interacting with blog posts and comments. This API is designed to serve as the backend for a blog management system.

## Features

### Users
- **Create a User**: Register a User
- **Login**: Login Capabilities using JWT Authentication in the Cookies

### Blogs

- **Create a Blog**: Create a new blog post.
- **Get All Blogs**: Retrieve a list of all blogs authored by the user.
- **Get Blog by ID**: Get detailed information about a specific blog.
- **Update Blog**: Modify the content of an existing blog.
- **Add Co-Authors**: Include co-authors while creating a blog post.
- **Like/Unlike a Blog**: Users can like/unlike a blog, and the total likes count is updated.
- **View Count: Every Blog will have its view count

### Comments

- **Create a Comment**: Add comments to a blog post.
- **Get All Comments**: Retrieve all comments on a specific blog.
- **Get Comment by ID**: Get detailed information about a specific comment.
- **Update Comment**: Modify the content of an existing comment (by the comment author).
- **Delete Comment**: Delete a comment (by the comment author).

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running

## Installation
- Install dependancies
  ```
  npm install
- Run
```
npm start

```
## API Endpoints

Authorization:

- Post /api/v1/auth/register : Register
- Post /api/v1/auth/login: Login

Blogs:

- GET /api/v1/blogs: Retrieve all blogs.
- GET /api/v1/blogs/:blogId: Get a specific blog.
- POST /api/v1/blogs: Create a new blog.
- PATCH /api/v1/blogs/:blogId: Update a blog.
- POST /api/v1/blogs/:blogId/like: Like a blog.
- DELETE /api/v1/blogs/:blogId/like: Unlike a blog.

Comments:

- GET /api/v1/blogs/:blogId/comments: Retrieve all comments for a blog.
- GET /api/v1/blogs/:blogId/comments/:commentId: Get a specific comment.
- POST /api/v1/blogs/:blogId/comments: Create a new comment.
- PATCH /api/v1/blogs/:blogId/comments/:commentId: Update a comment.
- DELETE /api/v1/blogs/:blogId/comments/:commentId: Delete a comment.

Configuration
To configure the application, create a .env file in the root directory with the following variables:

MONGODB_URI: MongoDB connection URL
JWT_SECRET: Secret key for JWT token generation
PORT: The connection port
JWT_LIFETIME: the lifetime for the JWT token
