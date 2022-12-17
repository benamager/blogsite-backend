import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  createdAt: {
    type: Date,
  },
  username: {
    type: String,
    required: [true, "Must provide username"],
  },
  password: {
    type: String,
    required: [true, "Must provide password"],
  },
});

const User = model("User", UserSchema);

export default User;