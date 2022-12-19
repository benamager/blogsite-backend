import createBlog from "./createBlog.js"
import getBlogs from "./getBlogs.js"
import editBlog from "./editBlog.js"
import deleteBlog from "./deleteBlog.js"

import authorization from "../../middlewares/authorization.js"

const blogs = (app) => {
  app.route("/api/v1/blogs/:id?") // ? means optional parameter
    .get(getBlogs)
    .post(authorization, createBlog)
    .patch(authorization, editBlog)
    .delete(authorization, deleteBlog)
}

export default blogs