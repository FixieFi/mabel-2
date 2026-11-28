// MABEL SCRIPT VERSION 6 - AUTONOMOUS DAY

const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const activityLogElement = document.getElementById("activity-log");
const todayLogElement = document.getElementById("today-log");
const todayStatusElement = document.getElementById("today-status");
const todayUpdatedElement = document.getElementById("today-updated");
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
const MABEL_DAY_START_URL = "https://mabel-life.fianna-b-murphy.workers.dev/mabel-day";
// text/plain keeps cross-origin JSON POSTs CORS-simple, avoiding an OPTIONS
// request before every event. Request.json() still parses the JSON body.
const MABEL_LIFE_POST_HEADERS = { "Content-Type": "text/plain;charset=UTF-8" };
const sharedHobbySyncQueueStorageKey = "mabel-shared-hobby-sync-queue-v1";

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