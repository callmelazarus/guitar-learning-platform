# Scales Page Design

## Goal

Add a new top-level "Scales" page presenting the 5 most fundamental guitar scales: Major, Natural Minor, Major Pentatonic, Minor Pentatonic, and Blues. Each scale is shown as a movable fretboard box pattern with a root-note selector that shifts the box to the chosen key.

## Non-goals

- No audio playback of scales.
- No finger numbering or alternate box positions (only one box shape per scale).
- No changes to the existing `ScaleDiagram` component or its usage on the Theory page.

## Data model

`src/data/scales.js` exports the 5 scales as semitone interval sets from the root, not hand-typed per-string fret tables:

```js
export const SCALES = [
  { id: 'major', label: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], blurb: '...' },
  { id: 'natural-minor', label: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], blurb: '...' },
  { id: 'major-pentatonic', label: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9], blurb: '...' },
  { id: 'minor-pentatonic', label: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], blurb: '...' },
  { id: 'blues', label: 'Blues', intervals: [0, 3, 5, 6, 7, 10], blurb: '...' },
]
```

Generating dots from intervals (rather than hand-typed fret tables like the existing `ScaleDiagram`) guarantees every shown dot is a real scale tone and avoids transcription errors. The resulting shape may include 1-2 extra notes per string compared to the "named" CAGED box diagrams guitarists memorize — accepted tradeoff.

## Fret computation

`src/utils/scaleFrets.js` — pure function(s), no React dependency:

- Standard tuning open-string pitch classes (low E to high e): `E=4, A=9, D=2, G=7, B=11, e=4` (C=0..B=11 chromatic numbering).
- `rootFret(rootNote)`: `(pitchClassOf(rootNote) - 4 + 12) % 12` — fret on the low E string where the root note falls.
- `buildScaleBox(intervals, rootNote)`: for a 5-fret window starting at `rootFret`, for each of the 6 strings, return the list of frets (0-4 relative) whose pitch class is in the scale's interval set relative to the root.

This function is fully testable in isolation: e.g. E major at root fret 0 should produce dots matching the existing major-scale box dots (verified by hand during design: E-string [0,2,4], A-string [0,2,4], D-string [1,2,4], G-string [1,2,4], B-string [0,2,4], e-string [0,2,4] — note the e-string differs slightly from the existing hand-typed `ScaleDiagram` pattern, which is expected and fine since these are separate components).

## Component

`src/components/ScaleBoxDiagram.jsx` — new component, modeled visually on the existing `ScaleDiagram.jsx` (same SVG fretboard rendering: 6 strings, 5 frets, root dots highlighted), but generic:

```jsx
<ScaleBoxDiagram scaleId="minor-pentatonic" root="E" />
```

Internally looks up the scale's intervals from `SCALES`, calls `buildScaleBox`, and renders. Root dots (frets where the pitch class equals the chosen root) are highlighted in the accent color, same as the existing diagram.

## Page

`src/pages/Scales.jsx` — renders all 5 scales in sequence. Each scale block has:

- Heading (scale label)
- One-line blurb
- A root-note `<select>` (12 chromatic notes: E, F, F#, G, G#, A, A#, B, C, C#, D, D#), defaulting to `E`, controlling that scale's own `root` state independently of the others
- `<ScaleBoxDiagram>` for that scale/root combination

## Routing & nav

- `src/App.jsx`: add `<Route path="/scales" element={<Scales />} />`
- `src/components/NavBar.jsx`: add `{ to: '/scales', label: 'Scales' }` to the `links` array, after Theory.

## Testing

- `src/test/scaleFrets.test.js`: unit tests for `buildScaleBox`/`rootFret` covering at least major and minor pentatonic at a couple of different roots (e.g. E open-position and a shifted root like G).
- `src/test/Scales.test.jsx`: render test confirming all 5 scale labels appear and that changing a root-note select re-renders without throwing.
