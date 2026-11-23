export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function yesterdayKey(date = new Date()) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - 1);
  return todayKey(copy);
}

export function greeting(name: string, date = new Date()) {
  const hour = date.getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const trimmed = name.trim();
  return trimmed ? `${part}, ${trimmed}` : part;
}

export const RANKS = [
  { min: 0, name: "Day one" },
  { min: 30, name: "Open strings" },
  { min: 80, name: "First position" },
  { min: 150, name: "On the click" },
  { min: 240, name: "Roots" },
  { min: 360, name: "Grooves" },
  { min: 520, name: "Shapes" },
  { min: 720, name: "The pocket" },
  { min: 960, name: "Low end" },
  { min: 1250, name: "Working bass" },
  { min: 1500, name: "Setlist" },
  { min: 1850, name: "Heavy" },
] as const;

export function rankFor(xp: number) {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i]!.min) index = i;
  }
  const current = RANKS[index]!;
  const next = RANKS[index + 1] ?? null;
  const span = next ? next.min - current.min : 0;
  const into = xp - current.min;
  const pct = next && span > 0 ? Math.min(1, into / span) : 1;
  const remain = next ? Math.max(0, next.min - xp) : 0;
  return {
    index,
    level: index + 1,
    name: current.name,
    nextName: next?.name ?? null,
    pct,
    remain,
  };
}

export function totalMinutes(map: Record<string, number>) {
  let sum = 0;
  for (const value of Object.values(map)) sum += value;
  return sum;
}

export function last7(map: Record<string, number>, now = new Date()) {
  const days: { key: string; label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = todayKey(date);
    days.push({
      key,
      label: date.toLocaleDateString(undefined, { weekday: "narrow" }),
      minutes: map[key] ?? 0,
    });
  }
  return days;
}

export type DayCell = {
  key: string;
  minutes: number;
  today: boolean;
  future: boolean;
};

/** Twelve weeks, Monday-first, oldest week first. Each week is a column of 7 days. */
export function calendarWeeks(map: Record<string, number>, weeks = 12, now = new Date()): DayCell[][] {
  const today = todayKey(now);
  const mondayOffset = (now.getDay() + 6) % 7;
  const thisMonday = new Date(now);
  thisMonday.setHours(12, 0, 0, 0);
  thisMonday.setDate(now.getDate() - mondayOffset);
  const start = new Date(thisMonday);
  start.setDate(thisMonday.getDate() - (weeks - 1) * 7);

  const columns: DayCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const column: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = todayKey(date);
      column.push({
        key,
        minutes: map[key] ?? 0,
        today: key === today,
        future: key > today,
      });
    }
    columns.push(column);
  }
  return columns;
}

export function practicedDays(columns: DayCell[][]) {
  let count = 0;
  for (const week of columns) {
    for (const day of week) {
      if (!day.future && day.minutes > 0) count += 1;
    }
  }
  return count;
}

export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
