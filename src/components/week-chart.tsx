import { useEffect, useState } from "react";

type Point = { label: string; minutes: number };

type Charts = typeof import("recharts");

export function WeekChart({ data }: { data: Point[] }) {
  const [charts, setCharts] = useState<Charts | null>(null);

  useEffect(() => {
    let alive = true;
    void import("recharts").then((mod) => {
      if (alive) setCharts(mod);
    });
    return () => {
      alive = false;
    };
  }, []);

  const empty = data.every((point) => point.minutes === 0);
  if (empty) {
    return <p className="text-sm text-muted">Minutes show up here after you log a session.</p>;
  }
  if (!charts) return <div className="h-28" aria-hidden="true" />;

  const { ResponsiveContainer, BarChart, Bar, XAxis } = charts;
  return (
    <div className="h-28 w-full min-w-0" role="img" aria-label="Practice minutes over the last seven days">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={10}>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
          />
          <Bar dataKey="minutes" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
