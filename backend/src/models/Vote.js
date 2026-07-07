import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      required: true,
      enum: ["coins", "insights", "news", "memes"],
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    value: { type: String, required: true, enum: ["like", "dislike"] },
  },
  { timestamps: true }
);

// One vote per user per item; also serves "what did this user vote on" lookups.
voteSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
// Count/aggregate lookups per item.
voteSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.model("Vote", voteSchema);
