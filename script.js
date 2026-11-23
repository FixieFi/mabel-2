const sendButton = document.getElementById("send");
const messageBox = document.getElementById("message");
const replyBox = document.getElementById("reply");
const diary = document.getElementById("diary");

const events = [
  "Mabel found a blue button beneath the poetry shelf.",
  "Mabel listened to the rain on the roof."
];

sendButton.addEventListener("click", () => {
  const message = messageBox.value.trim();

  if (!message) {
    replyBox.textContent = "Mabel tilts her head. “I did not quite catch that, little friend.”";
    return;
  }

  replyBox.textContent = "Mabel is thinking...";

  setTimeout(() => {
    replyBox.textContent = `Mabel whispers: “Thank you for visiting my mousehole. I’ll remember you said: ${message}.”`;

    events.unshift(`A visitor said: “${message}”`);
    updateDiary();
    messageBox.value = "";
  }, 1200);
});

function updateDiary() {
  diary.innerHTML = "";

  events.slice(0, 10).forEach(event => {
    const item = document.createElement("li");
    item.textContent = event;
    diary.appendChild(item);
  });
}

updateDiary();