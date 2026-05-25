export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function today() {
  return formatDate(new Date())
}

export function getStreakCount(practiceDays) {
  if (!practiceDays.length) return 0
  const todayStr = today()
  const practiced = new Set(practiceDays)
  const cursor = new Date()

  if (!practiced.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1)
    if (!practiced.has(formatDate(cursor))) return 0
  }

  let streak = 0
  while (practiced.has(formatDate(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getWeekDays(practiceDays) {
  const practiced = new Set(practiceDays)
  const now = new Date()
  const todayStr = today()
  const dow = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)

  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = formatDate(d)
    return {
      dateStr,
      dayName,
      practiced: practiced.has(dateStr),
      isToday: dateStr === todayStr,
      isFuture: d > now && dateStr !== todayStr,
    }
  })
}

export function getDaysInMonth(year, month) {
  const days = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7 // Mon=0, Sun=6
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

export function getMilestones(songHistory) {
  return songHistory.reduce((acc, song) => {
    if (song.dateLearned) acc[song.dateLearned] = song.title
    return acc
  }, {})
}
