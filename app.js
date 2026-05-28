const STORAGE_KEY = "stickystack.prototype.v1";
const defaultLanes = ["Backlog", "In Progress", "Done"];
const palette = [
  { name: "Sunbeam yellow", value: "#fff18a" },
  { name: "Idea pink", value: "#ff9fc9" },
  { name: "Sky blue", value: "#94d9ff" },
  { name: "Mint green", value: "#adf0b6" },
  { name: "Lavender", value: "#cab6ff" },
  { name: "Apricot", value: "#ffc078" }
];

const state = loadState();
let activeProjectId = null;

const elements = {
  pageTitle: document.querySelector("#page-title"),
  pageSubtitle: document.querySelector("#page-subtitle"),
  homeView: document.querySelector("#home-view"),
  boardView: document.querySelector("#board-view"),
  projectGrid: document.querySelector("#project-grid"),
  laneBoard: document.querySelector("#lane-board"),
  boardHeading: document.querySelector("#board-heading"),
  boardDescription: document.querySelector("#board-description"),
  boardStats: document.querySelector("#board-stats"),
  backHome: document.querySelector("#back-home"),
  openProjectModal: document.querySelector("#open-project-modal"),
  openLaneModal: document.querySelector("#open-lane-modal"),
  openNoteModal: document.querySelector("#open-note-modal"),
  projectModal: document.querySelector("#project-modal"),
  laneModal: document.querySelector("#lane-modal"),
  noteModal: document.querySelector("#note-modal"),
  projectForm: document.querySelector("#project-form"),
  laneForm: document.querySelector("#lane-form"),
  noteForm: document.querySelector("#note-form"),
  projectColor: document.querySelector("#project-color"),
  noteColor: document.querySelector("#note-color"),
  noteStatus: document.querySelector("#note-status"),
  noteModalTitle: document.querySelector("#note-modal-title")
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn("Could not parse saved StickyStack data. Loading starter project.", error);
    }
  }

  return {
    projects: [
      {
        id: crypto.randomUUID(),
        name: "Prototype roadmap",
        description: "Try the sticky-note project workflow and tune the lanes.",
        color: "#fff18a",
        lanes: defaultLanes,
        notes: [
          {
            id: crypto.randomUUID(),
            title: "Sketch first board flow",
            details: "Confirm projects live on the home wall, then click into a board with lanes and task notes.",
            status: "Backlog",
            color: "#94d9ff"
          },
          {
            id: crypto.randomUUID(),
            title: "Test flip animation",
            details: "Click any note to flip from the short description to the detail side. Click again to return.",
            status: "In Progress",
            color: "#ff9fc9"
          },
          {
            id: crypto.randomUUID(),
            title: "Move by status",
            details: "Use the status selector on a note to automatically send it to the matching swim lane.",
            status: "Done",
            color: "#adf0b6"
          }
        ]
      }
    ]
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function activeProject() {
  return state.projects.find((project) => project.id === activeProjectId);
}

function populateColorSelect(select) {
  select.innerHTML = palette
    .map((color) => `<option value="${color.value}">${color.name}</option>`)
    .join("");
}

function showModal(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeModal(dialog) {
  dialog.close();
}

function emptyState(title, message) {
  const template = document.querySelector("#empty-state-template");
  const node = template.content.cloneNode(true);
  node.querySelector("h3").textContent = title;
  node.querySelector("p").textContent = message;
  return node;
}

function renderHome() {
  activeProjectId = null;
  elements.homeView.classList.add("active");
  elements.boardView.classList.remove("active");
  elements.backHome.classList.add("hidden");
  elements.openProjectModal.classList.remove("hidden");
  elements.openLaneModal.classList.add("hidden");
  elements.openNoteModal.classList.add("hidden");
  elements.pageTitle.textContent = "Organize projects with tactile sticky notes.";
  elements.pageSubtitle.textContent = "Create a project, jump into its board, and move color-coded tasks through custom swim lanes.";

  elements.projectGrid.innerHTML = "";
  if (!state.projects.length) {
    elements.projectGrid.append(emptyState("No projects yet", "Create a sticky-note project to start shaping your board."));
    return;
  }

  state.projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.className = "project-note";
    button.style.background = project.color;
    button.style.setProperty("--tilt", `${[-2.4, 1.8, -1.2, 2.2][index % 4]}deg`);
    button.innerHTML = `
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description || "Click to open this project board.")}</p>
      <span class="project-note-meta">${project.notes.length} notes · ${project.lanes.length} lanes</span>
    `;
    button.addEventListener("click", () => renderBoard(project.id));
    elements.projectGrid.append(button);
  });
}

function renderBoard(projectId) {
  activeProjectId = projectId;
  const project = activeProject();
  if (!project) {
    renderHome();
    return;
  }

  elements.homeView.classList.remove("active");
  elements.boardView.classList.add("active");
  elements.backHome.classList.remove("hidden");
  elements.openProjectModal.classList.add("hidden");
  elements.openLaneModal.classList.remove("hidden");
  elements.openNoteModal.classList.remove("hidden");
  elements.pageTitle.textContent = project.name;
  elements.pageSubtitle.textContent = "Flip notes for details, change status to move them, and add lanes as your workflow evolves.";
  elements.boardHeading.textContent = project.name;
  elements.boardDescription.textContent = project.description || "A flexible sticky-note board for this project.";
  renderStats(project);
  renderLaneOptions(project);

  elements.laneBoard.innerHTML = "";
  project.lanes.forEach((lane) => {
    const laneNotes = project.notes.filter((note) => note.status === lane);
    const section = document.createElement("section");
    section.className = "lane";
    section.innerHTML = `
      <div class="lane-header">
        <h3 class="lane-title">${escapeHtml(lane)}</h3>
        <span class="lane-count">${laneNotes.length}</span>
      </div>
      <div class="note-stack"></div>
    `;
    const stack = section.querySelector(".note-stack");
    if (!laneNotes.length) {
      const placeholder = document.createElement("p");
      placeholder.className = "lane-placeholder";
      placeholder.textContent = "No notes in this lane yet.";
      stack.append(placeholder);
    } else {
      laneNotes.forEach((note) => stack.append(createNoteCard(project, note)));
    }
    elements.laneBoard.append(section);
  });
}

function renderStats(project) {
  elements.boardStats.innerHTML = [
    `${project.notes.length} notes`,
    `${project.lanes.length} swim lanes`,
    `${project.notes.filter((note) => note.status === "Done").length} done`
  ].map((stat) => `<span class="stat-pill">${stat}</span>`).join("");
}

function renderLaneOptions(project) {
  elements.noteStatus.innerHTML = project.lanes
    .map((lane) => `<option value="${escapeAttribute(lane)}">${escapeHtml(lane)}</option>`)
    .join("");
}

function createNoteCard(project, note) {
  const article = document.createElement("article");
  article.className = "note-card";
  article.innerHTML = `
    <div class="note-inner">
      <div class="note-face note-front" style="background: ${note.color}">
        <h3>${escapeHtml(note.title)}</h3>
        <p>Click to flip for details.</p>
        <div class="note-actions">
          ${statusSelectMarkup(project, note)}
          <button class="mini-button" type="button" data-action="edit">Edit</button>
          <button class="danger" type="button" data-action="delete">Delete</button>
        </div>
      </div>
      <div class="note-face note-back" style="background: ${note.color}">
        <h3>Details</h3>
        <p>${escapeHtml(note.details || "No extra details yet.")}</p>
        <div class="note-actions">
          ${statusSelectMarkup(project, note)}
          <button class="mini-button" type="button" data-action="edit">Edit</button>
          <button class="danger" type="button" data-action="delete">Delete</button>
        </div>
      </div>
    </div>
  `;

  article.addEventListener("click", (event) => {
    if (event.target.closest("button") || event.target.closest("select")) {
      return;
    }
    article.classList.toggle("flipped");
  });

  article.querySelectorAll("select[data-action='status']").forEach((select) => {
    select.addEventListener("change", (event) => {
      note.status = event.target.value;
      saveState();
      renderBoard(project.id);
    });
  });

  article.querySelectorAll("[data-action='edit']").forEach((button) => {
    button.addEventListener("click", () => openNoteForm(note));
  });

  article.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", () => {
      project.notes = project.notes.filter((candidate) => candidate.id !== note.id);
      saveState();
      renderBoard(project.id);
    });
  });

  return article;
}

function statusSelectMarkup(project, note) {
  const options = project.lanes.map((lane) => {
    const selected = note.status === lane ? "selected" : "";
    return `<option value="${escapeAttribute(lane)}" ${selected}>${escapeHtml(lane)}</option>`;
  }).join("");
  return `<select class="note-status" data-action="status" aria-label="Move ${escapeAttribute(note.title)} to status">${options}</select>`;
}

function openNoteForm(note = null) {
  const project = activeProject();
  if (!project) {
    return;
  }

  renderLaneOptions(project);
  elements.noteForm.reset();
  document.querySelector("#note-id").value = note?.id || "";
  document.querySelector("#note-title").value = note?.title || "";
  document.querySelector("#note-details").value = note?.details || "";
  elements.noteStatus.value = note?.status || project.lanes[0];
  elements.noteColor.value = note?.color || palette[0].value;
  elements.noteModalTitle.textContent = note ? "Edit note" : "Add note";
  showModal(elements.noteModal);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

populateColorSelect(elements.projectColor);
populateColorSelect(elements.noteColor);
renderHome();

elements.openProjectModal.addEventListener("click", () => {
  elements.projectForm.reset();
  showModal(elements.projectModal);
});
elements.openLaneModal.addEventListener("click", () => showModal(elements.laneModal));
elements.openNoteModal.addEventListener("click", () => openNoteForm());
elements.backHome.addEventListener("click", renderHome);

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(document.querySelector(`#${button.dataset.close}`)));
});

elements.projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = {
    id: crypto.randomUUID(),
    name: document.querySelector("#project-name").value.trim(),
    description: document.querySelector("#project-description").value.trim(),
    color: elements.projectColor.value,
    lanes: [...defaultLanes],
    notes: []
  };
  state.projects.unshift(project);
  saveState();
  closeModal(elements.projectModal);
  renderHome();
});

elements.laneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = activeProject();
  const laneName = document.querySelector("#lane-name").value.trim();
  if (!project || !laneName) {
    return;
  }
  if (!project.lanes.some((lane) => lane.toLowerCase() === laneName.toLowerCase())) {
    project.lanes.push(laneName);
  }
  saveState();
  elements.laneForm.reset();
  closeModal(elements.laneModal);
  renderBoard(project.id);
});

elements.noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const project = activeProject();
  if (!project) {
    return;
  }

  const noteId = document.querySelector("#note-id").value;
  const payload = {
    title: document.querySelector("#note-title").value.trim(),
    details: document.querySelector("#note-details").value.trim(),
    status: elements.noteStatus.value,
    color: elements.noteColor.value
  };

  if (noteId) {
    const note = project.notes.find((candidate) => candidate.id === noteId);
    Object.assign(note, payload);
  } else {
    project.notes.push({ id: crypto.randomUUID(), ...payload });
  }

  saveState();
  closeModal(elements.noteModal);
  renderBoard(project.id);
});
