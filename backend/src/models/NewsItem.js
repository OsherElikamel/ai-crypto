import mongoose, { Schema } from "mongoose";

const newsItemSchema = new Schema(
  {
    sourceId: { type: String },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    source: String,
    tickers: [String],
  },
  { timestamps: true }
);

newsItemSchema.index({ createdAt: -1 });
export default mongoose.model("NewsItem", newsItemSchema);
