"use client";

import { useProgress, drillKey } from "@/lib/progress";

// Per-module indicator on the home list: "2 drills →", "1/2 practiced", or "✓ Done".
export function ModuleProgressBadge({
  moduleSlug,
  drillIds,
}: {
  moduleSlug: string;
  drillIds: string[];
}) {
  const { countOf, mounted } = useProgress();
  const total = drillIds.length;

  // Before hydration, render the neutral default to avoid a mismatch.
  if (!mounted) {
    return <span>{total} drills →</span>;
  }

  const done = countOf(drillIds.map((d) => drillKey(moduleSlug, d)));

  if (done === 0) return <span>{total} drills →</span>;
  if (done >= total) {
    return <span className="font-medium text-emerald-700">✓ Done</span>;
  }
  return (
    <span className="font-medium text-accent">
      {done}/{total} practiced
    </span>
  );
}
