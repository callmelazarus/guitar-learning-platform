const STRINGS = ['E','A','D','G','B','e']
const SCALE_DOTS = [
  { s: 0, f: [0, 2, 4] },
  { s: 1, f: [0, 2, 4] },
  { s: 2, f: [1, 2, 4] },
  { s: 3, f: [1, 3, 4] },
  { s: 4, f: [0, 2, 4] },
  { s: 5, f: [0, 2] },
]
const ROOTS = [
  { s: 0, f: 0 },
  { s: 1, f: 0 },
  { s: 2, f: 2 },
  { s: 5, f: 0 },
]

const FRETS = 5
const W = 300, H = 120
const padL = 28, padT = 16
const strH = (H - padT) / 5
const fretW = (W - padL) / (FRETS - 1)

function isRoot(s, f) {
  return ROOTS.some(r => r.s === s && r.f === f)
}

export default function ScaleDiagram() {
  return (
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontWeight: 400, marginBottom: 8 }}>Major Scale — Box Pattern 1</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        Root (orange) on the 6th string. Slide this shape to any fret to play in that key.
      </p>
      <svg width={W + 20} height={H + 24}>
        {STRINGS.map((s, i) => (
          <text key={s} x={padL - 6} y={padT + i * strH + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">{s}</text>
        ))}
        {Array.from({ length: FRETS }, (_, i) => (
          <text key={i} x={padL + i * fretW} y={H + 18} textAnchor="middle" fontSize={10} fill="var(--text-muted)">{i === 0 ? 'Root' : `+${i}`}</text>
        ))}
        {STRINGS.map((_, i) => (
          <line key={i} x1={padL} y1={padT + i * strH} x2={W + 4} y2={padT + i * strH} stroke="#555" strokeWidth={1} />
        ))}
        {Array.from({ length: FRETS }, (_, i) => (
          <line key={i} x1={padL + i * fretW} y1={padT} x2={padL + i * fretW} y2={padT + 5 * strH} stroke="#444" strokeWidth={i === 0 ? 3 : 1} />
        ))}
        {SCALE_DOTS.flatMap(({ s, f }) =>
          f.map(fret => (
            <circle
              key={`${s}-${fret}`}
              cx={padL + fret * fretW}
              cy={padT + s * strH}
              r={8}
              fill={isRoot(s, fret) ? 'var(--accent2)' : 'var(--surface2)'}
              stroke={isRoot(s, fret) ? 'var(--accent2)' : '#888'}
              strokeWidth={1}
            />
          ))
        )}
      </svg>
    </div>
  )
}
