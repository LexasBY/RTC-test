import { describe, it, expect, vi, beforeEach, Mock, afterEach } from "vitest";
import { fetchState, fetchMappings } from "../src/api/simulatorApi";
import * as stateService from "../src/services/stateService";
import { startSimulationUpdates } from "../src/controllers/simulationController";

vi.mock("../src/api/simulatorApi");

describe("Simulation Controller Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should update simulation state when odds change", async () => {
    const initialState = { odds: "1.0" };
    const updatedState = { odds: "2.0" };
    const mockMappings = { mappings: "test-mapping" };

    (fetchState as Mock)
      .mockResolvedValueOnce(initialState)
      .mockResolvedValueOnce(updatedState);
    (fetchMappings as Mock).mockResolvedValue(mockMappings);

    const updateStateSpy = vi.spyOn(stateService, "updateState");

    startSimulationUpdates();

    await vi.advanceTimersByTimeAsync(1100);

    expect(updateStateSpy).toHaveBeenCalledWith(
      updatedState.odds,
      mockMappings.mappings
    );
    expect(fetchMappings).toHaveBeenCalledTimes(2);
    vi.restoreAllMocks();
  });
});
