import { useEffect, useRef, useState } from "react";
import { Fretboard, type FretSpot } from "@/components/fretboard";
import { Button } from "@/components/ui/button";
import { getAudio, playMidi, resumeAudio } from "@/lib/bass/audio";
import type { Step } from "@/lib/bass/lessons";
import { fretMidi, midiToName } from "@/lib/bass/theory";
import { cn } from "@/lib/utils";

function stepLabel(step: Step) {
  if (step.rest || step.string == null || step.fret == null) return "rest";
  return midiToName(fretMidi(step.string, step.fret));
}

export function PatternBlock({
  steps,
  bpm,
  note,
  logged,
  onLog,
}: {
  steps: Step[];
  bpm: number;
  note: string;
  logged: boolean;
  onLog: () => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hot, setHot] = useState<FretSpot | null>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  async function play() {
    clearTimers();
    await resumeAudio();
    const audio = getAudio();
    const beat = 60 / bpm;
    let time = audio.currentTime + 0.08;
    setPlaying(true);
    steps.forEach((step, index) => {
      const when = time;
      if (!step.rest && step.string != null && step.fret != null) {
        playMidi(fretMidi(step.string, step.fret), when, Math.max(0.12, beat * step.beats * 0.8));
      }
      const delay = Math.max(0, (when - audio.currentTime) * 1000);
      timers.current.push(
        window.setTimeout(() => {
          setActive(index);
          if (!step.rest && step.string != null && step.fret != null) {
            setHot({ string: step.string, fret: step.fret });
          } else {
            setHot(null);
          }
        }, delay),
      );
      time += beat * step.beats;
    });
    const endDelay = Math.max(0, (time - audio.currentTime) * 1000);
    timers.current.push(
      window.setTimeout(() => {
        setActive(null);
        setHot(null);
        setPlaying(false);
      }, endDelay),
    );
  }

  function stop() {
    clearTimers();
    setPlaying(false);
    setActive(null);
    setHot(null);
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-4">
      <h2 className="font-medium">Hear it</h2>
      <p className="mt-2 text-sm text-muted">
        {note} {bpm} BPM.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <span
            key={`${stepLabel(step)}-${index}`}
            className={cn(
              "rounded-lg bg-surface-2 px-2 py-1 text-sm tabular-nums",
              active === index && "bg-accent text-accent-fg",
            )}
          >
            {stepLabel(step)}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <Fretboard
          hot={hot}
          onPlay={(stringIndex, fret) => {
            void resumeAudio().then(() => playMidi(fretMidi(stringIndex, fret)));
          }}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button onClick={() => (playing ? stop() : void play())}>{playing ? "Stop" : "Hear the part"}</Button>
        <Button variant="secondary" onClick={onLog} disabled={logged}>
          {logged ? "Logged today" : "I played it"}
        </Button>
      </div>
    </section>
  );
}
