const form = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const prioritySelect = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const errorBox = document.getElementById('error');

const PRIORITY_LABELS = {
  low: 'nízká',
  medium: 'střední',
  high: 'vysoká',
};

function showError(message) {
  errorBox.textContent = message;
}

// Načte úkoly ze serveru a vykreslí je do seznamu
async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Server vrátil chybu ' + response.status);
    }
    const tasks = await response.json();
    renderTasks(tasks);
    showError('');
  } catch (err) {
    console.error(err);
    showError('Nepodařilo se načíst úkoly.');
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'Zatím žádné úkoly.';
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    // textContent chrání před vložením HTML kódu (XSS)
    li.textContent = `${task.title} (priorita: ${PRIORITY_LABELS[task.priority]})`;
    taskList.appendChild(li);
  });
}

// Odeslání formuláře – POST na server a následné obnovení seznamu
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) {
    showError('Zadejte název úkolu.');
    return;
  }

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Nepodařilo se uložit úkol.');
    }

    form.reset();
    showError('');
    await loadTasks();
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
});

loadTasks();
