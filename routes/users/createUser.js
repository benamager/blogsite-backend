import bcrypt from "bcrypt";
import User from "../../models/user.model.js";

async function createUser(req, res) {
  const { username, password } = req.body;

  // user & pass is provided
  if (!username || !password) {
    res.status(400).json({ message: "Both username and password should be provided." })
      .end();
    return;
  }

  // username is not used
  const isUsernameUsed = await User.findOne({ username: username });
  if (isUsernameUsed) {
    res.status(403).json({ message: "User with that name already exists." })
      .end();
    return;
  }

  // hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    // create user in db
    const user = new User({
      createdAt: new Date(),
      username: username,
      password: hashedPassword,
      // key "role" set to default in UserSchema
    });
    await user.save();

    res.status(201).json(user)
      .end();
  } catch (error) {
    // mongoose validation error
    if (error._message) {
      res.status(400)
        .end();
      return;
    }
    // other errors
    console.log("create user error", error);
    res.status(500)
      .end();
  }
}

export default createUser