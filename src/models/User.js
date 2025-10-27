import mongoose, { Schema } from "mongoose";

const preferencesSchema = new Schema({
  coins: [String],
  investorType: { type: String, enum: ["HODL","DABBLER","TRADER","NFT_DEFI"], default: "HODL" },
  contentTypes: [String],
  risk: { type: String, enum: ["LOW","MEDIUM","HIGH"] },
  fiat: [String],
  depth: { type: String, enum: ["SHORT","MEDIUM","DEEP"], default: "SHORT" },
  alerts: { type: Boolean, default: false },
  avoid: [String]
}, { _id: false });

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  onboarded: { type: Boolean, default: false },
  preferences: preferencesSchema
}, { timestamps: true });

export default mongoose.model("User", userSchema);
