import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import axios from "axios";
import {
  fetchState,
  fetchMappings,
  StateResponse,
  MappingsResponse,
} from "../src/api/simulatorApi";

vi.mock("axios");

describe("Simulator API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchState should return correct data", async () => {
    const mockData: StateResponse = { odds: "1.5" };
    (axios.get as Mock).mockResolvedValue({ data: mockData });

    const result = await fetchState();
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:4000/api/state");
  });

  it("fetchState should handle errors", async () => {
    (axios.get as Mock).mockRejectedValue(new Error("Network Error"));

    await expect(fetchState()).rejects.toThrow(
      "Failed to fetch state: Error: Network Error"
    );
  });

  it("fetchMappings should return correct data", async () => {
    const mockData: MappingsResponse = { mappings: "mappingData" };
    (axios.get as Mock).mockResolvedValue({ data: mockData });

    const result = await fetchMappings();
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:4000/api/mappings"
    );
  });

  it("fetchMappings should handle errors", async () => {
    (axios.get as Mock).mockRejectedValue(new Error("Network Error"));

    await expect(fetchMappings()).rejects.toThrow(
      "Failed to fetch mappings: Error: Network Error"
    );
  });
});
