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
    name: "Executive",
    blurb: "Reports to or sits with the C-suite — board narratives, strategy, presence.",
    coachNote:
      "an executive who reports to or regularly interacts with the C-suite. Pitch feedback to their world — board-ready narratives, strategy, high-stakes decisions, and executive presence.",
  },
];

export const LEVEL_MAP: Record<Level, LevelInfo> = LEVELS.reduce(
  (acc, l) => {
    acc[l.id] = l;
    return acc;
  },
  {} as Record<Level, LevelInfo>,
);

/** All level ids in canonical (early → senior) order. */
export const LEVEL_IDS: Level[] = LEVELS.map((l) => l.id);

/**
 * Parse a list of purchased levels from an array or a comma-separated string
 * (as stored in Clerk metadata / Stripe metadata). Invalid ids are dropped and
 * the result is de-duped and returned in canonical order.
 */
export function parseLevels(input: unknown): Level[] {
  const raw = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : [];
  const seen = new Set<string>(raw.map((r) => String(r).trim()));
  return LEVEL_IDS.filter((id) => seen.has(id));
}

// New users default to Early career (most learners start here); they can switch
// anytime, and onboarding nudges them to pick. NOTE: this is the *user's* default
// level only — untagged legacy drills are still senior-pitched content (see
// `d.level ?? "senior"` in lib/course.ts), which is a separate concern.
export const DEFAULT_LEVEL: Level = "early";

// Own-property check: ids come from client-writable unsafeMetadata, and a
// plain `in` would accept prototype keys like "constructor" as levels.
const isLevel = (id: string): id is Level =>
  Object.prototype.hasOwnProperty.call(LEVEL_MAP, id);

export function levelById(id: string | null | undefined): Level {
  return id && isLevel(id) ? id : DEFAULT_LEVEL;
}

/** Read the user's chosen level from Clerk unsafeMetadata (default = DEFAULT_LEVEL). */
export function readLevel(unsafeMetadata: unknown): Level {
  const l = (unsafeMetadata as { level?: string } | undefined)?.level;
  return levelById(l);
}

/** Whether the user has explicitly chosen a level (vs. falling back to default). */
export function hasChosenLevel(unsafeMetadata: unknown): boolean {
  const l = (unsafeMetadata as { level?: string } | undefined)?.level;
  return !!l && isLevel(l);
}
