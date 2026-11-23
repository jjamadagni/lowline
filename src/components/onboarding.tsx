import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { cn } from "@/lib/utils";

const STARTS: { id: Experience; title: string; detail: string }[] = [
  { id: "new", title: "New to bass", detail: "Start with how to hold it." },
  { id: "some", title: "I know a few notes", detail: "Skip setup. Start on the neck." },
  { id: "stuck", title: "I play, but I'm stuck", detail: "Skip ahead to grooves." },
];

const GOALS = [10, 15, 20, 30];

export function Onboarding() {
  const start = useProgress((state) => state.start);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<Experience>("new");
  const [dailyGoal, setDailyGoal] = useState(15);

  const label =
    experience === "new"
      ? "Start from the beginning"
      : experience === "some"
        ? "Skip setup"
        : "Start at grooves";

  return (
    <div className="min-h-dvh bg-bg text-fg md:grid md:grid-cols-2">
      <section className="hidden flex-col justify-between bg-surface p-10 md:flex">
        <div className="flex items-center gap-3">
          <Mark />
          <p className="font-display text-2xl tracking-tight">Lowline</p>
        </div>
        <div className="max-w-sm">
          <h1 className="font-display text-5xl font-medium tracking-tight text-balance">
            Bass, a little at a time.
          </h1>
          <ul className="mt-8 grid gap-3 text-muted">
            <li>Lessons that assume nothing</li>
            <li>Chords, scales, and rock and metal songs</li>
            <li>A streak that stays on this phone</li>
          </ul>
        </div>
        <p className="text-sm text-subtle">Four strings. Show up.</p>
      </section>
      <section className="safe-top mx-auto flex w-full max-w-xl flex-col px-5 py-8 md:justify-center md:px-10">
        <div className="mb-8 md:hidden">
          <div className="mb-6 flex items-center gap-3">
            <Mark />
            <p className="font-display text-2xl tracking-tight">Lowline</p>
          </div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-balance">
            Bass, a little at a time.
          </h1>
          <p className="mt-3 text-muted">
            Lessons, drills, and rock and metal songs that open as you improve. Your streak stays on this phone.
          </p>
        </div>
        <h2 className="hidden font-display text-3xl font-medium tracking-tight md:block">Set your start</h2>
        <label className="mt-6 grid gap-2 text-sm text-muted" htmlFor="player-name">
          What should we call you?
          <input
            id="player-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            autoComplete="nickname"
            autoCapitalize="words"
            placeholder="Optional"
            className="h-12 rounded-lg border border-line bg-surface-2 px-3 text-base text-fg outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
        <fieldset className="mt-6">
          <legend className="text-sm text-muted">Where are you?</legend>
          <div className="mt-2 grid gap-2">
            {STARTS.map((item) => {
              const selected = experience === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setExperience(item.id)}
                  className={cn(
                    "press rounded-3xl border px-4 py-3 text-left",
                    selected ? "border-accent bg-surface-2" : "border-line bg-surface",
                  )}
                >
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.detail}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="text-sm text-muted">Daily minutes</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {GOALS.map((goal) => {
              const selected = dailyGoal === goal;
              return (
                <button
                  key={goal}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDailyGoal(goal)}
                  className={cn(
                    "press h-11 rounded-lg border text-sm tabular-nums",
                    selected
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-surface text-fg",
                  )}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Button className="mt-8 w-full" size="lg" onClick={() => start({ name, experience, dailyGoal })}>
          {label}
        </Button>
        <p className="mt-4 text-sm text-subtle">
          Progress stays on this phone. No account. Clearing browser data clears the streak.
        </p>
      </section>
    </div>
  );
}

function Mark() {
  return (
    <div className="string-mark text-fg" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
