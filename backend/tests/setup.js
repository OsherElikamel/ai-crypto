import mongoose from "mongoose";

const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI || "mongodb://localhost:27017/ai-crypto-test";

export async function connectTestDB() {
  await mongoose.connect(TEST_MONGO_URI);
}

export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

export async function cleanCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
