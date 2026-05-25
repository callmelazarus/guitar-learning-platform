import { useAppData } from '../hooks/useAppData'
import StreakBar from '../components/StreakBar'
import StreakCounter from '../components/StreakCounter'
import LogPracticeButton from '../components/LogPracticeButton'
import SongCard from '../components/SongCard'
import StorageBanner from '../components/StorageBanner'

export default function Dashboard() {
  const { practiceDays, currentSong, streak, weekDays, togglePracticeDay, storageAvailable } = useAppData()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <StorageBanner available={storageAvailable} />
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 24px', color: 'var(--text-muted)', fontWeight: 400 }}>This Week</h2>
        <StreakBar weekDays={weekDays} />
      </section>
      <section style={{ textAlign: 'center' }}>
        <StreakCounter streak={streak} />
        <div style={{ marginTop: 24 }}>
          <LogPracticeButton practiceDays={practiceDays} togglePracticeDay={togglePracticeDay} />
        </div>
      </section>
      <section>
        <h2 style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontWeight: 400 }}>Current Song</h2>
        <SongCard song={currentSong} />
      </section>
    </div>
  )
}
