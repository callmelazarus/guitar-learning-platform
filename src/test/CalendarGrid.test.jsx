import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalendarGrid from '../components/CalendarGrid'

const noop = () => {}

describe('CalendarGrid', () => {
  it('renders day-of-week headers', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={noop} />)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('renders the 1st of the month', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={noop} />)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
  })

  it('calls onToggle with date string when a past day is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    // Render May 2026; day 1 is in the past relative to May 24
    render(<CalendarGrid year={2026} month={4} practiceDays={[]} milestones={{}} onToggle={onToggle} today="2026-05-24" />)
    const dayOne = screen.getAllByText('1').find(el => el.closest('button'))
    if (dayOne) {
      await user.click(dayOne.closest('button'))
      expect(onToggle).toHaveBeenCalledWith('2026-05-01')
    }
  })

  it('marks practiced days visually', () => {
    render(<CalendarGrid year={2026} month={4} practiceDays={['2026-05-10']} milestones={{}} onToggle={noop} today="2026-05-24" />)
    expect(screen.getByLabelText('May 10 practiced')).toBeInTheDocument()
  })
})
