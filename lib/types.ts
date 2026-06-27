// Shared domain types for the articulation course and the AI feedback engine.

/** A scoring dimension the AI coach evaluates a response against. */
export type DimensionKey =
  | "clarity"
  | "concision"
  | "structure"
  | "precision"
  | "impact";

export interface Dimension {
  key: DimensionKey;
  label: string;
  description: string;
}

/** A before/after rewrite used to illustrate a concept. */
export interface Example {
  before: string;
  after: string;
  note: string;
}

export interface Concept {
  heading: string;
  body: string;
}

export interface Lesson {
  summary: string;
  concepts: Concept[];
  examples: Example[];
}

/** An interactive exercise the learner submits a response to for AI feedback. */
export interface Drill {
  id: string;
  title: string;
  /** The situation the learner is responding to. */
  scenario: string;
  /** The concrete instruction for what to write. */
  task: string;
  /** Coaching hints shown before the learner writes. */
  tips: string[];
  /** Dimension keys this drill most heavily emphasizes. */
  focus: DimensionKey[];
  /** Optional placeholder shown in the response box. */
  placeholder?: string;
}

export interface Module {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  /** What the learner will be able to do after the module. */
  outcomes: string[];
  lesson: Lesson;
  drills: Drill[];
}

// ---- AI feedback contract (shared by the API route and the client) ----

export interface DimensionScore {
  key: DimensionKey;
  score: number; // 0-100
  comment: string;
}

export interface Feedback {
  overall: number; // 0-100
  headline: string; // one-line verdict
  dimensions: DimensionScore[];
  strengths: string[];
  improvements: string[];
  rewrite: string; // a stronger version of the learner's response
  rewriteRationale: string; // why the rewrite is stronger
  drill: string; // one targeted practice suggestion
}
