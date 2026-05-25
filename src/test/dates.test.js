import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatDate, today, getStreakCount, getWeekDays, getDaysInMonth, getMilestones } from '../utils/dates'

describe('formatDate', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 4, 24))).toBe('2026-05-24')
  })
})

describe('getStreakCount', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 24)) // May 24
  })
  afterEach(() => vi.useRealTimers())

  it('returns 0 for empty array', () => {
    expect(getStreakCount([])).toBe(0)
  })

  it('returns 1 when only today is practiced', () => {
    expect(getStreakCount(['2026-05-24'])).toBe(1)
  })

  it('returns consecutive count including today', () => {
    expect(getStreakCount(['2026-05-22', '2026-05-23', '2026-05-24'])).toBe(3)
  })

  it('returns streak from yesterday when today not logged', () => {
    expect(getStreakCount(['2026-05-22', '2026-05-23'])).toBe(2)
  })

  it('returns 0 when streak is broken', () => {
    expect(getStreakCount(['2026-05-20', '2026-05-21'])).toBe(0)
  })

  it('ignores non-consecutive days beyond the streak', () => {
    expect(getStreakCount(['2026-05-01', '2026-05-23', '2026-05-24'])).toBe(2)
  })
})

describe('getWeekDays', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 24)) // Sunday May 24
  })
  afterEach(() => vi.useRealTimers())

  it('returns 7 days starting Monday', () => {
    const days = getWeekDays([])
    expect(days).toHaveLength(7)
    expect(days[0].dayName).toBe('Mon')
    expect(days[6].dayName).toBe('Sun')
  })

  it('marks practiced days', () => {
    const days = getWeekDays(['2026-05-21'])
    expect(days.find(d => d.dateStr === '2026-05-21').practiced).toBe(true)
  })

  it('marks today correctly', () => {
    const days = getWeekDays([])
    expect(days.find(d => d.dateStr === '2026-05-24').isToday).toBe(true)
  })

  it('marks future days', () => {
    vi.setSystemTime(new Date(2026, 4, 20)) // Wednesday May 20
    const days = getWeekDays([])
    // Thu May 21, Fri May 22, Sat May 23, Sun May 24 should all be future
    expect(days.find(d => d.dateStr === '2026-05-21').isFuture).toBe(true)
    expect(days.find(d => d.dateStr === '2026-05-24').isFuture).toBe(true)
    expect(days.find(d => d.dateStr === '2026-05-20').isFuture).toBe(false)
  })
})

describe('getDaysInMonth', () => {
  it('returns null-padded array starting on correct weekday (Mon-based)', () => {
    // May 2026: May 1 is a Friday → 4 null pads (Mon=0, Fri=4)
    const days = getDaysInMonth(2026, 4)
    expect(days[0]).toBeNull()
    expect(days[4]).toBeInstanceOf(Date)
    expect(days[4].getDate()).toBe(1)
  })
})

describe('getMilestones', () => {
  it('maps dateLearned to song title', () => {
    const history = [
      { title: 'Way Maker', dateLearned: '2026-04-28', status: 'learned' },
    ]
    expect(getMilestones(history)).toEqual({ '2026-04-28': 'Way Maker' })
  })

  it('returns empty object for empty history', () => {
    expect(getMilestones([])).toEqual({})
  })
})
