# Drum Notation Trainer

Drum Notation Trainer is a mobile-friendly, single-file web app for learning to read common drum-set notation. It works like a flashcard game: the app shows one notated drum or cymbal hit, you identify it from multiple choices, and the game scores you based on correctness, speed, and streaks.

The canonical app lives in [index.html](index.html). There is no build step, no framework runtime, and no dependency install required to run the shipped version.

## What It Does

- Teaches recognition of common drum-set notation elements using repeated timed drills.
- Progresses across four levels, starting with bass drum, snare, and hi-hat and ending with ghost notes and hi-hat foot notation.
- Adds difficulty modes that change time pressure, number of answer choices, and how many mistakes are allowed.
- Stores best scores locally in the browser so progress persists between sessions.
- Includes an in-app notation legend rendered by the same SVG engine used during play.

## Core Features

- Single-file delivery: everything is contained in one HTML file with inline CSS and JavaScript.
- Offline friendly: the app can be opened directly from disk in a modern browser.
- Progressive learning: four unlockable levels with passing thresholds.
- Difficulty selection: Easy, Medium, and Hard each adjust gameplay pressure differently.
- Score persistence: high scores are stored in localStorage per level and per difficulty.
- Full app reset: clears saved scores and returns the app to a fresh state.
- Visual consistency: the reference legend and gameplay cards use the same notation renderer.

## Project Layout

```text
.
├── AGENTS.md
├── README.md
├── index.html
└── reference-images/
```

### Files

- [index.html](index.html): the entire application, including styles, markup shell, game logic, SVG rendering, persistence, and event binding.
- [README.md](README.md): project documentation.
- [AGENTS.md](AGENTS.md): repository-specific implementation guidance for coding agents.
- [reference-images](reference-images): source images saved during notation research and verification.

## How To Run

### Easiest option

Open [index.html](index.html) directly in your browser.

```bash
open index.html
```

### Local static server

If you want to test on another device on the same network, serve the folder locally.

```bash
npx serve .
```

Or:

```bash
python3 -m http.server
```

Then open the shown local or network URL in a browser.

## Gameplay Overview

The game loop is simple:

1. Choose a level.
2. Choose a difficulty.
3. Read the notation card.
4. Select the matching drum or cymbal element.
5. Continue until the round ends or lives are exhausted.

You earn points for correct answers, with bonus scoring from remaining time and streak multipliers.

## Levels

### Level 1: Beginner

Focuses on the core three kit elements:

- Bass drum
- Snare drum
- Closed hi-hat

### Level 2: Intermediate

Adds more common rock/pop kit voices:

- Crash cymbal
- Floor tom
- High tom

### Level 3: Advanced

Expands to a fuller kit vocabulary:

- Ride cymbal
- Mid tom
- Open hi-hat

### Level 4: Expert

Introduces subtle or easily confused notation:

- Ghost note
- Hi-hat foot

## Difficulty Modes

Each level can be played on three difficulties.

| Difficulty | Time | Extra choices | Lives | Effect |
| --- | --- | --- | --- | --- |
| Easy | 100% | +0 | 3 | Most forgiving mode |
| Medium | 70% | +1 | 2 | More pressure and more ambiguity |
| Hard | 50% | +2 | 0 | First mistake ends the round |

Effective time and choice counts are computed from each level's base settings.

## Scoring Model

Each correct answer starts with the level's base point value. The app then adds a speed bonus based on time remaining and applies a streak multiplier.

Current streak multipliers:

- 1.0x below a 3-answer streak
- 1.5x at 3+
- 2.0x at 5+
- 3.0x at 10+

This means recognition speed matters, but consistency matters more over a full round.

## Progression And Persistence

- High scores are stored in browser localStorage.
- Scores are tracked separately for each level and difficulty pair.
- Level unlocking uses the best score achieved on that level across all difficulties.
- The app stores data under the `drumHighScores` key.
- The Reset App action clears that stored progress and resets the in-memory game state.

## Notation System Used In The App

The app uses a custom inline SVG renderer to draw every flashcard and reference example. The current notation mapping reflects the app's present training reference and display preferences.

### Current note placements

| Element | Placement in the app |
| --- | --- |
| Bass Drum | Bottom space |
| Floor Tom | Second space from bottom |
| Snare Drum | Third space from bottom |
| Mid Tom | Second line from top |
| High Tom | First space from top |
| Closed Hi-Hat | Space above top line |
| Open Hi-Hat | Space above top line with open circle mark |
| Ride Cymbal | Top line |
| Crash Cymbal | Above the hi-hat, above top line |
| Ghost Note | Snare position with parentheses |
| Hi-Hat Foot | Below bottom line |

### Rendering details

- Staffs are drawn as inline SVG inside a 320 by 120 viewBox.
- All stems currently render upward on the right side to match the preferred display style used in the app.
- X noteheads are used for cymbal-family voices and foot hi-hat.
- Standard filled noteheads are used for drums and toms.
- Ghost notes are rendered as a parenthesized snare-style notehead.
- Open hi-hat includes a small open-circle mark above the notehead.

## Reference Images

The repository includes saved external reference images in [reference-images](reference-images). These were kept in the project so notation choices can be reviewed later without repeating the research step.

## Technical Design

The app is intentionally simple and direct.

### Frontend structure

- HTML provides a single root container.
- CSS defines the full visual system with custom properties for colors and radii.
- JavaScript manages game data, SVG generation, state transitions, and event handling.

### Rendering model

- The app uses a single mutable `state` object.
- UI is rerendered by replacing `#app.innerHTML` when screens change.
- The main screens are start, difficulty picker, game, and result.

### Main logical sections inside the app

- Data definitions for drum notes, levels, and difficulties
- Scoring and question generation
- SVG notation rendering
- Screen rendering helpers
- Game actions and timers
- Event binding and bootstrapping

## Browser Expectations

The app is designed for modern browsers that support:

- ES2015+ JavaScript
- CSS custom properties
- SVG
- localStorage
- modern mobile viewport units such as `100dvh`

It is especially tuned for phone-sized screens, but remains usable on desktop.

## Manual Test Checklist

- Verify each of the four levels can be started.
- Verify the difficulty picker appears after selecting a level.
- Verify Easy, Medium, and Hard adjust lives and timing as expected.
- Verify answer buttons reveal correct and incorrect states after a guess.
- Verify timeouts count as mistakes.
- Verify Hard mode ends immediately after the first mistake.
- Verify the reference legend matches the notation shown during gameplay.
- Verify high scores persist across reloads.
- Verify Reset App clears all local progress.
- Verify the layout remains usable on a narrow mobile viewport.

## Customization Notes

If you want to evolve the app further, the most important place to start is the `DRUM_NOTES` object in [index.html](index.html). That data drives:

- names and abbreviations
- descriptions shown after answers
- notation position on the staff
- notehead style
- special markers such as open hi-hat circles

Other common customization points:

- `LEVELS` for progression and score thresholds
- `DIFFICULTIES` for timing and lives
- `REFERENCE_LEGEND` for the built-in notation guide
- `buildStaffSVG()` for rendering behavior

## Author

Author: Xerxes Battiwalla

Copyright (c) 2026 Xerxes Battiwalla. All rights reserved.
