// Professions. Pure data + helpers (no server imports) so this is safe to use
// from client components and server code alike, mirroring lib/levels.ts.
//
// Drills are tagged with a profession so scenarios match the learner's actual
// work; the AI coach is also calibrated to it (see `coachNote`). Professions
// are PAID, like career levels: Stripe quantity = levels × professions, and
// the practice profession (a preference in Clerk unsafeMetadata) is clamped
// server-side to the plan's purchased professions in lib/entitlements.ts —
// free accounts lock to their first choice. "business" is the default and
// maps to the original general drill library.

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
  | "student"
  | "agriculture"
  | "service"
  | "industrial"
  | "construction"
  | "education"
  | "publicservice";

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
    name: "Technology professional",
    blurb: "Software, IT support, engineering, data — systems and incidents.",
    coachNote:
      "a technology professional (software, IT, engineering, data). Their world is standups, code reviews, incidents and support tickets, technical tradeoffs, and translating technology for non-technical stakeholders.",
  },
  {
    id: "doctor",
    name: "Healthcare professional",
    blurb: "Doctors, nurses, technicians, caregivers — patients and care teams.",
    coachNote:
      "a healthcare professional (physician, nurse, technician, caregiver). Their world is patient care, clinical handoffs, presenting cases, explaining medicine to patients and families, and working with administration.",
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
    name: "Transport, logistics & operations",
    blurb: "Drivers, delivery, warehouse, supply chain — operations day-to-day.",
    coachNote:
      "a transport, logistics, or operations professional. Their world is moving goods and running the business day-to-day — shift handoffs, deliveries and dispatch, warehouses, supply chain and vendor coordination, KPI reviews, and operational incidents.",
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
  {
    id: "agriculture",
    name: "Agricultural worker",
    blurb: "Farming, fishing, livestock, forestry — crews, seasons, buyers.",
    coachNote:
      "an agricultural professional (farming, fishing, livestock, forestry). Their world is crews and seasons — weather and equipment calls, harvests and catches, buyers, vets and agronomists, co-ops, and regulators. Keep language plain and practical.",
    levelInfo: {
      early: {
        name: "Farmhand / crew",
        blurb: "Crew updates, equipment issues, safety flags, asking the manager.",
        coachNote:
          "a farmhand, deckhand, or field/forestry crew member. Pitch feedback to their world — crew handoffs, reporting equipment or animal problems, weather and safety flags, and clear asks to the farm manager or skipper. No office or corporate context.",
      },
      mid: {
        name: "Farm manager / crew lead",
        blurb: "Running crews and seasons — suppliers, buyers, vets, schedules.",
        coachNote:
          "a farm manager, skipper, or crew lead. Pitch feedback to their world — directing crews through a season, coordinating suppliers, buyers, vets and agronomists, planning around weather, and reporting to the owner or co-op.",
      },
      senior: {
        name: "Owner-operator",
        blurb: "The whole operation — banks, contracts, co-ops, regulators.",
        coachNote:
          "a farm owner-operator or agribusiness leader. Pitch feedback to their world — negotiating with banks and buyers, contracts and insurance, co-op and community leadership, regulators, and big seasonal bets.",
      },
    },
  },
  {
    id: "service",
    name: "Service worker",
    blurb: "Retail, hospitality, food service, care, cleaning, security.",
    coachNote:
      "a service professional (retail, hospitality, food service, personal care, cleaning, security). Their world is customers and shifts — guest interactions, complaints, schedules, and keeping a team and a manager on the same page. Keep language plain and practical.",
    levelInfo: {
      early: {
        name: "Front line",
        blurb: "Customers, shift swaps, escalations, updates to the manager.",
        coachNote:
          "a front-line service worker (retail associate, server, housekeeper, carer, security guard). Pitch feedback to their world — customer conversations, handling complaints, shift swaps and handovers, and clear updates or asks to the shift manager.",
      },
      mid: {
        name: "Shift lead / manager",
        blurb: "Running the floor — scheduling, staff feedback, hard customers.",
        coachNote:
          "a shift lead or store/restaurant/venue manager. Pitch feedback to their world — running the floor, scheduling and staffing, giving feedback to staff, resolving escalated customer issues, and reporting to the owner or district manager.",
      },
      senior: {
        name: "Multi-site / owner",
        blurb: "Several locations or your own business — budgets, head office.",
        coachNote:
          "a district/multi-site manager or owner in a service business. Pitch feedback to their world — performance across locations, budgets and targets, head-office or franchisor communication, vendor negotiations, and hiring managers.",
      },
    },
  },
  {
    id: "industrial",
    name: "Industrial & manufacturing worker",
    blurb: "Factory floor, machine operation, assembly, processing.",
    coachNote:
      "an industrial/manufacturing professional. Their world is the plant floor — shifts and lines, safety and quality, downtime, maintenance, and production targets. Keep language plain and practical.",
    levelInfo: {
      early: {
        name: "Operator / assembler",
        blurb: "Shift handoffs, quality flags, safety reports, machine issues.",
        coachNote:
          "a machine operator or assembler on a production line. Pitch feedback to their world — shift handoffs, flagging quality or safety problems, reporting machine issues, and making clear suggestions to the line supervisor.",
      },
      mid: {
        name: "Line supervisor",
        blurb: "Running lines and shifts — downtime, coordination, improvements.",
        coachNote:
          "a line supervisor or production planner. Pitch feedback to their world — running lines and shifts, explaining downtime and misses, coordinating with maintenance and quality, toolbox talks, and pitching improvements to the plant manager.",
      },
      senior: {
        name: "Plant manager",
        blurb: "The whole plant — targets to HQ, capital asks, workforce, audits.",
        coachNote:
          "a plant manager or manufacturing leader. Pitch feedback to their world — production and safety performance to headquarters, capital investment cases, workforce and union communication, customer audits, and incident accountability.",
      },
    },
  },
  {
    id: "construction",
    name: "Construction & trades worker",
    blurb: "Building sites and trades — crews, inspections, clients, bids.",
    coachNote:
      "a construction/trades professional (builder, electrician, plumber, carpenter, equipment operator). Their world is job sites — crews and subcontractors, safety, inspections, schedules, materials, and clients. Keep language plain and practical.",
    levelInfo: {
      early: {
        name: "Apprentice / tradesperson",
        blurb: "Questions to the foreman, safety concerns, materials, clients.",
        coachNote:
          "an apprentice or tradesperson on site. Pitch feedback to their world — clear questions to the foreman, flagging safety or materials problems, explaining work to a homeowner or client, and coordinating with other trades.",
      },
      mid: {
        name: "Foreman / site supervisor",
        blurb: "Running the site — subs, inspections, schedule slips, toolbox talks.",
        coachNote:
          "a foreman or site supervisor. Pitch feedback to their world — directing crews and subcontractors, toolbox talks, inspection prep, reporting schedule slips and change conditions to the project manager, and keeping the client informed.",
      },
      senior: {
        name: "Project manager / contractor",
        blurb: "Whole projects or your own firm — bids, change orders, disputes.",
        coachNote:
          "a construction project manager or contractor-owner. Pitch feedback to their world — bids and estimates, client change orders and disputes, municipal inspectors and permits, subcontractor contracts, and project financials.",
      },
    },
  },
  {
    id: "education",
    name: "Education professional",
    blurb: "Teachers, professors, trainers, administrators — class to board.",
    coachNote:
      "an education professional. Their world is students and families — classrooms and lessons, parent communication, colleagues and leadership, curriculum, and school community.",
    levelInfo: {
      early: {
        name: "New teacher / trainer",
        blurb: "Parent emails, class announcements, principal updates, feedback.",
        coachNote:
          "a new teacher, teaching assistant, or trainer. Pitch feedback to their world — parent emails, classroom announcements and instructions, updates to the principal or lead teacher, and asking experienced colleagues for help.",
      },
      mid: {
        name: "Experienced teacher / dept head",
        blurb: "Hard parent conferences, curriculum proposals, mentoring staff.",
        coachNote:
          "an experienced teacher or department head. Pitch feedback to their world — difficult parent conferences, curriculum and resource proposals, mentoring newer teachers, staff meetings, and advocating for students to administration.",
      },
      senior: {
        name: "Principal / administrator",
        blurb: "School leadership — boards, community letters, budgets, crises.",
        coachNote:
          "a principal, dean, or education administrator. Pitch feedback to their world — school-board presentations, letters to the whole community, budget and staffing cases, difficult personnel decisions, and crisis communication.",
      },
    },
  },
  {
    id: "publicservice",
    name: "Public service & government",
    blurb: "Civil service, police, military, postal — the public and the chain.",
    coachNote:
      "a public servant (civil service, police, military, postal, municipal). Their world is the public and the chain of command — citizen interactions, incident reports, policy and procedure, inter-agency coordination, and public accountability.",
    levelInfo: {
      early: {
        name: "Officer / front counter",
        blurb: "Citizen interactions, incident reports, requests up the chain.",
        coachNote:
          "a front-line public servant (clerk, officer, postal or municipal worker). Pitch feedback to their world — clear citizen interactions, incident and shift reports, following and explaining procedure, and precise requests up the chain of command.",
      },
      mid: {
        name: "Supervisor / program lead",
        blurb: "Teams and programs — rollouts, agencies, staffing, complaints.",
        coachNote:
          "a public-sector supervisor, sergeant, or program manager. Pitch feedback to their world — briefing teams on policy rollouts, inter-agency coordination, staffing and scheduling, responding to public complaints, and reporting up to directors.",
      },
      senior: {
        name: "Director / chief",
        blurb: "Department leadership — councils, press, budgets, crises.",
        coachNote:
          "a department director, chief, or senior official. Pitch feedback to their world — briefing councils and legislatures, press statements, budget defenses, policy recommendations, and crisis communication under public scrutiny.",
      },
    },
  },
];

/** The 11 top-level workforce categories shown in the sign-up dropdown. Each
 *  groups one or more purchasable professions; the specialist banks (finance,
 *  consultant, lawyer, sales) sit under Business & administrative. Display
 *  grouping only — profession ids, billing, and drill tags are unaffected. */
export interface ProfessionCategory {
  label: string;
  professions: Profession[];
}

export const PROFESSION_CATEGORIES: ProfessionCategory[] = [
  { label: "Students", professions: ["student"] },
  { label: "Agricultural workers", professions: ["agriculture"] },
  { label: "Service workers", professions: ["service"] },
  { label: "Industrial & manufacturing", professions: ["industrial"] },
  { label: "Construction & trades", professions: ["construction"] },
  { label: "Transport & logistics", professions: ["operator"] },
  {
    label: "Business & administrative",
    professions: ["business", "finance", "consultant", "lawyer", "sales"],
  },
  { label: "Education", professions: ["education"] },
  { label: "Healthcare", professions: ["doctor"] },
  { label: "Technology", professions: ["engineer"] },
  { label: "Public service & government", professions: ["publicservice"] },
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

/**
 * Parse a list of purchased professions from an array or a comma-separated
 * string (as stored in Clerk metadata / Stripe metadata), mirroring
 * parseLevels. Invalid ids are dropped; result de-duped in canonical order.
 */
export function parseProfessions(input: unknown): Profession[] {
  const raw = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : [];
  const seen = new Set<string>(raw.map((r) => String(r).trim()));
  return PROFESSION_IDS.filter((id) => seen.has(id));
}

// Own-property check: the ids come from client-writable unsafeMetadata, and a
// plain `in` would accept prototype keys like "constructor" as professions.
const isProfession = (id: string): id is Profession =>
  Object.prototype.hasOwnProperty.call(PROFESSION_MAP, id);

export function professionById(id: string | null | undefined): Profession {
  return id && isProfession(id) ? id : DEFAULT_PROFESSION;
}

/** Read the user's chosen profession from Clerk unsafeMetadata (default = business). */
export function readProfession(unsafeMetadata: unknown): Profession {
  const p = (unsafeMetadata as { profession?: string } | undefined)?.profession;
  return professionById(p);
}

/** Whether the user has explicitly chosen a profession (vs. the default). */
export function hasChosenProfession(unsafeMetadata: unknown): boolean {
  const p = (unsafeMetadata as { profession?: string } | undefined)?.profession;
  return !!p && isProfession(p);
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
  // LevelInfo is a structural superset of ProfessionLevelInfo, so the generic
  // career-level entry works as the fallback directly.
  return PROFESSION_MAP[profession].levelInfo?.[level] ?? LEVEL_MAP[level];
}
