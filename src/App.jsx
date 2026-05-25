import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/calendar" element={<div>Calendar</div>} />
          <Route path="/songs" element={<div>Songs</div>} />
          <Route path="/theory" element={<div>Theory</div>} />
        </Routes>
      </main>
    </div>
  )
}
