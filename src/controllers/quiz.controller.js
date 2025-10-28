import User from "../models/User.js";
import { QUIZ_QUESTIONS, NONE } from "../quiz/questions.js";

// Build quick lookup for allowed options (to keep data clean)
const allowed = QUIZ_QUESTIONS.reduce((acc, q) => {
  if (q.type === "single" || q.type === "multi") {
    acc[q.id] = new Set(q.options || []);
  }
  return acc;
}, {});

// Normalizers
function normalizeMulti(value, id) {
  const set = allowed[id]; // Set or undefined
  let arr = Array.isArray(value) ? value.filter(v => typeof v === "string") : [];

  if (arr.includes(NONE)) return [];

  // Keep only allowed options (if we know them)
  if (set) arr = arr.filter(v => set.has(v));
  return arr;
}

function normalizeSingle(value, id, fallback = null) {
  if (value === NONE) return null; 
  const set = allowed[id];
  if (!set) return fallback;
  return set.has(value) ? value : fallback;
}

// GET /quiz/questions (JWT)
export async function getQuizQuestions(_req, res) {
  res.json({ questions: QUIZ_QUESTIONS });
}

export async function submitQuizAnswers(req, res) {
  const uid = req.user._id;
  const { answers } = req.body || {};
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "answers object required" });
  }

  const prefs = {
    // multi
    coins:        normalizeMulti(answers.coins,        "coins"),
    contentTypes: normalizeMulti(answers.contentTypes, "contentTypes"),
    fiat:         normalizeMulti(answers.fiat,         "fiat"),

    // single
    investorType: normalizeSingle(answers.investorType, "investorType", null),
    risk:         normalizeSingle(answers.risk,         "risk",         null),
    depth:        normalizeSingle(answers.depth,        "depth",        null),

    alerts: !!answers.alerts
  };

  await User.findByIdAndUpdate(
    uid,
    { preferences: prefs, onboarded: true },
    { new: true }
  );

  res.json({ ok: true, onboarded: true, preferences: prefs });
}
