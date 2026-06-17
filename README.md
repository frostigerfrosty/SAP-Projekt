# Eisenhower Taskmanager SPA (Single Page Application)

Dieses Projekt ist eine dynamische Webanwendung zur strukturierten Verwaltung und Priorisierung von Aufgaben und Ereignissen nach dem bewährten **Eisenhower-Prinzip**. Die Anwendung wurde als reine **Single Page Application (SPA)** ohne den Einsatz von Serverkomponenten (wie z. B. PHP oder Frameworks) realisiert.

Das Projekt wurde im Rahmen des **Moduls M294** (Frontend-Applikation realisieren) an der Informatikschule Basel entwickelt.

## Inhaltsverzeichnis
- [Projektübersicht](#projektübersicht)
- [Kernfunktionen](#kernfunktionen)
- [Technische Umsetzung](#technische-umsetzung)
- [Projektstruktur](#projektstruktur)
- [Qualitätssicherung & Validierung](#qualitätssicherung--validierung)
- [Installation und Start](#installation-und-start)
- [Autor](#autor)

---

## Projektübersicht

Das Ziel dieser Applikation ist es, Nutzern die Organisation ihres Alltags zu erleichtern, indem Aufgaben automatisch anhand der Kriterien **Wichtig** und **Dringend** klassifiziert werden. Alle Datenoperationen (CRUD) werden flüssig und ohne Neuladen der Seite durchgeführt, um eine optimale UI/UX zu gewährleisten.

### Eisenhower-Klassifizierung:
- **A-Aufgabe (Rot):** Wichtig + Dringend -> *Sofort erledigen*
- **B-Aufgabe (Grün):** Wichtig + Nicht Dringend -> *Einplanen und Wohlfühlen*
- **C-Aufgabe (Gelb):** Nicht Wichtig + Dringend -> *Delegieren / Abgeben*
- **D-Aufgabe (Grau):** Nicht Wichtig + Nicht Dringend -> *Weg damit*

---

## Kernfunktionen

- **Zwei-Masken-Workflow:** Ein dynamisches Formular, das sich nahtlos zwischen dem Erstellungsmodus (Maske 1) und dem Bearbeitungsmodus (Maske 2) umschaltet.
- **Echtzeit-Priorisierung:** Sofortige visuelle Anzeige der errechneten Priorität im Formular, sobald die Checkboxen "Wichtig" oder "Dringend" verändert werden.
- **Detailliertes Datenmodell:** Unterscheidung zwischen Tasks und Events, Erfassung von Autor (max. 20 Zeichen), Titel (max. 255 Zeichen), Beschreibung, Kategorie, Zeitspanne (Start- und Enddatum) sowie Fortschritt (0–100%).
- **Separater Erledigt-Bereich:** Abgeschlossene ToDos (Fortschritt bei 100%) werden automatisch ausgebleicht, durchgestrichen und in eine separate Sektion verschoben. Sie können jederzeit reaktiviert werden.
- **Intelligenter Sortier-Turbo & Suche:** Eine Freitext-Echtzeitsuche kombiniert mit einem Filtersystem (Chronologisch, Autor A-Z / Z-A, Fortschritt oder direkt nach der Eisenhower-Wichtigkeit).
- **Clientseitige Persistenz:** Automatische Speicherung aller Daten im Browser über die `localStorage`-API, sodass Eingaben nach einem Seiten-Reload erhalten bleiben.

---

## Technische Umsetzung

Die Anwendung verzichtet bewusst auf externe Bibliotheken, Build-Tools oder Frameworks, um die Kernkompetenzen im Umgang mit nativem Web-Code zu demonstrieren:

- **HTML5:** Semantische Strukturierung des Anwendungsgerüsts.
- **CSS3:** Modernes, softes UI-Design mit sanften Verläufen, intuitivem Spalten-Grid (Flexbox) und responsivem Layout für mobile Geräte.
- **Vanilla JavaScript (ES6+):** Vollständige Logiksteuerung über den DOM-Tree, Live-Validierung und Event-Handling.
- **XSS-Schutz:** Implementierung einer clientseitigen `escapeHTML`-Funktion zur Bereinigung von Benutzereingaben vor dem Rendering.

---

## Projektstruktur

```text
├── index.html      # Das HTML-Gerüst der Single Page Application
├── style.css       # Vollständiges Styling, CSS-Grid, Prio-Farben & Animationen
├── app.js          # Die Anwendungslogik (CRUD, Validierung, Sortierung & Storage)
└── README.md       # Projektdokumentation (Diese Datei)
