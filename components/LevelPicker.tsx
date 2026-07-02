"use client";

import { useState } from "react";
import { LEVELS, readLevel, hasChosenLevel, type Level } from "@/lib/levels";
import {
  DEFAULT_PROFESSION,
  levelInfoFor,
  type Profession,
} from "@/lib/professions";
import { useMaybeUser } from "@/components/auth";
import { LevelHelp } from "@/components/LevelHelp";

// Reusable career-level switcher. Reads/writes the level in Clerk unsafeMetadata
// (client-writable, like progress). Used on the module page (controlled via
// `value`/`onChange` so drills re-filter instantly) and on the progress page
// (uncontrolled). Includes the "Which level am I?" helper. Level labels adapt
// to the profession (Student → High school / Undergraduate / Postgraduate).
export function LevelPicker({
  value,
  onChange,
  heading,
  locked = false,
  profession = DEFAULT_PROFESSION,
}: {
  value?: Level;
  onChange?: (level: Level) => void;
  heading?: string;
  /** When true, the level can't be changed (free plans are locked to one level). */
  locked?: boolean;
  /** Names the levels for this profession (display only; ids are unchanged). */
  profession?: Profession;
}) {
  const { user } = useMaybeUser();
  const [internal, setInternal] = useState<Level | null>(null);
  const current = value ?? internal ?? readLevel(user?.unsafeMetadata);
  const chosen = hasChosenLevel(user?.unsafeMetadata) || value != null || internal != null;
  const [saving, setSaving] = useState(false);

  async function pick(next: Level) {
    if (locked) return;
    setInternal(next);
    onChange?.(next);
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

  return (
    <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
      {chosen ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">
          {heading ?? "Practicing as"}
        </p>
      ) : (
        <p className="mb-2 text-sm font-medium text-accent">
          Pick your level — drills and coaching calibrate to match:
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => {
          const isCurrent = current === l.id;
          // When locked, only show the current level (free plans = one level).
          if (locked && !isCurrent) return null;
          const info = levelInfoFor(profession, l.id);
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => pick(l.id)}
              disabled={saving || locked}
              title={info.blurb}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-100 ${
                locked ? "cursor-default" : "disabled:opacity-60"
              } ${
                isCurrent
                  ? "border-accent bg-accent text-white"
                  : "border-ink/15 text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {info.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-mute">{levelInfoFor(profession, current).blurb}</p>
      {locked ? (
        <p className="mt-1 text-xs text-ink-mute">
          Free plans are locked to one level.{" "}
          <a href="/pricing" className="text-accent hover:underline">
            Upgrade
          </a>{" "}
          to switch or add levels.
        </p>
      ) : (
        <LevelHelp profession={profession} />
      )}
    </div>
  );
}
