import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js";

async function createBlog(req, res) {
  const { title, content } = req.body
  const username = req.username // username is provided by authorization middleware (by token)

  // title, content is provided
  if (!title || !content) {
    res.status(400).json({ message: "All fields are required." })
      .end()
    return
  }

  try {
    // find the users id in the database
    const userIdObject = await User.findOne({ username: username }).select("_id")

    // create blog in db
    const blog = new Blog({
      createdAt: new Date(),
      title: title,
      author: userIdObject.id,
      content: content,
      // likes & dislikes both set to 0 by default in BlogSchema
    });
    await blog.save();

    res.status(201).json(blog)
      .end();
  } catch (error) {
    // mongoose validation error
    if (error._message) {
      console.log(error._message)
      res.status(400)
        .end();
      return;
    }
    // other errors
    console.log("create blog error", error);
    res.status(500)
      .end();
  }
}

export default createBlog