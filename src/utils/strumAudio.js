const DOWN_FREQ = 110   // A2 — warm, bass-y
const UP_FREQ = 220     // A3 — brighter
const STRUM_DURATION = 1.2
const DEFAULT_BPM = 80

function karplusBuffer(audioCtx, frequency) {
  const sr = audioCtx.sampleRate
  const N = Math.round(sr / frequency)
  const total = Math.round(sr * STRUM_DURATION)
  const buf = audioCtx.createBuffer(1, total, sr)
  const data = buf.getChannelData(0)

  const ring = new Float32Array(N)
  for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1

  for (let i = 0; i < total; i++) {
    const curr = i % N
    const next = (i + 1) % N
    data[i] = ring[curr]
    ring[curr] = (ring[curr] + ring[next]) * 0.498
  }

  return buf
}

export function playPattern(beats, bpm = DEFAULT_BPM, onStop) {
  const audioCtx = new AudioContext()
  const subdivDuration = 60 / bpm / 2
  const sources = []

  beats.forEach((beat, i) => {
    if (!beat) return
    const freq = beat === 'D' ? DOWN_FREQ : UP_FREQ
    const src = audioCtx.createBufferSource()
    src.buffer = karplusBuffer(audioCtx, freq)
    src.connect(audioCtx.destination)
    src.start(audioCtx.currentTime + i * subdivDuration)
    sources.push(src)
  })

  const totalMs = (beats.length * subdivDuration + STRUM_DURATION) * 1000
  const timeout = setTimeout(() => {
    audioCtx.close()
    onStop?.()
  }, totalMs)

  return function stop() {
    clearTimeout(timeout)
    sources.forEach(s => { try { s.stop() } catch (_) {} })
    audioCtx.close()
    onStop?.()
  }
}
