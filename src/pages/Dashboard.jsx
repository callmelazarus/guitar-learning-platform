import { version } from '../../package.json'
import { useAppData } from '../hooks/useAppData'
import { today } from '../utils/dates'
import StreakBar from '../components/StreakBar'
import StreakCounter from '../components/StreakCounter'
import LogPracticeButton from '../components/LogPracticeButton'
import SongCard from '../components/SongCard'
import StorageBanner from '../components/StorageBanner'

export default function Dashboard() {
  const { practiceDays, activeSongs, streak, weekDays, togglePracticeDay, storageAvailable } = useAppData()
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
          <LogPracticeButton todayStr={today()} practiceDays={practiceDays} togglePracticeDay={togglePracticeDay} />
        </div>
      </section>
      <section>
        <h2 style={{ margin: '0 0 16px', color: 'var(--text-muted)', fontWeight: 400 }}>Active Songs</h2>
        {activeSongs.length === 0 ? (
          <SongCard song={null} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeSongs.map(song => <SongCard key={song.id} song={song} />)}
          </div>
        )}
      </section>
      <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: 11, opacity: 0.4 }}>
        v{version}
      </div>
    </div>
  )
}
