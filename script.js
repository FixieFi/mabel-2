// MABEL SCRIPT VERSION 6 - AUTONOMOUS DAY

const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const activityLogElement = document.getElementById("activity-log");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
const replyElement = document.getElementById("reply");
const chatStatusElement = document.getElementById("chat-status");
const sparkNoticeCard = document.getElementById("spark-notice-card");
const viewSparkButton = document.getElementById("view-spark");
const galleryNoticeCard = document.getElementById("gallery-notice-card");
const galleryNoticeText = document.getElementById("gallery-notice-text");
const viewGalleryButton = document.getElementById("view-gallery");
const exploreButton = document.getElementById("explore");
const exploreStatus = document.getElementById("explore-status");
const needComfort = document.getElementById("need-comfort");
const needCuriosity = document.getElementById("need-curiosity");
const needConnection = document.getElementById("need-connection");
const needRest = document.getElementById("need-rest");
const needWonder = document.getElementById("need-wonder");
const needFood = document.getElementById("need-food");
const needWater = document.getElementById("need-water");
const wishesElement = document.getElementById("wishes");
const interestsElement = document.getElementById("interests");
const changesElement = document.getElementById("changes");
const wanderButton = document.getElementById("wander");
const wanderStatus = document.getElementById("wander-status");
const musingElement = document.getElementById("musing");
const wanderingsElement = document.getElementById("wanderings");
const visitorBoardForm = document.getElementById("visitor-board-form");
const visitorBoardMessages = document.getElementById("visitor-board-messages");
const visitorBoardStatus = document.getElementById("visitor-board-status");

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

const MABEL_AI_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel";
const MABEL_ART_URL = "https://mabel-ai-artwork.fianna-b-murphy.workers.dev/mabel-art";
const MABEL_WANDER_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-wander";
const MABEL_DAY_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-day";
const MABEL_JOURNAL_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-journal";
const MABEL_BOARD_URL = "https://mabel-life.fianna-b-murphy.workers.dev/board";

const mabelStorageKey = "mabel-character-v5";
const conversationStorageKey = "mabel-conversation-session-v3";
const wanderingsStorageKey = "mabel-wanderings-v1";
const researchLogStorageKey = "mabel-library-research-v1";
const boardReadKeysStorageKey = "mabel-board-read-v1";
const sparksStorageKey = "mabel-sparks-v1";
const autonomousStorageKey = "mabel-autonomous-v1";
const reflectionStorageKey = "mabel-last-reflection-date";
const bindleStorageKey = "mabel-bindle-v1";
const galleryStorageKey = "mabel-gallery-v1";
const visitorProfileStorageKey = "mabel-visitor-profile-v1";

const legacySeedInterestIds = new Set([
  "silver-thread",
  "rain-listening",
  "button-collecting",
  "old-lane"
]);

let mabel = null;
let conversation = [];
let messagePending = false;
let wanderings = [];
let researchLog = [];
let boardReadKeys = [];
let sparks = [];
let lastAutonomousMoment = 0;

let autonomousMomentCount = 0;
let lastReflectionDate = "";

let bindle = {
  food: [],
  water: [],
  treasures: []
};

let gallery = [];
let visitorProfile = { facts: [], moments: [] };

function now() {
  return new Date().toISOString();
}

function saveMabel() {
  try {
    localStorage.setItem(mabelStorageKey, JSON.stringify(mabel));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function loadMabel() {
  try {
    const saved = localStorage.getItem(mabelStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to default Mabel.
  }

  return null;
}

function saveConversation() {
  try {
    sessionStorage.setItem(conversationStorageKey, JSON.stringify(conversation));
  } catch (error) {
    // Session storage may be unavailable.
  }
}

function loadConversation() {
  try {
    const saved = sessionStorage.getItem(conversationStorageKey);

    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(-12) : [];
    }
  } catch (error) {
    // Fall through to an empty conversation.
  }

  return [];
}

function saveWanderings() {
  try {
    localStorage.setItem(wanderingsStorageKey, JSON.stringify(wanderings));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function saveResearchLog() {
  try {
    localStorage.setItem(researchLogStorageKey, JSON.stringify(researchLog.slice(0, 30)));
  } catch (error) {
    // Research history remains available in memory for this visit.
  }
}

function loadResearchLog() {
  try {
    const saved = localStorage.getItem(researchLogStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
    }
  } catch (error) {
    // Fall through to an empty research log.
  }
  return [];
}

function saveBoardReadKeys() {
  try {
    localStorage.setItem(boardReadKeysStorageKey, JSON.stringify(boardReadKeys.slice(0, 100)));
  } catch (error) {
    // Board reading continues for this visit.
  }
}

function loadBoardReadKeys() {
  try {
    const saved = localStorage.getItem(boardReadKeysStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.slice(0, 100) : [];
    }
  } catch (error) {
    // Fall through to an empty list.
  }
  return [];
}

function saveSparks() {
  try {
    localStorage.setItem(sparksStorageKey, JSON.stringify(sparks));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function loadSparks() {
  try {
    const saved = localStorage.getItem(sparksStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to an empty spark list.
  }

  return [];
}

function saveBindle() {
  try {
    localStorage.setItem(bindleStorageKey, JSON.stringify(bindle));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function loadWanderings() {
  try {
    const saved = localStorage.getItem(wanderingsStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to an empty trail.
  }

  return [];
}

function saveLastAutonomousMoment() {
  try {
    localStorage.setItem(autonomousStorageKey, JSON.stringify(lastAutonomousMoment));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function saveGallery() {
  try {
    localStorage.setItem(galleryStorageKey, JSON.stringify(gallery));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function loadGallery() {
  try {
    const saved = localStorage.getItem(galleryStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to an empty gallery.
  }

  return [];
}

function renderMabelCard(artwork) {
  if (!artwork || !artwork.title) {
    return null;
  }

  if (!Number.isInteger(artwork.seed)) {
    artwork.seed = (Date.now() ^ Math.floor(Math.random() * 2147483647)) >>> 0;
  }

  let randomState = artwork.seed >>> 0;
  function random() {
    randomState += 0x6D2B79F5;
    let value = randomState;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  const fallbackPalette = ["#718778", "#b77769", "#e9d8b7"];
  const palette = Array.isArray(artwork.palette)
    ? artwork.palette.filter(function (colour) {
        return typeof colour === "string" && /^#[0-9a-fA-F]{6}$/.test(colour);
      }).slice(0, 3)
    : [];
  while (palette.length < 3) {
    palette.push(fallbackPalette[palette.length]);
  }

  const motif = typeof artwork.motif === "string" ? artwork.motif : "memory";
  const subject = typeof artwork.subject === "string" ? artwork.subject.toLowerCase() : (artwork.selfPortrait ? "mabel" : "");
  const symbols = Array.isArray(artwork.symbols) ? artwork.symbols.slice(0, 3) : [];
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("viewBox", "0 0 160 160");
  svg.setAttribute("class", "mabel-artwork-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", artwork.title);

  function node(name, attributes) {
    const element = document.createElementNS(namespace, name);
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    svg.appendChild(element);
    return element;
  }

  function ellipse(x, y, rx, ry, colour, opacity, rotation) {
    node("ellipse", {
      cx: x, cy: y, rx: rx, ry: ry, fill: colour, opacity: opacity,
      transform: "rotate(" + rotation + " " + x + " " + y + ")"
    });
  }

  function path(d, colour, width, opacity, fill) {
    node("path", {
      d: d, fill: fill || "none", stroke: colour, "stroke-width": width,
      "stroke-linecap": "round", "stroke-linejoin": "round", opacity: opacity
    });
  }

  function softBlob(x, y, rx, ry, colour, opacity) {
    const points = [];
    const count = 8;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const wobble = 0.72 + random() * 0.48;
      points.push([
        x + Math.cos(angle) * rx * wobble,
        y + Math.sin(angle) * ry * wobble
      ]);
    }
    let d = "M " + points[0][0] + " " + points[0][1];
    for (let i = 1; i <= count; i += 1) {
      const previous = points[(i - 1) % count];
      const current = points[i % count];
      const midX = (previous[0] + current[0]) / 2;
      const midY = (previous[1] + current[1]) / 2;
      d += " Q " + previous[0] + " " + previous[1] + " " + midX + " " + midY;
    }
    d += " Z";
    node("path", { d: d, fill: colour, opacity: opacity });
  }

  const background = palette[0];
  node("rect", { x: 0, y: 0, width: 160, height: 160, fill: background });
  node("rect", { x: 0, y: 0, width: 160, height: 160, fill: "#f4ead6", opacity: 0.24 });

  // Layered, irregular washes give each picture its own balance and weight.
  const washCount = 3 + Math.floor(random() * 4);
  for (let i = 0; i < washCount; i += 1) {
    softBlob(
      25 + random() * 110,
      22 + random() * 112,
      20 + random() * 34,
      14 + random() * 32,
      palette[1 + Math.floor(random() * 2)],
      0.16 + random() * 0.27
    );
  }

  // Loose brush marks keep the drawing from resolving into a repeated icon.
  const markCount = 18 + Math.floor(random() * 27);
  for (let i = 0; i < markCount; i += 1) {
    const x = -8 + random() * 176;
    const y = -8 + random() * 176;
    const bend = -18 + random() * 36;
    const length = 5 + random() * 25;
    const colour = palette[Math.floor(random() * palette.length)];
    path(
      "M " + x + " " + y +
      " Q " + (x + bend) + " " + (y + length / 2) +
      " " + (x + bend * 0.4) + " " + (y + length),
      colour,
      0.5 + random() * 2.7,
      0.12 + random() * 0.33
    );
  }

  if (motif === "rain") {
    const drift = -8 + random() * 16;
    for (let i = 0; i < 11 + Math.floor(random() * 13); i += 1) {
      const x = 12 + random() * 136;
      const y = 8 + random() * 135;
      const fall = 9 + random() * 25;
      path(
        "M " + x + " " + y + " Q " + (x + drift) + " " + (y + fall * 0.5) +
        " " + (x - 3 + random() * 7) + " " + (y + fall),
        palette[2], 0.7 + random() * 1.8, 0.28 + random() * 0.42
      );
    }
    softBlob(112 + random() * 20, 38 + random() * 55, 18, 12, palette[1], 0.28);
  } else if (motif === "night" || motif === "stars") {
    const cx = 45 + random() * 70;
    const cy = 38 + random() * 70;
    ellipse(cx, cy, 17 + random() * 8, 19 + random() * 8, palette[2], 0.68, -20 + random() * 40);
    ellipse(cx + 8, cy - 4, 16, 18, palette[0], 0.8, 0);
    for (let i = 0; i < 18 + Math.floor(random() * 20); i += 1) {
      const x = random() * 160;
      const y = random() * 160;
      const r = 0.6 + random() * 2.1;
      if (random() > 0.55) {
        path("M " + (x - r) + " " + y + " L " + (x + r) + " " + y +
          " M " + x + " " + (y - r) + " L " + x + " " + (y + r),
          palette[1 + Math.floor(random() * 2)], 0.7 + random(), 0.7);
      } else {
        ellipse(x, y, r, r, palette[2], 0.35 + random() * 0.55, 0);
      }
    }
  } else if (motif === "bloom") {
    const cx = 45 + random() * 70;
    const cy = 42 + random() * 68;
    const petals = 5 + Math.floor(random() * 5);
    for (let i = 0; i < petals; i += 1) {
      const angle = (Math.PI * 2 * i) / petals + random() * 0.3;
      const px = cx + Math.cos(angle) * (13 + random() * 8);
      const py = cy + Math.sin(angle) * (13 + random() * 8);
      ellipse(px, py, 7 + random() * 6, 3 + random() * 4, palette[1 + (i % 2)], 0.35 + random() * 0.35, angle * 57.3);
    }
    ellipse(cx, cy, 4 + random() * 4, 4 + random() * 4, palette[2], 0.8, 0);
    path("M " + cx + " " + (cy + 9) + " Q " + (cx - 8) + " 112 " + (cx + random() * 18 - 9) + " 151",
      palette[1], 2 + random() * 2, 0.68);
  } else if (motif === "threads") {
    for (let i = 0; i < 3 + Math.floor(random() * 5); i += 1) {
      const y = 22 + i * (12 + random() * 10);
      const sway = -30 + random() * 60;
      path(
        "M -8 " + y + " C " + (40 + sway) + " " + (y - 35) +
        ", " + (85 - sway) + " " + (y + 38) + ", 168 " + (y - 4 + random() * 20),
        palette[1 + (i % 2)], 0.8 + random() * 2.3, 0.3 + random() * 0.4
      );
    }
  } else if (motif === "roots") {
    const x = 30 + random() * 100;
    const top = 22 + random() * 30;
    path("M " + x + " " + top + " C " + (x - 20) + " 75, " + (x + 18) + " 104, " + (x - 12) + " 163",
      palette[1], 2 + random() * 2, 0.72);
    for (let i = 0; i < 8; i += 1) {
      const y = 42 + random() * 100;
      const dx = (random() - 0.5) * 95;
      path("M " + x + " " + y + " Q " + (x + dx * 0.4) + " " + (y + 8) +
        " " + (x + dx) + " " + (y + 20 + random() * 20),
        palette[1 + (i % 2)], 0.7 + random() * 2, 0.34 + random() * 0.45);
    }
  } else if (motif === "embers") {
    const cx = 35 + random() * 90;
    const cy = 35 + random() * 90;
    for (let i = 0; i < 16 + Math.floor(random() * 18); i += 1) {
      const x = cx + (random() - 0.5) * 78;
      const y = cy + (random() - 0.5) * 78;
      ellipse(x, y, 1 + random() * 4, 2 + random() * 7, palette[1 + (i % 2)], 0.3 + random() * 0.55, -45 + random() * 90);
    }
  } else if (motif === "memory") {
    const cx = 35 + random() * 90;
    const cy = 35 + random() * 90;
    for (let i = 0; i < 4; i += 1) {
      ellipse(cx + (random() - 0.5) * 16, cy + (random() - 0.5) * 16,
        12 + i * 5, 8 + i * 4, "none", 0.55 - i * 0.08, random() * 35 - 18);
      path("M " + (cx - 12 - i * 3) + " " + (cy + 13 + i * 4) +
        " Q " + cx + " " + (cy + 20 + i * 5) + " " + (cx + 18 + i * 3) + " " + (cy + 8 + i * 3),
        palette[(i + 1) % 3], 1 + random() * 1.2, 0.4);
    }
  } else if (motif === "moss") {
    for (let i = 0; i < 24 + Math.floor(random() * 20); i += 1) {
      const x = random() * 160;
      const y = 95 + random() * 70;
      softBlob(x, y, 4 + random() * 12, 3 + random() * 8,
        palette[1 + Math.floor(random() * 2)], 0.2 + random() * 0.38);
    }
  } else if (motif === "path") {
    const startX = 25 + random() * 100;
    const endX = 25 + random() * 100;
    path("M " + startX + " 165 C " + (startX - 24 + random() * 48) + " 125, " +
      (endX - 28 + random() * 56) + " 70, " + endX + " -5",
      palette[2], 5 + random() * 6, 0.38);
    path("M " + startX + " 165 C " + (startX - 24 + random() * 48) + " 125, " +
      (endX - 28 + random() * 56) + " 70, " + endX + " -5",
      palette[1], 1 + random() * 1.4, 0.72);
    for (let i = 0; i < 8; i += 1) {
      ellipse(20 + random() * 120, 20 + random() * 125, 1 + random() * 3, 1 + random() * 3,
        palette[2], 0.6, 0);
    }
  } else if (motif === "echo") {
    const cx = 35 + random() * 90;
    const cy = 35 + random() * 90;
    for (let i = 0; i < 7; i += 1) {
      path("M " + (cx - i * 6) + " " + cy + " A " + (8 + i * 6) + " " +
        (5 + i * 5) + " 0 1 0 " + (cx + i * 6) + " " + (cy + random() * 8),
        palette[1 + (i % 2)], 0.8 + random() * 1.6, 0.25 + random() * 0.35);
    }
  } else {
    const drift = 15 + random() * 50;
    for (let i = 0; i < 6 + Math.floor(random() * 8); i += 1) {
      softBlob(random() * 160, random() * 160, 12 + random() * 30, 8 + random() * 23,
        palette[1 + (i % 2)], 0.12 + random() * 0.2);
    }
    path("M -5 " + (70 + random() * 30) + " C " + drift + " 35, " + (100 + random() * 40) +
      " 125, 165 " + (72 + random() * 35), palette[2], 1.2 + random() * 2, 0.3);
  }

  const symbolMarks = {
    leaf: function (x, y, size) {
      path("M " + x + " " + y + " Q " + (x + size) + " " + (y - size) +
        " " + (x + size * 1.5) + " " + y + " Q " + (x + size) + " " + (y + size) + " " + x + " " + y,
        palette[1], 1.3, 0.8);
      path("M " + x + " " + y + " Q " + (x + size * 0.7) + " " + y + " " + (x + size * 1.4) + " " + y,
        palette[2], 0.8, 0.65);
    },
    moon: function (x, y, size) {
      ellipse(x, y, size, size * 1.1, palette[2], 0.8, -12);
      ellipse(x + size * 0.45, y - size * 0.16, size * 0.88, size * 1.02, palette[0], 0.9, 0);
    },
    berry: function (x, y, size) {
      for (let i = 0; i < 5; i += 1) {
        ellipse(x + (random() - 0.5) * size, y + (random() - 0.5) * size,
          size * 0.25, size * 0.25, palette[1], 0.75, 0);
      }
    },
    feather: function (x, y, size) {
      path("M " + x + " " + (y + size) + " Q " + (x + size) + " " + y + " " + (x + size * 0.35) + " " + (y - size),
        palette[2], 1.5, 0.8);
      for (let i = -2; i <= 2; i += 1) {
        path("M " + (x + size * 0.4) + " " + (y + i * size * 0.25) +
          " Q " + (x + size * 0.8) + " " + (y + i * size * 0.25 - 4) +
          " " + (x + size) + " " + (y + i * size * 0.25 - 7), palette[1], 0.8, 0.55);
      }
    },
    button: function (x, y, size) {
      ellipse(x, y, size, size, palette[1], 0.7, 0);
      ellipse(x - size * 0.25, y - size * 0.2, 1.1, 1.1, palette[0], 0.8, 0);
      ellipse(x + size * 0.25, y - size * 0.2, 1.1, 1.1, palette[0], 0.8, 0);
      ellipse(x - size * 0.25, y + size * 0.2, 1.1, 1.1, palette[0], 0.8, 0);
      ellipse(x + size * 0.25, y + size * 0.2, 1.1, 1.1, palette[0], 0.8, 0);
    },
    seed: function (x, y, size) {
      ellipse(x, y, size * 0.5, size, palette[1], 0.8, -35);
      path("M " + x + " " + (y + size * 0.7) + " Q " + (x - 3) + " " + (y - size) +
        " " + (x + size) + " " + (y - size * 1.5), palette[2], 0.9, 0.75);
    },
    raindrop: function (x, y, size) {
      path("M " + x + " " + (y - size) + " Q " + (x + size) + " " + y + " " + x + " " +
        (y + size) + " Q " + (x - size) + " " + y + " " + x + " " + (y - size),
        palette[2], 1, 0.76, palette[1]);
    },
    stone: function (x, y, size) {
      softBlob(x, y, size * 1.4, size, palette[1], 0.74);
      path("M " + (x - size * 0.5) + " " + y + " Q " + x + " " + (y - size * 0.6) +
        " " + (x + size * 0.5) + " " + (y - size * 0.35), palette[2], 0.8, 0.6);
    },
    doorway: function (x, y, size) {
      path("M " + (x - size) + " " + (y + size) + " L " + (x - size) + " " + y +
        " Q " + x + " " + (y - size * 1.7) + " " + (x + size) + " " + y +
        " L " + (x + size) + " " + (y + size), palette[2], 1.5, 0.78);
      ellipse(x + size * 0.45, y, 0.8, 0.8, palette[1], 0.9, 0);
    },
    shell: function (x, y, size) {
      path("M " + x + " " + y + " C " + (x + size * 2) + " " + (y - size * 2) +
        ", " + (x + size * 2) + " " + (y + size * 2) + ", " + x + " " + y +
        " C " + (x + size) + " " + (y - size) + ", " + (x + size) + " " + (y + size) +
        ", " + x + " " + y, palette[1], 1.1, 0.75);
    },
    twig: function (x, y, size) {
      path("M " + (x - size) + " " + (y + size) + " Q " + x + " " + y + " " +
        (x + size) + " " + (y - size), palette[1], 1.5, 0.8);
      path("M " + x + " " + y + " Q " + (x - size) + " " + (y - size) + " " +
        (x - size * 0.8) + " " + (y - size * 1.3), palette[2], 0.9, 0.7);
    }
  };

  symbols.forEach(function (symbol) {
    const drawer = symbolMarks[String(symbol).toLowerCase()];
    if (drawer) {
      drawer(25 + random() * 100, 25 + random() * 100, 4 + random() * 8);
    }
  });

  if (subject === "mabel") {
    const cx = 80 + random() * 5;
    const cy = 83 + random() * 5;
    ellipse(cx - 20, cy - 25, 13, 20, palette[1], 0.82, -18);
    ellipse(cx + 19, cy - 26, 13, 20, palette[1], 0.82, 18);
    ellipse(cx - 20, cy - 25, 6, 12, palette[2], 0.72, -18);
    ellipse(cx + 19, cy - 26, 6, 12, palette[2], 0.72, 18);
    ellipse(cx, cy + 31, 23, 29, palette[1], 0.58, -8);
    softBlob(cx, cy - 3, 31, 27, palette[1], 0.9);
    softBlob(cx + 5, cy + 8, 19, 13, "#f4ead6", 0.8);
    ellipse(cx - 10, cy - 4, 2.2, 3, "#432a5e", 0.9, 0);
    ellipse(cx + 11, cy - 4, 2.2, 3, "#432a5e", 0.9, 0);
    ellipse(cx + 1, cy + 7, 2.4, 1.8, palette[2], 0.95, 0);
    path("M " + (cx - 3) + " " + (cy + 10) + " Q " + cx + " " + (cy + 15) + " " + (cx + 4) + " " + (cy + 10),
      "#432a5e", 1.1, 0.8);
    path("M " + (cx - 14) + " " + (cy + 7) + " Q " + (cx - 28) + " " + (cy + 4) + " " + (cx - 37) + " " + (cy + 2) +
      " M " + (cx - 14) + " " + (cy + 12) + " Q " + (cx - 28) + " " + (cy + 14) + " " + (cx - 35) + " " + (cy + 17) +
      " M " + (cx + 14) + " " + (cy + 7) + " Q " + (cx + 28) + " " + (cy + 4) + " " + (cx + 37) + " " + (cy + 2) +
      " M " + (cx + 14) + " " + (cy + 12) + " Q " + (cx + 28) + " " + (cy + 14) + " " + (cx + 35) + " " + (cy + 17),
      palette[2], 0.8, 0.75);
    path("M " + (cx + 19) + " " + (cy + 47) + " Q " + (cx + 41) + " " + (cy + 40) + " " + (cx + 37) + " " + (cy + 25),
      palette[1], 2, 0.55);
  } else if (subject === "cat") {
    const cx = 78 + random() * 8;
    const cy = 82 + random() * 8;
    path("M " + (cx - 27) + " " + (cy - 14) + " L " + (cx - 31) + " " + (cy - 42) +
      " Q " + (cx - 18) + " " + (cy - 35) + " " + (cx - 10) + " " + (cy - 29) +
      " Q " + cx + " " + (cy - 34) + " " + (cx + 10) + " " + (cy - 29) +
      " Q " + (cx + 22) + " " + (cy - 36) + " " + (cx + 30) + " " + (cy - 42) +
      " L " + (cx + 27) + " " + (cy - 12) + " Q " + (cx + 34) + " " + cy + " " +
      (cx + 28) + " " + (cy + 20) + " Q " + cx + " " + (cy + 42) + " " +
      (cx - 28) + " " + (cy + 20) + " Q " + (cx - 36) + " " + cy + " " +
      (cx - 27) + " " + (cy - 14) + " Z", palette[1], 2, 0.84, palette[1]);
    ellipse(cx - 12, cy - 4, 2.2, 3, "#432a5e", 0.9, 0);
    ellipse(cx + 12, cy - 4, 2.2, 3, "#432a5e", 0.9, 0);
    path("M " + (cx - 4) + " " + (cy + 7) + " Q " + cx + " " + (cy + 12) + " " + (cx + 4) + " " + (cy + 7),
      "#432a5e", 1.3, 0.8);
    path("M " + (cx - 4) + " " + (cy + 8) + " L " + cx + " " + (cy + 12) + " L " + (cx + 4) + " " + (cy + 8),
      palette[2], 1.2, 0.95, palette[2]);
    path("M " + (cx - 18) + " " + (cy + 9) + " Q " + (cx - 32) + " " + (cy + 7) + " " + (cx - 39) + " " + (cy + 5) +
      " M " + (cx - 18) + " " + (cy + 13) + " Q " + (cx - 32) + " " + (cy + 15) + " " + (cx - 38) + " " + (cy + 17) +
      " M " + (cx + 18) + " " + (cy + 9) + " Q " + (cx + 32) + " " + (cy + 7) + " " + (cx + 39) + " " + (cy + 5) +
      " M " + (cx + 18) + " " + (cy + 13) + " Q " + (cx + 32) + " " + (cy + 15) + " " + (cx + 38) + " " + (cy + 17),
      palette[2], 0.9, 0.7);
  } else if (subject === "fossil") {
    const cx = 80 + random() * 8;
    const cy = 82 + random() * 8;
    softBlob(cx, cy, 35, 27, palette[1], 0.68);
    path("M " + (cx + 4) + " " + (cy + 16) + " C " + (cx - 20) + " " + (cy + 16) + " " +
      (cx - 18) + " " + (cy - 10) + " " + (cx + 1) + " " + (cy - 10) +
      " C " + (cx + 18) + " " + (cy - 10) + " " + (cx + 17) + " " + (cy + 7) + " " +
      (cx + 4) + " " + (cy + 7) + " C " + (cx - 5) + " " + (cy + 7) + " " +
      (cx - 4) + " " + (cy - 1) + " " + (cx + 3) + " " + (cy - 1),
      palette[2], 2, 0.88);
  } else if (subject === "button") {
    symbolMarks.button(80, 80, 22);
  }

  for (let i = 0; i < 45; i += 1) {
    ellipse(random() * 160, random() * 160, 0.3 + random() * 0.8, 0.3 + random() * 0.8,
      palette[2], 0.12 + random() * 0.15, 0);
  }

  const card = document.createElement("div");
  card.className = "mabel-artwork-card";

  const title = document.createElement("p");
  title.className = "mabel-artwork-title";
  title.textContent = artwork.title;

  const drawing = document.createElement("div");
  drawing.className = "mabel-artwork-drawing";
  drawing.appendChild(svg);

  const note = document.createElement("p");
  note.className = "mabel-artwork-note";
  note.textContent = artwork.note || "Mabel made a small drawing to remember this.";

  card.appendChild(title);
  card.appendChild(drawing);
  card.appendChild(note);
  return card;
}
function saveToMabelGallery(artwork) {
  if (!artwork || !artwork.title) {
    return;
  }

  gallery.unshift({
    at: now(),
    ...artwork
  });

  if (gallery.length > 30) {
    gallery.length = 30;
  }

  saveGallery();
  updateGallery();
  updateVisitorProfile();
}

function formatArtworkTime(isoTime) {
  const date = new Date(isoTime);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateGallery() {
  const galleryElement = document.getElementById("gallery");

  if (!galleryElement) {
    return;
  }

  galleryElement.innerHTML = "";

  if (gallery.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel has not made any little drawings yet.";
    galleryElement.appendChild(item);
    return;
  }

  gallery.forEach(function (artwork) {
    const item = document.createElement("li");
    item.className = "gallery-item";

    const title = document.createElement("strong");
    title.textContent = formatArtworkTime(artwork.at) + " — " + artwork.title;

    const note = document.createElement("p");
    note.textContent = artwork.note || "A little drawing Mabel made.";

    item.appendChild(title);
    item.appendChild(note);

    const drawing = renderMabelCard(artwork);

    if (drawing) {
      item.appendChild(drawing);
    }

    galleryElement.appendChild(item);
  });
}

function loadBindle() {
  try {
    const saved = localStorage.getItem(bindleStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to an empty bindle.
  }

  return {
    food: [],
    water: [],
    treasures: []
  };
}

function loadLastAutonomousMoment() {
  try {
    const saved = localStorage.getItem(autonomousStorageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to zero.
  }

  return 0;
}

function createDefaultMabel() {
  return {
    version: 5,
    character: {
      name: "Mabel",
      title: "Mabel of the Hawthorn Hollow",
      species: "mouse",
      home: "a mossy hollow beneath an old hawthorn tree"
    },
    needs: {
      comfort: 0.7,
      curiosity: 0.6,
      connection: 0.4,
      rest: 0.8,
      wonder: 0.5,
      food: 0.7,
      water: 0.75
    },
    now: {
      updatedAt: now(),
      doing: "listening for the hush between raindrops",
      thought: "Every small thing remembers being part of something larger.",
      mood: "wondering",
      energy: 0.72
    },
    feed: [],
    interests: [],
    memories: []
  };
}

function addFeedEntry(entry) {
  mabel.feed.unshift({
    at: now(),
    ...entry,
    ok: true
  });

  if (mabel.feed.length > 80) {
    mabel.feed.length = 80;
  }
}

function addDiaryEntry(entry) {
  addFeedEntry({
    kind: entry.kind,
    text: entry.text,
    why: entry.title || "",
    journalTitle: entry.title || ""
  });
}

function clampNeed(value) {
  return Math.max(0, Math.min(1, value));
}

function chooseAction() {
  const hungry = mabel.needs.food < 0.35;
  const thirsty = mabel.needs.water < 0.35;
  const tired = mabel.needs.rest < 0.35;
  const lonely = mabel.needs.connection < 0.3;
  const actionNames = [
    "listen_to_rain", "find_a_treasure", "rest_in_hollow", "write_in_diary",
    "inspect_a_leaf", "listen_for_small_creatures", "watch_the_weather",
    "sit_by_the_path", "gather_moss", "follow_a_scent"
  ];

  if (hungry) actionNames.push("look_for_food", "look_for_food", "look_for_food");
  if (thirsty) actionNames.push("find_water", "find_water", "find_water");
  if (tired) actionNames.push("rest_in_hollow", "rest_in_hollow");
  if (lonely) actionNames.push("sit_by_the_path", "sit_by_the_path");

  const activeInterests = mabel.interests.filter(function (interest) {
    return interest.stage === "growing" || interest.stage === "pursuing";
  });
  const canPursueInterest = !hungry && !thirsty && !tired && activeInterests.length > 0;
  const pursueInterest = canPursueInterest &&
    Math.random() < Math.min(0.6, 0.2 + activeInterests[0].pull * 0.35);
  let chosen = actionNames[Math.floor(Math.random() * actionNames.length)];

  if (hungry && bindle.food.length > 0 && (!thirsty || mabel.needs.food <= mabel.needs.water)) {
    chosen = "eat_stored_food";
  } else if (thirsty && bindle.water.length > 0) {
    chosen = "drink_stored_water";
  }

  const actionText = {
    listen_to_rain: "listening to rain gather on the hawthorn leaves",
    find_a_treasure: "searching beneath the roots for something small and shining",
    rest_in_hollow: "resting in her nest of moss and fallen blossom",
    write_in_diary: "writing by the light of a thimble lantern",
    inspect_a_leaf: "turning a curled leaf over in her paws",
    listen_for_small_creatures: "listening for small creatures moving through the grass",
    watch_the_weather: "watching the weather change above the hawthorn",
    sit_by_the_path: "sitting beside the path and listening for a familiar voice",
    gather_moss: "gathering a little moss for her nest",
    follow_a_scent: "following a faint scent through the damp grass",
    look_for_food: "looking for something to eat among the brambles",
    find_water: "looking for water gathered in a leaf",
    eat_stored_food: "eating food she saved in her bindle",
    drink_stored_water: "drinking water she saved for later"
  };
  const actionMood = {
    listen_to_rain: "quiet", find_a_treasure: "curious", rest_in_hollow: "sleepy",
    write_in_diary: "thoughtful", inspect_a_leaf: "curious",
    listen_for_small_creatures: "attentive", watch_the_weather: "quiet",
    sit_by_the_path: "hopeful", gather_moss: "busy", follow_a_scent: "curious",
    look_for_food: "hungry", find_water: "thirsty",
    eat_stored_food: "content", drink_stored_water: "relieved"
  };
  const actionThought = {
    listen_to_rain: "Rain taps gently on the hawthorn leaves.",
    find_a_treasure: "What has this little thing seen before it reached the roots?",
    rest_in_hollow: "Mabel needs a quiet pause.",
    write_in_diary: "There is one small thing from today she wants to keep.",
    inspect_a_leaf: "The marks on this leaf look almost like a map.",
    listen_for_small_creatures: "Something small is moving through the grass.",
    watch_the_weather: "The weather has changed while she was looking elsewhere.",
    sit_by_the_path: "Mabel likes to see who might pass.",
    gather_moss: "This moss will make her nest softer.",
    follow_a_scent: "A new smell has come through the grass.",
    look_for_food: "Mabel is hungry. The brambles may have something.",
    find_water: "Mabel is thirsty. She is looking for a drink.",
    eat_stored_food: "She is glad she kept this for later.",
    drink_stored_water: "The cool water helps her feel steadier."
  };

  mabel.needs.food = clampNeed(mabel.needs.food - 0.005);
  mabel.needs.water = clampNeed(mabel.needs.water - 0.006);
  mabel.needs.rest = clampNeed(mabel.needs.rest + (chosen === "rest_in_hollow" ? 0.12 : -0.003));
  mabel.needs.comfort = clampNeed(mabel.needs.comfort + (Math.random() - 0.48) * 0.025);
  mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + (Math.random() - 0.4) * 0.025);
  mabel.needs.connection = clampNeed(mabel.needs.connection - 0.005);
  mabel.needs.wonder = clampNeed(mabel.needs.wonder + (Math.random() - 0.47) * 0.025);

  let activityOverride = "";
  let thoughtOverride = "";

  if (chosen === "find_a_treasure" && Math.random() < 0.35) {
    const find = diversifyWanderFinds([null])[0];
    if (find) {
      applyExplorationFinds([find]);
      const outing = { kind: "exploration", at: now(), title: "A wander beneath the hawthorn", finds: [find] };
      wanderings.unshift(outing);
      wanderings = wanderings.slice(0, 30);
      saveWanderings();
      addFeedEntry({ kind: "noticed", text: "Mabel found " + find.name + " while on her own.", why: find.note || "It caught her eye beneath the hawthorn." });
      activityOverride = "looking over " + find.name + " beneath the hawthorn";
      thoughtOverride = find.note || "What journey brought this little thing here?";
    }
  }

  if (chosen === "look_for_food" && Math.random() < 0.65) {
    const foods = ["two blackberries", "a few sunflower seeds", "a rosehip", "a fallen hazelnut"];
    const foundFood = foods[Math.floor(Math.random() * foods.length)];
    if (mabel.needs.food < 0.58) {
      chosen = "eat_stored_food";
      activityOverride = "eating " + foundFood + " she found";
      thoughtOverride = "That was just what she needed.";
      mabel.needs.food = clampNeed(mabel.needs.food + 0.22);
      addFeedEntry({ kind: "did", text: "Mabel found and ate " + foundFood + ".", why: "She was hungry." });
    } else {
      bindle.food.unshift({ name: foundFood, note: "Mabel saved it for later." });
      bindle.food.length = Math.min(bindle.food.length, 8);
    }
  }

  if (chosen === "find_water" && Math.random() < 0.6) {
    const waters = ["rainwater in a curled leaf", "a bead of dew", "a little spring puddle"];
    const foundWater = waters[Math.floor(Math.random() * waters.length)];
    if (mabel.needs.water < 0.58) {
      chosen = "drink_stored_water";
      activityOverride = "drinking " + foundWater;
      thoughtOverride = "The cool water helps her feel steadier.";
      mabel.needs.water = clampNeed(mabel.needs.water + 0.24);
      addFeedEntry({ kind: "did", text: "Mabel found water and had a drink.", why: foundWater + " was gathered nearby." });
    } else {
      bindle.water.unshift({ name: foundWater, note: "Mabel saved it for later." });
      bindle.water.length = Math.min(bindle.water.length, 5);
    }
  }

  if (chosen === "eat_stored_food" && bindle.food.length > 0) {
    const meal = bindle.food.shift();
    mabel.needs.food = clampNeed(mabel.needs.food + 0.24);
    activityOverride = "eating " + meal.name + " from her bindle";
  }
  if (chosen === "drink_stored_water" && bindle.water.length > 0) {
    const drink = bindle.water.shift();
    mabel.needs.water = clampNeed(mabel.needs.water + 0.25);
    activityOverride = "drinking " + drink.name + " from her bindle";
  }

  const followsInterest = pursueInterest && !activityOverride;
  mabel.now.doing = activityOverride || (followsInterest
    ? "following her curiosity about " + activeInterests[0].title
    : actionText[chosen]);
  mabel.now.updatedAt = now();
  mabel.now.mood = activityOverride
    ? (chosen === "drink_stored_water" || activityOverride.indexOf("drinking ") === 0 ? "relieved" : "content")
    : followsInterest ? "absorbed" : (actionMood[chosen] || "curious");
  mabel.now.thought = thoughtOverride || (followsInterest
    ? activeInterests[0].question
    : (actionThought[chosen] || mabel.now.thought));

  if (followsInterest) {
    activeInterests[0].pull = clampNeed(activeInterests[0].pull + 0.035);
    activeInterests[0].lastPursuedAt = now();
  }

  mabel.now.energy = clampNeed(
    0.18 + mabel.needs.rest * 0.5 + Math.min(mabel.needs.food, mabel.needs.water) * 0.32
  );
  if (chosen === "look_for_food" || chosen === "find_water" || chosen === "eat_stored_food" || chosen === "drink_stored_water") {
    saveBindle();
  }

  addFeedEntry({
    kind: "did",
    text: mabel.now.doing,
    why: pursueInterest ? activeInterests[0].question : "Mabel chose this for herself."
  });
  saveMabel();
  updatePage();
}

function applyExplorationFinds(findings) {
  ensureHollowWorld();
  (findings || []).forEach(function (found) {
    const kind = ["food", "water", "treasure"].includes(found.kind) ? found.kind : "treasure";
    const name = String(found.name || "something small").slice(0, 80);
    const note = String(found.note || "").slice(0, 160);

    if (kind === "food") {
      if (mabel.needs.food < 0.58) {
        mabel.needs.food = clampNeed(mabel.needs.food + 0.24);
        addFeedEntry({ kind: "did", text: "Mabel found and ate " + name + ".", why: note || "She was hungry." });
      } else {
        bindle.food.unshift({ name: name, note: note });
        bindle.food.length = Math.min(bindle.food.length, 8);
      }
    } else if (kind === "water") {
      if (mabel.needs.water < 0.58) {
        mabel.needs.water = clampNeed(mabel.needs.water + 0.26);
        addFeedEntry({ kind: "did", text: "Mabel found water and had a drink.", why: note || name });
      } else {
        bindle.water.unshift({ name: name, note: note });
        bindle.water.length = Math.min(bindle.water.length, 5);
      }
    } else {
      bindle.treasures.unshift({ name: name, note: note });
      bindle.treasures.length = Math.min(bindle.treasures.length, 12);
      mabel.world.objects.unshift({ name: name, at: now(), source: "wandering", note: note, reaction: "" });
      mabel.world.objects.length = Math.min(mabel.world.objects.length, 20);
      mabel.needs.wonder = clampNeed(mabel.needs.wonder + 0.08);
    }
  });
  saveBindle();
}

function handleExplore() {
  if (!mabel || (exploreButton && exploreButton.disabled)) return;
  if (exploreButton) exploreButton.disabled = true;
  if (exploreStatus) exploreStatus.textContent = "Mabel has set off to see what turns up.";
  try {
    const finds = diversifyWanderFinds([null, null]);
    const outing = {
      kind: "exploration",
      at: now(),
      title: "A little wander near home",
      finds: finds
    };
    wanderings.unshift(outing);
    wanderings.length = Math.min(wanderings.length, 30);
    applyExplorationFinds(finds);
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.08);
    mabel.now.doing = "exploring near her home";
    mabel.now.thought = finds.length
      ? "What might these small discoveries turn out to be?"
      : "The path looks different today.";
    mabel.now.mood = "curious";
    mabel.now.updatedAt = now();
    addFeedEntry({
      kind: "noticed",
      text: "Mabel went exploring and found " + (finds.map(function (item) { return item.name; }).join(" and ") || "a new path") + ".",
      why: finds.map(function (item) { return item.note; }).filter(Boolean).join(" ")
    });
    saveWanderings();
    saveMabel();
    updatePage();
    if (exploreStatus) exploreStatus.textContent = "Mabel came home with " + finds.map(function (item) { return item.name; }).join(" and ") + ".";
  } finally {
    if (exploreButton) exploreButton.disabled = false;
  }
}

function updateNeeds() {
  if (needComfort) {
    needComfort.value = mabel.needs.comfort;
  }

  if (needCuriosity) {
    needCuriosity.value = mabel.needs.curiosity;
  }

  if (needConnection) {
    needConnection.value = mabel.needs.connection;
  }

  if (needRest) {
    needRest.value = mabel.needs.rest;
  }

  if (needWonder) {
    needWonder.value = mabel.needs.wonder;
  }

  if (needFood) {
    needFood.value = mabel.needs.food;
  }

  if (needWater) {
    needWater.value = mabel.needs.water;
  }
}

function updateWishes() {
  if (!wishesElement) return;
  wishesElement.innerHTML = "";

  const activeWishes = mabel.interests
    .filter(function (interest) { return interest.stage !== "dormant"; })
    .slice(0, 4);

  if (activeWishes.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel is resting between little wonders.";
    wishesElement.appendChild(item);
    return;
  }

  activeWishes.forEach(function (interest) {
    const item = document.createElement("li");
    const question = String(interest.question || "").trim().replace(/[?.!]+$/, "");
    const lowerQuestion = question.charAt(0).toLowerCase() + question.slice(1);
    if (/^(what|who|where|when|why|how|whether|if)\b/i.test(question)) {
      item.textContent = "Mabel wishes to know " + lowerQuestion + ".";
    } else {
      item.textContent = "Mabel wishes to learn about " + lowerQuestion + ".";
    }
    wishesElement.appendChild(item);
  });
}

function updateInterests() {
  if (!interestsElement) return;
  interestsElement.replaceChildren();
  const sorted = [...mabel.interests].sort(function (a, b) {
    return (b.pull || 0) - (a.pull || 0);
  });
  if (!sorted.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel has not found a question she wants to follow yet.";
    interestsElement.appendChild(empty);
    return;
  }
  sorted.forEach(function (interest) {
    const item = document.createElement("li");
    item.className = "interest-item";
    const title = document.createElement("strong");
    title.className = "interest-title";
    title.textContent = interest.title || "A small question";
    item.appendChild(title);
    const question = document.createElement("span");
    question.className = "interest-question";
    question.textContent = interest.question || "";
    item.appendChild(question);
    const meter = document.createElement("progress");
    meter.className = "interest-meter";
    meter.max = 1;
    meter.value = clampNeed(interest.pull || 0);
    item.appendChild(meter);
    const stepCount = Array.isArray(interest.steps) ? interest.steps.length : (interest.progress || 0);
    const stage = document.createElement("span");
    stage.className = "interest-stage";
    stage.textContent = stepCount > 0
      ? "Investigating · " + stepCount + (stepCount === 1 ? " step" : " steps")
      : (interest.stage === "pursuing" ? "Ready to investigate" : "Taking shape");
    item.appendChild(stage);
    if (interest.lastStep) {
      const progress = document.createElement("span");
      progress.className = "interest-progress-note";
      progress.textContent = "Latest step: " + interest.lastStep;
      item.appendChild(progress);
    }
    if (interest.lastSource) {
      const source = document.createElement("span");
      source.className = "interest-source";
      source.appendChild(document.createTextNode("Read: "));
      const safeUrl = safeExternalUrl(interest.lastSource.url);
      if (safeUrl) {
        const link = document.createElement("a");
        link.href = safeUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = interest.lastSource.title || "source";
        source.appendChild(link);
      } else {
        source.appendChild(document.createTextNode(interest.lastSource.title || "source not available"));
      }
      item.appendChild(source);
    }
    interestsElement.appendChild(item);
  });
}


function updateChanges() {
  if (!changesElement) {
    return;
  }

  changesElement.innerHTML = "";

  const changeEntries = mabel.feed.filter(function (entry) {
    return entry.kind === "mind";
  });

  if (changeEntries.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel is still becoming herself.";
    changesElement.appendChild(item);
    return;
  }

  changeEntries.slice(0, 8).forEach(function (entry) {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    item.textContent = time + " - " + entry.text;
    changesElement.appendChild(item);
  });
}

function updateDiary() {
  if (!diaryElement) return;
  diaryElement.replaceChildren();

  const diaryEntries = mabel.feed.filter(function (entry) {
    return ["diary", "journal", "reflection"].includes(entry.kind);
  });

  if (!diaryEntries.length) {
    const item = document.createElement("li");
    item.textContent = "Mabel has not written a diary page yet.";
    diaryElement.appendChild(item);
    return;
  }

  diaryEntries.slice(0, 10).forEach(function (entry) {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const title = document.createElement("strong");
    const text = document.createElement("p");

    if (entry.kind === "journal") {
      title.textContent = time + " — Evening page";
    } else if (entry.kind === "reflection") {
      title.textContent = time + " — End-of-day reflection";
    } else {
      title.textContent = time + " — " + (entry.journalTitle || "A note Mabel wanted to keep");
    }

    text.textContent = entry.text || "";
    item.appendChild(title);
    item.appendChild(text);
    diaryElement.appendChild(item);
  });
}

function updateActivityLog() {
  if (!activityLogElement) return;
  activityLogElement.replaceChildren();

  const activityEntries = mabel.feed.filter(function (entry) {
    return !["diary", "journal", "reflection"].includes(entry.kind);
  });

  if (!activityEntries.length) {
    const item = document.createElement("li");
    item.textContent = "Mabel's day has not begun yet.";
    activityLogElement.appendChild(item);
    return;
  }

  activityEntries.slice(0, 20).forEach(function (entry) {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    item.textContent = time + " — " + entry.text;
    if (entry.why) {
      const reason = document.createElement("span");
      reason.className = "activity-reason";
      reason.textContent = " " + entry.why;
      item.appendChild(reason);
    }
    activityLogElement.appendChild(item);
  });
}



function formatLibraryMethod(value) {
  const method = String(value || "").toLowerCase();
  if (method.includes("computer")) return "on a public computer by the window";
  if (method.includes("encyclopedia")) return "in the library’s well-thumbed encyclopedia";
  if (method.includes("magazine")) return "in a recent magazine";
  if (method.includes("field guide")) return "in an old field guide";
  if (method.includes("journal")) return "in a library journal";
  if (/^(in|on)\b/.test(method)) return value;
  return "in one of the library’s reference books";
}

function updateResearchLog() {
  const list = document.getElementById("research-log");
  if (!list) return;
  list.replaceChildren();

  if (!researchLog.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel has not visited the library yet.";
    list.appendChild(empty);
    return;
  }

  researchLog.slice(0, 12).forEach(function (entry) {
    const item = document.createElement("li");
    const subject = entry.focusTitle || entry.title || entry.searchQuestion || "a question of her own";
    const heading = document.createElement("strong");
    heading.textContent = "Mabel went to the library and researched " + subject + " " + formatLibraryMethod(entry.researchMethod) + ".";
    item.appendChild(heading);

    if (entry.researchSummary) {
      const summary = document.createElement("p");
      summary.textContent = entry.researchSummary;
      item.appendChild(summary);
    }

    const sourceUrl = safeExternalUrl(entry.url);
    if (sourceUrl && entry.sourceTitle) {
      const source = document.createElement("p");
      const link = document.createElement("a");
      link.href = sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = entry.sourceTitle;
      source.appendChild(link);
      item.appendChild(source);
    }
    list.appendChild(item);
  });
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function syncNoticedItemsIntoBindle() {
  ensureHollowWorld();
  const lists = { food: bindle.food, water: bindle.water, treasures: bindle.treasures };
  mabel.world.objects.forEach(function (object) {
    if (!object || (object.source !== "wandering" && !(object.source === "visitor" && object.noticedAt))) return;
    if (["eaten", "drank"].includes(object.status)) return;
    const target = object.kind === "food" ? lists.food : object.kind === "water" ? lists.water : lists.treasures;
    const name = String(object.name || "").trim();
    if (!name || target.some(function (item) {
      return item.giftId && item.giftId === object.id ||
        normalizeInterestTitle(item.name) === normalizeInterestTitle(name);
    })) return;
    target.unshift({
      name: name,
      note: object.note || (object.source === "visitor" ? "A visitor left this for Mabel." : ""),
      giftId: object.id || ""
    });
  });
  saveBindle();
}

function updateBindle() {
  const bindleElement = document.getElementById("bindle");
  if (!bindleElement) return;
  bindleElement.replaceChildren();
  const inventory = bindle || { food: [], water: [], treasures: [] };
  inventory.food = Array.isArray(inventory.food) ? inventory.food : [];
  inventory.water = Array.isArray(inventory.water) ? inventory.water : [];
  inventory.treasures = Array.isArray(inventory.treasures) ? inventory.treasures : [];
  const waitingGifts = mabel.world && Array.isArray(mabel.world.objects)
    ? mabel.world.objects.filter(function (object) {
        return object.source === "visitor" && !object.noticedAt;
      })
    : [];

  function appendGroup(title, values, isWaiting) {
    if (!values.length) return;
    const group = document.createElement("div");
    group.className = "bindle-group";
    const heading = document.createElement("p");
    heading.className = "bindle-title";
    heading.textContent = title;
    group.appendChild(heading);
    const list = document.createElement("ul");
    list.className = "bindle-list";
    values.forEach(function (value) {
      const row = document.createElement("li");
      row.className = "bindle-item";
      row.textContent = value.name || String(value);
      if (value.note || isWaiting) {
        const note = document.createElement("span");
        note.className = "bindle-note";
        note.textContent = " — " + (value.note || "Waiting for Mabel’s next quiet moment.");
        row.appendChild(note);
      }
      list.appendChild(row);
    });
    group.appendChild(list);
    bindleElement.appendChild(group);
  }

  if (!inventory.food.length && !inventory.water.length && !inventory.treasures.length && !waitingGifts.length) {
    const empty = document.createElement("p");
    empty.className = "bindle-empty";
    empty.textContent = "Mabel’s bindle is light today.";
    bindleElement.appendChild(empty);
    return;
  }

  appendGroup("Food", inventory.food, false);
  appendGroup("Water", inventory.water, false);
  appendGroup("Little treasures", inventory.treasures, false);
  appendGroup("Waiting to be noticed", waitingGifts, true);
}

function updateWanderings() {
  if (!wanderingsElement) return;
  wanderingsElement.replaceChildren();

  const trips = wanderings.filter(function (item) {
    return item.kind === "exploration" || (Array.isArray(item.finds) && item.finds.length > 0);
  }).slice(0, 10);

  if (!trips.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel’s trail is still unwritten.";
    wanderingsElement.appendChild(empty);
    return;
  }

  trips.forEach(function (trip) {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    heading.textContent = trip.kind === "exploration"
      ? "Mabel went exploring"
      : "Mabel wandered near: " + (trip.searchQuestion || trip.title || "home");
    item.appendChild(heading);

    (trip.finds || []).forEach(function (found) {
      const discovery = document.createElement("p");
      discovery.className = "explore-discovery";
      discovery.textContent = "Mabel found " + found.name + ".";
      item.appendChild(discovery);
      if (found.note) {
        const detail = document.createElement("p");
        detail.textContent = found.note;
        item.appendChild(detail);
      }
    });
    wanderingsElement.appendChild(item);
  });
}

async function loadVisitorBoard() {
  if (!visitorBoardMessages) return;
  try {
    const response = await fetch(MABEL_BOARD_URL, { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error("The shared board is unavailable.");
    const data = await response.json();
    visitorBoardMessages.replaceChildren();
    const messages = Array.isArray(data.messages) ? data.messages.slice(0, 50) : [];
    if (!messages.length) {
      const empty = document.createElement("li");
      empty.textContent = "The board is waiting for its first note.";
      visitorBoardMessages.appendChild(empty);
    }
    messages.forEach(function (message) {
      const item = document.createElement("li");
      const text = document.createElement("p");
      text.textContent = message.message || "";
      item.appendChild(text);
      const signoff = document.createElement("strong");
      signoff.textContent = message.name ? "— " + message.name : "— A visitor";
      item.appendChild(signoff);
      if (message.createdAt) {
        const time = document.createElement("time");
        time.dateTime = message.createdAt;
        time.textContent = new Date(message.createdAt).toLocaleString();
        item.appendChild(time);
      }
      visitorBoardMessages.appendChild(item);
    });
    if (visitorBoardStatus) visitorBoardStatus.textContent = "Notes from visitors appear here for everyone.";
  } catch (error) {
    if (visitorBoardStatus) visitorBoardStatus.textContent = "The noticeboard is resting for now. Please try again later.";
  }
}

async function submitVisitorBoardMessage(event) {
  event.preventDefault();
  if (!visitorBoardForm) return;
  const nameInput = document.getElementById("visitor-board-name");
  const messageInput = document.getElementById("visitor-board-message");
  const message = messageInput ? messageInput.value.trim().slice(0, 280) : "";
  const name = nameInput ? nameInput.value.trim().slice(0, 40) : "";
  if (!message) return;
  if (visitorBoardStatus) visitorBoardStatus.textContent = "Posting your note…";
  try {
    const response = await fetch(MABEL_BOARD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, message: message })
    });
    if (!response.ok) throw new Error("The shared board is unavailable.");
    if (messageInput) messageInput.value = "";
    if (visitorBoardStatus) visitorBoardStatus.textContent = "Your note is on the board.";
    await loadVisitorBoard();
  } catch (error) {
    if (visitorBoardStatus) visitorBoardStatus.textContent = "The noticeboard is resting for now. Your note has not been posted.";
  }
}

function loadVisitorProfile() {
  try {
    const saved = localStorage.getItem(visitorProfileStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        facts: Array.isArray(parsed.facts) ? parsed.facts.slice(0, 25) : [],
        moments: Array.isArray(parsed.moments) ? parsed.moments.slice(0, 25) : []
      };
    }
  } catch (error) {
    // Use an empty local profile if storage is unavailable.
  }
  return { facts: [], moments: [] };
}

function saveVisitorProfile() {
  try {
    localStorage.setItem(visitorProfileStorageKey, JSON.stringify(visitorProfile));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function addVisitorProfileNote(listName, value) {
  const text = String(value || "").trim().slice(0, 240);
  if (!text || !["facts", "moments"].includes(listName)) return;
  const existing = visitorProfile[listName].some(function (item) {
    return item.text.toLowerCase() === text.toLowerCase();
  });
  if (existing) return;
  visitorProfile[listName].unshift({
    id: "visitor-note-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
    text: text,
    at: now()
  });
  visitorProfile[listName].length = Math.min(visitorProfile[listName].length, 25);
  saveVisitorProfile();
}

function captureVisitorFacts(message) {
  const beforeCount = visitorProfile.facts.length;
  const text = String(message || "");
  const nameMatch = text.match(/\b(?:my name is|my name's|call me)\s+([A-Za-zÀ-ÖØ-öø-ÿ'-]{2,32})\b/i);
  if (nameMatch && !/^(not|just|anonymous|visitor|mabel)$/i.test(nameMatch[1])) {
    addVisitorProfileNote("facts", "Their name is " + nameMatch[1].trim() + ".");
  }
  const favoriteMatch = text.match(/\bmy favorite\s+([a-z ]{2,24})\s+is\s+([^.!?\n]{2,100})/i);
  if (favoriteMatch) {
    addVisitorProfileNote("facts", "Their favorite " + favoriteMatch[1].trim() + " is " + favoriteMatch[2].trim() + ".");
  }
  const preferenceMatch = text.match(/\bI\s+(?:really\s+)?(like|love|enjoy|adore|am interested in)\s+([^.!?\n]{2,120})/i);
  if (preferenceMatch) {
    const verb = preferenceMatch[1].toLowerCase() === "am interested in" ? "are interested in" : preferenceMatch[1].toLowerCase() + " ";
    addVisitorProfileNote("facts", "They " + verb + preferenceMatch[2].trim().replace(/[,;:]$/, "") + ".");
  }
  if (visitorProfile.facts.length !== beforeCount) updateVisitorProfile();
}

function updateVisitorProfile() {
  const factList = document.getElementById("visitor-profile-facts");
  const momentList = document.getElementById("visitor-profile-moments");
  const emptyNotice = document.getElementById("visitor-profile-empty");
  const forgetButton = document.getElementById("forget-visitor-profile");

  function renderList(list, key) {
    if (!list) return;
    list.replaceChildren();
    visitorProfile[key].forEach(function (note) {
      const item = document.createElement("li");
      const details = document.createElement("div");
      const text = document.createElement("p");
      text.textContent = note.text;
      details.appendChild(text);
      if (note.at) {
        const time = document.createElement("time");
        time.dateTime = note.at;
        time.textContent = new Date(note.at).toLocaleDateString();
        details.appendChild(time);
      }
      item.appendChild(details);
      const forget = document.createElement("button");
      forget.type = "button";
      forget.textContent = "Forget";
      forget.setAttribute("aria-label", "Forget this note");
      forget.addEventListener("click", function () {
        visitorProfile[key] = visitorProfile[key].filter(function (entry) {
          return entry.id !== note.id;
        });
        saveVisitorProfile();
        updateVisitorProfile();
      });
      item.appendChild(forget);
      list.appendChild(item);
    });
  }

  renderList(factList, "facts");
  renderList(momentList, "moments");
  const hasNotes = visitorProfile.facts.length + visitorProfile.moments.length > 0;
  if (emptyNotice) emptyNotice.hidden = hasNotes;
  if (forgetButton) forgetButton.disabled = !hasNotes;
}

function forgetVisitorProfile() {
  visitorProfile = { facts: [], moments: [] };
  saveVisitorProfile();
  updateVisitorProfile();
}

function updatePage() {
  moodElement.textContent = "Mabel is " + mabel.now.mood + ".";
  activityElement.textContent = "Mabel is " + mabel.now.doing + ".";
  thoughtElement.textContent = '"' + mabel.now.thought + '"';

  updateDiary();
  updateActivityLog();
  updateNeeds();
  updateWishes();
  updateInterests();
  updateChanges();

  updateResearchLog();
  updateWanderings();
  updateBindle();
  updateHomeObjects();
  updateGallery();
  updateVisitorProfile();
}

function ensureHollowWorld() {
  const saved = mabel.world && typeof mabel.world === "object" ? mabel.world : {};
  mabel.world = {
    weather: saved.weather || "clear",
    timeOfDay: saved.timeOfDay || "afternoon",
    ...saved,
    nest: { tidiness: 0.7, leaves: 2, ...(saved.nest || {}) },
    foodDish: { food: [], ...(saved.foodDish || {}) },
    waterLeaf: { water: 0.6, ...(saved.waterLeaf || {}) },
    path: { offerings: [], ...(saved.path || {}) },
    objects: Array.isArray(saved.objects) ? saved.objects.slice(0, 20) : []
  };
}

function updateHomeObjects() {
  ensureHollowWorld();
  const list = document.getElementById("hollow-objects");
  if (!list) return;
  list.replaceChildren();
  const objects = mabel.world.objects.slice(0, 10);
  if (!objects.length) {
    const empty = document.createElement("li");
    empty.textContent = "The shelf is empty for now.";
    list.appendChild(empty);
    return;
  }
  objects.forEach(function (object) {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = object.name;
    item.appendChild(name);
    if (object.status === "waiting") {
      const waiting = document.createElement("p");
      waiting.textContent = "Waiting for one of Mabel’s quiet moments.";
      item.appendChild(waiting);
    }
    if (object.reaction) {
      const reaction = document.createElement("p");
      reaction.textContent = object.reaction;
      item.appendChild(reaction);
    } else if (object.note) {
      const note = document.createElement("p");
      note.textContent = object.note;
      item.appendChild(note);
    }
    list.appendChild(item);
  });
}


function showHollowSpeech(text) {
  const speech = document.getElementById("hollow-speech");
  const speechText = document.getElementById("hollow-speech-text");
  if (!speech || !speechText) return;
  speechText.textContent = text;
  speech.classList.remove("hidden");
  setTimeout(function () {
    speech.classList.add("hidden");
  }, 7000);
}

async function queueHomeGift(objectName, giftKind) {
  if (!mabel) return;
  const cleanName = String(objectName || "").trim().slice(0, 80);
  if (!cleanName) return;
  ensureHollowWorld();
  const gift = {
    id: "gift-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
    name: cleanName,
    kind: giftKind || "object",
    at: now(),
    source: "visitor",
    noticedAt: "",
    reaction: "",
    status: "waiting"
  };
  mabel.world.objects.unshift(gift);
  mabel.world.objects.length = Math.min(mabel.world.objects.length, 20);
  saveMabel();
  updateHomeObjects();
  updateBindle();
  const status = document.getElementById("hollow-status");
  if (status) status.textContent = "Your gift is waiting in Mabel’s bindle for her next quiet moment.";
}

function chooseGift(event) {
  const kind = event.currentTarget.dataset.giftKind;
  const gifts = {
    food: ["a blackberry", "three sunflower seeds", "a fallen hazelnut", "a little oat crumb"],
    water: ["a sip of clean rainwater in a curled leaf", "a bead of dew", "a small cup of fresh water"],
    surprise: ["a dried flower tied with thread", "a smooth shell", "a little brass bell", "a pale green glass pebble", "a scrap of soft blue cloth", "a tiny wooden bead"]
  };
  const options = gifts[kind] || gifts.surprise;
  queueHomeGift(options[Math.floor(Math.random() * options.length)], kind);
}

function handleIntroducedObject(event) {
  event.preventDefault();
  const input = document.getElementById("hollow-object-input");
  const objectName = input ? input.value.trim().slice(0, 80) : "";
  const status = document.getElementById("hollow-status");
  if (!objectName) {
    if (status) status.textContent = "Write a small surprise for Mabel to find.";
    return;
  }
  queueHomeGift(objectName, "object");
  if (input) input.value = "";
}


function isArtworkRequest(message) {
  const text = String(message || "").trim();
  const selfPortrait = /\bself[ -]?portrait\b|\bportrait of (?:yourself|mabel)\b|\bdraw (?:yourself|mabel)\b|\bpicture of (?:you|mabel)\b/i.test(text);
  const directDraw = /^(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text) ||
    /\b(?:can|could|would)\s+you\s+(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text);
  const pictureRequest = /\b(?:make|create|give|show)\s+(?:me\s+)?(?:a|an|some)?\s*(?:picture|image|art|artwork|drawing|portrait|illustration)\b/i.test(text);
  const requestedSubject = requestedArtworkSubject(text);
  const makeSubject = /\b(?:can|could|would)\s+you\s+(?:please\s+)?(?:make|create|do)\b/i.test(text) && Boolean(requestedSubject);
  return selfPortrait || directDraw || pictureRequest || makeSubject;
}

function requestedArtworkSubject(message) {
  const text = String(message || "").toLowerCase();
  if (/\b(self[ -]?portrait|portrait of (?:yourself|mabel)|draw (?:yourself|mabel)|picture of (?:you|mabel))\b/.test(text)) return "mabel";
  const subjects = [
    ["power ranger", "power ranger"], ["cat|kitten", "cat"], ["dog|puppy", "dog"],
    ["rabbit|bunny", "rabbit"], ["fox", "fox"], ["bird|robin|sparrow", "bird"],
    ["flower|bouquet", "flower"], ["mushroom|toadstool", "mushroom"],
    ["fossil", "fossil"], ["button", "button"], ["shell", "shell"],
    ["moon", "moon"], ["star", "star"], ["fish", "fish"], ["house|cottage", "house"]
  ];
  for (const [pattern, subject] of subjects) {
    if (new RegExp("\\b(?:" + pattern + ")\\b", "i").test(text)) return subject;
  }
  return "";
}

function makeMabelFallbackArtwork(context) {
  const palettes = [
    ["#718778", "#b77769", "#e9d8b7"],
    ["#8b7798", "#d08b62", "#e9dfc9"],
    ["#527b83", "#c27a78", "#ead8a5"],
    ["#9a765d", "#718f74", "#e8cfb2"],
    ["#6d7794", "#b67c8d", "#eadcbf"]
  ];
  const motifs = ["rain", "night", "bloom", "threads", "roots", "mist", "embers", "stars", "memory", "moss", "path", "echo"];
  const symbols = ["leaf", "moon", "berry", "feather", "button", "seed", "raindrop", "stone", "doorway", "shell", "twig"];
  const activity = context.activity || mabel.now.doing || "listening beneath the hawthorn";
  const mood = context.mood || mabel.now.mood || "quiet";
  const subject = requestedArtworkSubject(context.message);
  const hint = ((context.message || "") + " " + activity + " " + mood).toLowerCase();
  const motif = subject === "flower" || hint.includes("flower") || hint.includes("bloom")
    ? "bloom"
    : hint.includes("rain") || hint.includes("water")
      ? "rain"
      : hint.includes("night") || hint.includes("moon")
        ? "night"
        : motifs[Math.floor(Math.random() * motifs.length)];

  return {
    title: subject === "mabel"
      ? "Mabel, as Mabel remembers herself"
      : subject
        ? "Mabel's little study of a " + subject
        : "Mabel's " + mood + " marks",
    kind: "moment",
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    motif: motif,
    subject: subject,
    selfPortrait: subject === "mabel",
    symbols: [subject === "button" ? "button" : symbols[Math.floor(Math.random() * symbols.length)]],
    note: subject === "mabel"
      ? "She used the picture by her nest as a starting point, then let the colours wander."
      : subject
        ? "She let the shape of a " + subject + " lead the marks somewhere unexpected."
        : "She kept a small piece of " + activity + ".",
    seed: (Date.now() ^ Math.floor(Math.random() * 2147483647)) >>> 0
  };
}

async function requestMabelArtwork(context, targetElement) {
  const source = context.source || "autonomous";
  let artwork = null;
  let declined = false;

  try {
    const response = await fetch(MABEL_ART_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source,
        message: context.message || "",
        requestedSubject: requestedArtworkSubject(context.message),
        selfPortrait: requestedArtworkSubject(context.message) === "mabel",
        referenceImageUrl: new URL("images/mabel.png", window.location.href).href,
        referenceImageInstruction: requestedArtworkSubject(context.message) === "mabel"
          ? "Use mabel.png only as a visual reference for Mabel’s mouse features and proportions. Create a new original drawing; never paste or embed the reference image as a layer."
          : "",
        mood: context.mood || mabel.now.mood,
        activity: context.activity || mabel.now.doing,
        thought: context.thought || mabel.now.thought,
        needs: mabel.needs,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 8),
        wanderings: wanderings.slice(0, 5),
        recentArtworks: gallery.slice(0, 6).map(function (item) {
          return { title: item.title, motif: item.motif };
        }),
        artisticInspiration: context.inspiration || null
      })
    });

    if (response.ok) {
      const data = await response.json();
      artwork = data.artwork || null;
      declined = data.declined === true;
    }
  } catch (error) {
    // An explicit drawing request can still use Mabel's local drawing hand.
  }

  const requestedSubject = requestedArtworkSubject(context.message);
  if (artwork && requestedSubject) {
    artwork.subject = requestedSubject;
    artwork.selfPortrait = requestedSubject === "mabel";
  }

  const explicitRequest = source === "visitor" && isArtworkRequest(context.message);
  if (!artwork && explicitRequest) {
    artwork = makeMabelFallbackArtwork(context);
  }

  if (!artwork && source === "autonomous" && context.inspiration) {
    artwork = makeMabelFallbackArtwork({
      activity: "making a little study",
      mood: context.mood || mabel.now.mood,
      thought: context.inspiration.question || context.thought,
      message: ""
    });
    artwork.title = "A little study of " + context.inspiration.title;
    artwork.note = context.inspiration.question || "Mabel followed a thought that had stayed with her.";
  }
  if (!artwork) return null;

  const card = renderMabelCard(artwork);
  saveToMabelGallery(artwork);
  if (card && targetElement) {
    targetElement.appendChild(document.createElement("br"));
    targetElement.appendChild(card);
  }
  return artwork;
}

function separateSparkMarker(value) {
  let sparkTitle = "";
  const text = String(value || "").replace(/\s*\[\[SPARK\]\]\s*([^\r\n]*)/gi, function (_match, title) {
    sparkTitle = String(title || "").replace(/^[*_~]+|[*_~]+$/g, "").trim().slice(0, 90);
    return "";
  }).replace(/\[\[\/?SPARK\]\]/gi, "").trim();
  return { text: text, sparkTitle: sparkTitle };
}

function sparkFromMarker(parts, source, question) {
  if (!parts || !parts.sparkTitle) return null;
  return {
    id: "spark-" + normalizeInterestTitle(parts.sparkTitle),
    title: parts.sparkTitle,
    question: String(question || "Why did this detail stay with Mabel?").slice(0, 180),
    reason: "A small thought caught Mabel’s attention.",
    kind: "wonder",
    source: source || "conversation"
  };
}

function normalizeMabelReply(payload) {
  const candidates = [
    payload && payload.reply,
    payload && payload.response,
    payload && payload.message,
    payload && payload.result && payload.result.reply,
    payload && payload.result && payload.result.response
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    if (candidate && typeof candidate.text === "string" && candidate.text.trim()) return candidate.text.trim();
  }
  return "";
}

async function handleVisitorMessage() {
  if (messagePending || !messageElement || !replyElement) return;
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent = "Mabel tilts her head. \"The hollow is quiet, but I am still listening.\"";
    return;
  }

  messagePending = true;
  if (sendButton) sendButton.disabled = true;
  if (chatStatusElement) chatStatusElement.textContent = "";

  try {
    captureVisitorFacts(message);
    replyElement.textContent = "Mabel is listening...";
    const response = await fetch(MABEL_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        energy: mabel.now.energy,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 8),
        conversation: conversation.slice(-10),
        wanderings: wanderings.slice(0, 10).map(function (item) {
          return {
            title: item.title,
            url: item.url,
            musing: item.musing,
            searchQuestion: item.searchQuestion
          };
        })
      })
    });

    if (!response.ok) {
      throw new Error("Mabel's thoughts could not be reached. Status " + response.status);
    }

    const data = await response.json();
    const parsedReply = separateSparkMarker(normalizeMabelReply(data));
    if (!parsedReply.text) throw new Error("Mabel’s Worker returned no reply text.");
    const inlineSpark = sparkFromMarker(parsedReply, "conversation", message);

    replyElement.textContent = parsedReply.text;

    if (data.spark) {
      recordSpark(data.spark);
    } else if (inlineSpark) {
      recordSpark(inlineSpark);
    }

    reflectOnConversation(message, parsedReply.text, data.spark || inlineSpark || null);

    let requestedArtwork = null;
    if (isArtworkRequest(message)) {
      requestedArtwork = await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
    }

    if (data.artwork && !requestedArtwork) {
      const artworkCard = renderMabelCard(data.artwork);

      if (artworkCard) {
        replyElement.appendChild(document.createElement("br"));
        replyElement.appendChild(artworkCard);
      }

      saveToMabelGallery(data.artwork);
    }

    conversation.push({
      role: "user",
      content: message
    });
    conversation.push({
      role: "assistant",
      content: parsedReply.text
    });

    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }

    saveConversation();

    if (data.interest) {
      const existing = mabel.interests.find(function (interest) {
        return interest.id === data.interest.id ||
          normalizeInterestTitle(interest.title) === normalizeInterestTitle(data.interest.title);
      });

      if (existing) {
        existing.pull = clampNeed(existing.pull + 0.15);

        if (existing.pull > 0.65 && existing.stage === "dormant") {
          existing.stage = "pursuing";
        }
      } else {
        mabel.interests.push({
          id: data.interest.id,
          title: data.interest.title,
          kind: data.interest.kind || "wonder",
          question: data.interest.question || "What does this mean to Mabel?",
          actions: [],
          curiosity: data.interest.curiosity || 0.6,
          pull: data.interest.pull || 0.5,
          stage: data.interest.stage || "pursuing"
        });

        addFeedEntry({
          kind: "mind",
          text: "Mabel began a new thread: " + data.interest.title + ".",
          why: data.interest.question,
          interest: data.interest.id
        });
        showSparkNotice();
      }
    }

    mabel.needs.connection = clampNeed(mabel.needs.connection + 0.18);
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.08);

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    saveMabel();
    updateHomeObjects();
    updatePage();

    messageElement.value = "";
  } catch (error) {
    console.warn("Mabel chat request failed.", error);
    replyElement.textContent = "Mabel's lantern flickers. \"The path to my thoughts is tangled tonight. Try again in a moment.\"";
    if (chatStatusElement) {
      chatStatusElement.textContent = "Connection detail: " + String(error && error.message || "unknown chat error");
    }
    if (isArtworkRequest(message)) {
      await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
    }
  } finally {
    messagePending = false;
    if (sendButton) sendButton.disabled = false;
  }
}

async function noticeNextVisitorGift() {
  ensureHollowWorld();
  const gift = mabel.world.objects.find(function (item) {
    return item.source === "visitor" && !item.noticedAt;
  });
  if (!gift) return;

  const eventText = "During her own day, Mabel notices that someone left " + gift.name + " at home.";
  try {
    const response = await fetch(MABEL_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventText,
        eventDetails: { kind: "introduced-gift", object: gift.name, giftKind: gift.kind },
        world: mabel.world,
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 8),
        conversation: conversation.slice(-8)
      })
    });
    if (!response.ok) return;
    const data = await response.json();
    const parsedGiftReply = separateSparkMarker(normalizeMabelReply(data));
    const inlineGiftSpark = sparkFromMarker(parsedGiftReply, "discovery", gift.name);
    gift.noticedAt = now();
    gift.reaction = parsedGiftReply.text || "Mabel has noticed the gift.";
    gift.status = "noticed";
    if (parsedGiftReply.text) showHollowSpeech(parsedGiftReply.text);
    if (data.mood) mabel.now.mood = data.mood;
    if (data.memory) mabel.memories.unshift({ at: now(), kind: "discovery", text: data.memory });
    if (data.spark) recordSpark({ ...data.spark, source: "discovery" });
    else if (inlineGiftSpark) recordSpark(inlineGiftSpark);

    if (gift.kind === "food" && mabel.needs.food < 0.72) {
      mabel.needs.food = clampNeed(mabel.needs.food + 0.2);
      gift.status = "eaten";
      addFeedEntry({ kind: "did", text: "Mabel ate " + gift.name + ", a gift she found waiting at home.", why: parsedGiftReply.text || "She was hungry." });
    } else if (gift.kind === "water" && mabel.needs.water < 0.72) {
      mabel.needs.water = clampNeed(mabel.needs.water + 0.22);
      gift.status = "drank";
      addFeedEntry({ kind: "did", text: "Mabel drank " + gift.name + ", a gift she found waiting at home.", why: parsedGiftReply.text || "She was thirsty." });
    } else if (gift.kind === "food") {
      bindle.food.unshift({ name: gift.name, note: "A visitor left this for Mabel.", giftId: gift.id });
      bindle.food.length = Math.min(bindle.food.length, 8);
      gift.status = "saved for later";
    } else if (gift.kind === "water") {
      bindle.water.unshift({ name: gift.name, note: "A visitor left this for Mabel.", giftId: gift.id });
      bindle.water.length = Math.min(bindle.water.length, 5);
      gift.status = "saved for later";
    } else {
      bindle.treasures.unshift({ name: gift.name, note: "A visitor left this for Mabel.", giftId: gift.id });
      bindle.treasures.length = Math.min(bindle.treasures.length, 12);
      gift.status = "packed in Mabel’s bindle";
    }
    addFeedEntry({
      kind: "noticed",
      text: "Mabel noticed " + gift.name + " waiting at home.",
      why: gift.reaction,
      interest: data.spark && data.spark.id
    });
    saveBindle();
    saveMabel();
    updateHomeObjects();
    updatePage();
  } catch (error) {
    gift.noticeAttemptedAt = now();
    saveMabel();
  }
}

function visitorBoardNoteKey(note) {
  return [
    String(note && (note.id || note.createdAt) || ""),
    String(note && note.name || "a visitor").trim(),
    String(note && note.message || "").trim()
  ].join("|").slice(0, 420);
}

async function noticeNextVisitorBoardNote() {
  try {
    const response = await fetch(MABEL_BOARD_URL, { method: "GET", cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    const notes = Array.isArray(data.messages) ? data.messages.slice(0, 50) : [];
    const next = notes.find(function (note) {
      return note && String(note.message || "").trim() &&
        !boardReadKeys.includes(visitorBoardNoteKey(note));
    });
    if (!next) return null;

    const key = visitorBoardNoteKey(next);
    const message = String(next.message || "").trim().slice(0, 280);
    const name = String(next.name || "a visitor").trim().slice(0, 40);

    const reflection = await fetch(MABEL_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "Mabel has taken a quiet moment to check the shared Visitors’ noticeboard. She reads the visitor’s note and responds to what it actually says.",
        eventDetails: {
          kind: "visitor-board-reading",
          note: message,
          author: name
        },
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        interests: mabel.interests.slice(0, 8),
        memories: mabel.memories.slice(0, 6)
      })
    });
    if (!reflection.ok) return null;
    const result = await reflection.json();

    boardReadKeys.unshift(key);
    boardReadKeys = boardReadKeys.slice(0, 100);
    saveBoardReadKeys();

    const parsedReaction = separateSparkMarker(normalizeMabelReply(result));
    const reaction = parsedReaction.text;
    const inlineSpark = sparkFromMarker(parsedReaction, "visitor-board", message);
    if (result.spark) recordSpark({ ...result.spark, source: "visitor-board" });
    else if (inlineSpark) recordSpark(inlineSpark);

    mabel.memories.unshift({
      at: now(),
      kind: "noticeboard",
      text: "A visitor called " + name + " left this note: " + message
    });
    if (reaction) {
      mabel.memories.unshift({
        at: now(),
        kind: "noticeboard-reflection",
        text: "Mabel wondered about the note: " + reaction
      });
    }
    if (mabel.memories.length > 20) mabel.memories.length = 20;
    addFeedEntry({
      kind: "noticed",
      text: "Mabel checked the Visitors’ board and noticed a note from " + name + "."
    });
    if (reaction) showHollowSpeech(reaction);
    saveMabel();
    updatePage();
    return { id: key, message: message, name: name };
  } catch (error) {
    // Mabel will check again at a later quiet moment.
    return null;
  }
}

function researchWords(value) {
  const stopWords = new Set([
    "about", "after", "again", "also", "because", "board", "connected", "could",
    "distinctive", "directly", "from", "have", "into", "just", "mabel", "message",
    "might", "more", "other", "over", "phrase", "read", "research", "saw", "she",
    "subject", "that", "their", "them", "there", "these", "they", "this", "those",
    "what", "when", "where", "which", "while", "with", "would", "your", "hers",
    "found", "finds", "thing", "things", "note", "visitor", "visitors"
  ]);
  return normalizeInterestTitle(value).split(" ").filter(function (word) {
    return word.length > 3 && !stopWords.has(word);
  }).map(function (word) {
    return word.endsWith("s") ? word.slice(0, -1) : word;
  });
}

function researchMatchesFocus(text, focusInterest) {
  if (!focusInterest) return true;
  // Validate against the chosen subject itself; its explanatory question contains generic wording.
  const focusWords = Array.from(new Set(researchWords(focusInterest.title)));
  const resultWords = new Set(researchWords(text));
  const matchedWords = focusWords.filter(function (word) { return resultWords.has(word); });
  const requiredMatches = Math.min(2, focusWords.length);
  return requiredMatches > 0 && matchedWords.length >= requiredMatches;
}

function chooseAutonomousResearchFocus(boardNote) {
  const candidates = [];
  if (boardNote) {
    const topic = researchWords(boardNote.message).slice(0, 4).join(" ");
    candidates.push({
      id: "board-note-" + boardNote.id,
      title: topic || boardNote.message.slice(0, 60),
      question: "Mabel read this note from " + boardNote.name + " on the Visitors’ board. Research only the subject named in the note.",
      source: "visitor-board"
    });
  }

  mabel.interests.forEach(function (interest) {
    if (interest && interest.title) candidates.push(interest);
  });

  wanderings.slice(0, 8).forEach(function (outing) {
    (Array.isArray(outing.finds) ? outing.finds : []).forEach(function (find) {
      if (find && find.name) {
        candidates.push({
          id: "found-" + normalizeInterestTitle(find.name),
          title: find.name,
          question: "Mabel found " + find.name + " while exploring. Research what this exact object is, why it might be made or used, or what its history could be.",
          source: "exploration"
        });
      }
    });
  });

  ensureHollowWorld();
  mabel.world.objects.slice(0, 10).forEach(function (object) {
    if (object && object.name) {
      candidates.push({
        id: "world-" + normalizeInterestTitle(object.name),
        title: object.name,
        question: "Mabel came across " + object.name + " in her home world. Research this exact object and what makes it interesting.",
        source: object.source || "hollow"
      });
    }
  });

  const recentFocus = new Set(researchLog.slice(0, 6).map(function (entry) {
    return normalizeInterestTitle(entry.focusTitle || entry.searchQuestion);
  }));
  const fresh = candidates.filter(function (item, index) {
    const key = normalizeInterestTitle(item.title);
    return key && !recentFocus.has(key) &&
      candidates.findIndex(function (other) { return normalizeInterestTitle(other.title) === key; }) === index;
  });
  const pool = fresh.length ? fresh : candidates;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseAutonomousArtworkInspiration() {
  const activeSparks = sparks.filter(function (spark) {
    return spark && spark.title && ["noticed", "growing", "pursuing"].includes(spark.stage);
  });
  const activeInterests = mabel.interests.filter(function (interest) {
    return interest && interest.title && ["growing", "pursuing"].includes(interest.stage);
  });
  const inspirations = activeSparks.map(function (spark) {
    return { title: spark.title, question: spark.question || spark.reason || "A thought Mabel wants to keep." };
  }).concat(activeInterests.map(function (interest) {
    return { title: interest.title, question: interest.question || "A question Mabel wants to follow." };
  }));
  if (inspirations.length && Math.random() < 0.7) {
    return inspirations[Math.floor(Math.random() * inspirations.length)];
  }
  if (Math.random() < 0.18) {
    return {
      title: "a moment from today",
      question: mabel.now.thought || "A small feeling Mabel wants to remember."
    };
  }
  return null;
}

async function handleAutonomousMoment() {
  lastAutonomousMoment = Date.now();
  saveLastAutonomousMoment();

  try {
    const newBoardNote = await noticeNextVisitorBoardNote();
    await noticeNextVisitorGift();
    const response = await fetch(MABEL_DAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        energy: mabel.now.energy,
        needs: mabel.needs,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10),
        wanderings: wanderings.slice(0, 10),
        feed: mabel.feed.slice(0, 15),
	sparks: sparks.slice(0, 10)
      })
    });

    if (!response.ok) {
      throw new Error("Mabel's day could not continue. Status " + response.status);
    }

    const data = await response.json();

    if (data.activity) {
      mabel.now.doing = data.activity;
      mabel.now.updatedAt = now();

      addFeedEntry({
        kind: "did",
        text: data.activity,
        why: data.reason || ""
      });
    }

    if (data.mood) {
      mabel.now.mood = data.mood;
    }

    if (data.thought) {
      mabel.now.thought = data.thought;
    }

    if (data.diary) {
      addFeedEntry({
        kind: "diary",
        text: data.diary,
        why: data.reason || ""
      });
    }

    if (data.interest) {
      const existing = mabel.interests.find(function (interest) {
        return interest.id === data.interest.id;
      });

      if (existing) {
        existing.pull = clampNeed(existing.pull + (data.interest.pullChange || 0.1));

        if (existing.pull > 0.65 && existing.stage === "dormant") {
          existing.stage = "pursuing";
        }
      } else {
        mabel.interests.push({
          id: data.interest.id,
          title: data.interest.title,
          kind: data.interest.kind || "wonder",
          question: data.interest.question || "What does this mean to Mabel?",
          actions: [],
          curiosity: data.interest.curiosity || 0.6,
          pull: data.interest.pull || 0.5,
          stage: data.interest.stage || "pursuing"
        });

        addFeedEntry({
          kind: "mind",
          text: "Mabel began a new thread: " + data.interest.title + ".",
          why: data.interest.question,
          interest: data.interest.id
        });
        showSparkNotice();
      }
    }

    saveMabel();
    updatePage();

    const canResearch = mabel.needs.food > 0.2 && mabel.needs.water > 0.2 && mabel.needs.rest > 0.2;
    const researchFocus = chooseAutonomousResearchFocus(newBoardNote);
    if (canResearch && researchFocus && Math.random() < 0.55) {
      await handleWander({ autonomous: true, focusInterest: researchFocus });
    }

    autonomousMomentCount = autonomousMomentCount + 1;

    if (autonomousMomentCount % 3 === 0) {
      writeEveningPage();
    }

    const artworkInspiration = chooseAutonomousArtworkInspiration();
    if (artworkInspiration) {
      const newArtwork = await requestMabelArtwork({
        source: "autonomous",
        activity: mabel.now.doing,
        thought: mabel.now.thought,
        mood: mabel.now.mood,
        inspiration: artworkInspiration
      });
      if (newArtwork) showGalleryNotice(newArtwork);
    }

    writeEndOfDayReflection();
  } catch (error) {
    chooseAction();
  }
}

function normalizeInterestTitle(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function showSparkNotice() {
  if (sparkNoticeCard) sparkNoticeCard.classList.remove("hidden");
}

function showGalleryNotice(artwork) {
  if (galleryNoticeText && artwork && artwork.title) {
    galleryNoticeText.textContent = "“" + artwork.title + "” is waiting in Mabel’s Gallery.";
  }
  if (galleryNoticeCard) galleryNoticeCard.classList.remove("hidden");
}

function recordSpark(candidate) {
  if (!candidate || !candidate.title) return;

  const title = String(candidate.title).trim().slice(0, 90);
  const question = String(candidate.question || "What might Mabel discover about this?").trim().slice(0, 180);
  const key = normalizeInterestTitle(title);
  if (!key) return;

  let spark = sparks.find(function (item) {
    return item.id === candidate.id || normalizeInterestTitle(item.title) === key;
  });
  const isNewSpark = !spark;

  if (spark) {
    spark.evidence = (spark.evidence || 1) + 1;
    spark.pull = clampNeed((spark.pull || 0.32) + 0.14);
    spark.lastSeenAt = now();
    spark.stage = spark.evidence >= 3 ? "pursuing" : "growing";
    spark.question = question || spark.question;
  } else {
    spark = {
      id: candidate.id || "spark-" + Date.now(),
      title: title,
      question: question,
      reason: String(candidate.reason || "A thought kept catching at Mabel’s attention.").slice(0, 220),
      source: candidate.source || "conversation",
      pull: 0.34,
      evidence: 1,
      stage: "noticed",
      createdAt: now(),
      lastSeenAt: now()
    };
    sparks.unshift(spark);
  }

  let interest = mabel.interests.find(function (item) {
    return item.id === spark.id || normalizeInterestTitle(item.title) === key;
  });

  if (interest) {
    interest.evidence = Math.max(interest.evidence || 0, spark.evidence);
    interest.pull = spark.pull;
    interest.stage = spark.stage;
    interest.question = spark.question || interest.question;
  } else {
    interest = {
      id: spark.id,
      title: spark.title,
      kind: candidate.kind || "wonder",
      question: spark.question,
      curiosity: 0.55,
      pull: spark.pull,
      evidence: spark.evidence,
      stage: spark.stage,
      source: candidate.source || "conversation",
      createdAt: spark.createdAt
    };
    mabel.interests.unshift(interest);
    addFeedEntry({
      kind: "mind",
      text: "A small question caught Mabel’s attention: " + spark.title + ".",
      why: spark.question,
      interest: spark.id
    });
  }

  if (sparks.length > 30) sparks.length = 30;
  if (mabel.interests.length > 30) mabel.interests.length = 30;
  saveSparks();
  saveMabel();
  updatePage();
  if (isNewSpark) showSparkNotice();

}

async function reflectOnConversation(visitorMessage, mabelReply, sparkCandidate) {
  try {
    const response = await fetch("https://mabel-life.fianna-b-murphy.workers.dev/reflect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        visitorMessage: visitorMessage,
        mabelReply: mabelReply,
        sparkCandidate: sparkCandidate,
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10),
        visitorProfile: visitorProfile,
        world: mabel.world
      })
    });

    if (!response.ok) return;

    const reflection = await response.json();

    addVisitorProfileNote("facts", reflection.visitorNote);
    if (reflection.sharedMoment) {
      addFeedEntry({
        kind: "mind",
        text: reflection.sharedMoment,
        why: "A moment from Mabel’s side of the conversation."
      });
    }

if (reflection.spark && reflection.spark.title && !sparkCandidate) {
      recordSpark(reflection.spark);
    }



    if (reflection.remember === true && reflection.memory) {
      mabel.memories.unshift({
        at: now(),
        kind: "reflection",
        text: reflection.memory
      });

      if (mabel.memories.length > 20) {
        mabel.memories.length = 20;
      }
    }

    if (reflection.interestUpdate) {
      const update = reflection.interestUpdate;
      const existing = mabel.interests.find(function (interest) {
        return interest.id === update.id;
      });

      if (existing) {
        existing.pull = clampNeed(existing.pull + (update.pullChange || 0));
      } else if (update.newInterest) {
        mabel.interests.unshift({
          id: update.id || "interest-" + Date.now(),
          title: update.newInterest.title,
          kind: update.newInterest.kind || "wonder",
          question: update.newInterest.question || "What does this mean to Mabel?",
          curiosity: 0.6,
          pull: update.pull || 0.45,
          stage: "pursuing"
        });
        showSparkNotice();
      }
    }

    if (reflection.desire) {
      addDesire(reflection.desire);
    }

    saveMabel();
    updatePage();
  } catch (error) {
    // Reflection is private and optional. Mabel can still chat if it fails.
  }
}

async function writeEveningPage() {
  if (!mabel) {
    return;
  }

  const recentMoments = mabel.feed
    .slice(0, 6)
    .map(function (entry) {
      return entry.text;
    })
    .join("\n");

  const recentWanderings = wanderings
    .slice(0, 4)
    .map(function (entry) {
      const finds = (entry.finds || []).map(function (find) { return find.name; }).join(", ");
      return entry.title + (finds ? ": Mabel found " + finds : "");
    })
    .join("\n");

  const prompt = `
Mabel is a small mouse living in the Hawthorn Hollow.

These are the moments Mabel has already recorded in her Activity Log:
${recentMoments || "Mabel has not recorded any moments yet."}

These are some of Mabel's recent wanderings:
${recentWanderings || "Mabel has not wandered recently."}

Mabel's current mood is ${mabel.now.mood}.
Mabel is currently ${mabel.now.doing}.
Mabel's inner thought is: ${mabel.now.thought}

Mabel's needs:
Comfort: ${mabel.needs.comfort}
Curiosity: ${mabel.needs.curiosity}
Connection: ${mabel.needs.connection}
Rest: ${mabel.needs.rest}
Wonder: ${mabel.needs.wonder}
Food: ${mabel.needs.food}
Water: ${mabel.needs.water}

Write ONE short evening-page journal entry for Mabel.

It should describe a quiet, private thing that happened between the recorded moments.
Do not repeat the Activity Log.
Do not mention that you are an AI.
Do not mention Wikipedia, the internet, or searching.
Keep it gentle, curious, mossy, and a little mysterious.
Use 2 to 4 sentences.
Write in Mabel's voice.

Return only JSON like this:
{
  "title": "Evening page",
  "text": "Mabel's journal entry"
}
`;

  try {
    const response = await fetch(MABEL_JOURNAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        kind: "evening-page"
      })
    });

    if (!response.ok) {
      throw new Error("Mabel could not write her evening page. Status " + response.status);
    }

    const data = await response.json();

    if (!data.entry || !data.entry.text) {
      return;
    }

    addDiaryEntry({
      kind: "journal",
      title: data.entry.title || "Evening page",
      text: data.entry.text
    });

    saveMabel();
    updatePage();
  } catch (error) {
    console.log("Mabel could not write her evening page.", error);
  }
}

const diverseWanderFinds = [
  { kind: "treasure", name: "a tiny red Power Ranger figure with one missing boot", note: "It looked ready to defend a crumb from enormous danger." },
  { kind: "treasure", name: "the chewed cap of a blue felt-tip pen", note: "Its teeth marks made it look like a very small beaver had been writing." },
  { kind: "treasure", name: "a paper star from a forgotten piñata", note: "A little crease down the middle made it look as if it had flown here." },
  { kind: "treasure", name: "a bottle-cap with a faded lemon on it", note: "It was almost a moon, if Mabel squinted." },
  { kind: "treasure", name: "a single jigsaw piece showing half a lighthouse", note: "Somewhere, perhaps, the other half was waiting." },
  { kind: "treasure", name: "a tiny plastic dinosaur", note: "It seemed to have been guarding the path for years." },
  { kind: "treasure", name: "a bent paper clip shaped like a swan", note: "Mabel wondered who had taught it to swim." },
  { kind: "treasure", name: "a green marble with a cloudy middle", note: "It held a small storm that never moved." },
  { kind: "treasure", name: "a brass button shaped like a tiny anchor", note: "It felt like something a very small sailor might lose." },
  { kind: "treasure", name: "a strip of shiny sweet wrapper", note: "It caught the light like a travelling puddle." },
  { kind: "treasure", name: "a lost Lego wheel", note: "It was clearly in a hurry to get somewhere." },
  { kind: "treasure", name: "a cracked plastic bead shaped like a strawberry", note: "A toy fruit, perhaps, for a toy picnic." },
  { kind: "treasure", name: "a little wooden peg", note: "It could be a stool, a signpost, or a very stern person." },
  { kind: "treasure", name: "a postage stamp with a crooked ship", note: "Mabel imagined it had sailed a long way before landing here." },
  { kind: "treasure", name: "a tiny folded note with no writing inside", note: "The blankness felt like a secret still being kept." },
  { kind: "treasure", name: "a silver sequin caught in a root", note: "It looked like the smallest possible medal." },
  { kind: "treasure", name: "a red thread tangled around a twig", note: "It might have escaped from a scarf or a very small parade." },
  { kind: "treasure", name: "a broken toy spoon", note: "Just the right size for serving one important pea." },
  { kind: "treasure", name: "a tiny plastic crown", note: "Mabel tried it on a pebble, which seemed pleased." },
  { kind: "treasure", name: "a smooth pebble painted with a crooked smile", note: "It looked as if it knew a joke but would not tell." },

  { kind: "treasure", name: "a fossilized shell tucked into a lump of chalk", note: "A tiny sea creature had left the shape of its home behind." },
  { kind: "treasure", name: "an old bouquet tied with fraying ribbon", note: "The flowers had gone papery, but still held a little colour." },
  { kind: "treasure", name: "a tiny brass thimble", note: "It could be a bucket for a beetle or a helmet for a seed." },
  { kind: "treasure", name: "a cracked domino with three white dots", note: "Mabel wondered where the rest of the game had gone." },
  { kind: "treasure", name: "a faded train ticket folded into a square", note: "It seemed to have travelled farther than Mabel had." },
  { kind: "treasure", name: "a small chunk of sea glass", note: "Its sharp edges had been softened by a long journey." },
  { kind: "treasure", name: "a tiny wind-up key", note: "Perhaps it belonged to a clock that had forgotten its time." },
  { kind: "treasure", name: "a dried seed pod that rattled like a maraca", note: "The smallest band in the hollow had found its instrument." },
  { kind: "treasure", name: "a chipped chess knight", note: "Mabel thought it looked brave despite the missing paint." },
  { kind: "treasure", name: "a little piece of blue-and-white pottery", note: "A broken bit of somebody’s cup, now a bright tile." },
  { kind: "treasure", name: "a tiny toy bus with one wheel missing", note: "It had stopped at the edge of a mossy road." },
  { kind: "treasure", name: "a dried clover pressed flat in a book page", note: "A small green memory from a much larger story." },
  { kind: "food", name: "a crumb of oat biscuit", note: "A useful little bite for the road." },
  { kind: "food", name: "half a dried cranberry", note: "Tart, chewy, and a very good travelling snack." },
  { kind: "food", name: "a sesame seed", note: "Small enough to save, if she could keep track of it." },
  { kind: "food", name: "a sliver of apple", note: "It still smelled faintly sweet." },
  { kind: "food", name: "a crumb of cheese", note: "A rich little mouthful wrapped in no wrapper at all." },
  { kind: "food", name: "a fallen sunflower seed", note: "A proper seed with a satisfying shell." },
  { kind: "food", name: "a corner of plain cracker", note: "Crisp enough to make a tiny sound." },
  { kind: "food", name: "one oat flake", note: "A modest snack with grand ambitions." },
  { kind: "water", name: "a clean bead of rain gathered in a curled leaf", note: "A small drink sheltered from the wind." },
  { kind: "water", name: "a drop of dew on a clover leaf", note: "It trembled but did not spill." },
  { kind: "water", name: "a shallow puddle in a shell", note: "A little pool with a very useful edge." }
];

function diversifyWanderFinds(findResults) {
  const recentNames = []
    .concat(bindle.food || [], bindle.water || [], bindle.treasures || [])
    .concat((mabel.world && mabel.world.objects) || [])
    .concat(wanderings.slice(0, 8).flatMap(function (wandering) {
      return Array.isArray(wandering.finds) ? wandering.finds : [];
    }))
    .map(function (item) {
      return normalizeInterestTitle(typeof item === "string" ? item : item.name);
    })
    .filter(Boolean);

  const used = new Set();
  const candidates = Array.isArray(findResults) && findResults.length ? findResults.slice(0, 2) : [null];
  return candidates.map(function (found) {
    const name = String(found && found.name || "").trim();
    const normalizedName = normalizeInterestTitle(name);
    const repeatsBlueButton = /blue button/i.test(name);
    if (normalizedName && !repeatsBlueButton && !recentNames.includes(normalizedName) && !used.has(normalizedName)) {
      used.add(normalizedName);
      return {
        kind: ["food", "water", "treasure"].includes(found.kind) ? found.kind : "treasure",
        name: name.slice(0, 80),
        note: String(found.note || "").slice(0, 160)
      };
    }

    const fresh = diverseWanderFinds
      .filter(function (item) {
        const key = normalizeInterestTitle(item.name);
        return !recentNames.includes(key) && !used.has(key);
      });
    const pool = fresh.length ? fresh : diverseWanderFinds.filter(function (item) { return !used.has(normalizeInterestTitle(item.name)); });
    if (!pool.length) return null;
    const replacement = pool[Math.floor(Math.random() * pool.length)];
    used.add(normalizeInterestTitle(replacement.name));
    return { kind: replacement.kind, name: replacement.name, note: replacement.note };
  }).filter(Boolean);
}

async function handleWander(options) {
  if (!mabel) return;
  const focusInterest = options && options.focusInterest;
  if (!focusInterest || !focusInterest.title) return;

  if (wanderStatus) wanderStatus.textContent = "Mabel is following a question that caught her attention.";
  const libraryMethods = [
    "on a public computer by the window",
    "in the library’s well-thumbed encyclopedia",
    "in a recent magazine",
    "in an old field guide",
    "in a library journal"
  ];
  const researchMethod = libraryMethods[Math.floor(Math.random() * libraryMethods.length)];

  try {
    const response = await fetch(MABEL_WANDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        focusInterest: focusInterest,
        interests: [focusInterest],
        researchInstruction: "Research only the exact subject in focusInterest.title. Keep the search query, sources, and summary directly related to that subject. Do not switch to another object or topic. This is a library research moment, not an exploration: do not say Mabel found or picked up a new object.",
        memories: [],
        mood: mabel.now.mood,
        energy: mabel.now.energy,
        needs: mabel.needs,
        wanderings: [],
        recentFinds: [focusInterest.title]
      })
    });
    if (!response.ok) throw new Error("Mabel could not reach the library. Status " + response.status);

    const data = await response.json();
    const returnedText = [
      data.searchQuestion,
      data.title,
      data.sourceTitle
    ].filter(Boolean).join(" ");
    const relevant = researchMatchesFocus(returnedText, focusInterest);
    const research = {
      kind: "research",
      at: now(),
      focusTitle: focusInterest.title,
      focusSource: focusInterest.source || "",
      searchQuestion: relevant
        ? (data.searchQuestion || focusInterest.question || "What might Mabel discover about " + focusInterest.title + "?")
        : (focusInterest.question || "What might Mabel discover about " + focusInterest.title + "?"),
      title: relevant ? (data.title || focusInterest.title) : "A question left on the library table",
      sourceTitle: relevant ? (data.sourceTitle || "") : "",
      researchSummary: relevant
        ? String(data.researchSummary || "").slice(0, 1200)
        : "",
      url: relevant ? (safeExternalUrl(data.url) || "") : "",
      musing: relevant
        ? /\b(?:found|picked up|came across)\s+(?:a|an|the)\s+(?:coin|button|toy|lid|shell|stone|key|cap|figure|flower|fossil|marble|bead)\b/i.test(String(data.musing || ""))
          ? "Mabel stayed with the question about " + focusInterest.title + " and kept a note from the source."
          : String(data.musing || "").slice(0, 700)
        : "Mabel could not find a page connected to " + focusInterest.title + " this time. She keeps the question for another visit.",
      researchMethod: researchMethod,
      related: relevant
    };

    researchLog.unshift(research);
    researchLog = researchLog.slice(0, 30);
    saveResearchLog();

    const existing = mabel.interests.find(function (item) {
      return normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.title);
    });
    if (existing && relevant) {
      existing.pull = clampNeed((existing.pull || 0.35) + 0.08);
      existing.lastPursuedAt = now();
      existing.stage = existing.pull > 0.65 ? "pursuing" : "growing";
    }

    if (data.interest && relevant && researchMatchesFocus(data.interest.title, focusInterest)) {
      const priorCount = mabel.interests.length;
      recordSpark(data.interest);
      if (mabel.interests.length > priorCount) showSparkNotice();
    }

    if (data.goalProgress && relevant) {
      const goal = mabel.interests.find(function (item) {
        return normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.title);
      });
      if (goal) {
        goal.steps = Array.isArray(goal.steps) ? goal.steps : [];
        const step = String(data.goalProgress.step || research.researchSummary || "").slice(0, 260);
        if (step) {
          goal.steps.unshift({ at: now(), text: step, source: research.sourceTitle, url: research.url });
          goal.steps.length = Math.min(goal.steps.length, 12);
          goal.progress = goal.steps.length;
          goal.lastStep = step;
          goal.lastSource = { title: research.sourceTitle, url: research.url };
          goal.nextQuestion = data.goalProgress.nextQuestion || goal.question;
          goal.question = goal.nextQuestion;
          goal.stage = "pursuing";
        }
      }
    }

    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.1);
    mabel.needs.rest = clampNeed(mabel.needs.rest - 0.015);
    mabel.now.doing = "researching " + focusInterest.title;
    mabel.now.thought = research.musing || research.researchSummary || focusInterest.question || mabel.now.thought;
    mabel.now.mood = "curious";
    mabel.now.updatedAt = now();
    addFeedEntry({
      kind: "noticed",
      text: "Mabel researched: " + research.searchQuestion + ".",
      why: [research.researchMethod, research.researchSummary].filter(Boolean).join(" ")
    });

    saveMabel();
    updatePage();
    if (wanderStatus) {
      wanderStatus.textContent = relevant
        ? "Mabel finished looking into " + focusInterest.title + "."
        : "Mabel kept the question, but did not find a useful page about it this time.";
    }
  } catch (error) {
    if (wanderStatus) wanderStatus.textContent = "The library connection is quiet for now. Mabel will try again later.";
  }
}

function removeReflectionHeading(value) {
  let text = String(value || "").trim();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    text = text
      .replace(/^\x60{3}(?:json)?\s*/i, "")
      .replace(/\s*\x60{3}$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") {
        text = parsed.trim();
        continue;
      }
      if (parsed && typeof parsed.text === "string") {
        text = parsed.text.trim();
        continue;
      }
      break;
    } catch (error) {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        const possibleJson = text.slice(firstBrace, lastBrace + 1);
        try {
          const parsed = JSON.parse(possibleJson);
          if (parsed && typeof parsed.text === "string") {
            text = parsed.text.trim();
            continue;
          }
        } catch (nestedError) {
          // Leave non-JSON prose alone.
        }
      }
      break;
    }
  }

  return text
    .replace(/^\x60{3}(?:json)?\s*/i, "")
    .replace(/\s*\x60{3}$/i, "")
    .replace(/^(?:mabel[’']s\s+)?end[ -]of[ -]day reflection(?:\s+text)?\s*(?::|—|–|-)?\s*/i, "")
    .trim();
}

async function writeEndOfDayReflection() {
  if (!mabel) {
    return;
  }

  const today = new Date().toDateString();
  const currentHour = new Date().getHours();

  if (currentHour < 20) {
    return;
  }

  if (lastReflectionDate === today) {
    return;
  }

  lastReflectionDate = today;
  localStorage.setItem(reflectionStorageKey, today);

  const recentMoments = mabel.feed
    .slice(0, 10)
    .map(function (entry) {
      return entry.text;
    })
    .join("\n");

  const recentDiary = mabel.feed
    .filter(function (entry) {
      return entry.kind === "journal" || entry.kind === "reflection";
    })
    .slice(0, 5)
    .map(function (entry) {
      return entry.text;
    })
    .join("\n");

  const prompt = `
Mabel is a small mouse living in the Hawthorn Hollow.

It is evening. Mabel is writing one longer reflection about her day.

These are some moments from Mabel's Activity Log:
${recentMoments || "Mabel has not recorded many moments today."}

These are some of Mabel's recent journal pages:
${recentDiary || "Mabel has not written in her journal yet."}

Mabel's current mood is ${mabel.now.mood}.
Mabel is currently ${mabel.now.doing}.
Mabel's inner thought is: ${mabel.now.thought}

Mabel's needs:
Comfort: ${mabel.needs.comfort}
Curiosity: ${mabel.needs.curiosity}
Connection: ${mabel.needs.connection}
Rest: ${mabel.needs.rest}
Wonder: ${mabel.needs.wonder}
Food: ${mabel.needs.food}
Water: ${mabel.needs.water}

Write ONE end-of-day reflection for Mabel.
The JSON text field must contain only the reflection prose. Do not repeat the title or write “End-of-day reflection” at the start of the text.

It should feel like Mabel looking back on the day from her mossy nest.
Mention one or two small things that may not have appeared in the Activity Log.
Include a gentle feeling, a small question, or something Mabel wants to remember tomorrow.
Do not repeat the Activity Log word for word.
Do not mention that you are an AI.
Do not mention Wikipedia, the internet, or searching.
Use 4 to 7 sentences.
Write in Mabel's voice.

Return only JSON like this:
{
  "title": "End-of-day reflection",
  "text": "Mabel's reflection"
}
`;

  try {
    const response = await fetch(MABEL_JOURNAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        kind: "end-of-day-reflection"
      })
    });

    if (!response.ok) {
      throw new Error("Mabel could not write her reflection. Status " + response.status);
    }

    const data = await response.json();

    if (!data.entry || !data.entry.text) {
      return;
    }

    const reflectionText = removeReflectionHeading(data.entry.text);
    if (!reflectionText) return;

    addDiaryEntry({
      kind: "reflection",
      title: data.entry.title || "End-of-day reflection",
      text: reflectionText
    });

    saveMabel();
    updatePage();
  } catch (error) {
    console.log("Mabel could not write her end-of-day reflection.", error);
  }
}

function switchTab(tabName) {
  tabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach(function (panel) {
    panel.classList.toggle("active", panel.id === tabName);
  });
  if (tabName === "visitor-board") loadVisitorBoard();
}


function startMabel() {
  mabel = loadMabel() || createDefaultMabel();
  mabel.now = {
    updatedAt: now(),
    doing: "listening for the hush between raindrops",
    thought: "Every small thing remembers being part of something larger.",
    mood: "wondering",
    energy: 0.72,
    ...(mabel.now || {})
  };
  mabel.memories = Array.isArray(mabel.memories) ? mabel.memories : [];
  mabel.needs = {
    comfort: 0.7,
    curiosity: 0.6,
    connection: 0.4,
    rest: 0.8,
    wonder: 0.5,
    food: 0.7,
    water: 0.75,
    ...(mabel.needs || {})
  };
  mabel.interests = Array.isArray(mabel.interests)
    ? mabel.interests.filter(function (interest) {
        return !legacySeedInterestIds.has(interest.id);
      })
    : [];
  mabel.feed = Array.isArray(mabel.feed)
    ? mabel.feed.filter(function (entry) {
        return entry.text !== "Mabel found a silver thread beneath the hawthorn roots.";
      })
    : [];

  const hasAutonomousDiaryEntry = mabel.feed.some(function (entry) {
    return ["did", "diary", "journal", "reflection"].includes(entry.kind);
  });
  if (!hasAutonomousDiaryEntry && mabel.now && mabel.now.doing) {
    addFeedEntry({
      kind: "did",
      text: mabel.now.doing,
      why: "Mabel began with a moment of her own."
    });
  }

  conversation = loadConversation();
  wanderings = loadWanderings();
  researchLog = loadResearchLog();
  boardReadKeys = loadBoardReadKeys();
  sparks = loadSparks();
  lastAutonomousMoment = loadLastAutonomousMoment();
  lastReflectionDate = localStorage.getItem(reflectionStorageKey) || "";
  bindle = loadBindle();
  gallery = loadGallery();
  visitorProfile = loadVisitorProfile();

  if (!mabel.needs) {
    mabel.needs = {
      comfort: 0.7,
      curiosity: 0.6,
      connection: 0.4,
      rest: 0.8,
      wonder: 0.5,
      food: 0.7,
      water: 0.75
    };
  }

  if (typeof mabel.needs.food !== "number") {
    mabel.needs.food = 0.7;
  }

  if (typeof mabel.needs.water !== "number") {
    mabel.needs.water = 0.75;
  }

  ensureHollowWorld();
  syncNoticedItemsIntoBindle();
  updatePage();

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      switchTab(button.dataset.tab);
    });
  });

  if (sendButton) {
    sendButton.addEventListener("click", handleVisitorMessage);
  }

  if (messageElement) {
    messageElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleVisitorMessage();
      }
    });
  }

  if (exploreButton) {
    exploreButton.addEventListener("click", handleExplore);
  }
  if (viewSparkButton) {
    viewSparkButton.addEventListener("click", function () {
      switchTab("inner-life");
    });
  }
  if (viewGalleryButton) {
    viewGalleryButton.addEventListener("click", function () {
      switchTab("gallery-tab");
      const galleryList = document.getElementById("gallery");
      if (galleryList) galleryList.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const introducedObjectForm = document.getElementById("introduce-object-form");
  if (introducedObjectForm) introducedObjectForm.addEventListener("submit", handleIntroducedObject);
  document.querySelectorAll("[data-gift-kind]").forEach(function (button) {
    button.addEventListener("click", chooseGift);
  });
  if (visitorBoardForm) visitorBoardForm.addEventListener("submit", submitVisitorBoardMessage);
  const forgetProfileButton = document.getElementById("forget-visitor-profile");
  if (forgetProfileButton) forgetProfileButton.addEventListener("click", forgetVisitorProfile);
  loadVisitorBoard();
  setInterval(function () {
    const boardPanel = document.getElementById("visitor-board");
    if (boardPanel && boardPanel.classList.contains("active")) loadVisitorBoard();
  }, 30000);

  // Mabel's ordinary life continues every 45 seconds.
  setInterval(function () {
    if (mabel) {
      chooseAction();
    }
  }, 45000);

  // Mabel has one AI-generated autonomous moment every 5 to 10 minutes.
  setInterval(function () {
    const timeSinceLastMoment = Date.now() - lastAutonomousMoment;
    const fiveMinutes = 5 * 60 * 1000;
    const tenMinutes = 10 * 60 * 1000;

    const nextMomentDelay =
      fiveMinutes + Math.random() * (tenMinutes - fiveMinutes);

    if (
      mabel &&
      document.visibilityState === "visible" &&
      timeSinceLastMoment >= nextMomentDelay
    ) {
      handleAutonomousMoment();
    }

    if (mabel && document.visibilityState === "visible") {
      writeEndOfDayReflection();
    }
  }, 15000);
}

startMabel();