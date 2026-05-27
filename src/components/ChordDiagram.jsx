export default function ChordDiagram({ name, frets }) {
  const fretted = frets.filter(f => f > 0)
  const hasOpen = frets.some(f => f === 0)
  const minFret = fretted.length ? Math.min(...fretted) : 1
  const maxFret = fretted.length ? Math.max(...fretted) : 4
  const displayFrets = Math.max(4, maxFret - minFret + 1)
  const offset = (hasOpen || !fretted.length) ? 0 : minFret - 1

  const W = 80, H = 90, padL = 14, padT = 16
  const strW = (W - padL) / 5
  const fretH = (H - padT) / displayFrets

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={W + 10} height={H + 24}>
        {offset === 0
          ? <line x1={padL} y1={padT} x2={W + 4} y2={padT} stroke="var(--text)" strokeWidth={3} />
          : <text x={2} y={padT + fretH / 2} fontSize={9} fill="var(--text-muted)">{offset + 1}fr</text>
        }
        {Array.from({ length: displayFrets }, (_, i) => (
          <line key={i} x1={padL} y1={padT + (i + 1) * fretH} x2={W + 4} y2={padT + (i + 1) * fretH} stroke="#444" strokeWidth={1} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={padL + i * strW} y1={padT} x2={padL + i * strW} y2={padT + displayFrets * fretH} stroke="#555" strokeWidth={1} />
        ))}
        {frets.map((fret, i) => {
          const x = padL + i * strW
          if (fret === -1) return <text key={i} x={x} y={padT - 4} textAnchor="middle" fontSize={10} fill="var(--text-muted)">×</text>
          if (fret === 0) return <text key={i} x={x} y={padT - 4} textAnchor="middle" fontSize={10} fill="var(--text-muted)">○</text>
          const y = padT + (fret - offset - 0.5) * fretH
          return <circle key={i} cx={x} cy={y} r={6} fill="var(--accent2)" />
        })}
      </svg>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: -4 }}>{name}</div>
    </div>
  )
}
