import createBlog from "./createBlog.js"
import getBlogs from "./getBlogs.js"

const blogs = (app) => {
  app.route("/api/v1/blogs/:id?") // ? means optional parameter
    .post(createBlog)
    .get(getBlogs)
}

export default blogs