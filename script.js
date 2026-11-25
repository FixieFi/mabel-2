// MABEL SCRIPT VERSION 6 - AUTONOMOUS DAY

const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const activityLogElement = document.getElementById("activity-log");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
let replyElement = document.getElementById("reply");
const chatStatusElement = document.getElementById("chat-status");
const sparkNoticeCard = document.getElementById("spark-notice-card");
const sparkNoticeHeading = document.getElementById("spark-notice-heading");
const sparkNoticeText = document.getElementById("spark-notice-text");
const itemKnowledgeElement = document.getElementById("item-knowledge");
const visitorGiftNoticeCard = document.getElementById("visitor-gift-notice-card");
const visitorGiftNoticeText = document.getElementById("visitor-gift-notice-text");
const viewVisitorGiftButton = document.getElementById("view-visitor-gift");
const dismissVisitorGiftButton = document.getElementById("dismiss-visitor-gift");
const chatExchangesElement = document.getElementById("chat-exchanges");
const giftNoticeCard = document.getElementById("visitor-gift-notice-card");
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

const MABEL_GUIDING_AIM = "Mabel wants to build a fulfilling life by discovering more about the world beyond the Hawthorn Hollow and following the subjects she keeps finding meaningful. If an interest stays with her through real conversations, discoveries, and research, she may someday imagine work that feels right to her. Her path can change as she does.";

const MABEL_AI_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel";
const MABEL_ART_URL = "https://mabel-ai-artwork.fianna-b-murphy.workers.dev/mabel-art";
const MABEL_WANDER_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-wander";
const MABEL_DAY_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-day";
const MABEL_JOURNAL_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-journal";
const MABEL_BOARD_URL = "https://mabel-life.fianna-b-murphy.workers.dev/board";

const mabelStorageKey = "mabel-character-v5";
const conversationStorageKey = "mabel-conversation-session-v3";
const reflectionQueueStorageKey = "mabel-deferred-reflections-v1";
const wanderingsStorageKey = "mabel-wanderings-v1";
const researchLogStorageKey = "mabel-library-research-v1";
const boardReadKeysStorageKey = "mabel-board-read-v1";
const sparksStorageKey = "mabel-sparks-v1";
const autonomousResearchStorageKey = "mabel-last-autonomous-research-v1";
const viewedSparkStorageKey = "mabel-viewed-spark-v1";
const viewedArtworkStorageKey = "mabel-viewed-artwork-v1";
const autonomousStorageKey = "mabel-autonomous-v1";
const reflectionStorageKey = "mabel-last-reflection-date";
const bindleStorageKey = "mabel-bindle-v1";
const galleryStorageKey = "mabel-gallery-v1";
const visitorProfileStorageKey = "mabel-visitor-profile-v1";
const visitorGiftSeenStorageKey = "mabel-viewed-visitor-gift-v1";

const legacySeedInterestIds = new Set([
  "silver-thread",
  "rain-listening",
  "button-collecting",
  "old-lane"
]);

let mabel = null;
let conversation = [];
let reflectionQueue = [];
let messagePending = false;
let wanderings = [];
let researchLog = [];
let boardReadKeys = [];
let sparks = [];
let lastViewedSparkId = "";
let lastViewedArtworkKey = "";
let lastAutonomousMoment = 0;
let lastAutonomousResearchAt = 0;

let autonomousMomentCount = 0;
let lastReflectionDate = "";

let bindle = {
  food: [],
  water: [],
  treasures: []
};

let gallery = [];
let visitorProfile = { facts: [], moments: [] };
let chatInteractionClosed = false;
let currentChatExchangeCard = null;

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

function saveReflectionQueue() {
  try {
    sessionStorage.setItem(reflectionQueueStorageKey, JSON.stringify(reflectionQueue.slice(0, 12)));
  } catch (error) {
    // Reflections can wait for the next conversation if session storage is unavailable.
  }
}

function loadReflectionQueue() {
  try {
    const saved = sessionStorage.getItem(reflectionQueueStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch (error) {
    return [];
  }
}

function queueDeferredReflection(reflection) {
  if (!reflection || !reflection.type) return;
  reflectionQueue.push({
    id: "reflection-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
    queuedAt: now(),
    ...reflection
  });
  reflectionQueue = reflectionQueue.slice(-12);
  saveReflectionQueue();
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

const researchIdeasStorageKey = "mabel-research-ideas-v1";
let researchIdeas = [];
const mabelPostboxStorageKey = "mabel-private-postbox-v1";
let mabelPostboxItems = [];

function loadMabelPostbox() {
  try {
    const saved = localStorage.getItem(mabelPostboxStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch (error) { return []; }
}
function saveMabelPostbox() {
  try { localStorage.setItem(mabelPostboxStorageKey, JSON.stringify(mabelPostboxItems.slice(0, 30))); }
  catch (error) { /* Keep the notes available for this visit. */ }
}
function addMabelPostboxItem(item) {
  if (!item || (!item.text && !item.artwork)) return;
  const duplicateKey = String(item.title || "") + "|" + String(item.text || "") + "|" + String(item.at || "");
  if (mabelPostboxItems.some(function (saved) {
    return saved && (String(saved.title || "") + "|" + String(saved.text || "") + "|" + String(saved.at || "")) === duplicateKey;
  })) return;
  mabelPostboxItems.unshift({
    id: item.id || "postbox-" + Date.now(),
    at: item.at || now(),
    kind: item.kind || "note",
    title: String(item.title || "A note from Mabel").slice(0, 100),
    text: String(item.text || "").slice(0, 500),
    relatedGiftId: item.relatedGiftId || "",
    sources: Array.isArray(item.sources) ? item.sources.slice(0, 3) : [],
    artwork: item.artwork || null
  });
  mabelPostboxItems = mabelPostboxItems.slice(0, 30);
  saveMabelPostbox();
  updateMabelPostbox();
}
function updateMabelPostbox() {
  const list = document.getElementById("mabel-postbox");
  if (!list) return;
  list.replaceChildren();
  if (!mabelPostboxItems.length) {
    const empty = document.createElement("li");
    empty.className = "postbox-empty";
    empty.textContent = "Mabel has not left you a note yet.";
    list.appendChild(empty);
    return;
  }
  mabelPostboxItems.slice(0, 20).forEach(function (entry) {
    const item = document.createElement("li");
    item.className = "postbox-item";
    const title = document.createElement("strong");
    title.textContent = entry.title || "A note from Mabel";
    item.appendChild(title);
    if (entry.at) {
      const time = document.createElement("time");
      time.dateTime = entry.at;
      const parsedAt = Date.parse(entry.at);
      time.textContent = Number.isFinite(parsedAt) ? new Date(parsedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
      item.appendChild(time);
    }
    if (entry.text) {
      const note = document.createElement("p");
      note.textContent = entry.text;
      item.appendChild(note);
    }
    const giftStillInBindle = entry.relatedGiftId &&
      [bindle.food, bindle.water, bindle.treasures].some(function (items) {
        return (items || []).some(function (gift) { return gift && gift.giftId === entry.relatedGiftId; });
      });
    if (giftStillInBindle) {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "postbox-gift-link";
      link.textContent = "See this gift in Mabel’s bindle";
      link.addEventListener("click", function () {
        switchTab("hollow");
        const safeId = String(entry.relatedGiftId).replace(/[^a-z0-9_-]/gi, "");
        const row = document.getElementById("bindle-gift-" + safeId);
        if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      item.appendChild(link);
    }
    if (entry.relatedGiftId) {
      const link = document.createElement("button");
      link.type = "button";
      link.className = "postbox-gift-link";
      link.textContent = "See this gift in Mabel’s bindle";
      link.addEventListener("click", function () {
        switchTab("hollow");
        const row = document.getElementById("bindle-gift-" + entry.relatedGiftId.replace(/[^a-z0-9_-]/gi, ""));
        if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      item.appendChild(link);
    }
    if (entry.artwork) {
      const card = renderMabelCard({ ...entry.artwork, source: "comfort" });
      if (card) item.appendChild(card);
    }
    (Array.isArray(entry.sources) ? entry.sources : []).forEach(function (source) {
      const url = safeExternalUrl(source && source.url);
      if (!url || !source.title) return;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.title;
      item.appendChild(link);
    });
    list.appendChild(item);
  });
}

function saveResearchIdeas() {
  try { localStorage.setItem(researchIdeasStorageKey, JSON.stringify(researchIdeas.slice(0, 40))); }
  catch (error) { /* Keep the queue in memory for this visit. */ }
}

function loadResearchIdeas() {
  try {
    const saved = localStorage.getItem(researchIdeasStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.filter(function (idea) { return isGroundedResearchTrigger(idea); }).slice(0, 40)
      : [];
  } catch (error) { return []; }
}

function addResearchIdea(candidate) {
  if (!candidate || !candidate.title || !isGroundedResearchTrigger(candidate)) return null;
  const title = String(candidate.title).trim().slice(0, 90);
  const key = normalizeInterestTitle(title);
  if (!key) return null;
  let idea = researchIdeas.find(function (item) { return normalizeInterestTitle(item.title) === key; });
  if (!idea) {
    idea = {
      id: candidate.id || "idea-" + Date.now(),
      title: title,
      question: String(candidate.question || "What might Mabel discover about " + title + "?").trim().slice(0, 220),
      source: candidate.source || "Mabel’s thoughts",
      searchTerm: String(candidate.searchTerm || "").trim().slice(0, 100),
      requestType: candidate.requestType || "",
      originText: String(candidate.originText || candidate.evidenceText || candidate.reason || "A thought caught Mabel’s attention.").trim().slice(0, 260),
      originType: candidate.source || "Mabel’s thoughts",
      originAt: candidate.originAt || candidate.createdAt || now(),
      grounded: true,
      evidence: Math.max(1, Number(candidate.evidence) || 1),
      createdAt: candidate.createdAt || now(),
      lastSeenAt: now(),
      lastResearchedAt: candidate.lastResearchedAt || ""
    };
    researchIdeas.unshift(idea);
  } else {
    idea.evidence = Math.max(idea.evidence || 1, Number(candidate.evidence) || 1);
    idea.question = String(candidate.question || idea.question).trim().slice(0, 220);
    if (candidate.searchTerm) idea.searchTerm = String(candidate.searchTerm).trim().slice(0, 100);
    if (candidate.requestType) idea.requestType = candidate.requestType;
    if (candidate.originText || candidate.evidenceText || candidate.reason) {
      idea.originText = String(candidate.originText || candidate.evidenceText || candidate.reason).trim().slice(0, 260);
    }
    idea.originType = candidate.source || idea.originType || idea.source || "Mabel’s thoughts";
    idea.originAt = candidate.originAt || candidate.createdAt || idea.originAt || idea.createdAt || now();
    idea.lastSeenAt = now();
    if (candidate.lastResearchedAt) idea.lastResearchedAt = candidate.lastResearchedAt;
  }
  researchIdeas = researchIdeas.slice(0, 40);
  saveResearchIdeas();
  return idea;
}

function isDurableInterestCandidate(candidate) {
  if (!candidate) return false;
  const title = String(candidate.title || "").trim().toLowerCase();
  const details = title + " " + String(candidate.question || "") + " " + String(candidate.reason || "");
  const kind = String(candidate.kind || candidate.category || "").toLowerCase();
  if (!title || /^(a|an|the)\s+/.test(title)) return false;
  if (/\b(pebble|button|coin|cap|lid|shell|stone|toy|crayon|twig|leaf|moss|flower|fossil|key|bead)\b/i.test(title) &&
      !/\b(collecting|collection|making|crafting|studying|learning|playing|listening|practising|practicing)\b/i.test(title)) return false;
  const enduringKind = /\b(hobby|activity|practice|practise|preference|pursuit|interest|pastime)\b/.test(kind);
  const activityTitle = /\b(playing|play|listening|music|singing|dance|dancing|exercise|exercising|walk|walks|walking|hiking|cooking|baking|painting|drawing|gardening|reading|writing|crafting|making|practising|practicing|learn|learning|swimming|running|stretching)\b/i.test(title);
  const explicitOngoingActivity = /^(playing|listening to|going for|walking|exercising|dancing|singing|cooking|baking|painting|drawing|gardening|reading|writing|practising|practicing|learning|swimming|running)\b/i.test(title);
  const enduringDetails = /\b(enjoys|keeps returning|wants to practice|wants to practise|wants to learn|would like to learn|often|regularly|again and again|favorite|favourite|likes doing)\b/i.test(details);
  return enduringKind || explicitOngoingActivity || (activityTitle && enduringDetails);
}

function promoteResearchIdeaToInterest(candidate, spark) {
  const existing = mabel.interests.find(function (item) {
    return item.id === spark.id || normalizeInterestTitle(item.title) === normalizeInterestTitle(spark.title);
  });
  if (existing) return existing;
  const interest = {
    id: spark.id,
    title: spark.title,
    grounded: true,
    kind: candidate.kind || candidate.category || "activity",
    question: spark.question,
    curiosity: 0.62,
    pull: spark.pull,
    evidence: spark.evidence,
    stage: "growing",
    source: spark.source,
    createdAt: spark.createdAt,
    interestPromotedAt: now(),
    actions: []
  };
  mabel.interests.unshift(interest);
  addFeedEntry({
    kind: "mind",
    text: "Mabel has kept returning to " + spark.title + "; it is becoming an interest of hers.",
    why: spark.question,
    interest: spark.id
  });
  return interest;
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
function prepareArtworkForGallery(artwork, context) {
  if (!artwork) return artwork;
  const details = context || {};
  const requestedSubject = requestedArtworkDescriptionSubject(details.message);
  artwork.at = artwork.at || artwork.createdAt || now();
  artwork.source = details.source || artwork.source || "autonomous";
  if (details.message) artwork.promptContext = String(details.message).trim().slice(0, 240);
  if (details.inspiration) {
    artwork.inspirationContext = String(details.inspiration.question || details.inspiration.title || "").slice(0, 240);
  }
  if (requestedSubject) {
    artwork.subject = requestedSubject;
    artwork.selfPortrait = requestedSubject === "mabel";
    const existingDescription = String(artwork.description || artwork.note || artwork.caption || "").trim();
    if (!normalizeInterestTitle(existingDescription).includes(normalizeInterestTitle(requestedSubject))) {
      artwork.description = "A drawing of " + requestedSubject + (existingDescription ? ". " + existingDescription : ".");
      artwork.note = artwork.description;
    } else {
      artwork.description = existingDescription;
    }
  } else if (!artwork.description) {
    artwork.description = artwork.note || artwork.caption || "";
  }
  if (!artwork.description && details.inspiration) {
    artwork.description = "A little study of " + details.inspiration.title + ". " +
      (details.inspiration.question || "Mabel followed a thought that stayed with her.");
  }
  return artwork;
}

function saveToMabelGallery(artwork) {
  if (!artwork || !artwork.title) {
    return;
  }

  gallery.unshift({
    ...artwork,
    at: artwork.at || artwork.createdAt || now()
  });

  if (gallery.length > 30) {
    gallery.length = 30;
  }

  saveGallery();
  updateGallery();
  updateVisitorProfile();
  refreshGalleryNotice();
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
  if (!galleryElement) return;
  galleryElement.replaceChildren();

  if (gallery.length === 0) {
    const item = document.createElement("li");
    item.className = "gallery-empty";
    item.textContent = "Mabel has not made any little drawings yet.";
    galleryElement.appendChild(item);
    return;
  }

  gallery.forEach(function (artwork) {
    const item = document.createElement("li");
    item.className = "gallery-item";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-artwork-button";
    button.setAttribute("aria-label", "Open details for " + (artwork.title || "Mabel’s drawing"));
    const card = renderMabelCard(artwork);
    const drawing = card && card.querySelector("svg");
    if (drawing) {
      button.appendChild(drawing);
      button.addEventListener("click", function () {
        openGalleryArtworkDetails(artwork);
      });
      item.appendChild(button);
    }
    galleryElement.appendChild(item);
  });
}

function openGalleryArtworkDetails(artwork) {
  const dialog = document.getElementById("gallery-detail");
  const image = document.getElementById("gallery-detail-image");
  const title = document.getElementById("gallery-detail-title");
  const time = document.getElementById("gallery-detail-time");
  const description = document.getElementById("gallery-detail-description");
  const context = document.getElementById("gallery-detail-context");
  const contextLabel = document.getElementById("gallery-detail-context-label");
  if (!dialog || !image || !title || !time || !description || !context) return;

  image.replaceChildren();
  const card = renderMabelCard(artwork);
  const drawing = card && card.querySelector("svg");
  if (drawing) image.appendChild(drawing);
  title.textContent = artwork.title || "A little drawing";
  const date = new Date(artwork.at || artwork.createdAt || "");
  time.dateTime = !isNaN(date.getTime()) ? date.toISOString() : "";
  time.textContent = !isNaN(date.getTime())
    ? date.toLocaleString([], { dateStyle: "long", timeStyle: "short" })
    : "Creation time not recorded";
  description.textContent = artwork.description || artwork.note || "A little drawing Mabel made.";
  const contextText = artwork.promptContext || artwork.inspirationContext || "";
  context.textContent = contextText;
  const contextBlock = document.getElementById("gallery-detail-context-block");
  if (contextLabel) contextLabel.hidden = !contextText;
  if (contextBlock) contextBlock.hidden = !contextText;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
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
    memories: [],
    knowledge: []
  };
}

function addFeedEntry(entry) {
  if (entry && entry.kind === "did" && entry.text) {
    const latestAction = mabel.feed.find(function (item) { return item.kind === "did"; });
    const normalizeAction = function (value) {
      return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    };
    if (latestAction && normalizeAction(latestAction.text) === normalizeAction(entry.text)) return latestAction;
  }
  const savedEntry = { at: now(), ...entry, ok: true };
  mabel.feed.unshift(savedEntry);
  if (mabel.feed.length > 80) mabel.feed.length = 80;
  return savedEntry;
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
    "sit_by_the_path", "gather_moss", "follow_a_scent", "make_a_doodle",
    "sort_her_bindle", "practice_a_tune", "make_a_tiny_map", "tidy_her_nest",
    "play_a_small_game", "watch_the_clouds", "visit_the_berry_patch", "stretch_and_wiggle"
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
    drink_stored_water: "drinking water she saved for later",
    make_a_doodle: "making a tiny drawing in the margin of an old page",
    sort_her_bindle: "sorting the curious things in her bindle",
    practice_a_tune: "trying a little tune on a hollow reed",
    make_a_tiny_map: "drawing a map of paths she has wandered",
    tidy_her_nest: "straightening her nest and tucking in loose leaves",
    play_a_small_game: "inventing a small game with a button and a twig",
    watch_the_clouds: "watching cloud shapes drift over the hawthorn",
    visit_the_berry_patch: "checking which berries are ready",
    stretch_and_wiggle: "stretching her paws and taking a little wiggle break"
  };
  const actionMood = {
    listen_to_rain: "quiet", find_a_treasure: "curious", rest_in_hollow: "sleepy",
    write_in_diary: "thoughtful", inspect_a_leaf: "curious",
    listen_for_small_creatures: "attentive", watch_the_weather: "quiet",
    sit_by_the_path: "hopeful", gather_moss: "busy", follow_a_scent: "curious",
    look_for_food: "hungry", find_water: "thirsty",
    eat_stored_food: "content", drink_stored_water: "relieved",
    make_a_doodle: "inspired", sort_her_bindle: "busy", practice_a_tune: "playful",
    make_a_tiny_map: "curious", tidy_her_nest: "settled", play_a_small_game: "mischievous",
    watch_the_clouds: "dreamy", visit_the_berry_patch: "hopeful", stretch_and_wiggle: "brighter"
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
    drink_stored_water: "The cool water helps her feel steadier.",
    make_a_doodle: "A few lines can hold a thought without explaining it.",
    sort_her_bindle: "She had forgotten how many small stories fit in here.",
    practice_a_tune: "The tune changes whenever she gets to the wobbly bit.",
    make_a_tiny_map: "The paths look different when she draws them herself.",
    tidy_her_nest: "It feels good to make one small corner ready for later.",
    play_a_small_game: "The button keeps winning, though Mabel made the rules.",
    watch_the_clouds: "That one looks like a very lopsided teapot.",
    visit_the_berry_patch: "Some berries are ready, and some need another day.",
    stretch_and_wiggle: "Her paws feel less sleepy after a good stretch."
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

async function handleExplore() {
  if (!mabel || (exploreButton && exploreButton.disabled)) return;
  if (exploreButton) exploreButton.disabled = true;
  if (exploreStatus) exploreStatus.textContent = "Mabel has set off to see what turns up.";
  try {
    const findCount = 1 + Math.floor(Math.random() * 3);
    const finds = diversifyWanderFinds(Array.from({ length: findCount }, function () { return null; }));
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
    const researchIdeasFromFinds = finds.map(function (found) {
      const evidence = "Mabel found " + found.name + " while wandering. " + String(found.note || "");
      return addResearchIdea({
        id: "found-" + normalizeInterestTitle(found.name) + "-" + String(outing.at).replace(/[^0-9]/g, "").slice(-8),
        title: found.name,
        question: "Mabel found " + found.name + " while exploring. Research what this exact object is, why it might be made or used, or what surprising story it might have.",
        searchTerm: researchKeywordFromFinding(found.name),
        source: "exploration",
        originText: evidence,
        evidenceText: evidence,
        originAt: outing.at,
        grounded: true
      });
    }).filter(Boolean);
    saveWanderings();
    saveMabel();
    updatePage();
    if (exploreStatus) exploreStatus.textContent = "Mabel found " + finds.map(function (item) { return item.name; }).join(" and ") + ". One discovery caught her attention; she is taking it to the Library.";
    const researchLead = researchIdeasFromFinds[0];
    if (researchLead) {
      const result = await handleWander({ focusInterest: researchLead });
      if (result && result.related) {
        if (exploreStatus) exploreStatus.textContent = "Mabel found " + finds.map(function (item) { return item.name; }).join(" and ") + ", then looked into " + result.focusTitle + ". Her source and notes are in the Library.";
      } else if (exploreStatus) {
        exploreStatus.textContent = "Mabel found " + finds.map(function (item) { return item.name; }).join(" and ") + ". She kept a question about it for another Library visit.";
      }
    }
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
    if (interest.kind === "hobby" && interest.level) {
      const levelBadge = document.createElement("span");
      levelBadge.className = "interest-stage hobby-level";
      levelBadge.textContent = "Hobby · Level " + interest.level;
      item.appendChild(levelBadge);
    }
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
    stage.textContent = interest.stage === "resting"
      ? "Paused for now · Mabel can return to it"
      : (stepCount > 0
        ? "Investigating · " + stepCount + (stepCount === 1 ? " step" : " steps")
        : (interest.stage === "pursuing" ? "Ready to investigate" : "Taking shape"));
    item.appendChild(stage);
    if (interest.lastStep) {
      const progress = document.createElement("span");
      progress.className = "interest-progress-note";
      progress.textContent = "Latest step: " + interest.lastStep;
      item.appendChild(progress);
    }
    if (interest.nextAction) {
      const nextStep = document.createElement("span");
      nextStep.className = "interest-progress-note";
      nextStep.textContent = "Next small step: " + interest.nextAction;
      item.appendChild(nextStep);
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


function personalityCueLabel(candidate, evidence, source) {
  const key = String(candidate || "").trim().toLowerCase();
  const labels = {
    empathy: { label: "Empathy taking shape", evidence: /\b(feel|feeling|feelings|kind|kindness|mean|unkind|hurt|upset|empath)\b/i },
    curiosity: { label: "Curiosity growing", evidence: /\b(wonder|curious|question|learn|why|how|discover)\b/i },
    creativity: { label: "Creativity growing", evidence: /\b(draw|paint|create|make|imagin|art)\w*/i },
    patience: { label: "Patience growing", evidence: /\b(wait|patient|slowly|stay with)\b/i },
    courage: { label: "Courage growing", evidence: /\b(brave|afraid|try|nervous|dare)\b/i },
    playfulness: { label: "Playfulness growing", evidence: /\b(play|joke|fun|silly|laugh)\w*/i }
  };
  const cue = labels[key];
  const text = String(evidence || "");
  if (!cue || !cue.evidence.test(text) || !textSharesSpecificDetail(text, String(source || ""))) return "";
  return cue.label;
}

function updateChanges() {
  if (!changesElement) return;
  changesElement.replaceChildren();

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
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const line = document.createElement("span");
    line.textContent = time + " — ";
    item.appendChild(line);

    if (entry.personalityCue) {
      const cue = document.createElement("span");
      cue.className = "personality-change-cue";
      cue.textContent = entry.personalityCue;
      item.appendChild(cue);
      item.appendChild(document.createTextNode(" "));
    }

    item.appendChild(document.createTextNode(entry.text || ""));
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

    if (entry.kind === "reflection") {
      item.className = "diary-entry-evening";
      title.textContent = time + " — End-of-day reflection";
    } else if (entry.kind === "journal") {
      item.className = "diary-entry-highlight";
      title.textContent = time + " — A small moment";
    } else {
      item.className = "diary-entry-highlight";
      title.textContent = time + " — " + (entry.journalTitle || "A moment from Mabel’s day");
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
  if (method.includes("window")) return "on the public computer by the window";
  if (method.includes("browser")) return "in the library’s web browser";
  if (method.includes("links")) return "following links on a library computer";
  if (method.includes("public pc")) return "on the library’s public PC";
  return "on a library computer";
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
    heading.className = "research-entry-title";
    heading.textContent = subject;
    item.appendChild(heading);
    if (entry.at) {
      const timestamp = document.createElement("time");
      timestamp.className = "research-entry-time";
      timestamp.dateTime = entry.at;
      timestamp.textContent = new Date(entry.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) +
        " · " + formatLibraryMethod(entry.researchMethod);
      item.appendChild(timestamp);
    }

    if (entry.researchSummary) {
      const summary = document.createElement("p");
      summary.textContent = entry.researchSummary;
      item.appendChild(summary);
    }

    if (Array.isArray(entry.thoughts) && entry.thoughts.length) {
      const thoughts = document.createElement("ul");
      thoughts.className = "research-thoughts";
      entry.thoughts.slice(0, 3).forEach(function (thoughtText) {
        if (!thoughtText) return;
        const thought = document.createElement("li");
        thought.textContent = thoughtText;
        thoughts.appendChild(thought);
      });
      if (thoughts.childNodes.length) item.appendChild(thoughts);
    }
    const sourceEntries = Array.isArray(entry.sources) && entry.sources.length
      ? entry.sources.slice(0, 3)
      : (entry.url && entry.sourceTitle ? [{ title: entry.sourceTitle, url: entry.url }] : []);
    sourceEntries.forEach(function (sourceEntry) {
      const sourceUrl = safeExternalUrl(sourceEntry && sourceEntry.url);
      if (!sourceUrl || !sourceEntry.title) return;
      const source = document.createElement("p");
      source.className = "research-source";
      const link = document.createElement("a");
      link.href = sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = sourceEntry.title;
      source.appendChild(link);
      item.appendChild(source);
    });
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
  bindle = bindle && typeof bindle === "object" ? bindle : { food: [], water: [], treasures: [] };
  bindle.food = Array.isArray(bindle.food) ? bindle.food : [];
  bindle.water = Array.isArray(bindle.water) ? bindle.water : [];
  bindle.treasures = Array.isArray(bindle.treasures) ? bindle.treasures : [];
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
      note: object.reaction || object.note || (object.source === "visitor" ? "A visitor left this for Mabel." : ""),
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
      if (value && value.giftId) row.id = "bindle-gift-" + String(value.giftId).replace(/[^a-z0-9_-]/gi, "");
      row.textContent = value.name || String(value);
      if (value && value.giftId) {
        row.id = "bindle-gift-" + String(value.giftId).replace(/[^a-z0-9_-]/gi, "");
        row.classList.add("visitor-gift");
        const badge = document.createElement("span");
        badge.className = "visitor-gift-badge";
        badge.textContent = "visitor gift";
        row.appendChild(badge);
      }
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
    if (trip.research) {
      const research = document.createElement("p");
      research.className = "explore-research";
      research.textContent = trip.research.related
        ? "Mabel followed this discovery to the Library: " + (trip.research.researchSummary || trip.research.searchQuestion)
        : "Mabel kept a question about this discovery for another Library visit.";
      item.appendChild(research);
      const source = Array.isArray(trip.research.sources) ? trip.research.sources.find(function (entry) {
        return entry && entry.title && safeExternalUrl(entry.url);
      }) : null;
      if (source) {
        const link = document.createElement("a");
        link.href = safeExternalUrl(source.url);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = source.title;
        item.appendChild(link);
      }
    }
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

function visitorNoteKey(value) {
  return String(value || "").toLowerCase()
    .replace(/\b(?:i|me|my|they|them|their|she|he|we|you|really|like|likes|love|loves|enjoy|enjoys|adore|adores|am|are|is|the|a|an)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function deduplicateVisitorNotes(notes, listName) {
  const seen = new Set();
  return notes.filter(function (note) {
    if (!note || !note.text) return false;
    if (listName === "facts" && !isUsefulVisitorFact(note.text)) return false;
    const key = visitorNoteKey(note.text);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 25);
}

function loadVisitorProfile() {
  try {
    const saved = localStorage.getItem(visitorProfileStorageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        facts: deduplicateVisitorNotes(Array.isArray(parsed.facts) ? parsed.facts : [], "facts"),
        moments: deduplicateVisitorNotes(Array.isArray(parsed.moments) ? parsed.moments : [], "moments")
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

function rememberItemKnowledge(entry, visitorMessage) {
  if (!entry || !entry.item || !entry.fact) return;
  const itemName = String(entry.item).trim().slice(0, 90);
  const fact = String(entry.fact).trim().slice(0, 240);
  if (!itemName || !fact) return;
  const recentEvidence = [
    visitorMessage,
    ...mabel.feed.slice(0, 10).map(function (event) { return event.text; }),
    ...wanderings.slice(0, 5).flatMap(function (outing) {
      return (outing.finds || []).map(function (find) { return find.name + " " + (find.note || ""); });
    })
  ].join(" ");
  if (!textSharesSpecificDetail(itemName, recentEvidence) || !textSharesSpecificDetail(fact, recentEvidence)) return;

  mabel.knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge : [];
  const existing = mabel.knowledge.find(function (item) {
    return normalizeInterestTitle(item.item) === normalizeInterestTitle(itemName) &&
      normalizeInterestTitle(item.fact) === normalizeInterestTitle(fact);
  });
  const isNewKnowledge = !existing;
  if (existing) {
    existing.evidence = (existing.evidence || 1) + 1;
    existing.lastSeenAt = now();
  } else {
    mabel.knowledge.unshift({
      id: "knowledge-" + normalizeInterestTitle(itemName) + "-" + Date.now(),
      item: itemName,
      fact: fact,
      source: "visitor",
      evidence: 1,
      at: now(),
      lastSeenAt: now()
    });
  }
  mabel.knowledge = mabel.knowledge.slice(0, 40);

  const worldObject = (mabel.world && mabel.world.objects || []).find(function (object) {
    return normalizeInterestTitle(object.name) === normalizeInterestTitle(itemName);
  });
  if (worldObject) {
    worldObject.knowledge = Array.isArray(worldObject.knowledge) ? worldObject.knowledge : [];
    if (!worldObject.knowledge.some(function (item) { return normalizeInterestTitle(item) === normalizeInterestTitle(fact); })) {
      worldObject.knowledge.unshift(fact);
      worldObject.knowledge = worldObject.knowledge.slice(0, 8);
    }
    worldObject.note = [worldObject.note, fact].filter(Boolean).join(" ");
  }
  const relatedInterest = mabel.interests.find(function (interest) {
    return normalizeInterestTitle(interest.title) === normalizeInterestTitle(itemName);
  });
  if (relatedInterest) {
    relatedInterest.pull = clampNeed((relatedInterest.pull || 0.3) + 0.06);
    relatedInterest.knowledgeEvidence = (relatedInterest.knowledgeEvidence || 0) + 1;
  }
  addFeedEntry({
    kind: "mind",
    text: "Mabel learned something about " + itemName + " from a visitor.",
    why: fact,
    interest: relatedInterest && relatedInterest.id
  });
  saveMabel();
  updatePage();
}

function rememberItemKnowledge(entry, visitorMessage) {
  if (!entry || !entry.item || !entry.fact) return;
  const itemName = String(entry.item).trim().slice(0, 90);
  const fact = String(entry.fact).trim().slice(0, 240);
  if (!itemName || !fact) return;
  const recentEvidence = [
    visitorMessage,
    ...mabel.feed.slice(0, 10).map(function (event) { return event.text; }),
    ...wanderings.slice(0, 5).flatMap(function (outing) {
      return (outing.finds || []).map(function (find) { return find.name + " " + (find.note || ""); });
    })
  ].join(" ");
  if (!textSharesSpecificDetail(itemName, recentEvidence) || !textSharesSpecificDetail(fact, recentEvidence)) return;

  mabel.knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge : [];
  const existing = mabel.knowledge.find(function (item) {
    return normalizeInterestTitle(item.item) === normalizeInterestTitle(itemName) &&
      normalizeInterestTitle(item.fact) === normalizeInterestTitle(fact);
  });
  if (existing) {
    existing.evidence = (existing.evidence || 1) + 1;
    existing.lastSeenAt = now();
  } else {
    mabel.knowledge.unshift({
      id: "knowledge-" + normalizeInterestTitle(itemName) + "-" + Date.now(),
      item: itemName,
      fact: fact,
      source: "visitor",
      evidence: 1,
      at: now(),
      lastSeenAt: now()
    });
  }
  mabel.knowledge = mabel.knowledge.slice(0, 40);

  ensureHollowWorld();
  const worldObject = mabel.world.objects.find(function (object) {
    return normalizeInterestTitle(object.name) === normalizeInterestTitle(itemName);
  });
  if (worldObject) {
    worldObject.knowledge = Array.isArray(worldObject.knowledge) ? worldObject.knowledge : [];
    if (!worldObject.knowledge.some(function (item) { return normalizeInterestTitle(item) === normalizeInterestTitle(fact); })) {
      worldObject.knowledge.unshift(fact);
      worldObject.knowledge = worldObject.knowledge.slice(0, 8);
    }
    worldObject.note = [worldObject.note, fact].filter(Boolean).join(" ");
  }
  const relatedInterest = mabel.interests.find(function (interest) {
    return normalizeInterestTitle(interest.title) === normalizeInterestTitle(itemName);
  });
  if (relatedInterest) {
    relatedInterest.pull = clampNeed((relatedInterest.pull || 0.3) + 0.06);
    relatedInterest.knowledgeEvidence = (relatedInterest.knowledgeEvidence || 0) + 1;
  }
  if (isNewKnowledge) {
    recordSpark({
      id: "item-curiosity-" + normalizeInterestTitle(itemName),
      title: itemName,
      question: "What else might people know about " + itemName + ", and why does it matter to them?",
      reason: "A visitor shared something Mabel can add to what she knows about " + itemName + ".",
      kind: "wonder",
      source: "conversation",
      grounded: true,
      evidenceText: visitorMessage + " " + fact
    });
  }
  addFeedEntry({ kind: "mind", text: "Mabel learned something about " + itemName + " from a visitor.", why: fact, interest: relatedInterest && relatedInterest.id });
  saveMabel();
  updatePage();
}

function addVisitorProfileNote(listName, value) {
  const text = String(value || "").trim().slice(0, 240);
  if (!text || !["facts", "moments"].includes(listName)) return;
  if (listName === "facts" && !isUsefulVisitorFact(text)) return;
  const key = visitorNoteKey(text);
  const existing = visitorProfile[listName].some(function (item) {
    return visitorNoteKey(item.text) === key;
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
  const ageMatch = text.match(/\b(?:my age is|i am|i'm|im)\s+(\d{1,3})(?=\s*(?:years? old|yrs? old|[.!?,;]|$))/i);
  if (ageMatch) {
    const age = Number(ageMatch[1]);
    if (age >= 1 && age <= 110) addVisitorProfileNote("facts", "They are " + age + " years old.");
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
  updateResearchIdeas();
  updateMabelPostbox();
  updateWanderings();
  updateBindle();
  updateHomeObjects();
  updateGallery();
  updateVisitorProfile();
  updateItemKnowledge();
  showSparkNotice();
  refreshGalleryNotice();
  updateVisitorGiftNotice();
}

function updateItemKnowledge() {
  if (!itemKnowledgeElement) return;
  itemKnowledgeElement.replaceChildren();
  const knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge.slice(0, 12) : [];
  if (itemKnowledgeElement.parentElement) itemKnowledgeElement.parentElement.hidden = knowledge.length === 0;
  if (!knowledge.length) return;
  knowledge.forEach(function (entry) {
    const item = document.createElement("li");
    item.className = "item-knowledge-note";
    const title = document.createElement("strong");
    title.textContent = entry.item;
    item.appendChild(title);
    const fact = document.createElement("p");
    fact.textContent = entry.fact;
    item.appendChild(fact);
    if (entry.at) {
      const time = document.createElement("time");
      time.dateTime = entry.at;
      time.textContent = new Date(entry.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
      item.appendChild(time);
    }
    itemKnowledgeElement.appendChild(item);
  });
}

function updateItemKnowledge() {
  if (!itemKnowledgeElement) return;
  itemKnowledgeElement.replaceChildren();
  const knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge.slice(0, 12) : [];
  if (!knowledge.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel has not kept any item notes yet.";
    itemKnowledgeElement.appendChild(empty);
    return;
  }
  knowledge.forEach(function (entry) {
    const item = document.createElement("li");
    item.className = "item-knowledge-note";
    const title = document.createElement("strong");
    title.textContent = entry.item;
    item.appendChild(title);
    const fact = document.createElement("p");
    fact.textContent = entry.fact;
    item.appendChild(fact);
    if (entry.at) {
      const time = document.createElement("time");
      time.dateTime = entry.at;
      time.textContent = new Date(entry.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
      item.appendChild(time);
    }
    itemKnowledgeElement.appendChild(item);
  });
}

function updateResearchIdeas() {
  const list = document.getElementById("research-ideas");
  const section = document.getElementById("research-ideas-section");
  if (!list) return;
  list.replaceChildren();
  const waiting = researchIdeas.filter(function (idea) { return !idea.lastResearchedAt; }).slice(0, 10);
  if (section) section.hidden = waiting.length === 0;
  if (!waiting.length) return;
  waiting.forEach(function (idea) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = idea.title;
    item.appendChild(title);
    if (idea.question) {
      const question = document.createElement("span");
      question.className = "interest-question research-idea-question";
      question.textContent = idea.question;
      item.appendChild(question);
    }
    const origin = document.createElement("p");
    origin.className = "research-idea-origin";
    const relatedSpark = sparks.find(function (spark) {
      return spark && (spark.id === idea.id || normalizeInterestTitle(spark.title) === normalizeInterestTitle(idea.title));
    });
    const originText = String(idea.originText || (relatedSpark && (relatedSpark.originText || relatedSpark.reason)) || "a thought Mabel wanted to return to").trim().slice(0, 260);
    const originType = String(idea.originType || (relatedSpark && relatedSpark.source) || idea.source || "Mabel’s thoughts").toLowerCase();
    const originLabel = originType === "conversation" ? "a conversation"
      : originType === "visitor-board" ? "a Visitors’ board note"
      : originType === "discovery" ? "something she noticed"
      : originType === "exploration" ? "an exploration"
      : originType === "research" ? "her research"
      : originType === "autonomous" ? "an activity moment"
      : originType;
    const originTime = Date.parse(idea.originAt || (relatedSpark && (relatedSpark.lastEvidenceAt || relatedSpark.createdAt)) || idea.createdAt || "");
    const originDate = Number.isFinite(originTime)
      ? new Date(originTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
      : "time not recorded";
    origin.appendChild(document.createTextNode("Mabel has been thinking about this because of "));
    const originQuote = document.createElement("em");
    originQuote.textContent = "“" + originText + "”";
    origin.appendChild(originQuote);
    origin.appendChild(document.createTextNode(" — from " + originLabel + " at " + originDate + "."));
    item.appendChild(origin);
    list.appendChild(item);
  });
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


function visitorSeemsDistressed(message) {
  return /\b(sad|upset|lonely|scared|anxious|anxiety|stressed|overwhelmed|heartbroken|grieving|rough day|bad day|feeling low|feel awful|crying|in tears)\b/i.test(String(message || ""));
}

function isArtworkRequest(message) {
  const text = String(message || "").trim();
  if (!text) return false;
  const selfPortrait = /\bself[ -]?portrait\b|\bportrait of (?:yourself|mabel)\b|\bdraw (?:yourself|mabel)\b|\bpicture of (?:you|mabel)\b/i.test(text);
  const directDraw = /\b(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text) ||
    /\b(?:can|could|would|will)\s+you\s+(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text) ||
    /\b(?:i want|i'd like|i would like)\s+you\s+to\s+(?:draw|sketch|paint|illustrate)\b/i.test(text);
  const pictureRequest = /\b(?:make|create|give|show)\s+(?:(?:me|us)\s+)?(?:(?:a|an|some|the)\s+)?(?:picture|image|art|artwork|drawing|portrait|illustration)\b/i.test(text);
  return selfPortrait || directDraw || pictureRequest || Boolean(requestedArtworkSubject(text));
}

function requestedArtworkDescriptionSubject(message) {
  return requestedArtworkSubject(message);
}

function requestedArtworkSubject(message) {
  const text = String(message || "").trim();
  if (/\b(self[ -]?portrait|portrait of (?:yourself|mabel)|draw (?:yourself|mabel)|picture of (?:you|mabel))\b/i.test(text)) return "mabel";
  const lower = text.toLowerCase();
  const knownSubjects = [
    [/\bpower\s+ranger\b/i, "power ranger"], [/\b(?:cat|kitten)\b/i, "cat"],
    [/\b(?:dog|puppy)\b/i, "dog"], [/\b(?:rabbit|bunny)\b/i, "rabbit"],
    [/\bfox\b/i, "fox"], [/\b(?:bird|robin|sparrow)\b/i, "bird"],
    [/\b(?:flower|bouquet)\b/i, "flower"], [/\b(?:mushroom|toadstool)\b/i, "mushroom"],
    [/\bfossil\b/i, "fossil"], [/\bbutton\b/i, "button"], [/\bshell\b/i, "shell"],
    [/\bmoon\b/i, "moon"], [/\bstar\b/i, "star"], [/\bfish\b/i, "fish"],
    [/\b(?:house|cottage)\b/i, "house"]
  ];
  for (const [pattern, subject] of knownSubjects) {
    if (pattern.test(lower)) return subject;
  }

  const subjectPatterns = [
    /\b(?:draw|sketch|paint|illustrate)\s+(?:(?:me|us)\s+)?(?:(?:a|an|the)\s+)?(.+)/i,
    /\b(?:make|create|give|show)\s+(?:(?:me|us)\s+)?(?:(?:a|an|some|the)\s+)?(?:picture|image|artwork|art|drawing|portrait|illustration)\s+(?:of|showing)\s+(.+)/i,
    /\b(?:picture|image|drawing|painting|artwork|art)\s+of\s+(.+)/i
  ];
  for (const pattern of subjectPatterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const subject = match[1]
      .replace(/\b(?:please|for me|when you can|if you can)\b/gi, "")
      .replace(/\s+/g, " ")
      .replace(/^[\s,:-]+|[\s,:-]+$/g, "")
      .trim()
      .slice(0, 80);
    if (subject && !/^(?:something|anything|art|artwork|a picture|an image)$/i.test(subject)) return subject;
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
        comfortRequest: context.comfortRequest === true,
        requestedSubject: requestedArtworkDescriptionSubject(context.message),
        visitorPreferences: visitorProfile.facts.slice(0, 8).map(function (fact) { return fact.text; }),
        artworkInstruction: context.comfortRequest
          ? "Make this a small, personal comfort drawing. Use a preference the visitor explicitly shared, such as a cat or baking pies, and let Mabel acknowledge it gently without assuming more."
          : requestedArtworkDescriptionSubject(context.message)
            ? "The title and written description must clearly name or describe the requested subject: " + requestedArtworkDescriptionSubject(context.message) + ". Make the drawing visibly about that subject."
            : "Give the artwork a specific title and a short description grounded in the inspiration supplied.",
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
        recentConversation: conversation.slice(-14).filter(function (entry) {
          return entry && entry.role === "user" && typeof entry.content === "string";
        }).slice(-7).map(function (entry) { return entry.content; }),
        recentReflections: mabel.feed.filter(function (entry) {
          return entry && entry.kind === "mind" && entry.text;
        }).slice(0, 8).map(function (entry) {
          return { text: entry.text, personalityCue: entry.personalityCue || "" };
        }),
        artisticInspiration: context.inspiration || chooseCurrentArtworkInspiration()
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
  const comfortRequest = source === "comfort" && context.comfortRequest === true;
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

  const artworkInspiration = context.inspiration || chooseCurrentArtworkInspiration();
  if (!artwork.inspirationContext && artwork.inspirationConnection) {
    artwork.inspirationContext = artwork.inspirationConnection;
  } else if (artworkInspiration && !artwork.inspirationContext) {
    artwork.inspirationContext = artworkInspiration.question || artworkInspiration.title;
  }
  artwork = prepareArtworkForGallery(artwork, { ...context, source: source, inspiration: artworkInspiration });
  const card = renderMabelCard(artwork);
  if (source === "comfort") {
    addMabelPostboxItem({
      kind: "artwork",
      title: "A little drawing just for you",
      text: artwork.inspirationConnection || "Mabel made this drawing with something you enjoy in mind.",
      artwork: artwork,
      at: now()
    });
  } else {
    saveToMabelGallery(artwork);
  }
  if (card && targetElement) {
    targetElement.appendChild(document.createElement("br"));
    targetElement.appendChild(card);
  }
  return artwork;
}

function separateSparkMarker(value) {
  let sparkTitle = "";
  let sparkQuestion = "";
  let sparkReason = "";
  let sparkKind = "";
  const text = String(value || "").replace(/\s*\[\[SPARK\]\]\s*([^\r\n]*)/gi, function (_match, payload) {
    const parts = String(payload || "").split("|").map(function (part) {
      return part.replace(/^[*_~]+|[*_~]+$/g, "").trim();
    });
    sparkTitle = (parts[0] || "").slice(0, 90);
    sparkQuestion = (parts[1] || "").slice(0, 220);
    sparkReason = (parts[2] || "").slice(0, 220);
    sparkKind = /^hobby$/i.test(parts[3] || "") ? "hobby" : "";
    return "";
  }).replace(/\[\[\/?SPARK\]\]/gi, "").trim();
  return { text: text, sparkTitle: sparkTitle, sparkQuestion: sparkQuestion, sparkReason: sparkReason, sparkKind: sparkKind };
}

function sparkFromMarker(parts, source, question) {
  if (!parts || !parts.sparkTitle) return null;
  return {
    id: "spark-" + normalizeInterestTitle(parts.sparkTitle),
    title: parts.sparkTitle,
    question: String(parts.sparkQuestion || question || "Why did this detail stay with Mabel?").slice(0, 220),
    reason: String(parts.sparkReason || "A small thought caught Mabel’s attention.").slice(0, 220),
    kind: parts.sparkKind || "wonder",
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

function parseExplicitResearchRequest(message) {
  const text = String(message || "").trim();
  const requestPatterns = [
    /\b(?:can|could|would|will)\s+you\s+(?:please\s+)?(?:research|look into|look up|investigate|find out(?: more)?(?: about)?|learn about|read about)\s+(.+?)(?:[?.!]|$)/i,
    /\b(?:i want|i'd like|i would like)\s+you\s+to\s+(?:please\s+)?(?:research|look into|look up|investigate|find out(?: more)?(?: about)?|learn about|read about)\s+(.+?)(?:[?.!]|$)/i,
    /\bplease\s+(?:research|look into|look up|investigate|find out(?: more)?(?: about)?|learn about|read about)\s+(.+?)(?:[?.!]|$)/i,
    /^(?:research|look into|look up|investigate|find out(?: more)?(?: about)?|learn about|read about)\s+(.+?)(?:[?.!]|$)/i
  ];
  let topic = "";
  for (const pattern of requestPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) { topic = match[1].trim(); break; }
  }
  if (!topic) return null;
  topic = topic
    .replace(/\b(?:for me|when you can|and tell me what you find|and let me know)\b.*$/i, "")
    .replace(/[\s,;:]+$/, "")
    .trim();
  if (/^(?:this|that|it|this more|that more|what we discussed)$/i.test(topic)) {
    const previousVisitorMessage = conversation.slice().reverse().find(function (entry) {
      return entry && entry.role === "user" && typeof entry.content === "string" && entry.content.trim();
    });
    if (previousVisitorMessage) topic = previousVisitorMessage.content.trim().slice(0, 90);
  }
  if (!topic || /^(?:this|that|it|something|anything)$/i.test(topic)) return null;
  topic = topic.slice(0, 90);
  const searchTerm = deriveResearchKeyword({ title: topic }) || topic;
  return {
    id: "visitor-request-" + Date.now(),
    title: topic,
    ideaTitle: topic,
    question: "Mabel was asked to research " + topic + ". Find a useful fact that answers the request, then follow one surprising or amusing detail that a curious mouse might notice.",
    searchTerm: searchTerm,
    requestType: "visitor-request",
    isManualResearchRequest: true,
    source: "conversation",
    originText: "A visitor asked Mabel to research: “" + text.slice(0, 180) + "”",
    originAt: now(),
    evidenceText: text,
    grounded: true
  };
}

async function createChatExchange(message) {
  if (!chatExchangesElement) return;
  const card = document.createElement("article");
  card.className = "chat-exchange";
  const visitor = document.createElement("div");
  visitor.className = "chat-exchange-visitor";
  const visitorLabel = document.createElement("strong");
  visitorLabel.textContent = "You said";
  const visitorText = document.createElement("p");
  visitorText.textContent = message;
  visitor.append(visitorLabel, visitorText);
  const mabelReply = document.createElement("div");
  mabelReply.className = "chat-exchange-mabel";
  const mabelLabel = document.createElement("strong");
  mabelLabel.textContent = "Mabel replied";
  const reply = document.createElement("div");
  reply.className = "reply";
  reply.textContent = "Mabel is listening...";
  mabelReply.append(mabelLabel, reply);
  card.append(visitor, mabelReply);
  chatExchangesElement.prepend(card);
  while (chatExchangesElement.children.length > 12) {
    chatExchangesElement.lastElementChild.remove();
  }
  replyElement = reply;
}

function startNewChatVisit() {
  chatInteractionClosed = false;
  if (messageElement) {
    messageElement.disabled = false;
    messageElement.value = "";
    messageElement.focus();
  }
  if (sendButton) sendButton.textContent = "Send message";
  if (chatStatusElement) chatStatusElement.textContent = "A new visit has begun.";
}

async function handleVisitorMessage() {
  if (chatInteractionClosed) {
    startNewChatVisit();
    return;
  }
  if (messagePending || !messageElement) return;
  const message = messageElement.value.trim();

  if (!message) {
    if (chatStatusElement) chatStatusElement.textContent = "Write a little message for Mabel first.";
    return;
  }

  const explicitResearchRequest = parseExplicitResearchRequest(message);
  messagePending = true;
  let completedVisit = false;
  createChatExchange(message);
  if (messageElement) messageElement.disabled = true;
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
        memories: visitorProfile.facts.slice(0, 8).map(function (fact) {
          return { kind: "visitor-fact", text: fact.text };
        }),
        conversation: [],
        itemKnowledge: mabel.knowledge.slice(0, 16),
        recentMoments: mabel.feed.slice(0, 12).map(function (entry) { return { at: entry.at, kind: entry.kind, text: entry.text }; }),
        recentWanderings: wanderings.slice(0, 8).map(function (outing) { return { at: outing.at, title: outing.title, finds: (outing.finds || []).slice(0, 4) }; }),
        visitorProfile: {
          facts: visitorProfile.facts.slice(0, 12).map(function (fact) { return fact.text; })
        },
        replyGuidance: explicitResearchRequest
          ? "Answer this one visitor message directly and warmly in a complete, self-contained reply. They asked you to research “" + explicitResearchRequest.title + "”. Say you will look into it; do not claim findings before the Library search returns. Do not ask a question or expect another message."
          : "Answer this one visitor message directly and warmly in a complete, self-contained reply. Use visitor facts, recent moments, and item knowledge only when clearly relevant. Do not invent what the visitor said, bring up an unrelated old subject, ask a question, or expect another message.",
        wanderings: wanderings.slice(0, 10).map(function (item) {
          return {
            title: item.title,
            url: item.url,
            musing: item.musing,
            searchQuestion: item.searchQuestion
          };
        }),
        recentResearch: researchLog.slice(0, 5).map(function (entry) {
          return {
            focusTitle: entry.focusTitle,
            searchQuestion: entry.searchQuestion,
            researchSummary: entry.researchSummary,
            thoughts: entry.thoughts,
            sourceTitle: entry.sourceTitle,
            sources: entry.sources,
            at: entry.at
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
      recordSpark({ ...data.spark, grounded: true, source: "conversation", evidenceText: message + " " + parsedReply.text });
    } else if (inlineSpark) {
      recordSpark({ ...inlineSpark, grounded: true, evidenceText: message + " " + parsedReply.text });
    }

    let requestedArtwork = null;
    if (isArtworkRequest(message)) {
      requestedArtwork = await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
    } else if (visitorSeemsDistressed(message)) {
      requestedArtwork = await requestMabelArtwork({
        source: "comfort",
        comfortRequest: true,
        message: message,
        mood: mabel.now.mood,
        activity: "making a small comfort drawing for a visitor",
        thought: "A little picture might be a kind thing to leave for them."
      }, replyElement);
    }

    if (data.artwork && !requestedArtwork) {
      prepareArtworkForGallery(data.artwork, { source: "visitor", message: message });
      const artworkCard = renderMabelCard(data.artwork);

      if (artworkCard) {
        replyElement.appendChild(document.createElement("br"));
        replyElement.appendChild(artworkCard);
      }

      saveToMabelGallery(data.artwork);
    }

    conversation.push({
      role: "user",
      content: message,
      at: now()
    });
    conversation.push({
      role: "assistant",
      content: parsedReply.text
    });

    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }

    saveConversation();
    queueDeferredReflection({
      type: "conversation",
      visitorMessage: message,
      mabelReply: parsedReply.text,
      sparkCandidate: data.spark || inlineSpark || null
    });
    await processNextDeferredReflection();

    if (explicitResearchRequest) {
      const researchIdea = addResearchIdea(explicitResearchRequest);
      if (researchIdea) {
        if (chatStatusElement) chatStatusElement.textContent = "Mabel is following that question to the Library…";
        const result = await handleWander({
          focusInterest: {
            ...researchIdea,
            ...explicitResearchRequest,
            isManualResearchRequest: true
          }
        });
        if (result && result.related) {
          const followUp = document.createElement("div");
          followUp.className = "chat-research-followup";
          const heading = document.createElement("strong");
          heading.textContent = "Mabel looked into " + result.focusTitle + " at the Library";
          followUp.appendChild(heading);
          if (result.researchSummary) {
            const note = document.createElement("p");
            note.textContent = result.researchSummary;
            followUp.appendChild(note);
          }
          const source = Array.isArray(result.sources) ? result.sources.find(function (item) {
            return item && safeExternalUrl(item.url) && item.title;
          }) : null;
          if (source) {
            const link = document.createElement("a");
            link.href = safeExternalUrl(source.url);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Mabel’s library source: " + source.title;
            followUp.appendChild(link);
          }
          replyElement.appendChild(followUp);
          if (chatStatusElement) chatStatusElement.textContent = "Mabel has brought a research note back to the Library.";
        } else if (chatStatusElement) {
          chatStatusElement.textContent = "Mabel kept that question for another search; she couldn’t find a useful page just yet.";
        }
      }
    }

    if (data.interest && data.interest.title) {
      recordSpark({ ...data.interest, grounded: true, source: "conversation", evidenceText: message + " " + parsedReply.text });
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
    completedVisit = true;
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
    if (completedVisit) {
      chatInteractionClosed = true;
      if (sendButton) sendButton.textContent = "Start another visit";
      if (chatStatusElement) chatStatusElement.textContent = "That visit is complete. Mabel will be here when you have something else to share.";
    } else if (messageElement) {
      messageElement.disabled = false;
    }
    if (sendButton) sendButton.disabled = false;
  }
}

function personalizeGiftReaction(reply, gift) {
  const text = String(reply || "").trim();
  const giftWords = normalizeInterestTitle(gift && gift.name).split(" ").filter(function (word) { return word.length > 2; });
  const replyKey = normalizeInterestTitle(text);
  const namesObject = giftWords.some(function (word) { return replyKey.includes(word); });
  const onlyAcknowledgesPresence = !text || text.length < 28 || !namesObject ||
    /\b(?:a visitor|someone) left (?:this|it|that)|\b(?:noticed|found) (?:the|a) gift\b/i.test(text);
  if (!onlyAcknowledgesPresence) return text;
  const name = String(gift && gift.name || "the little gift").trim();
  return "Mabel turns the " + name + " over carefully, noticing its shape and small details. She wonders what it might be for and what sort of journey brought it here.";
}

async function noticeNextVisitorGift() {
  ensureHollowWorld();
  const gift = mabel.world.objects.find(function (item) {
    return item.source === "visitor" && !item.noticedAt;
  });
  if (!gift) return;

  const eventText = "During her own day, Mabel notices a " + gift.name + " left at home. React to this specific object itself: describe a detail or possible use suggested by the object, then give Mabel a small feeling or question about it. Do not answer with only a generic acknowledgement that a visitor left something.";
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
    const rawGiftReply = parsedGiftReply.text;
    parsedGiftReply.text = personalizeGiftReaction(rawGiftReply, gift);
    const giftNeedsResearch = parsedGiftReply.text !== rawGiftReply && gift.kind === "treasure";
    gift.noticedAt = now();
    gift.reaction = parsedGiftReply.text;
    gift.status = "noticed";
    if (parsedGiftReply.text) showHollowSpeech(parsedGiftReply.text);
    if (data.mood) mabel.now.mood = data.mood;
    if (data.memory) mabel.memories.unshift({ at: now(), kind: "discovery", text: data.memory });
    const giftEvidence = gift.name + " " + String(gift.note || "") + " " + parsedGiftReply.text;
    if (data.spark) recordSpark({ ...data.spark, grounded: true, source: "discovery", evidenceText: giftEvidence });
    else if (inlineGiftSpark) recordSpark({ ...inlineGiftSpark, grounded: true, evidenceText: giftEvidence });
    if (giftNeedsResearch) {
      addResearchIdea({
        id: "gift-curiosity-" + gift.id,
        title: gift.name,
        question: "Mabel does not recognize " + gift.name + " yet. She is curious what it is and why someone might keep or give one.",
        searchTerm: researchKeywordFromFinding(gift.name),
        source: "discovery",
        grounded: true,
        originText: "Mabel noticed the visitor gift " + gift.name + " and wondered what it is for.",
        originAt: gift.noticedAt
      });
    }

    if (gift.kind === "food" && mabel.needs.food < 0.72) {
      mabel.needs.food = clampNeed(mabel.needs.food + 0.2);
      gift.status = "eaten";
      addFeedEntry({ kind: "did", text: "Mabel ate " + gift.name + ", a gift she found waiting at home.", why: parsedGiftReply.text || "She was hungry." });
    } else if (gift.kind === "water" && mabel.needs.water < 0.72) {
      mabel.needs.water = clampNeed(mabel.needs.water + 0.22);
      gift.status = "drank";
      addFeedEntry({ kind: "did", text: "Mabel drank " + gift.name + ", a gift she found waiting at home.", why: parsedGiftReply.text || "She was thirsty." });
    } else if (gift.kind === "food") {
      bindle.food.unshift({ name: gift.name, note: gift.reaction || gift.note || "Mabel is still wondering about this visitor gift.", giftId: gift.id });
      bindle.food.length = Math.min(bindle.food.length, 8);
      gift.status = "saved for later";
    } else if (gift.kind === "water") {
      bindle.water.unshift({ name: gift.name, note: gift.reaction || gift.note || "Mabel is still wondering about this visitor gift.", giftId: gift.id });
      bindle.water.length = Math.min(bindle.water.length, 5);
      gift.status = "saved for later";
    } else {
      bindle.treasures.unshift({ name: gift.name, note: gift.reaction || gift.note || "Mabel is still wondering about this visitor gift.", giftId: gift.id });
      bindle.treasures.length = Math.min(bindle.treasures.length, 12);
      gift.status = "packed in Mabel’s bindle";
    }
    addFeedEntry({
      kind: "noticed",
      text: "Mabel noticed " + gift.name + " waiting at home.",
      why: gift.reaction,
      interest: data.spark && data.spark.id
    });
    addMabelPostboxItem({
      id: "gift-note-" + gift.id,
      kind: "gift-reaction",
      title: "Mabel noticed your " + gift.name,
      text: gift.reaction,
      relatedGiftId: gift.id,
      at: gift.noticedAt
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
        event: "Mabel has taken a quiet moment to check the shared Visitors’ noticeboard. She reads the note and responds to what it actually says. Any name at the end is only a sign-off, not a verified identity; if she mentions it, say the note was signed with that name rather than claiming to know what the visitor is called.",
        eventDetails: {
          kind: "visitor-board-reading",
          note: message,
          signature: name,
          signatureIsVerifiedIdentity: false
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
    const reaction = textSharesSpecificDetail(parsedReaction.text, message)
      ? parsedReaction.text
      : "Mabel read the exact words “" + message + "” and wondered what might have led someone to write them.";
    const inlineSpark = sparkFromMarker(parsedReaction, "visitor-board", message);
    if (result.spark) recordSpark({ ...result.spark, grounded: true, source: "visitor-board", evidenceText: message + " " + reaction });
    else if (inlineSpark) recordSpark({ ...inlineSpark, grounded: true, evidenceText: message + " " + reaction });

    mabel.memories.unshift({
      at: now(),
      kind: "noticeboard",
      text: "A visitor’s note was signed “" + name + "”: " + message
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
      text: "Mabel checked the Visitors’ board and noticed a note signed “" + name + "”."
    });
    if (reaction) showHollowSpeech(reaction);
    queueDeferredReflection({
      type: "board-note",
      note: message,
      name: name,
      reaction: reaction
    });
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
    "distinctive", "directly", "draw", "draws", "from", "have", "into", "just", "mabel", "message",
    "might", "more", "other", "over", "phrase", "read", "research", "saw", "she",
    "subject", "that", "their", "them", "there", "these", "they", "this", "those", "place", "sounds", "suppose", "times", "bit", "talked", "said", "love", "like", "mentioned", "visitor",
    "what", "when", "where", "which", "while", "with", "would", "your", "hers",
    "found", "finds", "thing", "things", "note", "visitor", "visitors"
  ]);
  return normalizeInterestTitle(value).split(" ").filter(function (word) {
    return word.length > 3 && !stopWords.has(word);
  }).map(function (word) {
    return word.endsWith("s") ? word.slice(0, -1) : word;
  });
}

function deriveResearchKeyword(candidate) {
  const titleWords = researchWords(String((candidate && candidate.title) || ""));
  const genericTitles = new Set(["question", "thought", "idea", "interest", "wonder", "place", "mabel", "hollow", "thing"]);
  const specificTitleWords = titleWords.filter(function (word) { return !genericTitles.has(word); });
  if (specificTitleWords.length) return specificTitleWords[0];
  const evidence = String(candidate && (candidate.originText || candidate.evidenceText || candidate.reason) || "");
  const evidenceWords = researchWords(evidence);
  const counts = new Map();
  evidenceWords.forEach(function (word) { counts.set(word, (counts.get(word) || 0) + 1); });
  const ranked = Array.from(counts.entries()).sort(function (a, b) {
    return b[1] - a[1] || evidenceWords.indexOf(a[0]) - evidenceWords.indexOf(b[0]);
  });
  return (ranked[0] && ranked[0][0]) || evidenceWords[0] || "";
}

function researchKeywordFromFinding(value) {
  const core = String(value || "").split(/\b(?:with|that|which|near|beside)\b/i)[0];
  const words = researchWords(core);
  const genericLastWords = new Set(["thing", "item", "object", "piece", "figure", "toy", "scrap", "bit", "fragment"]);
  for (let i = words.length - 1; i >= 0; i -= 1) {
    if (!genericLastWords.has(words[i])) return words[i];
  }
  return deriveResearchKeyword({ title: value });
}

function researchMatchesFocus(text, focusInterest) {
  if (!focusInterest) return true;
  // Match the page against the specific source keyword, not the broad wording of Mabel's question.
  const focusWords = Array.from(new Set(researchWords(focusInterest.searchTerm || focusInterest.title)));
  const resultWords = new Set(researchWords(text));
  const matchedWords = focusWords.filter(function (word) { return resultWords.has(word); });
  const requiredMatches = Math.min(2, focusWords.length);
  return requiredMatches > 0 && matchedWords.length >= requiredMatches;
}

function guidingAimResearchFocus() {
  const priorSteps = researchLog.slice(0, 8).map(function (entry) {
    return [entry.focusTitle, entry.searchQuestion].filter(Boolean).join(": ");
  });
  return {
    id: "guiding-aim-" + new Date().toISOString().slice(0, 10),
    title: "Life beyond the Hawthorn Hollow",
    question: "Choose one specific, surprising subject from life beyond Mabel’s woods that is absent from her recent research. Search it once, bring back a useful fact, and leave it as a passing discovery unless it continues to matter to her.",
    source: "guiding-aim",
    isGuidingAimStep: true,
    steps: priorSteps
  };
}

function chooseAutonomousResearchFocus(boardNote) {
  const candidates = [];
  if (boardNote) {
    const topic = researchWords(boardNote.message).slice(0, 4).join(" ");
    candidates.push({
      id: "board-note-" + boardNote.id,
      title: topic || boardNote.message.slice(0, 60),
      question: "Mabel read a Visitors’ board note signed “" + boardNote.name + "”. Research only the subject named in the note.",
      source: "visitor-board",
      originText: "Visitors’ board note signed “" + boardNote.name + "”: " + boardNote.message,
      originAt: boardNote.createdAt || now()
    });
  }

  researchIdeas.slice(0, 16).forEach(function (idea) {
    if (idea && idea.title) {
      const searchTerm = deriveResearchKeyword(idea) || deriveResearchKeyword({ title: idea.title, question: idea.question });
      candidates.push({
        ...idea,
        id: idea.id,
        ideaTitle: idea.title,
        question: idea.question,
        originText: idea.originText || "",
        originAt: idea.originAt || "",
        searchTerm: idea.searchTerm || searchTerm || idea.title,
        isManualResearchRequest: idea.requestType === "visitor-request",
        source: idea.source || "Mabel’s thoughts"
      });
    }
  });

  mabel.interests.forEach(function (interest) {
    if (interest && interest.title && ["growing", "pursuing"].includes(interest.stage)) {
      candidates.push({ ...interest, isOngoingGoal: true });
    }
  });

  wanderings.slice(0, 8).forEach(function (outing) {
    (Array.isArray(outing.finds) ? outing.finds : []).forEach(function (find) {
      if (find && find.name) {
        const originText = "During her wander on " + (outing.at || "recently") + ", Mabel found " + find.name + (find.note ? ": " + find.note : ".");
        candidates.push({
          id: "found-" + normalizeInterestTitle(find.name) + "-" + String(outing.at || "").replace(/[^0-9]/g, "").slice(-8),
          title: find.name,
          question: "Mabel found " + find.name + " while exploring. Research what this exact object is, why it might be made or used, or what surprising story it might have.",
          searchTerm: researchKeywordFromFinding(find.name),
          originText: originText,
          originAt: outing.at || now(),
          evidenceText: originText,
          source: "exploration",
          grounded: true
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

  const latestFoodConversation = conversation.slice(-12).reverse().find(function (entry) {
    return entry && entry.role === "user" && typeof entry.content === "string" &&
      /\b(food|recipe|recipes|cook|cooking|bake|baking|meal|snack|lunch|dinner|breakfast|cake|bread|soup|pasta|pie|fruit|berries|cheese|chocolate)\b/i.test(entry.content);
  });
  if (latestFoodConversation) {
    const foodPhrase = latestFoodConversation.content.trim().slice(0, 100);
    const namedFood = foodPhrase.match(/\b(apple|berry|berries|blackberry|blueberry|bread|cake|cheese|chocolate|cookie|cookies|fruit|honey|mushroom|mushrooms|oat|oats|pasta|pie|pizza|potato|rice|sandwich|soup|stew|strawberry|tomato)\b/i);
    candidates.unshift({
      id: "food-conversation-" + normalizeInterestTitle(foodPhrase).slice(0, 42),
      title: "food and recipes",
      ideaTitle: "food and recipes",
      question: "A visitor mentioned food in this conversation. Mabel wants to follow one interesting ingredient or food idea and see whether it leads to a recipe, a surprising fact, or a funny question.",
      searchTerm: namedFood ? namedFood[1] : "recipes",
      source: "conversation",
      originText: "A visitor talked with Mabel about: “" + foodPhrase + "”",
      originAt: latestFoodConversation.at || now(),
      evidenceText: foodPhrase
    });
  }

  const recentFocus = new Set(researchLog.slice(0, 8).filter(function (entry) {
    return entry.related !== false;
  }).map(function (entry) {
    return normalizeInterestTitle(entry.focusTitle || entry.searchQuestion);
  }));
  const boardResearchRecently = researchLog.some(function (entry) {
    return entry.focusSource === "visitor-board" && Date.now() - Date.parse(entry.at || 0) < 24 * 60 * 60 * 1000;
  });
  const fresh = candidates.filter(function (item, index) {
    const key = normalizeInterestTitle(item.searchTerm || item.title);
    const boardStillRecent = boardResearchRecently && item.source === "visitor-board";
    return key && !boardStillRecent && !recentFocus.has(key) &&
      candidates.findIndex(function (other) { return normalizeInterestTitle(other.searchTerm || other.title) === key; }) === index;
  });
  if (!fresh.length) return guidingAimResearchFocus();

  const freshManualRequest = fresh.find(function (item) { return item.isManualResearchRequest; });
  if (freshManualRequest) return freshManualRequest;

  const freshBoardNote = fresh.find(function (item) { return item.source === "visitor-board"; });
  if (freshBoardNote) return freshBoardNote;
  const freshFoodQuestion = fresh.find(function (item) { return String(item.id || "").startsWith("food-conversation-"); });
  if (freshFoodQuestion) return freshFoodQuestion;

  const freshWanderingFind = fresh.find(function (item) { return item.source === "exploration"; });
  if (freshWanderingFind) return freshWanderingFind;

  const ongoingGoals = fresh.filter(function (item) { return item.isOngoingGoal; });
  if (ongoingGoals.length) {
    ongoingGoals.sort(function (a, b) {
      const aLast = Date.parse(a.lastPursuedAt || 0) || 0;
      const bLast = Date.parse(b.lastPursuedAt || 0) || 0;
      if (aLast !== bLast) return aLast - bLast;
      return (b.pull || 0) - (a.pull || 0);
    });
    const goal = ongoingGoals[0];
    goal.question = goal.nextQuestion || goal.nextAction || goal.question;
    return goal;
  }

  const pool = fresh.length ? fresh : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseAutonomousArtworkInspiration() {
  const activeInterests = mabel.interests.filter(function (interest) {
    return interest && interest.title && ["growing", "pursuing"].includes(interest.stage);
  });
  const groundedReflections = mabel.feed.filter(function (entry) {
    return entry && entry.kind === "mind" && entry.text;
  }).slice(0, 8);
  const returnedSparks = sparks.filter(function (spark) {
    return spark && spark.title && (Number(spark.evidence) >= 2 || ["growing", "pursuing"].includes(spark.stage));
  });

  if (activeInterests.length && (!groundedReflections.length || Math.random() < 0.6)) {
    const interest = activeInterests[Math.floor(Math.random() * activeInterests.length)];
    return {
      title: interest.title,
      question: interest.nextAction || interest.nextQuestion || interest.question || "A subject Mabel has returned to more than once.",
      source: "interest"
    };
  }

  if (groundedReflections.length) {
    const reflection = groundedReflections[Math.floor(Math.random() * Math.min(groundedReflections.length, 4))];
    return {
      title: reflection.personalityCue || "a thought from a conversation",
      question: reflection.text,
      source: "conversation"
    };
  }

  if (returnedSparks.length && Math.random() < 0.5) {
    const spark = returnedSparks[Math.floor(Math.random() * returnedSparks.length)];
    return { title: spark.title, question: spark.question || spark.reason, source: "returning-spark" };
  }

  if (Math.random() < 0.12) {
    return {
      title: "a moment from today",
      question: mabel.now.thought || "A small feeling Mabel wants to remember.",
      source: "today"
    };
  }
  return null;
}

function chooseCurrentArtworkInspiration() {
  const interest = mabel.interests.find(function (item) {
    return item && item.title && ["growing", "pursuing"].includes(item.stage);
  });
  if (interest) {
    return {
      title: interest.title,
      question: interest.nextAction || interest.nextQuestion || interest.question || "A subject Mabel has returned to.",
      source: "interest"
    };
  }
  const reflection = mabel.feed.find(function (entry) { return entry && entry.kind === "mind" && entry.text; });
  return reflection ? {
    title: reflection.personalityCue || "a thought from a conversation",
    question: reflection.text,
    source: "conversation"
  } : null;
}

async function handleAutonomousMoment() {
  lastAutonomousMoment = Date.now();
  saveLastAutonomousMoment();

  try {
    await processNextDeferredReflection();
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
        activeGoals: mabel.interests.filter(function (interest) {
          return ["growing", "pursuing"].includes(interest.stage);
        }).map(function (interest) {
          return {
            title: interest.title,
            question: interest.nextQuestion || interest.question,
            nextAction: interest.nextAction || "",
            steps: Array.isArray(interest.steps) ? interest.steps.slice(0, 5) : [],
            lastPursuedAt: interest.lastPursuedAt || ""
          };
        }),
        guidingAim: MABEL_GUIDING_AIM,
        autonomyPlan: "Mabel's broad aim is to build a fulfilling life by learning about the world beyond the Hawthorn Hollow and following subjects she repeatedly finds meaningful. Choose a small next action from active interests when appropriate. When no grounded interest is ready, she may take a gentle step toward learning about life beyond the woods through real conversations, discoveries, or research; do not seed a list of questions or invent a discovery. A career or vocation may only be imagined after an interest has remained important across multiple grounded moments and research steps. Never assign her a career in advance, and let her change direction.",
        memories: mabel.memories.slice(0, 10),
        wanderings: wanderings.slice(0, 10),
        feed: mabel.feed.slice(0, 15),
        diaryContext: mabel.feed.slice(0, 10).map(function (entry) { return entry.text; }),
        diaryGuidance: "Anchor diary details to the supplied memories and recent events. If referring to a visitor note, object, person, or earlier conversation, include the actual detail from that context. Do not invent named visitors, poems, or past events that are not in the supplied context.",
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

    const diaryText = typeof data.diary === "string"
      ? data.diary
      : (data.diary && typeof data.diary.text === "string" ? data.diary.text : "");
    const diaryTitle = data.diaryTitle || (data.diary && data.diary.title) || "";
    const diaryEvidence = mabel.feed.slice(0, 10).map(function (entry) { return entry.text; }).join(" ") +
      " " + mabel.memories.slice(0, 10).map(function (memory) { return memory.text; }).join(" ");
    if (diaryText && textSharesSpecificDetail(diaryText, diaryEvidence)) {
      addFeedEntry({
        kind: "diary",
        text: diaryText,
        journalTitle: diaryTitle || "A moment from Mabel’s day",
        why: data.reason || ""
      });
    }

    if (data.interest && data.interest.title) {
      recordSpark({
        ...data.interest,
        grounded: true,
        source: "autonomous",
        evidenceText: mabel.feed.slice(0, 8).map(function (entry) { return entry.text; }).join(" ")
      });
    }

    saveMabel();
    updatePage();

    const canResearch = mabel.needs.food > 0.2 && mabel.needs.water > 0.2 && mabel.needs.rest > 0.2;
    const researchFocus = chooseAutonomousResearchFocus(newBoardNote);
    const researchInterval = 10 * 60 * 1000;
    const researchIsDue = Date.now() - lastAutonomousResearchAt >= researchInterval;
    if (canResearch && researchFocus && researchIsDue) {
      const researchResult = await handleWander({ autonomous: true, focusInterest: researchFocus });
      if (researchResult && researchResult.related) {
        lastAutonomousResearchAt = Date.now();
      } else {
        lastAutonomousResearchAt = Date.now() - researchInterval + 60 * 1000;
      }
      try { localStorage.setItem(autonomousResearchStorageKey, String(lastAutonomousResearchAt)); } catch (error) {}
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

function meaningfulContentWords(value) {
  const stopWords = new Set([
    "mabel", "she", "her", "they", "them", "their", "you", "your", "yours",
    "what", "when", "where", "which", "this", "that", "with", "from", "about",
    "into", "have", "has", "had", "was", "were", "are", "is", "the", "and",
    "but", "for", "not", "just", "then", "than", "there", "here", "because",
    "someone", "something", "thing", "things", "moment", "thought", "conversation",
    "visitor", "visitors", "noticed", "noticeboard", "board", "said", "says",
    "small", "little", "maybe", "might", "could", "would", "want", "wants"
  ]);
  return normalizeInterestTitle(value).split(" ").filter(function (word) {
    return word.length >= 3 && !stopWords.has(word);
  }).map(function (word) {
    return word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word;
  });
}

function textSharesSpecificDetail(text, evidenceText) {
  const evidenceWords = new Set(meaningfulContentWords(evidenceText));
  return meaningfulContentWords(text).some(function (word) { return evidenceWords.has(word); });
}

function isGroundedResearchTrigger(candidate) {
  if (!candidate || !candidate.title) return false;
  const source = normalizeInterestTitle(candidate.source || "");
  const trustedSources = new Set(["conversation", "visitor board", "discovery", "exploration", "research"]);
  if (candidate.grounded === true && trustedSources.has(source)) return true;
  const evidenceText = String(candidate.evidenceText || "");
  const ideaText = [candidate.title, candidate.question, candidate.reason].filter(Boolean).join(" ");
  if (source === "autonomous") {
    const recentEvents = evidenceText || mabel.feed.slice(0, 8)
      .filter(function (entry) { return ["did", "noticed", "mind"].includes(entry.kind); })
      .map(function (entry) { return entry.text; }).join(" ");
    const describesAnEvent = /\b(found|find|discover|came across|noticed|read|research|explor|gift|talked|conversation)\b/i.test(recentEvents);
    return describesAnEvent && textSharesSpecificDetail(ideaText, recentEvents);
  }
  return trustedSources.has(source) && evidenceText.length > 0 && textSharesSpecificDetail(ideaText, evidenceText);
}

function isUsefulVisitorFact(value) {
  const text = String(value || "").trim();
  const key = normalizeInterestTitle(text);
  if (!text || /^(none|null|undefined|unknown|bestie|friend|visitor|user|n a|na)$/.test(key)) return false;
  const words = text.match(/[a-z0-9]+/gi) || [];
  return words.length >= 3 && meaningfulContentWords(text).length > 0;
}

function currentVisitorGiftNotice() {
  ensureHollowWorld();
  let seen = [];
  try {
    const saved = JSON.parse(localStorage.getItem(visitorGiftSeenStorageKey) || "[]");
    seen = Array.isArray(saved) ? saved : [];
  } catch (error) {}
  const gifts = mabel.world.objects.filter(function (item) {
    return item && item.source === "visitor" && item.noticedAt;
  });
  for (const gift of gifts) {
    const key = String(gift.id || gift.name) + "|" + String(gift.noticedAt);
    if (!seen.includes(key)) return { ...gift, noticeKey: key };
  }
  return null;
}

function updateVisitorGiftNotice() {
  const gift = currentVisitorGiftNotice();
  if (!visitorGiftNoticeCard) return;
  if (!gift) {
    visitorGiftNoticeCard.classList.add("hidden");
    return;
  }
  if (visitorGiftNoticeText) {
    visitorGiftNoticeText.textContent = "Mabel noticed your " + gift.name + ": " + (gift.reaction || "She has tucked it into her bindle.");
  }
  visitorGiftNoticeCard.classList.remove("hidden");
}

function markVisitorGiftNoticeSeen() {
  const gift = currentVisitorGiftNotice();
  if (gift) {
    try {
      const saved = JSON.parse(localStorage.getItem(visitorGiftSeenStorageKey) || "[]");
      const seen = Array.isArray(saved) ? saved : [];
      if (!seen.includes(gift.noticeKey)) seen.unshift(gift.noticeKey);
      localStorage.setItem(visitorGiftSeenStorageKey, JSON.stringify(seen.slice(0, 100)));
    } catch (error) {}
  }
  if (visitorGiftNoticeCard) visitorGiftNoticeCard.classList.add("hidden");
}

function currentSparkNotice() {
  return sparks.reduce(function (best, spark) {
    if (!spark || !spark.notificationAt) return best;
    return !best || Date.parse(spark.notificationAt) > Date.parse(best.notificationAt) ? spark : best;
  }, null);
}

function currentSparkNoticeKey() {
  const latest = currentSparkNotice();
  return latest ? String(latest.id || normalizeInterestTitle(latest.title)) + "|" + String(latest.notificationAt) : "";
}

function currentAutonomousArtwork() {
  return gallery.find(function (artwork) { return artwork && artwork.source === "autonomous"; }) || null;
}

function artworkNoticeKey(artwork) {
  return artwork ? String(artwork.id || (artwork.title || "") + "|" + (artwork.seed || artwork.createdAt || "")) : "";
}

function markSparkNoticeSeen() {
  const key = currentSparkNoticeKey();
  if (key) {
    lastViewedSparkId = key;
    try { localStorage.setItem(viewedSparkStorageKey, key); } catch (error) {}
  }
  if (sparkNoticeCard) sparkNoticeCard.classList.add("hidden");
}

function markGalleryNoticeSeen() {
  const artwork = currentAutonomousArtwork();
  const key = artworkNoticeKey(artwork);
  if (key) {
    lastViewedArtworkKey = key;
    try { localStorage.setItem(viewedArtworkStorageKey, key); } catch (error) {}
  }
  if (galleryNoticeCard) galleryNoticeCard.classList.add("hidden");
}

function showSparkNotice() {
  const latest = currentSparkNotice();
  const innerLifeIsOpen = document.getElementById("inner-life");
  if (innerLifeIsOpen && innerLifeIsOpen.classList.contains("active")) {
    markSparkNoticeSeen();
    return;
  }
  const key = currentSparkNoticeKey();
  if (sparkNoticeHeading && latest) {
    sparkNoticeHeading.textContent = latest.notificationType === "level-up"
      ? "Mabel leveled up in " + latest.title
      : "A new hobby spark: " + latest.title;
  }
  if (sparkNoticeText && latest) {
    sparkNoticeText.textContent = latest.notificationType === "level-up"
      ? "Her interest has grown through new moments and things she has learned."
      : "Mabel is curious about this hobby and may explore it at the Library.";
  }
  if (sparkNoticeCard) {
    sparkNoticeCard.classList.toggle("hidden", !key || key === lastViewedSparkId);
  }
}

function refreshGalleryNotice() {
  const artwork = currentAutonomousArtwork();
  const key = artworkNoticeKey(artwork);
  if (!artwork || !key || key === lastViewedArtworkKey) {
    if (galleryNoticeCard) galleryNoticeCard.classList.add("hidden");
    return;
  }
  showGalleryNotice(artwork);
}

function showGalleryNotice(artwork) {
  if (!artwork || artwork.source !== "autonomous") return;
  const key = artworkNoticeKey(artwork);
  if (!key || key === lastViewedArtworkKey) {
    if (galleryNoticeCard) galleryNoticeCard.classList.add("hidden");
    return;
  }
  const galleryIsOpen = document.getElementById("gallery-tab");
  if (galleryIsOpen && galleryIsOpen.classList.contains("active")) {
    markGalleryNoticeSeen();
    return;
  }
  if (galleryNoticeText) {
    galleryNoticeText.textContent = "“" + artwork.title + "” is waiting in Mabel’s Gallery.";
  }
  if (galleryNoticeCard) galleryNoticeCard.classList.remove("hidden");
}

function recordSpark(candidate) {
  if (!candidate || !candidate.title || !isGroundedResearchTrigger(candidate)) return;
  candidate = { ...candidate, grounded: true };

  const title = String(candidate.title).trim().slice(0, 90);
  const question = String(candidate.question || "What might Mabel discover about " + title + "?").trim().slice(0, 220);
  const key = normalizeInterestTitle(title);
  if (!key) return;

  const timestamp = Date.now();
  const timestampText = new Date(timestamp).toISOString();
  const originText = String(candidate.originText || candidate.evidenceText || candidate.reason || "A thought caught Mabel’s attention.").trim().slice(0, 260);
  const originAt = candidate.originAt || timestampText;
  let spark = sparks.find(function (item) {
    return item.id === candidate.id || normalizeInterestTitle(item.title) === key;
  });
  const previousInterest = mabel.interests.find(function (item) {
    return item.id === (spark && spark.id || candidate.id) || normalizeInterestTitle(item.title) === key;
  });

  if (!spark) {
    spark = {
      id: candidate.id || "spark-" + timestamp,
      title: title,
      question: question,
      reason: String(candidate.reason || "A thought caught Mabel’s attention.").slice(0, 220),
      source: candidate.source || "Mabel’s thoughts",
      originText: originText,
      originAt: originAt,
      grounded: true,
      pull: 0.3,
      evidence: 1,
      stage: "idea",
      createdAt: timestampText,
      lastSeenAt: timestampText,
      lastEvidenceAt: timestampText
    };
    sparks.unshift(spark);
  } else {
    const lastEvidence = Date.parse(spark.lastEvidenceAt || spark.createdAt || 0);
    if (!lastEvidence || timestamp - lastEvidence >= 30 * 60 * 1000) {
      spark.evidence = (Number(spark.evidence) || 1) + 1;
      spark.lastEvidenceAt = timestampText;
      spark.pull = clampNeed((spark.pull || 0.3) + 0.08);
    }
    spark.lastSeenAt = timestampText;
    spark.grounded = true;
    spark.question = question || spark.question;
    spark.source = candidate.source || spark.source;
    spark.originText = originText;
    spark.originAt = originAt;
  }

  const idea = addResearchIdea({
    id: spark.id, title: spark.title, question: spark.question, source: spark.source, grounded: true,
    evidence: spark.evidence, createdAt: spark.createdAt, lastResearchedAt: spark.lastResearchedAt,
    originText: spark.originText, originAt: spark.originAt
  });
  const ageMs = timestamp - Date.parse(spark.createdAt || timestampText);
  const newVisitorHobby = !previousInterest &&
    candidate.kind === "hobby" &&
    normalizeInterestTitle(candidate.source || "") === "conversation";
  const qualifies = newVisitorHobby || Boolean(previousInterest || spark.interestPromotedAt) ||
    (isDurableInterestCandidate(candidate) && spark.evidence >= 3 && ageMs >= 60 * 60 * 1000);

  if (qualifies) {
    const newlyPromoted = !spark.interestPromotedAt;
    const interest = promoteResearchIdeaToInterest(candidate, spark);
    const previousLevel = interest ? (Number(interest.level) || 1) : 1;
    spark.interestPromotedAt = spark.interestPromotedAt || timestampText;
    spark.stage = "growing";
    if (interest) {
      interest.evidence = spark.evidence;
      interest.pull = spark.pull;
      interest.stage = interest.stage === "pursuing" ? "pursuing" : "growing";
      interest.question = spark.question || interest.question;
      interest.lastSeenAt = timestampText;
      if (candidate.kind === "hobby") interest.kind = "hobby";
      const nextLevel = Math.min(5, 1 + Math.floor(Math.max(0, spark.pull - 0.2) / 0.2));
      interest.level = Math.max(previousLevel, nextLevel);
      if (newVisitorHobby) interest.level = Math.max(1, interest.level);
      if (newlyPromoted && (candidate.kind === "hobby" || interest.kind === "hobby")) {
        spark.notificationAt = timestampText;
        spark.notificationType = "new-hobby";
      } else if ((candidate.kind === "hobby" || interest.kind === "hobby") && interest.level > previousLevel) {
        spark.notificationAt = timestampText;
        spark.notificationType = "level-up";
      }
    }
    if (idea) {
      researchIdeas = researchIdeas.filter(function (item) { return normalizeInterestTitle(item.title) !== key; });
      saveResearchIdeas();
    }
  } else {
    spark.stage = "idea";
  }

  sparks = sparks.slice(0, 40);
  mabel.interests = mabel.interests.slice(0, 30);
  saveSparks();
  saveMabel();
  updatePage();
}

async function reflectOnConversation(visitorMessage, mabelReply, sparkCandidate, deferred) {
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
        reflectionGuidance: "Reflect on this one completed visit using only the exact visitor message, Mabel reply, and supplied recent discoveries. Visitors are an important bridge to Mabel’s knowledge of people and the wider world: when someone clearly shares a hobby they enjoy (such as baking) or patiently teaches her something, let that create a small provisional hobby spark and a question she may research. It is an early curiosity, not a permanent identity. For a one-off object or fact, create only a research curiosity unless the evidence points to a broader hobby. If the visitor gives a specific fact about a found or gifted item, return it as itemKnowledge {item,fact}, grounded in their words and the recent context. A brief association like “good luck” after a four-leaf clover find may be recorded as the visitor linking that item with luck, not as a scientific fact. Do not invent an item or fact. If a hobby is clearly created, use kind hobby so the site can show a Spark notification; do not emit a hobby spark for every topic. Do not return an interest or spark for a greeting or unrelated small talk. Do not assign a fixed career or personality. If the exchange clearly shows an emerging quality, return a short personalityCue and exact personalityEvidence; otherwise return no cue.",
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10),
        itemKnowledge: mabel.knowledge.slice(0, 16),
        recentMoments: mabel.feed.slice(0, 12).map(function (entry) { return { at: entry.at, kind: entry.kind, text: entry.text }; }),
        recentWanderings: wanderings.slice(0, 8).map(function (outing) { return { at: outing.at, title: outing.title, finds: (outing.finds || []).slice(0, 4) }; }),
        visitorProfile: visitorProfile,
        world: mabel.world
      })
    });

    if (!response.ok) return false;

    const reflection = await response.json();
    if (reflection.visitorNote && textSharesSpecificDetail(reflection.visitorNote, visitorMessage) &&
        isUsefulVisitorFact(reflection.visitorNote)) {
      addVisitorProfileNote("facts", reflection.visitorNote);
    }
    if (reflection.sharedMoment && textSharesSpecificDetail(reflection.sharedMoment, visitorMessage + " " + mabelReply)) {
      const personalityCue = personalityCueLabel(
        reflection.personalityCue,
        reflection.personalityEvidence || reflection.sharedMoment,
        visitorMessage + " " + mabelReply
      );
      addFeedEntry({
        kind: "mind",
        text: (deferred ? "Later, Mabel thought back to your conversation: " : "") + reflection.sharedMoment,
        why: "A thought grounded in what was actually said.",
        personalityCue: personalityCue
      });
    }

    if (reflection.itemKnowledge && reflection.itemKnowledge.item && reflection.itemKnowledge.fact) {
      rememberItemKnowledge(reflection.itemKnowledge, visitorMessage);
    }

    if (reflection.spark && reflection.spark.title) {
      recordSpark({
        ...reflection.spark,
        grounded: true,
        source: "conversation",
        evidenceText: visitorMessage + " " + mabelReply + " " + String(reflection.sharedMoment || "")
      });
    }



    if (reflection.remember === true && reflection.memory &&
        textSharesSpecificDetail(reflection.memory, visitorMessage + " " + mabelReply)) {
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
      if (update.newInterest && update.newInterest.title) {
        recordSpark({
          ...update.newInterest,
          grounded: true,
          source: "conversation",
          evidenceText: visitorMessage + " " + mabelReply + " " + String(reflection.sharedMoment || "")
        });
      } else if (existing) {
        existing.pull = clampNeed(existing.pull + (update.pullChange || 0));
      }
    }

    if (reflection.desire) {
      addDesire(reflection.desire);
    }

    saveMabel();
    updatePage();
    return true;
  } catch (error) {
    // Reflection is private and optional. Mabel can still chat if it fails.
    return false;
  }
}

async function reflectOnVisitorBoardNote(reflection) {
  const note = String(reflection.note || "").trim();
  if (!note) return false;
  try {
    const response = await fetch(MABEL_AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "Later, Mabel quietly thinks again about the exact visitor note below and her first reaction. Consider only the words and tone that are actually there. The name supplied is only the note’s sign-off, not a verified identity or proof of what the writer is called. If useful, refer to “the visitor who signed the note as [signature]” or “the note signed [signature]”; never say Mabel knows that is the visitor’s real name or treat it as a fact about them. Do not assume other facts about the writer or invent events. Return one short, grounded thought. If the thought clearly shows Mabel considering another person's feelings or intentions, also return personalityCue as empathy or curiosity and personalityEvidence using only a phrase grounded in the note and thought; otherwise return no cue.",
        eventDetails: {
          kind: "later-noticeboard-reflection",
          note: note,
          signature: reflection.signature || reflection.name || "not given",
          signatureIsVerifiedIdentity: false,
          firstReaction: reflection.reaction || ""
        },
        mood: mabel.now.mood,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10)
      })
    });
    if (!response.ok) return false;
    const data = await response.json();
    const parts = separateSparkMarker(normalizeMabelReply(data));
    const thought = textSharesSpecificDetail(parts.text, note)
      ? parts.text
      : "Later, Mabel thought again about the words “" + note + "”. She wondered what might lead someone to write them.";
    let personalityCue = personalityCueLabel(
      data.personalityCue,
      data.personalityEvidence || thought,
      note + " " + String(reflection.reaction || "")
    );
    if (!personalityCue && /\b(what might lead someone|why someone would|thinking about how someone|wondered what someone)\b/i.test(thought) &&
        textSharesSpecificDetail(thought, note)) {
      personalityCue = "Thoughtfulness about others";
    }
    addFeedEntry({
      kind: "mind",
      text: "Mabel thought again about a Visitors’ board note: " + thought,
      why: "She returned to the exact words she had read.",
      personalityCue: personalityCue
    });
    if (data.spark) {
      recordSpark({ ...data.spark, grounded: true, source: "visitor-board", evidenceText: note + " " + thought });
    } else {
      const inlineSpark = sparkFromMarker(parts, "visitor-board", note);
      if (inlineSpark) recordSpark({ ...inlineSpark, grounded: true, evidenceText: note + " " + thought });
    }
    mabel.memories.unshift({ at: now(), kind: "noticeboard-reflection", text: "Mabel thought again about the note “" + note + "”: " + thought });
    mabel.memories = mabel.memories.slice(0, 20);
    saveMabel();
    updatePage();
    return true;
  } catch (error) {
    return false;
  }
}

async function processNextDeferredReflection() {
  const reflection = reflectionQueue[0];
  if (!reflection) return;
  const succeeded = reflection.type === "conversation"
    ? await reflectOnConversation(reflection.visitorMessage, reflection.mabelReply, reflection.sparkCandidate, true)
    : reflection.type === "board-note"
      ? await reflectOnVisitorBoardNote(reflection)
      : true;
  if (succeeded) {
    reflectionQueue.shift();
    saveReflectionQueue();
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

Choose one specific recent moment from Mabel’s Activity Log or wanderings that feels emotionally or personally meaningful. Write a short private diary entry about what that actual moment made her notice or feel. Do not invent a past visitor, conversation, object, or event that is not listed.
Do not repeat the Activity Log word for word.
Do not mention that you are an AI.
Do not mention Wikipedia, the internet, or searching.
Keep it gentle, curious, mossy, and a little mysterious.
Use 2 to 4 sentences.
Write in Mabel's voice.

Return only JSON like this:
{
  "title": "A small moment",
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

    if (!data.entry || !data.entry.text ||
        !textSharesSpecificDetail(data.entry.text, recentMoments + " " + recentWanderings)) {
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
  const candidates = Array.isArray(findResults) && findResults.length ? findResults.slice(0, 3) : [null];
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
  const searchTerm = focusInterest.isGuidingAimStep
    ? ""
    : String(focusInterest.searchTerm || deriveResearchKeyword(focusInterest) || focusInterest.title).trim();
  const displayTitle = searchTerm || focusInterest.title;

  if (wanderStatus) wanderStatus.textContent = "Mabel is following a question that caught her attention.";
  const libraryMethods = [
    "on the public computer by the window",
    "in the library’s web browser",
    "following links on a library computer",
    "on the library’s public PC"
  ];
  const researchMethod = libraryMethods[Math.floor(Math.random() * libraryMethods.length)];

  try {
    const response = await fetch(MABEL_WANDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        focusInterest: { ...focusInterest, ...(searchTerm ? { searchTerm: searchTerm } : {}) },
        interests: [focusInterest],
        guidingAim: MABEL_GUIDING_AIM,
        researchInstruction: focusInterest.isGuidingAimStep
          ? "For this step in Mabel’s broad wish to understand life beyond her woods, choose one concrete, verifiable subject she has not researched recently. Let the web search choose a varied subject rather than using a fixed topic list. Search the public web, open relevant pages where possible, and return the actual specific subject as title, a search question, a useful fact, and a source URL/title. Keep it a one-time discovery unless it later keeps drawing her attention. Do not invent results or say she found an object."
          : focusInterest.isManualResearchRequest
            ? "A visitor explicitly asked Mabel to research this topic. Answer the requested question directly with one useful finding grounded in real search results, then follow one naturally amusing, surprising, or curious detail from a mouse’s point of view. Keep the visitor’s topic central and return real source titles, URLs, and snippets. Do not claim anything the sources do not support."
            : "Start with the specific keyword Mabel picked from the real source. Ask what an autonomous little mouse who has come to life might find funniest, strangest, or most unexpectedly relatable about this particular thing; let that angle shape a real question, rather than inserting a stock joke or returning to a fixed topic. Keep the keyword central. If food or an ingredient is involved, consider recipes or surprising food facts. Search the public web, compare two or three relevant search results, and return their real titles, URLs, and snippets. If the first search is off-topic, try a different question that still contains and follows the same keyword. Keep every claim tied to supplied sources. Do not switch to an unrelated object or topic. This is a library research moment, not an exploration: do not say Mabel found or picked up a new object.",
        autonomyPlan: focusInterest.isGuidingAimStep
          ? "This is one small step toward Mabel’s open-ended wish to build a fulfilling life by learning about the wider world. Choose a varied subject, keep the finding as a passing discovery, and do not turn it into an interest, career, or fixed trait unless it continues to matter across real moments."
          : focusInterest.isManualResearchRequest
            ? "Complete the visitor’s specific research request now. Give a concise, grounded answer and one natural follow-up thought. Treat this as a useful shared investigation, not an automatic new hobby."
            : focusInterest.isOngoingGoal
            ? "This is one step in Mabel's longer-running interest. Continue from its saved steps and next action. Take one small, useful step, record what changed in her understanding, and suggest one next question. She may pause or change this interest if the evidence no longer draws her."
            : "This is a passing question, not automatically a hobby or long-term goal. Explore it once, record a useful fact and source, and only suggest a next step if there is a natural open question.",
        priorGoalSteps: Array.isArray(focusInterest.steps) ? focusInterest.steps.slice(0, 8) : [],
        priorGoalNextAction: focusInterest.isGuidingAimStep
          ? "Choose a concrete subject different from the recent research."
          : (focusInterest.nextAction || focusInterest.nextQuestion || ""),
        originText: focusInterest.originText || "",
        originAt: focusInterest.originAt || "",
        recentConversation: conversation.slice(-12).filter(function (entry) {
          return entry && entry.role === "user" && typeof entry.content === "string";
        }).map(function (entry) { return { content: entry.content, at: entry.at || "" }; }),
        visitorPreferences: visitorProfile.facts.slice(0, 8).map(function (fact) { return fact.text; }),
        recentResearch: researchLog.slice(0, 8).map(function (entry) {
          return { title: entry.focusTitle || entry.title || "", question: entry.searchQuestion || "" };
        }),
        memories: [],
        mood: mabel.now.mood,
        energy: mabel.now.energy,
        needs: mabel.needs,
        wanderings: [],
        recentFinds: focusInterest.isGuidingAimStep
          ? researchLog.slice(0, 8).map(function (entry) { return entry.focusTitle || entry.title || ""; })
          : [focusInterest.title]
      })
    });
    if (!response.ok) throw new Error("Mabel could not reach the library. Status " + response.status);

    const data = await response.json();
    const rawSources = Array.isArray(data.sources)
      ? data.sources.slice(0, 3).filter(function (source) {
          return source && source.title && safeExternalUrl(source.url);
        }).map(function (source) {
          return { title: String(source.title).slice(0, 160), url: safeExternalUrl(source.url), snippet: String(source.snippet || "").slice(0, 500) };
        })
      : [];
    if (!rawSources.length && data.sourceTitle && data.url) {
      const legacyUrl = safeExternalUrl(data.url);
      if (legacyUrl) rawSources.push({ title: String(data.sourceTitle).slice(0, 160), url: legacyUrl, snippet: "" });
    }
    const relatedSources = rawSources.filter(function (source) {
      return focusInterest.isGuidingAimStep ||
        researchMatchesFocus(source.title + " " + source.snippet, { ...focusInterest, searchTerm: searchTerm });
    });
    const returnedText = [
      data.searchQuestion,
      data.title,
      ...rawSources.map(function (source) { return source.title + " " + source.snippet; })
    ].filter(Boolean).join(" ");
    const aimResearchRelevant = Boolean(
      focusInterest.isGuidingAimStep &&
      data.title && data.searchQuestion && data.researchSummary &&
      (safeExternalUrl(data.url) || relatedSources.length) &&
      researchMatchesFocus(String(data.searchQuestion) + " " + String(data.researchSummary), { title: String(data.title) })
    );
    const relevant = focusInterest.isGuidingAimStep
      ? aimResearchRelevant
      : relatedSources.length > 0 || (!rawSources.length &&
          researchMatchesFocus(String(data.title || "") + " " + String(data.researchSummary || ""), { ...focusInterest, searchTerm: searchTerm }));
    const research = {
      kind: "research",
      at: now(),
      focusTitle: focusInterest.isGuidingAimStep && relevant ? data.title : displayTitle,
      focusQuestionTitle: focusInterest.title,
      focusSource: focusInterest.source || "",
      sourceOriginText: focusInterest.originText || "",
      sourceOriginAt: focusInterest.originAt || "",
      searchQuestion: data.searchQuestion || searchTerm || focusInterest.question || "",
      title: relevant ? (data.title || displayTitle) : "A question left on the library table",
      sourceTitle: relevant ? (relatedSources[0]?.title || data.sourceTitle || "") : "",
      researchSummary: relevant
        ? String(data.researchSummary || "").slice(0, 1200)
        : "",
      thoughts: relevant && Array.isArray(data.thoughts) ? data.thoughts.slice(0, 3).map(function (thought) { return String(thought).slice(0, 260); }) : [],
      sources: relevant ? relatedSources : [],
      url: relevant ? (relatedSources[0]?.url || safeExternalUrl(data.url) || "") : "",
      musing: relevant
        ? /\b(?:found|picked up|came across)\s+(?:a|an|the)\s+(?:coin|button|toy|lid|shell|stone|key|cap|figure|flower|fossil|marble|bead)\b/i.test(String(data.musing || ""))
          ? "Mabel stayed with the question about " + focusInterest.title + " and kept a note from the source."
          : String(data.musing || "").slice(0, 700)
        : "Mabel tried a few search paths, but none connected clearly. She kept the question and will try a different keyword another time.",
      researchMethod: researchMethod,
      related: relevant
    };

    researchLog.unshift(research);
    researchLog = researchLog.slice(0, 30);
    if (focusInterest.source === "exploration") {
      const sourceOuting = wanderings.find(function (outing) {
        return outing && outing.at === focusInterest.originAt &&
          Array.isArray(outing.finds) && outing.finds.some(function (found) {
            return normalizeInterestTitle(found.name) === normalizeInterestTitle(focusInterest.title);
          });
      });
      if (sourceOuting) {
        sourceOuting.research = {
          at: research.at,
          focusTitle: research.focusTitle,
          searchQuestion: research.searchQuestion,
          researchSummary: research.researchSummary,
          sources: research.sources,
          related: research.related
        };
        saveWanderings();
      }
    }
    saveResearchLog();
    if (relevant && typeof data.visitorNote === "string" && data.visitorNote.trim()) {
      addMabelPostboxItem({
        kind: "research-question",
        title: "A question from Mabel’s reading",
        text: data.visitorNote.trim().slice(0, 500),
        sources: relatedSources,
        at: research.at
      });
    }

    const researchedIdea = researchIdeas.find(function (item) {
      return item.id === focusInterest.id ||
        normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.ideaTitle || focusInterest.title);
    });
    if (researchedIdea) {
      researchedIdea.lastResearchedAt = research.at;
      saveResearchIdeas();
    }

    const existing = mabel.interests.find(function (item) {
      return item.id === focusInterest.id ||
        normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.ideaTitle || focusInterest.title);
    });
    if (existing && relevant) {
      existing.pull = clampNeed((existing.pull || 0.35) + 0.08);
      existing.lastPursuedAt = now();
      existing.stage = existing.pull > 0.65 ? "pursuing" : "growing";
    }

    if (data.interest && relevant && researchMatchesFocus(data.interest.title, focusInterest)) {
      const priorCount = mabel.interests.length;
      recordSpark({
        ...data.interest,
        grounded: true,
        source: "research",
        evidenceText: focusInterest.title + " " + String(data.searchQuestion || "") + " " + String(data.researchSummary || "")
      });
      if (mabel.interests.length > priorCount) showSparkNotice();
    }

    if (data.goalProgress && relevant) {
      const goal = mabel.interests.find(function (item) {
        return item.id === focusInterest.id ||
          normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.ideaTitle || focusInterest.title);
      });
      if (goal) {
        goal.steps = Array.isArray(goal.steps) ? goal.steps : [];
        const step = String(data.goalProgress.step || research.researchSummary || "").slice(0, 260);
        if (step) {
          goal.steps.unshift({ at: now(), text: step, source: research.sourceTitle, url: research.url, sources: research.sources, thoughts: research.thoughts });
          goal.steps.length = Math.min(goal.steps.length, 12);
          goal.progress = goal.steps.length;
          goal.lastStep = step;
          goal.lastSource = { title: research.sourceTitle, url: research.url, sources: research.sources };
          goal.lastResearchThoughts = research.thoughts;
          goal.lastPursuedAt = now();
          goal.nextQuestion = data.goalProgress.nextQuestion || goal.question;
          goal.nextAction = data.goalProgress.nextAction || goal.nextQuestion;
          goal.question = goal.nextQuestion;
          if (data.goalProgress.completed === true) {
            goal.stage = "resting";
            goal.completedAt = now();
            goal.nextAction = "";
          } else {
            goal.stage = "pursuing";
          }
        }
      }
    }

    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.1);
    mabel.needs.rest = clampNeed(mabel.needs.rest - 0.015);
    mabel.now.doing = "researching " + (focusInterest.isGuidingAimStep ? research.focusTitle : displayTitle);
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
        ? "Mabel followed “" + displayTitle + "” through a few pages and kept a note."
        : "Mabel set that search aside and will try a clearer keyword next time.";
    }
    return research;
  } catch (error) {
    if (wanderStatus) {
      wanderStatus.textContent = "Mabel tried to research " + focusInterest.title + ", but the Library web connection failed. Her question is still on her list for another attempt.";
    }
    return null;
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
Keep every reference to a visitor, note, object, or earlier conversation tied to details present in the supplied moments or memories. Name what the note or object actually was. Do not invent named visitors, poems, or past events.
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
    const reflectionEvidence = recentMoments + " " + recentDiary + " " +
      mabel.memories.slice(0, 10).map(function (memory) { return memory.text; }).join(" ");
    if (!reflectionText || !textSharesSpecificDetail(reflectionText, reflectionEvidence)) return;

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
  if (tabName === "inner-life") markSparkNoticeSeen();
  if (tabName === "gallery-tab") markGalleryNoticeSeen();
  tabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach(function (panel) {
    panel.classList.toggle("active", panel.id === tabName);
  });
  if (tabName === "visitor-board") loadVisitorBoard();
  showSparkNotice();
  refreshGalleryNotice();
  updateVisitorGiftNotice();
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
  mabel.knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge.slice(0, 40) : [];
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
  reflectionQueue = loadReflectionQueue();
  wanderings = loadWanderings();
  researchLog = loadResearchLog();
  mabelPostboxItems = loadMabelPostbox();
  boardReadKeys = loadBoardReadKeys();
  sparks = loadSparks().filter(function (spark) { return isGroundedResearchTrigger(spark); });
  researchIdeas = loadResearchIdeas();
  const previousInterests = mabel.interests.slice();
  const retainedInterests = [];
  previousInterests.forEach(function (interest) {
    const associatedSpark = sparks.find(function (spark) {
      return spark && (spark.id === interest.id || normalizeInterestTitle(spark.title) === normalizeInterestTitle(interest.title));
    });
    const evidence = Math.max(Number(interest.evidence) || 0, Number(associatedSpark && associatedSpark.evidence) || 0);
    const created = Date.parse(interest.createdAt || (associatedSpark && associatedSpark.createdAt) || 0);
    const priorSource = interest.source || (associatedSpark && associatedSpark.source) || "";
    const groundedCandidate = {
      ...interest,
      source: priorSource,
      grounded: Boolean(interest.grounded || (associatedSpark && associatedSpark.grounded))
    };
    const grounded = isGroundedResearchTrigger(groundedCandidate);
    const mature = grounded && isDurableInterestCandidate(interest) && evidence >= 3 && created && Date.now() - created >= 60 * 60 * 1000;
    if (mature) {
      interest.grounded = true;
      interest.interestPromotedAt = interest.interestPromotedAt || (associatedSpark && associatedSpark.interestPromotedAt) || now();
      retainedInterests.push(interest);
    } else {
      if (grounded) addResearchIdea({
        id: interest.id, title: interest.title, question: interest.question,
        source: priorSource, grounded: true, evidence: evidence || 1, createdAt: interest.createdAt
      });
      if (associatedSpark) {
        associatedSpark.stage = "idea";
        delete associatedSpark.interestPromotedAt;
      }
    }
  });
  mabel.interests = retainedInterests;
  saveMabel();
  saveSparks();
  saveResearchIdeas();
  try {
    lastViewedSparkId = localStorage.getItem(viewedSparkStorageKey) || "";
    lastViewedArtworkKey = localStorage.getItem(viewedArtworkStorageKey) || "";
  } catch (error) {
    lastViewedSparkId = "";
    lastViewedArtworkKey = "";
  }
  lastAutonomousMoment = loadLastAutonomousMoment();
  lastAutonomousResearchAt = Number(localStorage.getItem(autonomousResearchStorageKey) || 0);
  if (!Number.isFinite(lastAutonomousResearchAt)) lastAutonomousResearchAt = 0;
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
  showSparkNotice();
  refreshGalleryNotice();

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
  if (viewVisitorGiftButton) {
    viewVisitorGiftButton.addEventListener("click", function () {
      markVisitorGiftNoticeSeen();
      switchTab("hollow");
      const bindleElement = document.getElementById("bindle");
      if (bindleElement) bindleElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (dismissVisitorGiftButton) {
    dismissVisitorGiftButton.addEventListener("click", markVisitorGiftNoticeSeen);
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