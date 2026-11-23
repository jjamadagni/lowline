import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Lock } from "lucide-react";
import { PageIntro } from "@/components/shell";
import { lessonsUntil, setlistLessons, isUnlocked } from "@/lib/bass/lessons";
import { useProgress } from "@/lib/bass/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/songs")({ component: SongsPage });

function SongsPage() {
  const completed = useProgress((state) => state.completed);
  const songs = setlistLessons();
  const ready = songs.filter((song) => isUnlocked(song.id, completed)).length;

  return (
    <div>
      <PageIntro kicker="Setlist" title="Songs at your level.">
        <p>
          {ready} of {songs.length} open. Original parts, not covers. Rock first. The heavy-metal ones open after the three-finger hand, the triplet, and the tritone.
        </p>
      </PageIntro>
      <ul className="grid gap-2">
        {songs.map((song) => {
          const unlocked = isUnlocked(song.id, completed);
          const done = completed.includes(song.id);
          const away = lessonsUntil(song.id, completed);
          const inner = (
            <>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{song.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {song.tag ?? "Song"}
                  {done ? " · played" : unlocked ? " · ready" : away === 1 ? " · 1 lesson away" : ` · ${away} lessons away`}
                </span>
              </span>
              {unlocked ? <ChevronRight className="size-4 text-subtle" /> : <Lock className="size-4 text-subtle" />}
            </>
          );
          if (!unlocked) {
            return (
              <li
                key={song.id}
                className={cn(
                  "flex items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-3 opacity-60",
                )}
              >
                {inner}
              </li>
            );
          }
          return (
            <li key={song.id}>
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: song.id }}
                className="press flex items-center gap-3 rounded-3xl border border-line bg-surface px-4 py-3"
              >
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm text-subtle">
        A locked song is not a tease. The lesson before it is the reason the part will make sense.
      </p>
    </div>
  );
}
