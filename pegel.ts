// @filename: pegel.ts

const fiveMinutesinMilliSec = 5 * 60 * 1000;
let pegelStand = "0 cm";
let ki = "4711"

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

  let depth = "";
  try {
    const response = await fetch("https://www.hvz.baden-wuerttemberg.de/js/hvz_peg_stmn.js");
    // Get the data using this regex "\.*Wannweil.*,'(.*)','cm'" and extract the first group
    // constrauct the regex
    const regex = new RegExp(".*Wannweil.*,'(.*)','cm'");
    // get the contenct of the response as text and apply the regex to it
    const text = await response.text();
    // print the text to the console
    const match = regex.exec(text);
    if (match) {
      depth = match[1] + " cm";
    } else {
      console.error("Could not find pegelStand in response");
    }
  } catch (e) {
    console.error(e);
  }

  console.log("pegelStand:" + depth);
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

fetchPegelInfo();
setInterval(() => fetchPegelInfo(), fiveMinutesinMilliSec);
