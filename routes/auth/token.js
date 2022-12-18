
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../../models/user.model.js"
import dotenv from "dotenv"
dotenv.config()

async function token(req, res) {
  const { username, password } = req.body;
  const tokenSecret = process.env.TOKEN_SECRET;
  console.log("New token request for the user:", username)

  // user & pass is provided
  if (!username || !password) {
    res.status(400).json({ message: "Both username and password should be provided." })
      .end()
    return
  }

  try {
    const user = await User.findOne({ username: username }); // find user

    // no user with that name
    if (!user) {
      res.status(403).json({ message: "User doesn't exist." })
        .end()
      return
    }

    // if the password is wrong
    if (!await bcrypt.compare(password, user.password)) {
      res.status(403).json({ message: "Wrong username or password." })
        .end()
      return
    }

    // generate new token
    const newToken = jwt.sign({ username: user.username }, tokenSecret, { expiresIn: "1d" })

    // send new token to client
    res.status(201).json({ token: newToken, expiredData: new Date().getTime() + 86400000 })
      .end()
  } catch (error) {
    console.log("Authentication token error", error)
    res.status(500).json({ message: "Authentication token error" })
      .end()
  }



  // try {
  //   // find the user in the database
  //   const user = await usersCollection.findOne({ username: req.body.username })
  //   client.close() // close db
  //   // if the user doesn't exist
  //   if (user === null) {
  //     res.status(403).json({ message: "User doesn't exist." }).end()
  //     return
  //   }

  //   // if the password is wrong
  //   if (!await bcrypt.compare(req.body.password, user.password)) {
  //     res.status(403).json({ message: "Wrong username or password." }).end()
  //     return
  //   }

  //   const newToken = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1h" })

  //   res.status(201).json({ token: newToken }).end()
  // } catch (error) {
  //   console.log("authentication token error", error)
  //   res.status(500)
  //   res.end()
  // }
}

export default token;