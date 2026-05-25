import { useAppData } from '../hooks/useAppData'
import SongForm from '../components/SongForm'
import SongHistory from '../components/SongHistory'

export default function Songs() {
  const { currentSong, songHistory, setCurrentSong, markSongLearned } = useAppData()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Current Song</h2>
        {currentSong ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{currentSong.title}</div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{currentSong.artist}</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {currentSong.key && <span style={{ background: 'var(--surface2)', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>Key of {currentSong.key}</span>}
              {currentSong.youtubeUrl && <a href={currentSong.youtubeUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>YouTube ↗</a>}
              {currentSong.tabUrl && <a href={currentSong.tabUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>Tab ↗</a>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={markSongLearned}
                style={{ background: 'var(--green)', color: '#fff', padding: '10px 24px', fontWeight: 600 }}
              >
                Mark as Learned ✓
              </button>
              <button
                onClick={() => setCurrentSong(null)}
                style={{ background: 'var(--surface2)', color: 'var(--text-muted)', padding: '10px 24px' }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <SongForm onSave={setCurrentSong} />
        )}
      </section>
      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Song History</h2>
        <SongHistory songs={songHistory} />
      </section>
    </div>
  )
}
