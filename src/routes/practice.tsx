import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Drill } from "@/components/drill";
import { ExerciseList } from "@/components/exercises";
import { Fretboard, type FretSpot } from "@/components/fretboard";
import { MetronomePanel } from "@/components/metronome-panel";
import { PageIntro } from "@/components/shell";
import { TunerPanel } from "@/components/tuner-panel";
import { playMidi, resumeAudio } from "@/lib/bass/audio";
import { useProgress } from "@/lib/bass/store";
import { describeFret, fretMidi } from "@/lib/bass/theory";
import { formatClock } from "@/lib/bass/stats";
import { cn } from "@/lib/utils";

type Mode = "board" | "drill" | "drills" | "click" | "tune";

export const Route = createFileRoute("/practice")({
  validateSearch: (search: Record<string, unknown>) => {
    const modeRaw = search.mode;
    const mode: Mode | undefined =
      modeRaw === "board" || modeRaw === "drill" || modeRaw === "drills" || modeRaw === "click" || modeRaw === "tune"
        ? modeRaw
        : undefined;
    const bpmNum = typeof search.bpm === "number" ? search.bpm : Number(search.bpm);
    const result: { mode?: Mode; bpm?: number } = {};
    if (mode) result.mode = mode;
    if (Number.isFinite(bpmNum)) result.bpm = Math.min(200, Math.max(40, Math.round(bpmNum)));
    return result;
  },
  component: PracticePage,
});

const MODES: { id: Mode; label: string }[] = [
  { id: "board", label: "Neck" },
  { id: "drill", label: "Find" },
  { id: "drills", label: "Drills" },
  { id: "click", label: "Click" },
  { id: "tune", label: "Tune" },
];

const TITLES: Record<Mode, string> = {
  board: "The neck",
  drill: "Find the note",
  drills: "Drills",
  click: "The click",
  tune: "Tune",
};

function PracticePage() {
  const search = Route.useSearch();
  const setBpm = useProgress((state) => state.setBpm);
  const logMinutes = useProgress((state) => state.logMinutes);
  const [mode, setMode] = useState<Mode>(search.mode ?? "board");
  const [showNames, setShowNames] = useState(false);
  const [hot, setHot] = useState<FretSpot | null>(null);
  const [readout, setReadout] = useState("Tap the neck");
  const [elapsed, setElapsed] = useState(0);
  const [timing, setTiming] = useState(false);
  const [note, setNote] = useState("");
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (search.mode) setMode(search.mode);
    if (search.bpm) setBpm(search.bpm);
  }, [search.mode, search.bpm, setBpm]);

  useEffect(() => {
    if (!timing) return;
    const id = window.setInterval(() => {
      setElapsed((value) => {
        const next = value + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timing]);

  useEffect(() => {
    return () => {
      if (elapsedRef.current >= 30) {
        logMinutes(Math.max(1, Math.round(elapsedRef.current / 60)));
      }
    };
  }, [logMinutes]);

  function stopTimer() {
    setTiming(false);
    const seconds = elapsedRef.current;
    elapsedRef.current = 0;
    setElapsed(0);
    if (seconds >= 30) {
      const mins = Math.max(1, Math.round(seconds / 60));
      logMinutes(mins);
      setNote(`Logged ${mins} min.`);
    } else if (seconds > 0) {
      setNote("Under 30 seconds — not logged.");
    }
  }

  return (
    <div>
      <PageIntro kicker="Practice" title={TITLES[mode]}>
        <p>Sound needs a tap the first time. Mute lives in the header.</p>
      </PageIntro>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface px-4 py-3">
        <div>
          <p className="text-sm text-muted">Session</p>
          <p className="font-display text-2xl tabular-nums tracking-tight">{formatClock(elapsed)}</p>
        </div>
        <button
          type="button"
          className="press h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
          onClick={() => {
            if (timing) stopTimer();
            else {
              setNote("");
              setTiming(true);
            }
          }}
        >
          {timing ? "Stop and save" : "Start timer"}
        </button>
      </div>
      {note ? <p className="mb-4 text-sm text-muted">{note}</p> : null}

      <div className="grid grid-cols-5 gap-1 rounded-xl bg-surface p-1" role="tablist" aria-label="Practice mode">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            onClick={() => setMode(item.id)}
            className={cn(
              "press h-10 rounded-lg text-sm",
              mode === item.id ? "bg-accent text-accent-fg" : "text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {mode === "board" ? (
          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-3">
              <p className="font-display text-3xl tracking-tight">{readout}</p>
              <button
                type="button"
                aria-pressed={showNames}
                onClick={() => setShowNames((value) => !value)}
                className={cn(
                  "press h-10 shrink-0 rounded-lg border px-3 text-sm",
                  showNames ? "border-accent bg-accent text-accent-fg" : "border-line text-muted",
                )}
              >
                Names
              </button>
            </div>
            <Fretboard
              hot={hot}
              showNames={showNames}
              onPlay={(stringIndex, fret) => {
                void resumeAudio().then(() => playMidi(fretMidi(stringIndex, fret)));
                setHot({ string: stringIndex, fret });
                setReadout(describeFret(stringIndex, fret).label);
              }}
            />
          </div>
        ) : null}
        {mode === "drill" ? <Drill /> : null}
        {mode === "drills" ? <ExerciseList /> : null}
        {mode === "click" ? <MetronomePanel /> : null}
        {mode === "tune" ? <TunerPanel /> : null}
      </div>
    </div>
  );
}
