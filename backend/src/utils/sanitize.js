export function sanitizeOne(doc, userId) {
  const { likedBy, dislikedBy, ...rest } = doc;
  const likes = likedBy?.length ?? 0;
  const dislikes = dislikedBy?.length ?? 0;

  let voteStatus = "none";
  if (userId) {
    const uid = String(userId);
    if (likedBy?.some((u) => String(u) === uid)) voteStatus = "like";
    else if (dislikedBy?.some((u) => String(u) === uid)) voteStatus = "dislike";
  }

  return { ...rest, likeCount: likes, dislikeCount: dislikes, voteStatus };
}

export function sanitizeItems(items, userId) {
  return items.map((doc) => sanitizeOne(doc, userId));
}
