import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function sign(user) {
  return jwt.sign(
    { _id: user._id, email: user.email, onboarded: user.onboarded },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, onboarded: false });

  const token = sign(user);
  res.json({ token, needsOnboarding: true });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "bad credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "bad credentials" });

  const token = sign(user);
  res.json({ token, needsOnboarding: !user.onboarded });
}

// GET /auth/me   (Bearer token)
export async function me(req, res) {
  const user = await User.findById(req.user._id).lean();
  if (!user) return res.status(404).json({ error: "not found" });

  res.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      onboarded: user.onboarded,
      preferences: user.preferences
    }
  });
}
