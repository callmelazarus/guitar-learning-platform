import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Progressions from '../pages/Progressions'

describe('Progressions page', () => {
  it('shows all three chord sections', () => {
    render(<Progressions />)
    expect(screen.getByText('Sus & Add9')).toBeInTheDocument()
    expect(screen.getByText('Sevenths')).toBeInTheDocument()
    expect(screen.getByText('Slash Chords')).toBeInTheDocument()
  })

  it('shows a description for each chord section', () => {
    render(<Progressions />)
    expect(screen.getByText(/unresolved/i)).toBeInTheDocument()
    expect(screen.getByText(/dreamy/i)).toBeInTheDocument()
    expect(screen.getByText(/bass note/i)).toBeInTheDocument()
  })

  it('shows the progression explorer', () => {
    render(<Progressions />)
    expect(screen.getByText('I – V – vi – IV')).toBeInTheDocument()
  })
})
