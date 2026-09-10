const STORAGE_KEY = "taskflow-oibsip-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const pendingList = document.querySelector("#pending-list");
const completedList = document.querySelector("#completed-list");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const totalCount = document.querySelector("#total-count");
const pendingEmpty = document.querySelector("#pending-empty");
const completedEmpty = document.querySelector("#completed-empty");
const taskTemplate = document.querySelector("#task-template");

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function formatTime(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function updateCounts() {
  const pending = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;

  pendingCount.textContent = `${pending} pending`;
  completedCount.textContent = `${completed} completed`;
  totalCount.textContent = tasks.length;

  pendingEmpty.hidden = pending > 0;
  completedEmpty.hidden = completed > 0;
}

function render() {
  pendingList.replaceChildren();
  completedList.replaceChildren();

  tasks.forEach((task) => {
    const item = taskTemplate.content.cloneNode(true);
    const listItem = item.querySelector(".task-item");
    const toggleButton = item.querySelector(".toggle-button");
    const taskText = item.querySelector(".task-text");
    const taskTime = item.querySelector(".task-time");
    const editButton = item.querySelector(".edit-button");
    const deleteButton = item.querySelector(".delete-button");

    listItem.dataset.id = task.id;
    taskText.textContent = task.text;

    if (task.completed) {
      taskTime.textContent = `Completed ${formatTime(task.completedAt || task.createdAt)}`;
      toggleButton.setAttribute("aria-label", "Mark task pending");
      editButton.setAttribute("aria-label", `Edit completed task: ${task.text}`);
      completedList.appendChild(item);
    } else {
      taskTime.textContent = `Added ${formatTime(task.createdAt)}`;
      toggleButton.setAttribute("aria-label", "Mark task complete");
      editButton.setAttribute("aria-label", `Edit task: ${task.text}`);
      pendingList.appendChild(item);
    }
  });

  updateCounts();
}

function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift(createTask(text));
  saveTasks();
  render();

  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  saveTasks();
  render();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  render();
}

function editTask(taskId, listItem) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  const textElement = listItem.querySelector(".task-text");
  const editButton = listItem.querySelector(".edit-button");
  const oldText = task.text;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = oldText;
  input.maxLength = 120;
  input.setAttribute("aria-label", "Edit task text");

  textElement.replaceWith(input);
  input.focus();
  input.select();

  editButton.textContent = "Save";

  function finishEditing() {
    const newText = input.value.trim();

    if (newText) {
      task.text = newText;
      saveTasks();
    }

    render();
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      finishEditing();
    }

    if (event.key === "Escape") {
      render();
    }
  });

  input.addEventListener("blur", finishEditing);

  editButton.onclick = finishEditing;
}

function handleListClick(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const listItem = button.closest(".task-item");
  const taskId = listItem?.dataset.id;

  if (!taskId) {
    return;
  }

  if (button.classList.contains("toggle-button")) {
    toggleTask(taskId);
  } else if (button.classList.contains("delete-button")) {
    deleteTask(taskId);
  } else if (button.classList.contains("edit-button")) {
    editTask(taskId, listItem);
  }
}

taskForm.addEventListener("submit", addTask);
pendingList.addEventListener("click", handleListClick);
completedList.addEventListener("click", handleListClick);

render();
