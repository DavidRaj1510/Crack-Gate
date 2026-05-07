import { ReactNode } from "react";

export default function SectionHead({
  icon,
  eyebrow,
  title,
  desc,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
        {icon} {eyebrow}
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base text-muted-foreground md:text-lg">{desc}</p>
    </div>
  );
}