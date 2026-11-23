import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight, Lock } from "lucide-react";
import { PageIntro } from "@/components/shell";
import { Meter } from "@/components/ui/meter";
import {
  LESSONS,
  STAGES,
  isUnlocked,
  lessonIndex,
  stageLessons,
} from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/path")({ component: PathPage });

function PathPage() {
  const completed = useProgress((state) => state.completed);
  const minutes = LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0);

  return (
    <div>
      <PageIntro kicker="The path" title="One lesson, then the next.">
        <p>
          {LESSONS.length} lessons · about {Math.round(minutes / 60)} hours. Notes, chords, scales, then rock and
          metal songs. Finish one to open the next.
        </p>
      </PageIntro>
      <div className="grid gap-8">
        {STAGES.map((stage) => {
          const lessons = stageLessons(stage.id);
          const done = lessons.filter((lesson) => completed.includes(lesson.id)).length;
          return (
            <section key={stage.id}>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{stage.index}</p>
                  <h2 className="font-display text-2xl tracking-tight">{stage.title}</h2>
                  <p className="mt-1 text-sm text-muted">{stage.blurb}</p>
                </div>
                <p className="text-sm tabular-nums text-muted">
                  {done}/{lessons.length}
                </p>
              </div>
              <Meter value={lessons.length === 0 ? 0 : done / lessons.length} label={`${stage.title} progress`} />
              <ul className="mt-3 grid gap-2">
                {lessons.map((lesson) => {
                  const unlocked = isUnlocked(lesson.id, completed);
                  const isDone = completed.includes(lesson.id);
                  const number = String(lessonIndex(lesson.id) + 1).padStart(2, "0");
                  const inner = (
                    <>
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-lg text-sm tabular-nums",
                          isDone ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                        )}
                      >
                        {isDone ? <Check className="size-4" /> : number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{lesson.title}</span>
                        <span className="mt-1 block text-sm text-muted">
                          {lesson.minutes} min{lesson.tag ? ` · ${lesson.tag}` : ""}
                        </span>
                      </span>
                      {unlocked ? (
                        <ChevronRight className="size-4 text-subtle" />
                      ) : (
                        <Lock className="size-4 text-subtle" />
                      )}
                    </>
                  );
                  if (!unlocked) {
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-3 opacity-60"
                      >
                        {inner}
                      </li>
                    );
                  }
                  return (
                    <li key={lesson.id}>
                      <Link
                        to="/lesson/$lessonId"
                        params={{ lessonId: lesson.id }}
                        className="press flex items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-3"
                      >
                        {inner}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
