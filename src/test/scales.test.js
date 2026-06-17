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
