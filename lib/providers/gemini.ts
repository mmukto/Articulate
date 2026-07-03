import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { DIMENSIONS, DELIVERY_DIMENSIONS } from "../course";

// Gemini provider (billing must be enabled on the Google Cloud project — the
// free tier is effectively unavailable for this workload). Structured output
// via responseSchema + responseMimeType: "application/json", which we parse.
//
// Resilience: Google sheds load on the cheap models with transient 503 "high
// demand" errors that usually clear in seconds. Every call retries the primary
// model with a short backoff and then falls back to a bigger-pool model, so a
// blip on Google's side doesn't surface as an error to the learner.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
// Tried when the primary model keeps returning transient errors. Set it equal
// to GEMINI_MODEL to disable the fallback. Fallback calls cost more per token —
// lib/limits.ts meters them at the correct per-model price.
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";

// Token usage returned alongside results so callers can meter per-user spend.
export interface ProviderResult {
  data: unknown;
  inputTokens: number;
  outputTokens: number;
  /** Model that actually served the request (a fallback may differ from the
   *  primary) — spend is priced per model. */
  model: string;
}

const RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    overall: { type: SchemaType.INTEGER, description: "Overall score 0-100." },
    headline: { type: SchemaType.STRING, description: "One-sentence verdict." },
    dimensions: {
      type: SchemaType.ARRAY,
      description: "One entry per rubric dimension.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          key: {
            type: SchemaType.STRING,
            format: "enum",
            enum: DIMENSIONS.map((d) => d.key),
          },
          score: { type: SchemaType.INTEGER, description: "Score 0-100." },
          comment: { type: SchemaType.STRING },
        },
        required: ["key", "score", "comment"],
      },
    },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    rewrite: { type: SchemaType.STRING },
    rewriteRationale: { type: SchemaType.STRING },
    drill: { type: SchemaType.STRING },
  },
  required: [
    "overall",
    "headline",
    "dimensions",
    "strengths",
    "improvements",
    "rewrite",
    "rewriteRationale",
    "drill",
  ],
};

let client: GoogleGenerativeAI | null = null;

const SPOKEN_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    transcript: { type: SchemaType.STRING, description: "What was heard, verbatim." },
    headline: { type: SchemaType.STRING, description: "One-sentence verdict on delivery." },
    delivery: {
      type: SchemaType.ARRAY,
      description: "One entry per delivery dimension.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          key: {
            type: SchemaType.STRING,
            format: "enum",
            enum: DELIVERY_DIMENSIONS.map((d) => d.key),
          },
          score: { type: SchemaType.INTEGER, description: "Score 0-100." },
          comment: { type: SchemaType.STRING },
        },
        required: ["key", "score", "comment"],
      },
    },
    fillerWords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    modelDelivery: { type: SchemaType.STRING },
  },
  required: [
    "transcript",
    "headline",
    "delivery",
    "fillerWords",
    "strengths",
    "improvements",
    "modelDelivery",
  ],
};

export function isConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

// Extract a concise, user-safe reason from a Google SDK error so real
// misconfigurations (invalid key, API not enabled, model not found, quota) are
// visible instead of hidden behind a generic message. SDK errors look like:
//   "[GoogleGenerativeAI Error]: ... [400 Bad Request] API key not valid..."
function shortReason(msg: string): string {
  const m = msg.match(/\[(\d{3})[^\]]*\]\s*(.+)/);
  const text = m ? `${m[1]}: ${m[2]}` : msg;
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

// Transient, retry-worthy failures: capacity shedding (503 "high demand" /
// "overloaded"), rate limits (429), and the occasional flaky 500. Anything
// else (bad key, bad request, safety block) won't improve with a retry.
function isTransient(msg: string): boolean {
  return /\[(429|500|503)[^\]]*\]|overloaded|high demand|try again later|resource exhausted|temporarily unavailable/i.test(
    msg,
  );
}

// Shown when every attempt (retries + fallback) was shed for capacity. Kept
// distinct from the generic failure so the routes can return 503, and worded so
// the learner knows their work isn't lost.
const BUSY_MESSAGE =
  "The AI coach is briefly over capacity. Please try again in a few seconds — your response isn't lost.";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Attempt plan: primary twice (short backoff), then the fallback model twice.
// ~2.7s of added wait worst-case — well inside the API routes' 60s budget. If
// the fallback is configured equal to the primary, only the two retries run.
const ATTEMPTS = [
  { model: MODEL, delayMs: 0 },
  { model: MODEL, delayMs: 800 },
  { model: FALLBACK_MODEL, delayMs: 400 },
  { model: FALLBACK_MODEL, delayMs: 1500 },
].filter((a, i) => i < 2 || a.model !== MODEL);

type GenPart = { text: string } | { inlineData: { mimeType: string; data: string } };
type UsageMetadata =
  | { promptTokenCount?: number; candidatesTokenCount?: number }
  | undefined;

async function generateResilient(
  system: string,
  schema: Schema,
  contents: string | GenPart[],
): Promise<{ text: string; usage: UsageMetadata; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set.");
  if (!client) client = new GoogleGenerativeAI(key);

  let lastErr: unknown;
  for (let i = 0; i < ATTEMPTS.length; i++) {
    const attempt = ATTEMPTS[i];
    if (attempt.delayMs) await sleep(attempt.delayMs);
    const model = client.getGenerativeModel({
      model: attempt.model,
      systemInstruction: system,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens: 2048,
        temperature: 0.4,
      },
    });
    try {
      const result = await model.generateContent(contents);
      // .text() throws if the response was blocked by safety filters — that's
      // non-transient and is rethrown immediately below.
      return {
        text: result.response.text(),
        usage: result.response.usageMetadata,
        model: attempt.model,
      };
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[gemini] generateContent failed (${attempt.model}, attempt ${i + 1}/${ATTEMPTS.length}):`,
        msg,
      );
      if (!isTransient(msg)) throw err; // a retry won't fix this one
    }
  }
  throw lastErr;
}

export async function grade(
  system: string,
  user: string,
): Promise<ProviderResult> {
  let text: string;
  let usage: UsageMetadata;
  let servedBy: string;
  try {
    ({ text, usage, model: servedBy } = await generateResilient(
      system,
      RESPONSE_SCHEMA,
      user,
    ));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    if (/blocked|safety/i.test(detail)) {
      throw new Error("The coaching model declined to respond to this input.");
    }
    if (isTransient(detail)) throw new Error(BUSY_MESSAGE);
    throw new Error(
      `The AI coach failed to generate feedback (${shortReason(detail)}).`,
    );
  }

  if (!text.trim()) {
    throw new Error("The AI coach returned no feedback. Please try again.");
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("The AI coach returned malformed feedback. Please try again.");
  }

  return {
    data,
    inputTokens: usage?.promptTokenCount ?? 0,
    outputTokens: usage?.candidatesTokenCount ?? 0,
    model: servedBy,
  };
}

/** Grade a spoken recording: transcribe + coach delivery. Gemini is multimodal,
 *  so the audio is passed inline alongside the text prompt. */
export async function gradeAudio(
  system: string,
  user: string,
  audioBase64: string,
  mimeType: string,
): Promise<ProviderResult> {
  let text: string;
  let usage: UsageMetadata;
  let servedBy: string;
  try {
    ({ text, usage, model: servedBy } = await generateResilient(
      system,
      SPOKEN_SCHEMA,
      [
        { text: user },
        { inlineData: { mimeType: mimeType || "audio/mp4", data: audioBase64 } },
      ],
    ));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/blocked|safety/i.test(msg)) {
      throw new Error("The coaching model declined to respond to this input.");
    }
    if (isTransient(msg)) throw new Error(BUSY_MESSAGE);
    if (/mime|unsupported|invalid.*audio|audio.*format/i.test(msg)) {
      throw new Error(
        "That audio format couldn't be processed. Try recording again, or use a different browser.",
      );
    }
    throw new Error(
      `The AI coach failed to process the recording (${shortReason(msg)}).`,
    );
  }

  if (!text.trim()) {
    throw new Error("The AI coach returned no feedback. Please try again.");
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("The AI coach returned malformed feedback. Please try again.");
  }

  return {
    data,
    inputTokens: usage?.promptTokenCount ?? 0,
    outputTokens: usage?.candidatesTokenCount ?? 0,
    model: servedBy,
  };
}
