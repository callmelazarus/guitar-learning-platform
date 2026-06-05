import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StrummingPattern from '../components/StrummingPattern'

vi.mock('../utils/strumAudio', () => ({
  playPattern: vi.fn(() => vi.fn()),  // returns a stop function
}))

const PATTERN = {
  id: 'all-down',
  name: 'All Down',
  notation: 'D D D D',
  beats: ['D', null, 'D', null, 'D', null, 'D', null],
  description: 'One down strum on each beat.',
  songs: ['Amazing Grace', '10,000 Reasons'],
}

describe('StrummingPattern', () => {
  it('renders the pattern name', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    expect(screen.getByText('All Down')).toBeInTheDocument()
  })

  it('renders the notation shorthand', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    expect(screen.getByText('D D D D')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    expect(screen.getByText('One down strum on each beat.')).toBeInTheDocument()
  })

  it('renders song examples as links to Ultimate Guitar', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    const link = screen.getByRole('link', { name: 'Amazing Grace' })
    expect(link).toBeInTheDocument()
    expect(link.href).toContain('ultimate-guitar.com')
  })

  it('renders a play button', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('toggles to stop when play is clicked', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    fireEvent.click(screen.getByRole('button', { name: /play/i }))
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
  })

  it('toggles back to play when stop is clicked', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    fireEvent.click(screen.getByRole('button', { name: /play/i }))
    fireEvent.click(screen.getByRole('button', { name: /stop/i }))
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })
})
