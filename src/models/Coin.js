import mongoose, { Schema } from "mongoose";

const coinSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    name: { type: String, required: true },
    coingeckoId: { type: String, required: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Coin", coinSchema);
