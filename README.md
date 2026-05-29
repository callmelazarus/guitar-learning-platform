# Guitar Practice Tracker

A personal, local-first web app for building consistent guitar practice habits, tracking songs you're learning, and referencing music theory — built with worship music in mind.

No backend. No login. All data lives in your browser's `localStorage`.

Hosted site: https://guitar-learning-platform-chi.vercel.app/

---

## Features

### Dashboard
- **Weekly streak bar** — Mon–Sun circles showing which days you practiced this week
- **Streak counter** — consecutive-day streak with milestone badges at 7, 30, and 100 days
- **Log Practice button** — one tap logs today; tap again to remove it
- **Active songs** — quick view of every song currently in progress, with Tab and YouTube links

### Practice Calendar
- Monthly grid with prev/next navigation
- Practice days highlighted in green
- Song milestone markers (★) on days a song was marked learned
- Click any past or current day to toggle practice — future days are locked

### Song Tracker
- Track multiple songs at once, each with title, artist, key, YouTube URL, and tab URL
- **Mark as Learned** — archives the song with today's date and stamps a milestone on the calendar
- **Song history** — all learned songs sorted by date

### Chords
- **Progression explorer** — select a progression (I–V–vi–IV, I–IV–V, I–vi–IV–V) and a key (G, D, A, E, C)
- **Chord diagrams** — SVG fingering diagrams for each chord in the selected progression
- **Song examples** — worship songs that use that progression in that key

### Theory Reference
- **Circle of Fifths** — interactive SVG; click any key to see its relative minor and diatonic chords
- **Open chord charts** — SVG diagrams for G, D, Em, Cadd9, A, E, Am, Bm
- **Worship key progressions** — I–V–vi–IV written out for G, D, A, E, C
- **Major scale diagram** — box pattern 1 across the fretboard; slide to any key

---

## Stack

- **React 18** + **Vite**
- **React Router v6** — five client-side routes
- **Vitest** + **@testing-library/react** — unit and component tests
- No external state library — a single `useAppData` hook owns all state and localStorage I/O

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other commands

```bash
npm run build       # production build → dist/
npm run preview     # preview the production build locally
npm run test:run    # run the full test suite once
npm test            # run tests in watch mode
```

---

## Data

All data is stored in `localStorage` under the key `guitarApp`:

```json
{
  "practiceDays": ["2026-05-24", "2026-05-25"],
  "activeSongs": [
    {
      "id": "1716998400000",
      "title": "Goodness of God",
      "artist": "Bethel Music",
      "key": "G",
      "dateStarted": "2026-05-01",
      "youtubeUrl": "",
      "tabUrl": "",
      "status": "in_progress"
    }
  ],
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

Data persists across browser sessions. It is scoped to the browser and device — clearing site data will erase it.

Adding new fields to the data model is safe (defaults kick in for missing keys). Renaming or restructuring existing fields requires a migration case in the `migrate` function in `src/hooks/useAppData.js`.
