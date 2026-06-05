import { useState } from 'react'
import ChordDiagram from '../components/ChordDiagram'
import { ugSearchUrl } from '../utils/ugUrl'

// frets: [low E, A, D, G, B, high e] — 0=open, -1=muted
const CHORD_SHAPES = {
  'G':     [3,2,0,0,0,3],
  'D':     [-1,-1,0,2,3,2],
  'Em':    [0,2,2,0,0,0],
  'Cadd9': [-1,3,2,0,3,3],
  'A':     [-1,0,2,2,2,0],
  'E':     [0,2,2,1,0,0],
  'Am':    [-1,0,2,2,1,0],
  'Bm':    [-1,2,4,4,3,2],
  'C':     [-1,3,2,0,1,0],
  'F':     [1,3,3,2,1,1],
  'B':     [-1,2,4,4,4,2],
  'F#m':   [2,4,4,2,2,2],
  'C#m':   [-1,4,6,6,5,4],
  // Sus & Add9
  'Dsus2': [-1,-1,0,2,3,0],
  'Dsus4': [-1,-1,0,2,3,3],
  'Asus2': [-1,0,2,2,0,0],
  'Asus4': [-1,0,2,2,3,0],
  'Esus4': [0,2,2,2,0,0],
  // Sevenths
  'Gmaj7': [3,2,0,0,0,2],
  'Dmaj7': [-1,-1,0,2,2,2],
  'Fmaj7': [-1,3,3,2,1,0],
  'Em7':   [0,2,2,0,3,0],
  'Am7':   [-1,0,2,0,1,0],
  // Slash chords
  'G/B':   [-1,2,0,0,0,3],
  'D/F#':  [2,0,0,2,3,2],
  'C/G':   [3,3,2,0,1,0],
  'Em/B':  [-1,2,2,0,0,0],
}

const CHORD_SECTIONS = [
  {
    label: 'Sus & Add9',
    description: 'Replace or add a note to a basic chord for an open, unresolved sound. That floating quality in modern worship comes from sus chords resolving back to the major.',
    chords: ['Dsus2', 'Dsus4', 'Asus2', 'Asus4', 'Esus4'],
  },
  {
    label: 'Sevenths',
    description: 'Add a 7th interval to a triad for warmth and color. Maj7 chords feel dreamy; m7 chords feel smooth. Usually just one finger different from a chord you already know.',
    chords: ['Gmaj7', 'Dmaj7', 'Fmaj7', 'Em7', 'Am7'],
  },
  {
    label: 'Slash Chords',
    description: 'The note after the slash is the bass note. G/B means a G chord with B in the bass. These create smooth stepwise bass movement when transitioning between chords.',
    chords: ['G/B', 'D/F#', 'C/G', 'Em/B'],
  },
]

const PROGRESSIONS = [
  {
    id: 'I-V-vi-IV',
    name: 'I – V – vi – IV',
    numerals: ['I', 'V', 'vi', 'IV'],
    keys: {
      G: { chords: ['G', 'D', 'Em', 'Cadd9'], songs: ['10,000 Reasons (Bless the Lord)', 'Good Good Father', 'The Stand'] },
      D: { chords: ['D', 'A', 'Bm', 'G'],     songs: ['How Great Is Our God', 'Cornerstone', 'Hosanna (Praise Is Rising)'] },
      A: { chords: ['A', 'E', 'F#m', 'D'],    songs: ['What a Beautiful Name', 'Desert Song', 'Praise Before My Breakthrough'] },
      E: { chords: ['E', 'B', 'C#m', 'A'],    songs: ['King of Kings', 'The Blessing', 'Oceans (Where Feet May Fail)'] },
      C: { chords: ['C', 'G', 'Am', 'F'],     songs: ['As the Deer', 'Come Now Is the Time to Worship', 'Mighty to Save'] },
    },
  },
  {
    id: 'I-IV-V',
    name: 'I – IV – V',
    numerals: ['I', 'IV', 'V'],
    keys: {
      G: { chords: ['G', 'C', 'D'],   songs: ['Shout to the Lord', 'Lord Reign in Me', 'Blessed Be Your Name (bridge)'] },
      D: { chords: ['D', 'G', 'A'],   songs: ['Lord I Lift Your Name on High', 'I Will Follow'] },
      A: { chords: ['A', 'D', 'E'],   songs: ['Great Are You Lord', 'This Is Amazing Grace'] },
      E: { chords: ['E', 'A', 'B'],   songs: ['In Christ Alone', 'How Deep the Father\'s Love for Us'] },
      C: { chords: ['C', 'F', 'G'],   songs: ['Better Is One Day', 'Come Thou Fount (contemporary)'] },
    },
  },
  {
    id: 'I-vi-IV-V',
    name: 'I – vi – IV – V',
    numerals: ['I', 'vi', 'IV', 'V'],
    keys: {
      G: { chords: ['G', 'Em', 'C', 'D'],    songs: ['Amazing Grace (My Chains Are Gone)', 'Revelation Song'] },
      D: { chords: ['D', 'Bm', 'G', 'A'],    songs: ['Blessed Be Your Name', 'Forever (We Sing Hallelujah)'] },
      A: { chords: ['A', 'F#m', 'D', 'E'],   songs: ['Open the Eyes of My Heart', 'You Are My King (Amazing Love)'] },
      E: { chords: ['E', 'C#m', 'A', 'B'],   songs: ['Here I Am to Worship', 'Everlasting God'] },
      C: { chords: ['C', 'Am', 'F', 'G'],    songs: ['Build My Life', 'Way Maker'] },
    },
  },
]

const KEYS = ['G', 'D', 'A', 'E', 'C']

const btnBase = { padding: '8px 18px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none', transition: 'background 0.15s' }

export default function Progressions() {
  const [progId, setProgId] = useState(PROGRESSIONS[0].id)
  const [key, setKey] = useState('G')

  const prog = PROGRESSIONS.find(p => p.id === progId)
  const { chords, songs } = prog.keys[key]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {CHORD_SECTIONS.map(section => (
        <section key={section.label}>
          <h2 style={{ margin: '0 0 8px', fontWeight: 400, color: 'var(--text-muted)' }}>{section.label}</h2>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-muted)', maxWidth: 600 }}>{section.description}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {section.chords.map(chord => (
              <div key={chord} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '12px 16px', textAlign: 'center' }}>
                <ChordDiagram name={chord} frets={CHORD_SHAPES[chord]} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <hr style={{ border: 'none', borderTop: '1px solid var(--surface2)', margin: 0 }} />

      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Progression</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PROGRESSIONS.map(p => (
            <button
              key={p.id}
              onClick={() => setProgId(p.id)}
              style={{
                ...btnBase,
                background: progId === p.id ? 'var(--accent)' : 'var(--surface2)',
                color: progId === p.id ? '#fff' : 'var(--text-muted)',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Key</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {KEYS.map(k => (
            <button
              key={k}
              onClick={() => setKey(k)}
              style={{
                ...btnBase,
                background: key === k ? 'var(--accent2)' : 'var(--surface2)',
                color: key === k ? '#000' : 'var(--text-muted)',
                minWidth: 48,
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {chords.map((chord, i) => (
            <div
              key={chord}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                textAlign: 'center',
                minWidth: 100,
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                {prog.numerals[i]}
              </div>
              {CHORD_SHAPES[chord]
                ? <ChordDiagram name={chord} frets={CHORD_SHAPES[chord]} />
                : <div style={{ fontSize: 22, fontWeight: 700, padding: '20px 0' }}>{chord}</div>
              }
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 12px', fontWeight: 400, color: 'var(--text-muted)' }}>Songs in {key} using this progression</h2>
        <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {songs.map(song => (
            <li key={song} style={{ fontSize: 15 }}>
              <a href={ugSearchUrl(song)} target="_blank" rel="noreferrer">{song}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
