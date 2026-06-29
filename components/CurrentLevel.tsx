"use client";

import { LEVEL_MAP, readLevel } from "@/lib/levels";
import { useMaybeUser } from "@/components/auth";

// Read-only display of the signed-in user's current career level. Changing the
// level lives on the module pages and the Plans page — the progress page only
// reflects the current level.
export function CurrentLevel() {
  const { user } = useMaybeUser();
  const info = LEVEL_MAP[readLevel(user?.unsafeMetadata)];

  return (
    <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
        Current level
      </p>
      <p className="mt-1 font-serif text-lg font-semibold text-ink">{info.name}</p>
      <p className="mt-0.5 text-sm text-ink-mute">{info.blurb}</p>
    </div>
  );
}
