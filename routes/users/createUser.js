import bcrypt from "bcrypt";
import User from "../../models/user.model.js";

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

async function createUser(req, res) {
  const { username, password, displayName, email } = req.body;
  const fileObject = req.file;

  // user, pass, email & displayName isn't provided
  if (!username || !password || !displayName || !email) {
    res.status(400).json({ message: "Both username, password, email & display name should be provided." })
      .end();
    return;
  }

  // username is taken
  const isUsernameUsed = await User.findOne({ username: username });
  if (isUsernameUsed) {
    res.status(403).json({ message: "User with that name already exists." })
      .end();
    return;
  }

  // email is taken
  const isEmailUsed = await User.findOne({ email: email });
  if (isEmailUsed) {
    res.status(403).json({ message: "User with that email already exists." })
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
      displayName: displayName,
      email: email,
      password: hashedPassword,
      image: fileObject ? fileObject : null,
      lastActive: new Date(),
      // key "role" set to default in UserSchema
    });
    await user.save();

    // remove sensitive data from response
    const responseUser = user.toObject();
    delete responseUser.password;
    delete responseUser.lastActive;
    delete responseUser.__v;
    delete responseUser._id;
    delete responseUser.createdAt;

    res.status(201).json(responseUser)
      .end();
  } catch (error) {
    // other errors
    console.log("create user error", error);
    res.status(500)
      .end();
  }
}

export default createUser