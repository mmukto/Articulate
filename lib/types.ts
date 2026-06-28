// Shared domain types for the articulation course and the AI feedback engine.

import type { Level } from "./levels";

/** A scoring dimension the AI coach evaluates a response against. */
export type DimensionKey =
  | "clarity"
  | "concision"
  | "structure"
  | "precision"
  | "audience"
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
  /** Short, cited note on why the technique works (the research basis). */
  evidence?: string;
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
  /** Career level this drill is pitched at. Defaults to "senior" when unset
   *  (the original library was senior-level). */
  level?: Level;
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

// ---- Spoken practice (audio) contract ----

/** Delivery dimensions evaluated from a spoken recording. */
export type DeliveryKey = "pace" | "fillers" | "clarity" | "pronunciation";

export interface DeliveryDimension {
  key: DeliveryKey;
  label: string;
  description: string;
}

export interface DeliveryScore {
  key: DeliveryKey;
  score: number; // 0-100
  comment: string;
}

export interface SpokenFeedback {
  transcript: string; // what the AI heard
  headline: string; // one-line verdict on the delivery
  delivery: DeliveryScore[];
  fillerWords: string[]; // specific fillers/false-starts caught
  strengths: string[];
  improvements: string[];
  modelDelivery: string; // a stronger spoken version to read aloud
}
