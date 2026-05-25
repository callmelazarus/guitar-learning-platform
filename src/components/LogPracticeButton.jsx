import { today } from '../utils/dates'

export default function LogPracticeButton({ practiceDays, togglePracticeDay }) {
  const todayStr = today()
  const logged = practiceDays.includes(todayStr)
  return (
    <button
      onClick={() => togglePracticeDay(todayStr)}
      style={{
        padding: '14px 32px',
        fontSize: 18,
        fontWeight: 700,
        background: logged ? 'var(--green)' : 'var(--accent)',
        color: '#fff',
        borderRadius: 'var(--radius)',
        transition: 'background 0.2s',
      }}
    >
      {logged ? '✓ Practiced Today' : 'Log Practice'}
    </button>
  )
}
