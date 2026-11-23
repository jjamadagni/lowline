import { useEffect, useRef, useState } from "react";
import { Fretboard, type FretSpot } from "@/components/fretboard";
import { Button } from "@/components/ui/button";
import { playMidi, resumeAudio } from "@/lib/bass/audio";
import { drillSpots } from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { describeFret, fretMidi } from "@/lib/bass/theory";

const ROUND = 8;

function choose(names: string[], previous: string | null) {
  const bag = names.filter((name) => name !== previous);
  const pool = bag.length > 0 ? bag : names;
  return pool[Math.floor(Math.random() * pool.length)] ?? "E";
}

export function Drill() {
  const completed = useProgress((state) => state.completed);
  const recordDrill = useProgress((state) => state.recordDrill);
  const spots = drillSpots(completed);
  const names = [...new Set(spots.map((spot) => spot.name))];
  const [target, setTarget] = useState(() => choose(names, null));
  const [picked, setPicked] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Any fingering of that note counts.");
  const [done, setDone] = useState(false);
  const [guide, setGuide] = useState<FretSpot | null>(null);
  const [hot, setHot] = useState<FretSpot | null>(null);
  const busy = useRef(false);
  const timer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  function again() {
    setDone(false);
    setCorrect(0);
    setPicked(0);
    setMisses(0);
    setCombo(0);
    setScore(0);
    setGuide(null);
    setHot(null);
    setFeedback("Any fingering of that note counts.");
    setTarget(choose(names, null));
  }

  async function onPlay(stringIndex: number, fret: number) {
    if (done || busy.current) return;
    await resumeAudio();
    playMidi(fretMidi(stringIndex, fret));
    const described = describeFret(stringIndex, fret);
    setHot({ string: stringIndex, fret });
    if (described.name === target) {
      busy.current = true;
      const nextCombo = combo + 1;
      const nextCorrect = correct + 1;
      const nextPicked = picked + 1;
      const gain = 10 + Math.min(nextCombo, 8) * 2;
      setCombo(nextCombo);
      setScore((value) => value + gain);
      setCorrect(nextCorrect);
      setPicked(nextPicked);
      setMisses(0);
      setGuide(null);
      setFeedback(`Yes. ${described.label}. +${gain}`);
      timer.current = window.setTimeout(() => {
        busy.current = false;
        setHot(null);
        if (nextPicked >= ROUND) {
          setDone(true);
          recordDrill(nextCorrect, ROUND);
          setFeedback(`${nextCorrect} of ${ROUND}. Logged 2 minutes.`);
        } else {
          setTarget(choose(names, target));
          setFeedback("Any fingering of that note counts.");
        }
      }, 560);
      return;
    }
    const nextMisses = misses + 1;
    setMisses(nextMisses);
    setCombo(0);
    setFeedback(`That's ${described.name}. Still looking for ${target}.`);
    if (nextMisses >= 2) {
      const hint = spots.find((spot) => spot.name === target);
      if (hint) setGuide({ string: hint.string, fret: hint.fret });
    }
  }

  return (
    <div className="grid gap-4">
      <div aria-live="polite">
        <p className="text-sm text-muted">{done ? "Round done" : `Note ${Math.min(picked + 1, ROUND)} of ${ROUND}`}</p>
        <p className="font-display text-5xl tracking-tight">{done ? `${score}` : target}</p>
        <p className="mt-1 min-h-6 text-sm text-muted">
          {done ? `${correct} of ${ROUND}. ${feedback}` : combo > 1 ? `Combo ${combo}. ${feedback}` : feedback}
        </p>
      </div>
      <Fretboard hot={hot} guide={guide} onPlay={(stringIndex, fret) => void onPlay(stringIndex, fret)} />
      {done ? (
        <Button onClick={again} className="w-full" size="lg">
          Another round
        </Button>
      ) : (
        <p className="text-sm text-subtle">Two misses lights one place that works. You can still find another.</p>
      )}
    </div>
  );
}
