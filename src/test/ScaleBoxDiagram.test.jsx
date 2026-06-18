import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ScaleBoxDiagram from '../components/ScaleBoxDiagram'

describe('ScaleBoxDiagram', () => {
  it('renders an svg with all 6 string labels', () => {
    const { container, getByText } = render(<ScaleBoxDiagram scaleId="major" root="E" />)
    expect(container.querySelector('svg')).toBeTruthy()
    ;['E', 'A', 'D', 'G', 'B', 'e'].forEach(label => {
      expect(getByText(label)).toBeInTheDocument()
    })
  })

  it('labels the first fret column "open" when rooted at E', () => {
    const { getByText } = render(<ScaleBoxDiagram scaleId="major" root="E" />)
    expect(getByText('open')).toBeInTheDocument()
  })

  it('labels the first fret column with its absolute fret number when rooted elsewhere', () => {
    const { getByText } = render(<ScaleBoxDiagram scaleId="major" root="G" />)
    expect(getByText('3')).toBeInTheDocument()
  })
})
