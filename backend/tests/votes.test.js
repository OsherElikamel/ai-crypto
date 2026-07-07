import request from "supertest";
import app from "../src/app.js";
import Coin from "../src/models/Coin.js";
import { connectTestDB, disconnectTestDB, cleanCollections } from "./setup.js";

beforeAll(() => connectTestDB());
afterAll(() => disconnectTestDB());
afterEach(() => cleanCollections());

async function registerUser(email) {
  const res = await request(app)
    .post("/auth/register")
    .send({ name: "Voter", email, password: "Secret1234" });
  return res.body.token;
}

describe("POST /vote/:type/:id", () => {
  let token;
  let coin;

  beforeEach(async () => {
    token = await registerUser("voter@example.com");
    coin = await Coin.create({ symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" });
  });

  it("likes, switches to dislike, then clears", async () => {
    let res = await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, likes: 1, dislikes: 0, status: "like" });

    res = await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "dislike" });
    expect(res.body).toMatchObject({ likes: 0, dislikes: 1, status: "dislike" });

    res = await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "clear" });
    expect(res.body).toMatchObject({ likes: 0, dislikes: 0, status: "none" });
  });

  it("aggregates votes across users and reports per-user status", async () => {
    const token2 = await registerUser("second@example.com");

    await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });
    await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({ vote: "dislike" });

    const asUser2 = await request(app)
      .get("/coins")
      .set("Authorization", `Bearer ${token2}`);
    expect(asUser2.body.items[0]).toMatchObject({
      likeCount: 1,
      dislikeCount: 1,
      voteStatus: "dislike",
    });

    const anonymous = await request(app).get("/coins");
    expect(anonymous.body.items[0]).toMatchObject({
      likeCount: 1,
      dislikeCount: 1,
      voteStatus: "none",
    });
  });

  it("never exposes voter identities in responses", async () => {
    await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });

    const res = await request(app).get(`/coins/${coin._id}`);
    expect(res.body.likedBy).toBeUndefined();
    expect(res.body.dislikedBy).toBeUndefined();
    expect(res.body.likeCount).toBe(1);
  });

  it("requires authentication", async () => {
    const res = await request(app).post(`/vote/coins/${coin._id}`).send({ vote: "like" });
    expect(res.status).toBe(401);
  });

  it("rejects an unknown content type", async () => {
    const res = await request(app)
      .post(`/vote/bogus/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });
    expect(res.status).toBe(400);
  });

  it("rejects a malformed id", async () => {
    const res = await request(app)
      .post("/vote/coins/not-an-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a target that does not exist", async () => {
    const res = await request(app)
      .post("/vote/coins/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "like" });
    expect(res.status).toBe(404);
  });

  it("rejects an invalid vote value", async () => {
    const res = await request(app)
      .post(`/vote/coins/${coin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ vote: "love" });
    expect(res.status).toBe(400);
  });
});
