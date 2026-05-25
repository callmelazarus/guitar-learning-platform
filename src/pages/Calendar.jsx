import { useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import CalendarGrid from '../components/CalendarGrid'
import { getMilestones } from '../utils/dates'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const { practiceDays, songHistory, togglePracticeDay } = useAppData()
  const milestones = getMilestones(songHistory)

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={prev} style={{ background: 'var(--surface2)', color: 'var(--text)', padding: '8px 16px' }}>‹</button>
        <h2 style={{ margin: 0 }}>{MONTHS[month]} {year}</h2>
        <button onClick={next} style={{ background: 'var(--surface2)', color: 'var(--text)', padding: '8px 16px' }}>›</button>
      </div>
      <CalendarGrid
        year={year}
        month={month}
        practiceDays={practiceDays}
        milestones={milestones}
        onToggle={togglePracticeDay}
      />
      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--green)', marginRight: 6 }}>■</span>Practice day
        <span style={{ color: 'var(--accent2)', marginLeft: 16, marginRight: 6 }}>★</span>Song learned
      </div>
    </div>
  )
}
