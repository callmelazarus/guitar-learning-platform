import StrummingDiagram from './StrummingDiagram'

export default function StrummingPattern({ pattern }) {
  const { name, notation, beats, description, songs } = pattern
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>{name}</h3>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent2)' }}>{notation}</span>
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
