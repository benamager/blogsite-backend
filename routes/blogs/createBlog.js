import Blog from "../../models/blog.model.js";

async function createBlog(req, res) {
  const { title, author, content } = req.body

  // title, author, content is provided
  if (!title || !author || !content) {
    res.status(400).json({ message: "All fields are required." })
    res.end()
    return
  }

  try {
    // create blog in db
    const blog = new Blog({
      createdAt: new Date(),
      title: title,
      author: author,
      content: content,
      // likes & dislikes both set to 0 by default in BlogSchema
    });
    await blog.save();

    res.status(201).json(blog);
    res.end();
  } catch (error) {
    // mongoose validation error
    if (error._message) {
      console.log(error._message)
      res.status(400);
      res.end();
      return;
    }
    // other errors
    console.log("create blog error", error);
    res.status(500);
    res.end();
  }
}

export default createBlog