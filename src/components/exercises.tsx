import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PatternBlock } from "@/components/pattern-block";
import { Round, roundNotes } from "@/components/run";
import { getLesson } from "@/lib/bass/lessons";
import { nextLockedExercise, openExercises } from "@/lib/bass/exercises";
import { useProgress } from "@/lib/bass/store";
import { todayKey } from "@/lib/bass/stats";
import { useMounted } from "@/lib/use-mounted";

export function ExerciseList() {
  const completed = useProgress((state) => state.completed);
  const logGroove = useProgress((state) => state.logGroove);
  const grooveDay = useProgress((state) => state.grooveDay);
  const mounted = useMounted();
  const open = openExercises(completed);
  const locked = nextLockedExercise(completed);
  const lockedLesson = locked ? getLesson(locked.needs) : null;
  const bestRuns = useProgress((state) => state.bestRuns ?? {});
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const current = open.find((exercise) => exercise.id === selected) ?? null;

  if (current) {
    const logged = mounted && grooveDay[current.id] === todayKey();
    const notes = roundNotes(current.steps);
    if (playing && notes.length > 0) {
      return <Round id={current.id} title={current.title} notes={notes} onClose={() => setPlaying(false)} />;
    }
    return (
      <div className="grid gap-4">
        <button
          type="button"
          className="press inline-flex items-center gap-1 text-sm text-muted"
          onClick={() => {
            setPlaying(false);
            setSelected(null);
          }}
        >
          <ChevronLeft className="size-4" />
          All drills
        </button>
        <div>
          <p className="text-sm text-muted">
            {current.focus} · {current.minutes} min
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">{current.title}</h2>
          <p className="mt-2 text-muted">{current.detail}</p>
        </div>
        {notes.length > 0 ? (
          <button
            type="button"
            className="press h-12 w-full rounded-lg bg-accent text-base font-medium text-accent-fg"
            onClick={() => setPlaying(true)}
          >
            Play a round{bestRuns[current.id] ? ` · best ${bestRuns[current.id]}` : ""}
          </button>
        ) : null}
        <PatternBlock
          key={current.id}
          steps={current.steps}
          bpm={current.bpm}
          note={current.note}
          logged={logged}
          onLog={() => logGroove(current.id, current.steps, current.bpm)}
        />
      </div>
    );
  }

  if (open.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-4">
        <h2 className="font-medium">Drills open with the path</h2>
        <p className="mt-2 text-sm text-muted">
          {lockedLesson
            ? `Finish “${lockedLesson.title}” and the first one unlocks.`
            : "Finish the string names and the first drill unlocks."}
        </p>
      </div>
    );
  }

  let focus = "";
  return (
    <div className="grid gap-2">
      <p className="mb-1 text-sm text-muted">
        {open.length} drill{open.length === 1 ? "" : "s"} at your level. Play a round to keep the score. Hear it when you want the real tempo.
      </p>
      {open.map((exercise) => {
        const showFocus = exercise.focus !== focus;
        focus = exercise.focus;
        return (
          <div key={exercise.id} className={showFocus && exercise.id !== open[0]?.id ? "mt-3" : undefined}>
            {showFocus ? <p className="mb-2 text-sm text-muted">{exercise.focus}</p> : null}
            <button
              type="button"
              className="press flex w-full items-center justify-between gap-3 rounded-3xl border border-line bg-surface px-4 py-3 text-left"
              onClick={() => setSelected(exercise.id)}
            >
              <span>
                <span className="block font-medium">{exercise.title}</span>
                <span className="mt-1 block text-sm text-muted">{exercise.minutes} min</span>
              </span>
              <span className="text-sm text-subtle">{bestRuns[exercise.id] ? `Best ${bestRuns[exercise.id]}` : "Open"}</span>
            </button>
          </div>
        );
      })}
      {lockedLesson ? (
        <p className="mt-3 text-sm text-subtle">Next drill opens after {lockedLesson.title}.</p>
      ) : (
        <p className="mt-3 text-sm text-subtle">That's the set. Replay any of them slower than last time.</p>
      )}
    </div>
  );
}
