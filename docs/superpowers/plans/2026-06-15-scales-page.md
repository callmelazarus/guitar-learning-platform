# Scales Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new top-level "Scales" page showing 5 fundamental guitar scales (Major, Natural Minor, Major Pentatonic, Minor Pentatonic, Blues) as movable fretboard box diagrams, each with an independent root-note selector.

**Architecture:** Scale data (interval sets) lives in a plain data module. A pure utility module computes which frets on each of the 6 strings fall on a scale tone for a given root, generating the box shape from music theory instead of hand-typed fret tables. A new SVG component renders that shape (visually modeled on the existing `ScaleDiagram` component, but generic). A new page renders all 5 scales with their own root selectors. Routing/nav wire it up.

**Tech Stack:** React 18, react-router-dom, Vitest + @testing-library/react (existing project stack, no new dependencies).

Reference spec: `docs/superpowers/specs/2026-06-15-scales-page-design.md`

---

### Task 1: Scale interval data

**Files:**
- Create: `src/data/scales.js`
- Test: `src/test/scales.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { SCALES } from '../data/scales'

describe('SCALES', () => {
  it('has exactly 5 scales', () => {
    expect(SCALES).toHaveLength(5)
  })

  it('has unique ids', () => {
    const ids = SCALES.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes the 5 fundamental scales', () => {
    const ids = SCALES.map(s => s.id)
    expect(ids).toEqual(['major', 'natural-minor', 'major-pentatonic', 'minor-pentatonic', 'blues'])
  })

  it('each scale has a label, intervals starting at 0, and a blurb', () => {
    SCALES.forEach(s => {
      expect(typeof s.label).toBe('string')
      expect(s.intervals[0]).toBe(0)
      expect(typeof s.blurb).toBe('string')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/scales.test.js`
Expected: FAIL with "Failed to resolve import '../data/scales'" (or similar module-not-found error)

- [ ] **Step 3: Write the data module**

```js
export const SCALES = [
  {
    id: 'major',
    label: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    blurb: 'The foundation of Western music theory — a bright, resolved sound used in countless worship and pop songs.',
  },
  {
    id: 'natural-minor',
    label: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    blurb: 'The relative minor sound — darker and more introspective than the major scale.',
  },
  {
    id: 'major-pentatonic',
    label: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    blurb: 'A 5-note simplification of the major scale — easy to improvise with, no wrong notes.',
  },
  {
    id: 'minor-pentatonic',
    label: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    blurb: 'The backbone of rock and blues lead playing — the most-used scale shape on guitar.',
  },
  {
    id: 'blues',
    label: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    blurb: 'Minor pentatonic plus one extra "blue note" for a gritty, expressive edge.',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/scales.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/scales.js src/test/scales.test.js
git commit -m "feat: add fundamental scale interval data"
```

---

### Task 2: Scale fret-computation utility

**Files:**
- Create: `src/utils/scaleFrets.js`
- Test: `src/test/scaleFrets.test.js`

This is the core music-theory logic: given a root note and a scale's semitone intervals, compute which frets (within a 5-fret window starting where the root falls on the low E string) land on a scale tone, for each of the 6 strings.

- [ ] **Step 1: Write the failing tests**

```js
import { describe, it, expect } from 'vitest'
import { rootFret, buildScaleBox } from '../utils/scaleFrets'

describe('rootFret', () => {
  it('returns 0 for root E (open low E string)', () => {
    expect(rootFret('E')).toBe(0)
  })

  it('returns 3 for root G', () => {
    expect(rootFret('G')).toBe(3)
  })

  it('returns 8 for root C', () => {
    expect(rootFret('C')).toBe(8)
  })
})

describe('buildScaleBox', () => {
  const MAJOR = [0, 2, 4, 5, 7, 9, 11]
  const MINOR_PENTATONIC = [0, 3, 5, 7, 10]

  it('builds the major scale box rooted at E', () => {
    const box = buildScaleBox(MAJOR, 'E')
    expect(box[0].map(d => d.fret)).toEqual([0, 2, 4]) // E string
    expect(box[1].map(d => d.fret)).toEqual([0, 2, 4]) // A string
    expect(box[2].map(d => d.fret)).toEqual([1, 2, 4]) // D string
    expect(box[3].map(d => d.fret)).toEqual([1, 2, 4]) // G string
    expect(box[4].map(d => d.fret)).toEqual([0, 2, 4]) // B string
    expect(box[5].map(d => d.fret)).toEqual([0, 2, 4]) // e string
  })

  it('marks fret 0 as root on the E and e strings when rooted at E', () => {
    const box = buildScaleBox(MAJOR, 'E')
    expect(box[0].find(d => d.fret === 0).isRoot).toBe(true)
    expect(box[5].find(d => d.fret === 0).isRoot).toBe(true)
    expect(box[1].find(d => d.fret === 0).isRoot).toBe(false)
  })

  it('builds the minor pentatonic box rooted at E', () => {
    const box = buildScaleBox(MINOR_PENTATONIC, 'E')
    expect(box[0].map(d => d.fret)).toEqual([0, 3]) // E string
    expect(box[1].map(d => d.fret)).toEqual([0, 2]) // A string
    expect(box[2].map(d => d.fret)).toEqual([0, 2]) // D string
    expect(box[3].map(d => d.fret)).toEqual([0, 2, 4]) // G string
    expect(box[4].map(d => d.fret)).toEqual([0, 3]) // B string
    expect(box[5].map(d => d.fret)).toEqual([0, 3]) // e string
  })

  it('shifts the identical shape when rooted at G instead of E', () => {
    const e = buildScaleBox(MINOR_PENTATONIC, 'E').map(s => s.map(d => d.fret))
    const g = buildScaleBox(MINOR_PENTATONIC, 'G').map(s => s.map(d => d.fret))
    expect(g).toEqual(e) // shape is identical in relative terms, just at a different absolute fret
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/scaleFrets.test.js`
Expected: FAIL with "Failed to resolve import '../utils/scaleFrets'"

- [ ] **Step 3: Write the utility module**

```js
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Standard tuning, low E to high e
const OPEN_STRING_PITCHES = [4, 9, 2, 7, 11, 4]

const FRETS = 5

export function pitchClass(note) {
  return NOTE_NAMES.indexOf(note)
}

export function rootFret(root) {
  return ((pitchClass(root) - pitchClass('E')) % 12 + 12) % 12
}

export function buildScaleBox(intervals, root) {
  const rootPc = pitchClass(root)
  const scaleSet = new Set(intervals.map(iv => (rootPc + iv) % 12))
  const startFret = rootFret(root)

  return OPEN_STRING_PITCHES.map(openPitch => {
    const dots = []
    for (let fret = 0; fret < FRETS; fret++) {
      const pitch = (openPitch + startFret + fret) % 12
      if (scaleSet.has(pitch)) {
        dots.push({ fret, isRoot: pitch === rootPc })
      }
    }
    return dots
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/scaleFrets.test.js`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/utils/scaleFrets.js src/test/scaleFrets.test.js
git commit -m "feat: add scale fret-computation utility"
```

---

### Task 3: ScaleBoxDiagram component

**Files:**
- Create: `src/components/ScaleBoxDiagram.jsx`
- Test: `src/test/ScaleBoxDiagram.test.jsx`

Renders the box shape for one scale/root combination as an SVG fretboard, visually modeled on the existing `src/components/ScaleDiagram.jsx` (6 strings, 5-fret window, root dots highlighted in `var(--accent2)`). Does not modify `ScaleDiagram.jsx`.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ScaleBoxDiagram from '../components/ScaleBoxDiagram'

describe('ScaleBoxDiagram', () => {
  it('renders an svg with all 6 string labels', () => {
    const { container, getByText } = render(<ScaleBoxDiagram scaleId="major" root="E" />)
    expect(container.querySelector('svg')).toBeTruthy()
    ;['E', 'A', 'D', 'G', 'B', 'e'].forEach(label => {
      expect(getByText(label)).toBeInTheDocument()
    })
  })

  it('labels the first fret column "open" when rooted at E', () => {
    const { getByText } = render(<ScaleBoxDiagram scaleId="major" root="E" />)
    expect(getByText('open')).toBeInTheDocument()
  })

  it('labels the first fret column with its absolute fret number when rooted elsewhere', () => {
    const { getByText } = render(<ScaleBoxDiagram scaleId="major" root="G" />)
    expect(getByText('3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ScaleBoxDiagram.test.jsx`
Expected: FAIL with "Failed to resolve import '../components/ScaleBoxDiagram'"

- [ ] **Step 3: Write the component**

```jsx
import { SCALES } from '../data/scales'
import { buildScaleBox, rootFret } from '../utils/scaleFrets'

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e']
const FRETS = 5
const W = 300, H = 120
const padL = 28, padT = 16
const strH = (H - padT) / 5
const fretW = (W - padL) / (FRETS - 1)

export default function ScaleBoxDiagram({ scaleId, root }) {
  const scale = SCALES.find(s => s.id === scaleId)
  const box = buildScaleBox(scale.intervals, root)
  const startFret = rootFret(root)

  return (
    <svg width={W + 20} height={H + 24}>
      {STRINGS.map((s, i) => (
        <text key={s} x={padL - 6} y={padT + i * strH + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">{s}</text>
      ))}
      {Array.from({ length: FRETS }, (_, i) => (
        <text key={i} x={padL + i * fretW} y={H + 18} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
          {startFret + i === 0 ? 'open' : startFret + i}
        </text>
      ))}
      {STRINGS.map((_, i) => (
        <line key={i} x1={padL} y1={padT + i * strH} x2={W + 4} y2={padT + i * strH} stroke="#555" strokeWidth={1} />
      ))}
      {Array.from({ length: FRETS }, (_, i) => (
        <line
          key={i}
          x1={padL + i * fretW}
          y1={padT}
          x2={padL + i * fretW}
          y2={padT + 5 * strH}
          stroke="#444"
          strokeWidth={i === 0 && startFret === 0 ? 3 : 1}
        />
      ))}
      {box.flatMap((dots, s) =>
        dots.map(({ fret, isRoot }) => (
          <circle
            key={`${s}-${fret}`}
            cx={padL + fret * fretW}
            cy={padT + s * strH}
            r={8}
            fill={isRoot ? 'var(--accent2)' : 'var(--surface2)'}
            stroke={isRoot ? 'var(--accent2)' : '#888'}
            strokeWidth={1}
          />
        ))
      )}
    </svg>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/ScaleBoxDiagram.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ScaleBoxDiagram.jsx src/test/ScaleBoxDiagram.test.jsx
git commit -m "feat: add ScaleBoxDiagram component"
```

---

### Task 4: Scales page

**Files:**
- Create: `src/pages/Scales.jsx`
- Test: `src/test/Scales.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Scales from '../pages/Scales'

describe('Scales page', () => {
  it('renders all 5 scale headings', () => {
    render(<Scales />)
    expect(screen.getByText('Major')).toBeInTheDocument()
    expect(screen.getByText('Natural Minor')).toBeInTheDocument()
    expect(screen.getByText('Major Pentatonic')).toBeInTheDocument()
    expect(screen.getByText('Minor Pentatonic')).toBeInTheDocument()
    expect(screen.getByText('Blues')).toBeInTheDocument()
  })

  it('defaults every root selector to E', () => {
    render(<Scales />)
    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(5)
    selects.forEach(select => expect(select.value).toBe('E'))
  })

  it('changing one scale\'s root note does not affect the others', async () => {
    render(<Scales />)
    const selects = screen.getAllByRole('combobox')
    await userEvent.selectOptions(selects[0], 'G')
    expect(selects[0].value).toBe('G')
    expect(selects[1].value).toBe('E')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/Scales.test.jsx`
Expected: FAIL with "Failed to resolve import '../pages/Scales'"

- [ ] **Step 3: Write the page**

```jsx
import { useState } from 'react'
import { SCALES } from '../data/scales'
import ScaleBoxDiagram from '../components/ScaleBoxDiagram'

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function Scales() {
  const [roots, setRoots] = useState(() => Object.fromEntries(SCALES.map(s => [s.id, 'E'])))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {SCALES.map(scale => (
        <section key={scale.id}>
          <h2 style={{ fontWeight: 400, color: 'var(--text-muted)', marginBottom: 8 }}>{scale.label}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{scale.blurb}</p>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Root note:{' '}
            <select
              value={roots[scale.id]}
              onChange={e => setRoots(prev => ({ ...prev, [scale.id]: e.target.value }))}
              style={{ marginLeft: 8 }}
            >
              {ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <div style={{ marginTop: 12 }}>
            <ScaleBoxDiagram scaleId={scale.id} root={roots[scale.id]} />
          </div>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/Scales.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/Scales.jsx src/test/Scales.test.jsx
git commit -m "feat: add Scales page"
```

---

### Task 5: Wire up routing and nav

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/NavBar.jsx`

No new automated test for this task — it's pure wiring, verified manually in Step 3.

- [ ] **Step 1: Add the route**

In `src/App.jsx`, add the import and route:

```jsx
import Scales from './pages/Scales'
```

(add after the `import Strumming from './pages/Strumming'` line)

```jsx
<Route path="/scales" element={<Scales />} />
```

(add after the `<Route path="/strumming" element={<Strumming />} />` line)

- [ ] **Step 2: Add the nav link**

In `src/components/NavBar.jsx`, add to the `links` array (after the Theory entry):

```js
{ to: '/scales', label: 'Scales' },
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`

Open the printed local URL, click "Scales" in the nav bar, confirm:
- All 5 scales render with diagrams
- Changing a root-note dropdown shifts that scale's diagram to a different fret without affecting the other 4 scales

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: All tests PASS, including the new scale tests

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/NavBar.jsx
git commit -m "feat: wire Scales page into routing and nav"
```
