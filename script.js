const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
const replyElement = document.getElementById("reply");


const MABEL_AI_URL = "https://mabel-ai.fianna-b-murphy.workers.dev/mabel";

const storageKey = "mabel-autonomous-interests-v1";

const interestSeeds = [
  {
    id: "silver-thread",
    title: "The Silver Thread",
    kind: "wondering",
    question: "Where does the silver thread beneath the hawthorn lead?",
    actions: ["follow_the_silver_thread", "tend_the_thread"],
    curiosity: 0.9,
    pull: 0.8,
    stage: "pursuing"
  },
  {
    id: "rain-listening",
    title: "The Language of Rain",
    kind: "noticing",
    question: "What does the rain say when it lands on hawthorn leaves?",
    actions: ["listen_to_rain"],
    curiosity: 0.5,
    pull: 0.4,
    stage: "dormant"
  },
  {
    id: "button-collecting",
    title: "The Button Collection",
    kind: "making",
    question: "Can Mabel make a rainbow from the buttons she finds?",
    actions: ["find_a_treasure", "sort_buttons"],
    curiosity: 0.6,
    pull: 0.35,
    stage: "dormant"
  },
  {
    id: "old-lane",
    title: "The Lane That Forgets Its Name",
    kind: "wondering",
    question: "Does the old lane remember the footsteps that once crossed it?",
    actions: ["visit_the_old_lane"],
    curiosity: 0.7,
    pull: 0.45,
    stage: "dormant"
  }
];

const actions = {
  follow_the_silver_thread: {
    activity: "following the silver thread beneath the hawthorn roots",
    mood: "wondering",
    thought: "The thread does not pull. It waits.",
    feed: {
      kind: "did",
      text: "followed the silver thread beneath the hawthorn roots",
      why: "It glimmered once, as though the night had dropped a stitch."
    },
    interest: "silver-thread"
  },
  tend_the_thread: {
    activity: "adding a knot to the silver thread",
    mood: "tender",
    thought: "A thread becomes a path when someone keeps returning to it.",
    feed: {
      kind: "mind",
      text: "Mabel added another knot to The Silver Thread.",
      why: "She wants to learn where it leads."
    },
    interest: "silver-thread"
  },
  listen_to_rain: {
    activity: "listening to rain gather on the hawthorn leaves",
    mood: "quiet",
    thought: "Rain is the sky remembering how to speak softly.",
    feed: {
      kind: "felt",
      text: "The rain made the hollow feel like a held breath.",
      why: null
    },
    interest: "rain-listening"
  },
  find_a_treasure: {
    activity: "searching beneath the roots for something small and shining",
    mood: "curious",
    thought: "A lost thing is not always lost. Sometimes it is waiting to be noticed.",
    feed: {
      kind: "noticed",
      text: "Mabel found a small brass button beneath the roots.",
      why: "It shone like a tiny moon caught in the moss."
    },
    interest: "button-collecting"
  },
  sort_buttons: {
    activity: "sorting her buttons by colour and shine",
    mood: "content",
    thought: "Every button holds a little circle of somebody’s day.",
    feed: {
      kind: "did",
      text: "sorted buttons by colour and shine",
      why: "She is trying to make a small rainbow."
    },
    interest: "button-collecting"
  },
  visit_the_old_lane: {
    activity: "walking the old lane beyond the hawthorn",
    mood: "brave",
    thought: "Old paths deserve gentle footsteps.",
    feed: {
      kind: "did",
      text: "walked a little way along the old lane",
      why: "The wind had left a question in the grass."
    },
    interest: "old-lane"
  },
  rest_in_hollow: {
    activity: "resting in her nest of moss and fallen blossom",
    mood: "sleepy",
    thought: "Even small creatures need a place where the world grows quiet.",
    feed: {
      kind: "did",
      text: "curled up in her nest beneath the hawthorn",
      why: "Her energy had grown low."
    },
    interest: null
  },
  write_in_diary: {
    activity: "writing by the light of a thimble-lantern",
    mood: "thoughtful",
    thought: "A diary is a little boat for the day’s forgotten weather.",
    feed: {
      kind: "mind",
      text: "Mabel wrote: “The lane was quiet, but it was not empty.”",
      why: "Some days leave a shape behind them."
    },
    interest: null
  }
};

let mabel = null;

function now() {
  return new Date().toISOString();
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function saveMabel() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(mabel));
  } catch (error) {
    // Local storage may be unavailable in some browser settings.
  }
}

function loadMabel() {
  try {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // Fall through to default Mabel.
  }

  return null;
}

function createDefaultMabel() {
  return {
    version: 2,
    character: {
      name: "Mabel",
      title: "Mabel of the Hawthorn Hollow",
      species: "mouse",
      home: "a mossy hollow beneath an old hawthorn tree"
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

  if (mabel.feed.length > 60) {
    mabel.feed.length = 60;
  }
}

function updateInterest(interestId, change) {
  const interest = mabel.interests.find(item => item.id === interestId);

  if (!interest) return;

  interest.pull = Math.max(0, Math.min(1, interest.pull + change));

  if (interest.pull > 0.65 && interest.stage === "dormant") {
    interest.stage = "pursuing";

    addFeedEntry({
      kind: "mind",
      text: `Mabel began a new thread: ${interest.title}.`,
      why: interest.question,
      interest: interest.id
    });
  }

  if (interest.pull > 0.9 && interest.stage === "pursuing") {
    interest.stage = "deepening";

    addFeedEntry({
      kind: "mind",
      text: `Mabel’s thread, ${interest.title}, has become important to her.`,
      why: "Some questions begin to feel like homes.",
      interest: interest.id
    });
  }

  if (interest.pull < 0.15 && interest.stage !== "dormant") {
    interest.stage = "dormant";

    addFeedEntry({
      kind: "mind",
      text: `Mabel let ${interest.title} rest for a while.`,
      why: "Not every question needs an answer today.",
      interest: interest.id
    });
  }
}
function calculatePull(actionName) {
  let pull = 0.2 + Math.random() * 0.2;

  const matchingInterest = mabel.interests.find(interest =>
    interest.actions.includes(actionName)
  );

  if (matchingInterest) {
    pull += matchingInterest.pull * 0.8;
    pull += matchingInterest.curiosity * 0.2;
  }

  if (actionName === "rest_in_hollow") {
    pull += (1 - mabel.now.energy) * 0.8;
  }

  if (actionName === "write_in_diary") {
    pull += 0.15;
  }

  return pull;
}

function chooseAction() {
  const actionNames = Object.keys(actions);

  const scoredActions = actionNames.map(name => ({
    name,
    pull: calculatePull(name)
  }));

  scoredActions.sort((a, b) => b.pull - a.pull);

  const chosen = scoredActions[0].name;
  const action = actions[chosen];

  mabel.now.updatedAt = now();
  mabel.now.doing = action.activity;
  mabel.now.mood = action.mood;
  mabel.now.thought = action.thought;

  mabel.now.energy = Math.max(
    0.15,
    Math.min(1, mabel.now.energy + (Math.random() - 0.45) * 0.12)
  );

  addFeedEntry(action.feed);

  if (action.interest) {
    updateInterest(action.interest, 0.08);
  } else {
    mabel.interests.forEach(interest => {
      interest.pull = Math.max(0, interest.pull - 0.02);
    });
  }

  saveMabel();
  updatePage();
}

function updatePage() {
  moodElement.textContent = `Mabel is ${mabel.now.mood}.`;
  activityElement.textContent = `Mabel is ${mabel.now.doing}.`;
  thoughtElement.textContent = `“${mabel.now.thought}”`;

  updateDiary();
}

function updateDiary() {
  diaryElement.innerHTML = "";

  mabel.feed.slice(0, 10).forEach(entry => {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    item.textContent = `${time} — ${entry.text}`;
    diaryElement.appendChild(item);
  });
}

async function handleVisitorMessage() {
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent =
      "Mabel tilts her head. “The hollow is quiet, but I am still listening.”";
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
  message,
  mood: mabel.now.mood,
  activity: mabel.now.doing,
  energy: mabel.now.energy,
  interests: mabel.interests
    .filter(interest => interest.stage === "pursuing")
    .map(interest => ({
      title: interest.title,
      question: interest.question,
      pull: interest.pull
    })),
  memories: mabel.memories.slice(0, 8)
})
    });

    if (!response.ok) {
      throw new Error(`Mabel’s thoughts could not be reached. Status ${response.status}`);
    }

    const data = await response.json();

    replyElement.textContent = `Mabel whispers: “${data.reply}”`;

    mabel.memories.unshift({
      at: now(),
      kind: "visitor",
      text: `A visitor whispered: “${message}”`
    });

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    addFeedEntry({
      kind: "noticed",
      text: "A visitor left a whisper at the hollow.",
      why: "Mabel keeps small messages beside the moonlight."
    });

    saveMabel();
    updateDiary();
    messageElement.value = "";
  } catch (error) {
    replyElement.textContent =
      "Mabel’s lantern flickers. “The path to my thoughts is tangled tonight. Try again in a moment.”";
  }
}

function startMabel() {
  mabel = loadMabel() || createDefaultMabel();

  updatePage();

  // Mabel wakes every 45 seconds.
  setInterval(chooseAction, 45000);
}

sendButton.addEventListener("click", handleVisitorMessage);

startMabel();