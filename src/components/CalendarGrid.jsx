import { getDaysInMonth, formatDate, today as getToday } from '../utils/dates'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarGrid({ year, month, practiceDays, milestones, onToggle, today: todayProp }) {
  const todayStr = todayProp || getToday()
  const practiced = new Set(practiceDays)
  const days = getDaysInMonth(year, month)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} />
          const dateStr = formatDate(d)
          const isPracticed = practiced.has(dateStr)
          const isMilestone = !!milestones[dateStr]
          const isFuture = dateStr > todayStr
          const isToday = dateStr === todayStr
          const label = `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}${isPracticed ? ' practiced' : ''}`
          return (
            <button
              key={dateStr}
              aria-label={label}
              onClick={() => !isFuture && onToggle(dateStr)}
              disabled={isFuture}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius)',
                background: isPracticed ? 'var(--green)' : 'var(--surface)',
                border: isToday ? '2px solid var(--accent2)' : '2px solid transparent',
                color: isFuture ? 'var(--text-muted)' : 'var(--text)',
                opacity: isFuture ? 0.3 : 1,
                cursor: isFuture ? 'default' : 'pointer',
                position: 'relative',
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: 4,
              }}
            >
              {d.getDate()}
              {isMilestone && (
                <span title={milestones[dateStr]} style={{ fontSize: 8, color: 'var(--accent2)' }}>★</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
