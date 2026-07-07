import mongoose, { Schema } from "mongoose";

const memeSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: String,
    tags: [String],
    source: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

memeSchema.index({ createdAt: -1 });

export default mongoose.model("Meme", memeSchema);
