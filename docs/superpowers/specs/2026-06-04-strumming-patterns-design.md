# Strumming Patterns Reference Library

**Date:** 2026-06-04
**Status:** Approved

## Overview

Add a dedicated Strumming Patterns page to the Guitar Practice Tracker — a static reference library of 5 beginner-focused strum patterns, each with a beat-grid diagram and worship song examples. No user data is stored; this is a pure reference feature.

## Routing & Navigation

- New route: `/strumming` added to `App.jsx`
- New nav link: "Strumming" added to `NavBar.jsx`
- New page: `src/pages/Strumming.jsx`

## Data

A static array in `src/data/strummingPatterns.js`. No localStorage involvement.

Each pattern object:

```js
{
  id: string,          // kebab-case slug
  name: string,        // display name
  notation: string,    // shorthand string, e.g. "D D U"
  beats: (string|null)[], // 8 slots: 'D', 'U', or null — maps to 1 & 2 & 3 & 4 &
  description: string, // one sentence for beginners
  songs: string[]      // 2–3 worship song examples
}
```

### The 5 patterns

| # | Name | Notation | Beats (1 & 2 & 3 & 4 &) |
|---|------|----------|--------------------------|
| 1 | All Down | D D D D | D · D · D · D · |
| 2 | Down-Down-Up | D D U | D · D · · U · · |
| 3 | D-DU-UDU | D DU UDU | D · D U U D U · |
| 4 | D-DU D-DU | D DU D DU | D · D U D · D U |
| 5 | Slow Ballad | D - - U - D U | D · · U · D U · |

## Components

### `src/data/strummingPatterns.js`
Static array of the 5 pattern objects above.

### `src/pages/Strumming.jsx`
Page component. Renders a heading ("Strumming Patterns") and maps over the pattern data to render a `StrummingPattern` card for each.

### `src/components/StrummingPattern.jsx`
Card component. Receives a single pattern object and renders:
- Pattern name and notation shorthand
- `StrummingDiagram` SVG
- Description sentence
- Song examples list

### `src/components/StrummingDiagram.jsx`
SVG component. Renders an 8-cell beat grid:
- Top row: beat labels (`1`, `&`, `2`, `&`, `3`, `&`, `4`, `&`)
- Bottom row: ↓ arrow, ↑ arrow, or empty for each slot
- Style consistent with existing `ChordDiagram.jsx` (same stroke colors, font sizes)

## Visual layout (per card)

```
┌──────────────────────────────────────────┐
│ All Down                    D D D D      │
│ [1]  [&]  [2]  [&]  [3]  [&]  [4]  [&] │
│  ↓         ↓         ↓         ↓        │
│ The simplest pattern — one down strum    │
│ per beat. Great for your first song.     │
│ Songs: 10,000 Reasons · Amazing Grace   │
└──────────────────────────────────────────┘
```

## What's not included

- Animation or playback (can be added later)
- Attaching patterns to songs in the tracker (future feature)
- Time signature variants beyond 4/4
