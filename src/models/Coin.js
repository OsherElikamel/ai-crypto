import mongoose, { Schema } from "mongoose";

const coinSchema = new Schema({
  symbol:      { type: String, required: true, uppercase: true, unique: true, index: true },
  name:        { type: String, required: true },
  coingeckoId: { type: String, required: true, unique: true },
  liked:    [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  disliked: [{ type: Schema.Types.ObjectId, ref: "User", index: true }]
}, { timestamps: true });

export default mongoose.model("Coin", coinSchema);
