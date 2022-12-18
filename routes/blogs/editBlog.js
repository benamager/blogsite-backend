import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js"

const fullAccess = ["admin"]

async function editBlog(req, res) {
  const { id } = req.params
  const username = req.username
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
    const blog = await Blog.findById(id);
    const user = await User.findOne({ username: username }).select("-createdAt -password") // find user by token => username

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

  // const username = req.username // username is provided by authorization middleware (by token)

  // // title, content is provided
  // if (!title || !content) {
  //   res.status(400).json({ message: "All fields are required." })
  //     .end()
  //   return
  // }

  // try {
  //   // find the users id in the database
  //   const userIdObject = await User.findOne({ username: username }).select("_id")

  //   // create blog in db
  //   const blog = new Blog({
  //     createdAt: new Date(),
  //     title: title,
  //     author: userIdObject.id,
  //     content: content,
  //     // likes & dislikes both set to 0 by default in BlogSchema
  //   });
  //   await blog.save();

  //   res.status(201).json(blog)
  //     .end();
  // } catch (error) {
  //   // mongoose validation error
  //   if (error._message) {
  //     console.log(error._message)
  //     res.status(400)
  //       .end();
  //     return;
  //   }
  //   // other errors
  //   console.log("create blog error", error);
  //   res.status(500)
  //     .end();
  // }
}

export default editBlog