import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { PatternBlock } from "@/components/pattern-block";
import { Button } from "@/components/ui/button";
import {
  LESSONS,
  getLesson,
  isUnlocked,
  lessonIndex,
  nextLesson,
  previousLesson,
  stageById,
} from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { todayKey } from "@/lib/bass/stats";
import { useMounted } from "@/lib/use-mounted";

export const Route = createFileRoute("/lesson/$lessonId")({ component: LessonPage });

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = getLesson(lessonId);
  const completed = useProgress((state) => state.completed);
  const completeLesson = useProgress((state) => state.completeLesson);
  const logGroove = useProgress((state) => state.logGroove);
  const grooveDay = useProgress((state) => state.grooveDay);
  const setBpm = useProgress((state) => state.setBpm);
  const mounted = useMounted();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId]);

  if (!lesson) {
    return (
      <div>
        <h1 className="font-display text-3xl tracking-tight">That lesson isn't on the path.</h1>
        <Button asChild className="mt-6" variant="secondary">
          <Link to="/path">Back to the path</Link>
        </Button>
      </div>
    );
  }

  const unlocked = isUnlocked(lesson.id, completed);
  if (!unlocked) {
    const previous = previousLesson(lesson.id);
    return (
      <div>
        <p className="text-sm text-muted">Locked</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">{lesson.title}</h1>
        <p className="mt-3 text-muted">This one opens when the lesson before it is done.</p>
        {previous ? (
          <Button asChild className="mt-6 w-full" size="lg">
            <Link to="/lesson/$lessonId" params={{ lessonId: previous.id }}>
              Go to {previous.title}
            </Link>
          </Button>
        ) : null}
      </div>
    );
  }

  const done = completed.includes(lesson.id);
  const stage = stageById(lesson.stage);
  const position = lessonIndex(lesson.id) + 1;
  const following = LESSONS[lessonIndex(lesson.id) + 1] ?? null;
  const logged = mounted && grooveDay[lesson.id] === todayKey();

  return (
    <article>
      <Link to="/path" className="press mb-4 inline-flex items-center gap-1 text-sm text-muted">
        <ChevronLeft className="size-4" />
        Path
      </Link>
      <p className="text-sm text-muted">
        {stage.index} · {stage.title}
        {lesson.tag ? ` · ${lesson.tag}` : ""} · {position} of {LESSONS.length}
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-balance">{lesson.title}</h1>
      <p className="mt-3 text-muted">{lesson.summary}</p>

      <div className="mt-6 grid gap-5">
        {lesson.paragraphs.map((section) => (
          <section key={section.heading}>
            <h2 className="font-medium">{section.heading}</h2>
            <div className="mt-2 grid gap-3 text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {lesson.pattern ? (
        <div className="mt-6">
          <PatternBlock
            key={lesson.id}
            steps={lesson.pattern.steps}
            bpm={lesson.pattern.bpm}
            note={lesson.pattern.note}
            logged={logged}
            onLog={() => logGroove(lesson.id, lesson.pattern!.steps, lesson.pattern!.bpm)}
          />
        </div>
      ) : null}

      <section className="mt-6 rounded-3xl border border-line bg-surface p-4">
        <h2 className="font-medium">Try this</h2>
        <p className="mt-2 text-muted">{lesson.tryThis}</p>
      </section>

      {lesson.tool ? (
        <Button asChild variant="secondary" className="mt-4 w-full" size="lg">
          <Link
            to="/practice"
            search={
              lesson.tool.bpm
                ? { mode: lesson.tool.mode, bpm: lesson.tool.bpm }
                : { mode: lesson.tool.mode }
            }
            onClick={() => {
              if (lesson.tool?.bpm) setBpm(lesson.tool.bpm);
            }}
          >
            {lesson.tool.label}
          </Link>
        </Button>
      ) : null}

      <div className="mt-4 grid gap-2">
        {done ? (
          following ? (
            <Button asChild size="lg">
              <Link to="/lesson/$lessonId" params={{ lessonId: following.id }}>
                Next: {following.title}
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link to="/">Back to today</Link>
            </Button>
          )
        ) : (
          <Button size="lg" onClick={() => completeLesson(lesson.id)}>
            I can do this
          </Button>
        )}
        {done ? <p className="text-center text-sm text-subtle">Logged. Replay it whenever you want.</p> : null}
        {!done && nextLesson(completed)?.id === lesson.id ? (
          <p className="text-center text-sm text-subtle">Mark it only when the try-this is real.</p>
        ) : null}
      </div>
    </article>
  );
}
