import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StrummingPattern from '../components/StrummingPattern'

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

  it('renders all song examples', () => {
    render(<StrummingPattern pattern={PATTERN} />)
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument()
    expect(screen.getByText('10,000 Reasons')).toBeInTheDocument()
  })
})
