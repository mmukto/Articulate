"use client";

import { useState } from "react";
import Link from "next/link";
import type { Module } from "@/lib/types";
import { LEVELS, LEVEL_MAP, readLevel, hasChosenLevel, type Level } from "@/lib/levels";
import { useMaybeUser } from "@/components/auth";
import { DrillPractice } from "@/components/DrillPractice";

// Renders a module's drills filtered to the signed-in user's career level, with
// a level switcher / onboarding prompt. Level lives in Clerk unsafeMetadata
// (client-writable, like progress). `tierCount` (how many drills the plan
// unlocks per module) is computed server-side and passed in; the API enforces
// both level and count server-side regardless of what's shown here.
export function ModuleDrills({
  module,
  tierCount,
  tierName,
}: {
  module: Module;
  tierCount: number;
  tierName: string;
}) {
  const { user } = useMaybeUser();
  const [override, setOverride] = useState<Level | null>(null);
  const [saving, setSaving] = useState(false);

  const level = override ?? readLevel(user?.unsafeMetadata);
  const chosen = !!override || hasChosenLevel(user?.unsafeMetadata);
  const levelName = LEVEL_MAP[level].name;

  async function pick(next: Level) {
    setOverride(next);
    if (!user) return;
    setSaving(true);
    try {
      await user.update({ unsafeMetadata: { ...(user.unsafeMetadata ?? {}), level: next } });
    } catch {
      /* offline / rate-limited — local state still reflects the choice */
    } finally {
      setSaving(false);
    }
  }

  const levelDrills = module.drills.filter((d) => (d.level ?? "senior") === level);
  const unlocked = levelDrills.slice(0, tierCount);
  const locked = levelDrills.slice(tierCount);

  return (
    <div className="space-y-6">
      {/* Level switcher / onboarding */}
      <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
        {chosen ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">
            Practicing as
          </p>
        ) : (
          <p className="mb-2 text-sm font-medium text-accent">
            Pick your career level so the drills and AI coaching match your world:
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => pick(l.id)}
              disabled={saving}
              title={l.blurb}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-60 ${
                level === l.id
                  ? "border-accent bg-accent text-white"
                  : "border-ink/15 text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-mute">{LEVEL_MAP[level].blurb}</p>
      </div>

      {/* Drills for the chosen level */}
      {levelDrills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 bg-white/40 p-6 text-sm text-ink-soft">
          More <span className="font-medium">{levelName}</span> drills are coming soon. For
          now, switch to <span className="font-medium">Senior</span> for the full library.
        </div>
      ) : (
        <>
          {unlocked.map((drill) => (
            <DrillPractice key={drill.id} moduleSlug={module.slug} drill={drill} />
          ))}
          {locked.length > 0 ? (
            <div className="rounded-xl border border-dashed border-ink/15 bg-white/40 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span aria-hidden>🔒</span>
                {locked.length} more {levelName.toLowerCase()} drill
                {locked.length === 1 ? "" : "s"} in this module
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink-mute">
                {locked.slice(0, 3).map((d) => (
                  <li key={d.id} className="truncate">
                    • {d.title}
                  </li>
                ))}
                {locked.length > 3 ? <li>• …and {locked.length - 3} more</li> : null}
              </ul>
              <p className="mt-3 text-sm text-ink-soft">
                You’re on the <span className="font-medium">{tierName}</span> plan. Upgrade to
                unlock more practice at every level.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                See plans
              </Link>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
