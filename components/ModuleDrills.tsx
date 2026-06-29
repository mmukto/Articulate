"use client";

import { useState } from "react";
import Link from "next/link";
import type { Module } from "@/lib/types";
import { LEVEL_MAP, readLevel, type Level } from "@/lib/levels";
import { FREE_MODULE_LIMIT } from "@/lib/tiers";
import { useMaybeUser } from "@/components/auth";
import { DrillPractice } from "@/components/DrillPractice";
import { LevelPicker } from "@/components/LevelPicker";

// Renders a module's drills filtered to the signed-in user's career level, with
// a level switcher / onboarding prompt. Level lives in Clerk unsafeMetadata
// (client-writable, like progress). Pricing is per level: `purchasedLevels`
// lists the levels the user has paid for — those unlock `tierCount` drills per
// module; any other level shows only `freeCount` (the Free sampler). The API
// enforces this server-side regardless of what's shown here.
export function ModuleDrills({
  module,
  tierCount,
  freeCount,
  tierName,
  purchasedLevels,
}: {
  module: Module;
  tierCount: number;
  freeCount: number;
  tierName: string;
  purchasedLevels: Level[];
}) {
  const { user } = useMaybeUser();
  const [override, setOverride] = useState<Level | null>(null);

  // Default to a level the user actually paid for. If their saved preference
  // isn't one they own (e.g. they bought a higher level but the preference still
  // sits at the default), show their highest owned level instead of a lower one.
  const pref = readLevel(user?.unsafeMetadata);
  const defaultLevel =
    purchasedLevels.length > 0 && !purchasedLevels.includes(pref)
      ? purchasedLevels[purchasedLevels.length - 1]
      : pref;
  const level = override ?? defaultLevel;
  const levelName = LEVEL_MAP[level].name;

  const levelPurchased = purchasedLevels.includes(level);
  // Free sign-up gets the 1-drill sampler only in the first few modules; paid
  // levels get their full count on every module.
  const inFreeModules = module.number <= FREE_MODULE_LIMIT;
  const allowed = levelPurchased ? tierCount : inFreeModules ? freeCount : 0;

  const levelDrills = module.drills.filter((d) => (d.level ?? "senior") === level);
  const unlocked = levelDrills.slice(0, allowed);
  const locked = levelDrills.slice(allowed);

  return (
    <div className="space-y-6">
      {/* Level switcher / onboarding */}
      <LevelPicker value={level} onChange={setOverride} />

      {/* Drills for the chosen level */}
      {levelDrills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 bg-white/40 p-6 text-sm text-ink-soft">
          More <span className="font-medium">{levelName}</span> drills for this module are
          on the way.
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
                {unlocked.length === 0
                  ? `${levelName} practice in this module is for subscribers`
                  : `${locked.length} more ${levelName.toLowerCase()} drill${
                      locked.length === 1 ? "" : "s"
                    } in this module`}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink-mute">
                {locked.slice(0, 3).map((d) => (
                  <li key={d.id} className="truncate">
                    • {d.title}
                  </li>
                ))}
                {locked.length > 3 ? <li>• …and {locked.length - 3} more</li> : null}
              </ul>
              {levelPurchased ? (
                <p className="mt-3 text-sm text-ink-soft">
                  You’re on the <span className="font-medium">{tierName}</span> plan for the{" "}
                  <span className="font-medium">{levelName}</span> level. Upgrade to unlock more
                  drills here.
                </p>
              ) : inFreeModules ? (
                <p className="mt-3 text-sm text-ink-soft">
                  Free sign-up includes one drill in each of the first {FREE_MODULE_LIMIT}{" "}
                  modules. Subscribe to unlock every drill at the{" "}
                  <span className="font-medium">{levelName}</span> level.
                </p>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">
                  Free practice covers the first {FREE_MODULE_LIMIT} modules. Subscribe to unlock
                  this module and the rest of the course.
                </p>
              )}
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {levelPurchased ? "See plans" : "Subscribe"}
              </Link>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
