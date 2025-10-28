import Question from "../models/Questions.js";
import User from "../models/User.js";

const findQuestion = (rows, id) => {
  return rows.find((q) => q.id === id);
};

const normalizeMulti = (value, id, rows) => {
  const q = findQuestion(rows, id);
  let arr = Array.isArray(value)
    ? value.filter((v) => typeof v === "string")
    : [];

  if (arr.includes("None")) return [];

  const opts =
    q && (q.type === "single" || q.type === "multi") ? q.options || [] : null;
  if (opts) arr = arr.filter((v) => opts.includes(v));
  return arr;
};

const normalizeSingle = (value, id, rows, fallback = null) => {
  if (value === "None") return null;

  const q = findQuestion(rows, id);
  const opts =
    q && (q.type === "single" || q.type === "multi") ? q.options || [] : null;
  if (!opts) return fallback;

  return opts.includes(value) ? value : fallback;
};

export const getQuizQuestions = async (_req, res) => {
  try {
    const questions = await Question.find({ active: true })
      .sort({ order: 1, _id: 1 })
      .select("id type question options -_id")
      .lean();

    return res.json({ questions });
  } catch (err) {
    console.error("getQuizQuestions error:", err);
    return res.status(500).json({ error: "Failed to load questions" });
  }
};

export const submitQuizAnswers = async (req, res) => {
  const uid = req.user._id;
  const { answers } = req.body || {};
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "answers object required" });
  }

  const rows = await Question.find({ active: true })
    .select("id type options -_id")
    .lean();

  const prefs = {
    // multi
    coins: normalizeMulti(answers.coins, "coins", rows),
    contentTypes: normalizeMulti(answers.contentTypes, "contentTypes", rows),
    fiat: normalizeMulti(answers.fiat, "fiat", rows),

    // single
    investorType: normalizeSingle(
      answers.investorType,
      "investorType",
      rows,
      null
    ),
    risk: normalizeSingle(answers.risk, "risk", rows, null),
    depth: normalizeSingle(answers.depth, "depth", rows, null),

    alerts: !!answers.alerts,
  };

  await User.findByIdAndUpdate(
    uid,
    { preferences: prefs, onboarded: true },
    { new: true }
  );

  res.json({ ok: true, onboarded: true, preferences: prefs });
};
