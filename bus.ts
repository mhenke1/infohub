// @filename: bus.ts

const fiveMinutesinMilliSec = 3 * 60 * 1000;
let departuresList = [];

async function fetchBusInfo() {
  const request = new Request(
    "http://efa2.naldo.de/naldo/XSLT_DM_REQUEST?language=de&useRealtime=1&mode=direct&type_dm=stop&name_dm=${%20Reutlingen%20}%20${%20Im%20Dorf%20}&mId=efa_rc2&outputFormat=JSON&line=tub:07002:%20:H:j17&line=tub:07007:%20:H:j17&line=tub:07012:%20:R:j17&limit=20;",
  );

  let departures;
  try {
    const response = await fetch(request);
    const busData = await response.json();
    departures = busData.departureList;
  } catch (e) {
    console.error(e);
  }

  console.log("departures" + departures);
  departuresList = departures;
}

function extractTime(departure) {
  const depTime = departure.realDateTime || departure.dateTime;
  let minute = depTime.minute;
  if (minute.length === 1) {
    minute = "0" + minute;
  }
  return depTime.hour + ":" + minute;
}

function extractDeparturesForLine(departuresList, line: string) {
  const lineDeps = departuresList.filter((
    dep,
  ) => (dep.servingLine.number === line))
    .slice(0, 2).map((dep) => extractTime(dep)).join(" ");
  return lineDeps;
}

export function getBusJSON() {
  const lines = ["2", "12", "7"];
  const departures = new Map();
  lines.forEach((line) => {
    const lineDeps = extractDeparturesForLine(departuresList, line);
    departures.set(line, lineDeps);
  });

  let line12Departures = "FÄHRT HEUTE NICHT";
  if (departures.get("12")) {
    line12Departures = departures.get("12");
  }

  return {
    "frames": [
      {
        "text": "2 " + departures.get("2"),
        "icon": "a6175",
        "index": 0,
      },
      {
        "text": "12 " + line12Departures,
        "icon": "a6175",
        "index": 1,
      },
      {
        "text": "7 " + departures.get("7"),
        "icon": "a6175",
        "index": 2,
      },
    ],
  };
}

fetchBusInfo();
setInterval(() => fetchBusInfo(), fiveMinutesinMilliSec);
