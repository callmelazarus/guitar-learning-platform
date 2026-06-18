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
