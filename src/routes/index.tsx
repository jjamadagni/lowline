import { Link, createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { LESSONS, isUnlocked, nextLesson, setlistLessons, stageById } from "@/lib/bass/lessons";
import { openExercises } from "@/lib/bass/exercises";
import { useProgress } from "@/lib/bass/store";
import { greeting, last7, rankFor, todayKey } from "@/lib/bass/stats";
import { useMounted } from "@/lib/use-mounted";

export const Route = createFileRoute("/")({ component: Today });

function Today() {
  const mounted = useMounted();
  const name = useProgress((state) => state.name);
  const goal = useProgress((state) => state.dailyGoal);
  const minutes = useProgress((state) => state.minutes);
  const completed = useProgress((state) => state.completed);
  const xp = useProgress((state) => state.xp);
  const showInstall = useProgress((state) => state.showInstall);
  const dismissInstall = useProgress((state) => state.dismissInstall);
  const rank = rankFor(xp);
  const next = nextLesson(completed);
  const songs = setlistLessons();
  const song = songs.find((item) => isUnlocked(item.id, completed) && !completed.includes(item.id)) ?? null;
  const songsReady = songs.filter((item) => isUnlocked(item.id, completed)).length;
  const drill = openExercises(completed).at(-1) ?? null;
  const todayMin = mounted ? (minutes[todayKey()] ?? 0) : 0;
  const weekMin = mounted ? last7(minutes).reduce((sum, day) => sum + day.minutes, 0) : 0;
  const stage = next ? stageById(next.stage) : null;

  return (
    <div>
      <PageIntro kicker={mounted ? greeting(name) : "Your practice room"} title={rank.name}>
        <p>
          Rank {rank.level}
          {rank.nextName ? ` · ${rank.remain} XP to ${rank.nextName}` : " · top of the line"}
        </p>
      </PageIntro>

      {next && stage ? (
        <Card>
          <p className="text-sm text-muted">
            {stage.index} · {stage.title}
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-balance">{next.title}</h2>
          <p className="mt-2 text-sm text-muted">
            {next.minutes} min · {completed.length} of {LESSONS.length} lessons
          </p>
          <Button asChild className="mt-5 w-full" size="lg">
            <Link to="/lesson/$lessonId" params={{ lessonId: next.id }}>
              Continue
            </Link>
          </Button>
        </Card>
      ) : (
        <Card>
          <h2 className="font-display text-3xl font-medium tracking-tight">You reached the end of the path.</h2>
          <p className="mt-2 text-muted">The streak is the practice now. Find notes, or rewrite your four bars.</p>
          <div className="mt-5 grid gap-2">
            <Button asChild size="lg">
              <Link to="/practice" search={{ mode: "drill" }}>
                Find the note
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/lesson/$lessonId" params={{ lessonId: "write" }}>
                Four bars
              </Link>
            </Button>
          </div>
        </Card>
      )}

      <section className="mt-4">
        <Card>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="font-medium">Today</h2>
            <p className="text-sm tabular-nums text-muted">
              {todayMin} / {goal} min
            </p>
          </div>
          <Meter value={goal === 0 ? 0 : todayMin / goal} label="Today's practice minutes" />
          <p className="mt-3 text-sm text-muted">{weekMin} min across the last seven days.</p>
        </Card>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-medium">Do these</h2>
        <ul className="grid gap-2">
          {next ? (
            <PlanLink
              href="lesson"
              lessonId={next.id}
              title={next.title}
              detail={`${next.minutes} min lesson`}
            />
          ) : (
            <PlanLink href="lesson" lessonId="week" title="A week that keeps moving" detail="Review the plan" />
          )}
          <PlanLink href="practice" mode="drill" title="Find the note" detail="Eight notes" />
          {drill ? (
            <PlanLink href="practice" mode="drills" title={drill.title} detail={`${drill.focus} drill`} />
          ) : (
            <PlanLink href="practice" mode="click" title="The click" detail="Five steady minutes" />
          )}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-medium">Setlist</h2>
        <Link
          to="/songs"
          className="press flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface px-4 py-3"
        >
          <span>
            <span className="block font-medium">{song ? song.title : "Songs"}</span>
            <span className="mt-1 block text-sm text-muted">
              {song
                ? `${song.tag ?? "Song"} · ready now`
                : songsReady === songs.length
                  ? "You've opened the whole setlist"
                  : `${songsReady} of ${songs.length} open`}
            </span>
          </span>
          <span className="text-sm text-subtle">Open</span>
        </Link>
      </section>

      {showInstall ? (
        <Card className="mt-6">
          <h2 className="font-medium">Keep it on your home screen</h2>
          <p className="mt-2 text-sm text-muted">
            On iPhone, tap Share, then Add to Home Screen. Lowline opens full screen, and your progress stays on
            this phone.
          </p>
          <button type="button" className="press mt-3 text-sm text-muted" onClick={dismissInstall}>
            Dismiss
          </button>
        </Card>
      ) : null}
    </div>
  );
}

function PlanLink(
  props:
    | { href: "lesson"; lessonId: string; title: string; detail: string }
    | { href: "practice"; mode: "drill" | "click" | "drills"; title: string; detail: string },
) {
  const className =
    "press flex items-center justify-between gap-3 rounded-3xl border border-line bg-surface px-4 py-3";
  const body = (
    <>
      <span>
        <span className="block font-medium">{props.title}</span>
        <span className="mt-1 block text-sm text-muted">{props.detail}</span>
      </span>
      <span className="text-sm text-subtle">Open</span>
    </>
  );
  if (props.href === "lesson") {
    return (
      <li>
        <Link to="/lesson/$lessonId" params={{ lessonId: props.lessonId }} className={className}>
          {body}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <Link to="/practice" search={{ mode: props.mode }} className={className}>
        {body}
      </Link>
    </li>
  );
}

