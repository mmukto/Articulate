// Professions. Pure data + helpers (no server imports) so this is safe to use
// from client components and server code alike, mirroring lib/levels.ts.
//
// Drills are tagged with a profession so scenarios match the learner's actual
// work; the AI coach is also calibrated to it (see `coachNote`). Unlike career
// levels, professions are NOT priced — the profession is a free preference the
// user can switch anytime (stored in Clerk unsafeMetadata, like the level).
// "business" is the default and maps to the original general drill library.

export type Profession =
  | "business"
  | "engineer"
  | "doctor"
  | "lawyer"
  | "finance"
  | "sales"
  | "consultant"
  | "operator";

export interface ProfessionInfo {
  id: Profession;
  name: string;
  blurb: string;
  /** One line the AI coach uses to calibrate feedback to this profession. */
  coachNote: string;
}

export const PROFESSIONS: ProfessionInfo[] = [
  {
    id: "business",
    name: "Business professional",
    blurb: "General workplace — meetings, email, stakeholders, projects.",
    coachNote:
      "a general business professional. Their scenarios span everyday workplace communication — meetings, email, project updates, and stakeholder management.",
  },
  {
    id: "engineer",
    name: "Software engineer",
    blurb: "Code reviews, incidents, technical tradeoffs, engineering leadership.",
    coachNote:
      "a software engineer / technology professional. Their world is standups, code reviews, incidents, technical tradeoffs, and translating engineering reality for non-technical stakeholders.",
  },
  {
    id: "doctor",
    name: "Doctor / healthcare",
    blurb: "Patients, families, clinical teams, handoffs, hospital leadership.",
    coachNote:
      "a physician / healthcare professional. Their world is patient care, clinical handoffs, presenting cases, explaining medicine to patients and families, and working with hospital administration.",
  },
  {
    id: "lawyer",
    name: "Lawyer / legal",
    blurb: "Clients, partners, negotiations, plain-language risk.",
    coachNote:
      "a lawyer / legal professional. Their world is client counseling, memos to partners, negotiations, and translating legal risk into plain language decision-makers can act on.",
  },
  {
    id: "finance",
    name: "Finance / accounting",
    blurb: "Reporting, budgets, explaining numbers to non-finance readers.",
    coachNote:
      "a finance / accounting professional. Their world is financial reporting, budgets, forecasts, and explaining what the numbers mean to non-finance audiences and leadership.",
  },
  {
    id: "sales",
    name: "Sales / marketing",
    blurb: "Pitches, objections, forecasts, campaigns, customer conversations.",
    coachNote:
      "a sales / marketing professional. Their world is pitches, discovery calls, objection handling, pipeline and campaign readouts, and customer relationships.",
  },
  {
    id: "consultant",
    name: "Consultant",
    blurb: "Client recommendations, steering committees, structured framing.",
    coachNote:
      "a consultant. Their world is client recommendations, steering-committee updates, slide headlines that carry the point, and structured problem framing under scrutiny.",
  },
  {
    id: "operator",
    name: "Operator / operations",
    blurb: "Running the business day-to-day — sites, supply chain, front line.",
    coachNote:
      "an operations professional. Their world is running the business day-to-day — shift handoffs, process changes, supply chain and vendor coordination, KPI reviews, and operational incidents.",
  },
];

export const PROFESSION_MAP: Record<Profession, ProfessionInfo> =
  PROFESSIONS.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<Profession, ProfessionInfo>,
  );

/** All profession ids in canonical (display) order. */
export const PROFESSION_IDS: Profession[] = PROFESSIONS.map((p) => p.id);

// The original drill library is general-workplace content, so it doubles as the
// default profession for existing users who never picked one.
export const DEFAULT_PROFESSION: Profession = "business";

export function professionById(id: string | null | undefined): Profession {
  return id && id in PROFESSION_MAP ? (id as Profession) : DEFAULT_PROFESSION;
}

/** Read the user's chosen profession from Clerk unsafeMetadata (default = business). */
export function readProfession(unsafeMetadata: unknown): Profession {
  const p = (unsafeMetadata as { profession?: string } | undefined)?.profession;
  return professionById(p);
}

/** Whether the user has explicitly chosen a profession (vs. the default). */
export function hasChosenProfession(unsafeMetadata: unknown): boolean {
  const p = (unsafeMetadata as { profession?: string } | undefined)?.profession;
  return !!p && p in PROFESSION_MAP;
}
