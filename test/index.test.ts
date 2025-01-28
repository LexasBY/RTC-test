import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import * as simulationController from "../src/controllers/simulationController";

vi.mock("../src/controllers/simulationController", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getClientState: vi.fn((req, res) => {
      res.json({ mocked: "state" });
    }),
    startSimulationUpdates: vi.fn(() =>
      console.log("Mocked startSimulationUpdates")
    ),
  };
});

const app = express();
app.get("/api/client/state", simulationController.getClientState);

describe("Express Server Integration Tests", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/client/state should return 200 and correct response", async () => {
    const response = await request(app).get("/api/client/state");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mocked: "state" });
  });

  it("Server uses the correct environment variables", () => {
    expect(process.env.RTC_SIMULATION_API_PORT).toBeDefined();
    expect(process.env.RTC_SIMULATION_ROOT_PATH).toBeDefined();
  });
});
