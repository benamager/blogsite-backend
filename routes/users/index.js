import createUser from "./createUser.js"

const users = (app) => {
  app.route("/api/v1/users/:id?") // ? means optional parameter
    .post(createUser)
}

export default users