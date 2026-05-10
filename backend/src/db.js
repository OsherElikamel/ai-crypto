import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  await mongoose.connect(config.mongodbUri);
};

export default connectDB;
