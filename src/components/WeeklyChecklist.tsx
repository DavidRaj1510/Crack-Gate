import { useEffect, useMemo, useState } from "react";
import { subjects } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListTodo, RefreshCw } from "lucide-react";

const PROGRESS_KEY = "gate2027-progress-v1";
const WEEK_KEY = "gate2027-weekly-v1";
const TARGET = 10;

const topicId = (subject: string, topic: string) => `${subject}::${topic}`;

function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

type StoredWeek = { weekStart: string; topicIds: string[] };

export default function WeeklyChecklist() {
  const [weekly, setWeekly] = useState<StoredWeek | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const weekStart = getMonday();

  // Load progress map
  const loadDone = () => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      setDone(raw ? JSON.parse(raw) : {});
    } catch {
      setDone({});
    }
  };

  useEffect(() => {
    loadDone();
    try {
      const raw = localStorage.getItem(WEEK_KEY);
      if (raw) {
        const parsed: StoredWeek = JSON.parse(raw);
        if (parsed.weekStart === weekStart) {
          setWeekly(parsed);
          return;
        }
      }
    } catch {}
    generate(true);
  }, []);

  const allHighUnfinished = useMemo(() => {
    const arr: { id: string; subject: string; subjectShort: string; topic: string; avgMarks: number }[] = [];
    subjects.forEach((s) => {
      s.highTopics.forEach((t) => {
        const id = topicId(s.name, t);
        if (!done[id]) arr.push({ id, subject: s.name, subjectShort: s.short, topic: t, avgMarks: s.avgMarks });
      });
    });
    // Sort by subject avg marks (highest weight first)
    arr.sort((a, b) => b.avgMarks - a.avgMarks);
    return arr;
  }, [done]);

  const generate = (silent = false) => {
    // Pick top TARGET unfinished high-priority topics, prefer subject diversity
    const seen = new Map<string, number>();
    const picked: string[] = [];
    for (const t of allHighUnfinished) {
      const c = seen.get(t.subject) ?? 0;
      if (c < 2) {
        picked.push(t.id);
        seen.set(t.subject, c + 1);
      }
      if (picked.length >= TARGET) break;
    }
    // Fill remaining if needed
    if (picked.length < TARGET) {
      for (const t of allHighUnfinished) {
        if (!picked.includes(t.id)) picked.push(t.id);
        if (picked.length >= TARGET) break;
      }
    }
    const w = { weekStart, topicIds: picked };
    setWeekly(w);
    localStorage.setItem(WEEK_KEY, JSON.stringify(w));
    if (!silent) loadDone();
  };

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };

  const items = (weekly?.topicIds ?? []).map((id) => {
    const [subjectName, topic] = id.split("::");
    const s = subjects.find((x) => x.name === subjectName);
    return { id, subject: subjectName, subjectShort: s?.short ?? "", topic, avgMarks: s?.avgMarks ?? 0 };
  });

  const completed = items.filter((i) => done[i.id]).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <Card className="border-border/60 bg-gradient-card p-6 shadow-elegant">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-accent" />
          <h3 className="font-display text-xl font-semibold text-primary">This Week's Checklist</h3>
        </div>
        <Button size="sm" variant="outline" onClick={() => generate()}>
          <RefreshCw className="mr-1 h-4 w-4" /> Regenerate
        </Button>
      </div>
      <div className="mb-4 text-xs text-muted-foreground">
        Week of {weekStart} · Top {TARGET} highest-priority unfinished topics across all subjects
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Progress value={pct} className="h-2 flex-1" />
        <span className="text-sm font-medium text-secondary tabular-nums">{completed}/{items.length}</span>
      </div>

      <ul className="space-y-2">
        {items.map((i) => {
          const checked = !!done[i.id];
          return (
            <li key={i.id} className="flex items-start gap-3 rounded-md border border-border/40 p-3">
              <Checkbox checked={checked} onCheckedChange={() => toggle(i.id)} className="mt-0.5" />
              <div className="flex-1">
                <div className={`text-sm ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}>{i.topic}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-border/60 text-[10px]">{i.subjectShort}</Badge>
                  <span>{i.subject} · {i.avgMarks} avg marks</span>
                </div>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="rounded-md border border-success/30 bg-success/5 p-4 text-sm text-success">
            🎉 All high-priority topics complete! Move to revision and mocks.
          </li>
        )}
      </ul>
    </Card>
  );
}