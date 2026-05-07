import { subjects } from "@/data/gateData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertCircle, Trophy } from "lucide-react";
import MonthlyStreaks from "@/components/MonthlyStreaks";
import SectionHead from "@/components/SectionHead";

const sortedSubjects = [...subjects].sort((a, b) => b.avgMarks - a.avgMarks);
const totalMarks = sortedSubjects.reduce((s, x) => s + x.avgMarks, 0);

const diffColor = (d: string) =>
  d === "Easy"
    ? "bg-success/15 text-success border-success/30"
    : d === "Moderate"
      ? "bg-accent/15 text-accent border-accent/30"
      : "bg-danger/15 text-danger border-danger/30";

export default function Home() {
  return (
    <>
      <header className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container relative mx-auto px-6 py-20 md:py-28">
          <Badge className="mb-6 border-gold/40 bg-gold/15 text-gold hover:bg-gold/20">
            <Trophy className="mr-1.5 h-3.5 w-3.5" /> Target: AIR &lt; 1000 · GATE CS 2027
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Smart Prep, Not <span className="italic text-gold">Hard</span> Prep.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/75 md:text-xl">
            A data-driven 9-month roadmap built on 15 years of GATE CS weightage analysis. Every
            subject covered. Zero wasted hours.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { l: "Days to GATE", v: "~275" },
              { l: "Total subjects", v: "12" },
              { l: "Total marks", v: "100" },
              { l: "Target score", v: "75+" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 backdrop-blur"
              >
                <div className="font-display text-3xl font-semibold text-gold md:text-4xl">
                  {s.v}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/60">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 md:py-24">
        <MonthlyStreaks />

        <section id="weightage" className="mt-24">
          <SectionHead
            icon={<TrendingUp className="h-5 w-5" />}
            eyebrow="15-Year Analysis (2010–2024)"
            title="Subject Weightage — High to Low"
            desc="Average marks expected per subject based on past 15 GATE CS papers. Sorted by weightage."
          />

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
                    <tr
                      key={s.name}
                      className="border-t border-border/60 transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-4 font-display text-lg text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-4">
                        <span className="font-display text-2xl font-semibold text-secondary">
                          {s.avgMarks}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">marks</span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{s.range}</td>
                      <td className="px-4 py-4 w-[200px]">
                        <div className="flex items-center gap-3">
                          <Progress value={(s.avgMarks / 15) * 100} className="h-2" />
                          <span className="text-xs font-medium text-muted-foreground tabular-nums">
                            {s.weightagePct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${diffColor(s.difficulty)}`}
                        >
                          {s.difficulty}
                        </span>
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
      </main>
    </>
  );
}