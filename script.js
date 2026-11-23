const moodElement = document.getElementById("mood");
const activityElement = document.getElementById("activity");
const thoughtElement = document.getElementById("thought");
const diaryElement = document.getElementById("diary");
const messageElement = document.getElementById("message");
const sendButton = document.getElementById("send");
const replyElement = document.getElementById("reply");

let mabel = null;
let visitorMessages = [];

const moods = [
  "wondering",
  "listening",
  "dreaming",
  "quiet",
  "curious",
  "tender",
  "brave",
  "sleepy"
];

const activities = [
  "following a silver thread beneath the hawthorn roots",
  "counting raindrops on a blackberry leaf",
  "listening for footsteps on the old lane",
  "polishing a lost button with moss",
  "reading the wind’s handwriting in the grass",
  "keeping watch beside a small blue door",
  "gathering moonlight in a thimble",
  "resting beneath the hawthorn’s white blossom"
];

const thoughts = [
  "Every small thing remembers being part of something larger.",
  "The night keeps its secrets in pockets of rain.",
  "A path is only lonely until someone leaves a story on it.",
  "Some doors open inward, toward the places we have forgotten.",
  "Even a mouse may carry a lantern through the dark.",
  "The hawthorn knows the names the wind has misplaced.",
  "Nothing found by moonlight is ever entirely lost.",
  "A small kindness can make a whole lane feel less haunted."
];

const replies = [
  "Mabel folds your words carefully, as though they were a leaf that might blow away. “Thank you for leaving them at my hollow.”",
  "Mabel listens, whiskers trembling with attention. “I will keep that beside the moonlight, where it will be safe.”",
  "“Ah,” Mabel says softly, “the world leaves little messages for those who stop long enough to notice.”",
  "Mabel tucks your words beneath a hawthorn leaf. “They will rest here until morning finds them again.”",
  "“I cannot mend every sorrow,” Mabel whispers, “but I can sit beside it for a while.”",
  "Mabel looks toward the dark lane. “Perhaps what you found was not lost. Perhaps it was waiting to be noticed.”"
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateMabelCard() {
  if (!mabel) return;

  moodElement.textContent = `Mabel is ${mabel.now.mood}.`;
  activityElement.textContent = `Mabel is ${mabel.now.doing}.`;
  thoughtElement.textContent = `“${mabel.now.thought}”`;
}

function updateDiary() {
  diaryElement.innerHTML = "";

  const entries = mabel ? mabel.feed : [];

  entries.slice(0, 8).forEach(entry => {
    const item = document.createElement("li");
    const time = new Date(entry.at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    item.textContent = `${time} — ${entry.text}`;
    diaryElement.appendChild(item);
  });

  visitorMessages.slice(0, 5).forEach(message => {
    const item = document.createElement("li");
    item.textContent = `${message.time} — A visitor whispered: “${message.text}”`;
    diaryElement.appendChild(item);
  });
}

function addVisitorMessage(text) {
  visitorMessages.unshift({
    time: formatTime(new Date()),
    text
  });

  updateDiary();
}

function changeMabelSlightly() {
  if (!mabel) return;

  mabel.now.mood = pickRandom(moods);
  mabel.now.doing = pickRandom(activities);
  mabel.now.thought = pickRandom(thoughts);
  mabel.now.updatedAt = new Date().toISOString();

  mabel.feed.unshift({
    at: mabel.now.updatedAt,
    kind: "did",
    text: mabel.now.doing,
    why: "The hollow asked for a little attention.",
    ok: true
  });

  updateMabelCard();
  updateDiary();
}

async function loadMabel() {
  try {
    const response = await fetch("mabel.json");
    mabel = await response.json();

    updateMabelCard();
    updateDiary();

    setInterval(changeMabelSlightly, 60000);
  } catch (error) {
    moodElement.textContent = "Mabel is somewhere between one story and the next.";
    activityElement.textContent = "Mabel is listening for the hush between raindrops.";
    thoughtElement.textContent = "“Even a missing page may still be part of the book.”";
  }
}

sendButton.addEventListener("click", () => {
  const message = messageElement.value.trim();

  if (!message) {
    replyElement.textContent =
      "Mabel tilts her head. “The hollow is quiet, but I am still listening.”";
    return;
  }

  replyElement.textContent = "Mabel is listening...";

  setTimeout(() => {
    replyElement.textContent = pickRandom(replies);
    addVisitorMessage(message);
    messageElement.value = "";
  }, 1400);
});

loadMabel();