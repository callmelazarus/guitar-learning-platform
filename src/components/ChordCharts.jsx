import ChordDiagram from './ChordDiagram'

const CHORDS = [
  { name: 'G',     frets: [3,2,0,0,0,3] },
  { name: 'D',     frets: [-1,-1,0,2,3,2] },
  { name: 'Em',    frets: [0,2,2,0,0,0] },
  { name: 'Cadd9', frets: [-1,3,2,0,3,3] },
  { name: 'A',     frets: [-1,0,2,2,2,0] },
  { name: 'E',     frets: [0,2,2,1,0,0] },
  { name: 'Am',    frets: [-1,0,2,2,1,0] },
  { name: 'Bm',    frets: [-1,2,4,4,3,2] },
]

export default function ChordCharts() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 16 }}>Open Chords</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {CHORDS.map(c => <ChordDiagram key={c.name} {...c} />)}
      </div>
    </div>
  )
}
