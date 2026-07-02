import type {
  Dimension,
  DimensionKey,
  DeliveryDimension,
  DeliveryKey,
} from "./types";

// The scoring rubric, split out of course.ts so CLIENT components can import
// the dimension labels without pulling the entire drill library (thousands of
// drills across professions) into their bundle. Server code can keep importing
// these via course.ts, which re-exports them.

export const DIMENSIONS: Dimension[] = [
  {
    key: "clarity",
    label: "Clarity",
    description:
      "Could a busy executive grasp the point on one read, with no re-reading?",
  },
  {
    key: "concision",
    label: "Concision",
    description: "Is every word load-bearing? Filler, hedging, and throat-clearing removed?",
  },
  {
    key: "structure",
    label: "Structure",
    description: "Does it lead with the point, then support it in a logical order?",
  },
  {
    key: "precision",
    label: "Precision",
    description: "Concrete and specific rather than abstract, vague, or jargon-laden?",
  },
  {
    key: "audience",
    label: "Audience",
    description:
      "Written for this reader — translates jargon into their terms and leads with what they care about (their stake, the 'so what').",
  },
  {
    key: "impact",
    label: "Impact",
    description:
      "Executive presence — confident, decisive, and owns a clear recommendation.",
  },
];

export const DIMENSION_MAP: Record<DimensionKey, Dimension> = DIMENSIONS.reduce(
  (acc, d) => {
    acc[d.key] = d;
    return acc;
  },
  {} as Record<DimensionKey, Dimension>,
);

// Dimensions evaluated from a spoken recording (the "Speak" practice mode).
export const DELIVERY_DIMENSIONS: DeliveryDimension[] = [
  {
    key: "pace",
    label: "Pace",
    description: "Steady and unhurried, with pauses that aid emphasis — not rushed or draggy.",
  },
  {
    key: "fillers",
    label: "Filler-free",
    description: "Few 'um', 'uh', 'like', 'sort of', or false starts breaking the flow.",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "Easy to follow spoken — leads with the point, well-organized, not rambling.",
  },
  {
    key: "pronunciation",
    label: "Enunciation",
    description:
      "Words clearly articulated and easy to understand (general intelligibility, not accent).",
  },
];

export const DELIVERY_MAP: Record<DeliveryKey, DeliveryDimension> =
  DELIVERY_DIMENSIONS.reduce(
    (acc, d) => {
      acc[d.key] = d;
      return acc;
    },
    {} as Record<DeliveryKey, DeliveryDimension>,
  );
