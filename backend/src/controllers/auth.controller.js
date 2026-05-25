import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config.js";

function sign(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });

  const emailStr = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr))
    return res.status(400).json({ error: "invalid email format" });

  const passStr = String(password);
  if (passStr.length < 8)
    return res.status(400).json({ error: "password must be at least 8 characters" });
  if (!/[A-Z]/.test(passStr) || !/\d/.test(passStr))
    return res.status(400).json({ error: "password must contain at least one uppercase letter and one number" });

  const exists = await User.findOne({ email: emailStr });
  if (exists) return res.status(409).json({ error: "email already registered" });

  const passwordHash = await bcrypt.hash(passStr, 10);
  const user = await User.create({ name: name?.trim(), email: emailStr, passwordHash, onboarded: false });

  const token = sign(user);
  res.json({ token, needsOnboarding: true });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+passwordHash");
  if (!user) return res.status(401).json({ error: "bad credentials" });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
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

const ENUM_VALUES = {
  investorType: ["HODL", "DABBLER", "TRADER", "NFT_DEFI"],
  risk: ["LOW", "MEDIUM", "HIGH"],
  depth: ["SHORT", "MEDIUM", "DEEP"],
};

export async function updatePreferences(req, res) {
  const updates = req.body || {};
  const allowed = ["coins", "contentTypes", "investorType", "risk", "fiat", "depth", "alerts"];

  const $set = {};
  for (const key of allowed) {
    if (!(key in updates)) continue;
    const val = updates[key];
    if (key in ENUM_VALUES && !ENUM_VALUES[key].includes(val))
      return res.status(400).json({ error: `invalid ${key}: must be one of ${ENUM_VALUES[key].join(", ")}` });
    $set[`preferences.${key}`] = val;
  }

  if (!Object.keys($set).length) return res.status(400).json({ error: "nothing to update" });

  const user = await User.findByIdAndUpdate(req.user._id, { $set }, { new: true }).lean();
  res.json({ ok: true, preferences: user.preferences });
}
