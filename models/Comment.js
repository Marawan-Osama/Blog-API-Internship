import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide comment content'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'Please provide the associated user'],
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog', // Reference to the Blog model
    required: [true, 'Please provide the associated blog'],
  },
});

export default mongoose.model('Comment', CommentSchema);
