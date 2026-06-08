const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const template = document.querySelector("#todo-template");
const emptyState = document.querySelector("#empty-state");
const summary = document.querySelector("#summary");
const clearDoneButton = document.querySelector("#clear-done");
const filterButtons = document.querySelectorAll(".filter");

const storageKey = "simple-todo-app.todos";

let todos = loadTodos();
let currentFilter = "all";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  todos = [
    {
      id: crypto.randomUUID(),
      text,
      done: false,
    },
    ...todos,
  ];

  input.value = "";
  saveAndRender();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });
    renderTodos();
  });
});

clearDoneButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.done);
  saveAndRender();
});

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? [];
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === "open") {
      return !todo.done;
    }

    if (currentFilter === "done") {
      return todo.done;
    }

    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector(".toggle");
    const text = item.querySelector(".todo-text");
    const deleteButton = item.querySelector(".delete-button");

    item.classList.toggle("done", todo.done);
    checkbox.checked = todo.done;
    text.textContent = todo.text;

    checkbox.addEventListener("change", () => {
      todos = todos.map((currentTodo) =>
        currentTodo.id === todo.id ? { ...currentTodo, done: checkbox.checked } : currentTodo,
      );
      saveAndRender();
    });

    deleteButton.addEventListener("click", () => {
      todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
      saveAndRender();
    });

    list.append(item);
  });

  const openCount = todos.filter((todo) => !todo.done).length;
  const taskLabel = openCount === 1 ? "Aufgabe" : "Aufgaben";
  emptyState.classList.toggle("hidden", todos.length > 0);
  summary.textContent = `${openCount} ${taskLabel} offen`;
}

renderTodos();
