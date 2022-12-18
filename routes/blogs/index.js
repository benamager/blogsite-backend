import createBlog from "./createBlog.js"
import getBlogs from "./getBlogs.js"

import authorization from "../../middlewares/authorization.js"

const blogs = (app) => {
  app.route("/api/v1/blogs/:id?") // ? means optional parameter
    .post(authorization, createBlog)
    .get(getBlogs)
}

export default blogs