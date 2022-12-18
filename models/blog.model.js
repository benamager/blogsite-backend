import { model, Schema, mongoose } from "mongoose";
import User from "./user.model.js";

const BlogSchema = new Schema({
  createdAt: {
    type: Date,
  },
  lastEdit: {
    type: Date,
  },
  title: {
    type: String,
    required: [true, "Must provide title"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Must provide user id"],
    ref: 'User', // reference to User model
  },
  content: {
    type: String,
    required: [true, "Must provide content"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

const Blog = model("Blog", BlogSchema);

export default Blog;