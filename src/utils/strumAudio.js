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

export function playPattern(beats, bpm = DEFAULT_BPM) {
  const audioCtx = new AudioContext()
  const subdivDuration = 60 / bpm / 2
  const patternDuration = beats.length * subdivDuration
  let stopped = false

  function schedulePass(baseTime) {
    if (stopped) return
    beats.forEach((beat, i) => {
      if (!beat) return
      const freq = beat === 'D' ? DOWN_FREQ : UP_FREQ
      const src = audioCtx.createBufferSource()
      src.buffer = karplusBuffer(audioCtx, freq)
      src.connect(audioCtx.destination)
      src.start(baseTime + i * subdivDuration)
    })
    const msUntilNext = (baseTime + patternDuration - audioCtx.currentTime) * 1000 - 50
    setTimeout(() => schedulePass(baseTime + patternDuration), Math.max(0, msUntilNext))
  }

  schedulePass(audioCtx.currentTime)

  return function stop() {
    stopped = true
    audioCtx.close()
  }
}
