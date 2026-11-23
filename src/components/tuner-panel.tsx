import { useEffect, useRef, useState } from "react";
import { getAudio, playMidi, resumeAudio } from "@/lib/bass/audio";
import { detectPitch } from "@/lib/bass/pitch";
import { OPEN_FREQ, OPEN_MIDI, STRING_LABELS, centsBetween, freqToMidi, midiToName } from "@/lib/bass/theory";
import { cn } from "@/lib/utils";

function closestString(freq: number) {
  let best = 0;
  let bestGap = Number.POSITIVE_INFINITY;
  OPEN_FREQ.forEach((target, index) => {
    const gap = Math.abs(centsBetween(freq, target));
    if (gap < bestGap) {
      bestGap = gap;
      best = index;
    }
  });
  return best;
}

export function TunerPanel() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freq, setFreq] = useState<number | null>(null);
  const [lock, setLock] = useState<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => stopRef.current?.();
  }, []);

  function stop() {
    stopRef.current?.();
    stopRef.current = null;
    setListening(false);
    setFreq(null);
  }

  async function start() {
    setError(null);
    try {
      await resumeAudio();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const audio = getAudio();
      const source = audio.createMediaStreamSource(stream);
      const analyser = audio.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let frame = 0;
      let last = 0;
      let smooth: number | null = null;
      const tick = (now: number) => {
        if (now - last > 90) {
          last = now;
          analyser.getFloatTimeDomainData(buf);
          const pitch = detectPitch(buf, audio.sampleRate);
          if (pitch == null) {
            smooth = null;
            setFreq(null);
          } else {
            smooth = smooth == null ? pitch : smooth * 0.6 + pitch * 0.4;
            setFreq(smooth);
          }
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      stopRef.current = () => {
        cancelAnimationFrame(frame);
        stream.getTracks().forEach((track) => track.stop());
        source.disconnect();
      };
      setListening(true);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "The mic is blocked. Match the reference tones by ear instead."
          : name === "NotFoundError"
            ? "No microphone found. The reference tones still work."
            : "The mic didn't start. The reference tones still work.",
      );
    }
  }

  const index = lock === null ? (freq == null ? 0 : closestString(freq)) : lock;
  const cents = freq == null ? null : centsBetween(freq, OPEN_FREQ[index]!);
  const inTune = cents != null && Math.abs(cents) <= 8;
  const heard = freq == null ? null : midiToName(freqToMidi(freq));
  const needle = cents == null ? 50 : ((Math.max(-50, Math.min(50, cents)) + 50) / 100) * 100;

  async function playReference(stringIndex: number) {
    await resumeAudio();
    playMidi(OPEN_MIDI[stringIndex]!, undefined, 1.3);
  }

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-4 gap-2">
        {STRING_LABELS.map((label, stringIndex) => {
          const selected = index === stringIndex && (lock !== null || freq != null);
          return (
            <div key={label} className="grid gap-1">
              <button
                type="button"
                aria-pressed={lock === stringIndex}
                onClick={() => setLock((current) => (current === stringIndex ? null : stringIndex))}
                className={cn(
                  "press h-11 rounded-lg border text-sm font-medium",
                  selected ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg",
                )}
              >
                {label}
              </button>
              <button
                type="button"
                className="press h-10 rounded-lg text-xs text-muted"
                onClick={() => void playReference(stringIndex)}
              >
                Hear
              </button>
            </div>
          );
        })}
      </div>
      <div className="text-center" aria-live="polite">
        <p className="font-display text-5xl tracking-tight">{listening && heard ? heard : STRING_LABELS[index]}</p>
        <p className={cn("mt-2 text-sm", inTune ? "text-good" : "text-muted")}>
          {cents == null
            ? listening
              ? "Play a string"
              : "Mic off"
            : inTune
              ? "In tune"
              : `${Math.abs(Math.round(cents))} cents ${cents > 0 ? "sharp" : "flat"}`}
        </p>
      </div>
      <div className="relative h-8">
        <div className="absolute top-3 right-0 left-0 h-px bg-line" />
        <div className="absolute top-1 left-1/2 h-5 w-px bg-fg" />
        <div
          className={cn("absolute top-1 size-3 -translate-x-1/2 rounded-full", inTune ? "bg-good" : "bg-accent")}
          style={{ left: `${needle}%` }}
        />
      </div>
      {error ? <p className="text-sm text-muted">{error}</p> : null}
      <button
        type="button"
        onClick={() => (listening ? stop() : void start())}
        className="press h-12 rounded-lg bg-accent text-base font-medium text-accent-fg"
      >
        {listening ? "Stop tuner" : "Start tuner"}
      </button>
      <p className="text-sm text-subtle">
        Tap a string to lock it. Headphones keep the mic from hearing the reference tone. Tune up to the pitch
        when you can.
      </p>
    </div>
  );
}
