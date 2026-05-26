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
    expect(result.current.activeSongs).toEqual([])
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

  it('addSong adds a song with a generated id', () => {
    const { result } = renderHook(() => useAppData())
    const song = { title: 'Goodness of God', artist: 'Bethel Music', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }
    act(() => result.current.addSong(song))
    expect(result.current.activeSongs).toHaveLength(1)
    expect(result.current.activeSongs[0].title).toBe('Goodness of God')
    expect(result.current.activeSongs[0].id).toBeDefined()
  })

  it('addSong supports multiple active songs', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.addSong({ title: 'Song A', artist: '', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }))
    act(() => result.current.addSong({ title: 'Song B', artist: '', key: 'D', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }))
    expect(result.current.activeSongs).toHaveLength(2)
  })

  it('markSongLearned moves song to history with dateLearned', () => {
    const { result } = renderHook(() => useAppData())
    const song = { title: 'Goodness of God', artist: 'Bethel Music', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }
    act(() => result.current.addSong(song))
    const id = result.current.activeSongs[0].id
    act(() => result.current.markSongLearned(id))
    expect(result.current.activeSongs).toHaveLength(0)
    expect(result.current.songHistory[0].dateLearned).toBe('2026-05-24')
    expect(result.current.songHistory[0].status).toBe('learned')
  })

  it('markSongLearned is a no-op for unknown id', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.markSongLearned('nonexistent'))
    expect(result.current.songHistory).toEqual([])
  })

  it('removeSong removes from activeSongs without archiving', () => {
    const { result } = renderHook(() => useAppData())
    act(() => result.current.addSong({ title: 'Song A', artist: '', key: 'G', dateStarted: '2026-05-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' }))
    const id = result.current.activeSongs[0].id
    act(() => result.current.removeSong(id))
    expect(result.current.activeSongs).toHaveLength(0)
    expect(result.current.songHistory).toHaveLength(0)
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
      activeSongs: [],
      songHistory: [],
    }))
    const { result } = renderHook(() => useAppData())
    expect(result.current.streak).toBe(2)
  })

  it('migrates old currentSong format to activeSongs', () => {
    localStorage.setItem('guitarApp', JSON.stringify({
      practiceDays: [],
      currentSong: { title: 'Way Maker', artist: 'Sinach', key: 'D', dateStarted: '2026-04-01', youtubeUrl: '', tabUrl: '', status: 'in_progress' },
      songHistory: [],
    }))
    const { result } = renderHook(() => useAppData())
    expect(result.current.activeSongs).toHaveLength(1)
    expect(result.current.activeSongs[0].title).toBe('Way Maker')
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
