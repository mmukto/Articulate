import { DIMENSIONS, DELIVERY_DIMENSIONS } from "./course";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  SPOKEN_SYSTEM_PROMPT,
  buildSpokenPrompt,
} from "./prompt";
import * as claude from "./providers/claude";
import * as gemini from "./providers/gemini";
import type {
  DimensionKey,
  DeliveryKey,
  Feedback,
  SpokenFeedback,
  Drill,
  Module,
} from "./types";

export type ProviderName = "gemini" | "claude";

/**
 * Decide which AI backend to use. Order:
 *   1. ARTICULATE_PROVIDER, if it explicitly names one
 *   2. Gemini, if GEMINI_API_KEY is set (free tier)
 *   3. Claude, if ANTHROPIC_API_KEY is set
 * Returns null if nothing is configured.
 */
export function activeProvider(): ProviderName | null {
  const forced = process.env.ARTICULATE_PROVIDER?.toLowerCase();
  if (forced === "gemini" && gemini.isConfigured()) return "gemini";
  if (forced === "claude" && claude.isConfigured()) return "claude";
  if (gemini.isConfigured()) return "gemini";
  if (claude.isConfigured()) return "claude";
  return null;
}

const NOT_CONFIGURED =
  "The AI coach isn't configured. Set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY on the server.";

export async function gradeResponse(
  module: Module,
  drill: Drill,
  response: string,
): Promise<Feedback> {
  const provider = activeProvider();
  if (!provider) throw new Error(NOT_CONFIGURED);

  const user = buildUserPrompt(module, drill, response);
  const raw =
    provider === "gemini"
      ? await gemini.grade(SYSTEM_PROMPT, user)
      : await claude.grade(SYSTEM_PROMPT, user);

  return normalize(raw);
}

/** Spoken practice is audio-based and therefore Gemini-only. */
export function speechEnabled(): boolean {
  return gemini.isConfigured();
}

export async function gradeSpoken(
  module: Module,
  drill: Drill,
  audioBase64: string,
  mimeType: string,
): Promise<SpokenFeedback> {
  if (!gemini.isConfigured()) {
    throw new Error(
      "Spoken practice isn't configured. Set GEMINI_API_KEY (free) on the server.",
    );
  }
  const raw = await gemini.gradeAudio(
    SPOKEN_SYSTEM_PROMPT,
    buildSpokenPrompt(module, drill),
    audioBase64,
    mimeType,
  );
  return normalizeSpoken(raw);
}

// ---- Normalization: defensive against any provider's quirks ----

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x)).filter((s) => s.trim().length > 0);
}

function normalize(raw: any): Feedback {
  const validKeys = new Set<DimensionKey>(DIMENSIONS.map((d) => d.key));
  const seen = new Set<DimensionKey>();
  const dimensions = Array.isArray(raw?.dimensions)
    ? raw.dimensions
        .filter((d: any) => validKeys.has(d?.key) && !seen.has(d.key) && seen.add(d.key))
        .map((d: any) => ({
          key: d.key as DimensionKey,
          score: clampScore(d.score),
          comment: String(d.comment ?? ""),
        }))
    : [];

  return {
    overall: clampScore(raw?.overall),
    headline: String(raw?.headline ?? "").trim(),
    dimensions,
    strengths: toStringArray(raw?.strengths),
    improvements: toStringArray(raw?.improvements),
    rewrite: String(raw?.rewrite ?? "").trim(),
    rewriteRationale: String(raw?.rewriteRationale ?? "").trim(),
    drill: String(raw?.drill ?? "").trim(),
  };
}

function normalizeSpoken(raw: any): SpokenFeedback {
  const validKeys = new Set<DeliveryKey>(DELIVERY_DIMENSIONS.map((d) => d.key));
  const seen = new Set<DeliveryKey>();
  const delivery = Array.isArray(raw?.delivery)
    ? raw.delivery
        .filter((d: any) => validKeys.has(d?.key) && !seen.has(d.key) && seen.add(d.key))
        .map((d: any) => ({
          key: d.key as DeliveryKey,
          score: clampScore(d.score),
          comment: String(d.comment ?? ""),
        }))
    : [];

  return {
    transcript: String(raw?.transcript ?? "").trim(),
    headline: String(raw?.headline ?? "").trim(),
    delivery,
    fillerWords: toStringArray(raw?.fillerWords),
    strengths: toStringArray(raw?.strengths),
    improvements: toStringArray(raw?.improvements),
    modelDelivery: String(raw?.modelDelivery ?? "").trim(),
  };
}
