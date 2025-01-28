import { describe, test, expect, beforeEach } from "vitest";
import {
  updateState,
  getState,
  resetState,
} from "../src/services/stateService";

describe("Simulation State", () => {
  const sampleOdds = `995e0722-4118-4f8e-a517-82f6ea240673,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,1677758167812,1677758167812,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,\n4bb7b78f-6a23-43d0-a61a-1341f03f64e0,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,1677758167812,1677758167812,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,e2d12fef-ae82-4a35-b389-51edb8dc664e@0:0|6c036000-6dd9-485d-97a1-e338e6a32a51@0:0`;

  const sampleMappings = `29190088-763e-4d1c-861a-d16dbfcf858c:Juventus;3cd8eeee-a57c-48a3-845f-93b561a95782:Paris Saint-Germain;c0a1f678-dbe5-4cc8-aa52-8c822dc65267:FOOTBALL;1677758167812:UEFA Champions League;ac68a563-e511-4776-b2ee-cd395c7dc424:LIVE;e2d12fef-ae82-4a35-b389-51edb8dc664e:CURRENT;6c036000-6dd9-485d-97a1-e338e6a32a51:PERIOD_1`;

  beforeEach(() => {
    resetState();
  });

  test("updateState correctly processes input data", () => {
    updateState(sampleOdds, sampleMappings);
    const state = getState();

    expect(state).toHaveLength(2);

    const firstEvent = state[0];
    expect(firstEvent).toMatchObject({
      id: "995e0722-4118-4f8e-a517-82f6ea240673",
      status: "LIVE",
      startTime: "2023-03-02T11:56:07.812Z",
      sport: "FOOTBALL",
      competitors: {
        HOME: { type: "HOME", name: "Juventus" },
        AWAY: { type: "AWAY", name: "Paris Saint-Germain" },
      },
      competition: "UEFA Champions League",
    });
  });
});
