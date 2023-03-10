import User from "../../models/user.model.js"
import deleteImage from "../../functions/deleteImage.js"

const fullAccess = ["admin"]

async function editUser(req, res) {
  const { id } = req.params
  const userId = req.userId
  const { displayName, email, role } = req.body
  const fileObject = req.file;

  // no id provided
  if (!id) res.status(400).json({ message: "User id is required." })
    .end()

  // displayName & email is provided
  if (!displayName || !email) {
    res.status(400).json({ message: "All fields are required." })
      .end()
    return
  }

  try {
    const userAccessing = await User.findById(userId).select("-createdAt -password") // find user by token => userId
    const userEditing = await User.findById(id).select("-createdAt -password")

    // user doesn't exist
    if (!userEditing) {
      res.status(404).json({ message: "User doesn't exist." })
        .end()
      return
    }

    // if client without fullAccess tries to change role
    if (role && !fullAccess.includes(userAccessing.role)) {
      res.status(403).json({ message: "You are not permitted to change user role." })
        .end()
      return
    }

    // if user isn't user
    if (userId !== userEditing._id.toString()) {
      // if user role isn't included in fullAccess
      if (!fullAccess.includes(userAccessing.role)) {
        res.status(403).json({ message: "You are not permitted to edit this user." })
          .end()
        return
      }
    }

    // delete old image if exists
    if (fileObject && userEditing.image) {
      // delete old image
      const oldImagePath = userEditing.image.path
      await deleteImage(oldImagePath)
    }

    // update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          displayName: displayName,
          email: email,
          role: role,
          image: fileObject ? fileObject : null,
          lastModified: new Date() // add modified date
        }
      },
      { new: true, select: "-password -createdAt -email -lastActive -__v" } // returns updated object
    )

    // return edited blog with populated author
    res.status(201).json(updatedUser)
      .end();

  } catch (error) {
    // other errors
    console.log("Edit blog error", error);
    res.status(500).json({ message: "Internal server error." })
      .end();
    return;
  }
}

export default editUser