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

  it('defaults every root selector to E', () => {
    render(<Scales />)
    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(5)
    selects.forEach(select => expect(select.value).toBe('E'))
  })

  it('changing one scale\'s root note does not affect the others', async () => {
    render(<Scales />)
    const selects = screen.getAllByRole('combobox')
    await userEvent.selectOptions(selects[0], 'G')
    expect(selects[0].value).toBe('G')
    expect(selects[1].value).toBe('E')
  })
})
