const STORAGE_KEY = "elsewhere-notes-v1";
const SPACE_EMOJIS = ["✳", "☼", "❋", "⌂", "☁", "◇"];
const NOTE_TONES = 6;

const spaceList = document.querySelector("#space-list");
const board = document.querySelector("#board");
const hint = document.querySelector("#board-hint");
const searchInput = document.querySelector("#search-input");
const spaceDialog = document.querySelector("#space-dialog");
const spaceForm = document.querySelector("#space-form");
const toast = document.querySelector("#toast");
const voiceButton = document.querySelector("#voice-capture");

const defaultState = {
  activeSpaceId: "field-notes",
  spaces: [
    {
      id: "field-notes",
      name: "Field notes",
      notes: [
        { id: "welcome", text: "A thought doesn't have to be finished to belong here. Catch it before it floats away.", x: 0.06, y: 0.08, tone: 1, voice: false, createdAt: Date.now() - 86400000 },
        { id: "small-things", text: "Maybe the best ideas arrive sideways — on a walk, halfway through a sentence, somewhere with no notebook.", x: 0.41, y: 0.25, tone: 2, voice: false, createdAt: Date.now() - 3600000 },
        { id: "listen", text: "Leave a little space between the thought and the thing you do with it.", x: 0.19, y: 0.54, tone: 3, voice: false, createdAt: Date.now() - 120000 },
      ],
    },
    { id: "good-questions", name: "Good questions", notes: [] },
    { id: "somewhere-later", name: "Somewhere, later", notes: [] },
  ],
};

let state = loadState();
let activeRecognition = null;
let toastTimer = null;
let resizeTimer = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.spaces) || parsed.spaces.length === 0) return structuredClone(defaultState);
    if (!parsed.spaces.some((space) => space.id === parsed.activeSpaceId)) {
      parsed.activeSpaceId = parsed.spaces[0].id;
    }
    return parsed;
  } catch (error) {
    console.error("Could not load saved notes.", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save notes.", error);
    showToast("Couldn't save this note. Check your device's available storage.");
  }
}

function activeSpace() {
  return state.spaces.find((space) => space.id === state.activeSpaceId) ?? state.spaces[0];
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function render() {
  const space = activeSpace();
  document.querySelector("#current-space-name").textContent = space.name;
  document.querySelector("#space-title").innerHTML = `${escapeHtml(space.name)}<span class="title-period">.</span>`;
  document.querySelector("#note-count").textContent = `${space.notes.length} ${space.notes.length === 1 ? "thought" : "thoughts"}`;
  spaceList.innerHTML = state.spaces.map((item, index) => `
    <button class="space-item${item.id === space.id ? " active" : ""}" type="button" data-space-id="${escapeHtml(item.id)}" aria-current="${item.id === space.id ? "page" : "false"}">
      <span class="space-emoji" aria-hidden="true">${SPACE_EMOJIS[index % SPACE_EMOJIS.length]}</span>
      <span class="space-name">${escapeHtml(item.name)}</span>
      <span class="space-item-count">${item.notes.length}</span>
    </button>`).join("");

  const query = searchInput.value.trim().toLocaleLowerCase();
  board.querySelectorAll(".note-card").forEach((card) => card.remove());
  space.notes.forEach((note) => board.append(createNoteCard(note)));
  hint.classList.toggle("hidden", space.notes.length > 0);
  applySearch(query);
  requestAnimationFrame(positionCards);
}

function createNoteCard(note) {
  const card = document.createElement("article");
  card.className = `note-card tone-${note.tone % NOTE_TONES}`;
  card.dataset.noteId = note.id;
  card.innerHTML = `
    <div class="note-grip" title="Drag to move this thought">
      <span class="note-meta">${note.voice ? "VOICE NOTE" : "THOUGHT"} · ${formatDate(note.createdAt)}</span>
      <span class="note-tools">
        <button class="icon-button speak-note" type="button" aria-label="Read note aloud" title="Read aloud">▷</button>
        <button class="icon-button delete-note" type="button" aria-label="Delete note" title="Delete note">×</button>
      </span>
    </div>
    <textarea class="note-text" aria-label="Note text" maxlength="4000" placeholder="Let the thought out…"></textarea>
    <div class="note-footer"><span>${note.voice ? '<span class="voice-tag">◖ captured by voice</span>' : "take your time"}</span><span class="character-count"></span></div>`;
  const textarea = card.querySelector(".note-text");
  textarea.value = note.text;
  updateCharacterCount(card, note.text);
  textarea.addEventListener("input", () => {
    note.text = textarea.value;
    updateCharacterCount(card, note.text);
    saveState();
  });
  card.querySelector(".delete-note").addEventListener("click", () => deleteNote(note.id));
  card.querySelector(".speak-note").addEventListener("click", () => speakNote(note.text));
  card.querySelector(".note-grip").addEventListener("pointerdown", (event) => startDrag(event, card, note));
  return card;
}

function updateCharacterCount(card, text) {
  card.querySelector(".character-count").textContent = text.length ? `${text.length}` : "";
}

function positionCards() {
  const availableWidth = Math.max(board.clientWidth, 1);
  board.querySelectorAll(".note-card").forEach((card) => {
    const note = activeSpace().notes.find((item) => item.id === card.dataset.noteId);
    if (!note) return;
    const maxLeft = Math.max(8, availableWidth - card.offsetWidth - 16);
    const maxTop = Math.max(12, board.clientHeight - card.offsetHeight - 44);
    card.style.left = `${Math.round(note.x * maxLeft)}px`;
    card.style.top = `${Math.round(note.y * maxTop)}px`;
  });
}

function startDrag(event, card, note) {
  if (event.target.closest("button")) return;
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const initialLeft = card.offsetLeft;
  const initialTop = card.offsetTop;
  card.classList.add("dragging");
  card.setPointerCapture(event.pointerId);

  function move(moveEvent) {
    const maxLeft = Math.max(8, board.clientWidth - card.offsetWidth - 16);
    const maxTop = Math.max(12, board.clientHeight - card.offsetHeight - 44);
    const left = Math.min(maxLeft, Math.max(8, initialLeft + moveEvent.clientX - startX));
    const top = Math.min(maxTop, Math.max(12, initialTop + moveEvent.clientY - startY));
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    note.x = left / maxLeft;
    note.y = top / maxTop;
  }

  function end() {
    card.classList.remove("dragging");
    card.removeEventListener("pointermove", move);
    card.removeEventListener("pointerup", end);
    card.removeEventListener("pointercancel", end);
    saveState();
  }

  card.addEventListener("pointermove", move);
  card.addEventListener("pointerup", end);
  card.addEventListener("pointercancel", end);
}

function addNote(text = "", voice = false) {
  const space = activeSpace();
  const index = space.notes.length;
  const note = {
    id: crypto.randomUUID(),
    text,
    x: Math.min(0.08 + (index % 3) * 0.26, 0.68),
    y: Math.min(0.06 + Math.floor(index / 3) * 0.23, 0.8),
    tone: index % NOTE_TONES,
    voice,
    createdAt: Date.now(),
  };
  space.notes.push(note);
  saveState();
  render();
  const textarea = board.querySelector(`[data-note-id="${note.id}"] .note-text`);
  textarea?.focus();
  return { note, textarea };
}

function deleteNote(noteId) {
  const space = activeSpace();
  const index = space.notes.findIndex((note) => note.id === noteId);
  if (index === -1) return;
  space.notes.splice(index, 1);
  saveState();
  render();
  showToast("Thought removed.");
}

function applySearch(query) {
  board.querySelectorAll(".note-card").forEach((card) => {
    const note = activeSpace().notes.find((item) => item.id === card.dataset.noteId);
    card.classList.toggle("search-hidden", Boolean(query) && !note.text.toLocaleLowerCase().includes(query));
  });
}

function speakNote(text) {
  if (!text.trim()) {
    showToast("Add a few words before listening.");
    return;
  }
  if (!("speechSynthesis" in window)) {
    showToast("Text-to-speech isn't available in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = navigator.language || "en-US";
  window.speechSynthesis.speak(utterance);
}

function startVoiceCapture() {
  if (activeRecognition) {
    activeRecognition.stop();
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Live dictation isn't supported here yet. Try Chrome, or type your thought into a new note.");
    return;
  }
  if (!window.isSecureContext) {
    showToast("Microphone access needs a secure connection (HTTPS or localhost).");
    return;
  }

  const { note, textarea } = addNote("", true);
  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.lang = navigator.language || "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  let finalTextSoFar = note.text;
  voiceButton.classList.add("listening");
  voiceButton.setAttribute("aria-label", "Stop voice capture");
  voiceButton.querySelector("span:nth-child(2)").textContent = "Listening…";
  showToast("Listening. Your browser may send audio to its speech service to transcribe it.");

  recognition.onresult = (event) => {
    let interimText = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) finalTextSoFar += `${finalTextSoFar ? " " : ""}${transcript}`;
      else interimText += transcript;
    }
    textarea.value = `${finalTextSoFar}${interimText ? `${finalTextSoFar ? " " : ""}${interimText}` : ""}`;
    note.text = finalTextSoFar;
    updateCharacterCount(textarea.closest(".note-card"), textarea.value);
    saveState();
  };
  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Microphone permission was denied. Check your browser's site settings.",
      "audio-capture": "No microphone was found. Check your device's audio settings.",
      "network": "The speech service couldn't be reached. Check your connection and try again.",
    };
    showToast(messages[event.error] || `Voice capture stopped (${event.error}).`);
  };
  recognition.onend = () => {
    if (activeRecognition !== recognition) return;
    activeRecognition = null;
    voiceButton.classList.remove("listening");
    voiceButton.setAttribute("aria-label", "Capture a voice note");
    voiceButton.querySelector("span:nth-child(2)").textContent = "Speak a thought";
    note.text = textarea.value.trim();
    saveState();
    if (!note.text) {
      activeSpace().notes = activeSpace().notes.filter((item) => item.id !== note.id);
      saveState();
      render();
    }
  };
  try {
    recognition.start();
  } catch (error) {
    activeRecognition = null;
    voiceButton.classList.remove("listening");
    voiceButton.setAttribute("aria-label", "Capture a voice note");
    voiceButton.querySelector("span:nth-child(2)").textContent = "Speak a thought";
    console.error("Could not start voice capture.", error);
    showToast("Couldn't start voice capture. Check microphone permission and try again.");
  }
}

spaceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-space-id]");
  if (!button) return;
  state.activeSpaceId = button.dataset.spaceId;
  searchInput.value = "";
  saveState();
  render();
});

document.querySelector("#new-note").addEventListener("click", () => addNote());
voiceButton.addEventListener("click", startVoiceCapture);
searchInput.addEventListener("input", () => applySearch(searchInput.value.trim().toLocaleLowerCase()));
document.querySelector("#add-space").addEventListener("click", () => {
  document.querySelector("#space-name").value = "";
  spaceDialog.showModal();
  document.querySelector("#space-name").focus();
});
document.querySelector("#mobile-add-space").addEventListener("click", () => {
  document.querySelector("#space-name").value = "";
  spaceDialog.showModal();
  document.querySelector("#space-name").focus();
});

spaceForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "create") return;
  event.preventDefault();
  const name = document.querySelector("#space-name").value.trim();
  if (!name) return;
  const space = { id: crypto.randomUUID(), name, notes: [] };
  state.spaces.push(space);
  state.activeSpaceId = space.id;
  searchInput.value = "";
  spaceDialog.close();
  saveState();
  render();
});

document.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  } else if (event.key === "Escape" && activeRecognition) {
    activeRecognition.stop();
  }
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(positionCards, 100);
});

if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Could not register the offline app worker.", error);
    });
  });
}

render();
