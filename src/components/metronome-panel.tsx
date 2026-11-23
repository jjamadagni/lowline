import * as Slider from "@radix-ui/react-slider";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Metro, resumeAudio } from "@/lib/bass/audio";
import { useProgress } from "@/lib/bass/store";
import { cn } from "@/lib/utils";

export function MetronomePanel() {
  const bpm = useProgress((state) => state.bpm);
  const setBpm = useProgress((state) => state.setBpm);
  const beats = useProgress((state) => state.beats);
  const setBeats = useProgress((state) => state.setBeats);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const metroRef = useRef<Metro | null>(null);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    const metro = new Metro((next) => setBeat(next));
    metroRef.current = metro;
    return () => metro.stop();
  }, []);

  useEffect(() => {
    const metro = metroRef.current;
    if (!metro) return;
    metro.bpm = bpm;
    metro.beatsPerBar = beats;
  }, [bpm, beats]);

  async function toggle() {
    const metro = metroRef.current;
    if (!metro) return;
    if (running) {
      metro.stop();
      setRunning(false);
      return;
    }
    await resumeAudio();
    metro.bpm = bpm;
    metro.beatsPerBar = beats;
    metro.start();
    setRunning(true);
  }

  function tap() {
    const now = performance.now();
    const recent = taps.current.filter((time) => now - time < 2000);
    recent.push(now);
    taps.current = recent.slice(-5);
    if (recent.length < 2) return;
    let total = 0;
    for (let i = 1; i < recent.length; i++) total += recent[i]! - recent[i - 1]!;
    setBpm(Math.round(60000 / (total / (recent.length - 1))));
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="press grid size-11 place-items-center rounded-lg border border-line bg-surface text-fg"
          aria-label="Slower"
          onClick={() => setBpm(bpm - 1)}
        >
          <Minus className="size-5" />
        </button>
        <p className="min-w-24 text-center font-display text-5xl tabular-nums tracking-tight">{bpm}</p>
        <button
          type="button"
          className="press grid size-11 place-items-center rounded-lg border border-line bg-surface text-fg"
          aria-label="Faster"
          onClick={() => setBpm(bpm + 1)}
        >
          <Plus className="size-5" />
        </button>
      </div>
      <Slider.Root
        min={40}
        max={200}
        step={1}
        value={[bpm]}
        onValueChange={(value) => setBpm(value[0] ?? bpm)}
        className="relative flex h-11 w-full touch-none items-center"
        aria-label="Tempo"
      >
        <Slider.Track className="relative h-1 grow rounded-full bg-surface-2">
          <Slider.Range className="absolute h-full rounded-full bg-accent" />
        </Slider.Track>
        <Slider.Thumb className="block size-6 rounded-full bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg" />
      </Slider.Root>
      <div className="grid grid-cols-2 gap-2">
        {([4, 3] as const).map((count) => (
          <button
            key={count}
            type="button"
            aria-pressed={beats === count}
            onClick={() => setBeats(count)}
            className={cn(
              "press h-11 rounded-lg border text-sm",
              beats === count ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg",
            )}
          >
            {count}/4
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2" aria-hidden="true">
        {Array.from({ length: beats }, (_, index) => (
          <span
            key={index}
            className={cn(
              "size-3 rounded-full",
              running && beat === index ? "bg-accent" : "bg-surface-2",
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => void toggle()}
          className="press h-12 rounded-lg bg-accent text-base font-medium text-accent-fg"
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={tap}
          className="press h-12 rounded-lg border border-line bg-surface text-base font-medium"
        >
          Tap tempo
        </button>
      </div>
      <p className="text-sm text-subtle">Start slow enough that the click feels late, then bring it back to you.</p>
    </div>
  );
}
