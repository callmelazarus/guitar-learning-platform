import { useState } from 'react'
import { SCALES } from '../data/scales'
import ScaleBoxDiagram from '../components/ScaleBoxDiagram'

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function Scales() {
  const [roots, setRoots] = useState(() => Object.fromEntries(SCALES.map(s => [s.id, 'E'])))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {SCALES.map(scale => (
        <section key={scale.id}>
          <h2 style={{ fontWeight: 400, color: 'var(--text-muted)', marginBottom: 8 }}>{scale.label}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{scale.blurb}</p>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Root note:{' '}
            <select
              value={roots[scale.id]}
              onChange={e => setRoots(prev => ({ ...prev, [scale.id]: e.target.value }))}
              style={{ marginLeft: 8 }}
            >
              {ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <div style={{ marginTop: 12 }}>
            <ScaleBoxDiagram scaleId={scale.id} root={roots[scale.id]} />
          </div>
        </section>
      ))}
    </div>
  )
}
