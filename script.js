// MABEL SCRIPT VERSION 5
const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
const replyElement = document.getElementById("reply");
const needComfort = document.getElementById("need-comfort");
const needCuriosity = document.getElementById("need-curiosity");
const needConnection = document.getElementById("need-connection");
const needRest = document.getElementById("need-rest");
const needWonder = document.getElementById("need-wonder");
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
const MABEL_WANDER_URL =
  "https://mabel-ai.fianna-b-murphy.workers.dev/mabel-wander";

const mabelStorageKey = "mabel-character-v4";
const conversationStorageKey = "mabel-conversation-v2";
const wanderingsStorageKey = "mabel-wanderings-v1";

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
    question:
      "Can Mabel make a little museum from the things the world has dropped?",
    actions: [],
    curiosity: 0.6,
    pull: 0.35,
    stage: "dormant"
  },
  {
    id: "old-lane",
    title: "The Lane That Forgot Its Name",
    kind: "wander",
    question:
      "Does an old lane remember the footsteps that once crossed it?",
    actions: [],
    curiosity: 0.7,
    pull: 0.45,
    stage: "dormant"
  }
];

let mabel = null;
let conversation = [];
let wanderings = [];

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
    localStorage.setItem(
      conversationStorageKey,
      JSON.stringify(conversation)
    );
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
    localStorage.setItem(
      wanderingsStorageKey,
      JSON.stringify(wanderings)
    );
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

function createDefaultMabel() {
  return {
    version: 4,
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
      wonder: 0.5
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
  const interest = mabel.interests.find(
    item => item.id === interestId
  );

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

function chooseAction() {
  const actionNames = [
    "follow_the_silver_thread",
    "listen_to_rain",
    "find_a_treasure",
    "visit_the_old_lane",
    "rest_in_hollow",
    "write_in_diary"
  ];

  const chosen = actionNames[
    Math.floor(Math.random() * actionNames.length)
  ];

  const actionText = {
    follow_the_silver_thread:
      "following the silver thread beneath the hawthorn roots",
    listen_to_rain:
      "listening to rain gather on the hawthorn leaves",
    find_a_treasure:
      "searching beneath the roots for something small and shining",
    visit_the_old_lane:
      "walking a little way along the old lane",
    rest_in_hollow:
      "resting in her nest of moss and fallen blossom",
    write_in_diary:
      "writing by the light of a thimble-lantern"
  };

  const actionMood = {
    follow_the_silver_thread: "wondering",
    listen_to_rain: "quiet",
    find_a_treasure: "curious",
    visit_the_old_lane: "brave",
    rest_in_hollow: "sleepy",
    write_in_diary: "thoughtful"
  };

  const actionThought = {
    follow_the_silver_thread:
      "The thread does not pull. It waits.",
    listen_to_rain:
      "Rain is the sky remembering how to speak softly.",
    find_a_treasure:
      "A lost thing is not always lost. Sometimes it is waiting to be noticed.",
    visit_the_old_lane:
      "Old paths deserve gentle footsteps.",
    rest_in_hollow:
      "Even small creatures need a place where the world grows quiet.",
    write_in_diary:
      "A diary is a little boat for the day’s forgotten weather."
  };

  mabel.now.updatedAt = now();
  mabel.now.doing = actionText[chosen];
  mabel.now.mood = actionMood[chosen];
  mabel.now.thought = actionThought[chosen];

  mabel.needs.comfort = Math.max(
    0,
    Math.min(1, mabel.needs.comfort + (Math.random() - 0.45) * 0.08)
  );

  mabel.needs.curiosity = Math.max(
    0,
    Math.min(1, mabel.needs.curiosity + (Math.random() - 0.4) * 0.08)
  );

  mabel.needs.connection = Math.max(
    0,
    Math.min(1, mabel.needs.connection - 0.03)
  );

  mabel.needs.rest = Math.max(
    0,
    Math.min(1, mabel.needs.rest + (Math.random() - 0.5) * 0.08)
  );

  mabel.needs.wonder = Math.max(
    0,
    Math.min(1, mabel.needs.wonder + (Math.random() - 0.45) * 0.08)
  );

  mabel.now.energy = Math.max(
    0.15,
    Math.min(1, mabel.now.energy + (Math.random() - 0.45) * 0.12)
  );

  addFeedEntry({
    kind: "did",
    text: `Mabel ${actionText[chosen]}.`,
    why: actionThought[chosen]
  });

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
  if (needComfort) needComfort.value = mabel.needs.comfort;
  if (needCuriosity) needCuriosity.value = mabel.needs.curiosity;
  if (needConnection) needConnection.value = mabel.needs.connection;
  if (needRest) needRest.value = mabel.needs.rest;
  if (needWonder) needWonder.value = mabel.needs.wonder;
}

function updateWishes() {
  if (!wishesElement) return;

  wishesElement.innerHTML = "";

  const activeWishes = mabel.interests
    .filter(interest => interest.stage !== "dormant")
    .slice(0, 4);

  if (activeWishes.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel is resting between little wonders.";
    wishesElement.appendChild(item);
    return;
  }

  activeWishes.forEach(interest => {
    const item = document.createElement("li");
    item.textContent = `Mabel wishes to ${interest.question
      .toLowerCase()
      .replace(/[?.!]$/, "")}.`;
    wishesElement.appendChild(item);
  });
}

function updateInterests() {
  if (!interestsElement) return;

  interestsElement.innerHTML = "";

  const sorted = [...mabel.interests].sort(
    (a, b) => b.pull - a.pull
  );

  sorted.forEach(interest => {
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
  if (!changesElement) return;

  changesElement.innerHTML = "";

  const changeEntries = mabel.feed.filter(
    entry => entry.kind === "mind"
  );

  if (changeEntries.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel is still becoming herself.";
    changesElement.appendChild(item);
    return;
  }

  changeEntries.slice(0, 8).forEach(entry => {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    item.textContent = `${time} — ${entry.text}`;
    changesElement.appendChild(item);
  });
}

function updateDiary() {
  if (!diaryElement) return;

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

function updateMusing(wandering) {
  if (!musingElement) return;

  if (!wandering) {
    musingElement.innerHTML = `
      <p class="musing-source">Mabel has not wandered yet.</p>
      <p class="musing-text">
        Her curiosity is still gathering beneath the hawthorn.
      </p>
      <p class="mabel-thought">
        “Perhaps I will find something small and shining.”
      </p>
    `;

    return;
  }

  musingElement.innerHTML = `
    <p class="musing-source">
      Mabel followed: ${wandering.searchQuestion}
    </p>
    <p class="musing-text">
      She found: <a href="${wandering.url}" target="_blank" rel="noopener">
        ${wandering.title}
      </a>
    </p>
    <p class="mabel-thought">
      “${wandering.musing}”
    </p>
  `;
}

function updateWanderings() {
  if (!wanderingsElement) return;

  wanderingsElement.innerHTML = "";

  if (wanderings.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Mabel’s trail is still unwritten.";
    wanderingsElement.appendChild(item);
    return;
  }

  wanderings.slice(0, 10).forEach(wandering => {
    const item = document.createElement("li");

    const link = document.createElement("a");
    link.href = wandering.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = wandering.title;

    const thought = document.createElement("p");
    thought.textContent = wandering.musing;

    const change = document.createElement("p");
    change.className = "wandering-change";
    change.textContent = wandering.change || "";

    item.appendChild(link);
    item.appendChild(thought);

    if (wandering.change) {
      item.appendChild(change);
    }

    wanderingsElement.appendChild(item);
  });
}

function updatePage() {
  moodElement.textContent = `Mabel is ${mabel.now.mood}.`;
  activityElement.textContent = `Mabel is ${mabel.now.doing}.`;
  thoughtElement.textContent = `“${mabel.now.thought}”`;

  updateDiary();
  updateNeeds();
  updateWishes();
  updateInterests();
  updateChanges();

  if (wanderings.length > 0) {
    updateMusing(wanderings[0]);
  }

  updateWanderings();
}

async function handleVisitorMessage() {
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent =
      "Mabel tilts her head. “The hollow is quiet, but I am still listening.”";
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
        message,
        mood: mabel.now.mood,
        activity: mabel.now.doing,
        energy: mabel.now.energy,
        interests: mabel.interests,
        memories: mabel.memories.slice(0, 8),
        conversation: conversation.slice(-10)
      })
    });

    if (!response.ok) {
      throw new Error(
        `Mabel’s thoughts could not be reached. Status ${response.status}`
      );
    }

    const data = await response.json();

    replyElement.textContent = `Mabel whispers: “${data.reply}”`;

    conversation.push({
      role: "assistant",
      content: data.reply
    });

    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }

    saveConversation();

    if (data.interest) {
      const existing = mabel.interests.find(
        interest => interest.id === data.interest.id
      );

      if (existing) {
        existing.pull = Math.max(
          0,
          Math.min(1, existing.pull + 0.15)
        );

        if (existing.pull > 0.65 && existing.stage === "dormant") {
          existing.stage = "pursuing";
        }
      } else {
        mabel.interests.push({
          id: data.interest.id,
          title: data.interest.title,
          kind: data.interest.kind || "wonder",
          question:
            data.interest.question || "What does this mean to Mabel?",
          actions: [],
          curiosity: data.interest.curiosity || 0.6,
          pull: data.interest.pull || 0.5,
          stage: data.interest.stage || "pursuing"
        });

        addFeedEntry({
          kind: "mind",
          text: `Mabel began a new thread: ${data.interest.title}.`,
          why: data.interest.question,
          interest: data.interest.id
        });
      }
    }

    mabel.memories.unshift({
      at: now(),
      kind: "visitor",
      text: `A visitor whispered: “${message}”`
    });

    mabel.needs.connection = Math.max(
      0,
      Math.min(1, mabel.needs.connection + 0.18)
    );

    mabel.needs.curiosity = Math.max(
      0,
      Math.min(1, mabel.needs.curiosity + 0.08)
    );

    if (mabel.memories.length > 20) {
      mabel.memories.length = 20;
    }

    addFeedEntry({
      kind: "noticed",
      text: "A visitor’s words settled among the moss like a fallen petal.",
      why: "Mabel keeps small messages beside the moonlight."
    });

    saveMabel();
    updatePage();
    messageElement.value = "";
  } catch (error) {
    conversation.pop();

    replyElement.textContent =
      "Mabel’s lantern flickers. “The path to my thoughts is tangled tonight. Try again in a moment.”";
  }
}

async function handleWander() {
  wanderButton.disabled = true;
  wanderStatus.textContent = "Mabel is following a thread...";

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
        energy: mabel.now.energy
      })
    });

    if (!response.ok) {
      throw new Error(
        `Mabel could not wander. Status ${response.status}`
      );
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
      const existing = mabel.interests.find(
        interest => interest.id === wandering.interest.id
      );

      if (existing) {
        existing.pull = Math.max(
          0,
          Math.min(1, existing.pull + 0.12)
        );

        if (existing.pull > 0.65 && existing.stage === "dormant") {
          existing.stage = "pursuing";
        }
      } else {
        mabel.interests.push(wandering.interest);

        addFeedEntry({
          kind: "mind",
          text: `Mabel began a new thread: ${wandering.interest.title}.`,
          why: wandering.interest.question,
          interest: wandering.interest.id
        });
      }
    }

    mabel.needs.curiosity = Math.max(
      0,
      Math.min(1, mabel.needs.curiosity + 0.1)
    );

    mabel.needs.wonder = Math.max(
      0,
      Math.min(1, mabel.needs.wonder + 0.08)
    );

    addFeedEntry({
      kind: "noticed",
      text: `Mabel encountered: ${wandering.title}.`,
      why: wandering.musing
    });

    saveMabel();
    updatePage();

    wanderStatus.textContent = "Mabel has returned from her wandering.";
  } catch (error) {
    wanderStatus.textContent =
      "Mabel’s paws paused at the edge of the hollow. The path beyond was tangled.";
  } finally {
    wanderButton.disabled = false;
  }
}

function switchTab(tabName) {
  tabButtons.forEach(button => {
    if (button.dataset.tab === tabName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  tabPanels.forEach(panel => {
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

  if (!mabel.needs) {
    mabel.needs = {
      comfort: 0.7,
      curiosity: 0.6,
      connection: 0.4,
      rest: 0.8,
      wonder: 0.5
    };
  }

  updatePage();

  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      switchTab(button.dataset.tab);
    });
  });

  sendButton.addEventListener("click", handleVisitorMessage);
  wanderButton.addEventListener("click", handleWander);

  // Mabel wakes every 45 seconds.
  setInterval(chooseAction, 45000);
}

startMabel();