import Vote from "../models/Vote.js";

export async function castVote(targetType, Model, targetId, userId, action) {
  if (!["like", "dislike", "clear"].includes(action)) {
    const e = new Error("invalid vote");
    e.status = 400;
    throw e;
  }

  const exists = await Model.exists({ _id: targetId });
  if (!exists) {
    const e = new Error("not found");
    e.status = 404;
    throw e;
  }

  if (action === "clear") {
    await Vote.deleteOne({ userId, targetType, targetId });
  } else {
    try {
      await Vote.findOneAndUpdate(
        { userId, targetType, targetId },
        { $set: { value: action } },
        { upsert: true }
      );
    } catch (err) {
      // Upsert race on the unique index — the row exists now, retry as a plain update.
      if (err.code === 11000) {
        await Vote.updateOne({ userId, targetType, targetId }, { $set: { value: action } });
      } else {
        throw err;
      }
    }
  }

  const [likes, dislikes] = await Promise.all([
    Vote.countDocuments({ targetType, targetId, value: "like" }),
    Vote.countDocuments({ targetType, targetId, value: "dislike" }),
  ]);

  return {
    id: String(targetId),
    likes,
    dislikes,
    status: action === "clear" ? "none" : action,
  };
}

/** Decorate lean docs with likeCount / dislikeCount / voteStatus —
 *  one aggregation for the counts, one indexed find for the user's own votes. */
export async function attachVotes(targetType, items, userId) {
  if (!items.length) return [];
  const ids = items.map((i) => i._id);

  const [countRows, userVotes] = await Promise.all([
    Vote.aggregate([
      { $match: { targetType, targetId: { $in: ids } } },
      { $group: { _id: { targetId: "$targetId", value: "$value" }, count: { $sum: 1 } } },
    ]),
    userId
      ? Vote.find({ userId, targetType, targetId: { $in: ids } }, "targetId value").lean()
      : [],
  ]);

  const counts = new Map();
  for (const row of countRows) {
    const key = String(row._id.targetId);
    const entry = counts.get(key) || { like: 0, dislike: 0 };
    entry[row._id.value] = row.count;
    counts.set(key, entry);
  }

  const mine = new Map(userVotes.map((v) => [String(v.targetId), v.value]));

  return items.map((item) => {
    const key = String(item._id);
    const c = counts.get(key) || { like: 0, dislike: 0 };
    return {
      ...item,
      likeCount: c.like,
      dislikeCount: c.dislike,
      voteStatus: mine.get(key) || "none",
    };
  });
}

export async function attachVotesToOne(targetType, item, userId) {
  const [withVotes] = await attachVotes(targetType, [item], userId);
  return withVotes;
}
