import mongoose, { Schema } from "mongoose";
const insightSchema = new Schema({
  title: { type: String, required: true },
  text:  { type: String, required: true },
  tags: [String],
  tickers: [String],
  liked:    [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  disliked: [{ type: Schema.Types.ObjectId, ref: "User", index: true }]
}, { timestamps: true });

insightSchema.index({ tickers: 1 });
insightSchema.index({ tags: 1 });

export default mongoose.model("Insight", insightSchema);
