"use client";

import { useProgress } from "@/lib/progress";

// Course-wide progress summary with a reset control.
export function CourseProgress({ keys }: { keys: string[] }) {
  const { countOf, clear, mounted } = useProgress();
  if (!mounted) return null;

  const total = keys.length;
  const done = countOf(keys);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{ width: `${Math.max(done > 0 ? 4 : 0, pct)}%` }}
        />
      </div>
      <span className="text-sm text-ink-mute">
        {done} of {total} drills practiced
      </span>
      {done > 0 ? (
        <button
          onClick={() => {
            if (confirm("Reset your practice progress for this account?")) {
              clear();
            }
          }}
          className="text-xs text-ink-mute underline-offset-2 hover:text-accent hover:underline"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
