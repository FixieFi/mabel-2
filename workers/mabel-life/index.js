const MABEL_KEY = "mabel-state";
const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const LEGACY_SEEDS = new Set(["silver-thread", "rain-listening", "button-collecting", "old-lane"]);
const MAX_MEMORIES = 24;
const MAX_INTERESTS = 12;
const MAX_EVOLVED_TRAITS = 18;

const DEFAULT_STATE = {
  needs: { comfort: 0.7, curiosity: 0.6, connection: 0.4, rest: 0.8, wonder: 0.5, food: 0.7, water: 0.75 },
  mood: "wondering",
  activity: "listening for the hush between raindrops",
  thought: "Every small thing remembers being part of something larger.",
  memories: [],
  interests: [],
  crafting: { skillLevel: 0, materials: [], projects: [], artInspirations: [], lastIdeaAt: null },
  baking: { skillLevel: 0, pantry: [], treats: [], lastBakedAt: null },
  coding: { skillLevel: 0, projects: [], lastAttemptAt: null, lastCreatedAt: null },
  wishes: [],
  readingBooks: [],
  practiceProps: [],
  researchNotes: [],
  hobbyEvidence: [],
  lifeLog: [],
  artExhibition: { dayOf: null, candidates: [], works: [] },
  artReferences: [],
  artFeedback: [],
  drawingPractice: { count: 0, artworkIds: [], firstAt: null, lastAt: null },
  personality: {
    core_traits: ["gentle", "curious", "thoughtful", "quietly playful"],
    evolved_traits: [],
    last_reflection_date: null
  },
  knowledge: [],
  reflections: [],
  currentThread: null,
  pendingThought: null,
  lastLifeUpdate: null,
  lastWitnessedDay: null
};

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function recordLifeAction(state, text, why, at = new Date().toISOString()) {
  state.lifeLog = Array.isArray(state.lifeLog) ? state.lifeLog : [];
  state.lifeLog.unshift({ id: "life-" + Date.parse(at) + "-" + Math.floor(Math.random() * 100000), at, kind: "did", text: cleanText(text, 220), why: cleanText(why, 260) });
  state.lifeLog = state.lifeLog.slice(0, 40);
}

function evolveFromRepeatedPractice(state, trait, reason) {
  const personality = state.personality || (state.personality = structuredClone(DEFAULT_STATE.personality));
  personality.evolved_traits = Array.isArray(personality.evolved_traits) ? personality.evolved_traits : [];
  const key = makeId(trait);
  if (personality.evolved_traits.some(item => makeId(item.trait) === key)) return;
  personality.evolved_traits.unshift({ trait, reason, date_added: new Date().toISOString().slice(0, 10) });
  personality.evolved_traits = personality.evolved_traits.slice(0, MAX_EVOLVED_TRAITS);
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}

function extractJson(raw) {
  if (typeof raw !== "string") return null;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function cleanText(value, limit, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, limit) || fallback : fallback;
}

function makeId(value) {
  return cleanText(value, 100)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "thread-" + Date.now();
}

function artExhibitionDayOf(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function cleanExhibitionVectorPaths(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 24).map(item => {
    if (!item || typeof item.d !== "string") return null;
    const d = item.d.trim().slice(0, 360);
    if (!/^[MmLlHhVvCcSsQqTtZz0-9.,+\-\s]+$/.test(d) || !/[MLCQ]/i.test(d)) return null;
    const values = d.match(/-?\d+(?:\.\d+)?/g) || [];
    if (values.length > 100 || values.some(number => !Number.isFinite(Number(number)) || Number(number) < -20 || Number(number) > 180)) return null;
    return {
      d,
      fill: Number.isInteger(item.fill) && item.fill >= 0 && item.fill < 3 ? item.fill : null,
      stroke: Number.isInteger(item.stroke) && item.stroke >= 0 && item.stroke < 3 ? item.stroke : 2,
      width: typeof item.width === "number" ? Math.max(0.35, Math.min(5, item.width)) : 1.4,
      opacity: typeof item.opacity === "number" ? Math.max(0.15, Math.min(1, item.opacity)) : 0.85
    };
  }).filter(Boolean);
}

function cleanExhibitionArtwork(raw) {
  if (!raw || typeof raw !== "object" || !["autonomous", "visitor-nominated"].includes(raw.source)) return null;
  const source = raw.source;
  const title = cleanText(raw.title, 100);
  if (!title) return null;
  const palette = Array.isArray(raw.palette)
    ? raw.palette.filter(colour => typeof colour === "string" && /^#[0-9a-fA-F]{6}$/.test(colour)).slice(0, 3)
    : [];
  const seed = Number(raw.seed);
  return {
    id: makeId(cleanText(raw.id, 140, title + "-" + (Number.isFinite(seed) ? seed : ""))),
    source,
    title,
    description: source === "visitor-nominated"
      ? "A reference study of " + cleanText(raw.subject, 60, title) + ", nominated by a visitor."
      : "A little drawing Mabel chose for today’s exhibition.",
    exhibitionReason: cleanText(raw.exhibitionReason, 220, source === "visitor-nominated"
      ? "A visitor nominated this study after Mabel returned to the subject with a visual reference."
      : cleanText(raw.inspirationTitle, 100)
        ? "Mabel chose this because a thought about " + cleanText(raw.inspirationTitle, 100) + " stayed with her."
        : "She was especially pleased with the colours and little details in this one."),
    exhibitionAddedAt: cleanText(raw.exhibitionAddedAt, 40),
    inspirationTitle: cleanText(raw.inspirationTitle, 100),
    kind: cleanText(raw.kind, 30, "moment"),
    palette,
    motif: cleanText(raw.motif, 30, "memory"),
    seed: Number.isInteger(seed) ? seed >>> 0 : 0,
    subject: cleanText(raw.subject, 60),
    selfPortrait: Boolean(raw.selfPortrait),
    symbols: Array.isArray(raw.symbols) ? raw.symbols.map(item => cleanText(item, 30)).filter(Boolean).slice(0, 3) : [],
    vectorPaths: cleanExhibitionVectorPaths(raw.vectorPaths),
    at: cleanText(raw.at, 40, new Date().toISOString()),
    score: Number.isFinite(Number(raw.score)) ? Number(raw.score) : 0,
    votes: Math.max(0, Number(raw.votes) || 0),
    votedBy: Array.isArray(raw.votedBy) ? raw.votedBy.map(item => cleanText(item, 100)).filter(Boolean).slice(0, 200) :