const STATUS_COLOR = { learned: 'var(--green)', in_progress: 'var(--accent2)', not_started: 'var(--text-muted)' }

export default function SongHistory({ songs, onUndo }) {
  const sorted = [...songs].sort((a, b) => {
    const da = a.dateLearned || a.dateStarted || ''
    const db = b.dateLearned || b.dateStarted || ''
    return db.localeCompare(da)
  })

  if (!sorted.length) return <p style={{ color: 'var(--text-muted)' }}>No songs learned yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map(s => (
        <div key={(s.dateLearned || s.dateStarted) + s.title} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.artist}{s.key ? ` · Key of ${s.key}` : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Started {s.dateStarted}{s.dateLearned ? ` · Learned ${s.dateLearned}` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: STATUS_COLOR[s.status] || 'var(--text-muted)', fontSize: 13 }}>✓ Learned</span>
            {onUndo && (
              <button
                onClick={() => onUndo(s.id)}
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)', padding: '6px 16px', fontSize: 13 }}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
