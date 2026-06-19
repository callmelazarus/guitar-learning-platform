import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Scales from '../pages/Scales'

describe('Scales page', () => {
  it('renders all 5 scale headings', () => {
    render(<Scales />)
    expect(screen.getByText('Major')).toBeInTheDocument()
    expect(screen.getByText('Natural Minor')).toBeInTheDocument()
    expect(screen.getByText('Major Pentatonic')).toBeInTheDocument()
    expect(screen.getByText('Minor Pentatonic')).toBeInTheDocument()
    expect(screen.getByText('Blues')).toBeInTheDocument()
  })

  it('renders 12 root buttons per scale (60 total)', () => {
    render(<Scales />)
    expect(screen.getAllByRole('button')).toHaveLength(60)
  })

  it('changing one scale\'s root to G does not affect the others', async () => {
    render(<Scales />)
    const gButtons = screen.getAllByRole('button', { name: 'G' })
    await userEvent.click(gButtons[0])
    // first scale's G button should now be bold (fontWeight 700), others unchanged
    expect(gButtons[0]).toHaveStyle({ fontWeight: '700' })
    expect(gButtons[1]).not.toHaveStyle({ fontWeight: '700' })
  })
})
