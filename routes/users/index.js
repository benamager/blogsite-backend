import createUser from "./createUser.js"
import editUser from "./editUser.js"
import getUsers from "./getUsers.js"
import deleteUser from "./deleteUser.js"

import authorization from "../../middlewares/authorization.js"
import upload from "../../middlewares/upload.js"

const users = (app) => {
  app.route("/api/v1/users/:id?") // ? means optional parameter
    .post(upload.single("image"), createUser)
    .patch(authorization, upload.single("image"), editUser)
    .get(authorization, getUsers)
    .delete(authorization, deleteUser)
}

export default users