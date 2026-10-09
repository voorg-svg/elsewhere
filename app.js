const STORAGE_KEY = "elsewhere-notes-v1";
const LANGUAGE_STORAGE_KEY = "elsewhere-voice-language-v1";
const SPACE_EMOJIS = ["✳", "☼", "❋", "⌂", "☁", "◇"];
const NOTE_TONES = 6;
const SPEECH_LANGUAGES = [
  "en", "zh", "de", "es", "ru", "ko", "fr", "ja", "pt", "tr", "pl", "ca", "nl", "ar", "sv", "it",
  "id", "hi", "fi", "vi", "he", "uk", "el", "ms", "cs", "ro", "da", "hu", "ta", "no", "th", "ur",
  "hr", "bg", "lt", "la", "mi", "ml", "cy", "sk", "te", "fa", "lv", "bn", "sr", "az", "sl", "kn",
  "et", "mk", "br", "eu", "is", "hy", "ne", "mn", "bs", "kk", "sq", "sw", "gl", "mr", "pa", "si",
  "km", "sn", "yo", "so", "af", "oc", "ka", "be", "tg", "sd", "gu", "am", "yi", "lo", "uz", "fo",
  "ht", "ps", "tk", "nn", "mt", "sa", "lb", "my", "bo", "tl", "mg", "as", "tt", "haw", "ln", "ha",
  "ba", "jw", "su",
];
const SPEECH_LANGUAGE_LABELS = { bo: "Tibetan", ba: "Bashkir" };

const spaceList = document.querySelector("#space-list");
const board = document.querySelector("#board");
const hint = document.querySelector("#board-hint");
const searchInput = document.querySelector("#search-input");
const spaceDialog = document.querySelector("#space-dialog");
const spaceForm = document.querySelector("#space-form");
const toast = document.querySelector("#toast");
const voiceButton = document.querySelector("#voice-capture");
const languagePicker = document.querySelector("#transcription-language");

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
let activeRecording = null;
let speechWorker = null;
let speechRequestId = 0;
const speechRequests = new Map();
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

function showToast(message, duration = 3200) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  if (duration > 0) toastTimer = setTimeout(() => toast.classList.remove("visible"), duration);
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

function initLanguagePicker() {
  const displayNames = new Intl.DisplayNames([navigator.language || "en"], { type: "language" });
  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error("Could not load the preferred voice language.", error);
  }
  const browserLanguage = (navigator.language || "en").split("-")[0].toLowerCase();
  const selectedLanguage = SPEECH_LANGUAGES.includes(savedLanguage)
    ? savedLanguage
    : SPEECH_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";

  languagePicker.replaceChildren(...SPEECH_LANGUAGES
    .map((language) => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = SPEECH_LANGUAGE_LABELS[language] || displayNames.of(language) || language;
      option.selected = language === selectedLanguage;
      return option;
    }));
  languagePicker.value = selectedLanguage;
  languagePicker.addEventListener("change", () => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, languagePicker.value);
    } catch (error) {
      console.error("Could not save the preferred voice language.", error);
      showToast("Couldn't save the voice language on this device.");
    }
  });
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

function getSpeechWorker() {
  if (speechWorker) return speechWorker;
  speechWorker = new Worker(new URL("./asr-worker.js", import.meta.url), { type: "module" });
  speechWorker.addEventListener("message", (event) => {
    const { id, type, text, error, progress } = event.data;
    if (type === "progress") {
      const percent = Number.isFinite(progress) ? ` ${Math.round(progress)}%` : "";
      showToast(`Preparing offline speech model${percent}… (first use only)`, 0);
      return;
    }
    if (type === "ready") {
      showToast("Speech model ready. Transcribing on this device…", 0);
      return;
    }
    const request = speechRequests.get(id);
    if (!request) return;
    speechRequests.delete(id);
    if (type === "result") request.resolve(text);
    if (type === "error") request.reject(new Error(error));
  });
  speechWorker.addEventListener("error", (event) => {
    console.error("Offline speech worker failed.", event.message);
    for (const request of speechRequests.values()) request.reject(new Error("Offline speech recognition stopped unexpectedly."));
    speechRequests.clear();
    speechWorker?.terminate();
    speechWorker = null;
  });
  return speechWorker;
}

function resampleAudio(samples, sourceSampleRate, targetSampleRate) {
  const targetLength = Math.floor(samples.length * targetSampleRate / sourceSampleRate);
  if (sourceSampleRate === targetSampleRate) return samples;
  const output = new Float32Array(targetLength);
  const ratio = sourceSampleRate / targetSampleRate;
  for (let index = 0; index < targetLength; index += 1) {
    const position = index * ratio;
    const left = Math.floor(position);
    const fraction = position - left;
    const right = Math.min(left + 1, samples.length - 1);
    output[index] = samples[left] * (1 - fraction) + samples[right] * fraction;
  }
  return output;
}

async function transcribeRecording(recording) {
  const sampleCount = recording.chunks.reduce((total, chunk) => total + chunk.length, 0);
  if (!sampleCount) return "";
  const samples = new Float32Array(sampleCount);
  let offset = 0;
  for (const chunk of recording.chunks) {
    samples.set(chunk, offset);
    offset += chunk.length;
  }
  recording.chunks.length = 0;
  const audio = resampleAudio(samples, recording.sampleRate, 16000);
  let energy = 0;
  for (const sample of audio) energy += sample * sample;
  if (!audio.length || Math.sqrt(energy / audio.length) < 0.003) return "";
  const id = ++speechRequestId;
  const result = new Promise((resolve, reject) => speechRequests.set(id, { resolve, reject }));
  getSpeechWorker().postMessage({ id, audio, language: languagePicker.value }, [audio.buffer]);
  return result;
}

function setVoiceButtonState({ recording = false, processing = false } = {}) {
  const busy = recording || processing;
  voiceButton.classList.toggle("listening", recording);
  voiceButton.disabled = processing;
  voiceButton.setAttribute("aria-label", recording ? "Stop voice capture" : "Capture a voice note");
  voiceButton.querySelector("span:nth-child(2)").textContent = recording
    ? "Listening…"
    : processing ? "Transcribing…" : "Speak a thought";
  document.querySelector("#new-note").disabled = busy;
  document.querySelector("#add-space").disabled = busy;
  document.querySelector("#mobile-add-space").disabled = busy;
  spaceList.querySelectorAll("button").forEach((button) => { button.disabled = busy; });
}

async function finishRecording(recording) {
  if (activeRecording !== recording) return;
  activeRecording = null;
  recording.processor.onaudioprocess = null;
  recording.source.disconnect();
  recording.processor.disconnect();
  recording.silence.disconnect();
  for (const track of recording.stream.getTracks()) track.stop();
  await recording.audioContext.close();
  setVoiceButtonState({ processing: true });

  showToast("Transcribing on this device. The multilingual model downloads once before first use.", 0);
  try {
    const transcript = (await transcribeRecording(recording)).trim();
    const textarea = board.querySelector(`[data-note-id="${recording.note.id}"] .note-text`);
    if (!textarea) return;
    if (!transcript) {
      showToast("I couldn't make out any words. Try again in a quieter place.");
      return;
    }
    recording.note.text = transcript;
    textarea.value = transcript;
    updateCharacterCount(textarea.closest(".note-card"), transcript);
    saveState();
    showToast("Voice note transcribed privately on this device.");
  } catch (error) {
    console.error("Offline transcription failed.", error);
    const message = error instanceof Error ? error.message : "Unknown transcription error.";
    showToast(`Couldn't transcribe this recording: ${message}`);
  } finally {
    setVoiceButtonState();
  }
}

async function startVoiceCapture() {
  if (activeRecording) {
    finishRecording(activeRecording);
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !AudioContextClass) {
    showToast("Microphone recording isn't supported here. Open Elsewhere over HTTPS in a current browser.");
    return;
  }
  let stream;
  let audioContext;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 }, video: false });
    audioContext = new AudioContextClass();
    await audioContext.resume();
  } catch (error) {
    for (const track of stream?.getTracks() ?? []) track.stop();
    await audioContext?.close();
    const messages = {
      NotAllowedError: "Microphone permission was denied. Allow microphone access in your browser or device settings.",
      NotFoundError: "No microphone was found. Check your device's audio settings.",
      NotReadableError: "The microphone is busy or unavailable. Close other apps using it and try again.",
    };
    showToast(messages[error.name] || `Couldn't open the microphone: ${error.message}`);
    return;
  }

  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const silence = audioContext.createGain();
  silence.gain.value = 0;
  const chunks = [];
  const recording = {
    note: null,
    stream,
    audioContext,
    sampleRate: audioContext.sampleRate,
    source,
    processor,
    silence,
    chunks,
  };
  processor.onaudioprocess = (event) => {
    chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
  };
  source.connect(processor);
  processor.connect(silence);
  silence.connect(audioContext.destination);
  const { note } = addNote("", true);
  recording.note = note;
  activeRecording = recording;
  setVoiceButtonState({ recording: true });
  showToast("Listening. Tap again to stop; audio stays on this device.");
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
  } else if (event.key === "Escape" && activeRecording) {
    finishRecording(activeRecording);
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
initLanguagePicker();
