import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },

    type: {
      type: String,
      required: true,
      enum: ["single", "multi", "boolean"],
    },

    question: { type: String, required: true },

    options: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          if (this.type === "boolean") return arr.length === 0;
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "Options required for non-boolean questions.",
      },
    },

    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
