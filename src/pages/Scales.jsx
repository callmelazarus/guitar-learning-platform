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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ROOTS.map(r => (
              <button
                key={r}
                onClick={() => setRoots(prev => ({ ...prev, [scale.id]: r }))}
                style={{
                  padding: '5px 11px',
                  fontSize: 13,
                  fontWeight: roots[scale.id] === r ? 700 : 400,
                  background: roots[scale.id] === r ? 'var(--accent2)' : 'var(--surface2)',
                  color: roots[scale.id] === r ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <ScaleBoxDiagram scaleId={scale.id} root={roots[scale.id]} />
          </div>
        </section>
      ))}
    </div>
  )
}
