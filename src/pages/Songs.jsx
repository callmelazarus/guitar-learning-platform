import { useState } from 'react'
import { useAppData } from '../hooks/useAppData'
import SongForm from '../components/SongForm'
import SongHistory from '../components/SongHistory'

export default function Songs() {
  const { activeSongs, songHistory, addSong, markSongLearned, unmarkSongLearned, removeSong } = useAppData()
  const [showForm, setShowForm] = useState(false)

  function handleSave(song) {
    addSong(song)
    setShowForm(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontWeight: 400, color: 'var(--text-muted)' }}>Active Songs</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{ background: 'var(--accent)', color: '#fff', padding: '8px 18px', fontWeight: 600 }}
            >
              + Add Song
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ marginBottom: 24 }}>
            <SongForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {activeSongs.length === 0 && !showForm ? (
          <p style={{ color: 'var(--text-muted)' }}>No active songs — click "+ Add Song" to get started.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeSongs.map(song => (
              <div key={song.id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 24 }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{song.title}</div>
                <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{song.artist}</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  {song.key && <span style={{ background: 'var(--surface2)', padding: '2px 10px', borderRadius: 12, fontSize: 13 }}>Key of {song.key}</span>}
                  {song.youtubeUrl && <a href={song.youtubeUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, background: 'var(--surface2)', color: 'var(--accent2)', padding: '10px 24px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>YouTube ↗</a>}
                  {song.tabUrl && <a href={song.tabUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, background: 'var(--surface2)', color: '#4ade80', padding: '10px 24px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>Tab ↗</a>}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => markSongLearned(song.id)}
                    style={{ background: '#1a3328', color: '#6ee7b7', padding: '10px 24px', fontWeight: 600 }}
                  >
                    Mark as Learned ✓
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    style={{ background: 'var(--surface2)', color: 'var(--text-muted)', padding: '10px 24px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ margin: '0 0 16px', fontWeight: 400, color: 'var(--text-muted)' }}>Song History</h2>
        <SongHistory songs={songHistory} onUndo={unmarkSongLearned} />
      </section>
    </div>
  )
}
