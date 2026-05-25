import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Songs from './pages/Songs'
import Theory from './pages/Theory'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/theory" element={<Theory />} />
        </Routes>
      </main>
    </div>
  )
}
