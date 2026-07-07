import mongoose, { Schema } from "mongoose";

const insightSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: [String],
    tickers: [String],
  },
  { timestamps: true }
);

// Every list query sorts by createdAt — index that, not fields we never filter on.
insightSchema.index({ createdAt: -1 });

export default mongoose.model("Insight", insightSchema);
