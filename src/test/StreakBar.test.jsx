import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StreakBar from '../components/StreakBar'

const WEEK = [
  { dateStr: '2026-05-18', dayName: 'Mon', practiced: true, isToday: false, isFuture: false },
  { dateStr: '2026-05-19', dayName: 'Tue', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-20', dayName: 'Wed', practiced: true, isToday: false, isFuture: false },
  { dateStr: '2026-05-21', dayName: 'Thu', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-22', dayName: 'Fri', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-23', dayName: 'Sat', practiced: false, isToday: false, isFuture: false },
  { dateStr: '2026-05-24', dayName: 'Sun', practiced: false, isToday: true, isFuture: false },
]

describe('StreakBar', () => {
  it('renders all 7 day labels', () => {
    render(<StreakBar weekDays={WEEK} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('marks practiced days with aria-label', () => {
    render(<StreakBar weekDays={WEEK} />)
    const practiced = screen.getAllByLabelText(/practiced/)
    expect(practiced).toHaveLength(2)
  })
})
