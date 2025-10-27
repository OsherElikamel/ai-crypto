import mongoose, { Schema } from "mongoose";
const memeSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: String,
  tags: [String],
  source: String,
  active: { type: Boolean, default: true },
  liked:    [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  disliked: [{ type: Schema.Types.ObjectId, ref: "User", index: true }]
}, { timestamps: true });

export default mongoose.model("Meme", memeSchema);
