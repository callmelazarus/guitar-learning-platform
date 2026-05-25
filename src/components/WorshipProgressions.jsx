const KEYS = [
  { key: 'G', chords: ['G', 'D', 'Em', 'Cadd9'] },
  { key: 'D', chords: ['D', 'A', 'Bm', 'G'] },
  { key: 'A', chords: ['A', 'E', 'F♯m', 'D'] },
  { key: 'E', chords: ['E', 'B', 'C♯m', 'A'] },
  { key: 'C', chords: ['C', 'G', 'Am', 'F'] },
]
const NUMERALS = ['I', 'V', 'vi', 'IV']

export default function WorshipProgressions() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 16 }}>I – V – vi – IV (Common Worship Progression)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {KEYS.map(({ key, chords }) => (
          <div key={key} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 700, width: 24, color: 'var(--accent2)' }}>{key}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {chords.map((chord, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{NUMERALS[i]}</div>
                  <div style={{ background: 'var(--surface2)', padding: '4px 14px', borderRadius: 8, fontWeight: 600 }}>{chord}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
