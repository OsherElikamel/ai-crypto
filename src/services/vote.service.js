export async function voteOnDoc(Model, id, userId, action) {
  if (!["like", "dislike", "clear"].includes(action)) {
    const e = new Error("invalid vote");
    e.status = 400;
    throw e;
  }

  const user = userId;
  let update = {};

  if (action === "like") {
    update = {
      $addToSet: { likedBy: user },
      $pull: { dislikedBy: user },
    };
  } else if (action === "dislike") {
    update = {
      $addToSet: { dislikedBy: user },
      $pull: { likedBy: user },
    };
  } else {
    update = {
      $pull: { likedBy: user, dislikedBy: user },
    };
  }

  const doc = await Model.findByIdAndUpdate(id, update, {
    new: true,
    lean: true,
  });
  if (!doc) {
    const e = new Error("not found");
    e.status = 404;
    throw e;
  }

  const status = doc.likedBy?.some((u) => String(u) === String(user))
    ? "like"
    : doc.dislikedBy?.some((u) => String(u) === String(user))
    ? "dislike"
    : "none";

  return {
    id: String(doc._id),
    likes: doc.likedBy?.length || 0,
    dislikes: doc.dislikedBy?.length || 0,
    status,
  };
}
