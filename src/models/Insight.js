import mongoose, { Schema } from "mongoose";

const insightSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: [String],
    tickers: [String],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

insightSchema.index({ tickers: 1 });
insightSchema.index({ tags: 1 });

export default mongoose.model("Insight", insightSchema);
