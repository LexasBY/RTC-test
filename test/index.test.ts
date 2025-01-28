import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, server } from "../src/index";

describe("Express Server Tests", () => {
  beforeAll(() => {});

  afterAll(() => {
    server.close();
  });

  it("should return client state", async () => {
    const response = await request(app).get("/api/client/state");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toBe(404);
  });
});
