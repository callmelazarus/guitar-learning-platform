const STATUS_COLOR = { learned: 'var(--green)', in_progress: 'var(--accent2)', not_started: 'var(--text-muted)' }

export default function SongHistory({ songs }) {
  if (!songs.length) return <p style={{ color: 'var(--text-muted)' }}>No songs learned yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {songs.map((s, i) => (
        <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.artist}{s.key ? ` · Key of ${s.key}` : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Started {s.dateStarted}{s.dateLearned ? ` · Learned ${s.dateLearned}` : ''}
            </div>
          </div>
          <span style={{ color: STATUS_COLOR[s.status] || 'var(--text-muted)', fontSize: 13 }}>✓ Learned</span>
        </div>
      ))}
    </div>
  )
}
