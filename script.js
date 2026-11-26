// MABEL SCRIPT VERSION 6 - AUTONOMOUS DAY

const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const activityLogElement = document.getElementById("activity-log");
const messageElement = document.getElementById("message");
const chatFormElement = document.getElementById("chat-form");
const sendButton = document.getElementById("send");
let replyElement = document.getElementById("reply");
const chatStatusElement = document.getElementById("chat-status");
const sparkNoticeCard = document.getElementById("spark-notice-card");
const sparkNoticeHeading = document.getElementById("spark-notice-heading");
const sparkNoticeText = document.getElementById("spark-notice-text");
const itemKnowledgeElement = document.getElementById("item-knowledge");
const postboxNoticeCard = document.getElementById("postbox-notice-card");
const postboxNoticeText = document.getElementById("postbox-notice-text");
const viewPostboxButton = document.getElementById("view-postbox");
const dismissPostboxButton = document.getElementById("dismiss-postbox");
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
const autonomousExplorerElement = document.getElementById("autonomous-explorer-log");
const needComfort = document.getElementById("need-comfort");
const needCuriosity = document.getElementById("need-curiosity");
const needConnection = document.getElementById("need-connection");
const needRest = document.getElementById("need-rest");
const needWonder = document.getElementById("need-wonder");
const needFood = document.getElementById("need-food");
const needWater = document.getElementById("need-water");
const wishesElement = document.getElementById("wishes");
const interestsElement = document.getElementById("interests");
const mindTopicsElement = document.getElementById("mind-topics");
const changesElement = document.getElementById("changes");
const wanderButton = document.getElementById("wander");
const wanderStatus = document.getElementById("wander-status");
const musingElement = document.getElementById("musing");
const wanderingsElement = document.getElementById("wanderings");
const visitorBoardForm = document.getElementById("visitor-board-form");
const visitorBoardMessages = document.getElementById("visitor-board-messages");
const visitorBoardStatus = document.getElementById("visitor-board-status");
const brainCoreTraitsElement = document.getElementById("brain-core-traits");
const brainEvolvedTraitsElement = document.getElementById("brain-evolved-traits");

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

const MABEL_GUIDING_AIM = "Mabel wants to build a fulfilling life by discovering more about the world beyond the Hawthorn Hollow and following the subjects she keeps finding meaningful. If an interest stays with her through real conversations, discoveries, and research, she may someday imagine work that feels right to her. Her path can change as she does.";

const MABEL_AI_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel";
const MABEL_ART_URL = "https://mabel-ai-artwork.fianna-b-murphy.workers.dev/mabel-art";
const MABEL_WANDER_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-wander";
const MABEL_DAY_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-day";
const MABEL_JOURNAL_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-journal";
const MABEL_BOARD_URL = "https://mabel-life.fianna-b-murphy.workers.dev/board";
const MABEL_BRAIN_URL = "https://mabel-life.fianna-b-murphy.workers.dev/mabel-brain";

const mabelStorageKey = "mabel-character-v5";
const conversationStorageKey = "mabel-conversation-session-v3";
const reflectionQueueStorageKey = "mabel-deferred-reflections-v1";
const wanderingsStorageKey = "mabel-wanderings-v1";
const autonomousExplorerStorageKey = "mabel-autonomous-explorer-v1";
const curiosityPostboxQueueStorageKey = "mabel-curiosity-postbox-v1";
const researchLogStorageKey = "mabel-library-research-v1";
const boardReadKeysStorageKey = "mabel-board-read-v1";
const sparksStorageKey = "mabel-sparks-v1";
const autonomousResearchStorageKey = "mabel-last-autonomous-research-v1";
const viewedSparkStorageKey = "mabel-viewed-spark-v1";
const viewedArtworkStorageKey = "mabel-viewed-artwork-v1";
const autonomousStorageKey = "mabel-autonomous-v1";
const reflectionStorageKey = "mabel-last-reflection-date";
const bindleStorageKey = "mabel-bindle-v1";
const visitorSessionStorageKey = "mabel-visitor-session-v1";

function currentVisitorSessionId() {
  try {
    let id = localStorage.getItem(visitorSessionStorageKey);
    if (!id) id = sessionStorage.getItem(visitorSessionStorageKey);
    if (!id) {
      id = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "visit-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
      localStorage.setItem(visitorSessionStorageKey, id);
    }
    localStorage.setItem(visitorSessionStorageKey, id);
    try { sessionStorage.setItem(visitorSessionStorageKey, id); } catch (ignored) {}
    return id;
  } catch (error) {
    return "visit-" + Math.floor(Date.now() / 60000);
  }
}
const galleryStorageKey = "mabel-gallery-v1";
const visitorProfileStorageKey = "mabel-visitor-profile-v1";
const visitorGiftSeenStorageKey = "mabel-viewed-visitor-gift-v1";
const visitorGiftHighlightStorageKey = "mabel-highlight-visitor-gift-v1";

const legacySeedInterestIds = new Set([
  "silver-thread",
  "rain-listening",
  "button-collecting",
  "old-lane"
]);

let mabel = null;
let viewedVisitorGiftNoticeKeys = new Set();
let giftNoticeInProgress = false;
let sharedMabelBrain = null;
let sharedMabelBrainLoading = false;
let conversation = [];
let reflectionQueue = [];
let messagePending = false;
let reflectionInProgress = false;
let wanderings = [];
let autonomousExplorerLog = [];
let curiosityPostboxQueue = [];
let autonomousWanderInProgress = false;
let explorationInProgress = false;
let lastAutonomousWanderAt = 0;
let nextAutonomousWanderAt = 0;
let researchLog = [];
let boardReadKeys = [];
let boardNoticeInProgress = false;
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

function loadAutonomousExplorerLog() {
  try {
    const saved = localStorage.getItem(autonomousExplorerStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 24) : [];
  } catch (error) { return []; }
}
function saveAutonomousExplorerLog() {
  try { localStorage.setItem(autonomousExplorerStorageKey, JSON.stringify(autonomousExplorerLog.slice(0, 24))); } catch (error) {}
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
const comfortPostboxQueueStorageKey = "mabel-comfort-postbox-queue-v1";
let comfortPostboxQueue = [];
const postboxSeenStorageKey = "mabel-viewed-postbox-item-v1";
const researchShareCountStorageKey = "mabel-postbox-research-shares-v1";
let mabelPostboxItems = [];
let viewedPostboxIds = new Set();

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
function latestPostboxMail() {
  if (!Array.isArray(mabelPostboxItems)) return null;
  return mabelPostboxItems.find(function (entry) {
    return entry && entry.id && (Boolean(entry.artwork) || (typeof entry.text === "string" && entry.text.trim().length > 0));
  }) || null;
}

function markPostboxNoticeSeen() {
  const newIds = mabelPostboxItems.filter(function (entry) { return entry && entry.id; }).map(function (entry) { return String(entry.id); });
  viewedPostboxIds = new Set(Array.from(viewedPostboxIds).concat(newIds).slice(-200));
  try { localStorage.setItem(postboxSeenStorageKey, JSON.stringify(Array.from(viewedPostboxIds))); } catch (error) {}
  if (postboxNoticeCard) postboxNoticeCard.classList.add("hidden");
}
function refreshPostboxNotice() {
  if (!postboxNoticeCard) return;
  const unread = mabelPostboxItems.filter(function (entry) {
    return entry && entry.id && !viewedPostboxIds.has(String(entry.id)) &&
      (Boolean(entry.artwork) || (typeof entry.text === "string" && entry.text.trim().length > 0));
  });
  if (!unread.length) {
    postboxNoticeCard.classList.add("hidden");
    return;
  }
  const latest = unread[0];
  const detail = latest.kind === "gift-reaction"
    ? "Mabel noticed your gift and left you a note."
    : latest.kind === "artwork"
      ? "Mabel left a little drawing just for you."
      : "Mabel left you a note in the postbox.";
  if (postboxNoticeText) {
    postboxNoticeText.textContent = unread.length > 1
      ? "You’ve got mail — " + unread.length + " new notes. " + detail
      : "You’ve got mail. " + detail;
  }
  postboxNoticeCard.classList.remove("hidden");
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
  refreshPostboxNotice();
}
function loadComfortPostboxQueue() {
  try {
    const saved = localStorage.getItem(comfortPostboxQueueStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch (error) { return []; }
}
function saveComfortPostboxQueue() {
  try { localStorage.setItem(comfortPostboxQueueStorageKey, JSON.stringify(comfortPostboxQueue.slice(0, 8))); }
  catch (error) { /* The note can still be delivered during this visit. */ }
}
function comfortMessageTopic(message) {
  const text = String(message || "").toLowerCase();
  if (/\b(lonely|alone|no one|nobody)\b/.test(text)) return "feeling lonely";
  if (/\b(grieving|grief|loss|died|death|passed away|heartbroken)\b/.test(text)) return "going through a loss";
  if (/\b(anxious|anxiety|scared|afraid|overwhelmed|panic)\b/.test(text)) return "feeling worried";
  if (/\b(rough day|bad day|hard day|awful day)\b/.test(text)) return "having a hard day";
  return "feeling sad";
}
function loadCuriosityPostboxQueue() {
  try {
    const saved = localStorage.getItem(curiosityPostboxQueueStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch (error) { return []; }
}
function saveCuriosityPostboxQueue() {
  try { localStorage.setItem(curiosityPostboxQueueStorageKey, JSON.stringify(curiosityPostboxQueue.slice(0, 8))); } catch (error) {}
}
function queueCuriosityPostboxMail(found, outingAt) {
  if (!found || !found.name) return;
  const reason = String(found.note || "").trim();
  curiosityPostboxQueue.push({
    id: "curiosity-mail-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
    deliverAt: Date.now() + 45 * 1000 + Math.floor(Math.random() * 75 * 1000),
    title: "Something caught Mabel’s curiosity",
    text: "I keep thinking about the " + found.name + (reason ? ". " + reason.replace(/[.!?]+$/, "") : "") + ". I wonder what its story is, and I’d like to find out more.",
    sourceAt: outingAt || now()
  });
  curiosityPostboxQueue = curiosityPostboxQueue.slice(-8);
  saveCuriosityPostboxQueue();
}
function deliverDueCuriosityPostboxMail() {
  const current = Date.now();
  const due = curiosityPostboxQueue.filter(function (item) { return item && Number(item.deliverAt) <= current; });
  curiosityPostboxQueue = curiosityPostboxQueue.filter(function (item) { return !item || Number(item.deliverAt) > current; });
  if (!due.length) return;
  due.forEach(function (item) {
    addMabelPostboxItem({
      id: item.id,
      kind: "note",
      title: item.title || "Something caught Mabel’s curiosity",
      text: item.text || "A little discovery stayed on Mabel’s mind.",
      at: now()
    });
  });
  saveCuriosityPostboxQueue();
}
function queueComfortPostboxMail(visitorMessage, artwork) {
  const topic = comfortMessageTopic(visitorMessage);
  const notes = [
    "What you said about " + topic + " stayed with me. Thank you for trusting me with it. I wanted to leave a little kindness here for you.",
    "I kept thinking about your message about " + topic + ". You deserve a gentle moment, so I made this little picture just for you.",
    "Your words about " + topic + " mattered to me. I’m glad you told me. Here’s a small bit of warmth from my corner of the woods."
  ];
  comfortPostboxQueue.push({
    id: "comfort-mail-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
    deliverAt: Date.now() + (90 * 1000) + Math.floor(Math.random() * 90 * 1000),
    title: "Mabel sent you a thoughtful note",
    text: notes[Math.floor(Math.random() * notes.length)],
    artwork: artwork || null
  });
  comfortPostboxQueue = comfortPostboxQueue.slice(-4);
  saveComfortPostboxQueue();
}
function deliverDueComfortPostboxMail() {
  const current = Date.now();
  const due = comfortPostboxQueue.filter(function (item) { return item && Number(item.deliverAt) <= current; });
  comfortPostboxQueue = comfortPostboxQueue.filter(function (item) { return !item || Number(item.deliverAt) > current; });
  if (due.length) {
    due.forEach(function (item) {
      addMabelPostboxItem({
        id: item.id,
        kind: "artwork",
        title: item.title || "Mabel sent you a thoughtful note",
        text: item.text || "Mabel wanted to leave you a little kindness after your message.",
        artwork: item.artwork || null,
        at: new Date().toISOString()
      });
      if (item.artwork && item.artwork.postboxFirst) {
        const galleryArtwork = { ...item.artwork };
        delete galleryArtwork.postboxFirst;
        saveToMabelGallery(galleryArtwork);
      }
    });
    saveComfortPostboxQueue();
  }
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
      isGiftResearch: Boolean(candidate.isGiftResearch),
      isGiftArtReference: Boolean(candidate.isGiftArtReference),
      giftId: candidate.giftId || "",
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
    if (candidate.isGiftResearch) idea.isGiftResearch = true;
    if (candidate.isGiftArtReference) idea.isGiftArtReference = true;
    if (candidate.giftId) idea.giftId = candidate.giftId;
    if (candidate.lastResearchedAt) idea.lastResearchedAt = candidate.lastResearchedAt;
  }
  researchIdeas = researchIdeas.slice(0, 40);
  saveResearchIdeas();
  return idea;
}

function isConcreteHumanHobby(title) {
  const value = normalizeInterestTitle(String(title || ""));
  const concretePractices = [
    "baking", "baking bread", "baking cakes", "cooking", "cooking recipes",
    "sewing", "knitting", "crocheting", "embroidery", "quilting",
    "woodworking", "pottery", "ceramics", "painting", "drawing", "sketching",
    "photography", "gardening", "singing", "dancing", "public speaking",
    "writing", "journaling", "reading", "bookbinding", "music making",
    "making music", "playing music", "playing guitar", "playing piano",
    "playing violin", "playing an instrument", "guitar", "piano", "violin",
    "drumming", "songwriting", "composing music", "hiking", "walking",
    "running", "swimming", "cycling", "yoga", "rock climbing", "birdwatching",
    "chess", "acting", "theatre", "calligraphy", "origami", "model making",
    "model building", "stargazing", "language learning", "learning languages",
    "coding", "programming", "skateboarding", "surfing", "fishing", "DIY",
    "home improvement", "crafting", "crafting small objects"
  ];
  return concretePractices.includes(value);
}


function isDurableInterestCandidate(candidate) {
  if (!candidate) return false;
  const title = String(candidate.title || "").trim().toLowerCase();
  const details = title + " " + String(candidate.question || "") + " " + String(candidate.reason || "");
  const kind = String(candidate.kind || candidate.category || "").toLowerCase();
  if (!title || /^(a|an|the)\s+/.test(title)) return false;
  if (/\bhobby\b/.test(kind)) return isConcreteHumanHobby(title);
  if (/\b(pebble|button|coin|cap|lid|shell|stone|toy|crayon|twig|leaf|moss|flower|fossil|key|bead|tiny home|mossy home)\b/i.test(title) &&
      !/\b(collecting|collection|making|crafting|studying|learning|playing|listening|practising|practicing)\b/i.test(title)) return false;
  const activityTitle = /\b(playing|play|listening|music|singing|dance|dancing|exercise|exercising|walk|walks|walking|hiking|cooking|baking|painting|drawing|gardening|reading|writing|crafting|making|practising|practicing|learn|learning|swimming|running|stretching|sewing|knitting|crocheting|public speaking)\b/i.test(title);
  const explicitOngoingActivity = /^(playing|listening to|going for|walking|exercising|dancing|singing|cooking|baking|painting|drawing|gardening|reading|writing|practising|practicing|learning|swimming|running|sewing|knitting|crocheting|making music|public speaking)\b/i.test(title);
  const enduringDetails = /\b(enjoys|keeps returning|wants to practice|wants to practise|wants to learn|would like to learn|often|regularly|again and again|favorite|favourite|likes doing)\b/i.test(details);
  const enduringKind = /\b(activity|practice|practise|pursuit|pastime)\b/.test(kind);
  return (enduringKind && activityTitle) || explicitOngoingActivity || (activityTitle && enduringDetails);
}

function registerSharedDrawing(artwork, context) {
  if (!artwork || !MABEL_BRAIN_URL) return;
  const artworkId = String(artwork.id || artwork.seed || artwork.createdAt || artwork.at || "drawing") + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
  return fetch(MABEL_BRAIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind: "drawing-practice",
      artworkId: artworkId,
      title: artwork.title || "A little drawing",
      source: context && context.source || "autonomous"
    })
  }).then(async function (response) {
    if (!response.ok) return;
    const result = await response.json();
    const drawingSpark = {
      id: "drawing-hobby",
      title: "Drawing",
      kind: "hobby",
      question: "What could Mabel express through drawing, and how might she keep learning to draw?",
      reason: "After returning to making pictures, Mabel wants to keep practicing drawing.",
      originText: "Mabel has made several different drawings across her days and visitors.",
      evidenceText: "Mabel has made several drawings across separate moments.",
      source: "creative practice",
      grounded: true
    };
    if (result.newlyHobby) {
      recordSpark(drawingSpark);
    } else if (result.levelUp) {
      recordSpark(drawingSpark);
      const spark = sparks.find(function (item) { return item && item.id === "drawing-hobby"; });
      const interest = mabel.interests.find(function (item) { return item && item.id === "drawing-hobby"; });
      if (spark) {
        spark.notificationAt = now();
        spark.notificationType = "level-up";
        spark.level = Number(result.interest && result.interest.level) || Number(spark.level) || 2;
      }
      if (interest) {
        interest.level = Number(result.interest && result.interest.level) || Math.max(2, Number(interest.level) || 1);
      }
      saveSparks();
      saveMabel();
      updatePage();
    } else {
      refreshSharedMabelBrain();
    }
  }).catch(function () {});
}

let sharedNeedsBaseline = null;
function persistSharedNeeds() {
  if (!mabel || !mabel.needs) return;
  const current = { ...mabel.needs };
  if (!sharedNeedsBaseline) {
    sharedNeedsBaseline = current;
    return;
  }
  const deltas = {};
  Object.keys(current).forEach(function (key) {
    const before = Number(sharedNeedsBaseline[key]);
    const after = Number(current[key]);
    if (Number.isFinite(before) && Number.isFinite(after) && Math.abs(after - before) > 0.00001) deltas[key] = after - before;
  });
  if (!Object.keys(deltas).length) return;
  sharedNeedsBaseline = current;
  const eventId = "needs-" + currentVisitorSessionId() + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
  fetch(MABEL_BRAIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "needs", eventId: eventId, deltas: deltas })
  }).catch(function () {});
}

function persistSharedHobbyInterest(interest) {
  if (!interest || interest.kind !== "hobby" || !isConcreteHumanHobby(interest.title)) return;
  fetch(MABEL_BRAIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "hobby", interest: { id: interest.id, title: interest.title, question: interest.question, reason: interest.reason || interest.originText || "", pull: interest.pull || 0.5 } })
  }).then(function (response) { if (response.ok) refreshSharedMabelBrain(); }).catch(function () {});
}

function promoteResearchIdeaToInterest(candidate, spark) {
  const existing = mabel.interests.find(function (item) {
    return item.id === spark.id || normalizeInterestTitle(item.title) === normalizeInterestTitle(spark.title);
  });
  if (existing) {
    if (candidate.kind === "hobby" || existing.kind === "hobby") persistSharedHobbyInterest(existing);
    return existing;
  }
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
    reason: spark.reason && !/a thought caught mabel|small thought caught/i.test(spark.reason)
      ? spark.reason
      : (spark.originText || spark.question || "A subject that stayed with Mabel."),
    originText: spark.originText || "",
    originAt: spark.originAt || "",
    createdAt: spark.createdAt,
    interestPromotedAt: now(),
    level: 1,
    actions: []
  };
  mabel.interests.unshift(interest);
  persistSharedHobbyInterest(interest);
  return interest;
}

function saveBindle() {
  try {
    localStorage.setItem(bindleStorageKey, JSON.stringify(bindle));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function recordBindleDeparture(item, action, at) {
  if (!item || !item.name) return;
  bindle.history = Array.isArray(bindle.history) ? bindle.history : [];
  const giftId = item.giftId || "";
  const linkedObject = giftId && mabel.world && Array.isArray(mabel.world.objects)
    ? mabel.world.objects.find(function (object) { return object && object.id === giftId; })
    : null;
  const itemSource = item.source || linkedObject && linkedObject.source || "";
  bindle.history.unshift({
    name: String(item.name),
    note: String(item.note || ""),
    giftId: giftId,
    source: itemSource,
    action: action || "discarded",
    at: at || now()
  });
  bindle.history = bindle.history.slice(0, 40);

  if (giftId && mabel.world && Array.isArray(mabel.world.objects)) {
    const gift = mabel.world.objects.find(function (object) { return object && object.id === giftId; });
    if (gift) {
      gift.status = action === "eaten" ? "eaten" : action === "drank" ? "drank" : "discarded";
      gift.consumedAt = at || now();
    }
  }
}

function bindleItemResonance(item) {
  const text = String((item && item.name || "") + " " + (item && item.note || "")).toLowerCase();
  const words = text.match(/[a-z]{4,}/g) || [];
  const meaningful = Array.from(new Set(words.filter(function (word) {
    return !/^(mabel|little|small|tiny|found|piece|thing|things|looked|seemed|wondered|might|could|would|with|from|that|this|their|there|what|when|where|once|again|visitor|gift|really|very|about|under|over|after|before|while|some|more|than|just|like)$/.test(word);
  })));
  if (!meaningful.length) return "";
  const interests = (Array.isArray(mabel.interests) ? mabel.interests : []).concat(
    sharedMabelBrain && Array.isArray(sharedMabelBrain.interests) ? sharedMabelBrain.interests : []
  );
  for (const interest of interests) {
    if (!interest || !(interest.kind === "hobby" || interest.stage === "pursuing" || interest.stage === "growing")) continue;
    const interestWords = String(interest.title || "").toLowerCase().match(/[a-z]{4,}/g) || [];
    if (interestWords.some(function (word) { return meaningful.includes(word); })) {
      return "It connects with Mabel’s growing interest in " + interest.title + ".";
    }
  }
  const savedTexts = []
    .concat((visitorProfile.facts || []).map(function (entry) { return entry.text || ""; }))
    .concat((visitorProfile.moments || []).map(function (entry) { return entry.text || ""; }))
    .concat((mabel.memories || []).slice(0, 12).map(function (entry) { return entry.text || ""; }))
    .concat((mabel.feed || []).slice(0, 12).map(function (entry) { return (entry.text || "") + " " + (entry.why || ""); }))
    .concat((mabel.knowledge || []).slice(0, 12).map(function (entry) { return (entry.item || "") + " " + (entry.fact || ""); }))
    .join(" ").toLowerCase();
  if (meaningful.some(function (word) { return savedTexts.includes(word); })) {
    return "It reminds Mabel of something she and a visitor talked about.";
  }
  if (item && Number(item.pleasure) >= 0.65) return "It made Mabel unexpectedly happy, so she kept it close.";
  if (Math.random() < 0.24) return "After carrying it for a while, Mabel found she had grown a little attached to it.";
  return "";
}

function moveBindleItemToTreasureBox(item, reason) {
  bindle.treasureBox = Array.isArray(bindle.treasureBox) ? bindle.treasureBox : [];
  bindle.treasureBox.unshift({ ...item, keptReason: reason, keptAt: now() });
  bindle.treasureBox = bindle.treasureBox.slice(0, 30);
  if (item && item.giftId && mabel.world && Array.isArray(mabel.world.objects)) {
    const gift = mabel.world.objects.find(function (object) { return object && object.id === item.giftId; });
    if (gift) {
      gift.status = "treasure box";
      gift.keptReason = reason;
      gift.keptAt = now();
    }
  }
  addFeedEntry({ kind: "noticed", text: "Mabel kept " + String(item && item.name || "a little treasure") + " in her treasure box.", why: reason });
}

function trimBindleItems(items, limit) {
  while (items.length > limit) {
    let leavingIndex = -1;
    for (let index = items.length - 1; index >= 0; index -= 1) {
      const item = items[index];
      if (!item) { leavingIndex = index; break; }
      const gift = item.giftId && mabel.world && Array.isArray(mabel.world.objects)
        ? mabel.world.objects.find(function (object) { return object && object.id === item.giftId && object.source === "visitor"; })
        : null;
      const receivedAt = Date.parse(gift && (gift.noticedAt || gift.at) || item.at || item.addedAt || "");
      const isVisitorGift = Boolean(gift || item.giftId || item.source === "visitor");
      const protectedGift = isVisitorGift && (!Number.isFinite(receivedAt) || Date.now() - receivedAt < 30 * 60 * 1000);
      if (!protectedGift) { leavingIndex = index; break; }
    }
    if (leavingIndex < 0) break;
    const leaving = items.splice(leavingIndex, 1)[0];
    const reason = bindleItemResonance(leaving);
    if (reason) moveBindleItemToTreasureBox(leaving, reason);
    else recordBindleDeparture(leaving, "discarded");
  }
}

function settleMatureBindleItems() {
  if (!bindle || !mabel) return;
  const groups = [
    { items: bindle.food || [], need: "food" },
    { items: bindle.water || [], need: "water" },
    { items: bindle.treasures || [], need: "" }
  ];
  let changed = false;
  groups.forEach(function (group) {
    for (let index = group.items.length - 1; index >= 0; index -= 1) {
      const item = group.items[index];
      if (!item) continue;
      const gift = item.giftId && mabel.world && Array.isArray(mabel.world.objects)
        ? mabel.world.objects.find(function (object) { return object && object.id === item.giftId; })
        : null;
      const receivedAt = Date.parse(gift && (gift.noticedAt || gift.at) || item.at || item.addedAt || "");
      if (!Number.isFinite(receivedAt) || Date.now() - receivedAt < 30 * 60 * 1000) continue;
      if (group.need && Number(mabel.needs[group.need]) < 0.48) continue;
      const reason = bindleItemResonance(item);
      group.items.splice(index, 1);
      if (reason) moveBindleItemToTreasureBox(item, reason);
      else recordBindleDeparture(item, "discarded");
      changed = true;
    }
  });
  if (changed) {
    saveBindle();
    saveMabel();
    updateBindle();
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

function runNeedsDrivenAutonomousWander() {
  if (!mabel || explorationInProgress || document.visibilityState !== "visible" || Number(mabel.needs.rest) < 0.18) return;
  const timestamp = Date.now();
  const minutesSinceWander = (timestamp - lastAutonomousWanderAt) / 60000;
  let motive = "";
  const food = Number(mabel.needs.food) || 0;
  const water = Number(mabel.needs.water) || 0;
  const curiosity = Number(mabel.needs.curiosity) || 0;
  const wonder = Number(mabel.needs.wonder) || 0;
  if (food < 0.34) motive = "her hunger was growing, so she went to look for something to eat";
  else if (water < 0.34) motive = "she was thirsty and wanted to look for clean water";
  else if (curiosity > 0.82) motive = "her curiosity was tugging her toward the path";
  else if (wonder < 0.28) motive = "she needed a change of scene and a little wonder";
  const urgent = food < 0.2 || water < 0.2;
  if (motive && minutesSinceWander >= (urgent ? 3 : 7)) {
    handleExplore({ autonomous: true, motive: motive });
    return;
  }
  if (timestamp >= nextAutonomousWanderAt && minutesSinceWander >= 8) {
    const gentleMotive = curiosity >= 0.6 ? "something she saw earlier left her curious" : "she felt ready to see what was beyond her familiar path";
    handleExplore({ autonomous: true, motive: gentleMotive });
  }
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
  const visitorAppearance = Array.isArray(artwork.visitorAppearance) ? artwork.visitorAppearance.join(" ").toLowerCase() : "";
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

  const referenceStudy = artwork.referenceRetry === true;
  const background = palette[0];
  node("rect", { x: 0, y: 0, width: 160, height: 160, fill: background });
  node("rect", { x: 0, y: 0, width: 160, height: 160, fill: "#f4ead6", opacity: 0.24 });

  // Layered, irregular washes give each picture its own balance and weight.
  const washCount = referenceStudy ? 2 + Math.floor(random() * 2) : 3 + Math.floor(random() * 4);
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
  const markCount = referenceStudy ? 10 + Math.floor(random() * 9) : 18 + Math.floor(random() * 27);
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
  } else if (motif === "hearts") {
    for (let i = 0; i < 6; i += 1) {
      const x = 24 + random() * 112;
      const y = 22 + random() * 112;
      const size = 4 + random() * 5;
      const colour = palette[1 + Math.floor(random() * 2)];
      path("M " + x + " " + (y + size * 0.35) +
        " C " + (x - size * 1.8) + " " + (y - size * 1.2) + " " + (x - size * 3) + " " + (y + size * 0.8) + " " + x + " " + (y + size * 2.5) +
        " C " + (x + size * 3) + " " + (y + size * 0.8) + " " + (x + size * 1.8) + " " + (y - size * 1.2) + " " + x + " " + (y + size * 0.35),
        colour, 1 + random(), 0.8, colour);
    }
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
  } else if (subject === "visitor") {
    const cx = 80 + random() * 4;
    const cy = 77 + random() * 4;
    const hairColour = /\b(?:black|dark) hair\b/i.test(visitorAppearance) ? "#403744"
      : /\b(?:brown|brunette) hair\b/i.test(visitorAppearance) ? "#715145"
      : /\b(?:blonde|blond) hair\b/i.test(visitorAppearance) ? "#c9a567"
      : /\b(?:ginger|red hair|red-haired)\b/i.test(visitorAppearance) ? "#ad6648"
      : /\b(?:grey|gray) hair\b/i.test(visitorAppearance) ? "#99928e"
      : palette[1];
    path("M 22 160 Q 28 119 58 112 L 80 107 L 102 112 Q 132 119 138 160 Z",
      palette[1], 2, 0.82, palette[1]);
    path("M 66 111 L 66 94 Q 80 101 94 94 L 94 116",
      "#d7b996", 1.2, 0.8, "#d7b996");
    softBlob(cx, cy - 2, 30, 37, hairColour, 0.82);
    softBlob(cx, cy + 1, 22, 30, "#f0dfc8", 0.96);
    if (/\b(?:hair|haired|bald)\b/i.test(visitorAppearance)) {
      softBlob(cx, cy - 25, 25, 13, hairColour, 0.9);
    } else {
      path("M 55 61 Q 80 43 105 61", hairColour, 4, 0.38);
    }
    ellipse(cx - 8, cy - 2, 1.7, 2.2, "#432a5e", 0.86, 0);
    ellipse(cx + 8, cy - 2, 1.7, 2.2, "#432a5e", 0.86, 0);
    path("M " + cx + " " + (cy + 2) + " Q " + (cx - 3) + " " + (cy + 10) + " " + (cx + 1) + " " + (cy + 11),
      "#8b6555", 1, 0.68);
    path("M " + (cx - 5) + " " + (cy + 18) + " Q " + cx + " " + (cy + 21) + " " + (cx + 5) + " " + (cy + 18),
      "#8b5260", 1.2, 0.75);
    if (/\b(?:glasses|spectacles)\b/i.test(visitorAppearance)) {
      node("rect", { x: cx - 19, y: cy - 8, width: 16, height: 12, rx: 4, fill: "none", stroke: "#4b4050", "stroke-width": 1.5, opacity: 0.85 });
      node("rect", { x: cx + 3, y: cy - 8, width: 16, height: 12, rx: 4, fill: "none", stroke: "#4b4050", "stroke-width": 1.5, opacity: 0.85 });
      path("M " + (cx - 3) + " " + (cy - 3) + " L " + (cx + 3) + " " + (cy - 3), "#4b4050", 1.2, 0.8);
    }
    if (/\b(?:mustache|moustache)\b/i.test(visitorAppearance)) {
      softBlob(cx - 4, cy + 13, 5, 2.4, hairColour, 0.75);
      softBlob(cx + 4, cy + 13, 5, 2.4, hairColour, 0.75);
    }
    if (/\b(?:beard|facial hair)\b/i.test(visitorAppearance)) {
      softBlob(cx, cy + 22, 13, 8, hairColour, 0.42);
    }
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

  if (Array.isArray(artwork.vectorPaths)) {
    artwork.vectorPaths.slice(0, 24).forEach(function (item) {
      if (!item || typeof item.d !== "string") return;
      const d = item.d.slice(0, 360);
      if (!/^[MmLlHhVvCcSsQqTtZz0-9.,+\-\s]+$/.test(d) || !/[MLCQ]/i.test(d)) return;
      const values = d.match(/-?\d+(?:\.\d+)?/g) || [];
      if (values.some(function (value) { return !Number.isFinite(Number(value)) || Number(value) < -20 || Number(value) > 180; })) return;
      const strokeIndex = Number.isInteger(item.stroke) && item.stroke >= 0 && item.stroke < 3 ? item.stroke : 2;
      const fillIndex = Number.isInteger(item.fill) && item.fill >= 0 && item.fill < 3 ? item.fill : -1;
      const width = typeof item.width === "number" ? Math.max(0.35, Math.min(5, item.width)) : 1.4;
      const opacity = typeof item.opacity === "number" ? Math.max(0.15, Math.min(1, item.opacity)) : 0.85;
      path(d, palette[strokeIndex], width, opacity, fillIndex >= 0 ? palette[fillIndex] : "none");
    });
  }

  const grainCount = referenceStudy ? 22 : 45;
  for (let i = 0; i < grainCount; i += 1) {
    const x = referenceStudy ? 8 + (i * 29) % 144 : random() * 160;
    const y = referenceStudy ? 10 + (i * 47) % 140 : random() * 160;
    ellipse(x, y, 0.3 + random() * 0.8, 0.3 + random() * 0.8,
      palette[2], referenceStudy ? 0.06 : 0.12 + random() * 0.15, 0);
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
  const visitorPortrait = isVisitorPortraitRequest(details.message);
  const requestedSubject = visitorPortrait ? "visitor" : requestedArtworkDescriptionSubject(details.message);
  artwork.at = artwork.at || artwork.createdAt || now();
  artwork.source = details.source || artwork.source || "autonomous";
  if (details.message) artwork.promptContext = String(details.message).trim().slice(0, 240);
  if (details.inspiration) {
    artwork.inspirationTitle = String(details.inspiration.title || "").slice(0, 100);
    artwork.inspirationContext = String(details.inspiration.question || "").slice(0, 240);
  }
  if (visitorPortrait) {
    const appearance = visitorAppearanceDetails(details.message);
    artwork.title = "Mabel drew her visitor";
    artwork.subject = "visitor";
    artwork.selfPortrait = false;
    artwork.description = "Mabel drew her visitor" + (appearance.length
      ? ", using details they had shared: " + appearance.join("; ") + "."
      : ", leaving any details she has not been told open.");
    artwork.visitorAppearance = appearance;
    artwork.note = artwork.description;
  } else if (requestedSubject) {
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
    artwork.description = "A little study of " + details.inspiration.title + ", in Mabel’s own colours.";
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
  updateArtExhibition();
  updateVisitorProfile();
  refreshGalleryNotice();
  let sharedArtworkUpdate = Promise.resolve();
  if (artwork.source === "autonomous") {
    sharedArtworkUpdate = fetch(MABEL_BRAIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "artwork",
        title: artwork.title,
        inspiration: artwork.inspirationContext,
        exhibitionArtwork: {
          id: String(artwork.id || artwork.title + "-" + (artwork.seed || artwork.createdAt || artwork.at || Date.now())),
          source: "autonomous",
          title: artwork.title,
          description: artwork.description || artwork.note || "",
          kind: artwork.kind || "moment",
          palette: artwork.palette,
          motif: artwork.motif,
          seed: artwork.seed,
          subject: artwork.subject || "",
          selfPortrait: Boolean(artwork.selfPortrait),
          symbols: artwork.symbols,
          at: artwork.at || artwork.createdAt || now(),
          inspirationContext: artwork.inspirationContext,
          inspirationTitle: artwork.inspirationTitle || ""
        }
      })
    }).then(function (response) { if (response.ok) refreshSharedMabelBrain(); }).catch(function () {});
  }
  return sharedArtworkUpdate;
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

function updateArtExhibition() {
  const list = document.getElementById("art-exhibition-works");
  const period = document.getElementById("art-exhibition-week");
  if (!list) return;
  list.replaceChildren();
  const exhibition = sharedMabelBrain && sharedMabelBrain.artExhibition;
  const weekOf = String(exhibition && exhibition.weekOf || "");
  const works = exhibition && Array.isArray(exhibition.works) ? exhibition.works : [];
  if (period) {
    const date = new Date(weekOf + "T00:00:00Z");
    period.textContent = weekOf && !isNaN(date.getTime())
      ? "This week’s exhibition · week of " + date.toLocaleDateString([], { dateStyle: "long", timeZone: "UTC" })
      : "Mabel’s little exhibition changes each week.";
  }
  if (!works.length) {
    const empty = document.createElement("li");
    empty.className = "gallery-empty";
    empty.textContent = "Mabel hasn’t chosen this week’s drawings yet. Her own little Gallery is still here.";
    list.appendChild(empty);
    return;
  }
  works.forEach(function (artwork) {
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
      button.addEventListener("click", function () { openGalleryArtworkDetails(artwork); });
      item.appendChild(button);
    }
    list.appendChild(item);
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
    if (artwork.source === "autonomous") {
      const vote = document.createElement("button");
      vote.type = "button";
      vote.className = "gallery-exhibition-vote";
      const bondReady = Number(visitorProfile.bond) >= 35;
      vote.disabled = !bondReady;
      vote.textContent = bondReady ? "♡ Vote for the exhibition" : "Get to know Mabel to vote";
      vote.setAttribute("aria-label", bondReady ? "Vote for this drawing to be considered for the Art Exhibition" : "Build a closer friendship to vote for an exhibition drawing");
      vote.addEventListener("click", function (event) {
        event.stopPropagation();
        castArtExhibitionVote(artwork, vote);
      });
      item.appendChild(vote);
    }
    galleryElement.appendChild(item);
  });
}

async function castArtExhibitionVote(artwork, button) {
  if (!artwork || Number(visitorProfile.bond) < 35) return;
  button.disabled = true;
  button.textContent = "Sending your vote…";
  try {
    if (!visitorProfile.visitorId) {
      visitorProfile.visitorId = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : "visitor-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
      saveVisitorProfile();
    }
    const response = await fetch(MABEL_BRAIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "exhibition-vote",
        artworkId: String(artwork.id || artwork.title + "-" + (artwork.seed || "")),
        visitorId: visitorProfile.visitorId,
        bond: Number(visitorProfile.bond) || 0
      })
    });
    const result = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(result.error || "Mabel couldn’t keep that vote just now.");
    button.textContent = result.alreadyVoted ? "♡ Your vote is already counted" : "♡ Vote counted";
    refreshSharedMabelBrain();
  } catch (error) {
    button.disabled = false;
    button.textContent = "♡ Try your vote again";
    button.title = error && error.message || "";
  }
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
  const rawContext = artwork.inspirationContext || artwork.promptContext || "";
  const contextText = artwork.referenceRetry
    ? (artwork.inspirationContext || "Mabel wanted to explore " + (artwork.subject || artwork.title || "this subject") + " more creatively after studying a visual reference at the Library.")
    : artwork.visitorPortrait
      ? (visitorAppearanceDetails("").length
        ? "Mabel drew this visitor using all she’s learned about you."
        : "Mabel used her imagination to draw this visitor.")
      : artwork.exhibitionReason
        ? artwork.exhibitionReason
        : artwork.source === "autonomous"
          ? (artwork.inspirationTitle
            ? "Mabel was reflecting on " + artwork.inspirationTitle + "."
            : "Made during one of Mabel’s own quiet moments.")
          : artwork.source === "comfort"
            ? "Made with care after your message."
            : artwork.source === "visitor"
              ? (rawContext ? "Mabel made this for you, drawing on what she knows about you." : "Mabel made this especially for you.")
              : rawContext;
  if (contextLabel && artwork.exhibitionReason) contextLabel.textContent = "Why Mabel chose it";
  else if (contextLabel) contextLabel.textContent = artwork.referenceRetry ? "What led to it" : "A little about this drawing";
  context.textContent = contextText;
  const contextBlock = document.getElementById("gallery-detail-context-block");
  if (contextLabel) contextLabel.hidden = !contextText;
  if (contextBlock) contextBlock.hidden = !contextText;
  const exhibitionDate = document.getElementById("gallery-detail-exhibition-date");
  if (exhibitionDate) {
    const added = Date.parse(artwork.exhibitionAddedAt || "");
    exhibitionDate.hidden = !Number.isFinite(added);
    exhibitionDate.textContent = Number.isFinite(added)
      ? "Chosen for the exhibition on " + new Date(added).toLocaleDateString([], { dateStyle: "long" }) + "."
      : "";
  }
  if (dialog.parentElement !== document.body) document.body.appendChild(dialog);
  if (typeof dialog.showModal === "function") {
    if (dialog.open) dialog.close();
    dialog.showModal();
  } else dialog.setAttribute("open", "");
}

function loadBindle() {
  try {
    const saved = localStorage.getItem(bindleStorageKey) || sessionStorage.getItem(bindleStorageKey);
    if (saved) {
      try { localStorage.setItem(bindleStorageKey, saved); } catch (ignored) {}
      const loaded = JSON.parse(saved);
      return { food: [], water: [], treasures: [], treasureBox: [], history: [], ...loaded };
    }
  } catch (error) {
    // Fall through to an empty bindle.
  }
  return { food: [], water: [], treasures: [], treasureBox: [], history: [] };
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
    personality: { core_traits: ["gentle", "curious", "thoughtful", "quietly playful"], evolved_traits: [] },
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
    const latestActionAge = latestAction ? Date.now() - Date.parse(latestAction.at || "") : Infinity;
    if (!entry.force && latestAction && normalizeAction(latestAction.text) === normalizeAction(entry.text) && latestActionAge >= 0 && latestActionAge < 5 * 60 * 1000) return latestAction;
  }
  const suppliedTimestamp = Date.parse(entry && entry.at);
  const savedEntry = {
    ...entry,
    at: Number.isFinite(suppliedTimestamp) ? new Date(suppliedTimestamp).toISOString() : now(),
    ok: true
  };
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

  // Slow background drift; specific actions below account for meaningful changes.
  mabel.needs.food = clampNeed(mabel.needs.food - 0.002);
  mabel.needs.water = clampNeed(mabel.needs.water - 0.003);
  mabel.needs.rest = clampNeed(mabel.needs.rest + (chosen === "rest_in_hollow" ? 0.1 : -0.0015));
  if (["rest_in_hollow", "sit_by_the_path", "listen_to_rain", "play_a_small_game"].includes(chosen)) {
    mabel.needs.comfort = clampNeed(mabel.needs.comfort + 0.012);
  }
  if (["find_a_treasure", "inspect_a_leaf", "listen_for_small_creatures", "make_a_tiny_map"].includes(chosen)) {
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.025);
  } else if (!pursueInterest) {
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity - 0.002);
  }
  mabel.needs.connection = clampNeed(mabel.needs.connection - 0.0003);
  if (["find_a_treasure", "visit_the_berry_patch", "follow_a_scent"].includes(chosen)) {
    mabel.needs.wonder = clampNeed(mabel.needs.wonder + 0.025);
  }

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
      const findingResearch = addResearchIdea({
        id: "found-" + normalizeInterestTitle(find.name) + "-" + String(outing.at).replace(/[^0-9]/g, "").slice(-8),
        title: find.name,
        question: "Mabel found " + find.name + " while wandering. Look up the meaningful object or material in this finding, then bring back one interesting fact.",
        searchTerm: researchKeywordFromFinding(find.name),
        source: "exploration",
        originText: "Mabel found " + find.name + (find.note ? ": " + find.note : " while wandering."),
        evidenceText: "Mabel found " + find.name + " while wandering.",
        originAt: outing.at,
        grounded: true
      });
      if (findingResearch) scheduleWanderingResearch(findingResearch);
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
      trimBindleItems(bindle.food, 8);
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
      trimBindleItems(bindle.water, 5);
    }
  }

  let eatenFromBindle = "";
  if (chosen === "eat_stored_food" && bindle.food.length > 0) {
    const meal = bindle.food.shift();
    recordBindleDeparture(meal, "eaten");
    mabel.needs.food = clampNeed(mabel.needs.food + 0.24);
    activityOverride = "eating " + meal.name + " from her bindle";
    eatenFromBindle = meal.name;
    if (meal.giftId && mabel.world && Array.isArray(mabel.world.objects)) {
      const eatenGift = mabel.world.objects.find(function (object) { return object.id === meal.giftId; });
      if (eatenGift) {
        eatenGift.status = "eaten";
        eatenGift.consumedAt = now();
      }
    }
  }
  if (chosen === "drink_stored_water" && bindle.water.length > 0) {
    const drink = bindle.water.shift();
    recordBindleDeparture(drink, "drank");
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
    text: eatenFromBindle
      ? "Mabel ate " + eatenFromBindle + " from her bindle."
      : mabel.now.doing,
    why: eatenFromBindle
      ? "She was hungry and chose something she had saved."
      : (pursueInterest ? activeInterests[0].question : "Mabel chose this for herself.")
  });
  saveMabel();
  updatePage();
  persistSharedNeeds();
}

function applyExplorationFinds(findings) {
  ensureHollowWorld();
  (findings || []).forEach(function (found) {
    const kind = ["food", "water", "treasure"].includes(found.kind) ? found.kind : "treasure";
    const name = String(found.name || "something small").slice(0, 80);
    const note = String(found.note || "").slice(0, 160);

    if (kind === "water" && isUncleanWater(name)) {
      mabel.needs.comfort = clampNeed(mabel.needs.comfort - 0.08);
      mabel.now.mood = "disappointed";
      addFeedEntry({ kind: "did", text: "Mabel found " + name + " and left it alone.", why: "It looked too muddy for a safe drink." });
    } else if (kind === "food") {
      if (mabel.needs.food < 0.58) {
        mabel.needs.food = clampNeed(mabel.needs.food + 0.24);
        addFeedEntry({ kind: "did", text: "Mabel found and ate " + name + ".", why: note || "She was hungry." });
      } else {
        bindle.food.unshift({ name: name, note: note });
        trimBindleItems(bindle.food, 8);
      }
    } else if (kind === "water") {
      if (mabel.needs.water < 0.58) {
        mabel.needs.water = clampNeed(mabel.needs.water + 0.26);
        addFeedEntry({ kind: "did", text: "Mabel found water and had a drink.", why: note || name });
      } else {
        bindle.water.unshift({ name: name, note: note });
        trimBindleItems(bindle.water, 5);
      }
    } else {
      bindle.treasures.unshift({ name: name, note: note });
      trimBindleItems(bindle.treasures, 12);
      mabel.world.objects.unshift({ name: name, at: now(), source: "wandering", visitSessionId: currentVisitorSessionId(), note: note, reaction: "" });
      mabel.world.objects.length = Math.min(mabel.world.objects.length, 20);
      mabel.needs.wonder = clampNeed(mabel.needs.wonder + 0.08);
    }
  });
  saveBindle();
}

function scheduleWanderingResearch(researchLead) {
  if (!researchLead || !researchLead.id) return;
  const delay = researchLead.requestType === "art-reference"
    ? 45 * 1000 + Math.random() * 45 * 1000
    : 60 * 1000 + Math.random() * 60 * 1000;
  window.setTimeout(function () {
    const queuedIdea = researchIdeas.find(function (idea) { return idea && idea.id === researchLead.id; });
    if (!mabel || !queuedIdea || queuedIdea.lastResearchedAt) return;
    if (queuedIdea.requestType === "art-reference") {
      queuedIdea.artReferenceAttempts = (Number(queuedIdea.artReferenceAttempts) || 0) + 1;
      saveResearchIdeas();
    }
    mabel.now.doing = "going to the Library";
    mabel.now.thought = "I want to find out a little more about " + queuedIdea.title + ".";
    const libraryStartedAt = now();
    mabel.now.updatedAt = libraryStartedAt;
    addFeedEntry({
      at: libraryStartedAt,
      kind: "did",
      force: true,
      text: queuedIdea.requestType === "art-reference"
        ? "Mabel went to the Library to find a visual reference for " + queuedIdea.title + "."
        : "Mabel went to the Library to research " + queuedIdea.title + ".",
      why: queuedIdea.originText || "A discovery from her wander stayed on her mind."
    });
    researchLog = researchLog.filter(function (entry) { return !(entry && entry.researchId === queuedIdea.id); });
    researchLog.unshift({
      id: "library-" + queuedIdea.id,
      researchId: queuedIdea.id,
      kind: "research",
      at: libraryStartedAt,
      requestType: queuedIdea.requestType || "",
      focusTitle: queuedIdea.title,
      focusQuestionTitle: queuedIdea.title,
      searchTerm: queuedIdea.searchTerm || queuedIdea.title,
      searchQuestion: queuedIdea.searchTerm || queuedIdea.title,
      sourceOriginText: queuedIdea.originText || "",
      inProgress: true
    });
    researchLog = researchLog.slice(0, 30);
    saveResearchLog();
    saveMabel();
    updatePage();
    if (exploreStatus) exploreStatus.textContent = "Mabel has gone to the Library to look up " + queuedIdea.title + ".";
    handleWander({ focusInterest: queuedIdea }).then(function (result) {
      if (result && result.related) {
        lastAutonomousResearchAt = Date.now();
        try { localStorage.setItem(autonomousResearchStorageKey, String(lastAutonomousResearchAt)); } catch (error) {}
        if (exploreStatus) exploreStatus.textContent = "Mabel has come back from the Library with a little fact for your postbox.";
      } else if (exploreStatus) {
        exploreStatus.textContent = "Sometimes a finding sends Mabel to the Library; today, she has brought back a little wonder.";
      }
      if (queuedIdea.requestType === "art-reference" && !(result && result.artReference && result.artReference.imageUrl)) {
        if ((Number(queuedIdea.artReferenceAttempts) || 0) < 3) {
          window.setTimeout(function () { scheduleWanderingResearch(queuedIdea); }, 5 * 60 * 1000);
        } else {
          addFeedEntry({ kind: "did", text: "Mabel will look for another visual reference for " + queuedIdea.title + " later.", why: "The first few Library searches did not return a picture the art studio could use." });
          saveMabel();
          updatePage();
        }
      }
    });
  }, delay);
}

async function handleExplore(options) {
  options = options || {};
  const autonomous = options.autonomous === true;
  if (!mabel || explorationInProgress || (!autonomous && exploreButton && exploreButton.disabled)) return;
  explorationInProgress = true;
  if (autonomous) autonomousWanderInProgress = true;
  if (!autonomous && exploreButton) exploreButton.disabled = true;
  if (exploreStatus) exploreStatus.textContent = "Mabel has set off to see what turns up.";
  try {
    const findCount = 1 + Math.floor(Math.random() * 3);
    const finds = diversifyWanderFinds(Array.from({ length: findCount }, function () { return null; })).map(function (item) {
      return { ...item, curiosityScore: Math.random() };
    });
    const outing = {
      kind: "exploration",
      at: now(),
      title: autonomous ? "Mabel went on her own wander" : "A little wander near home",
      autonomous: autonomous,
      motive: String(options.motive || ""),
      finds: finds
    };
    if (autonomous) {
      autonomousExplorerLog.unshift(outing);
      autonomousExplorerLog = autonomousExplorerLog.slice(0, 24);
      saveAutonomousExplorerLog();
    } else {
      wanderings.unshift(outing);
      wanderings.length = Math.min(wanderings.length, 30);
    }
    applyExplorationFinds(finds);
    fetch(MABEL_BRAIN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "exploration", finds: finds.map(function (item) { return item && item.name; }).filter(Boolean) }) }).catch(function () {});
    const averageCuriosity = finds.length
      ? finds.reduce(function (total, item) { return total + (Number(item.curiosityScore) || 0); }, 0) / finds.length
      : 0;
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.04 + averageCuriosity * 0.05);
    mabel.now.doing = autonomous ? "wandering on her own" : "exploring near her home";
    mabel.now.thought = finds.length
      ? "What might these small discoveries turn out to be?"
      : "The path looks different today.";
    const foundUncleanWater = finds.some(function (item) { return item.kind === "water" && isUncleanWater(item.name); });
    mabel.now.mood = foundUncleanWater ? "disappointed" : "curious";
    if (foundUncleanWater) mabel.now.thought = "That puddle looked like a drink, but the mud made me hesitate. I’ll keep looking for something clean.";
    mabel.now.updatedAt = now();
    addFeedEntry({
      kind: "noticed",
      text: autonomous
        ? "Mabel went on her own wander and found " + (finds.map(function (item) { return item.name; }).join(" and ") || "a new path") + "."
        : "Mabel went exploring and found " + (finds.map(function (item) { return item.name; }).join(" and ") || "a new path") + ".",
      why: autonomous ? (options.motive || "She felt ready for a little wander.") : finds.map(function (item) { return item.note; }).filter(Boolean).join(" ")
    });
    const curiosityLeads = finds.filter(function (found) { return Number(found.curiosityScore) >= 0.76; });
    curiosityLeads.forEach(function (found) {
      const curiosityQuestion = "What is " + found.name + ", and what surprising story or use might it have?";
      const origin = "Mabel found " + found.name + " while wandering" + (found.note ? ": " + found.note : ".");
      recordSpark({
        id: "finding-curiosity-" + normalizeInterestTitle(found.name),
        title: found.name,
        kind: "curiosity",
        question: curiosityQuestion,
        reason: "This finding caught Mabel’s curiosity more strongly than most.",
        source: "exploration",
        originText: origin,
        originAt: outing.at,
        grounded: true
      });
      queueCuriosityPostboxMail(found, outing.at);
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
    if (!autonomous) saveWanderings();
    if (autonomous) {
      lastAutonomousWanderAt = Date.now();
      try { localStorage.setItem(autonomousExplorerStorageKey + "-last", String(lastAutonomousWanderAt)); } catch (error) {}
      nextAutonomousWanderAt = lastAutonomousWanderAt + (10 + Math.random() * 10) * 60 * 1000;
    }
    saveMabel();
    updatePage();
    if (exploreStatus) exploreStatus.textContent = "Mabel found " + finds.map(function (item) { return item.name; }).join(" and ") + ".";
    const researchLead = researchIdeasFromFinds.find(function (idea) { return idea && curiosityLeads.some(function (found) { return normalizeInterestTitle(found.name) === normalizeInterestTitle(idea.title); }); }) || researchIdeasFromFinds[0];
    if (researchLead) scheduleWanderingResearch(researchLead);
  } finally {
    explorationInProgress = false;
    autonomousWanderInProgress = false;
    if (!autonomous && exploreButton) exploreButton.disabled = false;
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

function sharedMabelInterestList() {
  const shared = sharedMabelBrain && sharedMabelBrain.interests;
  if (!Array.isArray(shared)) return Array.isArray(mabel.interests) ? mabel.interests : [];
  const merged = shared.slice();
  (Array.isArray(mabel.interests) ? mabel.interests : []).forEach(function (local) {
    if (!merged.some(function (item) { return item.id === local.id || normalizeInterestTitle(item.title) === normalizeInterestTitle(local.title); })) merged.push(local);
  });
  return merged.map(function (interest) {
    const events = Array.isArray(interest.events) ? interest.events : [];
    const pull = Number(interest.pull) || 0;
    return { ...interest, level: Math.max(1, Math.min(5, 1 + Math.floor(Math.max(0, pull - 0.45) * 5))), progress: events.length, steps: events, reason: events[0] && events[0].text || interest.reason || "", stage: interest.stage || "wondering" };
  });
}

function updateInterests() {
  if (!interestsElement) return;
  interestsElement.replaceChildren();
  const hobbiesByName = new Map();
  sharedMabelInterestList()
    .filter(function (interest) {
      return interest && interest.kind === "hobby" && isConcreteHumanHobby(interest.title);
    })
    .forEach(function (interest) {
      const key = normalizeInterestTitle(String(interest.title || "").replace(/\s+(?:hobby\s*)?level\s*\d+$/i, ""));
      const current = hobbiesByName.get(key);
      if (!current || (Number(interest.level) || 1) > (Number(current.level) || 1) ||
          ((Number(interest.level) || 1) === (Number(current.level) || 1) && Date.parse(interest.lastSeenAt || interest.createdAt || 0) > Date.parse(current.lastSeenAt || current.createdAt || 0))) {
        hobbiesByName.set(key, interest);
      }
    });
  const hobbies = Array.from(hobbiesByName.values()).sort(function (a, b) { return (Number(b.level) || 1) - (Number(a.level) || 1); });

  if (!hobbies.length) {
    const empty = document.createElement("li");
    empty.textContent = "No hobby has taken root yet. Mabel’s questions and passing fascinations gather below.";
    interestsElement.appendChild(empty);
    return;
  }

  hobbies.forEach(function (interest) {
    const item = document.createElement("li");
    item.className = "interest-item";
    const title = document.createElement("strong");
    title.className = "interest-title";
    title.textContent = interest.title;
    item.appendChild(title);
    const newAt = Date.parse(interest.createdAt || "");
    if (Number.isFinite(newAt) && Date.now() - newAt < 7 * 24 * 60 * 60 * 1000) {
      const newBadge = document.createElement("span");
      newBadge.className = "visitor-gift-badge";
      newBadge.textContent = "New";
      item.appendChild(newBadge);
    }

    const level = Math.max(1, Math.min(5, Number(interest.level) || 1));
    const levelBadge = document.createElement("span");
    levelBadge.className = "interest-stage hobby-level";
    levelBadge.textContent = "Hobby · Level " + level;
    item.appendChild(levelBadge);

    if (interest.reason || interest.originText) {
      const why = document.createElement("span");
      why.className = "interest-reason";
      why.textContent = "Why it caught her attention: " + String(interest.reason || interest.originText);
      item.appendChild(why);
    }

    const steps = Array.isArray(interest.steps) ? interest.steps.length : (Number(interest.progress) || 0);
    const stage = document.createElement("span");
    stage.className = "interest-stage";
    stage.textContent = interest.stage === "resting"
      ? "Paused for now · Mabel can return to it"
      : (steps > 0
        ? "Growing through " + steps + (steps === 1 ? " small step" : " small steps")
        : (level === 1 ? "Just beginning" : "Growing"));
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
    interestsElement.appendChild(item);
  });
}

function updateMindTopics() {
  if (!mindTopicsElement) return;
  mindTopicsElement.replaceChildren();
  const entries = [];
  const addEntry = function (entry) {
    if (!entry || !entry.title) return;
    const key = normalizeInterestTitle(entry.title);
    if (!key || entries.some(function (saved) { return normalizeInterestTitle(saved.title) === key; })) return;
    const questionText = String(entry.question || "").trim().slice(0, 240);
    const whyText = String(entry.originText || entry.reason || (Array.isArray(entry.events) && entry.events[0] && entry.events[0].text) || "").trim().slice(0, 260);
    const questionKey = normalizeInterestTitle(questionText);
    const whyKey = normalizeInterestTitle(whyText);
    entries.push({
      title: String(entry.title).slice(0, 100),
      question: questionKey && questionKey !== key ? questionText : "",
      why: whyKey && whyKey !== key && whyKey !== questionKey && !whyKey.includes(questionKey) && !questionKey.includes(whyKey) ? whyText : "",
      at: entry.originAt || entry.createdAt || entry.lastSeenAt || ""
    });
  };

  sharedMabelInterestList().forEach(function (interest) {
    if (interest && !(interest.kind === "hobby" && isConcreteHumanHobby(interest.title))) addEntry(interest);
  });
  (Array.isArray(sparks) ? sparks : []).forEach(function (spark) {
    if (spark && !spark.interestPromotedAt) addEntry(spark);
  });
  (Array.isArray(researchIdeas) ? researchIdeas : []).forEach(addEntry);

  entries.sort(function (a, b) { return Date.parse(b.at || 0) - Date.parse(a.at || 0); });
  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "Nothing is tugging at Mabel’s thoughts just now. New questions may grow from a conversation, a find, or something she researches.";
    mindTopicsElement.appendChild(empty);
    return;
  }

  entries.slice(0, 10).forEach(function (entry) {
    const item = document.createElement("li");
    item.className = "interest-item mind-topic";
    const title = document.createElement("strong");
    title.className = "interest-title";
    title.textContent = entry.title;
    item.appendChild(title);
    if (entry.question) {
      const question = document.createElement("span");
      question.className = "interest-question";
      question.textContent = entry.question;
      item.appendChild(question);
    }
    if (entry.why) {
      const why = document.createElement("span");
      why.className = "interest-reason";
      why.textContent = "What brought it to mind: " + entry.why;
      item.appendChild(why);
    }
    mindTopicsElement.appendChild(item);
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
    return entry.kind === "mind" && entry.personalityChange === true && entry.sparkId;
  });

  if (changeEntries.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No lasting Spark has taken root yet. Mabel’s passing thoughts and questions stay in her diary and activity log.";
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

function updateCrafting() {
  const list = document.getElementById("crafting-projects");
  if (!list) return;
  list.replaceChildren();
  const crafting = sharedMabelBrain && sharedMabelBrain.crafting;
  const level = document.getElementById("crafting-level");
  const skillLevel = Number(crafting && crafting.skillLevel) || 0;
  if (level) level.textContent = skillLevel > 0 ? "Crafting practice · Level " + skillLevel + " — Mabel is learning by trying her ideas." : "Mabel has not tried crafting yet; her first ideas will grow from things she finds.";
  const projects = crafting && Array.isArray(crafting.projects) ? crafting.projects : [];
  if (!projects.length) {
    const empty = document.createElement("li"); empty.className = "brain-trait-empty";
    empty.textContent = "No invention idea yet. Mabel can dream one up after she has gathered at least two materials on her wanders.";
    list.appendChild(empty); return;
  }
  const materialList = document.getElementById("crafting-materials");
  const materials = crafting && Array.isArray(crafting.materials) ? crafting.materials.slice(0, 12) : [];
  if (materialList) {
    materialList.replaceChildren();
    if (!materials.length) {
      const emptyMaterial = document.createElement("li");
      emptyMaterial.className = "brain-trait-empty";
      emptyMaterial.textContent = "Mabel hasn’t gathered any making materials yet.";
      materialList.appendChild(emptyMaterial);
    } else {
      materials.forEach(function (material) {
        const materialItem = document.createElement("li");
        materialItem.textContent = material.name;
        materialList.appendChild(materialItem);
      });
    }
  }
  projects.slice(0, 8).forEach(function (project) {
    const item = document.createElement("li"); item.className = "interest-item craft-project";
    const title = document.createElement("strong"); title.className = "interest-title"; title.textContent = project.title || "A mouse-sized invention"; item.appendChild(title);
    const materials = document.createElement("span"); materials.className = "interest-stage"; materials.textContent = "Using things she found: " + (Array.isArray(project.materials) ? project.materials.join(" + ") : ""); item.appendChild(materials);
    const idea = document.createElement("p"); idea.className = "interest-reason"; idea.textContent = project.idea || ""; item.appendChild(idea);
    const stage = document.createElement("span"); stage.className = "interest-stage"; stage.textContent = project.tried ? "Mabel tried making it" : "An idea Mabel wants to try"; item.appendChild(stage);
    list.appendChild(item);
  });
}

function updateBaking() {
  const baking = sharedMabelBrain && sharedMabelBrain.baking || {};
  const level = document.getElementById("baking-level");
  const pantryList = document.getElementById("baking-pantry");
  const log = document.getElementById("baking-log");
  const skill = Math.max(0, Number(baking.skillLevel) || 0);
  if (level) level.textContent = skill
    ? "Baking practice · Level " + skill + " — Mabel is learning by trying small recipes."
    : "Mabel’s baking hobby is just beginning; she’ll try a treat when she has suitable ingredients.";
  if (pantryList) {
    pantryList.replaceChildren();
    const pantry = Array.isArray(baking.pantry) ? baking.pantry.slice(0, 12) : [];
    if (!pantry.length) {
      const empty = document.createElement("li");
      empty.className = "brain-trait-empty";
      empty.textContent = "No baking ingredients gathered yet.";
      pantryList.appendChild(empty);
    } else {
      pantry.forEach(function (ingredient) {
        const item = document.createElement("li");
        item.textContent = ingredient.name || "A little ingredient";
        pantryList.appendChild(item);
      });
    }
  }
  if (log) {
    log.replaceChildren();
    const treats = Array.isArray(baking.treats) ? baking.treats.slice(0, 8) : [];
    if (!treats.length) {
      const empty = document.createElement("li");
      empty.className = "brain-trait-empty";
      empty.textContent = "No little baked treats yet.";
      log.appendChild(empty);
    } else {
      treats.forEach(function (treat) {
        const item = document.createElement("li");
        item.className = "interest-item";
        const title = document.createElement("strong");
        title.className = "interest-title";
        title.textContent = treat.title || "A little baked treat";
        item.appendChild(title);
        if (treat.at) {
          const time = document.createElement("time");
          time.dateTime = treat.at;
          time.textContent = new Date(treat.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
          item.appendChild(time);
        }
        const description = document.createElement("p");
        description.className = "interest-reason";
        description.textContent = treat.description || "";
        item.appendChild(description);
        if (Array.isArray(treat.ingredients) && treat.ingredients.length) {
          const ingredients = document.createElement("span");
          ingredients.className = "interest-stage";
          ingredients.textContent = "Made with " + treat.ingredients.join(" and ");
          item.appendChild(ingredients);
        }
        log.appendChild(item);
      });
    }
  }
}

function updateCoding() {
  const coding = sharedMabelBrain && sharedMabelBrain.coding || {};
  const level = document.getElementById("coding-level");
  const list = document.getElementById("coding-projects");
  const skill = Math.max(0, Number(coding.skillLevel) || 0);
  if (level) level.textContent = skill
    ? "Coding practice · Level " + skill + " — Mabel is learning through small experiments."
    : "If coding becomes one of Mabel’s hobbies, she may start a tiny programming experiment.";
  if (!list) return;
  list.replaceChildren();
  const projects = Array.isArray(coding.projects) ? coding.projects.slice(0, 6) : [];
  if (!projects.length) {
    const empty = document.createElement("li");
    empty.className = "brain-trait-empty";
    empty.textContent = "Mabel hasn’t written a little program yet.";
    list.appendChild(empty);
    return;
  }
  projects.forEach(function (project) {
    const item = document.createElement("li");
    item.className = "interest-item coding-project";
    const title = document.createElement("strong");
    title.className = "interest-title";
    title.textContent = project.title || "A tiny code experiment";
    item.appendChild(title);
    if (project.at) {
      const time = document.createElement("time");
      time.dateTime = project.at;
      time.textContent = new Date(project.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
      item.appendChild(time);
    }
    const note = document.createElement("p");
    note.className = "interest-reason";
    note.textContent = project.note || "";
    item.appendChild(note);
    const code = document.createElement("pre");
    code.className = "coding-project-code";
    const codeText = document.createElement("code");
    codeText.textContent = String(project.code || "").slice(0, 1800);
    code.appendChild(codeText);
    item.appendChild(code);
    list.appendChild(item);
  });
}

function updateBrain() {
  const mood = document.getElementById("brain-mood");
  const moodScore = document.getElementById("brain-mood-score");
  const thought = document.getElementById("brain-thought");
  const shared = sharedMabelBrain || {};
  const personality = shared.personality || (mabel && mabel.personality) || {};
  const coreTraits = Array.isArray(personality.core_traits) ? personality.core_traits : [];
  const evolvedTraits = Array.isArray(personality.evolved_traits) ? personality.evolved_traits : [];
  updateCrafting();
  updateBaking();
  updateCoding();
  if (mood) mood.textContent = shared.mood || mabel.now.mood || "quiet";
  if (thought) thought.textContent = "“" + (shared.thought || mabel.now.thought || "Mabel is listening to the hollow.") + "”";
  if (moodScore) {
    const needs = Object.values((mabel && mabel.needs) || {}).map(Number).filter(Number.isFinite);
    const balance = needs.length ? Math.round(needs.reduce(function (sum, value) { return sum + clampNeed(value); }, 0) / needs.length * 100) : 0;
    moodScore.textContent = balance + " / 100";
  }
  if (brainCoreTraitsElement) {
    brainCoreTraitsElement.replaceChildren();
    coreTraits.forEach(function (trait) {
      const item = document.createElement("li");
      item.textContent = typeof trait === "string" ? trait : String(trait && trait.trait || "");
      brainCoreTraitsElement.appendChild(item);
    });
  }
  if (brainEvolvedTraitsElement) {
    brainEvolvedTraitsElement.replaceChildren();
    if (!evolvedTraits.length) {
      const empty = document.createElement("li");
      empty.className = "brain-trait-empty";
      empty.textContent = "Nothing has taken root yet. These will appear as Mabel returns to the same small feeling or habit.";
      brainEvolvedTraitsElement.appendChild(empty);
    } else {
      evolvedTraits.slice(0, 18).forEach(function (entry) {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        title.textContent = entry.trait || "";
        item.appendChild(title);
        if (entry.reason) {
          const reason = document.createElement("p");
          reason.textContent = entry.reason;
          item.appendChild(reason);
        }
        if (entry.date_added) {
          const date = document.createElement("time");
          date.dateTime = entry.date_added;
          date.textContent = new Date(entry.date_added).toLocaleDateString([], { dateStyle: "medium" });
          item.appendChild(date);
        }
        brainEvolvedTraitsElement.appendChild(item);
      });
    }
  }
}

async function refreshSharedMabelBrain() {
  if (sharedMabelBrainLoading) return;
  sharedMabelBrainLoading = true;
  try {
    const response = await fetch(MABEL_BRAIN_URL, { method: "GET", cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data && data.brain && data.brain.personality) {
      sharedMabelBrain = data.brain;
      if (mabel && Array.isArray(data.brain.lifeLog)) {
        data.brain.lifeLog.slice().reverse().forEach(function (entry) {
          if (!entry || !entry.id || mabel.feed.some(function (saved) { return saved && saved.sharedLifeId === entry.id; })) return;
          mabel.feed.unshift({
            id: "shared-" + entry.id,
            sharedLifeId: entry.id,
            at: entry.at || now(),
            kind: entry.kind || "did",
            text: entry.text || "Mabel did something during her day.",
            why: entry.why || "A moment from Mabel’s own life."
          });
        });
        mabel.feed = mabel.feed.slice(0, 80);
        updateActivityLog();
      }
      if (mabel && data.brain.needs && typeof data.brain.needs === "object") {
        mabel.needs = { ...mabel.needs, ...data.brain.needs };
        sharedNeedsBaseline = { ...data.brain.needs };
        saveMabel();
        updateNeeds();
      }
      updateBrain();
      updateInterests();
      updateMindTopics();
      updateCrafting();
      updateArtExhibition();
    }
  } catch (error) {
    // Keep the browser's current Brain view if the shared Worker is unavailable.
  } finally {
    sharedMabelBrainLoading = false;
  }
}

function addEvolvedTrait(candidate, evidence) {
  if (!candidate || typeof candidate !== "object") return false;
  const trait = String(candidate.trait || "").trim().replace(/\s+/g, " ").slice(0, 100);
  const reason = String(candidate.reason || "").trim().replace(/\s+/g, " ").slice(0, 240);
  if (trait.length < 4 || reason.length < 20 || !textSharesSpecificDetail(reason, evidence)) return false;
  const personality = mabel.personality || (mabel.personality = { core_traits: [], evolved_traits: [] });
  personality.evolved_traits = Array.isArray(personality.evolved_traits) ? personality.evolved_traits : [];
  const key = normalizeInterestTitle(trait);
  if (personality.evolved_traits.some(function (entry) { return normalizeInterestTitle(entry && entry.trait) === key; })) return false;
  personality.evolved_traits.unshift({ trait: trait, reason: reason, date_added: new Date().toISOString().slice(0, 10) });
  personality.evolved_traits = personality.evolved_traits.slice(0, 18);
  return true;
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

function formatActivityTime(value) {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return "--:--";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(timestamp));
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
    const time = formatActivityTime(entry.at);
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
  if (method.includes("encyclopedia")) return "on a public encyclopedia website";
  return "on a library computer";
}

function libraryResourceMethod(source, fallback) {
  const title = String(source && source.title || "").toLowerCase();
  const url = String(source && source.url || "").toLowerCase();
  if (/wikipedia|britannica|encyclop|reference/.test(title + " " + url)) return "the library’s online encyclopedia";
  if (/journal|doi\.org|pubmed|nature\.com|sciencedirect|academic/.test(title + " " + url)) return "a journal archive";
  if (/magazine|smithsonianmag|nationalgeographic|newyorker|atlasobscura/.test(title + " " + url)) return "a magazine archive";
  if (/newspaper|news|bbc\.com|theguardian|nytimes|reuters|apnews/.test(title + " " + url)) return "an online newspaper archive";
  const method = formatLibraryMethod(fallback);
  if (method.includes("public computer by the window")) return "the public computer by the window";
  if (method.includes("public PC")) return "the library’s public PC";
  if (method.includes("web browser")) return "the library’s web browser";
  return "a library computer";
}

function followUpQuestionForResearch(focusInterest, result) {
  const supplied = String(result && (result.followUpQuestion || result.nextQuestion || (result.interest && result.interest.question)) || "").trim();
  if (supplied.length >= 12 && supplied.length <= 220) return supplied;
  const subject = String(result && (result.title || result.searchQuestion) || focusInterest && focusInterest.title || "that subject").trim();
  return "What might people want to know next about " + subject + "?";
}

function updateResearchLog() {
  const list = document.getElementById("research-log");
  if (!list) return;
  list.replaceChildren();

  if (!researchLog.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel hasn’t done any research yet.";
    list.appendChild(empty);
    return;
  }
  const status = document.getElementById("wander-status");
  if (status && /hasn’t (?:brought back|done) any research yet/i.test(status.textContent)) {
    status.textContent = "";
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
      timestamp.textContent = new Date(entry.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
      item.appendChild(timestamp);
    }
    const sourceEntries = Array.isArray(entry.sources) && entry.sources.length
      ? entry.sources.slice(0, 3)
      : (entry.url && entry.sourceTitle ? [{ title: entry.sourceTitle, url: entry.url }] : []);
    const firstSource = sourceEntries.find(function (source) { return source && source.title; }) || null;
    const inspiration = String(entry.sourceOriginText || "a question that stayed with her")
      .replace(/\s+/g, " ")
      .replace(/^Mabel found\s+/i, "")
      .replace(/\s+(?:while wandering|on her wander).*$/i, "")
      .replace(/:.*$/, "")
      .trim()
      .slice(0, 90);
    const fact = chooseResearchPostcardSentence(entry) ||
      String(entry.researchSummary || "").replace(/\s+/g, " ").trim().slice(0, 180);
    const searchTerm = String(entry.searchTerm || entry.searchQuestion || subject).trim();
    const resourceMethod = libraryResourceMethod(firstSource, entry.researchMethod);
    const sentence = document.createElement("p");
    sentence.className = "research-one-sentence";
    if (entry.inProgress) {
      sentence.textContent = entry.requestType === "art-reference"
        ? "Mabel is at the Library looking for a visual reference for “" + (entry.focusQuestionTitle || subject) + "”."
        : "Mabel is at the Library researching “" + searchTerm + "”.";
      item.appendChild(sentence);
      list.appendChild(item);
      return;
    }
    if (entry.failed) {
      sentence.textContent = "Mabel searched for “" + searchTerm + "” at the Library, but the search did not return a usable result. She’ll try again later.";
      item.appendChild(sentence);
      list.appendChild(item);
      return;
    }
    if (entry.requestType === "art-reference") {
      sentence.textContent = "At the Library, Mabel looked up “" + searchTerm + "” to find a visual reference for " + (entry.focusQuestionTitle || subject) + ".";
      if (firstSource) {
        const link = document.createElement("a");
        link.href = safeExternalUrl(firstSource.url) || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = " She found “" + firstSource.title + "”.";
        sentence.appendChild(link);
      }
      item.appendChild(sentence);
      list.appendChild(item);
      return;
    }
    if (entry.related === false) {
      sentence.textContent = "Mabel searched for “" + searchTerm + "” using " + resourceMethod + ", but couldn’t verify a useful page about it this time.";
      item.appendChild(sentence);
      list.appendChild(item);
      return;
    }
    sentence.appendChild(document.createTextNode("Mabel searched for “" + searchTerm + "” and explored "));
    if (firstSource) {
      sentence.appendChild(document.createTextNode("the page “"));
      const sourceUrl = safeExternalUrl(firstSource.url);
      if (sourceUrl) {
        const link = document.createElement("a");
        link.href = sourceUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = firstSource.title;
        sentence.appendChild(link);
      } else {
        sentence.appendChild(document.createTextNode(firstSource.title));
      }
      sentence.appendChild(document.createTextNode("” in " + resourceMethod));
    } else {
      sentence.appendChild(document.createTextNode("a useful page using " + resourceMethod));
    }
    if (fact) sentence.appendChild(document.createTextNode(", learning: " + fact.replace(/[.!?]+$/, "") + "."));
    else sentence.appendChild(document.createTextNode("."));
    item.appendChild(sentence);
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

function safeWikimediaImageUrl(value) {
  const safe = safeExternalUrl(value);
  if (!safe) return "";
  try {
    const host = new URL(safe).hostname.toLowerCase();
    return host === "upload.wikimedia.org" || host.endsWith(".wikimedia.org") ? safe : "";
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
  bindle.treasureBox = Array.isArray(bindle.treasureBox) ? bindle.treasureBox : [];
  bindle.history = Array.isArray(bindle.history) ? bindle.history : [];
  const lists = { food: bindle.food, water: bindle.water, treasures: bindle.treasures };
  mabel.world.objects.forEach(function (object) {
    if (!object || object.visitSessionId !== currentVisitorSessionId() ||
        (object.source !== "wandering" && !(object.source === "visitor" && object.noticedAt))) return;
    if (["eaten", "drank", "discarded", "treasure box"].includes(object.status)) return;
    const target = object.edible || object.kind === "food" ? lists.food : object.kind === "water" ? lists.water : lists.treasures;
    const name = String(object.name || "").trim();
    if (!name || target.some(function (item) {
      return item.giftId && item.giftId === object.id ||
        normalizeInterestTitle(item.name) === normalizeInterestTitle(name);
    })) return;
    target.unshift({
      name: name,
      note: object.bindleNote || (object.source === "visitor" ? makeGiftKeepsakeNote(object) : object.note || ""),
      giftId: object.id || "",
      source: object.source || "",
      edible: Boolean(object.edible)
    });
  });
  mabel.world.objects.forEach(function (gift) {
    if (!gift || gift.source !== "visitor" || gift.visitSessionId !== currentVisitorSessionId() || !gift.noticedAt || !gift.id) return;
    const alreadyInPostbox = mabelPostboxItems.some(function (item) { return item && item.relatedGiftId === gift.id; });
    if (!alreadyInPostbox) {
      gift.reaction = gift.reaction || personalizeGiftReaction("", gift);
      addMabelPostboxItem({
        id: "gift-note-" + gift.id,
        kind: "gift-reaction",
        title: "Mabel noticed your " + gift.name,
        text: gift.reaction,
        relatedGiftId: gift.id,
        at: gift.noticedAt
      });
    }
  });
  saveBindle();
}

function updateBindle() {
  const bindleElement = document.getElementById("bindle");
  const treasureBoxElement = document.getElementById("treasure-box");
  const bindleHistoryElement = document.getElementById("bindle-history");
  if (!bindleElement) return;
  bindleElement.replaceChildren();
  if (treasureBoxElement) treasureBoxElement.replaceChildren();
  if (bindleHistoryElement) bindleHistoryElement.replaceChildren();
  const inventory = bindle || { food: [], water: [], treasures: [] };
  inventory.food = Array.isArray(inventory.food) ? inventory.food : [];
  inventory.water = Array.isArray(inventory.water) ? inventory.water : [];
  inventory.treasures = Array.isArray(inventory.treasures) ? inventory.treasures : [];
  inventory.treasureBox = Array.isArray(inventory.treasureBox) ? inventory.treasureBox : [];
  inventory.history = Array.isArray(inventory.history) ? inventory.history : [];
  let historyRepaired = false;
  (mabel.world && Array.isArray(mabel.world.objects) ? mabel.world.objects : [])
    .filter(function (gift) { return gift && gift.source === "visitor" && gift.visitSessionId === currentVisitorSessionId() && ["eaten", "drank", "discarded"].includes(gift.status); })
    .forEach(function (gift) {
      if (!inventory.history.some(function (entry) { return entry && entry.giftId === gift.id; })) {
        inventory.history.unshift({
          name: gift.name,
          note: gift.bindleNote || "",
          giftId: gift.id,
          source: "visitor",
          action: gift.status,
          at: gift.consumedAt || gift.removedAt || gift.noticedAt || now()
        });
        historyRepaired = true;
      }
    });
  inventory.history = inventory.history.slice(0, 40);
  if (historyRepaired) saveBindle();
  const waitingGifts = mabel.world && Array.isArray(mabel.world.objects)
    ? mabel.world.objects.filter(function (object) {
        return object.source === "visitor" && object.visitSessionId === currentVisitorSessionId() && !object.noticedAt;
      })
    : [];

  function appendGroup(title, values, isWaiting, container) {
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
      const source = value && (value.source || value.giftId && (mabel.world.objects || []).find(function (object) { return object && object.id === value.giftId; })?.source);
      if (value && source === "visitor") {
        if (value.giftId) row.id = "bindle-gift-" + String(value.giftId).replace(/[^a-z0-9_-]/gi, "");
        row.classList.add("visitor-gift");
        const badge = document.createElement("span");
        badge.className = "visitor-gift-badge";
        badge.textContent = "Gift from a visitor";
        row.appendChild(badge);
      } else if (value && source === "wandering") {
        if (value.giftId) row.id = "bindle-gift-" + String(value.giftId).replace(/[^a-z0-9_-]/gi, "");
        row.classList.add("wander-find");
        const badge = document.createElement("span");
        badge.className = "wander-find-badge";
        badge.textContent = "Found on a wander";
        row.appendChild(badge);
      }
      const highlightGiftId = getVisitorGiftHighlightId();
      if (value && value.giftId && highlightGiftId === String(value.giftId)) {
        const newBadge = document.createElement("span");
        newBadge.className = "newly-noticed-gift-badge";
        newBadge.textContent = "✧ Newly noticed";
        row.appendChild(newBadge);
        row.classList.add("newly-noticed-gift");

      }
      if (value && value.action) {
        const status = document.createElement("span");
        status.className = "bindle-item-status";
        if (value.action === "discarded") {
          const discardedAt = Date.parse(value.at || "");
          const stamp = Number.isFinite(discardedAt)
            ? " · " + new Date(discardedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
            : "";
          status.textContent = "discarded" + stamp;
        } else {
          status.textContent = value.action === "eaten" ? "eaten by Mabel" : value.action === "drank" ? "drank by Mabel" : value.action === "kept" ? "kept in Mabel’s treasure box" : value.action;
        }
        row.appendChild(status);
      }
      if (value && value.edible) {
        const edibleBadge = document.createElement("span");
        edibleBadge.className = "edible-gift-badge";
        edibleBadge.textContent = "edible";
        row.appendChild(edibleBadge);
      }
      if (value.note || value.keptReason || isWaiting) {
        const note = document.createElement("span");
        note.className = "bindle-note";
        note.textContent = " — " + (value.note || value.keptReason || "Waiting for Mabel’s next quiet moment.");
        row.appendChild(note);
      }
      list.appendChild(row);
    });
    group.appendChild(list);
    (container || bindleElement).appendChild(group);
  }

  if (!inventory.food.length && !inventory.water.length && !inventory.treasures.length && !waitingGifts.length) {
    const empty = document.createElement("p");
    empty.className = "bindle-empty";
    empty.textContent = "Mabel’s bindle is light today.";
    bindleElement.appendChild(empty);
  } else {
    appendGroup("Waiting to be noticed", waitingGifts, true);
    appendGroup("Food", inventory.food, false);
    appendGroup("Water", inventory.water, false);
    appendGroup("Little treasures", inventory.treasures, false);
  }
  if (treasureBoxElement) {
    if (inventory.treasureBox.length) appendGroup("Things she decided to keep", inventory.treasureBox, false, treasureBoxElement);
    else {
      const emptyKeepsakes = document.createElement("p");
      emptyKeepsakes.className = "bindle-empty";
      emptyKeepsakes.textContent = "Nothing has found its way into the treasure box yet.";
      treasureBoxElement.appendChild(emptyKeepsakes);
    }
  }
  if (bindleHistoryElement) {
    if (inventory.history.length) appendGroup("No longer in her bindle", inventory.history, false, bindleHistoryElement);
    else {
      const emptyHistory = document.createElement("p");
      emptyHistory.className = "bindle-empty";
      emptyHistory.textContent = "Nothing has left Mabel’s bindle yet.";
      bindleHistoryElement.appendChild(emptyHistory);
    }
  }
}

function updateAutonomousExplorerLog() {
  if (!autonomousExplorerElement) return;
  autonomousExplorerElement.replaceChildren();
  if (!autonomousExplorerLog.length) {
    const empty = document.createElement("li");
    empty.textContent = "Mabel’s own wandering trail is just beginning."; 
    autonomousExplorerElement.appendChild(empty);
    return;
  }
  autonomousExplorerLog.slice(0, 12).forEach(function (trip) {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    heading.textContent = "Mabel wandered on her own";
    item.appendChild(heading);
    if (trip.at) {
      const time = document.createElement("time");
      time.dateTime = trip.at;
      const parsed = Date.parse(trip.at);
      time.textContent = Number.isFinite(parsed) ? " · " + new Date(parsed).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
      item.appendChild(time);
    }
    if (trip.motive) {
      const motive = document.createElement("p");
      motive.className = "autonomous-wander-motive";
      motive.textContent = "She set out because " + trip.motive.charAt(0).toLowerCase() + trip.motive.slice(1).replace(/[.!?]+$/, "") + ".";
      item.appendChild(motive);
    }
    (trip.finds || []).forEach(function (found) {
      const detail = document.createElement("p");
      detail.className = "explore-discovery";
      detail.textContent = "She found " + found.name + ".";
      item.appendChild(detail);
      if (trip.research && trip.research.followUpQuestion &&
          normalizeInterestTitle(trip.research.focusTitle) === normalizeInterestTitle(found.name)) {
        const followUp = document.createElement("p");
        followUp.className = "explore-follow-up";
        followUp.textContent = "This left Mabel wondering: “" + trip.research.followUpQuestion + "”";
        item.appendChild(followUp);
      }
    });
    autonomousExplorerElement.appendChild(item);
  });
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
      if (trip.research && trip.research.followUpQuestion &&
          normalizeInterestTitle(trip.research.focusTitle) === normalizeInterestTitle(found.name)) {
        const followUp = document.createElement("p");
        followUp.className = "explore-follow-up";
        followUp.textContent = "This left Mabel wondering: “" + trip.research.followUpQuestion + "”";
        item.appendChild(followUp);
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
      if (message.id) {
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "board-delete-button";
        removeButton.textContent = "Delete";
        removeButton.setAttribute("aria-label", "Delete this notice");
        removeButton.addEventListener("click", async function () {
          if (!window.confirm("Delete this notice from the shared board?")) return;
          removeButton.disabled = true;
          try {
            const deleteResponse = await fetch(MABEL_BOARD_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "delete", id: message.id })
            });
            let deleteResult = {};
            try { deleteResult = await deleteResponse.json(); } catch (parseError) { /* Keep the HTTP status below. */ }
            if (!deleteResponse.ok) {
              if (deleteResponse.status === 404) {
                await loadVisitorBoard();
                if (visitorBoardStatus) visitorBoardStatus.textContent = "That notice was already removed, so the board has been refreshed.";
                return;
              }
              throw new Error(deleteResult.error || ("The notice could not be deleted (status " + deleteResponse.status + ")."));
            }
            await loadVisitorBoard();
            if (visitorBoardStatus) visitorBoardStatus.textContent = "The notice has been removed for everyone.";
          } catch (error) {
            removeButton.disabled = false;
            if (visitorBoardStatus) visitorBoardStatus.textContent = error && error.message ? error.message : "That notice could not be removed just now.";
          }
        });
        item.appendChild(removeButton);
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
    .replace(/\b(?:i|me|my|they|them|their|she|he|we|you|visitor|shared|said|says|told|mentioned|really|like|likes|love|loves|enjoy|enjoys|adore|adores|am|are|is|the|a|an)\b/g, " ")
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
        moments: deduplicateVisitorNotes(Array.isArray(parsed.moments) ? parsed.moments : [], "moments"),
        bond: Math.max(0, Math.min(100, Number(parsed.bond) || 0)),
        activeMinutes: Math.max(0, Number(parsed.activeMinutes) || 0),
        activeDay: String(parsed.activeDay || ""),
        activeBondToday: Math.max(0, Number(parsed.activeBondToday) || 0),
        activeTickAt: Number(parsed.activeTickAt) || 0,
        visitorId: String(parsed.visitorId || "")
      };
    }
  } catch (error) {
    // Use an empty local profile if storage is unavailable.
  }
  return { facts: [], moments: [], bond: 0, activeMinutes: 0, activeDay: "", activeBondToday: 0, activeTickAt: 0, visitorId: "" };
}

function saveVisitorProfile() {
  try {
    localStorage.setItem(visitorProfileStorageKey, JSON.stringify(visitorProfile));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function growVisitorBond(amount, reason) {
  if (!visitorProfile || typeof visitorProfile !== "object") visitorProfile = { facts: [], moments: [], bond: 0, visitorId: "" };
  if (!visitorProfile.visitorId) {
    visitorProfile.visitorId = window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : "visitor-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }
  visitorProfile.bond = Math.min(100, Math.max(0, Number(visitorProfile.bond) || 0) + Math.max(0, Number(amount) || 0));
  visitorProfile.lastBondReason = String(reason || "").slice(0, 120);
  saveVisitorProfile();
  updateVisitorProfile();
  updateGallery();
}

function accrueActiveVisitorTime() {
  if (document.visibilityState !== "visible" || !mabel) return;
  const currentTime = Date.now();
  const previousTick = Number(visitorProfile.activeTickAt) || 0;
  if (!previousTick || currentTime - previousTick > 90000) {
    visitorProfile.activeTickAt = currentTime;
    saveVisitorProfile();
    return;
  }
  if (currentTime - previousTick < 55000) return;
  visitorProfile.activeTickAt = currentTime;
  const today = new Date().toISOString().slice(0, 10);
  if (visitorProfile.activeDay !== today) {
    visitorProfile.activeDay = today;
    visitorProfile.activeBondToday = 0;
  }
  visitorProfile.activeMinutes = Math.max(0, Number(visitorProfile.activeMinutes) || 0) + 1;
  // A small reward every five visible minutes, capped at three points per day.
  if (visitorProfile.activeMinutes % 5 === 0 && visitorProfile.activeBondToday < 3) {
    const earned = Math.min(0.5, 3 - visitorProfile.activeBondToday);
    visitorProfile.bond = Math.min(100, (Number(visitorProfile.bond) || 0) + earned);
    visitorProfile.activeBondToday += earned;
  }
  mabel.needs.connection = clampNeed((Number(mabel.needs.connection) || 0) + 0.006);
  persistSharedNeeds();
  saveVisitorProfile();
  saveMabel();
  updateNeeds();
  updateBrain();
  updateVisitorProfile();
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
    addVisitorProfileNote("facts", "Visitor’s name is " + nameMatch[1].trim() + ".");
  }
  const ageMatch = text.match(/\b(?:my age is|i am|i'm|im)\s+(\d{1,3})(?=\s*(?:years? old|yrs? old|[.!?,;]|$))/i);
  if (ageMatch) {
    const age = Number(ageMatch[1]);
    if (age >= 1 && age <= 110) addVisitorProfileNote("facts", "Visitor is " + age + " years old.");
  }
  const favoriteMatch = text.match(/\bmy favorite\s+([a-z ]{2,24})\s+is\s+([^.!?\n]{2,100})/i);
  if (favoriteMatch) {
    addVisitorProfileNote("facts", "Visitor’s favorite " + favoriteMatch[1].trim() + " is " + favoriteMatch[2].trim() + ".");
  }
  const preferenceMatch = text.match(/\bI\s+(?:really\s+)?(like|love|enjoy|adore|am interested in)\s+([^.!?\n]{2,120})/i);
  if (preferenceMatch) {
    const verb = preferenceMatch[1].toLowerCase() === "am interested in" ? "are interested in" : preferenceMatch[1].toLowerCase() + " ";
    const preferenceVerb = preferenceMatch[1].toLowerCase() === "am interested in" ? "is interested in" : preferenceMatch[1].toLowerCase() + "s";
    addVisitorProfileNote("facts", "Visitor " + preferenceVerb + " " + preferenceMatch[2].trim().replace(/[,;:]$/, "") + ".");
  }
  const appearancePatterns = [
    /\bI\s+(?:have|got|wear|am wearing)\s+[^.!?\n]{1,100}\b(?:hair|glasses|spectacles|mustache|moustache|beard|facial hair|freckles|eyes|eye colour|eye color|bald|curly|straight|blonde|blond|brunette|ginger|red-haired|red hair|brown hair|black hair|grey hair|gray hair)\b[^.!?\n]*/i,
    /\bI(?:'m| am)\s+(?:a|an)\s+(?:man|woman|nonbinary person|non-binary person)\b/i,
    /\bmy\s+(?:hair|eyes|glasses|spectacles|mustache|moustache|beard|freckles)\s+(?:is|are)\s+[^.!?\n]{1,80}/i
  ];
  appearancePatterns.forEach(function (pattern) {
    const appearanceMatch = text.match(pattern);
    if (appearanceMatch) addVisitorProfileNote("facts", formatVisitorFact(appearanceMatch[0].trim()));
  });
  if (visitorProfile.facts.length !== beforeCount) updateVisitorProfile();
}

function formatVisitorFact(value) {
  let fact = String(value || "").trim().replace(/^They shared:\s*/i, "").replace(/^Visitor says:\s*/i, "");
  let match = fact.match(/^(?:My name is|Their name is)\s+(.+?)\.?$/i);
  if (match) return "Visitor’s name is " + match[1].replace(/\.$/, "") + ".";
  match = fact.match(/^(?:Their favorite|Their favourite)\s+(.+?)\s+is\s+(.+?)\.?$/i);
  if (match) return "Visitor’s favorite " + match[1] + " is " + match[2].replace(/\.$/, "") + ".";
  match = fact.match(/^(?:They are|I am|I'm|Im)\s+(.+?)\.?$/i);
  if (match) return "Visitor is " + match[1].replace(/\.$/, "") + ".";
  match = fact.match(/^(?:They have|I have|I got|I’ve got|I got)\s+(.+?)\.?$/i);
  if (match) return "Visitor has " + match[1].replace(/\.$/, "") + ".";
  match = fact.match(/^(?:They wear|I wear|I am wearing)\s+(.+?)\.?$/i);
  if (match) return "Visitor wears " + match[1].replace(/\.$/, "") + ".";
  match = fact.match(/^(?:My|Their) hair is\s+(.+?)\.?$/i);
  if (match) return "Visitor has " + match[1].replace(/\.$/, "") + " hair.";
  match = fact.match(/^(?:My|Their) eyes are\s+(.+?)\.?$/i);
  if (match) return "Visitor has " + match[1].replace(/\.$/, "") + " eyes.";
  match = fact.match(/^They (like|love|enjoy|adore)\s+(.+?)\.?$/i);
  if (match) return "Visitor " + match[1].toLowerCase() + "s " + match[2].replace(/\.$/, "") + ".";
  match = fact.match(/^They are interested in\s+(.+?)\.?$/i);
  if (match) return "Visitor is interested in " + match[1].replace(/\.$/, "") + ".";
  match = fact.match(/^I\s+(like|love|enjoy|adore)\s+(.+?)\.?$/i);
  if (match) return "Visitor " + match[1].toLowerCase() + "s " + match[2].replace(/\.$/, "") + ".";
  if (/^Visitor\b/i.test(fact)) return fact;
  return "Visitor says: " + fact.replace(/\.$/, "") + ".";
}

function updateVisitorProfile() {
  const bondHeading = document.getElementById("visitor-bond-level");
  const bondProgress = document.getElementById("visitor-bond-progress");
  const bondNote = document.getElementById("visitor-bond-note");
  const bond = Math.max(0, Math.min(100, Number(visitorProfile.bond) || 0));
  if (bondHeading) {
    const level = bond >= 80 ? "Mabel’s dear friend" : bond >= 60 ? "A trusted friend" : bond >= 35 ? "A familiar friend" : bond >= 15 ? "A growing friendship" : "Getting to know each other";
    bondHeading.textContent = level;
  }
  if (bondProgress) bondProgress.value = bond;
  if (bondNote) {
    const minutes = Math.max(0, Number(visitorProfile.activeMinutes) || 0);
    bondNote.textContent = "Grows through time spent together, chats, and gifts Mabel notices. " + minutes + " minutes together here.";
  }
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
      text.textContent = key === "facts" ? formatVisitorFact(note.text) : note.text;
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
  visitorProfile = { facts: [], moments: [], bond: 0, activeMinutes: 0, activeDay: "", activeBondToday: 0, activeMinuteBucket: 0 };
  saveVisitorProfile();
  updateVisitorProfile();
}

function resetThisBrowserMabel() {
  const confirmed = window.confirm("Start fresh in this browser? This clears its gifts, bindle, postbox, personal Gallery, visitor notes, activity, friendship level, time spent together here, and old notifications. Mabel’s shared personality, Art Exhibition and Visitors’ board will stay.");
  if (!confirmed) return;
  visitorProfile = { facts: [], moments: [], bond: 0, activeMinutes: 0, activeDay: "", activeBondToday: 0, activeTickAt: 0, visitorId: "", activeMinuteBucket: 0 };
  viewedVisitorGiftNoticeKeys.clear();
  [
    mabelStorageKey, reflectionQueueStorageKey, wanderingsStorageKey, researchLogStorageKey,
    boardReadKeysStorageKey, sparksStorageKey, autonomousResearchStorageKey, viewedSparkStorageKey,
    viewedArtworkStorageKey, autonomousStorageKey, reflectionStorageKey, bindleStorageKey,
    galleryStorageKey, visitorProfileStorageKey, visitorGiftSeenStorageKey, visitorSessionStorageKey, researchIdeasStorageKey,
    mabelPostboxStorageKey, comfortPostboxQueueStorageKey, postboxSeenStorageKey, researchShareCountStorageKey
  ].forEach(function (key) {
    try { localStorage.removeItem(key); } catch (error) {}
  });
  try {
    sessionStorage.removeItem(bindleStorageKey);
    sessionStorage.removeItem(visitorSessionStorageKey);
    sessionStorage.removeItem(visitorGiftHighlightStorageKey);
  } catch (error) {};
  try { sessionStorage.removeItem(conversationStorageKey); } catch (error) {}
  window.location.reload();
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
  updateMindTopics();
  updateChanges();
  updateBrain();

  updateResearchLog();
  updateCrafting();
  updateMabelPostbox();
  updateWanderings();
  updateAutonomousExplorerLog();
  updateBindle();
  updateHomeObjects();
  updateGallery();
  updateVisitorProfile();
  updateItemKnowledge();
  showSparkNotice();
  refreshGalleryNotice();
  updateVisitorGiftNotice();
  refreshPostboxNotice();
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
  const objects = mabel.world.objects.filter(function (object) {
    return !object || object.source !== "visitor" || object.visitSessionId === currentVisitorSessionId();
  }).slice(0, 10);
  if (!objects.length) {
    const empty = document.createElement("li");
    empty.textContent = "The shelf is empty for now.";
    list.appendChild(empty);
    return;
  }
  objects.forEach(function (object) {
    const item = document.createElement("li");
    if (object.id) item.id = "home-gift-" + String(object.id).replace(/[^a-z0-9_-]/gi, "");
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
    visitSessionId: currentVisitorSessionId(),
    noticedAt: "",
    reaction: "",
    status: "waiting",
    noticeAfter: new Date(Date.now() + (5 + Math.random() * 5) * 60 * 1000).toISOString()
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
    food: [
      "a blackberry", "three sunflower seeds", "a fallen hazelnut", "a little oat crumb",
      "a small piece of plain pizza crust", "a crumb from an old bakery roll", "a piece of stale artisan focaccia", "a dried edible porcini mushroom",
      "a dried shiitake mushroom", "a piece of cultivated oyster mushroom", "a pistachio kernel", "a pine nut",
      "a fresh basil leaf", "a mint leaf", "a raspberry", "a blueberry",
      "a sliver of apple", "half a dried cranberry", "a corner of plain cracker",
      "a crumb of oat biscuit", "a sesame seed", "a little strawberry top", "a crumb of mild cheese"
    ],
    water: [
      "a sip of clean rainwater in a curled leaf", "a bead of fresh dew", "a small cup of fresh water",
      "a drop of rain caught in an acorn cap", "a little spring-water in a shell", "a clean sip from the stream",
      "a sip from a muddy puddle", "a little cloudy puddle water"
    ],
    surprise: [
      "a dried flower tied with thread", "a smooth shell", "a little brass bell", "a pale green glass pebble",
      "a scrap of soft blue cloth", "a tiny wooden bead", "a pressed four-leaf clover", "a tiny wooden spool",
      "a miniature paper star", "a little copper key", "a worn postage stamp", "a small piece of sea glass",
      "a tiny thimble", "a green ribbon bow", "a little carved acorn",
      "an old faded Nintendo DS game cartridge", "a used tea-light candle with cool wax"
    ]
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


function comfortDrawingSubject(message) {
  const facts = (visitorProfile && Array.isArray(visitorProfile.facts) ? visitorProfile.facts : [])
    .map(function (fact) { return String(fact && fact.text || ""); });
  const current = String(message || "");
  const candidates = [current].concat(facts);
  for (const value of candidates) {
    const hasExplicitPreference = /\b(?:i|they|he|she)\s+(?:really\s+)?(?:like|love|enjoy|adore)|\b(?:my|their|his|her)\s+(?:favorite|favourite)\b|\b(?:fan of|interested in)\b/i.test(value);
    if (!hasExplicitPreference) continue;
    const detail = value.match(/\b(?:like|love|enjoy|adore|fan of|interested in|favorite|favourite)\s+(?:to\s+)?([^.!?,;]{2,60})/i);
    if (detail && detail[1]) return String(detail[1]).trim().slice(0, 60);
  }
  const appearance = visitorAppearanceDetails(message);
  return appearance.length ? "Mabel beside the visitor" : "Mabel holding a love heart";
}

function visitorSeemsDistressed(message) {
  return /\b(sad|upset|lonely|alone|isolated|no one|nobody|scared|anxious|anxiety|stressed|overwhelmed|heartbroken|grieving|rough day|bad day|feeling low|feel awful|crying|in tears)\b/i.test(String(message || ""));
}

function requestedArtworkColors(message) {
  const text = String(message || "");
  if (!isArtworkRequest(text)) return [];
  const colors = ["pink", "red", "orange", "yellow", "green", "blue", "purple", "violet", "lilac", "lavender", "teal", "turquoise", "black", "white", "brown", "grey", "gray", "gold", "silver"];
  return Array.from(new Set(colors.filter(function (color) { return new RegExp("\\b" + color + "\\b", "i").test(text); }))).slice(0, 4);
}

function requestedArtworkColorInstruction(message) {
  const colors = requestedArtworkColors(message);
  if (!colors.length) return "";
  return " Honor the visitor’s explicit color request: use " + colors.join(" and ") + " prominently on the requested subject or scene; do not omit or replace those requested colors.";
}

function isArtworkRequest(message) {
  const text = String(message || "").trim();
  if (!text) return false;
  const selfPortrait = /\bself[ -]?portrait\b|\bportrait of (?:yourself|mabel)\b|\b(?:draw|sketch|paint|illustrate) (?:you|yourself|mabel)\b|\bpicture of (?:you|mabel)\b/i.test(text);
  const directDraw = /\b(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text) ||
    /\b(?:can|could|would|will)\s+you\s+(?:please\s+)?(?:draw|sketch|paint|illustrate)\b/i.test(text) ||
    /\b(?:i want|i'd like|i would like)\s+you\s+to\s+(?:draw|sketch|paint|illustrate)\b/i.test(text);
  const pictureRequest = /\b(?:make|create|give|show)\s+(?:(?:me|us)\s+)?(?:(?:a|an|some|the)\s+)?(?:picture|image|art|artwork|drawing|portrait|illustration)\b/i.test(text);
  return selfPortrait || directDraw || pictureRequest || Boolean(requestedArtworkSubject(text));
}

function requestedArtworkDescriptionSubject(message) {
  return requestedArtworkSubject(message);
}

function shouldResearchArtworkReference(subject) {
  const key = normalizeInterestTitle(subject);
  if (!key || /^(mabel|mouse|visitor|me|you|self portrait)$/.test(key)) return false;
  const familiar = new Set(["cat", "dog", "rabbit", "fox", "bird", "flower", "mushroom", "fossil", "button", "shell", "moon", "star", "fish", "house", "tree", "leaf", "apple", "heart", "cloud", "sun"]);
  if (familiar.has(key)) return false;
  // An explicit request deserves a fresh Library-to-studio pass, even if Mabel
  // has studied this subject before. The saved reference is not a reason to
  // silently skip the visitor's requested second drawing.
  return true;
}

function queueArtworkReferenceResearch(message, options) {
  options = options || {};
  const subject = requestedArtworkDescriptionSubject(message);
  if (!subject || !shouldResearchArtworkReference(subject)) return null;
  if (findSharedArtReference(subject)) return null;
  const lead = addResearchIdea({
    id: "art-reference-" + normalizeInterestTitle(subject),
    title: subject,
    question: "What does " + subject + " look like, and what details could help Mabel draw it more clearly?",
    searchTerm: subject,
    source: options.isGiftArtReference ? "exploration" : "conversation",
    grounded: true,
    requestType: "art-reference",
    isGiftArtReference: options.isGiftArtReference === true,
    giftId: options.giftId || "",
    originText: options.isGiftArtReference
      ? "A visitor’s gift inspired Mabel to make a drawing of " + subject + "; she wants to study a visual reference next."
      : "Mabel was thinking about " + subject + " and wanted to explore it more creatively."
  });
  if (!lead) return null;
  addFeedEntry({
    kind: "did",
    source: "visitor",
    text: "Mabel set her first sketch of " + subject + " aside to study a visual reference at the Library.",
    why: "She wanted to return to the subject and explore it more creatively."
  });
  if (lead.requestType === "art-reference") lead.lastResearchedAt = "";
  saveResearchIdeas();
  saveMabel();
  updatePage();
  scheduleWanderingResearch(lead);
  return lead;
}

function isVisitorPortraitRequest(message) {
  const text = String(message || "").trim();
  return /\b(?:portrait|picture|drawing|painting|image|sketch)\s+of\s+(?:me|myself|the visitor|your visitor)\b/i.test(text) ||
    /\b(?:draw|sketch|paint|illustrate)\s+(?:me|myself)\s+(?:as|with|wearing|in)\b/i.test(text) ||
    /\b(?:draw|sketch|paint|illustrate)\s+me\s+(?:a|an)\s+(?:portrait|picture|drawing|painting|image|sketch)\b/i.test(text) ||
    /\b(?:draw|sketch|paint|illustrate)\s+me\s*[.!?]*$/i.test(text);
}

function visitorAppearanceDetails(message) {
  const appearancePattern = /\b(?:hair|glasses|spectacles|mustache|moustache|beard|facial hair|freckles|eyes|eye colour|eye color|bald|man|woman|nonbinary|curly|straight|blonde|blond|brunette|ginger|red-haired|red hair|brown hair|black hair|grey hair|gray hair)\b/i;
  const details = [];
  const savedFacts = visitorProfile && Array.isArray(visitorProfile.facts) ? visitorProfile.facts : [];
  savedFacts.forEach(function (fact) {
    const text = typeof fact === "string" ? fact : String(fact && fact.text || "");
    if (text && appearancePattern.test(text)) details.push(text);
  });
  const currentMessage = String(message || "").trim();
  const refersToSelf = /\b(?:i|i'm|im|i am|my|me|myself)\b/i.test(currentMessage);
  if (refersToSelf && appearancePattern.test(currentMessage)) details.unshift(currentMessage);
  return Array.from(new Set(details)).slice(0, 6);
}

function requestedArtworkSubject(message) {
  const text = String(message || "").trim();
  if (/\b(self[ -]?portrait|portrait of (?:yourself|mabel)|draw (?:you|yourself|mabel)|sketch (?:you|yourself|mabel)|paint (?:you|yourself|mabel)|illustrate (?:you|yourself|mabel)|picture of (?:you|mabel))\b/i.test(text)) return "mabel";
  const openEnded = /\b(?:draw|sketch|paint|illustrate|make|create)\s+(?:(?:me|us)\s+)?(?:(?:a|an|some|the)\s+)?(?:picture|image|art|artwork|drawing|painting|illustration|something|anything)\s*(?:please|for me)?[.!?]*$/i.test(text);
  if (openEnded) return "";
  if (isVisitorPortraitRequest(text)) return "visitor";
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

  const abstractTitles = ["Where the colours wandered", "A small map of a feeling", "The shape of a quiet minute", "Three curious marks", "A little almost-landscape"];
  const openEndedRequest = isArtworkRequest(context.message) && !subject;
  return {
    title: subject === "mabel"
      ? "Mabel, as Mabel remembers herself"
      : subject === "visitor"
        ? "Mabel drew her visitor"
        : subject
          ? "Mabel's little study of a " + subject
          : openEndedRequest
            ? abstractTitles[Math.floor(Math.random() * abstractTitles.length)]
            : "Mabel's " + mood + " marks",
    kind: "moment",
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    motif: motif,
    subject: subject,
    selfPortrait: subject === "mabel",
    symbols: [subject === "button" ? "button" : symbols[Math.floor(Math.random() * symbols.length)]],
    note: subject === "mabel"
      ? "She used the picture by her nest as a starting point, then let the colours wander."
      : subject === "visitor"
        ? "Mabel made a little portrait of her visitor, guided only by details they had shared."
        : subject
          ? "She let the shape of a " + subject + " lead the marks somewhere unexpected."
          : openEndedRequest
        ? "Mabel began without a subject and let the marks decide what they might become."
        : "She kept a small piece of " + activity + ".",
    seed: (Date.now() ^ Math.floor(Math.random() * 2147483647)) >>> 0
  };
}

function findSharedArtReference(subject) {
  const wanted = normalizeInterestTitle(subject);
  if (!wanted || !sharedMabelBrain || !Array.isArray(sharedMabelBrain.artReferences)) return null;
  return sharedMabelBrain.artReferences.find(function (reference) {
    if (!reference || !reference.imageUrl) return false;
    const labels = [reference.subject].concat(Array.isArray(reference.aliases) ? reference.aliases : []);
    return labels.some(function (label) {
      return normalizeInterestTitle(label) === wanted;
    });
  }) || null;
}

async function requestMabelArtwork(context, targetElement) {
  context = context || {};
  if (!sharedMabelBrain) await refreshSharedMabelBrain();
  const source = context.source || "autonomous";
  const visitorPortrait = isVisitorPortraitRequest(context.message);
  const appearanceDetails = visitorAppearanceDetails(context.message);
  const subjectForWorker = visitorPortrait ? "visitor" : (context.comfortRequest
    ? (context.comfortSubject || "Mabel beside her visitor")
    : requestedArtworkDescriptionSubject(context.message));
  const selfPortrait = requestedArtworkSubject(context.message) === "mabel";
  const storedReference = !visitorPortrait && !context.comfortRequest && !selfPortrait
    ? findSharedArtReference(subjectForWorker)
    : null;
  let artwork = null;
  let declined = false;

  if (!context.forceLocalFallback) {
    try {
      const response = await fetch(MABEL_ART_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source,
        message: context.message || "",
        comfortRequest: context.comfortRequest === true,
        requestedSubject: subjectForWorker,
        visitorPortrait: visitorPortrait,
        visitorAppearance: appearanceDetails,
        visitorPreferences: visitorProfile.facts.slice(0, 12).map(function (fact) { return fact.text; }),
        artworkInstruction: (visitorPortrait
          ? "Draw Mabel’s visitor as the subject. Use only the explicitly shared appearance details in visitorAppearance; do not invent gender, hair, glasses, facial hair, age, or other features that are not provided. Give the artwork the exact title “Mabel drew her visitor”."
          : context.comfortRequest
            ? "Make a warm, happy comfort drawing for this visitor. First use a favorite animal, hobby, or interest explicitly stated in visitorPreferences if one is clearly available. If no such preference is present, draw Mabel the mouse holding a love heart, or Mabel beside the visitor with a bouquet of flowers and little hearts. Do not use unrelated things Mabel found as the subject. Do not invent the visitor's appearance; use only visitorAppearance details when drawing them. Keep the written title and description about the visitor's comfort, not about a random object."
            : requestedArtworkDescriptionSubject(context.message)
              ? "The title and written description must clearly name or describe the requested subject: " + requestedArtworkDescriptionSubject(context.message) + ". Make the drawing visibly about that subject."
              : "This is an open-ended request for a picture, not an instruction to draw an object named picture. Choose any subject that genuinely catches Mabel’s attention, or create an abstract, playful piece and let the marks decide what it is. Give it a specific, natural title and a short description.") + requestedArtworkColorInstruction(context.message) + (context.referenceImageInstruction ? " " + context.referenceImageInstruction : ""),
        requestedColors: requestedArtworkColors(context.message),
        selfPortrait: selfPortrait,
        referenceImageUrl: context.referenceImageUrl || (storedReference && storedReference.imageUrl) || (selfPortrait ? new URL("images/mabel.png", window.location.href).href : ""),
        referenceRetry: context.referenceRetry === true || Boolean(storedReference),
        useVisualReference: context.useVisualReference === true || Boolean(storedReference),
        referenceObservation: context.referenceObservation || (storedReference && storedReference.visualNotes) || "",
        referenceTitle: context.referenceTitle || (storedReference && storedReference.sourceTitle) || "",
        referenceFact: context.referenceFact || (storedReference && storedReference.fact) || "",
        referenceImageInstruction: context.referenceImageInstruction || (storedReference
          ? "Use the saved Library reference to make the exact subject recognizable. Keep its real silhouette and distinctive features, but make an original Mabel-style drawing; do not paste, trace, or embed the reference image."
          : selfPortrait
            ? "Use mabel.png only as a visual reference for Mabel’s mouse features and proportions. Create a new original drawing; never paste or embed the reference image as a layer."
            : ""),
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
        artisticInspiration: context.inspiration || chooseCurrentArtworkInspiration(),
        autonomousArtGuidance: "For Mabel’s own-time artwork, prefer remembered conversations, things she discovered while exploring, and completed Library research. Visitor-board notes are an occasional, low-priority source. Do not repeatedly illustrate the same inspiration."
      })
    });

    if (response.ok) {
      const data = await response.json();
      artwork = data.artwork || null;
      if (typeof data.referenceObservation === "string" && data.referenceObservation.trim()) {
        context.referenceObservation = data.referenceObservation.trim().slice(0, 700);
      }
      declined = data.declined === true;
      if (data.referenceUnavailable === true) {
        context.referenceUnavailable = true;
        context.referenceUnavailableReason = String(data.reason || "").slice(0, 240);
      }
    }
    } catch (error) {
      // An explicit drawing request can still use Mabel's local drawing hand.
    }
  }

  const requestedSubject = requestedArtworkSubject(context.message);
  if (artwork && requestedSubject) {
    artwork.subject = requestedSubject;
    artwork.selfPortrait = requestedSubject === "mabel";
  } else if (artwork && isArtworkRequest(context.message)) {
    const returnedSubject = String(artwork.subject || "").trim().toLowerCase();
    if (/^(?:picture|image|art|artwork|drawing|painting|illustration|something|anything)$/i.test(returnedSubject)) {
      artwork.subject = "";
      artwork.title = ["Where the colours wandered", "A small map of a feeling", "The shape of a quiet minute", "Three curious marks", "A little almost-landscape"][Math.floor(Math.random() * 5)];
      artwork.note = "Mabel began without a subject and let the marks decide what they might become.";
    }
  }

  const explicitRequest = source === "visitor" && isArtworkRequest(context.message);
  const comfortRequest = source === "comfort" && context.comfortRequest === true;
  if (!artwork && explicitRequest && !context.referenceUnavailable && !context.referenceRetry) {
    artwork = makeMabelFallbackArtwork(context);
  }
  if (!artwork && comfortRequest) {
    artwork = makeMabelFallbackArtwork({ ...context, message: "" });
    artwork.title = "A little picture to keep you company";
    artwork.subject = "mabel";
    artwork.selfPortrait = true;
    artwork.motif = "hearts";
    artwork.note = "A happy little picture Mabel made to keep you company.";
  }

  if (!artwork && source === "autonomous" && context.inspiration && !context.referenceUnavailable && !context.referenceRetry) {
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

  const artworkInspiration = context.comfortRequest ? null : (context.inspiration || chooseCurrentArtworkInspiration());
  if (context.comfortRequest) {
    artwork.inspirationContext = "Made with care after the visitor shared that they were " + comfortMessageTopic(context.message) + ".";
  } else if (!artwork.inspirationContext && artwork.inspirationConnection) {
    artwork.inspirationContext = artwork.inspirationConnection;
  } else if (artworkInspiration && !artwork.inspirationContext) {
    artwork.inspirationContext = artworkInspiration.question || artworkInspiration.title;
  }
  artwork = prepareArtworkForGallery(artwork, { ...context, source: source, inspiration: artworkInspiration });
  if (visitorPortrait) artwork.visitorPortrait = true;
  if (context.referenceRetry || storedReference) {
    artwork.referenceRetry = true;
    artwork.referenceObservation = context.referenceObservation || "";
    artwork.inspirationContext = context.inspiration && context.inspiration.question || "Mabel wanted to explore " + (artwork.subject || artwork.title || "this subject") + " more creatively after studying a visual reference at the Library.";
  }
  if (context.comfortRequest) {
    artwork.title = "A little picture to keep you company";
    artwork.description = "Mabel made this happy little picture after your message about " + comfortMessageTopic(context.message) + ".";
    artwork.note = artwork.description;
    artwork.subject = artwork.subject || "mabel";
    artwork.motif = artwork.motif || "hearts";
  }
  if (source === "autonomous" && artworkInspiration && artworkInspiration.key) {
    artwork.inspirationKey = artworkInspiration.key;
  }
  const card = renderMabelCard(artwork);
  if (context.comfortRequest) artwork.postboxFirst = true;
  const sharedArtworkUpdate = context.comfortRequest || context.deferGallery ? Promise.resolve() : saveToMabelGallery(artwork);
  if (card && targetElement) {
    targetElement.appendChild(document.createElement("br"));
    targetElement.appendChild(card);
  }
  if (source === "visitor" || source === "comfort") {
    const creativeThought = context.inspiration && (context.inspiration.question || context.inspiration.title)
      || requestedArtworkDescriptionSubject(context.message)
      || context.comfortSubject
      || "a little idea she wanted to explore";
    addFeedEntry({
      kind: "did",
      source: "visitor",
      text: context.comfortRequest
        ? "Mabel made a thoughtful drawing for her visitor."
        : (requestedArtworkDescriptionSubject(context.message)
          ? "Mabel made an initial drawing of " + requestedArtworkDescriptionSubject(context.message) + " for her visitor."
          : "Mabel made a little drawing for her visitor."),
      why: "Mabel was thinking about " + String(creativeThought).replace(/[.?!]+$/, "") + " and wanted to explore it more creatively."
    });
  }
  if (source === "autonomous") await sharedArtworkUpdate;
  registerSharedDrawing(artwork, { source: source }).catch(function () {});
  return artwork;
}

function separateSparkMarker(value) {
  let sparkTitle = "";
  let sparkQuestion = "";
  let sparkReason = "";
  let sparkKind = "";
  let text = String(value || "").replace(/\s*\[\[SPARK\]\]\s*([^\r\n]*)/gi, function (_match, payload) {
    const parts = String(payload || "").split("|").map(function (part) {
      return part.replace(/^[*_~]+|[*_~]+$/g, "").trim();
    });
    sparkTitle = (parts[0] || "").slice(0, 90);
    sparkQuestion = (parts[1] || "").slice(0, 220);
    sparkReason = (parts[2] || "").slice(0, 220);
    sparkKind = /^hobby$/i.test(parts[3] || "") ? "hobby" : "";
    return "";
  }).replace(/\[\[\/?SPARK\]\]/gi, "").trim();

  const editorialSpark = text.match(/\b(?:for\s+)?(?:a\s+)?(?:new\s+)?(?:broad\s+)?(?:provisional\s+)?(?:hobby|interest)(?:\s+spark)?\s*[,;:\u2014-]\s*([^.!?\n]+)[.!?]?/i);
  if (editorialSpark) {
    const sparkDescription = editorialSpark[1].trim();
    const title = sparkDescription.split(/\s+(?:is|was|means|shows|suggests|could|might|would|seems|because|as)\b/i)[0].trim();
    if (!sparkTitle && title) {
      sparkTitle = title.slice(0, 90);
      sparkQuestion = "What might Mabel discover about " + sparkTitle + "?";
      sparkReason = "This activity caught her attention in a conversation.";
      sparkKind = isConcreteHumanHobby(sparkTitle) ? "hobby" : "";
    }
    text = text.replace(editorialSpark[0], " ").replace(/\s+/g, " ").replace(/^[,;—\s]+|[,;—\s]+$/g, "").trim();
  }
  text = text.replace(/\b(?:a\s+)?small question about (?:this |the )?hobby\b[\s\S]*$/i, "")
    .replace(/\bwhy this caught (?:our|my|her) attention\b[\s\S]*$/i, "")
    .replace(/\s+/g, " ").trim();
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
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim().replace(/(?:\r?\n\s*|\s+[—–-]\s*)(?:(?:best|love|with love|yours)[,!]?\s*)?Mabel[.!]?\s*$/i, "").trim();
    if (candidate && typeof candidate.text === "string" && candidate.text.trim()) return candidate.text.trim().replace(/(?:\r?\n\s*|\s+[—–-]\s*)(?:(?:best|love|with love|yours)[,!]?\s*)?Mabel[.!]?\s*$/i, "").trim();
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
  chatExchangesElement.scrollTop = 0;
  while (chatExchangesElement.children.length > 12) {
    chatExchangesElement.lastElementChild.remove();
  }
  replyElement = reply;
}

async function handleVisitorMessage() {
  if (messagePending || !messageElement) return;
  const message = messageElement.value.trim();

  if (!message) {
    if (chatStatusElement) chatStatusElement.textContent = "Write a little message for Mabel first.";
    return;
  }

  if (!visitorProfile || typeof visitorProfile !== "object") visitorProfile = loadVisitorProfile();
  visitorProfile.facts = Array.isArray(visitorProfile.facts) ? visitorProfile.facts : [];
  visitorProfile.moments = Array.isArray(visitorProfile.moments) ? visitorProfile.moments : [];
  mabel.knowledge = Array.isArray(mabel.knowledge) ? mabel.knowledge : [];
  mabel.feed = Array.isArray(mabel.feed) ? mabel.feed : [];
  mabel.interests = Array.isArray(mabel.interests) ? mabel.interests : [];
  wanderings = Array.isArray(wanderings) ? wanderings : [];
  researchLog = Array.isArray(researchLog) ? researchLog : [];
  conversation = Array.isArray(conversation) ? conversation : [];

  const explicitResearchRequest = parseExplicitResearchRequest(message);
  const asksAboutBoard = /\b(?:notice\s*board|noticeboard|visitor(?:s)?[’']?\s+board|board\s+note|notes?\s+on\s+the\s+board|\bboard\b)\b/i.test(message);
  const visitorMessageAt = now();
  const activityTopic = message.replace(/\s+/g, " ").slice(0, 100);
  const drawingSubject = isArtworkRequest(message) ? requestedArtworkDescriptionSubject(message) : "";
  addFeedEntry({
    at: visitorMessageAt,
    kind: "did",
    source: "visitor",
    text: isArtworkRequest(message)
      ? "A visitor asked Mabel to draw " + (drawingSubject || "a little picture") + "."
      : "Mabel talked with a visitor about “" + activityTopic + (message.length > 100 ? "…”." : "”.")
  });
  saveMabel();
  updatePage();
  messagePending = true;
  createChatExchange(message);
  if (messageElement) messageElement.disabled = true;
  if (sendButton) sendButton.disabled = true;
  if (chatStatusElement) chatStatusElement.textContent = "";

  try {
    captureVisitorFacts(message);
    replyElement.textContent = "Mabel is listening...";
    let currentBoardContext = [];
    if (asksAboutBoard) {
      try {
        const boardResponse = await fetch(MABEL_BOARD_URL, { method: "GET", cache: "no-store" });
        if (boardResponse.ok) {
          const boardData = await boardResponse.json();
          currentBoardContext = (Array.isArray(boardData.messages) ? boardData.messages : [])
            .filter(function (note) { return note && String(note.message || "").trim(); })
            .slice(0, 8)
            .map(function (note) {
              return {
                kind: "visitor-board-note",
                text: "Current shared Visitors’ noticeboard note: “" + String(note.message).trim().slice(0, 240) + "”" +
                  (note.name ? " (signed “" + String(note.name).trim().slice(0, 40) + "”; this is only the note’s sign-off)." : "")
              };
            });
        }
      } catch (boardError) {
        // Chat still works if the shared noticeboard is temporarily unavailable.
      }
    }
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
        }).concat(currentBoardContext),
        conversation: [],
        itemKnowledge: mabel.knowledge.slice(0, 16),
        recentMoments: mabel.feed.slice(0, 12).map(function (entry) { return { at: entry.at, kind: entry.kind, text: entry.text }; }),
        recentWanderings: wanderings.slice(0, 8).map(function (outing) { return { at: outing.at, title: outing.title, finds: (outing.finds || []).slice(0, 4) }; }),
        visitorProfile: {
          facts: visitorProfile.facts.slice(0, 12).map(function (fact) { return fact.text; })
        },
        replyGuidance: explicitResearchRequest
          ? "Answer this one visitor message directly and warmly in a complete, self-contained reply. They asked you to research “" + explicitResearchRequest.title + "”. Say you will look into it; do not claim findings before the Library search returns. Do not ask a question or expect another message."
          : asksAboutBoard
          ? "The visitor is asking about the shared Visitors’ noticeboard. Use the supplied current visitor-board-note memories to answer about the actual notes currently there. Mention a specific note or say plainly that the board is empty/unavailable if none were supplied. Do not invent a note, confuse the sign-off with a verified identity, or repeatedly bring the board up when it was not asked about. Answer this one message directly and do not ask a follow-up question."
          : "Answer this one visitor message directly and warmly in a complete, self-contained reply. Use visitor facts, recent moments, and item knowledge only when clearly relevant. If the visitor asks how you feel or what you need, answer about your own current mood and needs; never turn their question back on them. Answer yes/no questions first. Do not invent what the visitor said, bring up an unrelated old subject, ask a follow-up question, or expect another message.",
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
    const workerDiagnostic = String(data && data.debug && data.debug.message || "");
    const quotaExhausted = /\b4006\b|daily free allocation of 10,000 neurons|used up.*10,000 neurons/i.test(workerDiagnostic);
    if (quotaExhausted) {
      replyElement.textContent = "My thoughts are all fuzzy right now.";
      if (isArtworkRequest(message)) {
        await requestMabelArtwork({ source: "visitor", message: message, forceLocalFallback: true }, replyElement);
        queueArtworkReferenceResearch(message);
      } else if (visitorSeemsDistressed(message)) {
        const comfortArt = await requestMabelArtwork({
          source: "comfort",
          comfortRequest: true,
          message: message,
          comfortSubject: comfortDrawingSubject(message),
          mood: mabel.now.mood,
          activity: "making a small comfort drawing for a visitor",
          thought: "A little picture might be a kind thing to leave for them.",
          forceLocalFallback: true
        }, null);
        queueComfortPostboxMail(message, comfortArt);
      }
      if (chatStatusElement) {
        chatStatusElement.textContent = "The site has used its 10,000 free tokens for today. Try again later.";
      }
      return;
    }
    const parsedReply = separateSparkMarker(normalizeMabelReply(data));
    if (!parsedReply.text) throw new Error("Mabel’s Worker returned no reply text.");
    const inlineSpark = sparkFromMarker(parsedReply, "conversation", message);
    growVisitorBond(1.5, "a thoughtful chat");

    replyElement.textContent = parsedReply.text;
    if (data.spark) {
      recordSpark({ ...data.spark, grounded: true, source: "conversation", evidenceText: message + " " + parsedReply.text });
    } else if (inlineSpark) {
      recordSpark({ ...inlineSpark, grounded: true, evidenceText: message + " " + parsedReply.text });
    }

    let requestedArtwork = null;
    if (isArtworkRequest(message)) {
      const drawingSubject = requestedArtworkDescriptionSubject(message);
      addFeedEntry({
        kind: "did",
        source: "visitor",
        text: drawingSubject
          ? "Mabel began an initial sketch of " + drawingSubject + " for her visitor."
          : "Mabel began a little drawing for her visitor.",
        why: "A visitor asked her to draw, and she started by letting her own marks take shape."
      });
      saveMabel();
      updatePage();
      requestedArtwork = await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
      queueArtworkReferenceResearch(message);
    } else if (visitorSeemsDistressed(message)) {
      requestedArtwork = await requestMabelArtwork({
        source: "comfort",
        comfortRequest: true,
        message: message,
        mood: mabel.now.mood,
        activity: "making a small comfort drawing for a visitor",
        thought: "A little picture might be a kind thing to leave for them."
      }, null);
      queueComfortPostboxMail(message, requestedArtwork);
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

    mabel.needs.connection = clampNeed(Math.max(0.35, mabel.needs.connection) + 0.12);
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.08);

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    saveMabel();
    updateHomeObjects();
    updatePage();
    persistSharedNeeds();

    messageElement.value = "";
    window.setTimeout(function () {
      processNextDeferredReflection().catch(function (error) {
        console.warn("Mabel’s private reflection could not be saved.", error);
      });
    }, 0);
  } catch (error) {
    console.warn("Mabel chat request failed.", error);
    replyElement.textContent = "Mabel's lantern flickers. \"The path to my thoughts is tangled tonight. Try again in a moment.\"";
    if (chatStatusElement) {
      chatStatusElement.textContent = "Connection detail: " + String(error && error.message || "unknown chat error");
    }
    if (isArtworkRequest(message)) {
      await requestMabelArtwork({ source: "visitor", message: message }, replyElement);
      queueArtworkReferenceResearch(message);
    }
  } finally {
    messagePending = false;
    if (messageElement) messageElement.disabled = false;
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = "Send message";
    }
  }
}

function makeGiftKeepsakeNote(gift) {
  const name = String(gift && gift.name || "this little gift").trim();
  const key = normalizeInterestTitle(name);
  if (/hazelnut/.test(key)) return "A fallen hazelnut. How kind.";
  if (/bead/.test(key)) return "How sweet. I wonder if it fell from a necklace.";
  if (gift && gift.edible) return "Edible, and safely tucked away for later.";
  if (gift && gift.kind === "food") return "A little something to nibble later. How kind.";
  if (gift && gift.kind === "water") return "A little drink for a thirsty day.";
  if (/toy|plush|figurine|doll|card/.test(key)) return "A tiny treasure with a story of its own.";
  if (/flower|bouquet|petal/.test(key)) return "A small bit of colour to keep close.";
  if (/stone|pebble|fossil|shell/.test(key)) return "A little piece of the outside world.";
  return "How kind. I wonder what story brought it here.";
}

function makeGiftPostboxNote(gift) {
  const name = String(gift && gift.name || "your little gift").trim();
  const key = normalizeInterestTitle(name);
  if (/sesame/.test(key)) return "Do you like sesame seeds too? I’ve started wondering what people make with them. Do you have a favourite recipe?";
  if ((gift && gift.kind === "food") || /mushroom|hazelnut|seed|berry|focaccia|bread|fruit|nut/.test(key)) return "Do you enjoy " + name + " too? Do you have a favourite way to eat it? I’m curious what else people make with it.";
  if (/nintendo|game cartridge|ds game/.test(key)) return "I found your old game cartridge and can’t stop wondering what game it belongs to. Did you have a favourite game to play?";
  if (/candle|tea light/.test(key)) return "I noticed the little candle. What did you use it for? I wonder what the room felt like when it was lit.";
  return "I’ve been turning " + name + " over in my paws. Does it have a story? I’d love to know why you chose it for me.";
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

function isUncleanWater(name) {
  return /\b(?:dirty|muddy|murky|stagnant|cloudy)\b/i.test(String(name || ""));
}

function deliverDueGiftPostboxNotes() {
  ensureHollowWorld();
  const current = Date.now();
  let changed = false;
  mabel.world.objects.forEach(function (gift) {
    if (!gift || gift.source !== "visitor" || gift.visitSessionId !== currentVisitorSessionId() || !gift.noticedAt || gift.postboxNoteAt) return;
    if (mabelPostboxItems.some(function (entry) { return entry && entry.relatedGiftId === gift.id; })) {
      gift.postboxNoteAt = gift.noticedAt;
      changed = true;
      return;
    }
    if (!Number.isFinite(Date.parse(gift.postboxNoteReadyAt || ""))) {
      gift.postboxNoteReadyAt = new Date(Date.parse(gift.noticedAt) + 3 * 60 * 1000).toISOString();
      changed = true;
    }
    if (Date.parse(gift.postboxNoteReadyAt) > current) return;
    addMabelPostboxItem({
      id: "gift-note-" + gift.id,
      kind: "gift-reaction",
      title: "A little question about your gift",
      text: makeGiftPostboxNote(gift),
      relatedGiftId: gift.id,
      at: now()
    });
    gift.postboxNoteAt = now();
    changed = true;
  });
  if (changed) saveMabel();
}

async function noticeNextVisitorGift() {
  ensureHollowWorld();
  const pendingGifts = mabel.world.objects.filter(function (item) {
    return item && item.source === "visitor" && item.visitSessionId === currentVisitorSessionId() && !item.noticedAt;
  });
  let rescheduledGift = false;
  pendingGifts.forEach(function (item) {
    if (!Number.isFinite(Date.parse(item.noticeAfter || ""))) {
      item.noticeAfter = new Date(Date.now() + (5 + Math.random() * 5) * 60 * 1000).toISOString();
      rescheduledGift = true;
    }
  });
  if (rescheduledGift) saveMabel();
  const nowMs = Date.now();
  const dueGifts = pendingGifts
    .filter(function (item) { return Date.parse(item.noticeAfter) <= nowMs; })
    .sort(function (a, b) { return Date.parse(a.noticeAfter) - Date.parse(b.noticeAfter); });
  const gift = dueGifts[0];
  if (!gift || giftNoticeInProgress) return;
  giftNoticeInProgress = true;
  const eventText = "During a quiet moment in her own day, Mabel notices a " + gift.name + " left at home. React to this specific object itself: describe a detail or possible use suggested by the object, then give Mabel a small feeling or question about it. Do not answer with only a generic acknowledgement that a visitor left something.";
  try {
    let data = {};
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
      if (response.ok) data = await response.json();
    } catch (workerError) {
      // Mabel can still notice a specific gift if her AI worker is unavailable.
    }
    const parsedGiftReply = separateSparkMarker(normalizeMabelReply(data));
    const inlineGiftSpark = sparkFromMarker(parsedGiftReply, "discovery", gift.name);
    const rawGiftReply = parsedGiftReply.text;
    parsedGiftReply.text = personalizeGiftReaction(rawGiftReply, gift);
    const dirtyWaterGift = isUncleanWater(gift.name) && (gift.kind === "water" || (gift.kind === "object" && /water|puddle/i.test(gift.name)));
    if (dirtyWaterGift) parsedGiftReply.text = "Mabel peers into the muddy water, wrinkles her nose, and leaves it safely aside. She feels a little disappointed, but decides to keep looking for a clean drink.";
    const researchableGift = ["object", "surprise", "treasure"].includes(gift.kind);
    const giftNeedsResearch = gift.kind === "object" || (parsedGiftReply.text !== rawGiftReply && researchableGift);
    gift.noticedAt = now();
    growVisitorBond(3, "Mabel noticed a gift");
    gift.postboxNoteReadyAt = new Date(Date.now() + (3 + Math.random() * 5) * 60 * 1000).toISOString();
    gift.reaction = parsedGiftReply.text;
    gift.bindleNote = makeGiftKeepsakeNote(gift);
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
        searchTerm: gift.kind === "object" ? gift.name : researchKeywordFromFinding(gift.name),
        source: "discovery",
        grounded: true,
        originText: "Mabel noticed the visitor gift " + gift.name + " and wondered what it is for.",
        originAt: gift.noticedAt,
        isGiftResearch: giftNeedsResearch,
        giftId: gift.id
      });
    }

    if (dirtyWaterGift) {
      mabel.needs.comfort = clampNeed(mabel.needs.comfort - 0.12);
      mabel.now.mood = "disappointed";
      gift.status = "set aside";
      addFeedEntry({ kind: "did", text: "Mabel found " + gift.name + " but left it alone.", why: "The water looked muddy, and she wanted to find something clean." });
    } else if (gift.kind === "food") {
      bindle.food.unshift({ name: gift.name, note: gift.bindleNote || makeGiftKeepsakeNote(gift), giftId: gift.id, source: "visitor" });
      trimBindleItems(bindle.food, 8);
      gift.status = "saved for later";
    } else if (gift.kind === "water") {
      bindle.water.unshift({ name: gift.name, note: gift.bindleNote || makeGiftKeepsakeNote(gift), giftId: gift.id, source: "visitor" });
      trimBindleItems(bindle.water, 5);
      gift.status = "saved for later";
    } else {
      bindle.treasures.unshift({ name: gift.name, note: gift.bindleNote || makeGiftKeepsakeNote(gift), giftId: gift.id, source: "visitor" });
      trimBindleItems(bindle.treasures, 12);
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
    if (gift.noticedAt) {
      gift.bindleNote = gift.bindleNote || makeGiftKeepsakeNote(gift);
      if (!["eaten", "drank"].includes(gift.status)) {
        const target = gift.edible || gift.kind === "food" ? bindle.food : gift.kind === "water" ? bindle.water : bindle.treasures;
        const existing = target.some(function (item) { return item && item.giftId === gift.id; });
        if (!existing) target.unshift({ name: gift.name, note: gift.bindleNote, giftId: gift.id, source: "visitor", edible: Boolean(gift.edible) });
        if (gift.status === "noticed" || gift.status === "waiting") gift.status = gift.edible ? "packed as food" : "saved for later";
      }
      if (!gift.postboxNoteReadyAt) gift.postboxNoteReadyAt = new Date(Date.parse(gift.noticedAt) + 3 * 60 * 1000).toISOString();
      saveBindle();
      updateHomeObjects();
      updatePage();
    }
    saveMabel();
  } finally {
    giftNoticeInProgress = false;
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
  if (boardNoticeInProgress) return null;
  let claimedBoardNote = false;
  try {
    const response = await fetch(MABEL_BOARD_URL, { method: "GET", cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    const notes = Array.isArray(data.messages) ? data.messages.slice(0, 50) : [];
    const next = notes.slice().reverse().find(function (note) {
      return note && String(note.message || "").trim() &&
        !boardReadKeys.includes(visitorBoardNoteKey(note));
    });
    if (!next) return null;

    boardNoticeInProgress = true;
    claimedBoardNote = true;
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
  } finally {
    if (claimedBoardNote) boardNoticeInProgress = false;
  }
}

function researchWords(value) {
  const stopWords = new Set([
    "about", "after", "again", "also", "because", "board", "connected", "could",
    "distinctive", "directly", "draw", "draws", "from", "have", "into", "just", "mabel", "message",
    "might", "more", "other", "over", "phrase", "read", "research", "saw", "she",
    "subject", "that", "their", "them", "there", "these", "they", "this", "those", "place", "sounds", "suppose", "times", "bit", "talked", "said", "love", "like", "mentioned", "visitor",
    "what", "when", "where", "which", "while", "with", "would", "your", "hers",
    "found", "finds", "thing", "things", "note", "visitor", "visitors", "tied", "little", "tiny", "small", "old",
    "bouquet", "bunch", "bundle", "arrangement", "pile", "heap"
  ]);
  return normalizeInterestTitle(value).split(" ").filter(function (word) {
    return word.length > 3 && !stopWords.has(word);
  }).map(function (word) {
    return word.endsWith("s") ? word.slice(0, -1) : word;
  });
}

function deriveResearchKeyword(candidate) {
  const title = String((candidate && candidate.title) || "");
  const source = normalizeInterestTitle(candidate && candidate.source || "");
  if (title && /\b(exploration|discovery|wandering)\b/.test(source)) {
    return researchKeywordFromFinding(title);
  }
  const titleWords = researchWords(title);
  const genericTitles = new Set(["question", "thought", "idea", "interest", "wonder", "place", "mabel", "hollow", "thing"]);
  const specificTitleWords = titleWords.filter(function (word) { return !genericTitles.has(word); });
  if (specificTitleWords.length > 1) return specificTitleWords.slice(-2).join(" ");
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
  let core = String(value || "").toLowerCase().trim()
    .replace(/^\s*(?:a|an|the)\s+/, "")
    .replace(/\b(?:called|named|described as)\s+/g, "")
    .split(/[,.!?;:]/)[0]
    .trim();
  const ofMatch = core.match(/\b(?:of|full of|filled with|made from|made of|containing)\s+(.+)$/i);
  if (ofMatch && researchWords(ofMatch[1]).length >= 1) core = ofMatch[1].trim();

  let words = core.match(/[a-z0-9'-]+/gi) || [];
  const discard = new Set(["a", "an", "the", "tied", "little", "tiny", "small", "old", "very", "quite", "some", "found", "piece", "bit"]);
  words = words.filter(function (word) { return !discard.has(word.toLowerCase()); });
  const wrappers = new Set(["bouquet", "bunch", "bundle", "arrangement", "pile", "heap"]);
  while (words.length > 1 && wrappers.has(words[words.length - 1].toLowerCase())) words.pop();
  if (!words.length) return "";
  return words.slice(-3).join(" ");
}

function researchMatchesFocus(text, focusInterest) {
  if (!focusInterest) return true;
  // Match the page against the specific source keyword, not the broad wording of Mabel's question.
  const focusWords = Array.from(new Set(researchWords(focusInterest.searchTerm || focusInterest.title)));
  const resultWords = new Set(researchWords(text));
  const matchedWords = focusWords.filter(function (word) { return resultWords.has(word); });
  const requiredMatches = focusWords.length >= 3 ? 2 : 1;
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
      const searchTerm = ["exploration", "wandering"].includes(idea.source)
        ? researchKeywordFromFinding(idea.title)
        : (deriveResearchKeyword(idea) || deriveResearchKeyword({ title: idea.title, question: idea.question }));
      candidates.push({
        ...idea,
        id: idea.id,
        ideaTitle: idea.title,
        question: idea.question,
        originText: idea.originText || "",
        originAt: idea.originAt || "",
        searchTerm: ["exploration", "wandering"].includes(idea.source) ? (searchTerm || idea.title) : (idea.searchTerm || searchTerm || idea.title),
        isManualResearchRequest: idea.requestType === "visitor-request",
        isGiftResearch: Boolean(idea.isGiftResearch),
        giftId: idea.giftId || "",
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

  const nonBoardFresh = fresh.filter(function (item) { return item.source !== "visitor-board"; });
  if (nonBoardFresh.length) return nonBoardFresh[Math.floor(Math.random() * nonBoardFresh.length)];

  const freshBoardNote = fresh.find(function (item) { return item.source === "visitor-board"; });
  if (freshBoardNote && Math.random() < 0.2) return freshBoardNote;

  const nonBoardCandidates = candidates.filter(function (item) { return item.source !== "visitor-board"; });
  if (nonBoardCandidates.length) return nonBoardCandidates[Math.floor(Math.random() * nonBoardCandidates.length)];
  return guidingAimResearchFocus();
}

function chooseAutonomousArtworkInspiration() {
  const usedKeys = new Set(gallery.map(function (artwork) { return artwork && artwork.inspirationKey; }).filter(Boolean));
  ensureHollowWorld();
  const conversations = mabel.feed.filter(function (entry) {
    return entry && entry.kind === "mind" && entry.text &&
      (entry.source === "conversation" || /thought back to your conversation/i.test(entry.text));
  }).slice(0, 12).map(function (entry) {
    return {
      title: entry.personalityCue || "a conversation Mabel remembered",
      question: entry.text,
      source: "conversation",
      key: "conversation|" + normalizeInterestTitle(entry.text)
    };
  }).filter(function (item) { return !usedKeys.has(item.key); });

  const discoveries = [];
  mabel.world.objects.filter(function (object) {
    return object && object.source === "visitor" && object.noticedAt && object.name;
  }).slice(0, 8).forEach(function (object) {
    const title = String(object.name).trim();
    const key = "visitor-gift|" + String(object.id || normalizeInterestTitle(title));
    if (!usedKeys.has(key)) discoveries.push({
      title: title,
      question: object.reaction || object.bindleNote || "The gift a visitor left, " + title + ", has stayed in Mabel’s thoughts.",
      source: "visitor-gift",
      giftId: object.id || "",
      key: key
    });
  });
  wanderings.slice(0, 12).forEach(function (outing) {
    (Array.isArray(outing && outing.finds) ? outing.finds : []).forEach(function (find) {
      if (!find || !find.name) return;
      const title = String(find.name).trim();
      const key = "discovery|" + normalizeInterestTitle(title);
      if (!usedKeys.has(key)) discoveries.push({
        title: title,
        question: find.note || "Mabel remembers finding " + title + " on a wander and wonders about its story.",
        source: "exploration",
        key: key
      });
    });
  });

  ensureHollowWorld();
  mabel.world.objects.filter(function (object) {
    return object && object.source === "wandering" && object.name;
  }).slice(0, 8).forEach(function (object) {
    const title = String(object.name).trim();
    const key = "discovery|" + normalizeInterestTitle(title);
    if (!usedKeys.has(key) && !discoveries.some(function (item) { return item.key === key; })) {
      discoveries.push({
        title: title,
        question: object.note || "Mabel remembers finding " + title + " and wonders what story it carries.",
        source: "exploration",
        key: key
      });
    }
  });

  const research = researchLog.filter(function (entry) {
    return entry && entry.related && entry.researchSummary &&
      ["autonomous", "exploration", "wandering", "discovery", "conversation", "returning-spark"].includes(entry.focusSource);
  }).slice(0, 10).map(function (entry) {
    const title = entry.focusTitle || entry.title || entry.searchQuestion;
    return {
      title: title,
      question: entry.researchSummary || entry.searchQuestion,
      source: "research",
      key: "research|" + normalizeInterestTitle(title)
    };
  }).filter(function (item) { return item.title && !usedKeys.has(item.key); });

  const interests = mabel.interests.filter(function (interest) {
    return interest && interest.title && ["growing", "pursuing"].includes(interest.stage);
  }).slice(0, 8).map(function (interest) {
    return {
      title: interest.title,
      question: interest.nextAction || interest.nextQuestion || interest.question || "A subject Mabel has returned to more than once.",
      source: "interest",
      key: "interest|" + normalizeInterestTitle(interest.title)
    };
  }).filter(function (item) { return !usedKeys.has(item.key); });

  const returnedSparks = sparks.filter(function (spark) {
    return spark && spark.title && (Number(spark.evidence) >= 2 || ["growing", "pursuing"].includes(spark.stage));
  }).slice(0, 8).map(function (spark) {
    return {
      title: spark.title,
      question: spark.question || spark.reason,
      source: "returning-spark",
      key: "spark|" + normalizeInterestTitle(spark.title)
    };
  }).filter(function (item) { return !usedKeys.has(item.key); });

  const boardNotes = mabel.feed.filter(function (entry) {
    return entry && entry.kind === "mind" && entry.text &&
      (entry.source === "visitor-board" || /Visitors’ board note/i.test(entry.text));
  }).slice(0, 4).map(function (entry) {
    return {
      title: entry.personalityCue || "a note Mabel remembered",
      question: entry.text,
      source: "visitor-board",
      key: "visitor-board|" + normalizeInterestTitle(entry.text)
    };
  }).filter(function (item) { return !usedKeys.has(item.key); });

  const candidates = [
    ...conversations.map(function (item) { return { ...item, weight: 4 }; }),
    ...discoveries.map(function (item) { return { ...item, weight: item.source === "visitor-gift" ? 3.5 : 4 }; }),
    ...research.map(function (item) { return { ...item, weight: 3 }; }),
    ...interests.map(function (item) { return { ...item, weight: 2 }; }),
    ...returnedSparks.map(function (item) { return { ...item, weight: 1 }; })
  ];
  let pool = candidates;
  if (boardNotes.length && (!candidates.length || Math.random() < 0.05)) pool = boardNotes;
  if (pool.length) {
    const totalWeight = pool.reduce(function (sum, item) { return sum + (item.weight || 1); }, 0);
    let selection = Math.random() * totalWeight;
    for (const candidate of pool) {
      selection -= candidate.weight || 1;
      if (selection <= 0) return candidate;
    }
    return pool[pool.length - 1];
  }

  if (Math.random() < 0.12) {
    return {
      title: "a moment from today",
      question: mabel.now.thought || "A small feeling Mabel wants to remember.",
      source: "today",
      key: "today|" + new Date().toISOString().slice(0, 10)
    };
  }
  return null;
}

function chooseCurrentArtworkInspiration() {
  return chooseAutonomousArtworkInspiration();
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
      if (newArtwork) {
        showGalleryNotice(newArtwork);
        if (artworkInspiration && artworkInspiration.source === "visitor-gift") {
          queueArtworkReferenceResearch("Draw " + artworkInspiration.title, {
            isGiftArtReference: true,
            giftId: artworkInspiration.giftId || ""
          });
        }
      }
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
  const trustedSources = new Set(["conversation", "visitor board", "discovery", "exploration", "research", "creative practice"]);
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
    return item && item.source === "visitor" && item.visitSessionId === currentVisitorSessionId() && item.noticedAt;
  }).sort(function (a, b) {
    return Date.parse(b.noticedAt || 0) - Date.parse(a.noticedAt || 0);
  });
  for (const gift of gifts) {
    const key = String(gift.id || gift.name) + "|" + String(gift.noticedAt);
    if (!seen.includes(key) && !viewedVisitorGiftNoticeKeys.has(key)) return { ...gift, noticeKey: key };
  }
  return null;
}

function setVisitorGiftHighlight(gift) {
  if (!gift || !gift.id) return;
  try { sessionStorage.setItem(visitorGiftHighlightStorageKey, String(gift.id)); } catch (error) {}
  updateBindle();
}

function getVisitorGiftHighlightId() {
  try { return sessionStorage.getItem(visitorGiftHighlightStorageKey) || ""; } catch (error) { return ""; }
}

function clearVisitorGiftHighlight(giftId) {
  if (!giftId || getVisitorGiftHighlightId() !== String(giftId)) return;
  try { sessionStorage.removeItem(visitorGiftHighlightStorageKey); } catch (error) {}
  updateBindle();
}

function updateVisitorGiftNotice() {
  const gift = currentVisitorGiftNotice();
  if (!visitorGiftNoticeCard) return;
  if (!gift) {
    visitorGiftNoticeCard.classList.add("hidden");
    return;
  }
  if (visitorGiftNoticeText) {
    visitorGiftNoticeText.textContent = "Mabel noticed the gift you left her.";
  }
  visitorGiftNoticeCard.classList.remove("hidden");
}

function markVisitorGiftNoticeSeen(markAllNoticedGifts) {
  ensureHollowWorld();
  let seen = [];
  try {
    const saved = JSON.parse(localStorage.getItem(visitorGiftSeenStorageKey) || "[]");
    seen = Array.isArray(saved) ? saved : [];
  } catch (error) {}

  const giftsToMark = markAllNoticedGifts
    ? mabel.world.objects.filter(function (item) { return item && item.source === "visitor" && item.visitSessionId === currentVisitorSessionId() && item.noticedAt; })
    : [currentVisitorGiftNotice()].filter(Boolean);

  giftsToMark.forEach(function (gift) {
    const key = gift.noticeKey || (String(gift.id || gift.name) + "|" + String(gift.noticedAt));
    viewedVisitorGiftNoticeKeys.add(key);
    if (!seen.includes(key)) seen.unshift(key);
  });

  try {
    localStorage.setItem(visitorGiftSeenStorageKey, JSON.stringify(seen.slice(0, 100)));
  } catch (error) {}
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
  return gallery.find(function (artwork) { return artwork && artwork.title && artwork.source === "autonomous"; }) || null;
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
      ? "Mabel’s hobby has grown: " + latest.title
      : "This sparked an interest: " + latest.title;
  }
  if (sparkNoticeText && latest) {
    sparkNoticeText.textContent = latest.notificationType === "level-up"
      ? "See how her interest has grown in Mabel’s Inner Life."
      : "See why it caught her attention and how it grows in Mabel’s Inner Life.";
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
  if (!artwork || !artwork.title) return;
  const key = artworkNoticeKey(artwork);
  if (!key || key === lastViewedArtworkKey) {
    if (galleryNoticeCard) galleryNoticeCard.classList.add("hidden");
    return;
  }
  if (galleryNoticeText) {
    galleryNoticeText.textContent = artwork.source === "autonomous"
      ? "A new painting has joined Mabel’s Gallery: “" + artwork.title + "”."
      : "“" + artwork.title + "” has joined Mabel’s Gallery.";
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
  const concreteHobby = candidate.kind === "hobby" && isConcreteHumanHobby(title);
  const durableCandidate = isDurableInterestCandidate(candidate);
  const priorConcreteHobby = Boolean(previousInterest && previousInterest.kind === "hobby" &&
    isConcreteHumanHobby(previousInterest.title));
  const priorInterestStillFits = priorConcreteHobby && (durableCandidate || concreteHobby);
  const qualifies = priorInterestStillFits ||
    (concreteHobby && (candidate.kind === "hobby" || (durableCandidate && spark.evidence >= 3 && ageMs >= 24 * 60 * 60 * 1000)));

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
      if (concreteHobby) interest.kind = "hobby";
      const nextLevel = Math.min(5, 1 + Math.floor(Math.max(0, spark.evidence - 3) / 3));
      interest.level = Math.max(previousLevel, nextLevel);
      if (!priorConcreteHobby) interest.level = 1;
      const isConcreteHobbyInterest = isConcreteHumanHobby(interest.title) && interest.kind === "hobby";
      if (newlyPromoted && isConcreteHobbyInterest) {
        spark.notificationAt = timestampText;
        spark.notificationType = "new-hobby";
        addFeedEntry({
          kind: "mind",
          personalityChange: true,
          sparkId: spark.id,
          personalityCue: "A new hobby is taking root",
          text: "Mabel is beginning to make room in her life for " + spark.title + ".",
          why: spark.question,
          interest: spark.id
        });
      } else if (isConcreteHobbyInterest && interest.level > previousLevel) {
        spark.notificationAt = timestampText;
        spark.notificationType = "level-up";
        addFeedEntry({
          kind: "mind",
          personalityChange: true,
          sparkId: spark.id,
          personalityCue: "A hobby is growing",
          text: "Mabel’s interest in " + spark.title + " has grown stronger.",
          why: spark.question,
          interest: spark.id
        });
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
        reflectionGuidance: "Reflect on this one completed visit using only the exact visitor message, Mabel reply, and supplied recent discoveries. Visitors are an important bridge to Mabel’s knowledge of people and the wider world: when someone clearly shares a hobby they enjoy (such as baking) or patiently teaches her something, let that create a small provisional hobby spark and a question she may research. It is an early curiosity, not a permanent identity. For a one-off object or fact, create only a research curiosity unless the evidence points to a broader hobby. If the visitor gives a specific fact about a found or gifted item, return it as itemKnowledge {item,fact}, grounded in their words and the recent context. A brief association like “good luck” after a four-leaf clover find may be recorded as the visitor linking that item with luck, not as a scientific fact. Do not invent an item or fact. Only use kind hobby when the title names a specific, recognizable human activity or skill such as baking, sewing, playing music, public speaking, or home decorating. A place, object, nature detail, or vague idea remains a curiosity to research, not a hobby. If a concrete hobby is clearly created, use kind hobby so the site can show a Spark notification; do not emit a hobby spark for every topic. Do not return an interest or spark for a greeting or unrelated small talk. Do not assign a fixed career or personality. If the exchange clearly shows an emerging quality, return a short personalityCue and exact personalityEvidence; otherwise return no cue.",
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
        source: "conversation",
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
      source: "visitor-board",
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
  if (reflectionInProgress) return;
  const reflection = reflectionQueue[0];
  if (!reflection) return;
  reflectionInProgress = true;
  try {
    const succeeded = reflection.type === "conversation"
      ? await reflectOnConversation(reflection.visitorMessage, reflection.mabelReply, reflection.sparkCandidate, true)
      : reflection.type === "board-note"
        ? await reflectOnVisitorBoardNote(reflection)
        : true;
    if (succeeded) {
      reflectionQueue.shift();
      saveReflectionQueue();
    }
  } finally {
    reflectionInProgress = false;
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
  { kind: "treasure", name: "a grand piano abandoned in a garden shed", note: "Mabel climbed onto the pedals and wondered how a room could hold so many notes." },
  { kind: "treasure", name: "an old makeup brush with a rose-gold handle", note: "Its bristles made a soft little broom, and Mabel wondered what colours it had once swept across." },
  { kind: "treasure", name: "a one-eyed teddy bear with a loose blue ribbon", note: "Its remaining button eye seemed to be keeping watch for whoever lost it." },
  { kind: "treasure", name: "a crinkled chocolate bar wrapper", note: "It smelled faintly sweet and flashed like a tiny silver blanket." },
  { kind: "treasure", name: "a Magic: The Gathering trading card", note: "The picture showed a world Mabel had never seen, full of names she wanted to learn." },
  { kind: "treasure", name: "a Nathan for You DVD box set", note: "The box was enormous beside Mabel; she wondered what sort of stories could fill so many discs." },
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
  { kind: "treasure", name: "a mouse-sized red tricycle with one squeaky pedal", note: "Mabel wondered how far three little wheels could carry her." },
  { kind: "treasure", name: "a dried clover pressed flat in a book page", note: "A small green memory from a much larger story." },
  { kind: "food", name: "a crumb of oat biscuit", note: "A useful little bite for the road." },
  { kind: "food", name: "half a dried cranberry", note: "Tart, chewy, and a very good travelling snack." },
  { kind: "food", name: "a sesame seed", note: "Small enough to save, if she could keep track of it." },
  { kind: "food", name: "a sliver of apple", note: "It still smelled faintly sweet." },
  { kind: "food", name: "a crumb of cheese", note: "A rich little mouthful wrapped in no wrapper at all." },
  { kind: "food", name: "a fallen sunflower seed", note: "A proper seed with a satisfying shell." },
  { kind: "food", name: "a corner of plain cracker", note: "Crisp enough to make a tiny sound." },
  { kind: "food", name: "one oat flake", note: "A modest snack with grand ambitions." },
  { kind: "food", name: "a tiny pinch of rolled oats", note: "Just enough for the smallest possible cake." },
  { kind: "food", name: "a wild blackberry", note: "Its juice stained one of Mabel’s paws a dusky purple." },
  { kind: "food", name: "a dried raisin", note: "A wrinkled little sweetness, fit for a bun." },
  { kind: "food", name: "a paper twist of flour", note: "A pale dusting escaped from a forgotten bakery parcel." },
  { kind: "water", name: "a clean bead of rain gathered in a curled leaf", note: "A small drink sheltered from the wind." },
  { kind: "water", name: "a drop of dew on a clover leaf", note: "It trembled but did not spill." },
  { kind: "water", name: "a shallow puddle in a shell", note: "A little pool with a very useful edge." },
  { kind: "food", name: "a little piece of plain pizza crust", note: "The corner was chewy and smelled of a late supper." },
  { kind: "food", name: "a crumb from an old bakery bun", note: "A soft crumb with a faint smell of warm bread." },
  { kind: "food", name: "a small dried porcini mushroom", note: "A fragrant little morsel, saved carefully for later." },
  { kind: "food", name: "a tiny strawberry top", note: "It still held a bead of sweetness." },
  { kind: "food", name: "a hazelnut split open along its seam", note: "A proper little meal hidden in a shell." },
  { kind: "water", name: "fresh rainwater in an acorn cap", note: "A clean sip with a woody rim." },
  { kind: "water", name: "a muddy puddle beneath an old boot", note: "It looked like water from far away, but the mud made Mabel pause." },
  { kind: "water", name: "a stagnant puddle with a leaf floating on top", note: "Mabel kept her nose above the cloudy surface." }
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

async function fetchPublicResearchFallback(searchTerm) {
  const keyword = String(searchTerm || "").trim().slice(0, 100);
  if (!keyword) return null;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    generator: "search",
    gsrsearch: keyword,
    gsrlimit: "3",
    prop: "extracts|info|pageimages",
    inprop: "url",
    piprop: "thumbnail",
    pithumbsize: "640",
    exintro: "1",
    explaintext: "1",
    exsentences: "3",
    origin: "*"
  });
  const response = await fetch("https://en.wikipedia.org/w/api.php?" + params.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("The public encyclopedia returned status " + response.status);
  const result = await response.json();
  const pages = result && result.query && Array.isArray(result.query.pages) ? result.query.pages : [];
  const sources = pages.filter(function (page) {
    return page && page.title && page.extract && safeExternalUrl(page.fullurl);
  }).slice(0, 3).map(function (page) {
    return {
      title: String(page.title).slice(0, 160),
      url: safeExternalUrl(page.fullurl),
      snippet: String(page.extract).slice(0, 500),
      imageUrl: safeExternalUrl(page.thumbnail && page.thumbnail.source || "")
    };
  });
  if (!sources.length) return null;
  return {
    title: sources[0].title,
    searchQuestion: keyword,
    researchSummary: sources.map(function (source) { return source.snippet; }).join("\n\n"),
    sources: sources,
    sourceTitle: sources[0].title,
    url: sources[0].url,
    musing: "Mabel followed “" + keyword + "” to a public encyclopedia and kept a detail that caught her eye.",
    libraryFallback: true
  };
}

async function fetchWikimediaCommonsReference(searchTerm) {
  const keyword = String(searchTerm || "").trim().slice(0, 80);
  if (!keyword) return null;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    generator: "search",
    gsrsearch: "filetype:bitmap " + keyword,
    gsrnamespace: "6",
    gsrlimit: "5",
    prop: "imageinfo",
    inprop: "url",
    iiprop: "url",
    iiurlwidth: "640",
    origin: "*"
  });
  const response = await fetch("https://commons.wikimedia.org/w/api.php?" + params.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Wikimedia Commons returned status " + response.status);
  const result = await response.json();
  const pages = result && result.query && Array.isArray(result.query.pages) ? result.query.pages : [];
  const sources = pages.map(function (page) {
    const image = page && Array.isArray(page.imageinfo) ? page.imageinfo[0] : null;
    return {
      title: String(page && page.title || "").replace(/^File:/i, "").slice(0, 160),
      url: safeExternalUrl(page && page.fullurl || ""),
      imageUrl: safeExternalUrl(image && (image.thumburl || image.url) || ""),
      snippet: String(page && page.description || "").slice(0, 500)
    };
  }).filter(function (source) { return source.title && source.url && source.imageUrl; });
  return sources.length ? {
    title: sources[0].title,
    searchQuestion: keyword,
    researchSummary: sources.map(function (source) { return source.snippet; }).filter(Boolean).join("\n\n"),
    sources: sources,
    sourceTitle: sources[0].title,
    url: sources[0].url,
    libraryFallback: true
  } : null;
}

function commonEdibleGiftName(value) {
  const name = normalizeInterestTitle(value);
  return /\b(blackberry|blueberry|raspberry|strawberry|cranberry|apple|hazelnut|sunflower seed|sesame seed|oat|bread|pizza crust|cracker|biscuit|cheese|carrot|rice|plain mushroom|porcini|shiitake|oyster mushroom|button mushroom|portobello)\b/.test(name);
}

function researchConfirmsEdibleGift(data, focusInterest) {
  const status = data && (data.edibleFood !== undefined ? data.edibleFood : data.edibility);
  if (status === true || String(status || "").toLowerCase() === "edible" ||
      (status && typeof status === "object" && (status.edible === true || String(status.status || "").toLowerCase() === "edible"))) return true;
  if (status === false || String(status || "").toLowerCase() === "not edible") return false;
  const title = focusInterest && (focusInterest.ideaTitle || focusInterest.title || focusInterest.searchTerm) || "";
  const sourceText = [data && data.title, data && data.searchQuestion, data && data.researchSummary,
    ...(Array.isArray(data && data.sources) ? data.sources.map(function (source) { return [source.title, source.snippet].join(" "); }) : [])].join(" ");
  return commonEdibleGiftName(title) || (/\bedible\b/i.test(sourceText) && researchMatchesFocus(sourceText, { title: title }));
}

function moveVisitorGiftToFood(gift, data, research) {
  if (!gift || gift.edible) return;
  gift.edible = true;
  gift.edibleAt = now();
  gift.edibleReason = String(data.edibleReason || research.researchSummary || "A library source identified it as food.").slice(0, 260);
  gift.status = "packed as food";
  bindle.treasures = (bindle.treasures || []).filter(function (item) { return item.giftId !== gift.id; });
  bindle.water = (bindle.water || []).filter(function (item) { return item.giftId !== gift.id; });
  bindle.food = (bindle.food || []).filter(function (item) { return item.giftId !== gift.id; });
  bindle.food.unshift({ name: gift.name, note: makeGiftKeepsakeNote({ ...gift, edible: true }), giftId: gift.id, source: "visitor", edible: true });
  trimBindleItems(bindle.food, 8);
  addFeedEntry({ kind: "noticed", text: "Mabel learned that " + gift.name + " is edible and tucked it with her food.", why: gift.edibleReason });
  addMabelPostboxItem({
    id: "edible-gift-" + gift.id,
    kind: "gift-reaction",
    title: "Mabel found out your gift is edible",
    text: "I looked up your " + gift.name + " and found out it can be eaten. I’ve tucked it safely with my food.",
    relatedGiftId: gift.id,
    sources: research.sources,
    at: now()
  });
  saveBindle();
  saveMabel();
  updateHomeObjects();
  updatePage();
}

function researchPayloadMatchesFocus(payload, focusInterest, searchTerm) {
  const sources = Array.isArray(payload && payload.sources) ? payload.sources.slice(0, 3) : [];
  const evidence = [
    payload && payload.title,
    payload && payload.searchQuestion,
    payload && payload.researchSummary,
    payload && payload.sourceTitle,
    ...sources.map(function (source) { return [source && source.title, source && source.snippet].filter(Boolean).join(" "); })
  ].filter(Boolean).join(" ");
  return researchMatchesFocus(evidence, { ...focusInterest, searchTerm: searchTerm || focusInterest.title });
}

function chooseResearchPostcardSentence(research) {
  const passages = [
    ...((Array.isArray(research && research.sources) ? research.sources : []).map(function (source) {
      return source && source.snippet || "";
    })),
    research && research.researchSummary || ""
  ];
  for (const passage of passages) {
    const clean = String(passage || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [];
    const sentence = sentences.map(function (item) { return item.trim(); })
      .find(function (item) { return item.length >= 35 && item.length <= 220; });
    if (sentence) return sentence;
  }
  return "";
}

async function redrawResearchReference(focusInterest, reference, researchEntry) {
  if (!mabel || !focusInterest || !reference || !reference.imageUrl) return false;
  if (researchEntry && researchEntry.redrawAttemptedAt) return false;
  if (researchEntry) {
    researchEntry.redrawAttemptedAt = now();
    researchEntry.redrawDueAt = "";
    saveResearchLog();
  }
  mabel.now.doing = "painting in her art studio";
  mabel.now.thought = "I want to see whether this new detail helps me draw " + focusInterest.title + ".";
  mabel.now.updatedAt = now();
  addFeedEntry({
    kind: "did",
    force: true,
    text: "Mabel went to her art studio to try drawing " + focusInterest.title + " again.",
    why: "She had studied a visual reference at the Library and wanted to explore the subject more creatively."
  });
  saveMabel();
  updatePage();
  const inspiration = {
    title: focusInterest.title,
    question: "Mabel wanted to explore " + focusInterest.title + " more creatively after studying a visual reference at the Library."
  };
  const artContext = {
    source: focusInterest.isGiftArtReference ? "autonomous" : "visitor",
    message: "Draw " + focusInterest.title,
    referenceImageUrl: reference.imageUrl,
    referenceTitle: reference.sourceTitle || "",
    referenceFact: reference.fact || "",
    referenceRetry: true,
    deferGallery: true,
    referenceImageInstruction: "Use the actual reference image as a clear drawing guide for " + focusInterest.title + ". Make the main subject large and recognizable, with a confident silhouette, visible anatomy or parts, and several smaller identifying details. Keep Mabel’s expressive layered washes, lively brush marks, and hand-drawn texture around the subject. The reference should improve the subject, not make the whole picture sparse or minimalist. Never paste or trace the image.",
    inspiration: inspiration
  };
  const refinedArtwork = await requestMabelArtwork(artContext, null);
  if (artContext.referenceObservation) {
    reference.visualNotes = String(artContext.referenceObservation).slice(0, 700);
    fetch(MABEL_BRAIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "art-reference", artReference: reference })
    }).then(function (response) {
      if (response.ok) refreshSharedMabelBrain();
    }).catch(function () {});
  }
  if (refinedArtwork) {
    const firstFact = reference.fact ? " One thing Mabel learned: " + reference.fact : "";
    if (focusInterest.isGiftArtReference) {
      addFeedEntry({
        kind: "did",
        text: "Mabel added a new study of " + focusInterest.title + " to her Gallery.",
        why: "A visitor’s gift inspired the first drawing; Mabel returned to the Library for a visual reference and practiced it again."
      });
    } else {
      refinedArtwork.postboxFirst = true;
      addMabelPostboxItem({
        kind: "artwork",
        title: "Mabel brought you a new drawing of " + focusInterest.title,
        text: inspiration.question + firstFact,
        artwork: refinedArtwork,
        sources: [{ title: reference.sourceTitle, url: reference.pageUrl }]
      });
      addFeedEntry({
        kind: "did",
        text: "Mabel brought her new drawing of " + focusInterest.title + " to the Postbox.",
        why: "She wanted to share the second study after learning from a visual reference."
      });
    }
    if (researchEntry) researchEntry.redrawDeliveredAt = now();
    saveResearchLog();
    updatePage();
    return true;
  }

  addFeedEntry({
    kind: "did",
    text: "Mabel could not finish the second drawing of " + focusInterest.title + " yet.",
    why: "The Library reference is saved, so she can return to the art studio later."
  });
  if (researchEntry) {
    researchEntry.redrawFailedAt = now();
    researchEntry.redrawFailure = "The single studio attempt did not return a usable drawing.";
    saveResearchLog();
  }
  saveMabel();
  updatePage();
  return false;
}

async function handleWander(options) {
  if (!mabel) return;
  const focusInterest = options && options.focusInterest;
  if (!focusInterest || !focusInterest.title) return;
  let searchTerm = focusInterest.isGuidingAimStep
    ? ""
    : focusInterest.source === "exploration"
      ? String(researchKeywordFromFinding(focusInterest.title) || focusInterest.searchTerm || focusInterest.title).trim()
      : String(focusInterest.searchTerm || deriveResearchKeyword(focusInterest) || focusInterest.title).trim();
  if (focusInterest.requestType === "art-reference" && /^a?\s*car$/i.test(String(focusInterest.title || "").trim())) {
    searchTerm = "automobile road vehicle";
  }
  const displayTitle = searchTerm || focusInterest.title;
  const researchStartedAt = now();

  if (wanderStatus) wanderStatus.textContent = "Mabel is following a question that caught her attention.";
  const libraryMethods = [
    "on the public computer by the window",
    "in the library’s web browser",
    "following links on a library computer",
    "on the library’s public PC"
  ];
  let researchMethod = libraryMethods[Math.floor(Math.random() * libraryMethods.length)];

  try {
    let response;
    let data;
    let workerError = null;
    try {
      response = await fetch(MABEL_WANDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        focusInterest: { ...focusInterest, ...(searchTerm ? { searchTerm: searchTerm } : {}) },
        interests: [focusInterest],
        guidingAim: MABEL_GUIDING_AIM,
        researchInstruction: focusInterest.requestType === "art-reference"
          ? "Research the requested drawing subject " + focusInterest.title + " online to find a reliable visual reference. Return the exact subject, a relevant article title, the canonical page URL, a real image thumbnail URL from the article if one is available, and one short factual sentence. Do not invent an image URL or use a generic image unrelated to this subject." + (/^a?\s*car$/i.test(String(focusInterest.title || "").trim()) ? " Here car means a road-going automobile, not CAR as an acronym or the Central African Republic." : "")
          : focusInterest.isGiftResearch
          ? "Research this exact visitor gift: " + focusInterest.title + ". Search online for reliable web pages about what it is; do not describe the physical gift itself as something Mabel read. If reliable sources confirm it is ordinary edible food, return edibleFood true and a brief source-grounded edibleReason. If it is not food or you cannot confirm it is safe to eat, return edibleFood false. Never guess that an unfamiliar object, plant, or mushroom is edible. Return real webpage titles, URLs, and snippets."
          : focusInterest.isGuidingAimStep
          ? "For this step in Mabel’s broad wish to understand life beyond her woods, choose one concrete, verifiable subject she has not researched recently. Let the web search choose a varied subject rather than using a fixed topic list. Search the public web, open relevant pages where possible, and return the actual specific subject as title, a search question, a useful fact, and a source URL/title. Treat sources as web pages she explored through the library computer, not as physical objects she found or necessarily as books she read. Keep it a one-time discovery unless it later keeps drawing her attention. Do not invent results or say she found an object."
          : focusInterest.requestType === "research-follow-up"
            ? "Follow up the exact question Mabel wrote down: " + focusInterest.title + ". Use DuckDuckGo or another public web search to search the meaningful words in this question, open real relevant results, and return one useful fact with its real title and URL. Stay on this follow-up and do not replace it with a different topic."
            : focusInterest.isManualResearchRequest
              ? "A visitor explicitly asked Mabel to research this topic. Search the web and answer the requested question directly with one useful finding grounded in real web pages, then follow one naturally amusing, surprising, or curious detail from a mouse’s point of view. Keep the visitor’s topic central and return webpage titles, URLs, and snippets. Describe Mabel as looking it up online through the library computer; do not say she read the physical object or imply every source is a book. Do not claim anything the sources do not support."
              : "Start with the specific keyword Mabel picked from the real source. Ask what an autonomous little mouse who has come to life might find funniest, strangest, or most unexpectedly relatable about this particular thing; let that angle shape a real question, rather than inserting a stock joke or returning to a fixed topic. Keep the keyword central. If food or an ingredient is involved, consider recipes or surprising food facts. Search the public web, compare two or three relevant search results, and return their real webpage titles, URLs, and snippets. If the first search is off-topic, try a different question that still contains and follows the same keyword. Keep every claim tied to supplied sources. Describe Mabel as looking something up or exploring web pages through the library computer; do not say she read the physical object or imply every source is a book. Do not switch to an unrelated object or topic. This is a library research moment, not an exploration: do not say Mabel found or picked up a new object.",
        autonomyPlan: focusInterest.isGuidingAimStep
          ? "This is one small step toward Mabel’s open-ended wish to build a fulfilling life by learning about the wider world. Choose a varied subject, keep the finding as a passing discovery, and do not turn it into an interest, career, or fixed trait unless it continues to matter across real moments."
          : focusInterest.requestType === "research-follow-up"
            ? "This is a question Mabel herself chose after another search. Follow it up on a later Library visit with an actual web search, using DuckDuckGo or another public search engine. Do not leave it as an uncompleted question."
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
      data = await response.json();
    } catch (error) {
      workerError = error;
    }
    if (data && searchTerm && !researchPayloadMatchesFocus(data, focusInterest, searchTerm)) data = null;
    if (!data && searchTerm) {
      data = await fetchPublicResearchFallback(searchTerm).catch(function () { return null; });
      if (data) researchMethod = "in the public encyclopedia";
    }
    if (!data) throw workerError || new Error("The Library could not find a useful page for this question.");
    let rawSources = Array.isArray(data.sources)
      ? data.sources.slice(0, 3).filter(function (source) {
          return source && source.title && safeExternalUrl(source.url);
        }).map(function (source) {
          return {
            title: String(source.title).slice(0, 160),
            url: safeExternalUrl(source.url),
            snippet: String(source.snippet || "").slice(0, 500),
            imageUrl: safeExternalUrl(source.imageUrl || source.thumbnail || "")
          };
        })
      : [];
    if (!rawSources.length && data.sourceTitle && data.url) {
      const legacyUrl = safeExternalUrl(data.url);
      if (legacyUrl) rawSources.push({ title: String(data.sourceTitle).slice(0, 160), url: legacyUrl, snippet: "", imageUrl: "" });
    }
    let relatedSources = rawSources.filter(function (source) {
      return focusInterest.isGuidingAimStep ||
        researchMatchesFocus(source.title + " " + source.snippet, { ...focusInterest, searchTerm: searchTerm });
    });
    if (!focusInterest.isGuidingAimStep && searchTerm && !relatedSources.length) {
      const encyclopediaResult = await fetchPublicResearchFallback(searchTerm).catch(function () { return null; });
      if (encyclopediaResult && Array.isArray(encyclopediaResult.sources)) {
        const fallbackSources = encyclopediaResult.sources.filter(function (source) {
          return source && source.title && safeExternalUrl(source.url);
        }).map(function (source) {
          return {
            title: String(source.title).slice(0, 160),
            url: safeExternalUrl(source.url),
            snippet: String(source.snippet || "").slice(0, 500),
            imageUrl: safeExternalUrl(source.imageUrl || "")
          };
        });
        const fallbackRelated = fallbackSources.filter(function (source) {
          return researchMatchesFocus(source.title + " " + source.snippet, { ...focusInterest, searchTerm: searchTerm });
        });
        const fallbackVisuals = focusInterest.requestType === "art-reference"
          ? fallbackSources.filter(function (source) { return safeWikimediaImageUrl(source.imageUrl); })
          : [];
        const usableFallbackSources = fallbackRelated.length ? fallbackRelated : fallbackVisuals;
        if (usableFallbackSources.length) {
          data = encyclopediaResult;
          rawSources = fallbackSources;
          relatedSources = usableFallbackSources;
          researchMethod = "in the public encyclopedia";
        }
      }
    }
    if (focusInterest.requestType === "art-reference" && !relatedSources.some(function (source) { return safeWikimediaImageUrl(source.imageUrl); })) {
      const imageResult = await fetchPublicResearchFallback(searchTerm).catch(function () { return null; });
      const imageSources = imageResult && Array.isArray(imageResult.sources) ? imageResult.sources.filter(function (source) {
        return source && source.title && safeWikimediaImageUrl(source.imageUrl) && safeExternalUrl(source.url);
      }) : [];
      const imageRelated = imageSources.filter(function (source) {
        return researchMatchesFocus(source.title + " " + source.snippet, { ...focusInterest, searchTerm: searchTerm });
      });
      // This request was already a search for the exact drawing subject. Wikipedia’s
      // first image result can use a synonymous article title (for example, cattle
      // for cow), so keep its safe image even when the text matcher is too strict.
      const usableImageSources = imageRelated.length ? imageRelated : imageSources;
      if (usableImageSources.length) {
        data = imageResult;
        rawSources = imageSources;
        relatedSources = usableImageSources;
        researchMethod = "in the public encyclopedia";
      }
    }
    if (focusInterest.requestType === "art-reference" && !relatedSources.some(function (source) { return source.imageUrl; })) {
      const commonsResult = await fetchWikimediaCommonsReference(searchTerm).catch(function () { return null; });
      const commonsSources = commonsResult && Array.isArray(commonsResult.sources) ? commonsResult.sources : [];
      const commonsVisuals = commonsSources.filter(function (source) {
        return safeWikimediaImageUrl(source.imageUrl) && safeExternalUrl(source.url);
      });
      const commonsRelated = commonsVisuals.filter(function (source) {
        return researchMatchesFocus(source.title + " " + source.snippet, { ...focusInterest, searchTerm: searchTerm });
      });
      const usableCommonsSources = commonsRelated.length ? commonsRelated : commonsVisuals;
      if (usableCommonsSources.length) {
        data = commonsResult;
        rawSources = commonsSources;
        relatedSources = usableCommonsSources;
        researchMethod = "following links from a Library search";
      }
    }
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
      researchId: focusInterest.id,
      at: now(),
      requestType: focusInterest.requestType || "",
      focusTitle: ["exploration", "wandering"].includes(focusInterest.source)
        ? focusInterest.title
        : (focusInterest.isGuidingAimStep && relevant ? data.title : displayTitle),
      focusQuestionTitle: focusInterest.title,
      focusSource: focusInterest.source || "",
      requestType: focusInterest.requestType || "",
      sourceOriginText: focusInterest.originText || "",
      sourceOriginAt: focusInterest.originAt || "",
      searchTerm: searchTerm || String(data.searchQuestion || "").slice(0, 100),
      searchQuestion: searchTerm || data.searchQuestion || focusInterest.question || "",
      title: relevant ? (data.title || displayTitle) : "A new question from this search",
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
        : "This search sparked Mabel’s curiosity. She now wonders: " + followUpQuestionForResearch(focusInterest, data),
      followUpQuestion: relevant ? String(data.followUpQuestion || data.nextQuestion || "").slice(0, 220) : followUpQuestionForResearch(focusInterest, data),
      researchMethod: researchMethod,
      related: relevant
    };

    if (focusInterest.isGiftResearch && relevant && researchConfirmsEdibleGift(data, focusInterest)) {
      const researchedGift = (mabel.world && mabel.world.objects || []).find(function (item) {
        return item && item.id === focusInterest.giftId && item.source === "visitor";
      });
      if (researchedGift) moveVisitorGiftToFood(researchedGift, data, research);
    }

    if (focusInterest.requestType === "art-reference") {
      const visualSource = relatedSources.find(function (source) { return source && safeWikimediaImageUrl(source.imageUrl); });
      if (visualSource) {
        research.artReference = {
          subject: focusInterest.title,
          imageUrl: safeWikimediaImageUrl(visualSource.imageUrl),
          pageUrl: safeExternalUrl(visualSource.url),
          sourceTitle: visualSource.title,
          fact: String(visualSource.snippet || "").split(/(?<=[.!?])\s+/)[0].slice(0, 260),
          at: research.at
        };
      }
    }
    researchLog = researchLog.filter(function (entry) { return !(entry && entry.researchId === focusInterest.id); });
    researchLog.unshift(research);
    researchLog = researchLog.slice(0, 30);
    let followUpIdea = null;
    if (!relevant && research.followUpQuestion) {
      followUpIdea = addResearchIdea({
        id: "research-tangent-" + normalizeInterestTitle(research.followUpQuestion),
        title: String(research.followUpQuestion).slice(0, 90),
        question: research.followUpQuestion,
        searchTerm: researchKeywordFromFinding(research.followUpQuestion),
        source: "research", grounded: true,
        requestType: focusInterest.requestType === "research-follow-up" ? "" : "research-follow-up",
        originText: "While looking into " + focusInterest.title + ", this next question caught Mabel’s attention.",
        originAt: research.at
      });
    }
    if (focusInterest.source === "exploration") {
      const matchesOuting = function (outing) {
        return outing && outing.at === focusInterest.originAt &&
          Array.isArray(outing.finds) && outing.finds.some(function (found) {
            return normalizeInterestTitle(found.name) === normalizeInterestTitle(focusInterest.title);
          });
      };
      const sourceOuting = wanderings.find(matchesOuting) || autonomousExplorerLog.find(matchesOuting);
      if (sourceOuting) {
        sourceOuting.research = {
          at: research.at,
          focusTitle: research.focusTitle,
          searchQuestion: research.searchQuestion,
          researchSummary: research.researchSummary,
          sources: research.sources,
          related: research.related,
          followUpQuestion: research.followUpQuestion || ""
        };
        saveWanderings();
        saveAutonomousExplorerLog();
      }
    }
    if (followUpIdea && focusInterest.requestType !== "research-follow-up") {
      window.setTimeout(function () {
        const queuedFollowUp = researchIdeas.find(function (idea) { return idea && idea.id === followUpIdea.id; });
        if (queuedFollowUp && !queuedFollowUp.lastResearchedAt) scheduleWanderingResearch(queuedFollowUp);
      }, 5 * 60 * 1000 + Math.random() * 5 * 60 * 1000);
    }
    saveResearchLog();
    // Research results live in the Library. The Postbox is reserved for personal notes.

    const researchedIdea = researchIdeas.find(function (item) {
      return item.id === focusInterest.id ||
        normalizeInterestTitle(item.title) === normalizeInterestTitle(focusInterest.ideaTitle || focusInterest.title);
    });
    if (researchedIdea) {
      const usableArtReference = focusInterest.requestType === "art-reference" && research.artReference && research.artReference.imageUrl;
      if (focusInterest.requestType === "art-reference" && !usableArtReference && (Number(researchedIdea.artReferenceAttempts) || 0) < 3) {
        researchedIdea.lastResearchedAt = "";
      } else {
        researchedIdea.lastResearchedAt = research.at;
      }
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
      at: research.at,
      kind: "did",
      force: true,
      source: "library",
      text: "Mabel researched “" + research.searchQuestion + "” at the Library.",
      why: [research.researchMethod, research.researchSummary].filter(Boolean).join(" ")
    });

    saveMabel();
    updatePage();
    if (focusInterest.requestType === "art-reference" && research.artReference && research.artReference.imageUrl) {
      const reference = research.artReference;
      fetch(MABEL_BRAIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "art-reference", artReference: reference })
      }).then(function (response) {
        if (response.ok) refreshSharedMabelBrain();
      }).catch(function () {});
      const redrawDelay = 90 * 1000 + Math.random() * 90 * 1000;
      research.redrawDueAt = new Date(Date.now() + redrawDelay).toISOString();
      saveResearchLog();
      await new Promise(function (resolve) { window.setTimeout(resolve, redrawDelay); });
      await redrawResearchReference(focusInterest, reference, research);
    }
    if (wanderStatus) {
      wanderStatus.textContent = relevant
        ? (researchMethod === "in the public encyclopedia"
          ? "Mabel found a useful encyclopedia page about “" + displayTitle + "” and kept a note."
          : "Mabel followed “" + displayTitle + "” through a few pages and kept a note.")
         : "Mabel kept a follow-up question to return to on a later Library visit.";
    }
    return research;
  } catch (error) {
    const failedAt = now();
    const alreadyLogged = researchLog.some(function (entry) {
      return entry && entry.requestType === (focusInterest.requestType || "") &&
        normalizeInterestTitle(entry.focusQuestionTitle || entry.focusTitle) === normalizeInterestTitle(focusInterest.title) &&
        Date.parse(entry.at || "") >= Date.parse(researchStartedAt);
    });
    if (!alreadyLogged) {
      const failure = String(error && error.message || "The Library search could not be reached.").slice(0, 220);
      researchLog = researchLog.filter(function (entry) { return !(entry && entry.researchId === focusInterest.id); });
      researchLog.unshift({
        researchId: focusInterest.id,
        kind: "research", at: failedAt, requestType: focusInterest.requestType || "",
        focusTitle: focusInterest.title, focusQuestionTitle: focusInterest.title,
        searchTerm: searchTerm || focusInterest.title, searchQuestion: searchTerm || focusInterest.title,
        title: focusInterest.title, sources: [], researchSummary: "", related: false,
        failed: true, failure: failure, researchMethod: researchMethod,
        sourceOriginText: focusInterest.originText || ""
      });
      researchLog = researchLog.slice(0, 30);
      addFeedEntry({
        at: failedAt, kind: "did", force: true, source: "library",
        text: "Mabel’s Library search for “" + String(focusInterest.title).slice(0, 80) + "” did not return a usable result.",
        why: failure
      });
      saveResearchLog();
      saveMabel();
      updatePage();
    }
    if (wanderStatus) {
      wanderStatus.textContent = "The Library connection is quiet just now. Mabel will try again later.";
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

Mabel's recent memories:
${mabel.memories.slice(0, 10).map(function (memory) { return memory.text; }).filter(Boolean).join("\n") || "Mabel has not gathered many lasting memories yet."}

Mabel's current mood is ${mabel.now.mood}.
Mabel is currently ${mabel.now.doing}.
Mabel's inner thought is: ${mabel.now.thought}
Mabel's already-established evolved traits: ${(mabel.personality.evolved_traits || []).map(function (entry) { return entry.trait; }).join(", ") || "none yet"}

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

Also consider whether the supplied moments show the same small preference, habit, or belief appearing repeatedly. If they do, you may return at most ONE new, subtle evolved trait. Ground it in repeated details from the supplied day, do not repeat an existing trait, and do not turn one passing thought into a fixed personality. Return null if the evidence is not strong enough. Never change Mabel's core traits.

Return only JSON like this:
{
  "title": "End-of-day reflection",
  "text": "Mabel's reflection",
  "evolved_trait": {
    "trait": "a short, specific habit or preference",
    "reason": "the repeated evidence from Mabel's day that supports it"
  }
}
Use "evolved_trait": null when there is no well-supported new trait.
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
    const newTrait = addEvolvedTrait(data.entry.evolved_trait || data.evolved_trait, reflectionEvidence);
    if (newTrait) {
      addFeedEntry({
        kind: "mind",
        text: "A small part of Mabel’s nature is taking root: " + mabel.personality.evolved_traits[0].trait + ".",
        why: mabel.personality.evolved_traits[0].reason,
        personalityCue: "A new trait is growing",
        personalityChange: true
      });
    }

    saveMabel();
    updatePage();
  } catch (error) {
    console.log("Mabel could not write her end-of-day reflection.", error);
  }
}

function switchTab(tabName) {
  const activePanel = document.querySelector(".tab-panel.active");
  if (activePanel && activePanel.id === "hollow" && tabName !== "hollow") {
    const highlightedGiftId = getVisitorGiftHighlightId();
    if (highlightedGiftId) clearVisitorGiftHighlight(highlightedGiftId);
  }
  if (tabName === "inner-life") markSparkNoticeSeen();
  if (tabName === "gallery-tab") markGalleryNoticeSeen();
  if (tabName === "art-exhibition") refreshSharedMabelBrain();
  tabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach(function (panel) {
    panel.classList.toggle("active", panel.id === tabName);
  });
  if (tabName === "visitor-board") loadVisitorBoard();
  if (tabName === "postbox") {
    markPostboxNoticeSeen();
    const postboxPanel = document.getElementById("postbox");
    if (postboxPanel) {
      window.requestAnimationFrame(function () {
        postboxPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
  showSparkNotice();
  refreshGalleryNotice();
  updateVisitorGiftNotice();
  refreshPostboxNotice();
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
  const defaultCoreTraits = ["gentle", "curious", "thoughtful", "quietly playful"];
  mabel.personality = mabel.personality && typeof mabel.personality === "object" ? mabel.personality : {};
  mabel.personality.core_traits = defaultCoreTraits;
  mabel.personality.evolved_traits = Array.isArray(mabel.personality.evolved_traits)
    ? mabel.personality.evolved_traits.filter(function (entry) {
        return entry && typeof entry.trait === "string" && typeof entry.reason === "string";
      }).slice(0, 18)
    : [];
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
  autonomousExplorerLog = loadAutonomousExplorerLog();
  curiosityPostboxQueue = loadCuriosityPostboxQueue();
  try { lastAutonomousWanderAt = Number(localStorage.getItem(autonomousExplorerStorageKey + "-last")) || 0; } catch (error) { lastAutonomousWanderAt = 0; }
  nextAutonomousWanderAt = lastAutonomousWanderAt ? lastAutonomousWanderAt + (10 + Math.random() * 10) * 60 * 1000 : Date.now();
  researchLog = loadResearchLog();
  mabelPostboxItems = loadMabelPostbox();
  comfortPostboxQueue = loadComfortPostboxQueue();
  try {
    const savedSeen = localStorage.getItem(postboxSeenStorageKey) || "";
    let parsedSeen = [];
    try {
      const value = JSON.parse(savedSeen);
      if (Array.isArray(value)) parsedSeen = value;
      else if (typeof value === "string" && value) parsedSeen = [value];
    } catch (error) {
      if (savedSeen) parsedSeen = [savedSeen];
    }
    viewedPostboxIds = new Set(parsedSeen.map(String).slice(-200));
  } catch (error) { viewedPostboxIds = new Set(); }
  boardReadKeys = loadBoardReadKeys();
  sparks = loadSparks().filter(function (spark) { return isGroundedResearchTrigger(spark); });
  researchIdeas = loadResearchIdeas();
  const unfinishedReferenceRedraw = researchLog.find(function (entry) {
    return entry && entry.requestType === "art-reference" && entry.artReference && entry.artReference.imageUrl &&
      !entry.redrawDeliveredAt && !entry.redrawFailedAt && !entry.redrawAttemptedAt;
  });
  if (unfinishedReferenceRedraw) {
    const referenceIdea = researchIdeas.find(function (idea) {
      return idea && normalizeInterestTitle(idea.title) === normalizeInterestTitle(unfinishedReferenceRedraw.focusQuestionTitle || unfinishedReferenceRedraw.focusTitle);
    });
    const referenceFocus = referenceIdea || {
      title: unfinishedReferenceRedraw.artReference.subject || unfinishedReferenceRedraw.focusTitle,
      requestType: "art-reference",
      source: unfinishedReferenceRedraw.focusSource || "conversation",
      isGiftArtReference: false
    };
    const dueAt = Date.parse(unfinishedReferenceRedraw.redrawDueAt || "");
    const resumeDelay = Number.isFinite(dueAt) ? Math.max(15000, dueAt - Date.now()) : 30000;
    window.setTimeout(function () {
      redrawResearchReference(referenceFocus, unfinishedReferenceRedraw.artReference, unfinishedReferenceRedraw);
    }, resumeDelay);
  }
  const pendingResearch = researchIdeas.filter(function (idea) {
    const hasSavedReference = idea && idea.requestType === "art-reference" && researchLog.some(function (entry) {
      return entry && entry.requestType === "art-reference" && entry.artReference && entry.artReference.imageUrl &&
        normalizeInterestTitle(entry.focusQuestionTitle || entry.focusTitle) === normalizeInterestTitle(idea.title);
    });
    return idea && ["research-follow-up", "art-reference"].includes(idea.requestType) && !idea.lastResearchedAt && !hasSavedReference;
  });
  const resumeResearch = pendingResearch.find(function (idea) { return idea.requestType === "art-reference"; }) || pendingResearch[0];
  if (resumeResearch) {
    scheduleWanderingResearch(resumeResearch);
  }
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
  // Begin each visible-page session with a fresh quiet interval.
  lastAutonomousMoment = Date.now();
  saveLastAutonomousMoment();
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
  updateVisitorProfile();
  showSparkNotice();
  refreshGalleryNotice();
  window.setTimeout(function () {
    if (mabel && document.visibilityState === "visible") noticeNextVisitorBoardNote();
  }, 5000);

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      switchTab(button.dataset.tab);
    });
  });

  accrueActiveVisitorTime();
  setInterval(accrueActiveVisitorTime, 60000);
  document.addEventListener("visibilitychange", function () {
    visitorProfile.activeTickAt = Date.now();
    saveVisitorProfile();
  });

  if (chatFormElement) {
    chatFormElement.addEventListener("submit", function (event) {
      event.preventDefault();
      handleVisitorMessage();
    });
  }

  if (messageElement) {
    messageElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        if (chatFormElement && typeof chatFormElement.requestSubmit === "function") {
          chatFormElement.requestSubmit();
        } else {
          handleVisitorMessage();
        }
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
      const gift = currentVisitorGiftNotice();
      setVisitorGiftHighlight(gift);
      markVisitorGiftNoticeSeen(false);
      switchTab("hollow");
      const safeId = gift && gift.id ? String(gift.id).replace(/[^a-z0-9_-]/gi, "") : "";
      const giftRow = safeId && (document.getElementById("bindle-gift-" + safeId) || document.getElementById("home-gift-" + safeId));
      const bindleElement = document.getElementById("bindle");
      const target = giftRow || bindleElement;
      if (target) target.scrollIntoView({ behavior: "smooth", block: giftRow ? "center" : "start" });
    });
  }
  if (dismissVisitorGiftButton) {
    dismissVisitorGiftButton.addEventListener("click", function () { markVisitorGiftNoticeSeen(false); });
  }
  if (viewPostboxButton) viewPostboxButton.addEventListener("click", function () { switchTab("postbox"); });
  if (dismissPostboxButton) dismissPostboxButton.addEventListener("click", markPostboxNoticeSeen);
  window.addEventListener("storage", function (event) {
    if (event.key === mabelStorageKey && event.newValue) {
      try {
        const updatedMabel = JSON.parse(event.newValue);
        if (updatedMabel && typeof updatedMabel === "object") {
          mabel = updatedMabel;
          ensureHollowWorld();
          bindle = loadBindle();
          updatePage();
        }
      } catch (error) {}
    } else if (event.key === bindleStorageKey) {
      bindle = loadBindle();
      updateBindle();
    } else if (event.key === mabelPostboxStorageKey) {
      mabelPostboxItems = loadMabelPostbox();
      updateMabelPostbox();
      refreshPostboxNotice();
    } else if (event.key === postboxSeenStorageKey) {
      try {
        const parsed = JSON.parse(event.newValue || "[]");
        viewedPostboxIds = new Set(Array.isArray(parsed) ? parsed.map(String).slice(-200) : []);
      } catch (error) {
        viewedPostboxIds = new Set(event.newValue ? [String(event.newValue)] : []);
      }
      refreshPostboxNotice();
    } else if (event.key === visitorGiftSeenStorageKey && event.newValue) {
      try {
        const seen = JSON.parse(event.newValue);
        viewedVisitorGiftNoticeKeys = new Set(Array.isArray(seen) ? seen : []);
      } catch (error) {}
      updateVisitorGiftNotice();
    }
  });
  if (viewGalleryButton) {
    viewGalleryButton.addEventListener("click", function () {
      markGalleryNoticeSeen();
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
  const resetBrowserButton = document.getElementById("reset-browser-mabel");
  if (resetBrowserButton) resetBrowserButton.addEventListener("click", resetThisBrowserMabel);
  loadVisitorBoard();
  refreshSharedMabelBrain();
  setInterval(refreshSharedMabelBrain, 60000);
  setInterval(function () {
    const boardPanel = document.getElementById("visitor-board");
    if (boardPanel && boardPanel.classList.contains("active")) loadVisitorBoard();
  }, 30000);

  // Read each shared board note once, independently of her longer autonomous moments.
  setInterval(function () {
    if (!mabel || document.visibilityState !== "visible") return;
    noticeNextVisitorBoardNote();
  }, 5 * 60 * 1000);

  // Once keepsakes have had a little time in her bindle, Mabel decides what to treasure.
  setInterval(function () {
    if (mabel) settleMatureBindleItems();
  }, 60000);

  // Check due visitor gifts separately from Mabel’s longer autonomous moments.
  setInterval(function () {
    if (mabel) {
      deliverDueComfortPostboxMail();
      deliverDueCuriosityPostboxMail();
    }
  }, 15000);

  setInterval(function () {
    if (!mabel || document.visibilityState !== "visible" || giftNoticeInProgress) return;
    ensureHollowWorld();
    const dueGift = mabel.world.objects.some(function (gift) {
      const dueAt = Date.parse(gift && gift.noticeAfter || "");
      return gift && gift.source === "visitor" && gift.visitSessionId === currentVisitorSessionId() && !gift.noticedAt && Number.isFinite(dueAt) && Date.now() >= dueAt;
    });
    deliverDueGiftPostboxNotes();
    deliverDueComfortPostboxMail();
    deliverDueCuriosityPostboxMail();
    if (dueGift) noticeNextVisitorGift();
  }, 60000);

  // Mabel can choose a needs-led wander while the page is open.
  setInterval(runNeedsDrivenAutonomousWander, 60000);

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