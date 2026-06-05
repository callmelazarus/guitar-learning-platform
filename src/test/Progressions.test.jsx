import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Progressions from '../pages/Progressions'

describe('Progressions page tabs', () => {
  it('renders Chords and Progressions tab buttons', () => {
    render(<Progressions />)
    expect(screen.getByRole('button', { name: 'Chords' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Progressions' })).toBeInTheDocument()
  })

  it('shows chord sections by default', () => {
    render(<Progressions />)
    expect(screen.getByText('Sus & Add9')).toBeInTheDocument()
    expect(screen.getByText('Sevenths')).toBeInTheDocument()
    expect(screen.getByText('Slash Chords')).toBeInTheDocument()
  })

  it('shows progression explorer when Progressions tab is clicked', () => {
    render(<Progressions />)
    fireEvent.click(screen.getByRole('button', { name: 'Progressions' }))
    expect(screen.getByText('I – V – vi – IV')).toBeInTheDocument()
  })

  it('returns to chord sections when Chords tab is clicked', () => {
    render(<Progressions />)
    fireEvent.click(screen.getByRole('button', { name: 'Progressions' }))
    fireEvent.click(screen.getByRole('button', { name: 'Chords' }))
    expect(screen.getByText('Sus & Add9')).toBeInTheDocument()
  })
})
