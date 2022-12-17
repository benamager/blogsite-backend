import { model, Schema } from "mongoose";

const BlogSchema = new Schema({
  createdAt: {
    type: Date,
  },
  title: {
    type: String,
    required: [true, "Must provide title"],
  },
  author: {
    type: String,
    required: [true, "Must provide author"],
  },
  content: {
    type: String,
    required: [true, "Must provide content"],
  },
  likes: {
    type: Number,
    required: [true, "Must provide likes"],
  },
  dislikes: {
    type: Number,
    required: [true, "Must provide dislikes"],
  },
});

const Blog = model("Blog", BlogSchema);

export default Blog;