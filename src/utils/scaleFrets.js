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
        dots.push({ fret, isRoot: pitch === rootPc, note: NOTE_NAMES[pitch] })
      }
    }
    return dots
  })
}
