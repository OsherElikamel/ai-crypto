import mongoose, { Schema } from "mongoose";

const coinSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: { type: String, required: true },
    coingeckoId: { type: String, required: true },
    price: { type: Number, default: null },
    change24h: { type: Number, default: null },
    marketCap: { type: Number, default: null },
    volume24h: { type: Number, default: null },
    rank: { type: Number, default: null },
    priceUpdatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Coin", coinSchema);
