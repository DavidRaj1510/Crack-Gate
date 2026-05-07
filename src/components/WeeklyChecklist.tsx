import { useMemo, useState } from "react";
import { subjects } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListTodo, ChevronLeft, ChevronRight } from "lucide-react";
import { useCloudData } from "@/hooks/useCloudData";

const topicId = (subject: string, topic: string) => `${subject}::${topic}`;
const PER_WEEK = 14; // 2 topics × 7 days
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Item = { id: string; subject: string; subjectShort: string; topic: string; phase: string; priority: "High" | "Low" | "Revision" };

// Plan starts Monday May 4, 2026 (start of Phase 1)
const PLAN_START = new Date("2026-05-04T00:00:00");
const PLAN_END = new Date("2027-01-25T00:00:00"); // last week before GATE

function mondayOf(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Build the master topic stream, ordered by phase (subjectShorts) so each
// phase's subjects are covered in their target months.
function buildPlan() {
  // Order subjects by weightage descending so high-yield subjects come first.
  const ordered = [...subjects].sort((a, b) => b.weightagePct - a.weightagePct);
  const stream: Item[] = [];

  // Pass 1: every HIGH-yield topic across all subjects (highest weightage first)
  ordered.forEach((s) => {
    s.highTopics.forEach((t) => {
      stream.push({
        id: topicId(s.name, t),
        subject: s.name,
        subjectShort: s.short,
        topic: t,
        phase: "High-Yield Pass",
        priority: "High",
      });
    });
  });
  // Pass 2: every LOW-yield topic across all subjects
  ordered.forEach((s) => {
    s.lowTopics.forEach((t) => {
      stream.push({
        id: topicId(s.name, t),
        subject: s.name,
        subjectShort: s.short,
        topic: t,
        phase: "Low-Yield Pass",
        priority: "Low",
      });
    });
  });

  const totalWeeks = Math.max(
    1,
    Math.ceil((PLAN_END.getTime() - PLAN_START.getTime()) / (7 * 86400000)) + 1,
  );
  const weeks: Item[][] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const start = w * PER_WEEK;
    const slice = stream.slice(start, start + PER_WEEK);
    if (slice.length === 0) {
      // Revision weeks: cycle through high-priority topics
      const high: Item[] = ordered.flatMap((s) => s.highTopics.map((t) => ({
        id: topicId(s.name, t), subject: s.name, subjectShort: s.short, topic: `Revise: ${t}`, phase: "Revision", priority: "Revision" as const,
      })));
      const offset = (((w * PER_WEEK) - stream.length) % high.length + high.length) % high.length;
      weeks.push([...high.slice(offset, offset + PER_WEEK), ...high.slice(0, Math.max(0, PER_WEEK - (high.length - offset)))].slice(0, PER_WEEK));
    } else {
      weeks.push(slice);
    }
  }
  return weeks;
}

export default function WeeklyChecklist() {
  const { progress: done, toggleTopic } = useCloudData();
  const weeks = useMemo(buildPlan, []);

  const currentIndex = useMemo(() => {
    const today = mondayOf(new Date());
    const start = mondayOf(PLAN_START);
    const idx = Math.round((today.getTime() - start.getTime()) / (7 * 86400000));
    return Math.max(0, Math.min(weeks.length - 1, idx));
  }, [weeks.length]);

  const [weekIdx, setWeekIdx] = useState(currentIndex);
  const items = weeks[weekIdx] ?? [];

  const weekStartDate = useMemo(() => {
    const d = new Date(PLAN_START);
    d.setDate(d.getDate() + weekIdx * 7);
    return d;
  }, [weekIdx]);
  const weekEndDate = useMemo(() => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + 6);
    return d;
  }, [weekStartDate]);

  const completed = items.filter((i) => done[i.id]).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  // Split into 7 days × ~2 topics
  const byDay: Item[][] = Array.from({ length: 7 }, () => []);
  items.forEach((it, i) => byDay[i % 7].push(it));

  return (
    <Card className="border-border/60 bg-gradient-card p-6 shadow-elegant">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-accent" />
          <h3 className="font-display text-xl font-semibold text-primary">Weekly Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={weekIdx === 0} onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="border-border/60 text-xs">
            Week {weekIdx + 1} / {weeks.length}
          </Badge>
          <Button size="icon" variant="outline" className="h-8 w-8" disabled={weekIdx >= weeks.length - 1} onClick={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mb-4 text-xs text-muted-foreground">
        {fmt(weekStartDate)} – {fmt(weekEndDate)} · 1–2 topics per day · auto-updates each week
      </div>

      <div className="mb-5 flex items-center gap-3">
        <Progress value={pct} className="h-2 flex-1" />
        <span className="text-sm font-medium text-secondary tabular-nums">{completed}/{items.length}</span>
      </div>

      <div className="space-y-3">
        {byDay.map((dayItems, di) => (
          <div key={di} className="rounded-md border border-border/40 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {DAYS[di]}
            </div>
            <ul className="space-y-2">
              {dayItems.map((i) => {
                const checked = !!done[i.id];
                return (
                  <li key={i.id} className="flex items-start gap-3">
                    <Checkbox checked={checked} onCheckedChange={() => toggleTopic(i.id)} className="mt-0.5" />
                    <div className="flex-1">
                      <div className={`text-sm ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}>{i.topic}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="border-border/60 text-[10px]">{i.subjectShort}</Badge>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                            i.priority === "High"
                              ? "bg-success/15 text-success"
                              : i.priority === "Low"
                                ? "bg-muted text-muted-foreground"
                                : "bg-gold/15 text-gold"
                          }`}
                        >
                          {i.priority}
                        </span>
                        <span>{i.subject}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
              {dayItems.length === 0 && (
                <li className="text-xs italic text-muted-foreground">Rest / catch-up</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}