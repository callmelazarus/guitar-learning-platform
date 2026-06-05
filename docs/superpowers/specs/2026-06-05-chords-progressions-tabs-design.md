# Chords Page: Chords / Progressions Tab Split

**Date:** 2026-06-05
**Status:** Approved

## Overview

Split the `/progressions` page (nav label "Chords") into two sub-tabs: a **Chords** tab showing advanced chord diagrams organized by category, and a **Progressions** tab containing the existing progression explorer unchanged.

## Changes

### `src/pages/Progressions.jsx`
- Add `tab` state: `'chords' | 'progressions'`
- Render a two-button tab switcher ("Chords" | "Progressions") at the top, using the same pill-button style already used for progression/key selectors
- Conditionally render either the Chords content or the existing Progressions content
- Add new fingerings to the existing `CHORD_SHAPES` object

### No other files change
- Theory page open chord charts stay untouched
- NavBar, routes, data files unchanged

## Chords Tab — Three Sections

Each section is a labeled row of `ChordDiagram` SVGs.

### Sus & Add9
| Chord | Frets (low E → high e) |
|-------|------------------------|
| Dsus2 | x x 0 2 3 0 |
| Dsus4 | x x 0 2 3 3 |
| Asus2 | x 0 2 2 0 0 |
| Asus4 | x 0 2 2 3 0 |
| Esus4 | 0 2 2 2 0 0 |

### Sevenths
| Chord | Frets |
|-------|-------|
| Gmaj7 | 3 2 0 0 0 2 |
| Dmaj7 | x x 0 2 2 2 |
| Fmaj7 | x 3 3 2 1 0 |
| Em7   | 0 2 2 0 3 0 |
| Am7   | x 0 2 0 1 0 |

### Slash Chords
| Chord | Frets |
|-------|-------|
| G/B   | x 2 0 0 0 3 |
| D/F#  | 2 0 0 2 3 2 |
| C/G   | 3 3 2 0 1 0 |
| Em/B  | x 2 2 0 0 0 |

## Progressions Tab
Existing content exactly as-is: progression selector (I–V–vi–IV, I–IV–V, I–vi–IV–V), key selector, chord diagrams, song examples.

## What stays on Theory page
Basic open chord charts (G, D, Em, Cadd9, A, E, Am, Bm) remain on Theory — not moved or removed.
