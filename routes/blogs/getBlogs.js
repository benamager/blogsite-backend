import Blog from "../../models/blog.model.js";
import dotenv from "dotenv";
dotenv.config();

// add url to blog object
const addUrlToBlog = (blog) => {
  return { ...blog._doc, url: `${process.env.SITE_URL}/api/v1/blogs/${blog._id}` }
}

async function getBlogs(req, res) {
  const { id } = req.params; // for single book

  // for hypermedia controls with multiple blogs
  const limit = (parseInt(req.query.limit) || 10) < 30 ? parseInt(req.query.limit) || 10 : 30; // max 30, default 10
  const skip = parseInt(req.query.skip) || 0; // default 0
  const sort = req.query.sort || "newest";

  // find single book if id
  if (id) {
    try {
      const blog = await Blog.findById(id);
      // if id is valid but not found
      if (!blog) {
        res.json({ message: "Blog not found" })
      }
      // return blog if found
      res.send(addUrlToBlog(blog))
    } catch (error) {
      // if id is invalid
      res.status(404).json({ message: "Blog not found" })
    }
    res.end()
    return;
  }

  // find multiple blogs with multimedia controls & sorting
  try {
    let sortForMongoose = { date: -1 }; // default sort

    // sorting by the different options
    if (sort === "newest") {
      sortForMongoose = { createdAt: -1 }
    }
    if (sort === "oldest") {
      sortForMongoose = { createdAt: 1 }
    }
    if (sort === "likes") {
      sortForMongoose = { likes: -1 }
    }
    if (sort === "dislikes") {
      sortForMongoose = { dislikes: -1 }
    }

    const countBlogs = await Blog.countDocuments()
      .sort(sortForMongoose);

    // getting blogs
    const blogs = await Blog.find()
      .skip(skip)
      .limit(limit)
      .sort(sortForMongoose)
      .populate({ path: "author", select: "-createdAt -password" }) // populate author field with user object + exclude things
    // if no blogs found

    if (blogs.length < 1) {
      res.status(404).json({ message: "No blogs found..." })
      return
    }
    // return object
    res.send({
      count: countBlogs,
      url: `${process.env.SITE_URL}/api/v1/blogs?limit=${limit}&skip=${skip}&sort=${sort}`,
      next: skip + limit >= countBlogs ? null : `${process.env.SITE_URL}/api/v1/blogs?limit=${limit}&skip=${skip + limit}&sort=${sort}`,
      previous: skip === 0 ? null : `${process.env.SITE_URL}/api/v1/blogs?limit=${limit}&skip=${skip - limit > 0 ? 0 : skip - limit}&sort=${sort}`,
      blogs: blogs.map(blog => addUrlToBlog(blog)) // blogs
    });
    res.end();
  } catch (error) {
    console.log("get blogs error", error)
    res.status(500).json({ message: "Database error while getting multiple blogs." })
  }
}

export default getBlogs