import { useEffect, useRef, useState } from "react";
import { Fretboard, type FretSpot } from "@/components/fretboard";
import { Button } from "@/components/ui/button";
import { playMidi, resumeAudio } from "@/lib/bass/audio";
import type { Step } from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { fretMidi, midiToName } from "@/lib/bass/theory";
import { cn } from "@/lib/utils";

const LIVES = 3;

export function roundNotes(steps: Step[]): FretSpot[] {
  const notes = steps.flatMap((step) =>
    !step.rest && step.string != null && step.fret != null ? [{ string: step.string, fret: step.fret }] : [],
  );
  if (notes.length === 0) return [];
  const loops = notes.length >= 8 ? 1 : Math.min(4, Math.ceil(8 / notes.length));
  return Array.from({ length: loops }, () => notes)
    .flat()
    .slice(0, 12);
}

function windowFor(combo: number) {
  if (combo >= 8) return 1100;
  if (combo >= 4) return 1600;
  return 2200;
}

function cue(midi: number, dur = 0.35) {
  try {
    playMidi(midi, undefined, dur);
  } catch {
    // The round still counts if this browser has no speaker.
  }
}

export function Round({
  id,
  title,
  notes,
  onClose,
}: {
  id: string;
  title: string;
  notes: FretSpot[];
  onClose: () => void;
}) {
  const finishRun = useProgress((state) => state.finishRun);
  const best = useProgress((state) => state.bestRuns?.[id] ?? 0);
  const [phase, setPhase] = useState<"ready" | "play" | "done">("ready");
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [remain, setRemain] = useState(1);
  const [hot, setHot] = useState<FretSpot | null>(null);
  const [guide, setGuide] = useState<FretSpot | null>(null);
  const [line, setLine] = useState("The note plays. Tap that fret before the bar runs out.");
  const [bestCombo, setBestCombo] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [hits, setHits] = useState(0);

  const gen = useRef(0);
  const raf = useRef(0);
  const lock = useRef(false);
  const indexRef = useRef(0);
  const livesRef = useRef(LIVES);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0);
  const bestComboRef = useRef(0);
  const bestAtStart = useRef(0);
  const ended = useRef(false);

  useEffect(() => {
    return () => {
      gen.current += 1;
      cancelAnimationFrame(raf.current);
    };
  }, []);

  function stopClock() {
    gen.current += 1;
    cancelAnimationFrame(raf.current);
  }

  function end(nextHits: number, nextScore: number) {
    if (ended.current) return;
    ended.current = true;
    stopClock();
    setHits(nextHits);
    setFinalScore(nextScore);
    setPhase("done");
    setGuide(null);
    setHot(null);
    finishRun(id, nextScore, nextHits, notes.length);
  }

  function arm(at: number, streak: number) {
    lock.current = false;
    const note = notes[at];
    if (!note) {
      end(hitsRef.current, scoreRef.current);
      return;
    }
    const token = ++gen.current;
    indexRef.current = at;
    setIndex(at);
    setGuide(note);
    setHot(null);
    setRemain(1);
    setLine("Tap the lit fret.");
    cue(fretMidi(note.string, note.fret));
    const ms = windowFor(streak);
    const started = performance.now();
    const tick = (now: number) => {
      if (gen.current !== token) return;
      const left = 1 - (now - started) / ms;
      if (left <= 0) {
        setRemain(0);
        fail(token, "Late.");
        return;
      }
      setRemain(left);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function fail(token: number, why: string) {
    if (gen.current !== token || ended.current) return;
    lock.current = true;
    stopClock();
    const nextLives = livesRef.current - 1;
    livesRef.current = nextLives;
    comboRef.current = 0;
    setLives(nextLives);
    setCombo(0);
    setLine(why);
    window.setTimeout(() => {
      if (ended.current) return;
      if (nextLives <= 0) {
        end(hitsRef.current, scoreRef.current);
        return;
      }
      arm(indexRef.current + 1, 0);
    }, 480);
  }

  async function start() {
    ended.current = false;
    lock.current = false;
    bestAtStart.current = best;
    livesRef.current = LIVES;
    comboRef.current = 0;
    scoreRef.current = 0;
    hitsRef.current = 0;
    bestComboRef.current = 0;
    setLives(LIVES);
    setCombo(0);
    setScore(0);
    setBestCombo(0);
    setPhase("play");
    try {
      await Promise.race([
        resumeAudio(),
        new Promise((resolve) => window.setTimeout(resolve, 400)),
      ]);
    } catch {
      // Play on without the speaker.
    }
    if (ended.current) return;
    arm(0, 0);
  }

  async function onPlay(stringIndex: number, fret: number) {
    if (phase !== "play" || ended.current || lock.current) return;
    lock.current = true;
    const token = gen.current;
    const note = notes[indexRef.current];
    if (!note) return;
    try {
      await resumeAudio();
    } catch {
      // The tap still counts.
    }
    if (gen.current !== token || ended.current) {
      lock.current = false;
      return;
    }
    cue(fretMidi(stringIndex, fret), 0.45);
    setHot({ string: stringIndex, fret });
    if (stringIndex === note.string && fret === note.fret) {
      stopClock();
      const nextCombo = comboRef.current + 1;
      const nextHits = hitsRef.current + 1;
      const gain = 10 + Math.min(nextCombo, 8) * 2;
      const nextScore = scoreRef.current + gain;
      comboRef.current = nextCombo;
      hitsRef.current = nextHits;
      scoreRef.current = nextScore;
      if (nextCombo > bestComboRef.current) bestComboRef.current = nextCombo;
      setCombo(nextCombo);
      setHits(nextHits);
      setScore(nextScore);
      setBestCombo(bestComboRef.current);
      setLine(`+${gain}`);
      window.setTimeout(() => {
        if (ended.current) return;
        arm(indexRef.current + 1, nextCombo);
      }, 220);
      return;
    }
    fail(token, "Wrong fret.");
  }

  const target = notes[index];
  const targetName = target ? midiToName(fretMidi(target.string, target.fret)) : "";

  if (phase === "ready") {
    return (
      <div className="grid gap-4">
        <div>
          <p className="text-sm text-muted">Round · {title}</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">Tap the note you hear.</h2>
          <p className="mt-2 text-muted">
            {notes.length} notes. The bar gets less patient after a combo of four, then eight. Three misses ends it.
            Slower than the drill, on purpose. Your bass still gets played after.
          </p>
          {best > 0 ? <p className="mt-2 text-sm text-subtle">Best {best}</p> : null}
        </div>
        <Button size="lg" className="w-full" onClick={() => void start()}>
          Start
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Back to the drill
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    const cleared = hits === notes.length;
    const isBest = finalScore > bestAtStart.current;
    return (
      <div className="grid gap-4">
        <div>
          <p className="text-sm text-muted">{cleared ? "Clear" : "Round over"}</p>
          <p className="font-display text-5xl tracking-tight tabular-nums">{finalScore}</p>
          <p className="mt-1 text-sm text-muted">
            {hits} of {notes.length}
            {bestCombo > 1 ? ` · combo ${bestCombo}` : ""}
            {isBest ? " · new best" : bestAtStart.current > 0 ? ` · best ${bestAtStart.current}` : ""}
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={() => void start()}>
          Again
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Back to the drill
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div aria-live="polite">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-muted">
            {Math.min(index + 1, notes.length)} of {notes.length}
          </p>
          <p className="font-display text-2xl tabular-nums tracking-tight">{score}</p>
        </div>
        <p className="font-display text-5xl tracking-tight">{targetName}</p>
        <p className="mt-1 min-h-6 text-sm text-muted">{combo > 1 ? `Combo ${combo}. ${line}` : line}</p>
        <div className="mt-3 flex gap-1.5" aria-label={`${lives} misses left`}>
          {Array.from({ length: LIVES }, (_, mark) => (
            <span
              key={mark}
              className={cn("h-1.5 flex-1 rounded-full", mark < lives ? "bg-accent" : "bg-surface-2")}
            />
          ))}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-fg" style={{ width: `${Math.max(0, remain) * 100}%` }} />
        </div>
      </div>
      <Fretboard hot={hot} guide={guide} onPlay={(stringIndex, fret) => void onPlay(stringIndex, fret)} />
    </div>
  );
}
