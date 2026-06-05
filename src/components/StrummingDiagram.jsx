const BEAT_LABELS = ['1', '&', '2', '&', '3', '&', '4', '&']
const CELL_W = 32
const PAD = 8

export default function StrummingDiagram({ beats }) {
  const width = CELL_W * 8 + PAD * 2
  return (
    <svg width={width} height={52} aria-label="strumming pattern diagram">
      {BEAT_LABELS.map((label, i) => {
        const cx = PAD + i * CELL_W + CELL_W / 2
        return (
          <g key={i}>
            <text x={cx} y={16} textAnchor="middle" fontSize={11} fill="var(--text-muted)">{label}</text>
            {beats[i] === 'D' && <text x={cx} y={40} textAnchor="middle" fontSize={18} fill="var(--accent2)">↓</text>}
            {beats[i] === 'U' && <text x={cx} y={40} textAnchor="middle" fontSize={18} fill="var(--accent2)">↑</text>}
          </g>
        )
      })}
    </svg>
  )
}
