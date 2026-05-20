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
    price: { type: Number, default: null },
    change24h: { type: Number, default: null },
    marketCap: { type: Number, default: null },
    volume24h: { type: Number, default: null },
    rank: { type: Number, default: null },
    priceUpdatedAt: { type: Date, default: null },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Coin", coinSchema);
