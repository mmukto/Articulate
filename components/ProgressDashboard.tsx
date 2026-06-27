"use client";

import Link from "next/link";
import { MODULES } from "@/lib/course";
import { useProgress, drillKey, type DrillStat } from "@/lib/progress";

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-600";
  return "text-accent";
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/60 p-5 text-center">
      <div className="font-serif text-3xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-mute">{label}</div>
    </div>
  );
}

export function ProgressDashboard() {
  const { data, mounted } = useProgress();

  if (!mounted) {
    return <p className="text-ink-mute">Loading your progress…</p>;
  }

  const allKeys = MODULES.flatMap((m) =>
    m.drills.map((d) => drillKey(m.slug, d.id)),
  );
  const practicedKeys = allKeys.filter((k) => k in data);
  const total = allKeys.length;
  const done = practicedKeys.length;
  const avgBest = done
    ? Math.round(
        practicedKeys.reduce((sum, k) => sum + (data[k]?.best ?? 0), 0) / done,
      )
    : 0;
  const modulesComplete = MODULES.filter((m) =>
    m.drills.every((d) => drillKey(m.slug, d.id) in data),
  ).length;

  if (done === 0) {
    return (
      <div className="rounded-xl border border-ink/10 bg-white/60 p-8 text-center">
        <p className="font-serif text-lg">You haven&apos;t practiced any drills yet.</p>
        <p className="mt-1 text-sm text-ink-mute">
          Your scores and completed drills will show up here as you go.
        </p>
        <Link
          href={`/modules/${MODULES[0].slug}`}
          className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Start with Module 1
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard value={`${done}/${total}`} label="Drills practiced" />
        <StatCard value={`${avgBest}`} label="Avg. best score" />
        <StatCard value={`${modulesComplete}/${MODULES.length}`} label="Modules complete" />
      </div>

      {/* Per-module breakdown */}
      <div className="space-y-4">
        {MODULES.map((m) => {
          const rows = m.drills.map((d) => ({
            drill: d,
            stat: data[drillKey(m.slug, d.id)] as DrillStat | undefined,
          }));
          const moduleDone = rows.filter((r) => r.stat).length;
          return (
            <div key={m.slug} className="rounded-xl border border-ink/10 bg-white/50 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={`/modules/${m.slug}`}
                  className="font-serif text-lg font-semibold tracking-tight hover:text-accent"
                >
                  {m.number}. {m.title}
                </Link>
                <span className="shrink-0 text-xs text-ink-mute">
                  {moduleDone}/{m.drills.length} done
                </span>
              </div>
              <ul className="mt-3 divide-y divide-ink/5">
                {rows.map(({ drill, stat }) => (
                  <li
                    key={drill.id}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <span className="min-w-0 truncate text-sm text-ink-soft">
                      {stat ? "✓ " : "○ "}
                      {drill.title}
                    </span>
                    {stat ? (
                      <span className="flex shrink-0 items-center gap-3 text-sm">
                        <span className="text-xs text-ink-mute">
                          {stat.attempts}×
                        </span>
                        <span
                          className={`font-serif font-semibold tabular-nums ${scoreColor(
                            stat.best,
                          )}`}
                          title={`best ${stat.best}, last ${stat.last}`}
                        >
                          {stat.best}
                        </span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-ink-mute">Not yet</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-mute">
        Scores are your <strong>best</strong> per drill (written = overall; spoken =
        average delivery). Synced to your account, so they follow you across devices.
      </p>
    </div>
  );
}
