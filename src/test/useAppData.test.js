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

  it('togglePracticeDay ignores future dates', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.togglePracticeDay('2026-05-25')) // future relative to mocked May 24
    expect(result.current.practiceDays).not.toContain('2026-05-25')
  })
})
