import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide author'],
  },
});

export default mongoose.model('Blog', BlogSchema);
