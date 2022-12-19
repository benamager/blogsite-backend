import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js"

const fullAccess = ["admin"]

async function editBlog(req, res) {
  const { id } = req.params
  const userId = req.userId
  const { title, content } = req.body

  // no id provided
  if (!id) res.status(400).json({ message: "Blog id is required." }).end()

  // no title & content is provided
  if (!title || !content) {
    res.status(400).json({ message: "All fields are required." })
      .end()
    return
  }

  try {
    // find blog & user
    const blog = await Blog.findById(id);
    const user = await User.findById(userId).select("-createdAt -password") // find user by token => username

    // blog doesn't exist
    if (!blog) {
      res.status(404).json({ message: "Blog not found." })
        .end()
      return
    }

    // if user isn't author of blog
    if (!blog.author.equals(user._id)) {
      // if user role isn't included in fullAccess
      if (!fullAccess.includes(user.role)) {
        res.status(403).json({ message: "You are not permitted to edit this blog." })
          .end()
        return
      }
    }

    // update blog
    const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, {
      title: title,
      content: content,
      lastEdit: new Date(), // add lastEdit
    })

    res.status(200).json(updatedBlog)
      .end()

  } catch (error) {
    // other errors
    console.log("Edit blog error", error);
    res.status(500).json({ message: "Internal server error." })
      .end();
    return;
  }
}

export default editBlog