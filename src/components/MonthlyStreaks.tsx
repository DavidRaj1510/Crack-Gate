import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, CalendarRange } from "lucide-react";
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
  const { studyLog: log } = useCloudData();
  void refreshKey;

  const minutesByDate = useMemo(() => {
    const m = new Map<string, number>();
    log.forEach((e) => m.set(e.date, (m.get(e.date) ?? 0) + e.minutes));
    return m;
  }, [log]);

  const today = todayStr();

  return (
    <section id="monthly-streaks" className="mb-24">
      <div className="mb-10 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          <CalendarRange className="h-5 w-5" /> Monthly Streaks
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          Your Month-by-Month Consistency
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Every day you log study time lights up. Don't break the chain — from May 6, 2026 to Jan 31, 2027.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MONTHS.map((mo) => {
          const daysInMonth = new Date(mo.y, mo.m + 1, 0).getDate();
          const days = Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(mo.y, mo.m, i + 1);
            const ds = fmt(d);
            const inWindow = d >= START && d <= END;
            const mins = minutesByDate.get(ds) ?? 0;
            return { date: d, ds, inWindow, mins, isToday: ds === today };
          });

          // Streak: longest consecutive in-window days with mins > 0
          let longest = 0, cur = 0;
          let current = 0; // active streak ending today (only counts if mo contains today or earlier)
          let runningCur = 0;
          days.forEach((d) => {
            if (d.inWindow && d.mins > 0) {
              cur++;
              longest = Math.max(longest, cur);
              runningCur = cur;
            } else if (d.inWindow) {
              cur = 0;
              runningCur = 0;
            }
          });
          // Determine current streak ending today within this month (if today is in this month)
          if (today.startsWith(`${mo.y}-${String(mo.m + 1).padStart(2, "0")}`)) {
            current = runningCur;
          }

          const activeDays = days.filter((d) => d.inWindow && d.mins > 0).length;
          const totalActive = days.filter((d) => d.inWindow).length;
          const pct = totalActive ? Math.round((activeDays / totalActive) * 100) : 0;

          // Pad start so first cell aligns with day-of-week (Sun=0)
          const startPad = new Date(mo.y, mo.m, 1).getDay();

          return (
            <Card key={mo.label} className="border-border/60 bg-gradient-card p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-primary">{mo.label}</h3>
                <Badge variant="outline" className="border-gold/40 text-gold">
                  <Flame className="mr-1 h-3 w-3" /> {longest}d
                </Badge>
              </div>

              <div className="mb-3 grid grid-cols-7 gap-1.5">
                {["S","M","T","W","T","F","S"].map((d, i) => (
                  <div key={i} className="text-center text-[9px] font-medium uppercase text-muted-foreground">{d}</div>
                ))}
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {days.map((d) => {
                  let cls = "bg-muted/40";
                  if (!d.inWindow) cls = "bg-muted/20 opacity-40";
                  else if (d.mins >= 240) cls = "bg-success";
                  else if (d.mins >= 120) cls = "bg-success/70";
                  else if (d.mins >= 60) cls = "bg-success/45";
                  else if (d.mins > 0) cls = "bg-success/25";
                  return (
                    <div
                      key={d.ds}
                      title={`${d.ds}: ${d.mins} min${!d.inWindow ? " (outside prep window)" : ""}`}
                      className={`aspect-square rounded-sm ${cls} ${d.isToday ? "ring-2 ring-gold" : ""}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{activeDays}/{totalActive} active days</span>
                <span className="font-medium text-secondary">{pct}%</span>
              </div>
              {current > 0 && (
                <div className="mt-2 text-xs text-gold">🔥 Current streak: {current} days</div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted/40" />
        <div className="h-3 w-3 rounded-sm bg-success/25" />
        <div className="h-3 w-3 rounded-sm bg-success/45" />
        <div className="h-3 w-3 rounded-sm bg-success/70" />
        <div className="h-3 w-3 rounded-sm bg-success" />
        <span>More (4h+)</span>
      </div>
    </section>
  );
}