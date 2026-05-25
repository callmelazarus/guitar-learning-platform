const MILESTONES = [7, 30, 100]

export default function StreakCounter({ streak }) {
  const earned = MILESTONES.filter(m => streak >= m)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 56, fontWeight: 700, color: streak > 0 ? 'var(--accent2)' : 'var(--text-muted)' }}>
        {streak}
      </div>
      <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>day streak</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {MILESTONES.map(m => (
          <span
            key={m}
            title={`${m}-day milestone`}
            style={{
              padding: '2px 10px',
              borderRadius: 12,
              fontSize: 12,
              background: earned.includes(m) ? 'var(--accent2)' : 'var(--surface2)',
              color: earned.includes(m) ? '#000' : 'var(--text-muted)',
            }}
          >
            {m}d
          </span>
        ))}
      </div>
    </div>
  )
}
