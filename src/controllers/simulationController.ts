import { Request, Response } from "express";
import { fetchState, fetchMappings } from "../api/simulatorApi";

import {
  getState as getSimulationState,
  SportEvent,
  updateState,
} from "../services/stateService";

export function getClientState(req: Request, res: Response) {
  const currentState = getSimulationState();
  const formattedState = currentState.reduce((acc, event) => {
    acc[event.id] = event;
    return acc;
  }, {} as Record<string, SportEvent>);
  res.json(formattedState);
}

let previousOdds: string = "";
let cachedMappings: string = "";

async function updateSimulationState() {
  try {
    const stateResponse = await fetchState();
    const currentOdds = stateResponse.odds;
    if (currentOdds !== previousOdds) {
      const mappingsResponse = await fetchMappings();
      cachedMappings = mappingsResponse.mappings;
      updateState(currentOdds, cachedMappings);

      previousOdds = currentOdds;
    } else {
      updateState(currentOdds, cachedMappings);
    }
  } catch (error) {
    console.error("Failed to update simulation state:", error);
  }
}

export function startSimulationUpdates() {
  (async () => {
    try {
      const stateResponse = await fetchState();
      const mappingsResponse = await fetchMappings();

      cachedMappings = mappingsResponse.mappings;
      updateState(stateResponse.odds, cachedMappings);

      previousOdds = stateResponse.odds;
    } catch (error) {
      console.error("Failed to initialize simulation state:", error);
    }
  })();

  setInterval(async () => {
    await updateSimulationState();
  }, 1000);
}
