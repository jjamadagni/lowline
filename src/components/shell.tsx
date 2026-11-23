import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AudioLines, ChartColumn, House, Music2, Route, Volume2, VolumeX } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { resumeAudio, setMuted } from "@/lib/bass/audio";
import { useHydrateProgress, useProgress } from "@/lib/bass/store";
import { rankFor } from "@/lib/bass/stats";
import { cn } from "@/lib/utils";
import { Onboarding } from "@/components/onboarding";

const NAV = [
  { to: "/", label: "Today", icon: House },
  { to: "/path", label: "Path", icon: Route },
  { to: "/songs", label: "Songs", icon: Music2 },
  { to: "/practice", label: "Practice", icon: AudioLines },
  { to: "/progress", label: "Progress", icon: ChartColumn },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/path") return pathname === "/path" || pathname.startsWith("/lesson");
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SoundButton() {
  const sound = useProgress((state) => state.sound);
  const setSound = useProgress((state) => state.setSound);
  return (
    <button
      type="button"
      className="press grid size-11 place-items-center rounded-lg text-muted"
      aria-pressed={sound}
      aria-label={sound ? "Mute sound" : "Turn sound on"}
      onClick={() => setSound(!sound)}
    >
      {sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
    </button>
  );
}

export function AppShell() {
  useHydrateProgress();
  const onboarded = useProgress((state) => state.onboarded);
  const sound = useProgress((state) => state.sound);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setMuted(!sound);
  }, [sound]);

  useEffect(() => {
    const unlock = () => {
      void resumeAudio();
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  if (!onboarded) {
    return (
      <>
        <div hidden inert>
          <Outlet />
        </div>
        <Onboarding />
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-line md:flex md:flex-col md:justify-between md:p-6">
        <div>
          <div className="flex items-center gap-3 text-fg">
            <div className="string-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="font-display text-2xl tracking-tight">Lowline</p>
          </div>
          <nav className="mt-8 grid gap-1" aria-label="Primary">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "press flex h-11 items-center gap-3 rounded-lg px-3 text-sm",
                    active ? "bg-surface-2 text-fg" : "text-muted",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <SidebarStatus />
      </aside>
      <div className="relative flex min-h-dvh flex-col">
        <header className="safe-top sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg px-5 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <div className="string-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="font-display text-xl tracking-tight">Lowline</p>
          </div>
          <div className="flex items-center gap-1">
            <StreakLabel />
            <SoundButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-xl flex-1 px-5 pt-6 pb-28 md:px-8 md:pt-10 md:pb-12">
          <Outlet />
        </main>
        <nav
          className="tabbar fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg md:hidden"
          aria-label="Primary"
        >
          <ul className="mx-auto grid max-w-xl grid-cols-5">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex h-14 flex-col items-center justify-center gap-1 text-xs",
                      active ? "text-fg" : "text-subtle",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function StreakLabel() {
  const streak = useProgress((state) => state.streak);
  return (
    <p className="text-sm tabular-nums text-muted">
      {streak > 0 ? `${streak} day${streak === 1 ? "" : "s"}` : "No streak yet"}
    </p>
  );
}

function SidebarStatus() {
  const xp = useProgress((state) => state.xp);
  const rank = rankFor(xp);
  return (
    <div className="grid gap-3">
      <div>
        <p className="text-sm text-muted">Rank {rank.level}</p>
        <p className="font-display text-xl tracking-tight">{rank.name}</p>
        <div className="mt-2">
          <StreakLabel />
        </div>
      </div>
      <SoundButton />
    </div>
  );
}

export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6">
      {kicker ? <p className="mb-1 text-sm text-muted">{kicker}</p> : null}
      <h1 className="font-display text-3xl font-medium tracking-tight text-balance">{title}</h1>
      {children ? <div className="mt-2 text-muted">{children}</div> : null}
    </header>
  );
}
