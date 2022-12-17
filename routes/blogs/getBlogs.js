import Blog from "../../models/blog.model.js";

async function getBlogs(req, res) {
  const { id } = req.params; // for single book
  const { offset, skip } = req.query; // for hypermedia controls

  // find single book if id
  if (id) {
    try {
      const blog = await Blog.findById(id);
      // if id is valid but not found
      if (!blog) {
        res.json({ message: "Blog not found" })
      }
      // return blog if found
      res.send(blog)
    } catch (error) {
      // if id is invalid
      res.status(404).json({ message: "Blog not found" })
    }
    res.end()
    return;
  }

  // find all books
  const blogs = await Blog.find();
  res.send(blogs);
}

export default getBlogs