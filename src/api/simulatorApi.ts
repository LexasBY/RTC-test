import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MOCK_SERVER_URL = process.env.MOCK_SERVER_URL || "http://localhost:4000";

export interface StateResponse {
  odds: string;
}

export interface MappingsResponse {
  mappings: string;
}

export async function fetchState(): Promise<StateResponse> {
  try {
    const response = await axios.get<StateResponse>(
      `${MOCK_SERVER_URL}/api/state`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch state: ${error}`);
  }
}

export async function fetchMappings(): Promise<MappingsResponse> {
  try {
    const response = await axios.get<MappingsResponse>(
      `${MOCK_SERVER_URL}/api/mappings`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch mappings: ${error}`);
  }
}
