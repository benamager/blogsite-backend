import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js"

const fullAccess = ["admin", "mod"]

async function deleteBlog(req, res) {
  const { id } = req.params
  const userId = req.userId

  // no id provided
  if (!id) res.status(400).json({ message: "Blog id is required." })
    .end()

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
    const deletedBlog = await Blog.findByIdAndDelete(
      { _id: id },
    )

    // return edited blog with populated author
    res.status(200).json(
      await blog.populate({ path: "author", select: "-password -createdAt -email -lastActive -role -__v" })
    )
      .end();

  } catch (error) {
    // other errors
    console.log("Edit blog error", error);
    res.status(500).json({ message: "Internal server error." })
      .end();
    return;
  }
}

export default deleteBlog