import { SCALES } from '../data/scales'
import { buildScaleBox, rootFret } from '../utils/scaleFrets'

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e']
const FRETS = 5
const W = 300, H = 120
const padL = 28, padT = 16
const strH = (H - padT) / 5
const fretW = (W - padL) / (FRETS - 1)

export default function ScaleBoxDiagram({ scaleId, root }) {
  const scale = SCALES.find(s => s.id === scaleId)
  const box = buildScaleBox(scale.intervals, root)
  const startFret = rootFret(root)

  return (
    <svg width={W + 20} height={H + 24}>
      {STRINGS.map((s, i) => (
        <text key={s} x={padL - 6} y={padT + i * strH + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">{s}</text>
      ))}
      {Array.from({ length: FRETS }, (_, i) => (
        <text key={i} x={padL + i * fretW} y={H + 18} textAnchor="middle" fontSize={14} fill="var(--text-muted)">
          {startFret + i === 0 ? 'open' : startFret + i}
        </text>
      ))}
      {STRINGS.map((_, i) => (
        <line key={i} x1={padL} y1={padT + i * strH} x2={W + 4} y2={padT + i * strH} stroke="#555" strokeWidth={1} />
      ))}
      {Array.from({ length: FRETS }, (_, i) => (
        <line
          key={i}
          x1={padL + i * fretW}
          y1={padT}
          x2={padL + i * fretW}
          y2={padT + 5 * strH}
          stroke="#444"
          strokeWidth={i === 0 && startFret === 0 ? 3 : 1}
        />
      ))}
      {box.flatMap((dots, s) =>
        dots.map(({ fret, isRoot, note }) => {
          const cx = padL + fret * fretW
          const cy = padT + s * strH
          return (
            <g key={`${s}-${fret}`}>
              <circle
                cx={cx}
                cy={cy}
                r={8}
                fill={isRoot ? 'var(--accent2)' : 'var(--surface2)'}
                stroke={isRoot ? 'var(--accent2)' : '#888'}
                strokeWidth={1}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={note.length > 1 ? 6 : 7}
                fontWeight="bold"
                fill={isRoot ? '#000' : 'var(--text)'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {note}
              </text>
            </g>
          )
        })
      )}
    </svg>
  )
}
