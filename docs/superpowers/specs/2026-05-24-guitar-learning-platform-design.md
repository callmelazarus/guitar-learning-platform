# Guitar Learning Platform — Design Spec

**Date:** 2026-05-24  
**Status:** Approved

---

## Overview

A personal, local-first frontend web app to help an intermediate guitarist build consistent practice habits, track monthly song learning, and reference music theory. No backend, no authentication — all data persists in `localStorage`.

**Stack:** React + Vite, React Router, custom `useAppData` hook for state, SVG for theory diagrams.

---

## Architecture

Single-page application with four routes:

| Route | Section |
|---|---|
| `/` | Dashboard |
| `/calendar` | Practice Calendar |
| `/songs` | Song Tracker |
| `/theory` | Theory Reference |

A persistent navigation bar is present on all pages.

All app state is managed through a single custom hook, `useAppData`, which reads from and writes to `localStorage`. Components do not access `localStorage` directly.

### Data Shape (localStorage)

```json
{
  "practiceDays": ["2026-05-01", "2026-05-03", ...],
  "currentSong": null,
  // or when active:
  // "currentSong": {
  //   "title": "Goodness of God",
  //   "artist": "Bethel Music",
  //   "key": "G",
  //   "dateStarted": "2026-05-01",
  //   "youtubeUrl": "",
  //   "tabUrl": "",
  //   "status": "in_progress"
  // },
  "songHistory": [
    {
      "title": "Way Maker",
      "artist": "Sinach",
      "key": "D",
      "dateStarted": "2026-04-01",
      "dateLearned": "2026-04-28",
      "status": "learned"
    }
  ]
}
```

---

## Components & Features

### Dashboard (`/`)

- **Weekly streak bar** — Mon–Sun row showing filled/empty circles for the current week
- **Streak counter** — current consecutive-day streak with milestone badges at 7, 30, and 100 days
- **Log Practice button** — one tap logs today's date; tapping again on the same day removes it (toggle)
- **Current song card** — title, artist, key, and progress status (Not Started / In Progress / Learned)

### Calendar (`/calendar`)

- Monthly grid view with prev/next month navigation
- Practice days highlighted in green; no-practice days are neutral (no negative/red indicators)
- Song milestone markers on days where a song was marked "Learned"
- Clicking a day shows its log status and allows toggling practice for today and past days only (future days are not interactive)

### Song Tracker (`/songs`)

- **Current song card** with: title, artist, key, date started, optional YouTube URL, optional tab URL, and progress status
- **Mark as Learned** button — sets `dateLearned` to today, stamps a milestone on the calendar, moves the song to history, and clears `currentSong`
- **Add new song** form — appears after marking learned or when no current song is set
- **Song history list** — archived songs sorted by month with date started, date learned, and key

### Theory Reference (`/theory`)

- **Circle of Fifths** — interactive SVG diagram; clicking a key highlights its relative minor and common diatonic chords
- **Open chord charts** — common open position chords used in worship music (G, D, Em, Cadd9, A, E, Am, Bm)
- **Worship key progressions** — I–V–vi–IV written out for the five most common worship keys: G, D, A, E, C
- **Major scale diagram** — diatonic scale pattern for the major scale across the fretboard

---

## Data Flow

```
useAppData (localStorage) 
    ↓ reads/writes
Page components (Dashboard, Calendar, Songs, Theory)
    ↓ pass data/handlers as props
Child components (StreakBar, SongCard, CalendarGrid, ChordDiagram, etc.)
```

No global state library needed. `useAppData` is the single source of truth.

---

## Error Handling

- If `localStorage` is unavailable (private browsing, quota exceeded), the app displays a non-blocking banner: "Your data can't be saved in this browser session."
- All user input is validated client-side before writing to state (e.g., song title required, dates must be valid).
- No network calls — no network error handling needed.

---

## Testing

- Unit tests for `useAppData` hook — streak calculation, practice day toggle, song lifecycle (add, mark learned, archive)
- Component tests for Calendar grid rendering and streak bar display
- No E2E tests required at this stage

---

## Out of Scope

- Backend / cloud sync
- User authentication
- Song suggestions / recommendations
- Metronome or audio features
- Social / sharing features
