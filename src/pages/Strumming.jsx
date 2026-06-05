import StrummingPattern from '../components/StrummingPattern'
import { STRUMMING_PATTERNS } from '../data/strummingPatterns'

export default function Strumming() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Strumming Patterns</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
          Five essential patterns for beginners — start with All Down and work your way down.
        </p>
      </div>
      {STRUMMING_PATTERNS.map(pattern => (
        <StrummingPattern key={pattern.id} pattern={pattern} />
      ))}
    </div>
  )
}
