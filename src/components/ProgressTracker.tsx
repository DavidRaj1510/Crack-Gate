import { useEffect, useMemo, useState } from "react";
import { subjects, monthlyPlan } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListChecks, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gate2027-progress-v1";

type ProgressMap = Record<string, boolean>;

const topicId = (subject: string, topic: string) => `${subject}::${topic}`;

const allTopics = subjects.flatMap((s) =>
  [...s.highTopics, ...s.lowTopics].map((t) => ({
    id: topicId(s.name, t),
    subjectName: s.name,
    subjectShort: s.short,
    topic: t,
    priority: s.highTopics.includes(t) ? ("High" as const) : ("Low" as const),
  })),
);

export default function ProgressTracker() {
  const [done, setDone] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (id: string) => setDone((p) => ({ ...p, [id]: !p[id] }));
  const reset = () => {
    if (confirm("Reset all progress? This cannot be undone.")) setDone({});
  };

  const totalDone = Object.values(done).filter(Boolean).length;
  const totalTopics = allTopics.length;
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;

  const perSubject = useMemo(
    () =>
      subjects.map((s) => {
        const topics = [...s.highTopics, ...s.lowTopics];
        const completed = topics.filter((t) => done[topicId(s.name, t)]).length;
        return {
          subject: s,
          completed,
          total: topics.length,
          pct: topics.length ? Math.round((completed / topics.length) * 100) : 0,
        };
      }),
    [done],
  );

  const perMonth = useMemo(
    () =>
      monthlyPlan.map((p) => {
        const inPhase = subjects.filter((s) => p.subjectShorts.includes(s.short));
        const topics = inPhase.flatMap((s) =>
          [...s.highTopics, ...s.lowTopics].map((t) => topicId(s.name, t)),
        );
        const completed = topics.filter((id) => done[id]).length;
        return {
          phase: p,
          completed,
          total: topics.length,
          pct: topics.length ? Math.round((completed / topics.length) * 100) : 0,
        };
      }),
    [done],
  );

  return (
    <section id="tracker" className="mb-24">
      <div className="mb-10 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          <ListChecks className="h-5 w-5" /> Your Progress
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          Track Topics. Watch Completion Rise.
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Tick off topics as you finish them. Saved locally on this device.
        </p>
      </div>

      {/* Overall */}
      <Card className="mb-8 border-border/60 bg-gradient-card p-6 shadow-elegant">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Overall completion</div>
            <div className="mt-1 font-display text-4xl font-semibold text-primary">
              {overallPct}% <span className="text-base font-normal text-muted-foreground">· {totalDone}/{totalTopics} topics</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
        <Progress value={overallPct} className="mt-4 h-3" />
      </Card>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="months">By Month / Phase</TabsTrigger>
        </TabsList>

        {/* Subject view */}
        <TabsContent value="subjects" className="space-y-4">
          {perSubject.map(({ subject: s, completed, total, pct }) => (
            <Card key={s.name} className="border-border/60 bg-gradient-card p-5 shadow-soft">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary">{s.name}</h3>
                  <div className="text-xs text-muted-foreground">{completed}/{total} topics · {s.avgMarks} avg marks</div>
                </div>
                <Badge variant="outline" className="border-secondary/40 text-secondary">{pct}%</Badge>
              </div>
              <Progress value={pct} className="mb-4 h-2" />
              <ul className="space-y-2">
                {[...s.highTopics, ...s.lowTopics].map((t) => {
                  const id = topicId(s.name, t);
                  const isHigh = s.highTopics.includes(t);
                  const checked = !!done[id];
                  return (
                    <li key={id} className="flex items-start gap-3">
                      <Checkbox id={id} checked={checked} onCheckedChange={() => toggle(id)} className="mt-0.5" />
                      <label
                        htmlFor={id}
                        className={`flex-1 cursor-pointer text-sm ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {t}
                        <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase ${isHigh ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {isHigh ? "High" : "Low"}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </TabsContent>

        {/* Month / Phase view */}
        <TabsContent value="months" className="space-y-4">
          {perMonth.map(({ phase: p, completed, total, pct }) => (
            <Card key={p.phase} className="border-border/60 bg-gradient-card p-5 shadow-soft">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary">{p.phase}</h3>
                  <div className="text-xs text-accent">{p.months}</div>
                </div>
                <Badge variant="outline" className="border-secondary/40 text-secondary">
                  {total > 0 ? `${pct}%` : "Revision"}
                </Badge>
              </div>
              {total > 0 ? (
                <>
                  <div className="mb-2 text-xs text-muted-foreground">{completed}/{total} topics in this phase</div>
                  <Progress value={pct} className="h-2" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.subjectShorts.map((sh) => {
                      const sub = perSubject.find((x) => x.subject.short === sh);
                      if (!sub) return null;
                      return (
                        <Badge key={sh} variant="outline" className="border-border/60">
                          {sh}: {sub.pct}%
                        </Badge>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{p.goal}</p>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}