import { useState } from "react";
import { Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import StudyTimer, { StudyStats } from "@/components/StudyTimer";
import SectionHead from "@/components/SectionHead";

export default function ProgressPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <main className="container mx-auto px-6 py-16 md:py-24">
      <ProgressTracker />

      <section id="timer" className="mt-16">
        <SectionHead
          icon={<Trophy className="h-5 w-5" />}
          eyebrow="Daily Discipline"
          title="Study Timer & Stats"
          desc="Log every study session and watch per-topic minutes add up."
        />
        <div className="grid gap-6">
          <StudyTimer onLogged={() => setRefreshKey((k) => k + 1)} />
          <StudyStats refreshKey={refreshKey} />
        </div>
      </section>
    </main>
  );
}