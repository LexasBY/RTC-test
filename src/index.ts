import express from "express";
import dotenv from "dotenv";
import {
  getClientState,
  startSimulationUpdates,
} from "./controllers/simulationController";
dotenv.config();

const app = express();
const PORT = process.env.RTC_SIMULATION_API_PORT || 3000;
const ROOT_PATH = process.env.RTC_SIMULATION_ROOT_PATH || "/api";

app.get(`${ROOT_PATH}/client/state`, getClientState);

startSimulationUpdates();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
