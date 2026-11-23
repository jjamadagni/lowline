/** Autocorrelation pitch detect aimed at bass fundamentals (~35–420 Hz). */
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  const n = buf.length;
  let energy = 0;
  for (let i = 0; i < n; i++) energy += buf[i]! * buf[i]!;
  const rms = Math.sqrt(energy / n);
  if (rms < 0.012) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / 420));
  const maxLag = Math.min(n - 2, Math.floor(sampleRate / 32));

  const corrAt = (lag: number) => {
    let corr = 0;
    const end = n - lag;
    for (let i = 0; i < end; i += 2) corr += buf[i]! * buf[i + lag]!;
    return corr;
  };

  const zero = corrAt(0);
  if (zero <= 0) return null;

  let bestLag = -1;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const corr = corrAt(lag);
    if (corr > best) {
      best = corr;
      bestLag = lag;
    }
  }
  if (bestLag < 0 || best < zero * 0.42) return null;

  const center = best;
  const prev = corrAt(bestLag - 1);
  const next = corrAt(bestLag + 1);
  const denom = prev + next - 2 * center;
  const shift = denom === 0 ? 0 : (0.5 * (prev - next)) / denom;
  const freq = sampleRate / (bestLag + shift);
  if (!Number.isFinite(freq) || freq < 30 || freq > 460) return null;
  return freq;
}
