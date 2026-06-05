import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StrummingDiagram from '../components/StrummingDiagram'

describe('StrummingDiagram', () => {
  it('renders all 8 beat labels', () => {
    render(<StrummingDiagram beats={['D', null, 'D', null, 'D', null, 'D', null]} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getAllByText('&')).toHaveLength(4)
  })

  it('renders a down arrow for each D beat', () => {
    render(<StrummingDiagram beats={['D', null, 'D', null, null, null, null, null]} />)
    expect(screen.getAllByText('↓')).toHaveLength(2)
  })

  it('renders an up arrow for each U beat', () => {
    render(<StrummingDiagram beats={[null, 'U', null, 'U', null, 'U', null, null]} />)
    expect(screen.getAllByText('↑')).toHaveLength(3)
  })

  it('renders no arrows for null beats', () => {
    render(<StrummingDiagram beats={[null, null, null, null, null, null, null, null]} />)
    expect(screen.queryAllByText('↓')).toHaveLength(0)
    expect(screen.queryAllByText('↑')).toHaveLength(0)
  })
})
