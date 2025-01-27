export type SportEvent = {
  id: string;
  status: string;
  scores: Record<string, { type: string; home: string; away: string }>;
  startTime: string;
  sport: string;
  competitors: {
    HOME: { type: string; name: string };
    AWAY: { type: string; name: string };
  };
  competition: string;
};

type InternalState = Record<string, SportEvent>;
let state: InternalState = {};
let mappings: Record<string, string> = {};

export function updateState(newState: string, newMappings: string) {
  const mappingsMap = parseMappings(newMappings);
  mappings = mappingsMap;

  const events = newState.split("\n").filter((line) => line.trim().length > 0);

  state = events.reduce((acc, event) => {
    const [
      id,
      sportId,
      competitionId,
      startTime,
      homeId,
      awayId,
      status,
      scores,
    ] = event.split(",");

    const isoStartTime =
      !isNaN(Number(startTime)) && Number(startTime) > 0
        ? new Date(Number(startTime)).toISOString()
        : "Invalid Date";

    acc[id] = {
      id,
      status: mappingsMap[status] || `UNKNOWN (${status})`,
      scores: parseScores(scores, mappingsMap),
      startTime: isoStartTime,
      sport: mappingsMap[sportId] || `UNKNOWN (${sportId})`,
      competitors: {
        HOME: { type: "HOME", name: mappingsMap[homeId] || homeId },
        AWAY: { type: "AWAY", name: mappingsMap[awayId] || awayId },
      },
      competition: mappingsMap[competitionId] || `UNKNOWN (${competitionId})`,
    };

    return acc;
  }, {} as InternalState);
}

export function getState() {
  return Object.values(state).filter((event) => event.status !== "REMOVED");
}

export function resetState() {
  state = {};
}

export function processState(state: string, mappings: string): any {
  const mappingsMap = parseMappings(mappings);

  return state.split("\n").map((event) => {
    const [
      eventId,
      sportId,
      competitionId,
      startTime,
      homeId,
      awayId,
      status,
      scores,
    ] = event.split(",");
    return {
      eventId,
      status: mappingsMap[status] || `UNKNOWN (${status})`,
      startTime,
      sport: mappingsMap[sportId] || `UNKNOWN (${sportId})`,
      competitors: {
        home: mappingsMap[homeId] || homeId,
        away: mappingsMap[awayId] || awayId,
      },
      competition: mappingsMap[competitionId] || `UNKNOWN (${competitionId})`,
      scores: parseScores(scores, mappingsMap),
    };
  });
}

function parseMappings(mappings: string): Record<string, string> {
  return mappings.split(";").reduce((map, pair) => {
    const [id, value] = pair.split(":");
    map[id] = value;
    return map;
  }, {} as Record<string, string>);
}

function parseScores(
  scores: string,
  mappingsMap: Record<string, string>
): Record<string, { type: string; home: string; away: string }> {
  if (!scores) {
    return { CURRENT: { type: "CURRENT", home: "0", away: "0" } };
  }

  return scores.split("|").reduce((scoreAcc, score) => {
    const [typeId, homeAway] = score.split("@");
    if (typeId && homeAway) {
      const [home, away] = homeAway.split(":");
      scoreAcc[mappingsMap[typeId] || typeId] = {
        type: mappingsMap[typeId] || typeId,
        home: home || "0",
        away: away || "0",
      };
    } else {
      console.warn(`Invalid score format: ${score}`);
    }
    return scoreAcc;
  }, {} as Record<string, { type: string; home: string; away: string }>);
}
