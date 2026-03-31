# AGENTS.md

## Project Overview

Drum Notation Trainer — a single-file web app (`index.html`) for learning to read drum notation. It is a flashcard-style game with 4 progressive difficulty levels, timed questions, streak multipliers, and localStorage high-score persistence.

## Git Workflow

This is a private project. Always push directly to `main` — do not create pull requests or feature branches. After committing, push straight to origin.

## Repository Layout

```
index.html          # The entire app — HTML + CSS + JS, no build step
AGENTS.md           # This file
README.md           # Human-facing overview
src/                # Legacy React/Vite source (superseded by index.html)
package.json        # Only needed if working on the React source
vite.config.js      # Only needed if working on the React source
```

The canonical deliverable is `index.html`. The `src/` tree is retained for reference but is not served in production.

## Running the App

Open `index.html` directly in any modern browser — no server, no build step, no dependencies.

```bash
open index.html          # macOS
xdg-open index.html      # Linux
# Or drag the file into a browser window
```

For phone testing on the same WiFi network, serve it with any static file server:

```bash
npx serve .              # then open the Network URL on your phone
python3 -m http.server   # alternative
```

## Architecture

Everything lives in `index.html` in three clearly delimited sections:

1. `<style>` — all CSS, dark theme, mobile-first layout
2. `<body>` — three screen `<div>` elements (`#start-screen`, `#game-screen`, `#result-screen`)
3. `<script>` — vanilla JS organised into logical sections:
   - **Data** — `DRUM_NOTES` object and `LEVELS` array
   - **Game logic** — pure functions (question generation, scoring, high scores)
   - **SVG rendering** — `buildStaffSVG(noteData)` returns an SVG string
   - **UI rendering** — `renderStartScreen()`, `renderGameScreen()`, `renderResultScreen()`
   - **Game state machine** — `state` object + `startGame()`, `handleAnswer()`, `nextQuestion()`, `endGame()`
   - **Boot** — `init()` called on `DOMContentLoaded`

## Code Conventions

- **No external dependencies** — zero CDN imports, zero npm packages; the file must work offline
- **Vanilla JS only** — no frameworks, no JSX, no TypeScript
- **SVG notation** — drum staff drawn with inline SVG strings; `buildStaffSVG()` is the single rendering entry point
- **State** — one mutable `state` object; no reactive framework; UI is re-rendered imperatively via `innerHTML`
- **localStorage key** — `drumHighScores` (JSON object keyed by level id)
- **CSS variables** — all colours and radii defined as `--var` on `:root`; do not hard-code colour values elsewhere
- **Mobile-first** — minimum tap target 48px, `100dvh` for full-height layout, `env(safe-area-inset-*)` padding

## Drum Notation SVG Layout

Staff coordinate system inside `viewBox="0 0 320 120"`:

| Constant | Value | Notes |
|---|---|---|
| `MIDDLE_Y` | 62 | y-coordinate of line 3 (snare reference) |
| `HALF_SPACE` | 6 | px per half-space step |
| `NOTE_X` | 175 | horizontal centre of note |
| Staff lines | y = 38,50,62,74,86 | line 5 (top) → line 1 (bottom) |

`getY(position) = MIDDLE_Y - position * HALF_SPACE`

Positive positions are above the middle line; negative positions are below.

## Adding a New Drum Element

1. Add an entry to the `DRUM_NOTES` object with: `id`, `name`, `shortName`, `description`, `position`, `headType` (`'normal'|'x'|'open_x'|'ghost'`), `stemDown` (bool), and optional `hasAccent`/`hasOpenMark`
2. Add the id to the appropriate level's `notes` array in `LEVELS`
3. If the new element shares a staff position with an existing one (visual twin), add both ids to the `VISUAL_TWINS` map in the game logic section

## Drum Kit Reference Card

| Element | Position | Head | Stem | Special mark |
|---|---|---|---|---|
| Bass Drum | −5 | oval | up | — |
| Hi-Hat Foot | −6 | × | up | — |
| Floor Tom | −3 | oval | up | — |
| Snare | 0 | oval | down | — |
| Ghost Note | 0 | oval | down | parentheses |
| Mid Tom | +1 | oval | down | — |
| High Tom | +3 | oval | down | — |
| Ride Cymbal | +5 | × | down | — |
| Closed Hi-Hat | +6 | × | down | — |
| Open Hi-Hat | +6 | × | down | o |
| Crash Cymbal | +7 | × | down | > |

## Versioning

The app displays a version identifier in the footer via the `APP_VERSION` constant near the top of the `<script>` block.

- Format: `0.<N>` where `<N>` is the total commit count on the branch being deployed.
- **Every commit that changes `index.html` must bump `APP_VERSION`**. Before committing, run `git rev-list --count HEAD` and set the constant to `0.<count + 1>` (since the new commit will add one).
- The version is shown in the footer as a subtle `v0.X` label.

## Testing Checklist (manual)

- [ ] All 4 levels are playable start-to-finish
- [ ] Correct answer flashes green, wrong flashes red on the notation card
- [ ] Timer counts down and treats timeout as a wrong answer
- [ ] Streak multiplier badge appears at streak ≥ 3
- [ ] Ghost Note and Snare always appear together in choices (level 4)
- [ ] Open Hi-Hat and Closed Hi-Hat always appear together in choices (level 3+)
- [ ] High score persists after page reload
- [ ] Next level unlocks when passing score is met
- [ ] Layout is usable on a 375 × 667 viewport (iPhone SE)
- [ ] File works with no internet connection (open directly from disk)
