"use client";

import { useState } from "react";
import { LEVELS } from "@/lib/levels";
import {
  DEFAULT_PROFESSION,
  levelInfoFor,
  type Profession,
} from "@/lib/professions";

// A small "Which level am I?" disclosure that explains the three levels, to help
// a user pick. Reused under the level switcher on modules and the progress page.
// Level names/blurbs adapt to the profession (Student → school stages).
export function LevelHelp({
  profession = DEFAULT_PROFESSION,
}: {
  profession?: Profession;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-ink-mute underline-offset-2 hover:text-accent hover:underline"
      >
        {open ? "Hide" : "Which level am I?"}
      </button>
      {open ? (
        <div className="mt-2 rounded-md border border-ink/10 bg-paper p-3 text-xs text-ink-soft">
          <p className="mb-2 text-ink-mute">
            Pick where most of your day sits — drills and coaching adjust to match. You can
            switch anytime.
          </p>
          <ul className="space-y-1.5">
            {LEVELS.map((l) => {
              const info = levelInfoFor(profession, l.id);
              return (
                <li key={l.id}>
                  <span className="font-medium text-ink">{info.name}:</span> {info.blurb}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
