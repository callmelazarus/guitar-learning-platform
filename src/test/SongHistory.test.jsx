import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SongHistory from '../components/SongHistory'

const songs = [
  { id: '1', title: 'Goodness of God', artist: 'Bethel Music', key: 'G', dateStarted: '2026-05-01', dateLearned: '2026-05-24', status: 'learned' },
  { id: '2', title: 'Way Maker', artist: 'Sinach', key: 'D', dateStarted: '2026-04-01', dateLearned: '2026-05-20', status: 'learned' },
]

it('renders learned songs', () => {
  render(<SongHistory songs={songs} />)
  expect(screen.getByText('Goodness of God')).toBeInTheDocument()
  expect(screen.getByText('Way Maker')).toBeInTheDocument()
})

it('renders no Undo buttons when onUndo is not provided', () => {
  render(<SongHistory songs={songs} />)
  expect(screen.queryAllByRole('button', { name: /undo/i })).toHaveLength(0)
})

it('renders one Undo button per song when onUndo is provided', () => {
  render(<SongHistory songs={songs} onUndo={vi.fn()} />)
  expect(screen.getAllByRole('button', { name: /undo/i })).toHaveLength(2)
})

it('calls onUndo with the song id when Undo is clicked', async () => {
  const onUndo = vi.fn()
  render(<SongHistory songs={songs} onUndo={onUndo} />)
  await userEvent.click(screen.getAllByRole('button', { name: /undo/i })[0])
  expect(onUndo).toHaveBeenCalledWith('1')
})

it('shows empty state message when no songs', () => {
  render(<SongHistory songs={[]} />)
  expect(screen.getByText(/no songs learned yet/i)).toBeInTheDocument()
})
