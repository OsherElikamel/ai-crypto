import request from "supertest";
import app from "../src/app.js";
import { connectTestDB, disconnectTestDB, cleanCollections } from "./setup.js";

beforeAll(() => connectTestDB());
afterAll(() => disconnectTestDB());
afterEach(() => cleanCollections());

describe("POST /auth/register", () => {
  it("registers a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "Secret1234",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.needsOnboarding).toBe(true);
  });

  it("rejects duplicate email", async () => {
    const payload = { name: "Alice", email: "alice@example.com", password: "Secret1234" };
    await request(app).post("/auth/register").send(payload);
    const res = await request(app).post("/auth/register").send(payload);
    expect(res.status).toBe(409);
  });

  it("rejects weak password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "short",
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "Secret1234",
    });
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "Secret1234",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "WrongPass1",
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  it("returns user profile with valid token", async () => {
    const reg = await request(app).post("/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "Secret1234",
    });
    const token = reg.body.token;

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("alice@example.com");
    expect(res.body.user.name).toBe("Alice");
  });

  it("rejects request without token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});
