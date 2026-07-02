"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROFESSIONS, PROFESSION_MAP, type Profession } from "@/lib/professions";
import { useMaybeUser } from "@/components/auth";

// Profession switcher. Unlike career levels, professions are a free preference:
// any user can switch anytime (it selects which drill bank they practice; the
// per-level pricing gate applies within each profession). The choice lives in
// Clerk unsafeMetadata, like the level. Because the module page filters drills
// by profession on the SERVER, switching triggers a router refresh so the
// freshly-filtered drills stream in.
export function ProfessionPicker({
  value,
  heading,
}: {
  /** Server-resolved current profession (keeps first paint consistent). */
  value: Profession;
  heading?: string;
}) {
  const { user } = useMaybeUser();
  const router = useRouter();
  const [current, setCurrent] = useState<Profession>(value);
  const [saving, setSaving] = useState(false);
  // Re-sync with the server-resolved value when it changes (router.refresh
  // after a save, or a change made on another page) so the highlighted button
  // never disagrees with the server-filtered drill list below.
  const [prevValue, setPrevValue] = useState<Profession>(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (!saving) setCurrent(value);
  }

  async function pick(next: Profession) {
    if (next === current || saving) return;
    setCurrent(next);
    if (!user) return;
    setSaving(true);
    try {
      await user.update({
        unsafeMetadata: { ...(user.unsafeMetadata ?? {}), profession: next },
      });
      // Re-render the server component tree so the drill list re-filters.
      router.refresh();
    } catch {
      // Offline / rate-limited — revert to what the server last rendered.
      setCurrent(value);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">
        {heading ?? "Your profession"}
      </p>
      <div className="flex flex-wrap gap-2">
        {PROFESSIONS.map((p) => {
          const isCurrent = current === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p.id)}
              disabled={saving}
              title={p.blurb}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-60 ${
                isCurrent
                  ? "border-accent bg-accent text-white"
                  : "border-ink/15 text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-mute">
        {PROFESSION_MAP[current].blurb} Drills and coaching are written for your
        profession — switch anytime.
      </p>
    </div>
  );
}
