import { useState, useEffect, useRef, useCallback } from 'react'
import { loadData, saveData, isStorageAvailable } from '../utils/storage'
import { today, getStreakCount, getWeekDays } from '../utils/dates'

const DEFAULT_DATA = {
  practiceDays: [],
  currentSong: null,
  songHistory: [],
}

export function useAppData() {
  const [data, setData] = useState(() => ({ ...DEFAULT_DATA, ...loadData() }))
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

  const setCurrentSong = useCallback((song) => {
    setData(prev => ({ ...prev, currentSong: song }))
  }, [])

  const markSongLearned = useCallback(() => {
    setData(prev => {
      if (!prev.currentSong) return prev
      const learned = { ...prev.currentSong, dateLearned: today(), status: 'learned' }
      return { ...prev, currentSong: null, songHistory: [learned, ...prev.songHistory] }
    })
  }, [])

  return {
    practiceDays: data.practiceDays,
    currentSong: data.currentSong,
    songHistory: data.songHistory,
    storageAvailable,
    streak: getStreakCount(data.practiceDays),
    weekDays: getWeekDays(data.practiceDays),
    togglePracticeDay,
    setCurrentSong,
    markSongLearned,
  }
}
