const STORAGE_KEY = "elsewhere-notes-v1";
const LANGUAGE_STORAGE_KEY = "elsewhere-voice-language-v1";
const UI_LANGUAGE_STORAGE_KEY = "elsewhere-ui-language-v1";
const SPACE_EMOJIS = ["✳", "☼", "❋", "⌂", "☁", "◇"];
const NOTE_TONES = 6;
const translations = {
  en: {
    yourSpaces: "YOUR SPACES", spaces: "Spaces", createSpace: "Create a new space",
    newSpace: "New space", privateNotes: "Your notes stay on this device.",
    findThought: "Find a thought…", searchNotes: "Search notes", newNote: "New note",
    eyebrow: "A LITTLE ROOM TO THINK", spaceDescription: "Let your thoughts land wherever they want.",
    interfaceLanguage: "INTERFACE", voiceLanguage: "VOICE LANGUAGE",
    voiceNoteLanguage: "Voice note language", speakThought: "Record a voice note",
    stopAndTranscribe: "Stop & transcribe",
    captureVoice: "Capture a voice note", stopVoiceCapture: "Stop voice capture", boardLabel: "Your thought space",
    spaceOpen: "Your space is open.", dropThought: "Drop a thought in.",
    boardCaption: "YOUR THOUGHT SPACE", justYou: "Just you and your thoughts",
    dragConnections: "Drag notes to make connections.", modalEyebrow: "MAKE A LITTLE ROOM",
    nameSpace: "What will you call it?", spacePlaceholder: "e.g. The garden, big ideas…",
    cancel: "Cancel", createSpaceButton: "Create space", thought: "THOUGHT",
    voiceNote: "VOICE NOTE", dragThought: "Drag to move this thought",
    readAloud: "Read note aloud", readAloudTitle: "Read aloud", deleteNote: "Delete note",
    noteText: "Note text", notePlaceholder: "Let the thought out…",
    capturedVoice: "◖ captured by voice", takeYourTime: "take your time",
    thoughtRemoved: "Thought removed.", addWords: "Add a few words before listening.",
    ttsUnavailable: "Text-to-speech isn't available in this browser.",
    preparingModel: "Preparing offline speech model{percent}… (first use only)",
    modelReady: "Speech model ready. Transcribing on this device…",
    transcribing: "Transcribing on this device. The multilingual model downloads once before first use.",
    listening: "Listening. Tap again to stop; audio stays on this device.",
    transcribed: "Voice note transcribed privately on this device.",
    noWords: "I couldn't make out any words. Try again in a quieter place.",
    microphoneUnsupported: "Microphone recording isn't supported here. Open Elsewhere over HTTPS in a current browser.",
    microphoneDenied: "Microphone permission was denied. Allow microphone access in your browser or device settings.",
    microphoneMissing: "No microphone was found. Check your device's audio settings.",
    microphoneBusy: "The microphone is busy or unavailable. Close other apps using it and try again.",
    openMicrophone: "Couldn't open the microphone: {message}",
    transcribeError: "Couldn't transcribe this recording: {message}",
    unknownError: "Unknown transcription error.", saveNoteError: "Couldn't save this note. Check your device's available storage.",
    saveLanguageError: "Couldn't save the voice language on this device.",
    saveUiLanguageError: "Couldn't save the interface language on this device.",
    savePreferredLanguageError: "Couldn't save the preferred voice language.",
  },
  ar: {
    yourSpaces: "مساحاتي", spaces: "المساحات", createSpace: "إنشاء مساحة جديدة",
    newSpace: "مساحة جديدة", privateNotes: "تبقى ملاحظاتك على هذا الجهاز.",
    findThought: "ابحث عن فكرة…", searchNotes: "البحث في الملاحظات", newNote: "ملاحظة جديدة",
    eyebrow: "مساحة صغيرة للتفكير", spaceDescription: "دع أفكارك تستقر حيث تشاء.",
    interfaceLanguage: "لغة الواجهة", voiceLanguage: "لغة التسجيل الصوتي",
    voiceNoteLanguage: "لغة الملاحظة الصوتية", speakThought: "سجّل ملاحظة صوتية",
    stopAndTranscribe: "أوقف التسجيل وحوّله إلى نص",
    captureVoice: "تسجيل ملاحظة صوتية", stopVoiceCapture: "إيقاف التسجيل الصوتي", boardLabel: "مساحة أفكارك",
    spaceOpen: "مساحتك جاهزة.", dropThought: "أضف فكرة هنا.",
    boardCaption: "مساحة أفكارك", justYou: "أنت وأفكارك فقط",
    dragConnections: "اسحب الملاحظات لربط الأفكار.", modalEyebrow: "افسح مساحة صغيرة",
    nameSpace: "ماذا تريد أن تسميها؟", spacePlaceholder: "مثال: الحديقة، أفكار كبيرة…",
    cancel: "إلغاء", createSpaceButton: "إنشاء مساحة", thought: "فكرة",
    voiceNote: "ملاحظة صوتية", dragThought: "اسحب لنقل هذه الفكرة",
    readAloud: "قراءة الملاحظة بصوت عالٍ", readAloudTitle: "استمع",
    deleteNote: "حذف الملاحظة", noteText: "نص الملاحظة",
    notePlaceholder: "أطلق العنان لفكرتك…", capturedVoice: "◖ سُجّلت صوتيًا",
    takeYourTime: "خذ وقتك", thoughtRemoved: "تم حذف الفكرة.",
    addWords: "أضف بضع كلمات قبل الاستماع.", ttsUnavailable: "تحويل النص إلى كلام غير متاح في هذا المتصفح.",
    preparingModel: "جارٍ تجهيز نموذج الصوت دون اتصال{percent}… (للاستخدام الأول فقط)",
    modelReady: "النموذج الصوتي جاهز. جارٍ تحويل التسجيل إلى نص على هذا الجهاز…",
    transcribing: "جارٍ تحويل التسجيل إلى نص على هذا الجهاز. يُنزّل النموذج متعدد اللغات مرة واحدة قبل الاستخدام الأول.",
    listening: "جارٍ الاستماع. اضغط مجددًا للإيقاف؛ يبقى الصوت على هذا الجهاز.",
    transcribed: "تم تحويل الملاحظة الصوتية إلى نص على هذا الجهاز.",
    noWords: "لم أتمكن من تمييز الكلمات. حاول مجددًا في مكان أكثر هدوءًا.",
    microphoneUnsupported: "تسجيل الصوت غير مدعوم هنا. افتح Elsewhere عبر HTTPS باستخدام متصفح حديث.",
    microphoneDenied: "لم يُسمح باستخدام الميكروفون. فعّل إذن الميكروفون في المتصفح أو إعدادات الجهاز.",
    microphoneMissing: "لم يتم العثور على ميكروفون. تحقق من إعدادات الصوت في جهازك.",
    microphoneBusy: "الميكروفون مشغول أو غير متاح. أغلق التطبيقات الأخرى التي تستخدمه ثم حاول مجددًا.",
    openMicrophone: "تعذّر فتح الميكروفون: {message}",
    transcribeError: "تعذّر تحويل التسجيل إلى نص: {message}",
    unknownError: "خطأ غير معروف في تحويل الصوت إلى نص.",
    saveNoteError: "تعذّر حفظ الملاحظة. تحقق من مساحة التخزين المتاحة على جهازك.",
    saveLanguageError: "تعذّر حفظ لغة التسجيل الصوتي على هذا الجهاز.",
    saveUiLanguageError: "تعذّر حفظ لغة الواجهة على هذا الجهاز.",
    savePreferredLanguageError: "تعذّر حفظ لغة التسجيل المفضلة.",
  },
};

function getInitialUiLanguage() {
  try {
    const saved = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch (error) {
    console.error("Could not load the preferred interface language.", error);
  }
  return (navigator.language || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
}

let uiLanguage = getInitialUiLanguage();
const SPEECH_LANGUAGES = [
  "en", "zh", "de", "es", "ru", "ko", "fr", "ja", "pt", "tr", "pl", "ca", "nl", "ar", "sv", "it",
  "id", "hi", "fi", "vi", "he", "uk", "el", "ms", "cs", "ro", "da", "hu", "ta", "no", "th", "ur",
  "hr", "bg", "lt", "la", "mi", "ml", "cy", "sk", "te", "fa", "lv", "bn", "sr", "az", "sl", "kn",
  "et", "mk", "br", "eu", "is", "hy", "ne", "mn", "bs", "kk", "sq", "sw", "gl", "mr", "pa", "si",
  "km", "sn", "yo", "so", "af", "oc", "ka", "be", "tg", "sd", "gu", "am", "yi", "lo", "uz", "fo",
  "ht", "ps", "tk", "nn", "mt", "sa", "lb", "my", "bo", "tl", "mg", "as", "tt", "haw", "ln", "ha",
  "ba", "jw", "su",
];
const SPEECH_LANGUAGE_LABELS = { ar: "العربية — Arabic", bo: "Tibetan", ba: "Bashkir" };

const spaceList = document.querySelector("#space-list");
const board = document.querySelector("#board");
const hint = document.querySelector("#board-hint");
const searchInput = document.querySelector("#search-input");
const spaceDialog = document.querySelector("#space-dialog");
const spaceForm = document.querySelector("#space-form");
const toast = document.querySelector("#toast");
const voiceButton = document.querySelector("#voice-capture");
const languagePicker = document.querySelector("#transcription-language");
const interfaceLanguagePicker = document.querySelector("#interface-language");

function t(key, values = {}) {
  const message = translations[uiLanguage][key] ?? translations.en[key] ?? key;
  return message.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

const defaultState = {
  activeSpaceId: "field-notes",
  spaces: [
    {
      id: "field-notes",
      name: uiLanguage === "ar" ? "ملاحظات ميدانية" : "Field notes",
      notes: [
        { id: "welcome", text: uiLanguage === "ar" ? "لا يشترط أن تكتمل الفكرة كي تستحق مكانًا هنا. دوّنها قبل أن تفلت." : "A thought doesn't have to be finished to belong here. Catch it before it floats away.", x: 0.06, y: 0.08, tone: 1, voice: false, createdAt: Date.now() - 86400000 },
        { id: "small-things", text: uiLanguage === "ar" ? "ربما تأتي أفضل الأفكار على حين غرة — أثناء المشي، أو في منتصف جملة، أو في مكان بلا دفتر." : "Maybe the best ideas arrive sideways — on a walk, halfway through a sentence, somewhere with no notebook.", x: 0.41, y: 0.25, tone: 2, voice: false, createdAt: Date.now() - 3600000 },
        { id: "listen", text: uiLanguage === "ar" ? "اترك مساحة صغيرة بين الفكرة وما تفعله بها." : "Leave a little space between the thought and the thing you do with it.", x: 0.19, y: 0.54, tone: 3, voice: false, createdAt: Date.now() - 120000 },
      ],
    },
    { id: "good-questions", name: uiLanguage === "ar" ? "أسئلة جيدة" : "Good questions", notes: [] },
    { id: "somewhere-later", name: uiLanguage === "ar" ? "في مكان آخر، لاحقًا" : "Somewhere, later", notes: [] },
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
    showToast(t("saveNoteError"));
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
  return new Intl.DateTimeFormat(uiLanguage, { month: "short", day: "numeric" }).format(new Date(value));
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
  const thoughtCount = space.notes.length;
  document.querySelector("#note-count").textContent = formatThoughtCount(thoughtCount);
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

function formatThoughtCount(count) {
  if (uiLanguage !== "ar") return `${count} ${count === 1 ? "thought" : "thoughts"}`;
  const plural = new Intl.PluralRules("ar").select(count);
  if (plural === "zero") return "لا أفكار";
  if (plural === "one") return "فكرة واحدة";
  if (plural === "two") return "فكرتان";
  return `${count} ${plural === "few" ? "أفكار" : "فكرة"}`;
}

function initLanguagePicker() {
  const displayNames = new Intl.DisplayNames([uiLanguage], { type: "language" });
  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error("Could not load the preferred voice language.", error);
  }
  const browserLanguage = (navigator.language || "en").split("-")[0].toLowerCase();
  const selectedLanguage = SPEECH_LANGUAGES.includes(savedLanguage)
    ? savedLanguage
    : uiLanguage === "ar" ? "ar" : SPEECH_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";

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
      showToast(t("saveLanguageError"));
    }
  });
}

function applyInterfaceLanguage() {
  document.documentElement.lang = uiLanguage;
  document.documentElement.dir = uiLanguage === "ar" ? "rtl" : "ltr";
  document.title = uiLanguage === "ar"
    ? "Elsewhere — ملاحظات صوتية خاصة دون اتصال"
    : "Elsewhere Notes — Private Offline Voice Notes";
  interfaceLanguagePicker.value = uiLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  const displayNames = new Intl.DisplayNames([uiLanguage], { type: "language" });
  for (const option of languagePicker.options) {
    option.textContent = SPEECH_LANGUAGE_LABELS[option.value] || displayNames.of(option.value) || option.value;
  }
  languagePicker.setAttribute("aria-label", t("voiceNoteLanguage"));
  voiceButton.setAttribute("aria-label", t("captureVoice"));
}

function initInterfaceLanguage() {
  interfaceLanguagePicker.value = uiLanguage;
  applyInterfaceLanguage();
  interfaceLanguagePicker.addEventListener("change", () => {
    uiLanguage = interfaceLanguagePicker.value;
    applyInterfaceLanguage();
    try {
      localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, uiLanguage);
      if (!localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
        languagePicker.value = uiLanguage === "ar" ? "ar" : "en";
      }
    } catch (error) {
      console.error("Could not save the preferred interface language.", error);
      showToast(t("saveUiLanguageError"));
    }
    render();
  });
}

function createNoteCard(note) {
  const card = document.createElement("article");
  card.className = `note-card tone-${note.tone % NOTE_TONES}`;
  card.dataset.noteId = note.id;
  card.innerHTML = `
    <div class="note-grip" title="${t("dragThought")}">
      <span class="note-meta">${t(note.voice ? "voiceNote" : "thought")} · ${formatDate(note.createdAt)}</span>
      <span class="note-tools">
        <button class="icon-button speak-note" type="button" aria-label="${t("readAloud")}" title="${t("readAloudTitle")}">▷</button>
        <button class="icon-button delete-note" type="button" aria-label="${t("deleteNote")}" title="${t("deleteNote")}">×</button>
      </span>
    </div>
    <textarea class="note-text" aria-label="${t("noteText")}" maxlength="4000" placeholder="${t("notePlaceholder")}" dir="auto"></textarea>
    <div class="note-footer"><span>${note.voice ? `<span class="voice-tag">${t("capturedVoice")}</span>` : t("takeYourTime")}</span><span class="character-count"></span></div>`;
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
  if (window.innerWidth <= 700) return;
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
  showToast(t("thoughtRemoved"));
}

function applySearch(query) {
  board.querySelectorAll(".note-card").forEach((card) => {
    const note = activeSpace().notes.find((item) => item.id === card.dataset.noteId);
    card.classList.toggle("search-hidden", Boolean(query) && !note.text.toLocaleLowerCase().includes(query));
  });
}

function speakNote(text) {
  if (!text.trim()) {
    showToast(t("addWords"));
    return;
  }
  if (!("speechSynthesis" in window)) {
    showToast(t("ttsUnavailable"));
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languagePicker.value;
  window.speechSynthesis.speak(utterance);
}

function getSpeechWorker() {
  if (speechWorker) return speechWorker;
  speechWorker = new Worker(new URL("./asr-worker.js", import.meta.url), { type: "module" });
  speechWorker.addEventListener("message", (event) => {
    const { id, type, text, error, progress } = event.data;
    if (type === "progress") {
      const percent = Number.isFinite(progress) ? ` ${Math.round(progress)}%` : "";
      showToast(t("preparingModel", { percent }), 0);
      return;
    }
    if (type === "ready") {
      showToast(t("modelReady"), 0);
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
  voiceButton.setAttribute("aria-label", t(recording ? "stopVoiceCapture" : "captureVoice"));
  voiceButton.querySelector("span:nth-child(2)").textContent = recording
    ? t("stopAndTranscribe")
    : processing ? (uiLanguage === "ar" ? "جارٍ التحويل…" : "Transcribing…") : t("speakThought");
  document.querySelector("#new-note").disabled = busy;
  document.querySelector("#interface-language").disabled = busy;
  languagePicker.disabled = busy;
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

  showToast(t("transcribing"), 0);
  try {
    const transcript = (await transcribeRecording(recording)).trim();
    const textarea = board.querySelector(`[data-note-id="${recording.note.id}"] .note-text`);
    if (!textarea) return;
    if (!transcript) {
      showToast(t("noWords"));
      return;
    }
    recording.note.text = transcript;
    textarea.value = transcript;
    updateCharacterCount(textarea.closest(".note-card"), transcript);
    saveState();
    showToast(t("transcribed"));
  } catch (error) {
    console.error("Offline transcription failed.", error);
    const message = error instanceof Error ? error.message : t("unknownError");
    showToast(t("transcribeError", { message }));
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
    showToast(t("microphoneUnsupported"));
    return;
  }
  let stream;
  let audioContext;
  try {
    audioContext = new AudioContextClass();
    await audioContext.resume();
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 }, video: false });
  } catch (error) {
    for (const track of stream?.getTracks() ?? []) track.stop();
    await audioContext?.close();
    const messages = {
      NotAllowedError: t("microphoneDenied"),
      NotFoundError: t("microphoneMissing"),
      NotReadableError: t("microphoneBusy"),
    };
    showToast(messages[error.name] || t("openMicrophone", { message: error.message }));
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
  showToast(t("listening"));
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

initLanguagePicker();
initInterfaceLanguage();
render();
