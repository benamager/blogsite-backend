import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  createdAt: {
    type: Date,
  },
  username: {
    type: String,
    required: [true, "Must provide username"],
  },
  displayName: {
    type: String,
    required: [true, "Must provide display name"],
  },
  email: {
    type: String,
    required: [true, "Must provide email"],
  },
  password: {
    type: String,
    required: [true, "Must provide password"],
  },
  role: {
    type: String,
    enum: ["default", "mod", "admin"], // possible values
    default: "default", // default value
  },
  image: {
    type: Object,
    default: null,
    required: false
  },
  lastActive: {
    type: Date,
  }
});

const User = model("User", UserSchema);

export default User;