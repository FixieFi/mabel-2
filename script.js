const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatLog = document.getElementById("chat-log");
const wanderButton = document.getElementById("wander-button");
const wanderResult = document.getElementById("wander-result");

const WORKER_URL = "https://mabel-ai.fianna-b-murphy.workers.dev";
const CHAT_URL = `${WORKER_URL}/mabel`;
const WANDER_URL = `${WORKER_URL}/mabel-wander`;

const recentWanderingsKey = "mabelRecentWanderings";
const savedChatsKey = "mabelSavedChats";

let recentWanderings = [];

function loadRecentWanderings() {
  try {
    const saved = localStorage.getItem(recentWanderingsKey);
    recentWanderings = saved ? JSON.parse(saved) : [];
  } catch (error) {
    recentWanderings = [];
  }
}

function saveRecentWanderings() {
  try {
    localStorage.setItem(
      recentWanderingsKey,
      JSON.stringify(recentWanderings.slice(0, 10))
    );
  } catch (error) {
    // Ignore local storage errors.
  }
}

function loadSavedChats() {
  try {
    const saved = localStorage.getItem(savedChatsKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveSavedChats(chats) {
  try {
    localStorage.setItem(savedChatsKey, JSON.stringify(chats));
  } catch (error) {
    // Ignore local storage errors.
  }
}

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;

  const chats = loadSavedChats();
  chats.push({
    sender: sender,
    text: text,
    time: new Date().toISOString()
  });
  saveSavedChats(chats);
}

function loadSavedMessages() {
  const chats = loadSavedChats();

  chats.forEach((chat) => {
    const message = document.createElement("div");
    message.className = `message ${chat.sender}`;
    message.textContent = chat.text;
    chatLog.appendChild(message);
  });

  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendChat(message) {
  addMessage("user", message);
  chatInput.value = "";

  const thinking = document.createElement("div");
  thinking.className = "message mabel";
  thinking.textContent = "Mabel is thinking...";
  chatLog.appendChild(thinking);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        wanderings: recentWanderings
      })
    });

    const data = await response.json();

    thinking.remove();

      if (data.reply) {
      addMessage("mabel", data.reply);
    } else {
      addMessage(
        "mabel",
        "Mabel listens for a moment. She whispers: “The hollow feels softer with you here.”"
      );
    }
  } catch (error) {
    thinking.remove();
    addMessage(
      "mabel",
      "Mabel listens for a moment. She whispers: “The hollow feels softer with you here.”"
    );
  }
}

async function wander() {
  wanderButton.disabled = true;
  wanderButton.textContent = "Mabel is wandering...";
  wanderResult.textContent = "";

  try {
    const response = await fetch(WANDER_URL, {
      method: "POST"
    });

    const data = await response.json();

    if (data.title && data.musing) {
      const wandering = {
        searchQuestion: data.searchQuestion || "",
        title: data.title,
        musing: data.musing,
        time: new Date().toISOString()
      };

      recentWanderings.unshift(wandering);
      recentWanderings = recentWanderings.slice(0, 10);
      saveRecentWanderings();

      wanderResult.textContent = `${wandering.title}: ${wandering.musing}`;
    } else {
      wanderResult.textContent =
        "Mabel wandered quietly, but could not decide what she found.";
    }
  } catch (error) {
    wanderResult.textContent =
      "Mabel tried to wander, but the forest path disappeared.";
  }

  wanderButton.disabled = false;
  wanderButton.textContent = "Let Mabel wander";
}

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (message) {
    sendChat(message);
  }
});

wanderButton.addEventListener("click", wander);

loadRecentWanderings();
loadSavedMessages();