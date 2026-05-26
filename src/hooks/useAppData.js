import { useState, useEffect, useRef, useCallback } from 'react'
import { loadData, saveData, isStorageAvailable } from '../utils/storage'
import { today, getStreakCount, getWeekDays } from '../utils/dates'

const DEFAULT_DATA = {
  practiceDays: [],
  activeSongs: [],
  songHistory: [],
}

function migrate(raw) {
  if (!raw) return DEFAULT_DATA
  if ('currentSong' in raw && !('activeSongs' in raw)) {
    const { currentSong, ...rest } = raw
    return {
      ...DEFAULT_DATA,
      ...rest,
      activeSongs: currentSong ? [{ ...currentSong, id: String(Date.now()) }] : [],
    }
  }
  return { ...DEFAULT_DATA, ...raw }
}

export function useAppData() {
  const [data, setData] = useState(() => migrate(loadData()))
  const [storageAvailable] = useState(isStorageAvailable)

  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return }
    saveData(data)
  }, [data])

  const togglePracticeDay = useCallback((dateStr) => {
    if (dateStr > today()) return
    setData(prev => ({
      ...prev,
      practiceDays: prev.practiceDays.includes(dateStr)
        ? prev.practiceDays.filter(d => d !== dateStr)
        : [...prev.practiceDays, dateStr],
    }))
  }, [])

  const addSong = useCallback((song) => {
    setData(prev => ({
      ...prev,
      activeSongs: [...prev.activeSongs, { ...song, id: String(Date.now()) }],
    }))
  }, [])

  const markSongLearned = useCallback((id) => {
    setData(prev => {
      const song = prev.activeSongs.find(s => s.id === id)
      if (!song) return prev
      const learned = { ...song, dateLearned: today(), status: 'learned' }
      return {
        ...prev,
        activeSongs: prev.activeSongs.filter(s => s.id !== id),
        songHistory: [learned, ...prev.songHistory],
      }
    })
  }, [])

  const removeSong = useCallback((id) => {
    setData(prev => ({
      ...prev,
      activeSongs: prev.activeSongs.filter(s => s.id !== id),
    }))
  }, [])

  return {
    practiceDays: data.practiceDays,
    activeSongs: data.activeSongs,
    songHistory: data.songHistory,
    storageAvailable,
    streak: getStreakCount(data.practiceDays),
    weekDays: getWeekDays(data.practiceDays),
    togglePracticeDay,
    addSong,
    markSongLearned,
    removeSong,
  }
}
