import token from "./token.js"

const auth = (app) => {
  app.route("/auth/token") // ? means optional parameter
    .post(token)
}

export default auth