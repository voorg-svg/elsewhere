const STORAGE_KEY = "elsewhere-notes-v1";
const UI_LANGUAGE_STORAGE_KEY = "elsewhere-ui-language-v1";
const SPACE_EMOJIS = ["✳", "☼", "❋", "⌂", "☁", "◇"];
const NOTE_TONES = 6;
const translations = {
  en: {
    yourSpaces: "YOUR SPACES", spaces: "Spaces", createSpace: "Create a new space",
    newSpace: "New space", privateNotes: "Your notes stay on this device.",
    notesSpace: "Notes space", ideaMap: "Idea map", newIdeaMap: "New idea map",
    createIdeaMap: "Create idea map", mapSpaceDescription: "Grow one thought into a connected map.",
    mapToolbarHint: "Build out your thinking, one connected idea at a time.",
    fitMap: "Fit", zoomOut: "Zoom out", zoomIn: "Zoom in", fitMapView: "Fit map to view",
    mapRoot: "STARTING IDEA", mapBranch: "BRANCH", addBranch: "Add a connected idea",
    addIdea: "Add idea", ideaPlaceholder: "Write an idea…", removeIdea: "Delete idea",
    deleteBranch: "Delete idea and its connected ideas",
    rootIdeaProtected: "The starting idea can't be deleted.", removeBranchFirst: "Delete connected ideas first.",
    findThought: "Find a thought…", searchNotes: "Search notes", newNote: "New note",
    eyebrow: "A LITTLE ROOM TO THINK", spaceDescription: "Let your thoughts land wherever they want.",
    interfaceLanguage: "INTERFACE", boardLabel: "Your thought space",
    spaceOpen: "Your space is open.", dropThought: "Drop a thought in.",
    boardCaption: "YOUR THOUGHT SPACE", justYou: "Just you and your thoughts",
    dragConnections: "Drag notes to make connections.", modalEyebrow: "MAKE A LITTLE ROOM",
    nameSpace: "What will you call it?", spacePlaceholder: "e.g. The garden, big ideas…",
    spaceType: "SPACE TYPE",
    cancel: "Cancel", createSpaceButton: "Create space", thought: "THOUGHT",
    dragThought: "Drag to move this thought", deleteNote: "Delete note",
    noteText: "Note text", notePlaceholder: "Let the thought out…",
    takeYourTime: "take your time",
    thoughtRemoved: "Thought removed.",
    saveNoteError: "Couldn't save this note. Check your device's available storage.",
    saveUiLanguageError: "Couldn't save the interface language on this device.",
  },
  ar: {
    yourSpaces: "مساحاتي", spaces: "المساحات", createSpace: "إنشاء مساحة جديدة",
    newSpace: "مساحة جديدة", privateNotes: "تبقى ملاحظاتك على هذا الجهاز.",
    notesSpace: "مساحة ملاحظات", ideaMap: "خريطة أفكار", newIdeaMap: "خريطة أفكار جديدة",
    createIdeaMap: "إنشاء خريطة أفكار", mapSpaceDescription: "وسّع فكرة واحدة إلى خريطة مترابطة.",
    mapToolbarHint: "وسّع أفكارك، فكرة مترابطة في كل مرة.",
    fitMap: "ملاءمة", zoomOut: "تصغير", zoomIn: "تكبير", fitMapView: "ملاءمة الخريطة للعرض",
    mapRoot: "الفكرة الأساسية", mapBranch: "فكرة فرعية", addBranch: "إضافة فكرة مترابطة",
    addIdea: "إضافة فكرة", ideaPlaceholder: "اكتب فكرة…", removeIdea: "حذف الفكرة",
    deleteBranch: "حذف الفكرة والأفكار المتصلة بها",
    rootIdeaProtected: "لا يمكن حذف الفكرة الأساسية.", removeBranchFirst: "احذف الأفكار المتصلة أولًا.",
    findThought: "ابحث عن فكرة…", searchNotes: "البحث في الملاحظات", newNote: "ملاحظة جديدة",
    eyebrow: "مساحة صغيرة للتفكير", spaceDescription: "دع أفكارك تستقر حيث تشاء.",
    interfaceLanguage: "لغة الواجهة", boardLabel: "مساحة أفكارك",
    spaceOpen: "مساحتك جاهزة.", dropThought: "أضف فكرة هنا.",
    boardCaption: "مساحة أفكارك", justYou: "أنت وأفكارك فقط",
    dragConnections: "اسحب الملاحظات لربط الأفكار.", modalEyebrow: "افسح مساحة صغيرة",
    nameSpace: "ماذا تريد أن تسميها؟", spacePlaceholder: "مثال: الحديقة، أفكار كبيرة…",
    spaceType: "نوع المساحة",
    cancel: "إلغاء", createSpaceButton: "إنشاء مساحة", thought: "فكرة",
    dragThought: "اسحب لنقل هذه الفكرة", deleteNote: "حذف الملاحظة",
    noteText: "نص الملاحظة", notePlaceholder: "أطلق العنان لفكرتك…",
    takeYourTime: "خذ وقتك", thoughtRemoved: "تم حذف الفكرة.",
    saveNoteError: "تعذّر حفظ الملاحظة. تحقق من مساحة التخزين المتاحة على جهازك.",
    saveUiLanguageError: "تعذّر حفظ لغة الواجهة على هذا الجهاز.",
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
const spaceList = document.querySelector("#space-list");
const board = document.querySelector("#board");
const hint = document.querySelector("#board-hint");
const searchInput = document.querySelector("#search-input");
const spaceDialog = document.querySelector("#space-dialog");
const spaceForm = document.querySelector("#space-form");
const toast = document.querySelector("#toast");
const interfaceLanguagePicker = document.querySelector("#interface-language");
const mapToolbar = document.querySelector("#map-toolbar");
const boardWrap = document.querySelector(".board-wrap");
let mindMapZoom = 1;

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
        { id: "welcome", text: uiLanguage === "ar" ? "لا يشترط أن تكتمل الفكرة كي تستحق مكانًا هنا. دوّنها قبل أن تفلت." : "A thought doesn't have to be finished to belong here. Catch it before it floats away.", x: 0.06, y: 0.08, tone: 1, createdAt: Date.now() - 86400000 },
        { id: "small-things", text: uiLanguage === "ar" ? "ربما تأتي أفضل الأفكار على حين غرة — أثناء المشي، أو في منتصف جملة، أو في مكان بلا دفتر." : "Maybe the best ideas arrive sideways — on a walk, halfway through a sentence, somewhere with no notebook.", x: 0.41, y: 0.25, tone: 2, createdAt: Date.now() - 3600000 },
        { id: "listen", text: uiLanguage === "ar" ? "اترك مساحة صغيرة بين الفكرة وما تفعله بها." : "Leave a little space between the thought and the thing you do with it.", x: 0.19, y: 0.54, tone: 3, createdAt: Date.now() - 120000 },
      ],
    },
    { id: "good-questions", name: uiLanguage === "ar" ? "أسئلة جيدة" : "Good questions", notes: [] },
    { id: "somewhere-later", name: uiLanguage === "ar" ? "في مكان آخر، لاحقًا" : "Somewhere, later", notes: [] },
  ],
};

let state = loadState();
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
  const isMindMap = space.type === "mindmap";
  document.querySelector("#current-space-name").textContent = space.name;
  document.querySelector("#space-title").innerHTML = `${escapeHtml(space.name)}<span class="title-period">.</span>`;
  const thoughtCount = space.notes.length;
  document.querySelector("#note-count").textContent = isMindMap
    ? formatIdeaCount(thoughtCount)
    : formatThoughtCount(thoughtCount);
  spaceList.innerHTML = state.spaces.map((item, index) => `
    <button class="space-item${item.id === space.id ? " active" : ""}" type="button" data-space-id="${escapeHtml(item.id)}" aria-current="${item.id === space.id ? "page" : "false"}">
        <span class="space-emoji" aria-hidden="true">${item.type === "mindmap" ? "⌘" : SPACE_EMOJIS[index % SPACE_EMOJIS.length]}</span>
      <span class="space-name">${escapeHtml(item.name)}</span>
      <span class="space-item-count">${item.notes.length}</span>
    </button>`).join("");

  document.querySelector("#space-description").textContent = isMindMap
    ? t("mapSpaceDescription")
    : t("spaceDescription");
  const newNoteLabel = document.querySelector("#new-note .button-label");
  newNoteLabel.textContent = isMindMap ? t("addIdea") : t("newNote");
  document.querySelector("#new-note").setAttribute("aria-label", isMindMap ? t("addIdea") : t("newNote"));
  document.querySelector("#new-note").setAttribute("title", isMindMap ? t("addIdea") : t("newNote"));
  board.classList.toggle("mind-map", isMindMap);
  mapToolbar.hidden = !isMindMap;
  board.style.removeProperty("width");
  board.style.removeProperty("height");
  boardWrap.scrollLeft = 0;
  boardWrap.scrollTop = 0;
  const query = searchInput.value.trim().toLocaleLowerCase();
  board.querySelectorAll(".note-card, .mind-map-canvas").forEach((card) => card.remove());
  if (isMindMap) {
    board.append(createMindMap(space));
  } else {
    space.notes.forEach((note) => board.append(createNoteCard(note)));
  }
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

function formatIdeaCount(count) {
  if (uiLanguage === "ar") return `${count} ${count === 1 ? "فكرة" : "أفكار"}`;
  return `${count} ${count === 1 ? "idea" : "ideas"}`;
}

function applyInterfaceLanguage() {
  document.documentElement.lang = uiLanguage;
  document.documentElement.dir = uiLanguage === "ar" ? "rtl" : "ltr";
  document.title = uiLanguage === "ar"
    ? "Elsewhere — مساحة صغيرة للأفكار"
    : "Elsewhere Notes — A Space for Thoughts";
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
  document.querySelector("#space-type").setAttribute("aria-label", t("spaceType"));
  document.querySelector('[data-map-action="zoom-out"]').setAttribute("aria-label", t("zoomOut"));
  document.querySelector('[data-map-action="zoom-out"]').title = t("zoomOut");
  document.querySelector('[data-map-action="zoom-in"]').setAttribute("aria-label", t("zoomIn"));
  document.querySelector('[data-map-action="zoom-in"]').title = t("zoomIn");
  document.querySelector('[data-map-action="fit"]').setAttribute("aria-label", t("fitMapView"));
  document.querySelector('[data-map-action="fit"]').title = t("fitMapView");
}

function initInterfaceLanguage() {
  interfaceLanguagePicker.value = uiLanguage;
  applyInterfaceLanguage();
  interfaceLanguagePicker.addEventListener("change", () => {
    uiLanguage = interfaceLanguagePicker.value;
    applyInterfaceLanguage();
    try {
      localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, uiLanguage);
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
      <span class="note-meta">${t("thought")} · ${formatDate(note.createdAt)}</span>
      <span class="note-tools">
        <button class="icon-button delete-note" type="button" aria-label="${t("deleteNote")}" title="${t("deleteNote")}">×</button>
      </span>
    </div>
    <textarea class="note-text" aria-label="${t("noteText")}" maxlength="4000" placeholder="${t("notePlaceholder")}" dir="auto"></textarea>
    <div class="note-footer"><span>${t("takeYourTime")}</span><span class="character-count"></span></div>`;
  const textarea = card.querySelector(".note-text");
  textarea.value = note.text;
  updateCharacterCount(card, note.text);
  textarea.addEventListener("input", () => {
    note.text = textarea.value;
    updateCharacterCount(card, note.text);
    saveState();
  });
  card.querySelector(".delete-note").addEventListener("click", () => deleteNote(note.id));
  card.querySelector(".note-grip").addEventListener("pointerdown", (event) => startDrag(event, card, note));
  return card;
}

function updateCharacterCount(card, text) {
  card.querySelector(".character-count").textContent = text.length ? `${text.length}` : "";
}

function createMindMap(space) {
  const canvas = document.createElement("div");
  canvas.className = "mind-map-canvas";
  const stage = document.createElement("div");
  stage.className = "mind-map-stage";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("mind-map-links");
  svg.setAttribute("aria-hidden", "true");
  stage.append(svg);

  for (const note of space.notes) {
    const isRoot = note.parentId == null;
    const node = document.createElement("article");
    node.className = `mind-map-node tone-${note.tone % NOTE_TONES}${isRoot ? " root" : ""}`;
    node.dataset.noteId = note.id;

    const heading = document.createElement("div");
    heading.className = "mind-map-node-heading";
    const kind = document.createElement("span");
    kind.textContent = t(isRoot ? "mapRoot" : "mapBranch");
    heading.append(kind);

    const actions = document.createElement("span");
    actions.className = "mind-map-node-actions";
    const addButton = document.createElement("button");
    addButton.className = "icon-button add-branch";
    addButton.type = "button";
    addButton.textContent = "+";
    addButton.setAttribute("aria-label", t("addBranch"));
    addButton.title = t("addBranch");
    addButton.addEventListener("click", () => addMapIdea(space, note.id));
    actions.append(addButton);

    if (!isRoot) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-button delete-map-idea";
      deleteButton.type = "button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", t("deleteBranch"));
      deleteButton.title = t("deleteBranch");
      deleteButton.addEventListener("click", () => deleteMapIdea(space, note.id));
      actions.append(deleteButton);
    }

    heading.append(actions);
    const input = document.createElement("textarea");
    input.className = "mind-map-text";
    input.value = note.text;
    input.maxLength = 4000;
    input.rows = 3;
    input.placeholder = t("ideaPlaceholder");
    input.setAttribute("aria-label", t("noteText"));
    input.dir = "auto";
    input.addEventListener("input", () => {
      note.text = input.value;
      saveState();
    });
    node.append(heading, input);
    heading.addEventListener("pointerdown", (event) => startMapNodeDrag(event, heading, node, note, stage));
    stage.append(node);
  }

  canvas.append(stage);
  canvas.addEventListener("pointerdown", startMapPan);
  requestAnimationFrame(() => layoutMindMap(canvas, space.notes));
  return canvas;
}

function layoutMindMap(canvas, notes) {
  const stage = canvas.querySelector(".mind-map-stage");
  const nodesById = new Map(notes.map((note) => [note.id, note]));
  const children = new Map(notes.map((note) => [note.id, []]));
  for (const note of notes) {
    if (note.parentId != null) children.get(note.parentId)?.push(note);
  }
  const root = notes.find((note) => note.parentId == null) ?? notes[0];
  if (!root) return;

  const leafPositions = new Map();
  let leafCount = 0;
  let maxDepth = 0;
  function assign(node, depth) {
    maxDepth = Math.max(maxDepth, depth);
    const descendants = children.get(node.id) ?? [];
    if (!descendants.length) {
      const position = leafCount++;
      leafPositions.set(node.id, [position, position]);
      return position;
    }
    const positions = descendants.map((child) => assign(child, depth + 1));
    const first = leafPositions.get(descendants[0].id)[0];
    const last = leafPositions.get(descendants[descendants.length - 1].id)[1];
    leafPositions.set(node.id, [first, last]);
    return (first + last) / 2;
  }
  assign(root, 0);

  const width = Math.max(960, 100 + (maxDepth + 1) * 330);
  const height = Math.max(600, 150 + leafCount * 180);
  const topPadding = (height - (150 + leafCount * 180)) / 2;
  stage.style.width = `${width}px`;
  stage.style.height = `${height}px`;
  canvas.dataset.width = `${width}`;
  canvas.dataset.height = `${height}`;
  const positions = new Map();
  for (const note of notes) {
    const [first, last] = leafPositions.get(note.id) ?? [0, 0];
    const depth = getMapDepth(note, nodesById);
    const position = {
      x: note.mapX ?? 60 + depth * 330,
      y: note.mapY ?? topPadding + 40 + ((first + last) / 2) * 180,
    };
    positions.set(note.id, position);
    const element = stage.querySelector(`[data-note-id="${CSS.escape(note.id)}"]`);
    if (element) {
      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
    }
  }

  const svg = stage.querySelector(".mind-map-links");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  drawMindMapLinks(stage, notes);
  applyMindMapZoom(canvas);
}

function applyMindMapZoom(canvas, zoom = mindMapZoom) {
  mindMapZoom = Math.min(1.5, Math.max(0.35, zoom));
  const stage = canvas.querySelector(".mind-map-stage");
  const width = Number(canvas.dataset.width);
  const height = Number(canvas.dataset.height);
  stage.style.transform = `scale(${mindMapZoom})`;
  canvas.style.width = `${width * mindMapZoom}px`;
  canvas.style.height = `${height * mindMapZoom}px`;
  board.style.width = `${Math.max(boardWrap.clientWidth, width * mindMapZoom)}px`;
  board.style.height = `${Math.max(boardWrap.clientHeight, height * mindMapZoom)}px`;
  document.querySelector("#map-zoom-level").textContent = `${Math.round(mindMapZoom * 100)}%`;
}

function fitMindMap() {
  const canvas = board.querySelector(".mind-map-canvas");
  if (!canvas) return;
  const width = Number(canvas.dataset.width);
  const height = Number(canvas.dataset.height);
  const zoom = Math.min(1, (boardWrap.clientWidth - 40) / width, (boardWrap.clientHeight - 40) / height);
  applyMindMapZoom(canvas, Math.max(0.35, zoom));
  boardWrap.scrollLeft = 0;
  boardWrap.scrollTop = 0;
}

function startMapNodeDrag(event, handle, node, note, stage) {
  if (event.button !== 0 || event.target.closest("button, textarea")) return;
  event.preventDefault();
  const canvas = stage.parentElement;
  const scale = mindMapZoom;
  const startX = event.clientX;
  const startY = event.clientY;
  const initialX = node.offsetLeft;
  const initialY = node.offsetTop;
  handle.setPointerCapture(event.pointerId);
  node.classList.add("dragging");

  function move(moveEvent) {
    const x = Math.min(stage.offsetWidth - node.offsetWidth - 12,
      Math.max(12, initialX + (moveEvent.clientX - startX) / scale));
    const y = Math.min(stage.offsetHeight - node.offsetHeight - 12,
      Math.max(12, initialY + (moveEvent.clientY - startY) / scale));
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    note.mapX = x;
    note.mapY = y;
    drawMindMapLinks(stage, activeSpace().notes);
  }

  function end() {
    node.classList.remove("dragging");
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", end);
    handle.removeEventListener("pointercancel", end);
    saveState();
  }

  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);
}

function startMapPan(event) {
  if (event.button !== 0 || event.target.closest(".mind-map-node, button, textarea")) return;
  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = boardWrap.scrollLeft;
  const startTop = boardWrap.scrollTop;
  boardWrap.classList.add("panning");

  function move(moveEvent) {
    boardWrap.scrollLeft = startLeft - (moveEvent.clientX - startX);
    boardWrap.scrollTop = startTop - (moveEvent.clientY - startY);
  }
  function end() {
    boardWrap.classList.remove("panning");
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
  }
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
  window.addEventListener("pointercancel", end, { once: true });
}

function drawMindMapLinks(stage, notes) {
  const svg = stage.querySelector(".mind-map-links");
  svg.replaceChildren();
  for (const note of notes) {
    if (note.parentId == null) continue;
    const parentElement = stage.querySelector(`[data-note-id="${CSS.escape(note.parentId)}"]`);
    const childElement = stage.querySelector(`[data-note-id="${CSS.escape(note.id)}"]`);
    if (!parentElement || !childElement
      || parentElement.classList.contains("search-hidden")
      || childElement.classList.contains("search-hidden")) continue;
    const parent = { x: parentElement.offsetLeft, y: parentElement.offsetTop };
    const child = { x: childElement.offsetLeft, y: childElement.offsetTop };
    const toRight = child.x >= parent.x;
    const startX = parent.x + (toRight ? parentElement.offsetWidth : 0);
    const startY = parent.y + parentElement.offsetHeight / 2;
    const endX = child.x + (toRight ? 0 : childElement.offsetWidth);
    const endY = child.y + childElement.offsetHeight / 2;
    const bend = Math.max(42, Math.abs(endX - startX) * 0.42);
    const control = toRight ? bend : -bend;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${startX} ${startY} C ${startX + control} ${startY}, ${endX - control} ${endY}, ${endX} ${endY}`);
    svg.append(path);
  }
}

function getMapDepth(note, notesById) {
  let depth = 0;
  let current = note;
  while (current.parentId != null) {
    const parent = notesById.get(current.parentId);
    if (!parent) break;
    depth += 1;
    current = parent;
  }
  return depth;
}

function addMapIdea(space, parentId) {
  const index = space.notes.length;
  const note = {
    id: crypto.randomUUID(),
    text: "",
    parentId,
    tone: index % NOTE_TONES,
    createdAt: Date.now(),
  };
  space.notes.push(note);
  saveState();
  render();
  board.querySelector(`[data-note-id="${CSS.escape(note.id)}"] .mind-map-text`)?.focus();
}

function deleteMapIdea(space, noteId) {
  const note = space.notes.find((item) => item.id === noteId);
  if (!note || note.parentId == null) {
    showToast(t("rootIdeaProtected"));
    return;
  }
  const branchIds = new Set([noteId]);
  let foundDescendant = true;
  while (foundDescendant) {
    foundDescendant = false;
    for (const item of space.notes) {
      if (branchIds.has(item.parentId) && !branchIds.has(item.id)) {
        branchIds.add(item.id);
        foundDescendant = true;
      }
    }
  }
  space.notes = space.notes.filter((item) => !branchIds.has(item.id));
  saveState();
  render();
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

function addNote(text = "") {
  const space = activeSpace();
  const index = space.notes.length;
  const note = {
    id: crypto.randomUUID(),
    text,
    x: Math.min(0.08 + (index % 3) * 0.26, 0.68),
    y: Math.min(0.06 + Math.floor(index / 3) * 0.23, 0.8),
    tone: index % NOTE_TONES,
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
  board.querySelectorAll(".note-card, .mind-map-node").forEach((card) => {
    const note = activeSpace().notes.find((item) => item.id === card.dataset.noteId);
    card.classList.toggle("search-hidden", Boolean(query) && !note?.text.toLocaleLowerCase().includes(query));
  });
  const canvas = board.querySelector(".mind-map-canvas");
  if (canvas) drawMindMapLinks(canvas.querySelector(".mind-map-stage"), activeSpace().notes);
}

spaceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-space-id]");
  if (!button) return;
  state.activeSpaceId = button.dataset.spaceId;
  searchInput.value = "";
  saveState();
  render();
});

document.querySelector("#map-add-branch").addEventListener("click", () => {
  const root = activeSpace().notes.find((note) => note.parentId == null);
  if (root) addMapIdea(activeSpace(), root.id);
});
mapToolbar.addEventListener("click", (event) => {
  const action = event.target.closest("[data-map-action]")?.dataset.mapAction;
  const canvas = board.querySelector(".mind-map-canvas");
  if (!canvas) return;
  if (action === "zoom-out") applyMindMapZoom(canvas, mindMapZoom - 0.1);
  if (action === "zoom-in") applyMindMapZoom(canvas, mindMapZoom + 0.1);
  if (action === "fit") fitMindMap();
});
document.querySelector("#new-note").addEventListener("click", () => {
  const space = activeSpace();
  if (space.type !== "mindmap") {
    addNote();
    return;
  }
  const root = space.notes.find((note) => note.parentId == null);
  if (root) addMapIdea(space, root.id);
});
searchInput.addEventListener("input", () => applySearch(searchInput.value.trim().toLocaleLowerCase()));
document.querySelector("#add-space").addEventListener("click", () => {
  document.querySelector("#space-name").value = "";
  document.querySelector("#space-type").value = "notes";
  spaceDialog.showModal();
  document.querySelector("#space-name").focus();
});
document.querySelector("#add-map-space").addEventListener("click", () => {
  document.querySelector("#space-name").value = "";
  document.querySelector("#space-type").value = "mindmap";
  spaceDialog.showModal();
  document.querySelector("#space-name").focus();
});
document.querySelector("#mobile-add-space").addEventListener("click", () => {
  document.querySelector("#space-name").value = "";
  document.querySelector("#space-type").value = "notes";
  spaceDialog.showModal();
  document.querySelector("#space-name").focus();
});

spaceForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "create") return;
  event.preventDefault();
  const name = document.querySelector("#space-name").value.trim();
  if (!name) return;
  const type = document.querySelector("#space-type").value;
  const space = {
    id: crypto.randomUUID(),
    name,
    ...(type === "mindmap" ? {
      type,
      notes: [{
        id: crypto.randomUUID(),
        text: name,
        parentId: null,
        tone: 1,
        createdAt: Date.now(),
      }],
    } : { notes: [] }),
  };
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
  }
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (activeSpace().type === "mindmap") {
      const canvas = board.querySelector(".mind-map-canvas");
      if (canvas) layoutMindMap(canvas, activeSpace().notes);
    } else {
      positionCards();
    }
  }, 100);
});

if (import.meta.env.PROD && "serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Could not register the offline app worker.", error);
    });
  });
}

initInterfaceLanguage();
render();
