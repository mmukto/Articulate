// Professions. Pure data + helpers (no server imports) so this is safe to use
// from client components and server code alike, mirroring lib/levels.ts.
//
// Drills are tagged with a profession so scenarios match the learner's actual
// work; the AI coach is also calibrated to it (see `coachNote`). Unlike career
// levels, professions are NOT priced — the profession is a free preference the
// user can switch anytime (stored in Clerk unsafeMetadata, like the level).
// "business" is the default and maps to the original general drill library.

import { LEVEL_MAP, type Level } from "./levels";

export type Profession =
  | "business"
  | "engineer"
  | "doctor"
  | "lawyer"
  | "finance"
  | "sales"
  | "consultant"
  | "operator"
  | "student";

/** Per-profession override of how a career level is named and coached. The
 *  level IDs (early/mid/senior) — and therefore pricing — never change; only
 *  the display name, blurb, and coaching persona do (e.g. the Student
 *  profession's levels read High school / Undergraduate / Postgraduate). */
export interface ProfessionLevelInfo {
  name: string;
  blurb: string;
  /** One line the AI coach uses to calibrate feedback to this stage. */
  coachNote: string;
}

export interface ProfessionInfo {
  id: Profession;
  name: string;
  blurb: string;
  /** One line the AI coach uses to calibrate feedback to this profession. */
  coachNote: string;
  /** Optional per-level overrides (name/blurb/coachNote). Levels without an
   *  override fall back to the generic career-level info in lib/levels.ts. */
  levelInfo?: Partial<Record<Level, ProfessionLevelInfo>>;
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
  {
    id: "student",
    name: "Student",
    blurb: "School and university — class, applications, research, first jobs.",
    coachNote:
      "a student. Their communication contexts are academic and early-professional — classes, applications, group work, research, and teachers/professors — not corporate. Never assume workplace seniority.",
    // Student "levels" are school stages, not career stages. Level IDs (and
    // pricing) stay early/mid/senior; only the labels and personas change.
    levelInfo: {
      early: {
        name: "High school",
        blurb: "Class discussions, presentations, essays, applications, clubs.",
        coachNote:
          "a high school student. Pitch feedback to their world — class discussions and presentations, essays and college applications, emails to teachers, and speaking up in clubs and teams. Do NOT assume any workplace context.",
      },
      mid: {
        name: "Undergraduate",
        blurb: "Seminars, group projects, professor emails, internships, interviews.",
        coachNote:
          "an undergraduate university student. Pitch feedback to their world — seminars and presentations, group projects, emails to professors and advisors, internship and job applications, and interviews. Assume little to no workplace experience.",
      },
      senior: {
        name: "Postgraduate",
        blurb: "Thesis, conference talks, advisors and committees, teaching.",
        coachNote:
          "a postgraduate student (master's or PhD). Pitch feedback to their world — research and thesis presentations, conference talks, advisor and committee communications, teaching and TA work, and translating research for non-specialists.",
      },
    },
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

/**
 * How a career level is presented and coached for a given profession: the
 * profession's override when it has one (Student → High school / Undergraduate
 * / Postgraduate), else the generic career-level info. Level IDs and pricing
 * are untouched by this — it is display + coaching only.
 */
export function levelInfoFor(
  profession: Profession,
  level: Level,
): ProfessionLevelInfo {
  return (
    PROFESSION_MAP[profession].levelInfo?.[level] ?? {
      name: LEVEL_MAP[level].name,
      blurb: LEVEL_MAP[level].blurb,
      coachNote: LEVEL_MAP[level].coachNote,
    }
  );
}
