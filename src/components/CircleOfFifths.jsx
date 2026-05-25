import { useState } from 'react'

const MAJOR = ['C','G','D','A','E','B','F♯/G♭','D♭','A♭','E♭','B♭','F']
const MINOR = ['Am','Em','Bm','F♯m','C♯m','G♯m','E♭m','B♭m','Fm','Cm','Gm','Dm']
const DIATONIC = {
  C:  ['C','Dm','Em','F','G','Am','Bdim'],
  G:  ['G','Am','Bm','C','D','Em','F♯dim'],
  D:  ['D','Em','F♯m','G','A','Bm','C♯dim'],
  A:  ['A','Bm','C♯m','D','E','F♯m','G♯dim'],
  E:  ['E','F♯m','G♯m','A','B','C♯m','D♯dim'],
  B:  ['B','C♯m','D♯m','E','F♯','G♯m','A♯dim'],
  'F♯/G♭': ['F♯','G♯m','A♯m','B','C♯','D♯m','E♯dim'],
  'D♭': ['D♭','E♭m','Fm','G♭','A♭','B♭m','Cdim'],
  'A♭': ['A♭','B♭m','Cm','D♭','E♭','Fm','Gdim'],
  'E♭': ['E♭','Fm','Gm','A♭','B♭','Cm','Ddim'],
  'B♭': ['B♭','Cm','Dm','E♭','F','Gm','Adim'],
  F:  ['F','Gm','Am','B♭','C','Dm','Edim'],
}

function polarToXY(angleDeg, r, cx, cy) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function ArcSegment({ cx, cy, r1, r2, startAngle, endAngle, fill, stroke, onClick, children }) {
  const mid = (startAngle + endAngle) / 2
  const p1 = polarToXY(startAngle, r1, cx, cy)
  const p2 = polarToXY(endAngle, r1, cx, cy)
  const p3 = polarToXY(endAngle, r2, cx, cy)
  const p4 = polarToXY(startAngle, r2, cx, cy)
  const d = `M${p1.x},${p1.y} A${r1},${r1} 0 0,1 ${p2.x},${p2.y} L${p3.x},${p3.y} A${r2},${r2} 0 0,0 ${p4.x},${p4.y} Z`
  const label = polarToXY(mid, (r1 + r2) / 2, cx, cy)
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill="#fff" pointerEvents="none">
        {children}
      </text>
    </g>
  )
}

export default function CircleOfFifths() {
  const [selected, setSelected] = useState(null)
  const cx = 200, cy = 200, size = 400
  const outerR = 170, innerR = 115, coreR = 80

  function handleSelect(key) {
    setSelected(prev => prev === key ? null : key)
  }

  const selectedIdx = selected ? MAJOR.indexOf(selected) : -1

  return (
    <div>
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
        {MAJOR.map((key, i) => {
          const angle = i * 30
          const isSelected = selected === key
          const isRelated = selectedIdx >= 0 && (
            i === (selectedIdx + 1) % 12 ||
            i === (selectedIdx + 11) % 12
          )
          return (
            <g key={key}>
              <ArcSegment
                cx={cx} cy={cy}
                r1={outerR} r2={innerR}
                startAngle={angle - 14} endAngle={angle + 14}
                fill={isSelected ? 'var(--accent)' : isRelated ? 'var(--surface2)' : '#1e3a5f'}
                stroke="#0a1628"
                onClick={() => handleSelect(key)}
              >
                {key}
              </ArcSegment>
              <ArcSegment
                cx={cx} cy={cy}
                r1={innerR} r2={coreR}
                startAngle={angle - 14} endAngle={angle + 14}
                fill={isSelected ? 'var(--accent)' : isRelated ? 'var(--surface2)' : 'var(--surface)'}
                stroke="#0a1628"
                onClick={() => handleSelect(key)}
              >
                {MINOR[i]}
              </ArcSegment>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={coreR} fill="var(--surface)" stroke="#0a1628" strokeWidth={2} />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={13} fill="var(--text-muted)">Circle</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fill="var(--text-muted)">of Fifths</text>
      </svg>

      {selected && (
        <div style={{ marginTop: 16, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{selected} major — {MINOR[MAJOR.indexOf(selected)]} relative minor</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Diatonic chords:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(DIATONIC[selected] || []).map((chord, i) => (
              <span key={i} style={{ background: 'var(--surface2)', padding: '4px 12px', borderRadius: 12, fontSize: 13 }}>
                {['I','ii','iii','IV','V','vi','vii°'][i]} — {chord}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
