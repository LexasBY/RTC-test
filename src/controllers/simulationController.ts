import { Request, Response } from "express";
import { fetchState, fetchMappings } from "../api/simulatorApi";

import {
  getState as getSimulationState,
  SportEvent,
  updateState,
  resetState,
  processState,
} from "../services/stateService";

export function getClientState(req: Request, res: Response) {
  const currentState = getSimulationState();
  const formattedState = currentState.reduce((acc, event) => {
    acc[event.id] = event;
    return acc;
  }, {} as Record<string, SportEvent>);
  res.json(formattedState);
}

export async function getState(req: Request, res: Response) {
  try {
    const stateResponse = await fetchState();
    const mappingsResponse = await fetchMappings();

    const processedState = processState(
      stateResponse.odds,
      mappingsResponse.mappings
    );

    res.json(processedState);
  } catch (error) {
    res.status(500).send("Failed to fetch state");
  }
}

async function updateSimulationState() {
  try {
    const stateResponse = await fetchState();
    const mappingsResponse = await fetchMappings();
    updateState(stateResponse.odds, mappingsResponse.mappings);
  } catch (error) {
    console.error("Failed to update simulation state:", error);
  }
}

export function startSimulationUpdates() {
  setInterval(async () => {
    await updateSimulationState();
  }, 1000);

  setInterval(() => {
    resetState();
  }, 5 * 60 * 1000);
}
