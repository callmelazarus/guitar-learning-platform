import { useState } from 'react'
import { today } from '../utils/dates'

const KEYS = ['C','D♭','D','E♭','E','F','F♯/G♭','G','A♭','A','B♭','B']
const STATUS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
]

export default function SongForm({ onSave }) {
  const [form, setForm] = useState({
    title: '', artist: '', key: 'G', dateStarted: today(), youtubeUrl: '', tabUrl: '', status: 'in_progress',
  })
  const [error, setError] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Song title is required.'); return }
    setError('')
    onSave({ ...form, title: form.title.trim(), artist: form.artist.trim() })
  }

  const inputStyle = { width: '100%', marginTop: 4 }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ margin: 0 }}>Add Song</h3>
      {error && <div style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</div>}
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Title *</div>
        <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="Goodness of God" />
      </label>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Artist</div>
        <input style={inputStyle} value={form.artist} onChange={set('artist')} placeholder="Bethel Music" />
      </label>
      <div style={{ display: 'flex', gap: 16 }}>
        <label style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Key</div>
          <select style={inputStyle} value={form.key} onChange={set('key')}>
            {KEYS.map(k => <option key={k}>{k}</option>)}
          </select>
        </label>
        <label style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</div>
          <select style={inputStyle} value={form.status} onChange={set('status')}>
            {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>YouTube URL (optional)</div>
        <input style={inputStyle} value={form.youtubeUrl} onChange={set('youtubeUrl')} placeholder="https://youtube.com/..." type="url" />
      </label>
      <label>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tab URL (optional)</div>
        <input style={inputStyle} value={form.tabUrl} onChange={set('tabUrl')} placeholder="https://ultimate-guitar.com/..." type="url" />
      </label>
      <button type="submit" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 24px', fontWeight: 600, fontSize: 15 }}>
        Save Song
      </button>
    </form>
  )
}
