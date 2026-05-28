import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/songs', label: 'Songs' },
  { to: '/progressions', label: 'Chords' },
  { to: '/theory', label: 'Theory' },
]

export default function NavBar() {
  return (
    <nav style={{
      background: 'var(--surface)',
      padding: '12px 24px',
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      borderBottom: '2px solid var(--surface2)',
    }}>
      <span style={{ fontWeight: 700, color: 'var(--accent)', marginRight: 16 }}>🎸 Guitar Practice Tracker</span>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent2)' : 'var(--text)',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
