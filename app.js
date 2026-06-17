/**
 * Todo Single Page Application (SPA) - Modul M294
 * Autor: Laurin Gloor (Klasse I2B)
 * Beschreibung: Clientseitige Verwaltung und Priorisierung von Aufgaben nach dem Eisenhower-Prinzip.
 */

// --- 1. GLOBALE VARIABLEN & STATE MANAGEMENT ---
let todos = [];
let isEditMode = false;
let currentEditId = null;

// Aktuelle Filter- und Sortier-Einstellungen (Add-on Filtersystem)
let currentSearchTerm = '';
let currentSortCriteria = 'date-asc'; // Standard: Startdatum aufsteigend

// --- 2. DOM-ELEMENTE ---
const todoForm = document.getElementById('todo-form');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const formSection = document.getElementById('form-section');
const todoContainer = document.getElementById('todo-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Formular-Eingabefelder
const inputId = document.getElementById('todo-id');
const inputTitle = document.getElementById('todo-title');
const inputType = document.getElementById('todo-type');
const inputAuthor = document.getElementById('todo-author');
const inputDescription = document.getElementById('todo-description');
const inputCategory = document.getElementById('todo-category');
const inputImportant = document.getElementById('todo-important');
const inputUrgent = document.getElementById('todo-urgent');
const inputStartDate = document.getElementById('todo-startdate');
const inputEndDate = document.getElementById('todo-enddate');
const inputProgress = document.getElementById('todo-progress');
const progressVal = document.getElementById('progress-val');
const priorityDisplay = document.getElementById('todo-priority-display');

// --- 3. INITIALISIERUNG BEIM SEITENSTART ---
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initEventListeners();
    renderTodoList();
});

// --- 4. EVENT LISTENERS INITIALISIEREN ---
function initEventListeners() {
    // Formular absenden (Erstellen oder Aktualisieren)
    todoForm.addEventListener('submit', handleFormSubmit);

    // Abbrechen-Button im Bearbeitungsmodus
    btnCancel.addEventListener('click', resetForm);

    // Echtzeit-Suche (Input-Event)
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        renderTodoList();
    });

    // Registriere das Sortier-Dropdown im Filtersystem
    sortSelect.addEventListener('change', (e) => {
        currentSortCriteria = e.target.value;
        renderTodoList();
    });

    // Fortschritts-Slider Textaktualisierung
    inputProgress.addEventListener('input', (e) => {
        progressVal.textContent = e.target.value;
    });

    // Live-Berechnung der Priorität bei Klick auf die Checkboxen
    inputImportant.addEventListener('change', updateLivePriority);
    inputUrgent.addEventListener('change', updateLivePriority);
}

// --- 5. LOGISCHE PRIORITÄTEN-BERECHNUNG (Pflichtenheft) ---
/**
 * Berechnet die Priorität nach dem Eisenhower-Prinzip
 * @param {boolean} important 
 * @param {boolean} urgent 
 * @returns {string} Text-Zustand für das priorityDisplay
 */
function calculatePriority(important, urgent) {
    if (important && urgent) {
        return "Sofort erledigen (A-Aufgabe)";
    } else if (important && !urgent) {
        return "Einplanen und Wohlfühlen (B-Aufgabe)";
    } else if (!important && urgent) {
        return "Gib es ab (C-Aufgabe)";
    } else {
        return "Weg damit (D-Aufgabe)";
    }
}

// Aktualisiert das schreibgeschützte Feld im Formular in Echtzeit
function updateLivePriority() {
    const text = calculatePriority(inputImportant.checked, inputUrgent.checked);
    priorityDisplay.textContent = text;
}

// --- 6. LOCAL STORAGE ANBINDUNG (Datenspeicherung) ---
function saveToStorage() {
    localStorage.setItem('todo_spa_data', JSON.stringify(todos));
}

function loadFromStorage() {
    const data = localStorage.getItem('todo_spa_data');
    todos = data ? JSON.parse(data) : [];
}

// --- 7. CRUD & WORKFLOW OPERATIONEN ---

// CREATE & UPDATE (Speichern-Logik)
function handleFormSubmit(event) {
    event.preventDefault(); // Verhindert Neuladen der Seite

    if (!validateForm()) {
        return; // Validierung fehlgeschlagen
    }

    const todoData = {
        id: isEditMode ? currentEditId : Date.now().toString(), // ID via Timestamp
        title: inputTitle.value.trim(),
        type: inputType.checked, // true = Event, false = Task
        description: inputDescription.value.trim(),
        author: inputAuthor.value.trim(),
        category: inputCategory.value,
        isImportant: inputImportant.checked,
        isUrgent: inputUrgent.checked,
        priorityDisplay: calculatePriority(inputImportant.checked, inputUrgent.checked),
        startDate: inputStartDate.value,
        endDate: inputEndDate.value,
        progress: parseInt(inputProgress.value, 10)
    };

    if (isEditMode) {
        // Update: Altes Objekt ersetzen
        const index = todos.findIndex(t => t.id === currentEditId);
        if (index !== -1) todos[index] = todoData;
    } else {
        // Create: Neues Objekt hinzufügen
        todos.push(todoData);
    }

    saveToStorage();
    resetForm();
    renderTodoList();
}

// READ (In das Formular laden zum Bearbeiten - Maske 2 aktivieren)
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    isEditMode = true;
    currentEditId = id;

    // Masken-Design anpassen (Wechsel zu Maske 2)
    formSection.classList.add('edit-mode-active');
    formTitle.textContent = "Todo Bearbeiten";
    btnSubmit.textContent = "Änderungen Speichern";
    btnCancel.classList.remove('hidden');

    // Felder befüllen
    inputTitle.value = todo.title;
    inputType.checked = todo.type;
    inputAuthor.value = todo.author;
    inputDescription.value = todo.description;
    inputCategory.value = todo.category;
    inputImportant.checked = todo.isImportant;
    inputUrgent.checked = todo.isUrgent;
    inputStartDate.value = todo.startDate;
    inputEndDate.value = todo.endDate;
    inputProgress.value = todo.progress;
    progressVal.textContent = todo.progress;
    
    updateLivePriority();

    // Smooth nach oben scrollen zum Formular
    formSection.scrollIntoView({ behavior: 'smooth' });
}

// DELETE (Lösch-Operation)
function deleteTodo(id) {
    if (confirm('Möchtest du dieses Todo wirklich löschen?')) {
        todos = todos.filter(t => t.id !== id);
        saveToStorage();
        if (currentEditId === id) resetForm(); // Falls das zu löschende gerade editiert wurde
        renderTodoList();
    }
}

// TOGGLE ERLEDIGT (Setzt den Fortschritt auf 100% oder reaktiviert auf 0%)
function toggleDone(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    if (todo.progress < 100) {
        todo.progress = 100; // Als erledigt markieren
    } else {
        todo.progress = 0; // Wieder aktivieren
    }

    saveToStorage();
    renderTodoList();
}

// Formular zurücksetzen (Zurück zu Maske 1)
function resetForm() {
    isEditMode = false;
    currentEditId = null;

    todoForm.reset();
    
    formSection.classList.remove('edit-mode-active');
    formTitle.textContent = "Neues Todo Erstellen";
    btnSubmit.textContent = "Todo Hinzufügen";
    btnCancel.classList.add('hidden');
    
    progressVal.textContent = "0";
    priorityDisplay.textContent = "Weg damit";

    // Fehler-Klassen entfernen
    const groups = todoForm.querySelectorAll('.form-group');
    groups.forEach(g => g.classList.remove('invalid'));
}

// --- 8. VALIDIERUNG (Konzept zur Eingabeoptimierung) ---
function validateForm() {
    let isValid = true;

    // Hilfsfunktion zum Setzen des Status
    const checkField = (inputEl, condition) => {
        const group = inputEl.closest('.form-group');
        if (condition) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
            isValid = false;
        }
    };

    // 1. Titel (Pflichtfeld & Max 255)
    checkField(inputTitle, inputTitle.value.trim().length > 0 && inputTitle.value.length <= 255);

    // 2. Autor (Pflichtfeld & Max 20)
    checkField(inputAuthor, inputAuthor.value.trim().length > 0 && inputAuthor.value.length <= 20);

    // 3. Datums-Validierung (Enddatum darf nicht vor Startdatum liegen)
    checkField(inputStartDate, inputStartDate.value !== '');
    
    if (inputStartDate.value && inputEndDate.value) {
        const start = new Date(inputStartDate.value);
        const end = new Date(inputEndDate.value);
        checkField(inputEndDate, end >= start);
    } else {
        checkField(inputEndDate, inputEndDate.value !== '');
    }

    return isValid;
}

// --- 9. RENDERING & FILTER/SORTIER-LOGIK ---
function renderTodoList() {
    const doneContainer = document.getElementById('done-container');
    todoContainer.innerHTML = '';
    doneContainer.innerHTML = '';

    // A. FILTERN (Nach Freitext-Suche)
    let processedTodos = todos.filter(todo => {
        return todo.title.toLowerCase().includes(currentSearchTerm) || 
               todo.description.toLowerCase().includes(currentSearchTerm) ||
               todo.author.toLowerCase().includes(currentSearchTerm);
    });

    // B. SORTIEREN (Der intelligente Eisenhower-Sortier-Turbo)
    processedTodos.sort((a, b) => {
        if (currentSortCriteria === 'name-asc') {
            return a.author.localeCompare(b.author); // Autor von A-Z
        }
        if (currentSortCriteria === 'name-desc') {
            return b.author.localeCompare(a.author); // Autor von Z-A
        }
        if (currentSortCriteria === 'importance') {
            // Hier geben wir den 4 Eisenhower-Zuständen feste Ränge (Gewichte)
            const getPrioWeight = (todo) => {
                if (todo.isImportant && todo.isUrgent) return 4;       // A-Aufgabe: Rot (Wichtig + Dringend) -> HÖCHSTE PRIO
                if (todo.isImportant && !todo.isUrgent) return 3;      // B-Aufgabe: Grün (Wichtig + Nicht Dringend)
                if (!todo.isImportant && todo.isUrgent) return 2;      // C-Aufgabe: Gelb (Nicht Wichtig + Dringend)
                return 1;                                              // D-Aufgabe: Grau (Nicht Wichtig + Nicht Dringend)
            };
            
            // Sortiert absteigend: Rang 4 (A) kommt fest vor Rang 3 (B), etc.
            return getPrioWeight(b) - getPrioWeight(a);
        }
        if (currentSortCriteria === 'progress-desc') {
            return b.progress - a.progress; // Fortschritt 100% -> 0%
        }
        // Standard: date-asc (Startdatum aufsteigend)
        return new Date(a.startDate) - new Date(b.startDate);
    });

    // Zähler für leere Container-Zustände
    let openCount = 0;
    let doneCount = 0;

    // C. AUSGABE IM HTML
    processedTodos.forEach(todo => {
        const isCompleted = todo.progress === 100;

        // CSS-Klasse für die Eisenhower-Farbe ermitteln
        let prioClass = 'prio-weg';
        if (todo.isImportant && todo.isUrgent) prioClass = 'prio-sofort';
        else if (todo.isImportant && !todo.isUrgent) prioClass = 'prio-einplanen';
        else if (!todo.isImportant && todo.isUrgent) prioClass = 'prio-delegieren';

        if (isCompleted) {
            prioClass = 'is-done'; // Überschreiben mit Erledigt-Klasse, wenn Fortschritt = 100%
        }

        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${prioClass}`;
        
        todoItem.innerHTML = `
            <div class="todo-content-left">
                <div class="todo-header-row">
                    <span class="todo-item-title">${escapeHTML(todo.title)}</span>
                    <span class="badge badge-category">${todo.category}</span>
                    <span class="badge badge-type">${todo.type ? 'Event' : 'Task'}</span>
                </div>
                <p class="todo-item-desc">${escapeHTML(todo.description) || '<i>Keine Beschreibung</i>'}</p>
                <div class="todo-meta-info">
                    <span>Ersteller: <b>${escapeHTML(todo.author)}</b></span>
                    <span>Zeitspanne: ${formatDate(todo.startDate)} bis ${formatDate(todo.endDate)}</span>
                    <span>Prio: <i>${todo.priorityDisplay}</i></span>
                </div>
            </div>
            
            <div class="todo-progress-container">
                <label>Fortschritt: <b>${todo.progress}%</b></label>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${todo.progress}%"></div>
                </div>
            </div>
            
            <div class="todo-actions">
                <button class="action-btn btn-done" onclick="toggleDone('${todo.id}')" title="${isCompleted ? 'Wieder aktivieren' : 'Als erledigt markieren'}">
                    ${isCompleted ? 'Reaktivieren' : 'Erledigen'}
                </button>
                <button class="action-btn btn-edit" onclick="editTodo('${todo.id}')" title="Bearbeiten">Bearbeiten</button>
                <button class="action-btn btn-delete" onclick="deleteTodo('${todo.id}')" title="Löschen">Löschen</button>
            </div>
        `;

        // In den richtigen Container einsortieren
        if (isCompleted) {
            doneContainer.appendChild(todoItem);
            doneCount++;
        } else {
            todoContainer.appendChild(todoItem);
            openCount++;
        }
    });

    // Platzhalter anzeigen, falls ein Container leer ist
    if (openCount === 0) {
        todoContainer.innerHTML = '<div class="no-todos">Keine offenen Todos gefunden.</div>';
    }
    if (doneCount === 0) {
        doneContainer.innerHTML = '<div class="no-todos">Noch keine Aufgaben erledigt.</div>';
    }
}

// Hilfsfunktion: Schützt vor XSS (Sicherheits-Best-Practice)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Hilfsfunktion: Datum formattieren (DD.MM.YYYY)
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-CH');
}