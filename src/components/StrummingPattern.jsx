import { useState, useRef, useEffect } from 'react'
import StrummingDiagram from './StrummingDiagram'
import { playPattern } from '../utils/strumAudio'

export default function StrummingPattern({ pattern }) {
  const { name, notation, beats, description, songs } = pattern
  const [playing, setPlaying] = useState(false)
  const stopRef = useRef(null)

  useEffect(() => {
    return () => { stopRef.current?.() }
  }, [])

  function handlePlay() {
    const stop = playPattern(beats, 80, () => setPlaying(false))
    stopRef.current = stop
    setPlaying(true)
  }

  function handleStop() {
    stopRef.current?.()
    stopRef.current = null
    setPlaying(false)
  }

  const btnStyle = {
    padding: '6px 14px',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    border: 'none',
    background: playing ? 'var(--surface2)' : 'var(--accent)',
    color: playing ? 'var(--text-muted)' : '#fff',
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent2)' }}>{notation}</span>
          <button
            style={btnStyle}
            onClick={playing ? handleStop : handlePlay}
            aria-label={playing ? 'Stop' : 'Play'}
          >
            {playing ? '■ Stop' : '▶ Play'}
          </button>
        </div>
      </div>
      <StrummingDiagram beats={beats} />
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>{description}</p>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>Songs: </span>
        {songs.flatMap((song, i) =>
          i === 0
            ? [<span key={song}>{song}</span>]
            : [<span key={`sep-${i}`}> · </span>, <span key={song}>{song}</span>]
        )}
      </div>
    </div>
  )
}
