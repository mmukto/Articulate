"use client";

import { useProgress } from "@/lib/progress";

// Shows a "Practiced" pill on a drill once it has feedback.
export function PracticedBadge({
  moduleSlug,
  drillId,
}: {
  moduleSlug: string;
  drillId: string;
}) {
  const { isPracticed, mounted } = useProgress();
  if (!mounted || !isPracticed(moduleSlug, drillId)) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      ✓ Practiced
    </span>
  );
}
