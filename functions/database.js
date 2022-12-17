import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
const connectParams = { retryWrites: true, w: "majority" }

// db connection
try {
  mongoose.set("strictQuery", true) // remove deperecation warning
  await mongoose.connect(uri, connectParams);
  console.log("Successfully connected to database!");
} catch (error) {
  console.log("Error connecting to database: ", error);
}