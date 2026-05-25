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
