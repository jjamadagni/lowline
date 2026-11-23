import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { WeekChart } from "@/components/week-chart";
import { LESSONS, STAGES, stageLessons } from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import {
  calendarWeeks,
  last7,
  practicedDays,
  rankFor,
  totalMinutes,
} from "@/lib/bass/stats";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

const GOALS = [10, 15, 20, 30];

function ProgressPage() {
  const mounted = useMounted();
  const xp = useProgress((state) => state.xp);
  const completed = useProgress((state) => state.completed);
  const minutes = useProgress((state) => state.minutes);
  const streak = useProgress((state) => state.streak);
  const longest = useProgress((state) => state.longest);
  const drillCorrect = useProgress((state) => state.drillCorrect);
  const drillAttempts = useProgress((state) => state.drillAttempts);
  const bestRuns = useProgress((state) => state.bestRuns ?? {});
  const name = useProgress((state) => state.name);
  const dailyGoal = useProgress((state) => state.dailyGoal);
  const setName = useProgress((state) => state.setName);
  const setGoal = useProgress((state) => state.setGoal);
  const reset = useProgress((state) => state.reset);
  const [confirm, setConfirm] = useState(false);
  const rank = rankFor(xp);
  const accuracy = drillAttempts === 0 ? null : Math.round((drillCorrect / drillAttempts) * 100);
  const bestRound = Math.max(0, ...Object.values(bestRuns), 0);
  const weeks = mounted ? calendarWeeks(minutes) : [];
  const days = weeks.length > 0 ? practicedDays(weeks) : 0;

  return (
    <div>
      <PageIntro kicker={`Rank ${rank.level}`} title={rank.name}>
        <p>{rank.nextName ? `${rank.remain} XP to ${rank.nextName}` : "You've reached the top rank."}</p>
      </PageIntro>
      <Meter value={rank.pct} label="Progress to the next rank" />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Lessons" value={`${completed.length}/${LESSONS.length}`} />
        <Stat label="Minutes" value={String(totalMinutes(minutes))} />
        <Stat label="Best streak" value={String(Math.max(streak, longest))} />
        <Stat label="Note accuracy" value={accuracy == null ? "—" : `${accuracy}%`} />
        <Stat label="Best round" value={bestRound === 0 ? "—" : String(bestRound)} />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 font-medium">Last seven days</h2>
        <Card>{mounted ? <WeekChart data={last7(minutes)} /> : <div className="h-28" />}</Card>
      </section>

      <section className="mt-6">
        <h2 className="mb-1 font-medium">The last twelve weeks</h2>
        <p className="mb-3 text-sm text-muted">
          {days === 0 ? "No sessions yet." : `${days} day${days === 1 ? "" : "s"} with a session.`} Bright means
          you practiced.
        </p>
        {mounted ? (
          <div className="grid grid-flow-col grid-rows-7 gap-1" aria-hidden="true">
            {weeks.flat().map((day) => (
              <div
                key={day.key}
                className={cn(
                  "aspect-square rounded-sm",
                  day.future ? "bg-transparent" : day.minutes > 0 ? "bg-accent" : "bg-surface-2",
                  day.today && "ring-1 ring-fg",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="h-28" />
        )}
      </section>

      <section className="mt-6 grid gap-3">
        <h2 className="font-medium">Stages</h2>
        {STAGES.map((stage) => {
          const lessons = stageLessons(stage.id);
          const done = lessons.filter((lesson) => completed.includes(lesson.id)).length;
          return (
            <div key={stage.id}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{stage.title}</span>
                <span className="tabular-nums text-muted">
                  {done}/{lessons.length}
                </span>
              </div>
              <Meter value={lessons.length === 0 ? 0 : done / lessons.length} label={stage.title} />
            </div>
          );
        })}
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="font-medium">On this phone</h2>
        <label className="grid gap-2 text-sm text-muted" htmlFor="edit-name">
          Name
          <input
            id="edit-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            className="h-12 rounded-lg border border-line bg-surface-2 px-3 text-base text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
        <div>
          <p className="text-sm text-muted">Daily minutes</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                aria-pressed={dailyGoal === goal}
                onClick={() => setGoal(goal)}
                className={cn(
                  "press h-11 rounded-lg border text-sm tabular-nums",
                  dailyGoal === goal
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface text-fg",
                )}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-subtle">
          Saved on this phone only. Lessons, minutes, and the streak disappear if you clear website data.
        </p>
      </section>

      <section className="mt-8">
        {confirm ? (
          <Card>
            <h2 className="font-medium">Reset everything?</h2>
            <p className="mt-2 text-sm text-muted">The path, the streak, and the minutes all go back to day one.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Keep it
              </Button>
              <Button onClick={() => reset()}>Reset</Button>
            </div>
          </Card>
        ) : (
          <button type="button" className="press text-sm text-subtle" onClick={() => setConfirm(true)}>
            Reset progress
          </button>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums tracking-tight">{value}</p>
    </Card>
  );
}
