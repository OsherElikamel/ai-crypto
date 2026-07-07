import mongoose from "mongoose";

// Reject malformed ObjectIds up front — otherwise Mongoose throws a
// CastError that surfaces as a 500 for what is really bad user input.
export function validateObjectId(param = "id") {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      return res.status(400).json({ error: "invalid id" });
    }
    next();
  };
}
