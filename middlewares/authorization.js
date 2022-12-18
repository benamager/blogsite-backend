import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

// middlewares/auth.js
const authorization = (req, res, next) => {
  const tokenSecret = process.env.TOKEN_SECRET

  // check auth headers exists
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Not authorized." })
      .end()
    return
  }

  // check if formatted correctly
  const [bearer, token] = req.headers.authorization.split(" ")
  if (!bearer && !token) {
    res.status(403).json({ message: "Wrong data of some kind." })
      .end()
    return
  }

  // check if formatted correctly
  if (bearer.toLowerCase() !== "bearer") {
    res.status(403).json({ message: "Bad token formation." })
      .end()
    return
  }

  // check if valid
  try {
    const username = jwt.verify(token, tokenSecret).username // verify token
    req.username = username // add username to req, so it can be used in the next middleware
    next()
  } catch (error) {
    // invalid token
    console.log("Authorization error", error)
    res.status(401).json({ message: "Not authorized" })
      .end()
    return
  }
}

export default authorization