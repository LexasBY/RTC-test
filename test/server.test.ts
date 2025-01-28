import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, server } from "../src/server";

describe("Server API Tests", () => {
  beforeAll(() => {});

  afterAll(() => {
    server.close();
  });

  it("should return state data", async () => {
    const response = await request(app).get("/api/state");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should return mappings data", async () => {
    const response = await request(app).get("/api/mappings");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });
});
