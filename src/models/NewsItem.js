import mongoose, { Schema } from "mongoose";

const newsItemSchema = new Schema(
  {
    sourceId: { type: String, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    source: String,
    tickers: [String],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

newsItemSchema.index({ tickers: 1 });
export default mongoose.model("NewsItem", newsItemSchema);
