import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import MonthlyStreaks from "@/components/MonthlyStreaks";

const TARGET = new Date("2027-02-01T00:00:00");
const daysToGate = Math.max(0, Math.ceil((TARGET.getTime() - Date.now()) / 86400000));

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
            <Trophy className="mr-1.5 h-3.5 w-3.5" /> Target: AIR &lt; 500 · GATE CS 2027
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
              { l: "Days to GATE", v: `~${daysToGate}` },
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
      </main>
    </>
  );
}