const STATUS_LABEL = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  learned: 'Learned',
}

const STATUS_COLOR = {
  not_started: 'var(--text-muted)',
  in_progress: 'var(--accent2)',
  learned: 'var(--green)',
}

export default function SongCard({ song }) {
  if (!song) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        No current song — head to Songs to add one.
      </div>
    )
  }
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>This Month</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{song.title}</div>
      <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{song.artist}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        {song.key && <span style={{ background: 'var(--surface2)', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>Key of {song.key}</span>}
        <span style={{ color: STATUS_COLOR[song.status] || 'var(--text-muted)', fontSize: 13 }}>
          {STATUS_LABEL[song.status] || song.status}
        </span>
      </div>
    </div>
  )
}
