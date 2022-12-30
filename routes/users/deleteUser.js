import User from "../../models/user.model.js"
import deleteImage from "../../functions/deleteImage.js"

const fullAccess = ["admin"]

async function deleteUser(req, res) {
  const { id } = req.params
  const userId = req.userId

  // no id provided
  if (!id) res.status(400).json({ message: "User id is required." })
    .end()

  const userAccessing = await User.findById(userId).select("-createdAt -password") // find user by token => userId

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
    const user = await User.findById(id) // find user from userId in params
    console.log(user)

    // user doesn't exist
    if (!user) {
      res.status(404).json({ message: "User doesn't exist." })
        .end()
      return
    }

    // delete user
    await User.findByIdAndDelete(id)
    // delete user image if exists
    if (userAccessing.image !== null) {
      const oldImagePath = userAccessing.image.path
      await deleteImage(oldImagePath)
    }

    // return success message
    res.status(200).json({ message: "User successfully deleted." })
      .end()
  } catch (error) {
    // other errors
    console.log("Delete user error", error);
    res.status(500).json({ message: "Internal server error." })
      .end();
    return;
  }
}

export default deleteUser