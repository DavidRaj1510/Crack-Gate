import { subjects, monthlyPlan, resources } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import SectionHead from "@/components/SectionHead";

const sortedSubjects = [...subjects].sort((a, b) => b.avgMarks - a.avgMarks);

export default function Topics() {
  return (
    <main className="container mx-auto px-6 py-16 md:py-24">
      <section id="topics" className="mb-24">
        <SectionHead
          icon={<Target className="h-5 w-5" />}
          eyebrow="Topic-level Priority"
          title="What to Study, What to Skim"
          desc="High-weightage topics first. Low-weightage topics still covered — never skipped, just deprioritized."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {sortedSubjects.map((s) => (
            <Card
              key={s.name}
              className="overflow-hidden border-border/60 bg-gradient-card p-6 shadow-soft transition-all hover:shadow-elegant"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.short}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-primary">{s.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl font-semibold text-secondary">
                    {s.avgMarks}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    avg marks
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm italic text-secondary">
                💡 {s.strategy}
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> High Priority — Master these
                </div>
                <ul className="space-y-1.5">
                  {s.highTopics.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" /> Low Priority — Quick read
                </div>
                <ul className="space-y-1.5">
                  {s.lowTopics.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="roadmap" className="mb-24">
        <SectionHead
          icon={<Calendar className="h-5 w-5" />}
          eyebrow="9-Month Roadmap"
          title="Your Month-by-Month Plan"
          desc="From May 2026 to GATE 2027. Phased execution beats random hustle."
        />

        <div className="relative space-y-6 border-l-2 border-dashed border-accent/40 pl-8 md:pl-12">
          {monthlyPlan.map((p, i) => (
            <div key={p.phase} className="relative">
              <div className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-semibold text-accent-foreground shadow-elegant md:-left-[50px]">
                {i + 1}
              </div>
              <Card className="border-border/60 bg-gradient-card p-6 shadow-soft">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl font-semibold text-primary">{p.phase}</h3>
                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                    {p.duration}
                  </Badge>
                </div>
                <div className="mb-3 text-sm font-medium text-accent">{p.months}</div>
                <div className="mb-2 text-sm">
                  <span className="font-semibold text-foreground">Focus: </span>
                  <span className="text-muted-foreground">{p.focus}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Goal: </span>
                  <span className="text-muted-foreground">{p.goal}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="mb-12">
        <SectionHead
          icon={<BookOpen className="h-5 w-5" />}
          eyebrow="Curated Resources"
          title="Books & Lectures (Quality over Quantity)"
          desc="Stick to one source per subject. Switching mid-prep wastes weeks."
        />

        <Card className="overflow-hidden border-border/60 shadow-elegant">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Subject</th>
                  <th className="px-4 py-3 text-left font-medium">Recommended Books</th>
                  <th className="px-4 py-3 text-left font-medium">Video Lectures</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.subject} className="border-t border-border/60 hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-primary">{r.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.books}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.lectures}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  );
}