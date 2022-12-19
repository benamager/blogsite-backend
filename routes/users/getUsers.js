import User from "../../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const fullAccess = ["admin"]

// add url to user object
const addUrlToUser = (user) => {
  return { ...user._doc, url: `${process.env.SITE_URL}/api/v1/users/${user._id}` }
}

// get all users
async function getUsers(req, res) {
  const { id } = req.params; // for single user
  const userId = req.userId // token => userId

  // for hypermedia controls with multiple users
  const limit = (parseInt(req.query.limit) || 10) < 30 ? parseInt(req.query.limit) || 10 : 30; // max 30, default 10
  const skip = parseInt(req.query.skip) || 0; // default 0
  const sort = req.query.sort || "newest";

  const userAccessing = await User.findById(userId).select("-createdAt -password") // find user by token => userId

  // find single user if id
  if (id) {
    // if user isn't user accessing
    if (id !== userAccessing._id.toString()) {
      // if user role isn't included in fullAccess
      if (!fullAccess.includes(userAccessing.role)) {
        res.status(403).json({ message: "You are not authorized to access this resource." })
          .end()
        return
      }
    }

    try {
      const user = await User.findById(id).select("-password");
      // if id is valid but not found
      if (!user) {
        res.json({ message: "User not found." })
      }
      // return user if found
      res.send(addUrlToUser(user))
    } catch (error) {
      // if id is invalid
      res.status(404).json({ message: "Internal server error." })
    }
    res.end()
    return;
  }

  // find multiple users with multimedia controls & sorting
  try {
    // check if user is authorized to access this resource
    if (!fullAccess.includes(userAccessing.role)) {
      res.status(401).json({ message: "You are not authorized to access this resource." })
      return
    }

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

    const countUsers = await User.countDocuments()
      .sort(sortForMongoose);

    // getting users
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort(sortForMongoose)
      .select("-password -__v")

    // if no users found
    if (users.length < 1) {
      res.status(404).json({ message: "No users found..." })
      return
    }

    // return object
    res.send({
      count: countUsers,
      url: `${process.env.SITE_URL}/api/v1/users?limit=${limit}&skip=${skip}&sort=${sort}`,
      next: skip + limit >= countUsers ? null : `${process.env.SITE_URL}/api/v1/users?limit=${limit}&skip=${skip + limit}&sort=${sort}`,
      previous: skip === 0 ? null : `${process.env.SITE_URL}/api/v1/users?limit=${limit}&skip=${skip - limit > 0 ? 0 : skip - limit}&sort=${sort}`,
      results: users.map(user => addUrlToUser(user)) // blogs
    })
      .end();
  } catch (error) {
    console.log("get blogs error", error)
    res.status(500).json({ message: "Database error while getting multiple users." })
      .end()
  }
}

export default getUsers