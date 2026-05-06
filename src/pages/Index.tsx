import { subjects, monthlyPlan, resources, tips } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, BookOpen, CheckCircle2, AlertCircle, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";

const sortedSubjects = [...subjects].sort((a, b) => b.avgMarks - a.avgMarks);
const totalMarks = sortedSubjects.reduce((s, x) => s + x.avgMarks, 0);

const diffColor = (d: string) =>
  d === "Easy" ? "bg-success/15 text-success border-success/30"
  : d === "Moderate" ? "bg-accent/15 text-accent border-accent/30"
  : "bg-danger/15 text-danger border-danger/30";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="container relative mx-auto px-6 py-20 md:py-28">
          <Badge className="mb-6 border-gold/40 bg-gold/15 text-gold hover:bg-gold/20">
            <Trophy className="mr-1.5 h-3.5 w-3.5" /> Target: AIR &lt; 1000 · GATE CS 2027
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Smart Prep, Not <span className="italic text-gold">Hard</span> Prep.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/75 md:text-xl">
            A data-driven 9-month roadmap built on 15 years of GATE CS weightage analysis. Every subject covered. Zero wasted hours.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { l: "Days to GATE", v: "~275" },
              { l: "Total subjects", v: "12" },
              { l: "Total marks", v: "100" },
              { l: "Target score", v: "75+" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 backdrop-blur">
                <div className="font-display text-3xl font-semibold text-gold md:text-4xl">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 md:py-24">
        {/* SECTION 1: WEIGHTAGE TABLE */}
        <section id="weightage" className="mb-24">
          <SectionHead icon={<TrendingUp className="h-5 w-5" />} eyebrow="15-Year Analysis (2010–2024)" title="Subject Weightage — High to Low" desc="Average marks expected per subject based on past 15 GATE CS papers. Sorted by weightage." />

          <Card className="overflow-hidden border-border/60 shadow-elegant">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-4 text-left font-medium">#</th>
                    <th className="px-4 py-4 text-left font-medium">Subject</th>
                    <th className="px-4 py-4 text-left font-medium">Avg Marks</th>
                    <th className="px-4 py-4 text-left font-medium">Range (15 yrs)</th>
                    <th className="px-4 py-4 text-left font-medium">Weightage</th>
                    <th className="px-4 py-4 text-left font-medium">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSubjects.map((s, i) => (
                    <tr key={s.name} className="border-t border-border/60 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-4 font-display text-lg text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-4 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-4">
                        <span className="font-display text-2xl font-semibold text-secondary">{s.avgMarks}</span>
                        <span className="ml-1 text-xs text-muted-foreground">marks</span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{s.range}</td>
                      <td className="px-4 py-4 w-[200px]">
                        <div className="flex items-center gap-3">
                          <Progress value={(s.avgMarks / 15) * 100} className="h-2" />
                          <span className="text-xs font-medium text-muted-foreground tabular-nums">{s.weightagePct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${diffColor(s.difficulty)}`}>{s.difficulty}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary bg-muted/60 font-semibold">
                    <td className="px-4 py-4" />
                    <td className="px-4 py-4">Total</td>
                    <td className="px-4 py-4 font-display text-2xl text-primary">{totalMarks}</td>
                    <td className="px-4 py-4 text-muted-foreground">100</td>
                    <td className="px-4 py-4 text-muted-foreground">100%</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <p className="mt-4 text-sm text-muted-foreground">
            <AlertCircle className="mr-1 inline h-4 w-4" />
            Weightage may shift ±2 marks per subject. General Aptitude is fixed at 15 marks every year.
          </p>
        </section>

        {/* SECTION 2: TOPIC PRIORITY PER SUBJECT */}
        <section id="topics" className="mb-24">
          <SectionHead icon={<Target className="h-5 w-5" />} eyebrow="Topic-level Priority" title="What to Study, What to Skim" desc="High-weightage topics first. Low-weightage topics still covered — never skipped, just deprioritized." />

          <div className="grid gap-6 md:grid-cols-2">
            {sortedSubjects.map((s) => (
              <Card key={s.name} className="overflow-hidden border-border/60 bg-gradient-card p-6 shadow-soft transition-all hover:shadow-elegant">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.short}</div>
                    <h3 className="font-display text-xl font-semibold text-primary">{s.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-semibold text-secondary">{s.avgMarks}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">avg marks</div>
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

        {/* SECTION 3: ROADMAP */}
        <section id="roadmap" className="mb-24">
          <SectionHead icon={<Calendar className="h-5 w-5" />} eyebrow="9-Month Roadmap" title="Your Month-by-Month Plan" desc="From May 2026 to GATE 2027. Phased execution beats random hustle." />

          <div className="relative space-y-6 border-l-2 border-dashed border-accent/40 pl-8 md:pl-12">
            {monthlyPlan.map((p, i) => (
              <div key={p.phase} className="relative">
                <div className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-semibold text-accent-foreground shadow-elegant md:-left-[50px]">
                  {i + 1}
                </div>
                <Card className="border-border/60 bg-gradient-card p-6 shadow-soft">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold text-primary">{p.phase}</h3>
                    <Badge variant="outline" className="border-secondary/30 text-secondary">{p.duration}</Badge>
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

        {/* SECTION 4: RESOURCES */}
        <section id="resources" className="mb-24">
          <SectionHead icon={<BookOpen className="h-5 w-5" />} eyebrow="Curated Resources" title="Books & Lectures (Quality over Quantity)" desc="Stick to one source per subject. Switching mid-prep wastes weeks." />

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

        {/* SECTION 5: TIPS */}
        <section id="tips" className="mb-12">
          <SectionHead icon={<Trophy className="h-5 w-5" />} eyebrow="Rank-Boosting Habits" title="The Difference Between AIR 5000 and AIR 500" desc="Small disciplines that compound over 9 months." />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((t, i) => (
              <Card key={t.title} className="group border-border/60 bg-gradient-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-3 font-display text-3xl font-semibold text-gold/70 group-hover:text-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mb-2 font-display text-lg font-semibold text-primary">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 6: PROGRESS TRACKER */}
        <ProgressTracker />
      </main>

      <footer className="border-t border-border bg-primary py-10 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <div className="font-display text-2xl font-semibold">All the best for GATE CS 2027 🎯</div>
          <p className="mt-2 text-sm text-primary-foreground/60">Built with 15-year data analysis · Smart prep beats hard prep.</p>
        </div>
      </footer>
    </div>
  );
};

function SectionHead({ icon, eyebrow, title, desc }: { icon: React.ReactNode; eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
        {icon} {eyebrow}
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground md:text-lg">{desc}</p>
    </div>
  );
}

export default Index;
