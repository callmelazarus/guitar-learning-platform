export default function StreakBar({ weekDays }) {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {weekDays.map(day => (
        <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div
            role="img"
            aria-label={day.practiced ? `${day.dayName} practiced` : `${day.dayName} not done`}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: day.practiced
                ? 'var(--green)'
                : day.isFuture
                  ? '#333'
                  : 'var(--surface2)',
              border: day.isToday ? '2px solid var(--accent2)' : '2px solid transparent',
              opacity: day.isFuture ? 0.4 : 1,
            }}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{day.dayName}</span>
        </div>
      ))}
    </div>
  )
}
