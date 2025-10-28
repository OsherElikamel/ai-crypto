import mongoose, { Schema } from "mongoose";

const memeSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: String,
    tags: [String],
    source: String,
    active: { type: Boolean, default: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Meme", memeSchema);
