import { useEffect, useMemo, useRef, useState } from "react";
import { subjects } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Timer, Play, Pause, Square, Plus, Flame, TrendingUp, CalendarDays } from "lucide-react";
import { useCloudData } from "@/hooks/useCloudData";

export type StudyEntry = {
  date: string; // YYYY-MM-DD
  subject: string;
  topic: string;
  minutes: number;
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const dateNDaysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export default function StudyTimer({ onLogged }: { onLogged?: () => void }) {
  const { addStudyEntry, studyLog } = useCloudData();
  const [subject, setSubject] = useState<string>(subjects[0].name);
  const [topic, setTopic] = useState<string>("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [manualMin, setManualMin] = useState<string>("");
  const intervalRef = useRef<number | null>(null);

  const topicsForSubject = useMemo(() => {
    const s = subjects.find((x) => x.name === subject);
    return s ? [...s.highTopics, ...s.lowTopics] : [];
  }, [subject]);

  useEffect(() => {
    if (topicsForSubject.length && !topicsForSubject.includes(topic)) {
      setTopic(topicsForSubject[0]);
    }
  }, [topicsForSubject, topic]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const stopAndLog = () => {
    setRunning(false);
    const minutes = Math.max(1, Math.round(seconds / 60));
    if (seconds < 30) {
      setSeconds(0);
      return;
    }
    void addStudyEntry({ date: todayStr(), subject, topic, minutes });
    setSeconds(0);
    onLogged?.();
  };

  const addManual = () => {
    const m = parseInt(manualMin, 10);
    if (!m || m <= 0) return;
    void addStudyEntry({ date: todayStr(), subject, topic, minutes: m });
    setManualMin("");
    onLogged?.();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const today = todayStr();
  const todayEntries = studyLog.filter((e) => e.date === today);
  const todayTotal = todayEntries.reduce((s, e) => s + e.minutes, 0);

  return (
    <Card className="border-border/60 bg-gradient-card p-6 shadow-elegant">
      <div className="mb-4 flex items-center gap-2">
        <Timer className="h-5 w-5 text-accent" />
        <h3 className="font-display text-xl font-semibold text-primary">Study Timer</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Topic</label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {topicsForSubject.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-6">
        <div className="font-display text-6xl font-semibold tabular-nums text-primary">{mm}:{ss}</div>
        <div className="flex gap-2">
          {!running ? (
            <Button onClick={() => setRunning(true)} size="sm"><Play className="mr-1 h-4 w-4" />Start</Button>
          ) : (
            <Button onClick={() => setRunning(false)} size="sm" variant="secondary"><Pause className="mr-1 h-4 w-4" />Pause</Button>
          )}
          <Button onClick={stopAndLog} size="sm" variant="outline"><Square className="mr-1 h-4 w-4" />Stop & Log</Button>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Add minutes manually</label>
          <Input type="number" min="1" placeholder="e.g. 45" value={manualMin} onChange={(e) => setManualMin(e.target.value)} />
        </div>
        <Button onClick={addManual} size="sm" variant="outline"><Plus className="mr-1 h-4 w-4" />Log</Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-sm">
        <Badge variant="outline" className="border-secondary/40 text-secondary">
          <CalendarDays className="mr-1 h-3 w-3" /> Today: {todayTotal} min
        </Badge>
        {todayEntries.length > 0 && (
          <span className="text-xs text-muted-foreground">{todayEntries.length} session{todayEntries.length > 1 ? "s" : ""} logged</span>
        )}
      </div>
    </Card>
  );
}

/* ---------- Stats & Streaks ---------- */

export function StudyStats({ refreshKey = 0 }: { refreshKey?: number }) {
  const { studyLog: log } = useCloudData();
  void refreshKey;

  const byDate = useMemo(() => {
    const m = new Map<string, number>();
    log.forEach((e) => m.set(e.date, (m.get(e.date) ?? 0) + e.minutes));
    return m;
  }, [log]);

  // Streak: consecutive days up to today with >0 minutes
  const currentStreak = (() => {
    let n = 0;
    for (let i = 0; i < 365; i++) {
      const d = dateNDaysAgo(i);
      if ((byDate.get(d) ?? 0) > 0) n++;
      else break;
    }
    return n;
  })();

  const longestStreak = (() => {
    const dates = [...byDate.keys()].sort();
    let best = 0, cur = 0, prev: string | null = null;
    for (const d of dates) {
      if (prev) {
        const diff = (new Date(d).getTime() - new Date(prev).getTime()) / 86400000;
        cur = diff === 1 ? cur + 1 : 1;
      } else cur = 1;
      best = Math.max(best, cur);
      prev = d;
    }
    return best;
  })();

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = dateNDaysAgo(6 - i);
    return { date: d, minutes: byDate.get(d) ?? 0 };
  });
  const week7Total = last7.reduce((s, x) => s + x.minutes, 0);
  const activeDays = last7.filter((x) => x.minutes > 0).length;
  const consistency = Math.round((activeDays / 7) * 100);
  const maxMin = Math.max(60, ...last7.map((x) => x.minutes));

  // Per-subject minutes (last 30 days)
  const last30 = new Set(Array.from({ length: 30 }, (_, i) => dateNDaysAgo(i)));
  const perSubject = new Map<string, number>();
  log.filter((e) => last30.has(e.date)).forEach((e) => {
    perSubject.set(e.subject, (perSubject.get(e.subject) ?? 0) + e.minutes);
  });
  const subjectStats = [...perSubject.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Flame className="h-4 w-4 text-gold" /> Current Streak
        </div>
        <div className="mt-2 font-display text-4xl font-semibold text-primary">{currentStreak} <span className="text-base font-normal text-muted-foreground">days</span></div>
        <div className="mt-1 text-xs text-muted-foreground">Longest: {longestStreak} days</div>
      </Card>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-secondary" /> 7-Day Consistency
        </div>
        <div className="mt-2 font-display text-4xl font-semibold text-primary">{consistency}%</div>
        <div className="mt-1 text-xs text-muted-foreground">{activeDays}/7 active days · {week7Total} min</div>
      </Card>

      <Card className="border-border/60 bg-gradient-card p-5 shadow-soft">
        <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Last 7 days</div>
        <div className="flex h-20 items-end gap-1.5">
          {last7.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-accent/70 transition-all"
                style={{ height: `${(d.minutes / maxMin) * 100}%`, minHeight: d.minutes > 0 ? "4px" : "1px" }}
                title={`${d.date}: ${d.minutes} min`}
              />
              <div className="text-[9px] text-muted-foreground">{new Date(d.date).toLocaleDateString(undefined, { weekday: "narrow" })}</div>
            </div>
          ))}
        </div>
      </Card>

      {subjectStats.length > 0 && (
        <Card className="border-border/60 bg-gradient-card p-5 shadow-soft md:col-span-3">
          <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Minutes per subject — last 30 days</div>
          <div className="space-y-2">
            {subjectStats.map(([name, mins]) => {
              const max = subjectStats[0][1];
              return (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-44 shrink-0 truncate text-sm text-foreground">{name}</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-secondary" style={{ width: `${(mins / max) * 100}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs tabular-nums text-muted-foreground">{mins} min</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}