/**
 * One-time migration: move embedded likedBy/dislikedBy arrays into the
 * dedicated votes collection, then remove the arrays and reconcile indexes.
 *
 * Idempotent — safe to run more than once.
 *
 *   npm run migrate:votes
 */
import mongoose from "mongoose";
import connectDB from "../db.js";
import Vote from "../models/Vote.js";
import Coin from "../models/Coin.js";
import Insight from "../models/Insight.js";
import NewsItem from "../models/NewsItem.js";
import Meme from "../models/Meme.js";

const TARGETS = [
  { model: Coin, collection: "coins", targetType: "coins" },
  { model: Insight, collection: "insights", targetType: "insights" },
  { model: NewsItem, collection: "newsitems", targetType: "news" },
  { model: Meme, collection: "memes", targetType: "memes" },
];

async function migrate() {
  await connectDB();
  let migrated = 0;

  for (const { collection, targetType } of TARGETS) {
    // Raw collection access: the fields no longer exist on the schemas.
    const coll = mongoose.connection.collection(collection);
    const docs = await coll
      .find({
        $or: [
          { likedBy: { $exists: true, $not: { $size: 0 } } },
          { dislikedBy: { $exists: true, $not: { $size: 0 } } },
        ],
      })
      .toArray();

    for (const doc of docs) {
      const votes = [
        ...(doc.likedBy || []).map((userId) => ({ userId, value: "like" })),
        ...(doc.dislikedBy || []).map((userId) => ({ userId, value: "dislike" })),
      ];
      for (const { userId, value } of votes) {
        await Vote.updateOne(
          { userId, targetType, targetId: doc._id },
          { $set: { value } },
          { upsert: true }
        );
        migrated++;
      }
    }

    const unset = await coll.updateMany(
      { $or: [{ likedBy: { $exists: true } }, { dislikedBy: { $exists: true } }] },
      { $unset: { likedBy: "", dislikedBy: "" } }
    );
    console.log(`${collection}: ${docs.length} docs with votes, ${unset.modifiedCount} docs cleaned`);
  }

  // Drop indexes no longer declared on the schemas, create the new ones.
  for (const { model } of TARGETS) await model.syncIndexes();
  await Vote.syncIndexes();

  console.log(`Done — ${migrated} votes migrated, indexes synced`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
