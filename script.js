// MABEL SCRIPT VERSION 6 - AUTONOMOUS DAY

const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const activityLogElement = document.getElementById("activity-log");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
const replyElement = document.getElementById("reply");
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

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

const MABEL_AI_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel";
const MABEL_ART_URL = "https://mabel-ai-artwork.fianna-b-murphy.workers.dev/mabel-art";
const MABEL_WANDER_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-wander";
const MABEL_DAY_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-day";
const MABEL_JOURNAL_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-journal";

const mabelStorageKey = "mabel-character-v5";
const conversationStorageKey = "mabel-conversation-session-v3";
const wanderingsStorageKey = "mabel-wanderings-v1";
const sparksStorageKey = "mabel-sparks-v1";
const autonomousStorageKey = "mabel-autonomous-v1";
const reflectionStorageKey = "mabel-last-reflection-date";
const bindleStorageKey = "mabel-bindle-v1";
const galleryStorageKey = "mabel-gallery-v1";

const legacySeedInterestIds = new Set([
  "silver-thread",
  "rain-listening",
  "button-collecting",
  "old-lane"
]);

let mabel = null;
let conversation = [];
let wanderings = [];
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
    "listen_to_rain",
    "find_a_treasure",
    "rest_in_hollow",
    "write_in_diary",
    "inspect_a_leaf",
    "listen_for_small_creatures",
    "watch_the_weather",
    "sit_by_the_path",
    "gather_moss",
    "follow_a_scent"
  ];

  if (hungry) {
    actionNames.push("look_for_food");
    actionNames.push("look_for_food");
    actionNames.push("look_for_food");
  }

  if (thirsty) {
    actionNames.push("find_water");
    actionNames.push("find_water");
    actionNames.push("find_water");
  }

  if (tired) {
    actionNames.push("rest_in_hollow");
    actionNames.push("rest_in_hollow");
  }

  if (lonely) {
    actionNames.push("sit_by_the_path");
    actionNames.push("sit_by_the_path");
  }

  const activeInterests = mabel.interests.filter(function (interest) {
    return interest.stage === "growing" || interest.stage === "pursuing";
  });
  const pursueInterest = activeInterests.length > 0 &&
    Math.random() < Math.min(0.6, 0.2 + activeInterests[0].pull * 0.35);
  const chosen = actionNames[Math.floor(Math.random() * actionNames.length)];

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
    look_for_food: "searching the brambles for blackberries or fallen seeds",
    find_water: "looking for rainwater gathered in a curled leaf"
  };

  const actionMood = {
    listen_to_rain: "quiet",
    find_a_treasure: "curious",
    rest_in_hollow: "sleepy",
    write_in_diary: "thoughtful",
    inspect_a_leaf: "curious",
    listen_for_small_creatures: "attentive",
    watch_the_weather: "quiet",
    sit_by_the_path: "hopeful",
    gather_moss: "busy",
    follow_a_scent: "curious",
    look_for_food: "hungry",
    find_water: "thirsty"
  };

  const actionThought = {
    listen_to_rain: "Rain is the sky remembering how to speak softly.",
    find_a_treasure: "A lost thing is not always lost. Sometimes it is waiting to be noticed.",
    rest_in_hollow: "Even small creatures need a place where the world grows quiet.",
    write_in_diary: "A diary is a little boat for the day's forgotten weather.",
    inspect_a_leaf: "A leaf can hold a whole small world in its veins.",
    listen_for_small_creatures: "The grass is full of tiny movements if you stay still long enough.",
    watch_the_weather: "The sky changes its mind more often than Mabel does.",
    sit_by_the_path: "Sometimes it is nice simply to wait where someone might pass.",
    gather_moss: "Soft things make a home feel safer.",
    follow_a_scent: "A scent is a story that has not yet found its ending.",
    look_for_food: "Mabel's stomach feels small and empty. The brambles might have something.",
    find_water: "Mabel is thirsty. A leaf may have saved a little rain for her."
  };

  mabel.now.updatedAt = now();
  mabel.now.doing = pursueInterest
    ? "following her curiosity about " + activeInterests[0].title
    : actionText[chosen];
  mabel.now.mood = pursueInterest ? "absorbed" : actionMood[chosen];
  mabel.now.thought = pursueInterest
    ? activeInterests[0].question
    : actionThought[chosen];

  if (pursueInterest) {
    activeInterests[0].pull = clampNeed(activeInterests[0].pull + 0.035);
    activeInterests[0].lastPursuedAt = now();
  }

  mabel.needs.comfort = clampNeed(mabel.needs.comfort + (Math.random() - 0.45) * 0.08);
  mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + (Math.random() - 0.4) * 0.08);
  mabel.needs.connection = clampNeed(mabel.needs.connection - 0.03);
  mabel.needs.rest = clampNeed(mabel.needs.rest + (Math.random() - 0.5) * 0.08);
  mabel.needs.wonder = clampNeed(mabel.needs.wonder + (Math.random() - 0.45) * 0.08);

  mabel.needs.food = clampNeed(mabel.needs.food - 0.015);
  mabel.needs.water = clampNeed(mabel.needs.water - 0.02);

  if (chosen === "look_for_food") {
    mabel.needs.food = clampNeed(mabel.needs.food + 0.18);
  }

  if (chosen === "find_water") {
    mabel.needs.water = clampNeed(mabel.needs.water + 0.22);
  }

  if (chosen === "rest_in_hollow") {
    mabel.needs.rest = clampNeed(mabel.needs.rest + 0.2);
  }

  mabel.now.energy = clampNeed(mabel.now.energy + (Math.random() - 0.45) * 0.12);

  addFeedEntry({
    kind: "did",
    text: mabel.now.doing,
    why: "Mabel chose this for herself."
  });

  saveMabel();
  updatePage();
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
  if (!wishesElement) {
    return;
  }

  wishesElement.innerHTML = "";

  const activeWishes = mabel.interests
    .filter(function (interest) {
      return interest.stage !== "dormant";
    })
    .slice(0, 4);

  if (activeWishes.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel is resting between little wonders.";
    wishesElement.appendChild(item);
    return;
  }

  activeWishes.forEach(function (interest) {
    const item = document.createElement("li");
    item.textContent = "Mabel wishes to " + interest.question.toLowerCase().replace(/[?.!]$/, "") + ".";
    wishesElement.appendChild(item);
  });
}

function updateInterests() {
  if (!interestsElement) {
    return;
  }

  interestsElement.innerHTML = "";

  const sorted = [...mabel.interests].sort(function (a, b) {
    return b.pull - a.pull;
  });

  sorted.forEach(function (interest) {
    const item = document.createElement("li");
    item.className = "interest-item";

    const title = document.createElement("span");
    title.className = "interest-title";
    title.textContent = interest.title;

    const question = document.createElement("span");
    question.className = "interest-question";
    question.textContent = interest.question;

    const meter = document.createElement("progress");
    meter.className = "interest-meter";
    meter.max = 1;
    meter.value = interest.pull;

    const stage = document.createElement("span");
    stage.className = "interest-stage";
    stage.textContent = interest.stage;

    item.appendChild(title);
    item.appendChild(question);
    item.appendChild(meter);
    item.appendChild(stage);

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
  if (!diaryElement) {
    return;
  }

  diaryElement.innerHTML = "";

  const diaryEntries = mabel.feed.filter(function (entry) {
    return (
      entry.text !== "A visitor's words settled among the moss like a fallen petal." &&
      (entry.kind === "diary" ||
      entry.kind === "did" ||
      entry.kind === "noticed" ||
      entry.kind === "mind" ||
      entry.kind === "journal" ||
      entry.kind === "reflection")
    );
  });

  if (diaryEntries.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel's day is still gathering itself.";
    diaryElement.appendChild(item);
    return;
  }

  diaryEntries.slice(0, 10).forEach(function (entry) {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    if (entry.kind === "journal") {
      item.className = "journal-entry";
    }

    if (entry.kind === "reflection") {
      item.className = "reflection-entry";
    }

    const title = document.createElement("strong");

    if (entry.kind === "journal") {
      title.textContent = time + " — Evening page";
    } else if (entry.kind === "reflection") {
      title.textContent = time + " — End-of-day reflection";
    } else {
      title.textContent = time + " — " + entry.text;
    }

    const text = document.createElement("p");

    if (entry.kind === "journal" || entry.kind === "reflection") {
      text.textContent = entry.text;
    } else {
      text.textContent = entry.why || "";
    }

    item.appendChild(title);
    item.appendChild(text);

    diaryElement.appendChild(item);
  });
}

function updateActivityLog() {
  if (!activityLogElement) {
    return;
  }

  activityLogElement.innerHTML = "";

  const activityEntries = mabel.feed.filter(function (entry) {
    return entry.kind !== "journal" && entry.kind !== "reflection";
  });

  if (activityEntries.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel's day has not begun yet.";
    activityLogElement.appendChild(item);
    return;
  }

  activityEntries.slice(0, 20).forEach(function (entry) {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    item.textContent = time + " - " + entry.text;
    activityLogElement.appendChild(item);
  });
}

function updateMusing(wandering) {
  if (!musingElement) {
    return;
  }

  if (!wandering) {
    musingElement.innerHTML = `
      <p class="musing-source">Mabel has not wandered yet.</p>
      <p class="musing-text">
        Her curiosity is still gathering beneath the hawthorn.
      </p>
      <p class="mabel-thought">
        "Perhaps I will find something small and shining."
      </p>
    `;

    return;
  }

  let linkPart = wandering.title;

  if (wandering.url) {
    linkPart = '<a href="' + wandering.url + '" target="_blank" rel="noopener">' + wandering.title + "</a>";
  }

  musingElement.innerHTML = `
    <p class="musing-source">
      Mabel followed: ${wandering.searchQuestion || "a quiet thought"}
    </p>
    <p class="musing-text">
      She found: ${linkPart}
    </p>
    <p class="mabel-thought">
      "${wandering.musing}"
    </p>
  `;
}

function updateBindle() {
  const bindleElement = document.getElementById("bindle");

  if (!bindleElement) {
    return;
  }

  bindleElement.innerHTML = "";

  const hasFood = bindle.food.length > 0;
  const hasWater = bindle.water.length > 0;
  const hasTreasures = bindle.treasures.length > 0;

  if (!hasFood && !hasWater && !hasTreasures) {
    const empty = document.createElement("p");
    empty.className = "bindle-empty";
    empty.textContent = "Mabel’s bindle is light today.";
    bindleElement.appendChild(empty);
    return;
  }

  if (hasFood) {
    const foodGroup = document.createElement("div");
    foodGroup.className = "bindle-group";

    const foodTitle = document.createElement("p");
    foodTitle.className = "bindle-title";
    foodTitle.textContent = "Food";

    const foodList = document.createElement("ul");
    foodList.className = "bindle-list";

    bindle.food.forEach(function (item) {
      const foodItem = document.createElement("li");
      foodItem.className = "bindle-item";
      foodItem.textContent = item.name;

      if (item.note) {
        const note = document.createElement("span");
        note.className = "bindle-note";
        note.textContent = " — " + item.note;
        foodItem.appendChild(note);
      }

      foodList.appendChild(foodItem);
    });

    foodGroup.appendChild(foodTitle);
    foodGroup.appendChild(foodList);
    bindleElement.appendChild(foodGroup);
  }

  if (hasWater) {
    const waterGroup = document.createElement("div");
    waterGroup.className = "bindle-group";

    const waterTitle = document.createElement("p");
    waterTitle.className = "bindle-title";
    waterTitle.textContent = "Water";

    const waterList = document.createElement("ul");
    waterList.className = "bindle-list";

    bindle.water.forEach(function (item) {
      const waterItem = document.createElement("li");
      waterItem.className = "bindle-item";
      waterItem.textContent = item.name;

      if (item.note) {
        const note = document.createElement("span");
        note.className = "bindle-note";
        note.textContent = " — " + item.note;
        waterItem.appendChild(note);
      }

      waterList.appendChild(waterItem);
    });

    waterGroup.appendChild(waterTitle);
    waterGroup.appendChild(waterList);
    bindleElement.appendChild(waterGroup);
  }

  if (hasTreasures) {
    const treasureGroup = document.createElement("div");
    treasureGroup.className = "bindle-group";

    const treasureTitle = document.createElement("p");
    treasureTitle.className = "bindle-title";
    treasureTitle.textContent = "Little treasures";

    const treasureList = document.createElement("ul");
    treasureList.className = "bindle-list";

    bindle.treasures.forEach(function (item) {
      const treasureItem = document.createElement("li");
      treasureItem.className = "bindle-item";
      treasureItem.textContent = item.name;

      if (item.note) {
        const note = document.createElement("span");
        note.className = "bindle-note";
        note.textContent = " — " + item.note;
        treasureItem.appendChild(note);
      }

      treasureList.appendChild(treasureItem);
    });

    treasureGroup.appendChild(treasureTitle);
    treasureGroup.appendChild(treasureList);
    bindleElement.appendChild(treasureGroup);
  }
}

function updateWanderings() {
  if (!wanderingsElement) {
    return;
  }

  wanderingsElement.innerHTML = "";

  if (wanderings.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel's trail is still unwritten.";
    wanderingsElement.appendChild(item);
    return;
  }

  wanderings.slice(0, 10).forEach(function (wandering) {
    const item = document.createElement("li");

    if (wandering.url) {
      const link = document.createElement("a");
      link.href = wandering.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = wandering.title;
      item.appendChild(link);
    } else {
      const title = document.createElement("span");
      title.textContent = wandering.title;
      item.appendChild(title);
    }

    const thought = document.createElement("p");
    thought.textContent = wandering.musing;

    const change = document.createElement("p");
    change.className = "wandering-change";
    change.textContent = wandering.change || "";

    item.appendChild(thought);

    if (wandering.change) {
      item.appendChild(change);
    }

    wanderingsElement.appendChild(item);
  });
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

  if (wanderings.length > 0) {
    updateMusing(wanderings[0]);
  }

  updateWanderings();
    updateBindle();
  updateGallery();
}

function ensureHollowWorld() {
  if (!mabel.world) {
    mabel.world = {
      weather: "clear",
      timeOfDay: "afternoon",
      nest: {
        tidiness: 0.7,
        leaves: 2
      },
      foodDish: {
        food: []
      },
      waterLeaf: {
        water: 0.6
      },
      path: {
        offerings: []
      }
    };
  }
}

function updateHollowScene() {
  ensureHollowWorld();

  const foodItem = document.getElementById("hollow-food-item");
  const waterItem = document.getElementById("hollow-water-item");
  const offering = document.getElementById("hollow-offering");

  if (foodItem) {
    foodItem.setAttribute("opacity", mabel.world.foodDish.food.length > 0 ? "1" : "0");
  }

  if (waterItem) {
    waterItem.setAttribute("opacity", mabel.world.waterLeaf.water > 0.2 ? "0.75" : "0.2");
  }

  if (offering) {
    offering.setAttribute("opacity", mabel.world.path.offerings.length > 0 ? "1" : "0");
  }
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

async function handleHollowAction(action) {
  if (!mabel) return;

  ensureHollowWorld();

  const status = document.getElementById("hollow-status");
  let eventText = "";
  let eventDetails = {};

  if (action === "leave-food") {
    eventText = "The visitor leaves a blackberry in Mabel's food dish.";
    eventDetails = { object: "blackberry" };

    mabel.world.foodDish.food.push({
      name: "blackberry",
      at: now()
    });
  }

  if (action === "refill-water") {
    eventText = "The visitor refills Mabel's water leaf.";
    eventDetails = { object: "water leaf" };

    mabel.world.waterLeaf.water = 1;
  }

  if (action === "tidy-nest") {
    eventText = "The visitor gently tidies Mabel's mossy nest.";
    eventDetails = { object: "mossy nest" };

    mabel.world.nest.tidiness = 1;

    if (mabel.world.nest.leaves > 0) {
      mabel.world.nest.leaves = mabel.world.nest.leaves - 1;
    }
  }

  if (action === "leave-offering") {
    const offerings = [
      "a small white pebble",
      "a curled leaf",
      "a tiny blue button",
      "a feather",
      "a flower petal"
    ];

    const offering = offerings[Math.floor(Math.random() * offerings.length)];

    eventText = "The visitor leaves " + offering + " on the path near Mabel's hollow.";
    eventDetails = { object: offering };

    mabel.world.path.offerings.unshift({
      name: offering,
      at: now()
    });

    if (mabel.world.path.offerings.length > 10) {
      mabel.world.path.offerings.length = 10;
    }
  }

  saveMabel();
  updateHollowScene();

  if (!eventText) return;

  if (status) {
    status.textContent = "Mabel notices something in the hollow...";
  }

  try {
    const response = await fetch(MABEL_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: eventText,
        eventDetails: eventDetails,
        world: mabel.world,
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        energy: mabel.now.energy,
        memories: mabel.memories.slice(0, 8),
        conversation: conversation.slice(-10)
      })
    });

    if (!response.ok) {
      throw new Error("Mabel could not notice the hollow. Status " + response.status);
    }

    const data = await response.json();

    if (data.reply) {
      showHollowSpeech(data.reply);

      replyElement.textContent = data.reply;

      conversation.push({
        role: "user",
        content: eventText
      });

      conversation.push({
        role: "assistant",
        content: data.reply
      });

      if (conversation.length > 20) {
        conversation = conversation.slice(-20);
      }

      saveConversation();
    }

    if (data.needs) {
      if (typeof data.needs.food === "number") {
        mabel.needs.food = clampNeed(data.needs.food);
      }

      if (typeof data.needs.water === "number") {
        mabel.needs.water = clampNeed(data.needs.water);
      }

      if (typeof data.needs.rest === "number") {
        mabel.needs.rest = clampNeed(data.needs.rest);
      }

      if (typeof data.needs.comfort === "number") {
        mabel.needs.comfort = clampNeed(data.needs.comfort);
      }
    }

    if (data.mood) {
      mabel.now.mood = data.mood;
    }

    if (data.memory) {
      mabel.memories.unshift({
        at: now(),
        kind: "visitor",
        text: data.memory
      });

      if (mabel.memories.length > 20) {
        mabel.memories.length = 20;
      }
    }

    saveMabel();
    updatePage();
    updateHollowScene();

    if (status) {
      status.textContent = "Mabel has noticed the hollow.";
    }
  } catch (error) {
    if (status) {
      status.textContent = "Mabel’s attention drifted for a moment. Try again soon.";
    }
  }
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
  const hint = ((context.message || "") + " " + activity + " " + mood).toLowerCase();
  const motif = hint.includes("rain") || hint.includes("water")
    ? "rain"
    : hint.includes("flower") || hint.includes("bloom")
      ? "bloom"
      : hint.includes("night") || hint.includes("moon")
        ? "night"
        : motifs[Math.floor(Math.random() * motifs.length)];

  return {
    title: "Mabel's " + mood + " marks",
    kind: "moment",
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    motif: motif,
    symbols: [symbols[Math.floor(Math.random() * symbols.length)]],
    note: "She kept a small piece of " + activity + ".",
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
        mood: context.mood || mabel.now.mood,
        activity: context.activity || mabel.now.doing,
        thought: context.thought || mabel.now.thought,
        needs: mabel.needs,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 8),
        wanderings: wanderings.slice(0, 5),
        recentArtworks: gallery.slice(0, 6).map(function (item) {
          return { title: item.title, motif: item.motif };
        })
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

  const explicitRequest = source === "visitor" &&
    /\b(draw|drawing|sketch|paint|painting|picture|artwork|art)\b/i.test(context.message || "");
  if (!artwork && explicitRequest && !declined) {
    artwork = makeMabelFallbackArtwork(context);
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

async function handleVisitorMessage() {
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent = "Mabel tilts her head. \"The hollow is quiet, but I am still listening.\"";
    return;
  }

  replyElement.textContent = "Mabel is listening...";

  try {
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

    replyElement.textContent = data.reply;

    if (data.spark) {
      recordSpark(data.spark);
    }

    reflectOnConversation(message, data.reply, data.spark || null);

    if (/\b(draw|drawing|sketch|paint|painting|picture|artwork|art)\b/i.test(message)) {
      await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
    }

    if (data.artwork) {
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
      content: data.reply
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
      }
    }

    mabel.needs.connection = clampNeed(mabel.needs.connection + 0.18);
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.08);

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    saveMabel();
    updateHollowScene();
    updatePage();

    messageElement.value = "";
  } catch (error) {
    replyElement.textContent = "Mabel's lantern flickers. \"The path to my thoughts is tangled tonight. Try again in a moment.\"";
  }
}

async function handleAutonomousMoment() {
  lastAutonomousMoment = Date.now();
  saveLastAutonomousMoment();

  try {
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

    if (data.needs) {
      if (typeof data.needs.food === "number") {
        mabel.needs.food = clampNeed(data.needs.food);
      }

      if (typeof data.needs.water === "number") {
        mabel.needs.water = clampNeed(data.needs.water);
      }

      if (typeof data.needs.rest === "number") {
        mabel.needs.rest = clampNeed(data.needs.rest);
      }

      if (typeof data.needs.comfort === "number") {
        mabel.needs.comfort = clampNeed(data.needs.comfort);
      }

      if (typeof data.needs.curiosity === "number") {
        mabel.needs.curiosity = clampNeed(data.needs.curiosity);
      }

      if (typeof data.needs.connection === "number") {
        mabel.needs.connection = clampNeed(data.needs.connection);
      }

      if (typeof data.needs.wonder === "number") {
        mabel.needs.wonder = clampNeed(data.needs.wonder);
      }
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
      }
    }

    saveMabel();
    updatePage();

    autonomousMomentCount = autonomousMomentCount + 1;

    if (autonomousMomentCount % 3 === 0) {
      writeEveningPage();
    }

    await requestMabelArtwork({
      source: "autonomous",
      activity: mabel.now.doing,
      thought: mabel.now.thought,
      mood: mabel.now.mood
    });

    writeEndOfDayReflection();
  } catch (error) {
    chooseAction();
  }
}

function normalizeInterestTitle(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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
      source: "conversation",
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
      source: "conversation",
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

  if (replyElement && document.querySelector(".spark-notice") === null) {
    replyElement.append(document.createElement("br"));
    const notice = document.createElement("p");
    notice.className = "spark-notice";
    notice.textContent = "A small question has stayed with Mabel.";
    replyElement.appendChild(notice);
  }
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
        world: mabel.world
      })
    });

    if (!response.ok) return;

    const reflection = await response.json();

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
      return entry.title + ": " + entry.musing;
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

async function handleWander() {
  wanderButton.disabled = true;
  wanderStatus.textContent = "Mabel is following a little thread through the moss...";

  if (musingElement) {
    musingElement.innerHTML = `
      <p class="musing-source">Mabel is wandering...</p>
      <p class="musing-text">
        Her small paws are quiet among the moss and fallen leaves.
      </p>
      <p class="mabel-thought">
        "Perhaps something small and shining is waiting."
      </p>
    `;
  }

  try {
    const response = await fetch(MABEL_WANDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10),
        mood: mabel.now.mood,
        energy: mabel.now.energy,
        needs: mabel.needs,
        wanderings: wanderings.slice(0, 10),
        bindle: bindle
      })
    });

    if (!response.ok) {
      throw new Error("Mabel could not wander. Status " + response.status);
    }

    const data = await response.json();

    const wandering = {
      at: now(),
      searchQuestion: data.searchQuestion,
      title: data.title,
      url: data.url,
      musing: data.musing,
      change: data.change || "",
      interest: data.interest || null
    };

    wanderings.unshift(wandering);

    if (wanderings.length > 30) {
      wanderings.length = 30;
    }

    saveWanderings();

    if (wandering.interest) {
      const existing = mabel.interests.find(function (interest) {
        return interest.id === wandering.interest.id;
      });

      if (existing) {
        existing.pull = Math.max(0, Math.min(1, existing.pull + 0.12));

        if (existing.pull > 0.65 && existing.stage === "dormant") {
          existing.stage = "pursuing";
        }
      } else {
        mabel.interests.push(wandering.interest);

        addFeedEntry({
          kind: "mind",
          text: "Mabel began a new thread: " + wandering.interest.title + ".",
          why: wandering.interest.question,
          interest: wandering.interest.id
        });
      }
    }

    const finds = Array.isArray(data.finds) ? data.finds : [];

    finds.forEach(function (found) {
      const kind = found.kind || "treasure";
      const name = found.name || "something small";
      const note = found.note || "";

      if (kind === "food") {
        bindle.food.unshift({
          name: name,
          note: note
        });

        if (bindle.food.length > 8) {
          bindle.food.length = 8;
        }

        mabel.needs.food = clampNeed(mabel.needs.food + 0.12);
      }

      if (kind === "water") {
        bindle.water.unshift({
          name: name,
          note: note
        });

        if (bindle.water.length > 5) {
          bindle.water.length = 5;
        }

        mabel.needs.water = clampNeed(mabel.needs.water + 0.15);
      }

      if (kind === "treasure") {
        bindle.treasures.unshift({
          name: name,
          note: note
        });

        if (bindle.treasures.length > 12) {
          bindle.treasures.length = 12;
        }

        mabel.needs.wonder = clampNeed(mabel.needs.wonder + 0.08);
      }
    });

    saveBindle();

    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.1);
    mabel.needs.wonder = clampNeed(mabel.needs.wonder + 0.08);

    addFeedEntry({
      kind: "noticed",
      text: "Mabel encountered: " + wandering.title + ".",
      why: wandering.musing
    });

    if (finds.length > 0) {
      const foundNames = finds
        .map(function (found) {
          return found.name || "something small";
        })
        .join(", ");

      addFeedEntry({
        kind: "noticed",
        text: "Mabel gathered: " + foundNames + ".",
        why: "She tucked what she could carry into her bindle."
      });
    }

    saveMabel();
    updatePage();

    wanderStatus.textContent = "Mabel has returned from her wandering.";
  } catch (error) {
    wanderStatus.textContent = "Mabel's paws paused at the edge of the hollow. The path beyond was tangled.";
  } finally {
    wanderButton.disabled = false;
  }
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

    addDiaryEntry({
      kind: "reflection",
      title: data.entry.title || "End-of-day reflection",
      text: data.entry.text
    });

    saveMabel();
    updatePage();
  } catch (error) {
    console.log("Mabel could not write her end-of-day reflection.", error);
  }
}

function switchTab(tabName) {
  tabButtons.forEach(function (button) {
    if (button.dataset.tab === tabName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  tabPanels.forEach(function (panel) {
    if (panel.id === tabName) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
}

function startMabel() {
  mabel = loadMabel() || createDefaultMabel();
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
  sparks = loadSparks();
  lastAutonomousMoment = loadLastAutonomousMoment();
  lastReflectionDate = localStorage.getItem(reflectionStorageKey) || "";
  bindle = loadBindle();
  gallery = loadGallery();

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

  updatePage();

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      switchTab(button.dataset.tab);
    });
  });

  if (sendButton) {
    sendButton.addEventListener("click", handleVisitorMessage);
  }

  if (wanderButton) {
    wanderButton.addEventListener("click", handleWander);
  }

  const hollowScene = document.querySelector(".hollow-svg");
  if (hollowScene) {
    hollowScene.querySelectorAll("[data-hollow-action]").forEach(function (hotspot) {
      hotspot.setAttribute("tabindex", "0");
      hotspot.setAttribute("role", "button");
      hotspot.addEventListener("click", function () {
        handleHollowAction(hotspot.dataset.hollowAction);
      });
      hotspot.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleHollowAction(hotspot.dataset.hollowAction);
        }
      });
    });
    updateHollowScene();
  }

  // Mabel's ordinary life continues every 45 seconds.
  setInterval(function () {
    if (mabel) {
      chooseAction();
    }
  }, 45000);

  // Mabel has one AI-generated autonomous moment every 20 to 40 minutes.
  setInterval(function () {
    const timeSinceLastMoment = Date.now() - lastAutonomousMoment;
    const twentyMinutes = 20 * 60 * 1000;
    const fortyMinutes = 40 * 60 * 1000;

    const nextMomentDelay =
      twentyMinutes + Math.random() * (fortyMinutes - twentyMinutes);

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