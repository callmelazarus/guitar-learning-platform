# Guitar Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first React + Vite web app for tracking guitar practice, monthly song learning, and music theory reference — all data in localStorage, no backend.

**Architecture:** Single-page app with four routes (Dashboard, Calendar, Songs, Theory) sharing state through a single `useAppData` hook that reads/writes localStorage. Components are pure presentational; all logic lives in the hook and utility modules.

**Tech Stack:** React 18, Vite, React Router v6, Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

## File Map

```
src/
  main.jsx                          Entry point
  App.jsx                           Router + NavBar layout
  hooks/
    useAppData.js                   All state + localStorage + computed values
  utils/
    storage.js                      localStorage read/write helpers
    dates.js                        Streak calc, week days, month grid, milestones
  pages/
    Dashboard.jsx                   /, assembles streak + song card
    Calendar.jsx                    /calendar, month nav + grid
    Songs.jsx                       /songs, current song + history
    Theory.jsx                      /theory, all four diagrams
  components/
    NavBar.jsx                      Persistent nav links
    StreakBar.jsx                    Mon–Sun practiced circles
    StreakCounter.jsx               Streak count + milestone badges
    LogPracticeButton.jsx          Toggle today's practice
    SongCard.jsx                   Current song display
    CalendarGrid.jsx               Month grid with practice/milestone markers
    SongForm.jsx                   Add new song form
    SongHistory.jsx                Past songs list
    CircleOfFifths.jsx             Interactive SVG circle
    ChordCharts.jsx                Open chord SVG diagrams
    WorshipProgressions.jsx        I–V–vi–IV in five keys
    ScaleDiagram.jsx               Major scale fretboard SVG
    StorageBanner.jsx              Non-blocking warning when storage unavailable
  test/
    setup.js                       @testing-library/jest-dom import
    storage.test.js
    dates.test.js
    useAppData.test.js
    StreakBar.test.jsx
    CalendarGrid.test.jsx
index.html
vite.config.js
package.json
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/test/setup.js`, `src/styles/index.css`

- [ ] **Step 1: Initialize project**

```bash
cd /path/to/guitar-learning-platform
npm create vite@latest . -- --template react
```

When prompted "Current directory is not empty. Remove existing files and continue?" choose **No** and instead manually create the files below (the repo already has LICENSE and README).

- [ ] **Step 2: Create package.json**

```json
{
  "name": "guitar-learning-platform",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.7",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.1.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 3: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guitar Practice</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create src/test/setup.js**

```javascript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create src/styles/index.css**

```css
*, *::before, *::after { box-sizing: border-box; }

:root {
  --bg: #1a1a2e;
  --surface: #16213e;
  --surface2: #0f3460;
  --accent: #e94560;
  --accent2: #f5a623;
  --green: #4caf50;
  --text: #e0e0e0;
  --text-muted: #888;
  --radius: 8px;
  --font: 'Segoe UI', system-ui, sans-serif;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
}

button {
  cursor: pointer;
  border: none;
  border-radius: var(--radius);
  font-family: var(--font);
}

input, select, textarea {
  font-family: var(--font);
  background: var(--surface2);
  border: 1px solid #444;
  border-radius: var(--radius);
  color: var(--text);
  padding: 8px 12px;
}

a { color: var(--accent2); text-decoration: none; }
```

- [ ] **Step 7: Create src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 8: Create src/App.jsx (placeholder routes)**

```jsx
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/calendar" element={<div>Calendar</div>} />
          <Route path="/songs" element={<div>Songs</div>} />
          <Route path="/theory" element={<div>Theory</div>} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 9: Create src/components/NavBar.jsx**

```jsx
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/songs', label: 'Songs' },
  { to: '/theory', label: 'Theory' },
]

export default function NavBar() {
  return (
    <nav style={{
      background: 'var(--surface)',
      padding: '12px 24px',
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      borderBottom: '2px solid var(--surface2)',
    }}>
      <span style={{ fontWeight: 700, color: 'var(--accent)', marginRight: 16 }}>🎸 Guitar</span>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent2)' : 'var(--text)',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
```

- [ ] **Step 10: Install dependencies and verify dev server starts**

```bash
npm install
npm run dev
```

Expected: Dev server running at `http://localhost:5173` showing "Dashboard" text with navbar.

- [ ] **Step 11: Commit**

```bash
git add package.json vite.config.js index.html src/
git commit -m "feat: scaffold React + Vite project with routing"
```

---

## Task 2: Storage and Date Utilities

**Files:**
- Create: `src/utils/storage.js`, `src/utils/dates.js`, `src/test/storage.test.js`, `src/test/dates.test.js`

- [ ] **Step 1: Write failing storage tests**

Create `src/test/storage.test.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadData, saveData, isStorageAvailable } from '../utils/storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('loadData returns null when nothing stored', () => {
    expect(loadData()).toBeNull()
  })

  it('saveData then loadData round-trips data', () => {
    const data = { practiceDays: ['2026-05-01'], currentSong: null, songHistory: [] }
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('isStorageAvailable returns true in test env', () => {
    expect(isStorageAvailable()).toBe(true)
  })

  it('loadData returns null on malformed JSON', () => {
    localStorage.setItem('guitarApp', 'not-json')
    expect(loadData()).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/test/storage.test.js
```

Expected: FAIL — `Cannot find module '../utils/storage'`

- [ ] **Step 3: Create src/utils/storage.js**

```javascript
const KEY = 'guitarApp'

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function isStorageAvailable() {
  try {
    localStorage.setItem('__test__', '1')
    localStorage.removeItem('__test__')
    return true
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/test/storage.test.js
```

Expected: PASS — 4 tests

- [ ] **Step 5: Write failing date utility tests**

Create `src/test/dates.test.js`:

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatDate, today, getStreakCount, getWeekDays, getDaysInMonth, getMilestones } from '../utils/dates'

describe('formatDate', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 4, 24))).toBe('2026-05-24')
  })
})

describe('getStreakCount', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 24)) // May 24
  })
  afterEach(() => vi.useRealTimers())

  it('returns 0 for empty array', () => {
    expect(getStreakCount([])).toBe(0)
  })

  it('returns 1 when only today is practiced', () => {
    expect(getStreakCount(['2026-05-24'])).toBe(1)
  })

  it('returns consecutive count including today', () => {
    expect(getStreakCount(['2026-05-22', '2026-05-23', '2026-05-24'])).toBe(3)
  })

  it('returns streak from yesterday when today not logged', () => {
    expect(getStreakCount(['2026-05-22', '2026-05-23'])).toBe(2)
  })

  it('returns 0 when streak is broken', () => {
    expect(getStreakCount(['2026-05-20', '2026-05-21'])).toBe(0)
  })

  it('ignores non-consecutive days beyond the streak', () => {
    expect(getStreakCount(['2026-05-01', '2026-05-23', '2026-05-24'])).toBe(2)
  })
})

describe('getWeekDays', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 24)) // Sunday May 24
  })
  afterEach(() => vi.useRealTimers())

  it('returns 7 days starting Monday', () => {
    const days = getWeekDays([])
    expect(days).toHaveLength(7)
    expect(days[0].dayName).toBe('Mon')
    expect(days[6].dayName).toBe('Sun')
  })

  it('marks practiced days', () => {
    const days = getWeekDays(['2026-05-21'])
    expect(days.find(d => d.dateStr === '2026-05-21').practiced).toBe(true)
  })

  it('marks today correctly', () => {
    const days = getWeekDays([])
    expect(days.find(d => d.dateStr === '2026-05-24').isToday).toBe(true)
  })

  it('marks future days', () => {
    const days = getWeekDays([])
    // May 24 is Sunday so no future days in this week
    expect(days.every(d => !d.isFuture || d.dateStr > '2026-05-24')).toBe(true)
  })
})

describe('getDaysInMonth', () => {
  it('returns null-padded array starting on correct weekday (Mon-based)', () => {
    // May 2026: May 1 is a Friday → 4 null pads (Mon=0, Fri=4)
    const days = getDaysInMonth(2026, 4)
    expect(days[0]).toBeNull()
    expect(days[4]).toBeInstanceOf(Date)
    expect(days[4].getDate()).toBe(1)
  })
})

describe('getMilestones', () => {
  it('maps dateLearned to song title', () => {
    const history = [
      { title: 'Way Maker', dateLearned: '2026-04-28', status: 'learned' },
    ]
    expect(getMilestones(history)).toEqual({ '2026-04-28': 'Way Maker' })
  })

  it('returns empty object for empty history', () => {
    expect(getMilestones([])).toEqual({})
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

```bash
npm run test:run -- src/test/dates.test.js
```

Expected: FAIL — `Cannot find module '../utils/dates'`

- [ ] **Step 7: Create src/utils/dates.js**

```javascript
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function today() {
  return formatDate(new Date())
}

export function getStreakCount(practiceDays) {
  if (!practiceDays.length) return 0
  const todayStr = today()
  const practiced = new Set(practiceDays)
  const cursor = new Date()

  if (!practiced.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1)
    if (!practiced.has(formatDate(cursor))) return 0
  }

  let streak = 0
  while (practiced.has(formatDate(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getWeekDays(practiceDays) {
  const practiced = new Set(practiceDays)
  const now = new Date()
  const todayStr = today()
  const dow = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)

  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = formatDate(d)
    return {
      dateStr,
      dayName,
      practiced: practiced.has(dateStr),
      isToday: dateStr === todayStr,
      isFuture: d > now && dateStr !== todayStr,
    }
  })
}

export function getDaysInMonth(year, month) {
  const days = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7 // Mon=0, Sun=6
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

export function getMilestones(songHistory) {
  return songHistory.reduce((acc, song) => {
    if (song.dateLearned) acc[song.dateLearned] = song.title
    return acc
  }, {})
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npm run test:run -- src/test/dates.test.js src/test/storage.test.js
```

Expected: PASS — all tests

- [ ] **Step 9: Commit**

```bash
git add src/utils/ src/test/storage.test.js src/test/dates.test.js
git commit -m "feat: add storage and date utility modules with tests"
```

---

## Task 3: useAppData Hook

**Files:**
- Create: `src/hooks/useAppData.js`, `src/test/useAppData.test.js`

- [ ] **Step 1: Write failing hook tests**

Create `src/test/useAppData.test.js`:

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppData } from '../hooks/useAppData'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 4, 24))
})
afterEach(() => vi.useRealTimers())

describe('useAppData', () => {
  it('initializes with empty defaults', () => {
    const { result } = renderHook(() => useAppData())
    expect(result.current.practiceDays).toEqual([])
    expect(result.current.currentSong).toBeNull()
    expect(result.current.songHistory).toEqual([])
    expect(result.current.streak).toBe(0)
  })

  it('togglePracticeDay adds a date', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.togglePracticeDay('2026-05-24'))
    expect(result.current.practiceDays).toContain('2026-05-24')
    expect(result.current.streak).toBe(1)
  })

  it('togglePracticeDay removes an existing date', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.togglePracticeDay('2026-05-24'))
    act(() => result.current.togglePracticeDay('2026-05-24'))
    expect(result.current.practiceDays).not.toContain('2026-05-24')
  })

  it('setCurrentSong updates currentSong', () => {
    const { result } = renderHook(() => useAppData())
    const song = { title: 'Goodness of God', artist: 'Bethel Music', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }
    act(() => result.current.setCurrentSong(song))
    expect(result.current.currentSong).toEqual(song)
  })

  it('markSongLearned moves currentSong to history with dateLearned', () => {
    const { result } = renderHook(() => useAppData())
    const song = { title: 'Goodness of God', artist: 'Bethel Music', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }
    act(() => result.current.setCurrentSong(song))
    act(() => result.current.markSongLearned())
    expect(result.current.currentSong).toBeNull()
    expect(result.current.songHistory[0].dateLearned).toBe('2026-05-24')
    expect(result.current.songHistory[0].status).toBe('learned')
  })

  it('markSongLearned is a no-op when no current song', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.markSongLearned())
    expect(result.current.songHistory).toEqual([])
  })

  it('persists data to localStorage', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.togglePracticeDay('2026-05-24'))
    const stored = JSON.parse(localStorage.getItem('guitarApp'))
    expect(stored.practiceDays).toContain('2026-05-24')
  })

  it('loads persisted data on mount', () => {
    localStorage.setItem('guitarApp', JSON.stringify({
      practiceDays: ['2026-05-23', '2026-05-24'],
      currentSong: null,
      songHistory: [],
    }))
    const { result } = renderHook(() => useAppData())
    expect(result.current.streak).toBe(2)
  })

  it('weekDays reflects current week', () => {
    const { result } = renderHook(() => useAppData())
    expect(result.current.weekDays).toHaveLength(7)
    expect(result.current.weekDays[6].isToday).toBe(true) // May 24 is Sunday
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- src/test/useAppData.test.js
```

Expected: FAIL — `Cannot find module '../hooks/useAppData'`

- [ ] **Step 3: Create src/hooks/useAppData.js**

```javascript
import { useState, useEffect, useCallback } from 'react'
import { loadData, saveData, isStorageAvailable } from '../utils/storage'
import { today, getStreakCount, getWeekDays } from '../utils/dates'

const DEFAULT_DATA = {
  practiceDays: [],
  currentSong: null,
  songHistory: [],
}

export function useAppData() {
  const [data, setData] = useState(() => ({ ...DEFAULT_DATA, ...loadData() }))
  const [storageAvailable] = useState(isStorageAvailable)

  useEffect(() => {
    saveData(data)
  }, [data])

  const togglePracticeDay = useCallback((dateStr) => {
    setData(prev => ({
      ...prev,
      practiceDays: prev.practiceDays.includes(dateStr)
        ? prev.practiceDays.filter(d => d !== dateStr)
        : [...prev.practiceDays, dateStr],
    }))
  }, [])

  const setCurrentSong = useCallback((song) => {
    setData(prev => ({ ...prev, currentSong: song }))
  }, [])

  const markSongLearned = useCallback(() => {
    setData(prev => {
      if (!prev.currentSong) return prev
      const learned = { ...prev.currentSong, dateLearned: today(), status: 'learned' }
      return { ...prev, currentSong: null, songHistory: [learned, ...prev.songHistory] }
    })
  }, [])

  return {
    practiceDays: data.practiceDays,
    currentSong: data.currentSong,
    songHistory: data.songHistory,
    storageAvailable,
    streak: getStreakCount(data.practiceDays),
    weekDays: getWeekDays(data.practiceDays),
    togglePracticeDay,
    setCurrentSong,
    markSongLearned,
  }
}
```

- [ ] **Step 4: Run all tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all tests across all test files

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAppData.js src/test/useAppData.test.js
git commit -m "feat: add useAppData hook with localStorage persistence"
```

---

## Task 4: Dashboard Page

**Files:**
- Create: `src/components/StreakBar.jsx`, `src/components/StreakCounter.jsx`, `src/components/LogPracticeButton.jsx`, `src/components/SongCard.jsx`, `src/components/StorageBanner.jsx`, `src/pages/Dashboard.jsx`
- Create: `src/test/StreakBar.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing StreakBar test**

Create `src/test/StreakBar.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StreakBar from '../components/StreakBar'

const WEEK = [
  { dateStr: '2026-05-18', dayName: 'Mon', practiced: true, isToday: false, isFuture: false },
  { dateStr: '2026-05-19', dayName: 'Tue', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-20', dayName: 'Wed', practiced: true, isToday: false, isFuture: false },
  { dateStr: '2026-05-21', dayName: 'Thu', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-22', dayName: 'Fri', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-23', dayName: 'Sat', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-24', dayName: 'Sun', practiced: false, isToday: true, isFuture: false },
]

describe('StreakBar', () => {
  it('renders all 7 day labels', () => {
    render(<StreakBar weekDays={WEEK} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('marks practiced days with aria-label', () => {
    render(<StreakBar weekDays={WEEK} />)
    const practiced = screen.getAllByLabelText(/practiced/)
    expect(practiced).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- src/test/StreakBar.test.jsx
```

Expected: FAIL — `Cannot find module '../components/StreakBar'`

- [ ] **Step 3: Create src/components/StreakBar.jsx**

```jsx
export default function StreakBar({ weekDays }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {weekDays.map(day => (
        <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div
            aria-label={day.practiced ? `${day.dayName} practiced` : `${day.dayName} not practiced`}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: day.practiced
                ? 'var(--green)'
                : day.isFuture
                  ? '#333'
                  : 'var(--surface2)',
              border: day.isToday ? '2px solid var(--accent2)' : '2px solid transparent',
              opacity: day.isFuture ? 0.4 : 1,
            }}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{day.dayName}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/test/StreakBar.test.jsx
```

Expected: PASS

- [ ] **Step 5: Create src/components/StreakCounter.jsx**

```jsx
const MILESTONES = [7, 30, 100]

export default function StreakCounter({ streak }) {
  const earned = MILESTONES.filter(m => streak >= m)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, fontWeight: 700, color: streak > 0 ? 'var(--accent2)' : 'var(--text-muted)' }}>
        {streak}
      </div>
      <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>day streak</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {MILESTONES.map(m => (
          <span
            key={m}
            title={`${m}-day milestone`}
            style={{
              padding: '2px 10px',
              borderRadius: 12,
              fontSize: 12,
              background: earned.includes(m) ? 'var(--accent2)' : 'var(--surface2)',
              color: earned.includes(m) ? '#000' : 'var(--text-muted)',
            }}
          >
            {m}d
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create src/components/LogPracticeButton.jsx**

```jsx
import { today } from '../utils/dates'

export default function LogPracticeButton({ practiceDays, togglePracticeDay }) {
  const todayStr = today()
  const logged = practiceDays.includes(todayStr)
  return (
    <button
      onClick={() => togglePracticeDay(todayStr)}
      style={{
        padding: '14px 32px',
        fontSize: 18,
        fontWeight: 700,
        background: logged ? 'var(--green)' : 'var(--accent)',
        color: '#fff',
        borderRadius: 'var(--radius)',
        transition: 'background 0.2s',
      }}
    >
      {logged ? '✓ Practiced Today' : 'Log Practice'}
    </button>
  )
}
```

- [ ] **Step 7: Create src/components/SongCard.jsx**

```jsx
const STATUS_LABEL = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  learned: 'Learned',
}

const STATUS_COLOR = {
  not_started: 'var(--text-muted)',
  in_progress: 'var(--accent2)',
  learned: 'var(--green)',
}

export default function SongCard({ song }) {
  if (!song) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        No current song — head to Songs to add one.
      </div>
    )
  }
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>This Month</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{song.title}</div>
      <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{song.artist}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        {song.key && <span style={{ background: 'var(--surface2)', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>Key of {song.key}</span>}
        <span style={{ color: STATUS_COLOR[song.status] || 'var(--text-muted)', fontSize: 13 }}>
          {STATUS_LABEL[song.status] || song.status}
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create src/components/StorageBanner.jsx**

```jsx
export default function StorageBanner({ available }) {
  if (available) return null
  return (
    <div style={{ background: '#7a3a00', color: '#fff', padding: '8px 16px', textAlign: 'center', fontSize: 14 }}>
      Your data can't be saved in this browser session.
    </div>
  )
}
```

- [ ] **Step 9: Create src/pages/Dashboard.jsx**

```jsx
import { useAppData } from '../hooks/useAppData'
import StreakBar from '../components/StreakBar'
import StreakCounter from '../components/StreakCounter'
import LogPracticeButton from '../components/LogPracticeButton'
import SongCard from '../components/SongCard'
import StorageBanner from '../components/StorageBanner'

export default function Dashboard() {
  const { practiceDays, currentSong, streak, weekDays, togglePracticeDay, storageAvailable } = useAppData()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <StorageBanner available={storageAvailable} />
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontWeight: 400 }}>This Week</h2>
        <StreakBar weekDays={weekDays} />
      </section>
      <section style={{ textAlign: 'center' }}>
        <StreakCounter streak={streak} />
        <div style={{ marginTop: 24 }}>
          <LogPracticeButton practiceDays={practiceDays} togglePracticeDay={togglePracticeDay} />
        </div>
      </section>
      <section>
        <h2 style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontWeight: 400 }}>Current Song</h2>
        <SongCard song={currentSong} />
      </section>
    </div>
  )
}
```

- [ ] **Step 10: Wire Dashboard into App.jsx**

Edit `src/App.jsx` — replace the import and route:

```jsx
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<div>Calendar</div>} />
          <Route path="/songs" element={<div>Songs</div>} />
          <Route path="/theory" element={<div>Theory</div>} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 11: Run all tests**

```bash
npm run test:run
```

Expected: PASS — all tests

- [ ] **Step 12: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Confirm: streak bar shows Mon–Sun, Log Practice button works, streak increments, current song shows placeholder.

- [ ] **Step 13: Commit**

```bash
git add src/components/ src/pages/Dashboard.jsx src/App.jsx src/test/StreakBar.test.jsx
git commit -m "feat: add Dashboard page with streak bar, counter, and practice logging"
```

---

## Task 5: Calendar Page

**Files:**
- Create: `src/components/CalendarGrid.jsx`, `src/pages/Calendar.jsx`, `src/test/CalendarGrid.test.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing CalendarGrid test**

Create `src/test/CalendarGrid.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalendarGrid from '../components/CalendarGrid'

const noop = () => {}

describe('CalendarGrid', () => {
  it('renders day-of-week headers', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={noop} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('renders the 1st of the month', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={noop} />)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
  })

  it('calls onToggle with date string when a past day is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    // Render May 2026; day 1 is in the past relative to May 24
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={onToggle} today="2026-05-24" />)
    const dayOne = screen.getAllByText('1').find(el => el.closest('button'))
    if (dayOne) {
      await user.click(dayOne.closest('button'))
      expect(onToggle).toHaveBeenCalledWith('2026-05-01')
    }
  })

  it('marks practiced days visually', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={['2026-05-10']} milestones={{}} onToggle={noop} today="2026-05-24" />)
    expect(screen.getByLabelText('May 10 practiced')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm run test:run -- src/test/CalendarGrid.test.jsx
```

Expected: FAIL — `Cannot find module '../components/CalendarGrid'`

- [ ] **Step 3: Create src/components/CalendarGrid.jsx**

```jsx
import { getDaysInMonth, formatDate, today as getToday } from '../utils/dates'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarGrid({ year, month, practiceDays, milestones, onToggle, today: todayProp }) {
  const todayStr = todayProp || getToday()
  const practiced = new Set(practiceDays)
  const days = getDaysInMonth(year, month)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} />
          const dateStr = formatDate(d)
          const isPracticed = practiced.has(dateStr)
          const isMilestone = !!milestones[dateStr]
          const isFuture = dateStr > todayStr
          const isToday = dateStr === todayStr
          const label = `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}${isPracticed ? ' practiced' : ''}`
          return (
            <button
              key={dateStr}
              aria-label={label}
              onClick={() => !isFuture && onToggle(dateStr)}
              disabled={isFuture}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius)',
                background: isPracticed ? 'var(--green)' : 'var(--surface)',
                border: isToday ? '2px solid var(--accent2)' : '2px solid transparent',
                color: isFuture ? 'var(--text-muted)' : 'var(--text)',
                opacity: isFuture ? 0.3 : 1,
                cursor: isFuture ? 'default' : 'pointer',
                position: 'relative',
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: 4,
              }}
            >
              {d.getDate()}
              {isMilestone && (
                <span title={milestones[dateStr]} style={{ fontSize: 8, color: 'var(--accent2)' }}>★</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/test/CalendarGrid.test.jsx
```

Expected: PASS

- [ ] **Step 5: Create src/pages/Calendar.jsx**

```jsx
import { useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import CalendarGrid from '../components/CalendarGrid'
import { getMilestones } from '../utils/dates'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const { practiceDays, songHistory, togglePracticeDay } = useAppData()
  const milestones = getMilestones(songHistory)

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={prev} style={{ background: 'var(--surface2)', color: 'var(--text)', padding: '8px 16px' }}>‹</button>
        <h2 style={{ margin: 0 }}>{MONTHS[month]} {year}</h2>
        <button onClick={next} style={{ background: 'var(--surface2)', color: 'var(--text)', padding: '8px 16px' }}>›</button>
      </div>
      <CalendarGrid
        year={year}
        month={month}
        practiceDays={practiceDays}
        milestones={milestones}
        onToggle={togglePracticeDay}
      />
      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--green)', marginRight: 6 }}>■</span>Practice day
        <span style={{ color: 'var(--accent2)', marginLeft: 16, marginRight: 6 }}>★</span>Song learned
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Wire Calendar into App.jsx**

Edit `src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/songs" element={<div>Songs</div>} />
          <Route path="/theory" element={<div>Theory</div>} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 7: Run all tests**

```bash
npm run test:run
```

Expected: PASS — all tests

- [ ] **Step 8: Verify in browser — navigate to `/calendar`, toggle practice days, confirm month navigation**

- [ ] **Step 9: Commit**

```bash
git add src/components/CalendarGrid.jsx src/pages/Calendar.jsx src/test/CalendarGrid.test.jsx src/App.jsx
git commit -m "feat: add Calendar page with monthly grid and practice/milestone markers"
```

---

## Task 6: Song Tracker Page

**Files:**
- Create: `src/components/SongForm.jsx`, `src/components/SongHistory.jsx`, `src/pages/Songs.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/components/SongForm.jsx**

```jsx
import { useState } from 'react'
import { today } from '../utils/dates'

const KEYS = ['C','D♭','D','E♭','E','F','F♯/G♭','G','A♭','A','B♭','B']
const STATUS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
]

export default function SongForm({ onSave }) {
  const [form, setForm] = useState({
    title: '', artist: '', key: 'G', dateStarted: today(), youtubeUrl: '', tabUrl: '', status: 'in_progress',
  })
  const [error, setError] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Song title is required.'); return }
    setError('')
    onSave({ ...form, title: form.title.trim(), artist: form.artist.trim() })
  }

  const inputStyle = { width: '100%', marginTop: 4 }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ margin: 0 }}>Add Song</h3>
      {error && <div style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</div>}
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Title *</div>
        <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="Goodness of God" />
      </label>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Artist</div>
        <input style={inputStyle} value={form.artist} onChange={set('artist')} placeholder="Bethel Music" />
      </label>
      <div style={{ display: 'flex', gap: 16 }}>
        <label style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Key</div>
          <select style={inputStyle} value={form.key} onChange={set('key')}>
            {KEYS.map(k => <option key={k}>{k}</option>)}
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</div>
          <select style={inputStyle} value={form.status} onChange={set('status')}>
            {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>YouTube URL (optional)</div>
        <input style={inputStyle} value={form.youtubeUrl} onChange={set('youtubeUrl')} placeholder="https://youtube.com/..." type="url" />
      </label>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tab URL (optional)</div>
        <input style={inputStyle} value={form.tabUrl} onChange={set('tabUrl')} placeholder="https://ultimate-guitar.com/..." type="url" />
      </label>
      <button type="submit" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 24px', fontWeight: 600, fontSize: 15 }}>
        Save Song
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create src/components/SongHistory.jsx**

```jsx
const STATUS_COLOR = { learned: 'var(--green)', in_progress: 'var(--accent2)', not_started: 'var(--text-muted)' }

export default function SongHistory({ songs }) {
  if (!songs.length) return <p style={{ color: 'var(--text-muted)' }}>No songs learned yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {songs.map((s, i) => (
        <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.artist}{s.key ? ` · Key of ${s.key}` : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Started {s.dateStarted}{s.dateLearned ? ` · Learned ${s.dateLearned}` : ''}
            </div>
          </div>
          <span style={{ color: STATUS_COLOR[s.status] || 'var(--text-muted)', fontSize: 13 }}>✓ Learned</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create src/pages/Songs.jsx**

```jsx
import { useAppData } from '../hooks/useAppData'
import SongForm from '../components/SongForm'
import SongHistory from '../components/SongHistory'

export default function Songs() {
  const { currentSong, songHistory, setCurrentSong, markSongLearned } = useAppData()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Current Song</h2>
        {currentSong ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{currentSong.title}</div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{currentSong.artist}</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {currentSong.key && <span style={{ background: 'var(--surface2)', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>Key of {currentSong.key}</span>}
              {currentSong.youtubeUrl && <a href={currentSong.youtubeUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>YouTube ↗</a>}
              {currentSong.tabUrl && <a href={currentSong.tabUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>Tab ↗</a>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={markSongLearned}
                style={{ background: 'var(--green)', color: '#fff', padding: '10px 24px', fontWeight: 600 }}
              >
                Mark as Learned ✓
              </button>
              <button
                onClick={() => setCurrentSong(null)}
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)', padding: '10px 24px' }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <SongForm onSave={setCurrentSong} />
        )}
      </section>
      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Song History</h2>
        <SongHistory songs={songHistory} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Wire Songs into App.jsx**

Edit `src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Songs from './pages/Songs'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/theory" element={<div>Theory</div>} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Run all tests**

```bash
npm run test:run
```

Expected: PASS — all tests

- [ ] **Step 6: Verify in browser**

Navigate to `/songs`. Add a song, confirm it appears as the current song. Click "Mark as Learned" — confirm it moves to history and a ★ appears on today's date in the calendar.

- [ ] **Step 7: Commit**

```bash
git add src/components/SongForm.jsx src/components/SongHistory.jsx src/pages/Songs.jsx src/App.jsx
git commit -m "feat: add Song Tracker page with add, mark learned, and history"
```

---

## Task 7: Theory — Circle of Fifths

**Files:**
- Create: `src/components/CircleOfFifths.jsx`

The Circle of Fifths is an interactive SVG. 12 major keys sit on the outer ring, 12 relative minors on the inner ring, positioned at 30° increments clockwise starting from C at the top.

- [ ] **Step 1: Create src/components/CircleOfFifths.jsx**

```jsx
import { useState } from 'react'

const MAJOR = ['C','G','D','A','E','B','F♯/G♭','D♭','A♭','E♭','B♭','F']
const MINOR = ['Am','Em','Bm','F♯m','C♯m','G♯m','E♭m','B♭m','Fm','Cm','Gm','Dm']
const DIATONIC = {
  C:  ['C','Dm','Em','F','G','Am','Bdim'],
  G:  ['G','Am','Bm','C','D','Em','F♯dim'],
  D:  ['D','Em','F♯m','G','A','Bm','C♯dim'],
  A:  ['A','Bm','C♯m','D','E','F♯m','G♯dim'],
  E:  ['E','F♯m','G♯m','A','B','C♯m','D♯dim'],
  B:  ['B','C♯m','D♯m','E','F♯','G♯m','A♯dim'],
  'F♯/G♭': ['F♯','G♯m','A♯m','B','C♯','D♯m','E♯dim'],
  'D♭': ['D♭','E♭m','Fm','G♭','A♭','B♭m','Cdim'],
  'A♭': ['A♭','B♭m','Cm','D♭','E♭','Fm','Gdim'],
  'E♭': ['E♭','Fm','Gm','A♭','B♭','Cm','Ddim'],
  'B♭': ['B♭','Cm','Dm','E♭','F','Gm','Adim'],
  F:  ['F','Gm','Am','B♭','C','Dm','Edim'],
}

function polarToXY(angleDeg, r, cx, cy) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ArcSegment({ cx, cy, r1, r2, startAngle, endAngle, fill, stroke, onClick, children }) {
  const mid = (startAngle + endAngle) / 2
  const p1 = polarToXY(startAngle, r1, cx, cy)
  const p2 = polarToXY(endAngle, r1, cx, cy)
  const p3 = polarToXY(endAngle, r2, cx, cy)
  const p4 = polarToXY(startAngle, r2, cx, cy)
  const d = `M${p1.x},${p1.y} A${r1},${r1} 0 0,1 ${p2.x},${p2.y} L${p3.x},${p3.y} A${r2},${r2} 0 0,0 ${p4.x},${p4.y} Z`
  const label = polarToXY(mid, (r1 + r2) / 2, cx, cy)
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#fff" pointerEvents="none">
        {children}
      </text>
    </g>
  )
}

export default function CircleOfFifths() {
  const [selected, setSelected] = useState(null)
  const cx = 200, cy = 200, size = 400
  const outerR = 170, innerR = 115, coreR = 80

  function handleSelect(key) {
    setSelected(prev => prev === key ? null : key)
  }

  const selectedIdx = selected ? MAJOR.indexOf(selected) : -1

  return (
    <div>
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
        {MAJOR.map((key, i) => {
          const angle = i * 30
          const isSelected = selected === key
          const isRelated = selectedIdx >= 0 && (
            i === selectedIdx ||
            i === (selectedIdx + 1) % 12 ||
            i === (selectedIdx + 11) % 12
          )
          return (
            <g key={key}>
              <ArcSegment
                cx={cx} cy={cy}
                r1={outerR} r2={innerR}
                startAngle={angle - 14} endAngle={angle + 14}
                fill={isSelected ? 'var(--accent)' : isRelated ? 'var(--surface2)' : '#1e3a5f'}
                stroke="#0a1628"
                onClick={() => handleSelect(key)}
              >
                {key}
              </ArcSegment>
              <ArcSegment
                cx={cx} cy={cy}
                r1={innerR} r2={coreR}
                startAngle={angle - 14} endAngle={angle + 14}
                fill={isSelected ? '#7a1f30' : isRelated ? '#2a3a5f' : '#162940'}
                stroke="#0a1628"
                onClick={() => handleSelect(key)}
              >
                {MINOR[i]}
              </ArcSegment>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={coreR} fill="var(--surface)" stroke="#0a1628" strokeWidth={2} />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={13} fill="var(--text-muted)">Circle</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fill="var(--text-muted)">of Fifths</text>
      </svg>

      {selected && (
        <div style={{ marginTop: 16, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{selected} major — {MINOR[MAJOR.indexOf(selected)]} relative minor</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Diatonic chords:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(DIATONIC[selected] || []).map((chord, i) => (
              <span key={i} style={{ background: 'var(--surface2)', padding: '4px 12px', borderRadius: 12, fontSize: 13 }}>
                {['I','ii','iii','IV','V','vi','vii°'][i]} — {chord}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run all tests (no new test for SVG — visual component)**

```bash
npm run test:run
```

Expected: PASS — all existing tests

- [ ] **Step 3: Commit**

```bash
git add src/components/CircleOfFifths.jsx
git commit -m "feat: add interactive Circle of Fifths SVG component"
```

---

## Task 8: Theory — Chord Charts, Progressions, Scale Diagram, Theory Page

**Files:**
- Create: `src/components/ChordCharts.jsx`, `src/components/WorshipProgressions.jsx`, `src/components/ScaleDiagram.jsx`, `src/pages/Theory.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create src/components/ChordCharts.jsx**

Chord data format: `[s6, s5, s4, s3, s2, s1]` where each value is fret number (0=open, -1=muted). `barre` indicates a barre position.

```jsx
const CHORDS = [
  { name: 'G',     frets: [3,2,0,0,0,3] },
  { name: 'D',     frets: [-1,-1,0,2,3,2] },
  { name: 'Em',    frets: [0,2,2,0,0,0] },
  { name: 'Cadd9', frets: [-1,3,2,0,3,3] },
  { name: 'A',     frets: [-1,0,2,2,2,0] },
  { name: 'E',     frets: [0,2,2,1,0,0] },
  { name: 'Am',    frets: [-1,0,2,2,1,0] },
  { name: 'Bm',    frets: [-1,2,4,4,3,2] },
]

function ChordDiagram({ name, frets }) {
  const fretted = frets.filter(f => f > 0)
  const minFret = fretted.length ? Math.min(...fretted) : 1
  const maxFret = fretted.length ? Math.max(...fretted) : 4
  const displayFrets = Math.max(4, maxFret - minFret + 1)
  const offset = fretted.length ? minFret - 1 : 0

  const W = 80, H = 90, padL = 14, padT = 16
  const strW = (W - padL) / 5
  const fretH = (H - padT) / displayFrets

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={W + 10} height={H + 24}>
        {/* Nut or fret offset label */}
        {offset === 0
          ? <line x1={padL} y1={padT} x2={W + 4} y2={padT} stroke="var(--text)" strokeWidth={3} />
          : <text x={2} y={padT + fretH / 2} fontSize={9} fill="var(--text-muted)">{offset + 1}fr</text>
        }
        {/* Fret lines */}
        {Array.from({ length: displayFrets }, (_, i) => (
          <line key={i} x1={padL} y1={padT + (i + 1) * fretH} x2={W + 4} y2={padT + (i + 1) * fretH} stroke="#444" strokeWidth={1} />
        ))}
        {/* Strings */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={padL + i * strW} y1={padT} x2={padL + i * strW} y2={padT + displayFrets * fretH} stroke="#555" strokeWidth={1} />
        ))}
        {/* Dots and mutes */}
        {frets.map((fret, i) => {
          const x = padL + i * strW
          if (fret === -1) return <text key={i} x={x} y={padT - 4} textAnchor="middle" fontSize={10} fill="var(--text-muted)">×</text>
          if (fret === 0) return <text key={i} x={x} y={padT - 4} textAnchor="middle" fontSize={10} fill="var(--text-muted)">○</text>
          const y = padT + (fret - offset - 0.5) * fretH
          return <circle key={i} cx={x} cy={y} r={6} fill="var(--accent2)" />
        })}
      </svg>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: -4 }}>{name}</div>
    </div>
  )
}

export default function ChordCharts() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 16 }}>Open Chords</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {CHORDS.map(c => <ChordDiagram key={c.name} {...c} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/WorshipProgressions.jsx**

```jsx
const KEYS = [
  { key: 'G', chords: ['G', 'D', 'Em', 'Cadd9'] },
  { key: 'D', chords: ['D', 'A', 'Bm', 'G'] },
  { key: 'A', chords: ['A', 'E', 'F♯m', 'D'] },
  { key: 'E', chords: ['E', 'B', 'C♯m', 'A'] },
  { key: 'C', chords: ['C', 'G', 'Am', 'F'] },
]
const NUMERALS = ['I', 'V', 'vi', 'IV']

export default function WorshipProgressions() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 16 }}>I – V – vi – IV (Common Worship Progression)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KEYS.map(({ key, chords }) => (
          <div key={key} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 700, width: 24, color: 'var(--accent2)' }}>{key}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {chords.map((chord, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{NUMERALS[i]}</div>
                  <div style={{ background: 'var(--surface2)', padding: '4px 14px', borderRadius: 8, fontWeight: 600 }}>{chord}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/components/ScaleDiagram.jsx**

Shows the major scale pattern across 5 frets on all 6 strings, rooted on the 6th string. Pattern is relative (root shown in accent color).

```jsx
// Major scale pattern: root on string 6 at fret 0 (relative)
// Each entry: [string index 0=high e, fret offset]  — string 0=low E (index 0)
// Pattern for C major starting at fret 8 (example), but we show relative positions.
// Interval pattern per string (from low E): 
//   E: R, 2, 3  (0, 2, 4)
//   A: 4, 5, 6  (0, 2, 4) shifted by 5 semitones -> (0, 2, 4) but shifted
// Let's do a simple box: show major scale across strings with dots

const STRINGS = ['E','A','D','G','B','e']
// Relative fret positions for each string in major scale box (position 1, low E root)
// String: [fret offsets from nut position]
const SCALE_DOTS = [
  // string index (0=low E), fret positions relative to root
  { s: 0, f: [0, 2, 4] },  // E: R, 2, 3
  { s: 1, f: [0, 2, 4] },  // A: 4, 5, 6 -> offset 5 -> but relative: 0, 2, 4
  { s: 2, f: [1, 2, 4] },  // D: 7 -> offset 10 -> rel: 1, 2, 4  (actually 2, 4, 6 semitones above A string 4th)
  { s: 3, f: [1, 3, 4] },
  { s: 4, f: [0, 2, 4] },
  { s: 5, f: [0, 2] },
]
// Root dots (those at scale degree 1)
const ROOTS = [
  { s: 0, f: 0 },
  { s: 1, f: 0 },
  { s: 2, f: 2 },  // octave root on D string
  { s: 5, f: 0 },
]

const FRETS = 5
const W = 300, H = 120
const padL = 28, padT = 16
const strH = (H - padT) / 5
const fretW = (W - padL) / (FRETS - 1)

function isRoot(s, f) {
  return ROOTS.some(r => r.s === s && r.f === f)
}

export default function ScaleDiagram() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 8 }}>Major Scale — Box Pattern 1</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        Root (orange) on the 6th string. Slide this shape to any fret to play in that key.
      </p>
      <svg width={W + 20} height={H + 24}>
        {/* String labels */}
        {STRINGS.map((s, i) => (
          <text key={s} x={padL - 6} y={padT + i * strH + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">{s}</text>
        ))}
        {/* Fret labels */}
        {Array.from({ length: FRETS }, (_, i) => (
          <text key={i} x={padL + i * fretW} y={H + 18} textAnchor="middle" fontSize={10} fill="var(--text-muted)">{i === 0 ? 'Root' : `+${i}`}</text>
        ))}
        {/* Strings */}
        {STRINGS.map((_, i) => (
          <line key={i} x1={padL} y1={padT + i * strH} x2={W + 4} y2={padT + i * strH} stroke="#555" strokeWidth={1} />
        ))}
        {/* Fret lines */}
        {Array.from({ length: FRETS }, (_, i) => (
          <line key={i} x1={padL + i * fretW} y1={padT} x2={padL + i * fretW} y2={padT + 5 * strH} stroke="#444" strokeWidth={i === 0 ? 3 : 1} />
        ))}
        {/* Scale dots */}
        {SCALE_DOTS.flatMap(({ s, f }) =>
          f.map(fret => (
            <circle
              key={`${s}-${fret}`}
              cx={padL + fret * fretW}
              cy={padT + s * strH}
              r={8}
              fill={isRoot(s, fret) ? 'var(--accent2)' : 'var(--surface2)'}
              stroke={isRoot(s, fret) ? 'var(--accent2)' : '#888'}
              strokeWidth={1}
            />
          ))
        )}
      </svg>
    </div>
  )
}
```

- [ ] **Step 4: Create src/pages/Theory.jsx**

```jsx
import CircleOfFifths from '../components/CircleOfFifths'
import ChordCharts from '../components/ChordCharts'
import WorshipProgressions from '../components/WorshipProgressions'
import ScaleDiagram from '../components/ScaleDiagram'

const sections = [
  { id: 'circle', label: 'Circle of Fifths' },
  { id: 'chords', label: 'Chord Charts' },
  { id: 'progressions', label: 'Worship Progressions' },
  { id: 'scale', label: 'Scale Diagram' },
]

export default function Theory() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {sections.map(s => (
          <a key={s.id} href={`#${s.id}`} style={{ background: 'var(--surface2)', padding: '6px 14px', borderRadius: 20, fontSize: 13, color: 'var(--text)' }}>
            {s.label}
          </a>
        ))}
      </nav>
      <section id="circle">
        <h2 style={{ fontWeight: 400, color: 'var(--text-muted)', marginBottom: 24 }}>Circle of Fifths</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Click a key to see its diatonic chords and relative minor.</p>
        <CircleOfFifths />
      </section>
      <section id="chords">
        <ChordCharts />
      </section>
      <section id="progressions">
        <WorshipProgressions />
      </section>
      <section id="scale">
        <ScaleDiagram />
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Wire Theory into App.jsx**

Replace `src/App.jsx` with final version:

```jsx
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Songs from './pages/Songs'
import Theory from './pages/Theory'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/theory" element={<Theory />} />
        </Routes>
      </main>
    </div>
  )
}
```

- [ ] **Step 6: Run all tests**

```bash
npm run test:run
```

Expected: PASS — all tests

- [ ] **Step 7: Verify in browser**

Visit `/theory`. Confirm: Circle of Fifths renders, clicking a key highlights it and shows diatonic chords. Chord chart SVGs display correctly. Progression table shows all 5 keys. Scale diagram renders.

- [ ] **Step 8: Commit**

```bash
git add src/components/ChordCharts.jsx src/components/WorshipProgressions.jsx src/components/ScaleDiagram.jsx src/pages/Theory.jsx src/App.jsx
git commit -m "feat: add Theory page with Circle of Fifths, chord charts, progressions, scale diagram"
```

---

## Task 9: Final Polish and Build Verification

**Files:**
- Modify: `src/styles/index.css` (minor additions)

- [ ] **Step 1: Run full test suite**

```bash
npm run test:run
```

Expected: PASS — all tests

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Output in `dist/`.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Walk through all four pages and verify:
- Dashboard: streak bar, log practice button, song card
- Calendar: month grid, prev/next navigation, practice days toggle
- Songs: add a song, mark as learned, view in history
- Theory: circle of fifths interaction, chord charts, progressions, scale diagram

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete guitar learning platform MVP"
```
