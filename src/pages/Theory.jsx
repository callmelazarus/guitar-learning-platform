import CircleOfFifths from '../components/CircleOfFifths'
import ChordCharts from '../components/ChordCharts'
import WorshipProgressions from '../components/WorshipProgressions'
import ScaleDiagram from '../components/ScaleDiagram'

const sections = [
  { id: 'circle', label: 'Circle of Fifths' },
  { id: 'chords', label: 'Chord Charts' },
  { id: 'progressions', label: 'Worship Progressions' },
  { id: 'scale', label: 'Scale Diagram' },
]

export default function Theory() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {sections.map(s => (
          <a key={s.id} href={`#${s.id}`} style={{ background: 'var(--surface2)', padding: '6px 14px', borderRadius: 20, fontSize: 13, color: 'var(--text)' }}>
            {s.label}
          </a>
        ))}
      </nav>
      <section id="circle">
        <h2 style={{ fontWeight: 400, color: 'var(--text-muted)', marginBottom: 24 }}>Circle of Fifths</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Click a key to see its diatonic chords and relative minor.</p>
        <CircleOfFifths />
      </section>
      <section id="chords">
        <ChordCharts />
      </section>
      <section id="progressions">
        <WorshipProgressions />
      </section>
      <section id="scale">
        <ScaleDiagram />
      </section>
    </div>
  )
}
