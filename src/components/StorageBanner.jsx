export default function StorageBanner({ available }) {
  if (available) return null
  return (
    <div style={{ background: '#7a3a00', color: '#fff', padding: '8px 16px', textAlign: 'center', fontSize: 14 }}>
      Your data can't be saved in this browser session.
    </div>
  )
}
