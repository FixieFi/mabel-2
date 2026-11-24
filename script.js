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
const conversationStorageKey = "mabel-conversation-v2";
const wanderingsStorageKey = "mabel-wanderings-v1";
const sparksStorageKey = "mabel-sparks-v1";
const autonomousStorageKey = "mabel-autonomous-v1";
const reflectionStorageKey = "mabel-last-reflection-date";
const bindleStorageKey = "mabel-bindle-v1";
const galleryStorageKey = "mabel-gallery-v1";

const interestSeeds = [
  {
    id: "silver-thread",
    title: "The Silver Thread",
    kind: "mystery",
    question: "Where does the silver thread beneath the hawthorn lead?",
    actions: [],
    curiosity: 0.9,
    pull: 0.8,
    stage: "pursuing"
  },
  {
    id: "rain-listening",
    title: "The Language of Rain",
    kind: "wonder",
    question: "What does the rain say when it lands on hawthorn leaves?",
    actions: [],
    curiosity: 0.5,
    pull: 0.4,
    stage: "dormant"
  },
  {
    id: "button-collecting",
    title: "The Museum of Small Lost Things",
    kind: "making",
    question: "Can Mabel make a little museum from the things the world has dropped?",
    actions: [],
    curiosity: 0.6,
    pull: 0.35,
    stage: "dormant"
  },
  {
    id: "old-lane",
    title: "The Lane That Forgot Its Name",
    kind: "wander",
    question: "Does an old lane remember the footsteps that once crossed it?",
    actions: [],
    curiosity: 0.7,
    pull: 0.45,
    stage: "dormant"
  }
];

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
    localStorage.setItem(conversationStorageKey, JSON.stringify(conversation));
  } catch (error) {
    // Local storage may be unavailable.
  }
}

function loadConversation() {
  try {
    const saved = localStorage.getItem(conversationStorageKey);

    if (saved) {
      return JSON.parse(saved);
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

  const card = document.createElement("div");
  card.className = "mabel-artwork-card";

  const title = document.createElement("p");
  title.className = "mabel-artwork-title";
  title.textContent = artwork.title;

  let seed = 0;
  const seedText = (artwork.title || "") + (artwork.note || "") + (artwork.motif || "");

  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) % 100000;
  }

  function nextRandom() {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  }

  const fallbackPalette = ["#7d9b76", "#2f3b52", "#e8dcc3"];
  const palette = Array.isArray(artwork.palette) && artwork.palette.length >= 2
    ? artwork.palette
    : fallbackPalette;

  const motif = artwork.motif || "mist";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 160 160");
  svg.setAttribute("class", "mabel-artwork-svg");

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "160");
  background.setAttribute("height", "160");
  background.setAttribute("fill", palette[0]);
  svg.appendChild(background);

  function addCircle(x, y, radius, colour, opacity) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", colour);
    circle.setAttribute("opacity", opacity);
    svg.appendChild(circle);
  }

  function addLine(x1, y1, x2, y2, colour, width, opacity) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", colour);
    line.setAttribute("stroke-width", width);
    line.setAttribute("opacity", opacity);
    svg.appendChild(line);
  }

  if (motif === "rain") {
    for (let i = 0; i < 22; i += 1) {
      const x = nextRandom() * 160;
      const y = nextRandom() * 120;
      addLine(x, y, x - 4, y + 18, palette[2], 1.5, 0.35 + nextRandom() * 0.4);
    }
    addCircle(110, 35, 14, palette[1], 0.55);
  }

  if (motif === "night") {
    for (let i = 0; i < 28; i += 1) {
      addCircle(nextRandom() * 160, nextRandom() * 160, nextRandom() * 2 + 0.5, palette[2], 0.4 + nextRandom() * 0.5);
    }
    addCircle(115, 40, 18, palette[2], 0.75);
  }

  if (motif === "bloom") {
    for (let i = 0; i < 9; i += 1) {
      const angle = (i / 9) * Math.PI * 2;
      const x = 80 + Math.cos(angle) * 34;
      const y = 80 + Math.sin(angle) * 34;
      addCircle(x, y, 12 + nextRandom() * 8, palette[i % palette.length], 0.45);
    }
    addCircle(80, 80, 10, palette[2], 0.85);
  }

  if (motif === "threads") {
    for (let i = 0; i < 7; i += 1) {
      const y = 20 + i * 20;
      addLine(0, y, 160, y + (nextRandom() * 40 - 20), palette[i % palette.length], 1.5, 0.5);
    }
    addCircle(nextRandom() * 120 + 20, nextRandom() * 120 + 20, 6, palette[2], 0.8);
  }

  if (motif === "roots") {
    for (let i = 0; i < 9; i += 1) {
      const x = 20 + i * 15;
      addLine(x, 160, x + (nextRandom() * 30 - 15), 60 + nextRandom() * 50, palette[1], 2, 0.55);
    }
    addCircle(80, 45, 20, palette[2], 0.5);
  }

  if (motif === "mist") {
    for (let i = 0; i < 14; i += 1) {
      addCircle(nextRandom() * 160, nextRandom() * 160, 16 + nextRandom() * 24, palette[i % palette.length], 0.16 + nextRandom() * 0.2);
    }
  }

  if (motif === "embers") {
    for (let i = 0; i < 20; i += 1) {
      addCircle(nextRandom() * 160, nextRandom() * 160, 2 + nextRandom() * 5, palette[1 + (i % 2)], 0.4 + nextRandom() * 0.5);
    }
  }

  if (motif === "stars") {
    for (let i = 0; i < 35; i += 1) {
      addCircle(nextRandom() * 160, nextRandom() * 160, nextRandom() * 1.8 + 0.4, palette[2], 0.35 + nextRandom() * 0.55);
    }
    addCircle(120, 35, 10, palette[1], 0.7);
  }

  const drawing = document.createElement("div");
  drawing.className = "mabel-artwork-drawing";
  drawing.appendChild(svg);

  const note = document.createElement("p");
  note.className = "mabel-artwork-note";
  note.textContent = artwork.note || "Mabel made a little drawing to remember this.";

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
    feed: [
      {
        at: now(),
        kind: "noticed",
        text: "Mabel found a silver thread beneath the hawthorn roots.",
        why: "It glimmered once, as though the night had dropped a stitch.",
        ok: true
      }
    ],
    interests: structuredClone(interestSeeds),
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

function updateInterest(interestId, change) {
  const interest = mabel.interests.find(function (item) {
    return item.id === interestId;
  });

  if (!interest) {
    return;
  }

  interest.pull = Math.max(0, Math.min(1, interest.pull + change));

  if (interest.pull > 0.65 && interest.stage === "dormant") {
    interest.stage = "pursuing";

    addFeedEntry({
      kind: "mind",
      text: "Mabel began a new thread: " + interest.title + ".",
      why: interest.question,
      interest: interest.id
    });
  }

  if (interest.pull > 0.9 && interest.stage === "pursuing") {
    interest.stage = "deepening";

    addFeedEntry({
      kind: "mind",
      text: "Mabel's thread, " + interest.title + ", has become important to her.",
      why: "Some questions begin to feel like homes.",
      interest: interest.id
    });
  }

  if (interest.pull < 0.15 && interest.stage !== "dormant") {
    interest.stage = "dormant";

    addFeedEntry({
      kind: "mind",
      text: "Mabel let " + interest.title + " rest for a while.",
      why: "Not every question needs an answer today.",
      interest: interest.id
    });
  }
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
    "follow_the_silver_thread",
    "listen_to_rain",
    "find_a_treasure",
    "visit_the_old_lane",
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

  const chosen = actionNames[Math.floor(Math.random() * actionNames.length)];

  const actionText = {
    follow_the_silver_thread: "following the silver thread beneath the hawthorn roots",
    listen_to_rain: "listening to rain gather on the hawthorn leaves",
    find_a_treasure: "searching beneath the roots for something small and shining",
    visit_the_old_lane: "walking a little way along the old lane",
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
    follow_the_silver_thread: "wondering",
    listen_to_rain: "quiet",
    find_a_treasure: "curious",
    visit_the_old_lane: "brave",
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
    follow_the_silver_thread: "The thread does not pull. It waits.",
    listen_to_rain: "Rain is the sky remembering how to speak softly.",
    find_a_treasure: "A lost thing is not always lost. Sometimes it is waiting to be noticed.",
    visit_the_old_lane: "Old paths deserve gentle footsteps.",
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
  mabel.now.doing = actionText[chosen];
  mabel.now.mood = actionMood[chosen];
  mabel.now.thought = actionThought[chosen];

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

  if (chosen === "follow_the_silver_thread") {
    updateInterest("silver-thread", 0.09);
  }

  if (chosen === "listen_to_rain") {
    updateInterest("rain-listening", 0.07);
  }

  if (chosen === "find_a_treasure") {
    updateInterest("button-collecting", 0.08);
  }

  if (chosen === "visit_the_old_lane") {
    updateInterest("old-lane", 0.08);
  }

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
      entry.kind === "diary" ||
      entry.kind === "noticed" ||
      entry.kind === "mind" ||
      entry.kind === "journal" ||
      entry.kind === "reflection"
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

async function handleVisitorMessage() {
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent = "Mabel tilts her head. \"The hollow is quiet, but I am still listening.\"";
    return;
  }

  replyElement.textContent = "Mabel is listening...";

  conversation.push({
    role: "user",
    content: message
  });

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

if (data.spark && data.spark.title) {
  const existingSpark = sparks.find(function (spark) {
    return spark.id === data.spark.id;
  });

  if (existingSpark) {
    existingSpark.pull = Math.min(
      1,
      (existingSpark.pull || 0.4) + 0.1
    );
  } else {
    sparks.unshift({
      id: data.spark.id || "spark-" + Date.now(),
      title: data.spark.title,
      question: data.spark.question || "",
      reason: data.spark.reason || "",
      source: "conversation",
      pull: data.spark.pull || 0.5,
      stage: "spark",
      createdAt: now()
    });
  }

  saveSparks();

  replyElement.append(document.createElement("br"));

  const sparkNotice = document.createElement("p");
  sparkNotice.className = "spark-notice";
  sparkNotice.textContent = "This has piqued Mabel’s interest.";
  replyElement.appendChild(sparkNotice);
}

    replyElement.textContent = data.reply;

    reflectOnConversation(message, data.reply);

    try {
      const artResponse = await fetch(MABEL_ART_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          memories: mabel.memories.slice(0, 8),
          wanderings: wanderings.slice(0, 5)
        })
      });

      if (artResponse.ok) {
        const artData = await artResponse.json();

        if (artData.artwork) {
          const artworkCard = renderMabelCard(artData.artwork);

          if (artworkCard) {
            replyElement.appendChild(document.createElement("br"));
            replyElement.appendChild(artworkCard);
          }

          saveToMabelGallery(artData.artwork);
        }
      }
    } catch (artError) {
      // Mabel can still reply even if the artwork Worker is unavailable.
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
      role: "assistant",
      content: data.reply
    });

    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }

    saveConversation();

    if (data.interest) {
      const existing = mabel.interests.find(function (interest) {
        return interest.id === data.interest.id;
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

    mabel.memories.unshift({
      at: now(),
      kind: "private-memory",
      text: "A visitor whispered: " + message
    });

    mabel.needs.connection = clampNeed(mabel.needs.connection + 0.18);
    mabel.needs.curiosity = clampNeed(mabel.needs.curiosity + 0.08);

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    addFeedEntry({
      kind: "noticed",
      text: "A visitor's words settled among the moss like a fallen petal.",
      why: "Mabel keeps small messages beside the moonlight."
    });

    saveMabel();
    updateHollowScene();
    updatePage();

    messageElement.value = "";
  } catch (error) {
    conversation.pop();

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
        conversation: conversation.slice(-10),
        feed: mabel.feed.slice(0, 15)
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

    writeEndOfDayReflection();
  } catch (error) {
    chooseAction();
  }
}

async function reflectOnConversation(visitorMessage, mabelReply) {
  try {
    const response = await fetch("https://mabel-life.fianna-b-murphy.workers.dev/reflect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        visitorMessage: visitorMessage,
        mabelReply: mabelReply,
        needs: mabel.needs,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 10),
        world: mabel.world
      })
    });

    if (!response.ok) return;

    const reflection = await reflectionResponse.json();

if (reflection.spark && reflection.spark.title) {
  const existingSpark = sparks.find(function (spark) {
    return spark.id === reflection.spark.id;
  });

  if (existingSpark) {
    existingSpark.pull = Math.min(
      1,
      (existingSpark.pull || 0.4) + 0.1
    );
  } else {
    sparks.unshift({
      id: reflection.spark.id || "spark-" + Date.now(),
      title: reflection.spark.title,
      question: reflection.spark.question || "",
      reason: reflection.spark.reason || "",
      source: "conversation",
      pull: reflection.spark.pull || 0.5,
      stage: "spark",
      createdAt: now()
    });
  }

  saveSparks();

  replyElement.append(document.createElement("br"));

  const sparkNotice = document.createElement("p");
  sparkNotice.className = "spark-notice";
  sparkNotice.textContent = "This has piqued Mabel’s interest.";
  replyElement.appendChild(sparkNotice);
}



    if (reflection.diaryEntry) {
      addDiaryEntry({
        kind: "journal",
        title: reflection.diaryEntry.title || "A small noticing",
        text: reflection.diaryEntry.text
      });
    }

    if (reflection.memory) {
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
        conversation: conversation.slice(-10),
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