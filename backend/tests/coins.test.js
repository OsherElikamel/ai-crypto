import request from "supertest";
import app from "../src/app.js";
import Coin from "../src/models/Coin.js";
import { connectTestDB, disconnectTestDB, cleanCollections } from "./setup.js";

beforeAll(() => connectTestDB());
afterAll(() => disconnectTestDB());
afterEach(() => cleanCollections());

describe("GET /coins", () => {
  beforeEach(async () => {
    await Coin.create([
      { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin", price: 50000, change24h: 2.5 },
      { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum", price: 3000, change24h: -1.2 },
      { symbol: "SOL", name: "Solana", coingeckoId: "solana", price: 100, change24h: 5.0 },
    ]);
  });

  it("returns paginated coin list", async () => {
    const res = await request(app).get("/coins");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(3);
    expect(res.body.total).toBe(3);
  });

  it("filters coins by symbol", async () => {
    const res = await request(app).get("/coins?symbols=BTC,ETH");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
  });

  it("respects pagination limit", async () => {
    const res = await request(app).get("/coins?limit=1&page=1");
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.total).toBe(3);
  });
});

describe("GET /coins/:id", () => {
  it("returns a single coin", async () => {
    const coin = await Coin.create({
      symbol: "BTC",
      name: "Bitcoin",
      coingeckoId: "bitcoin",
      price: 50000,
    });
    const res = await request(app).get(`/coins/${coin._id}`);
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe("BTC");
  });

  it("returns 404 for non-existent coin", async () => {
    const res = await request(app).get("/coins/000000000000000000000000");
    expect(res.status).toBe(404);
  });
});
