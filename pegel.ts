// @filename: pegel.ts

const fiveMinutesinMilliSec = 5*60*1000;
let pegelStand = "0 cm";

function inrange(value: number, min: number, max: number): boolean {
  if (value >= min && value <= max) {
    return true;
  }
  return false;
}

function selectIcon(pegelStand: string): string {

  const pegelStandElements = pegelStand.split(" ");
  const depth = parseInt(pegelStandElements[0]);

  if (inrange(depth, 0, 30)) {
    return "i24114";
  }
  if (inrange(depth, 31, 60)) {
    return "i24115";
  }
  if (inrange(depth, 61, 100)) {
    return "i24116";
  }
  if (inrange(depth, 101, 130)) {
    return "i24117";
  }
  if (inrange(depth, 131, 150)) {
    return "i24118";
  }
  if (inrange(depth, 151, 200)) {
    return "i24119";
  }
  return "i24120";
}

async function fetchPegelInfo() {
  const formData = new URLSearchParams();
  formData.append("pgnr", "BW_92");

  const request = new Request(
    "https://www.hochwasserzentralen.de/webservices/get_infospegel.php",
    {
      method: "POST",
      body: formData,
    },
  );

  let depth = "";
  try {
    const response = await fetch(request);
    const pegelData = await response.json();
    depth = pegelData.W;
  } catch (e) {
    console.error(e);
  }

  console.log("pegelStand" + depth);
  pegelStand = depth;
}

export function getPegelJSON() {
  const lametricJSON = {
    "frames": [
      {
        "text": "Echaz " + pegelStand,
        "icon": selectIcon(pegelStand),
      },
    ],
  };

  return lametricJSON;
}

fetchPegelInfo()
setInterval(() => fetchPegelInfo(), fiveMinutesinMilliSec);
