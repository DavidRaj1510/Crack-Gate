import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { useCloudData } from "@/hooks/useCloudData";

const MONTHS = [
  { y: 2026, m: 4, label: "May 2026" },
  { y: 2026, m: 5, label: "Jun 2026" },
  { y: 2026, m: 6, label: "Jul 2026" },
  { y: 2026, m: 7, label: "Aug 2026" },
  { y: 2026, m: 8, label: "Sep 2026" },
  { y: 2026, m: 9, label: "Oct 2026" },
  { y: 2026, m: 10, label: "Nov 2026" },
  { y: 2026, m: 11, label: "Dec 2026" },
  { y: 2027, m: 0, label: "Jan 2027" },
];

const START = new Date(2026, 4, 6); // May 6, 2026
const END = new Date(2027, 0, 31);  // Jan 31, 2027
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function MonthlyStreaks({ refreshKey = 0 }: { refreshKey?: number }) {
  const { progressEntries } = useCloudData();
  void refreshKey;

  const topicsByDate = useMemo(() => {
    const m = new Map<string, number>();
    progressEntries.forEach((e) => m.set(e.date, (m.get(e.date) ?? 0) + 1));
    return m;
  }, [progressEntries]);

  const today = todayStr();

  // Build full day list across the prep window for totals + max streak
  const allDays = useMemo(() => {
    const out: { ds: string; count: number }[] = [];
    const d = new Date(START);
    while (d <= END) {
      const ds = fmt(d);
      out.push({ ds, count: topicsByDate.get(ds) ?? 0 });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, [topicsByDate]);

  let totalActive = 0;
  let maxStreak = 0;
  let run = 0;
  let currentStreak = 0;
  allDays.forEach((d) => {
    if (d.count > 0) {
      totalActive++;
      run++;
      maxStreak = Math.max(maxStreak, run);
    } else {
      run = 0;
    }
  });
  // current streak counted backwards from today (or last in-window day)
  const lastIdx = allDays.findIndex((d) => d.ds === today);
  const cap = lastIdx === -1 ? allDays.length - 1 : lastIdx;
  for (let i = cap; i >= 0; i--) {
    if (allDays[i].count > 0) currentStreak++;
    else break;
  }

  return (
    <section id="monthly-streaks" className="mb-16">
      <div className="mb-6 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          <CalendarRange className="h-5 w-5" /> Monthly Streaks
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-primary md:text-3xl">
          Your Month-by-Month Consistency
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every day you complete at least one topic lights up. Brighter = more topics finished.
        </p>
      </div>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>Total active days: <span className="font-semibold text-foreground">{totalActive}</span></span>
          <span>Max streak: <span className="font-semibold text-foreground">{maxStreak}</span></span>
          <span>Current: <span className="font-semibold text-gold">{currentStreak}🔥</span></span>
        </div>

        <div className="overflow-x-auto">
          <div className="flex items-start gap-3 min-w-max pb-2">
            {MONTHS.map((mo) => {
              const daysInMonth = new Date(mo.y, mo.m + 1, 0).getDate();
              const startPad = new Date(mo.y, mo.m, 1).getDay(); // Sun=0
              // Build columns of 7 (Sun..Sat) — leetcode-like grid
              const cells: ({ ds: string; count: number; inWindow: boolean; isToday: boolean } | null)[] = [];
              for (let i = 0; i < startPad; i++) cells.push(null);
              for (let i = 1; i <= daysInMonth; i++) {
                const d = new Date(mo.y, mo.m, i);
                const ds = fmt(d);
                const inWindow = d >= START && d <= END;
                cells.push({
                  ds,
                  count: topicsByDate.get(ds) ?? 0,
                  inWindow,
                  isToday: ds === today,
                });
              }
              while (cells.length % 7 !== 0) cells.push(null);
              const cols: typeof cells[] = [];
              for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

              return (
                <div key={mo.label} className="flex flex-col items-center">
                  <div className="flex gap-[3px]">
                    {cols.map((col, ci) => (
                      <div key={ci} className="flex flex-col gap-[3px]">
                        {col.map((c, ri) => {
                          if (!c) return <div key={ri} className="h-[11px] w-[11px]" />;
                          let cls = "bg-muted/40";
                          if (!c.inWindow) cls = "bg-muted/20";
                          else if (c.count >= 5) cls = "bg-success";
                          else if (c.count >= 3) cls = "bg-success/70";
                          else if (c.count === 2) cls = "bg-success/50";
                          else if (c.count === 1) cls = "bg-success/25";
                          return (
                            <div
                              key={ri}
                              title={`${c.ds}: ${c.count} topic${c.count === 1 ? "" : "s"}`}
                              className={`h-[11px] w-[11px] rounded-[2px] ${cls} ${c.isToday ? "ring-1 ring-gold" : ""}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-muted-foreground">
                    {mo.label.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          <div className="h-[11px] w-[11px] rounded-[2px] bg-muted/40" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-success/25" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-success/50" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-success/70" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-success" />
          <span>More</span>
        </div>
      </Card>
    </section>
  );
}