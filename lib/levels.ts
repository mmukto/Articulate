// Career levels. Pure data + helpers (no server imports) so this is safe to use
// from client components and server code alike. Drills are tagged with a level
// so each subscriber practices scenarios pitched at their stage; the AI coach is
// also calibrated to the level (see `coachNote`). Maps onto the Leadership
// Pipeline: individual contributor -> manager -> executive.

export type Level = "early" | "mid" | "senior";

export interface LevelInfo {
  id: Level;
  name: string;
  blurb: string;
  /** One line the AI coach uses to calibrate feedback to this career stage. */
  coachNote: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: "early",
    name: "Early career",
    blurb: "Individual contributor — emails, updates, speaking up, managing up.",
    coachNote:
      "an early-career individual contributor with no direct reports. Pitch feedback to their world — clear emails and status updates, asking good questions, speaking up in meetings, and managing up. Do NOT assume board, executive, or C-suite context.",
  },
  {
    id: "mid",
    name: "Mid career",
    blurb: "Manager — feedback, delegation, cross-functional influence, hard talks.",
    coachNote:
      "a mid-career people manager. Pitch feedback to their world — giving feedback, delegating, running meetings, persuading peers across functions, and difficult conversations with reports. Some senior exposure, but not the C-suite.",
  },
  {
    id: "senior",
    name: "Senior",
    blurb: "Executive / reports to C-suite — board narratives, strategy, presence.",
    coachNote:
      "a senior leader who reports to or regularly interacts with the C-suite. Pitch feedback to their world — board-ready narratives, strategy, high-stakes decisions, and executive presence.",
  },
];

export const LEVEL_MAP: Record<Level, LevelInfo> = LEVELS.reduce(
  (acc, l) => {
    acc[l.id] = l;
    return acc;
  },
  {} as Record<Level, LevelInfo>,
);

// Existing content is senior-pitched and existing users practiced it, so an
// unset level defaults to senior (back-compat). Onboarding nudges users to pick.
export const DEFAULT_LEVEL: Level = "senior";

export function levelById(id: string | null | undefined): Level {
  return id && id in LEVEL_MAP ? (id as Level) : DEFAULT_LEVEL;
}

/** Read the user's chosen level from Clerk unsafeMetadata (default senior). */
export function readLevel(unsafeMetadata: unknown): Level {
  const l = (unsafeMetadata as { level?: string } | undefined)?.level;
  return levelById(l);
}

/** Whether the user has explicitly chosen a level (vs. falling back to default). */
export function hasChosenLevel(unsafeMetadata: unknown): boolean {
  const l = (unsafeMetadata as { level?: string } | undefined)?.level;
  return !!l && l in LEVEL_MAP;
}
