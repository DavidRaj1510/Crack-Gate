import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

const TARGET = new Date("2027-02-01T00:00:00");

function diff() {
  const now = new Date();
  const ms = TARGET.getTime() - now.getTime();
  const total = Math.max(0, ms);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [t, setT] = useState(diff());
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b border-gold/30 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 text-primary-foreground">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 text-sm md:gap-5">
        <div className="flex items-center gap-2 font-medium text-gold">
          <CalendarClock className="h-4 w-4" />
          <span className="uppercase tracking-wider text-xs">GATE CS 2027 in</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3 font-display tabular-nums">
          <Unit n={t.days} l="Days" highlight />
          <Sep />
          <Unit n={t.hours} l="Hrs" />
          <Sep />
          <Unit n={t.minutes} l="Min" />
          <Sep />
          <Unit n={t.seconds} l="Sec" />
        </div>
        <div className="hidden text-xs text-primary-foreground/60 md:block">Target: Feb 1, 2027</div>
      </div>
    </div>
  );
}

const Sep = () => <span className="text-primary-foreground/30">:</span>;

function Unit({ n, l, highlight }: { n: number; l: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className={`font-semibold ${highlight ? "text-gold text-xl md:text-2xl" : "text-primary-foreground text-base md:text-lg"}`}>
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-primary-foreground/60">{l}</span>
    </div>
  );
}