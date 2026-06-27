import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { DIMENSIONS, DELIVERY_DIMENSIONS } from "../course";

// Gemini provider (free tier). Structured output via responseSchema +
// responseMimeType: "application/json", which returns JSON we parse.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

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

export async function grade(system: string, user: string): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set.");
  if (!client) client = new GoogleGenerativeAI(key);

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 2048,
      temperature: 0.4,
    },
  });

  let text: string;
  try {
    const result = await model.generateContent(user);
    text = result.response.text();
  } catch (err) {
    // text() throws if the response was blocked by safety filters.
    throw new Error(
      err instanceof Error && /blocked|safety/i.test(err.message)
        ? "The coaching model declined to respond to this input."
        : "The AI coach failed to generate feedback. Please try again.",
    );
  }

  if (!text.trim()) {
    throw new Error("The AI coach returned no feedback. Please try again.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The AI coach returned malformed feedback. Please try again.");
  }
}

/** Grade a spoken recording: transcribe + coach delivery. Gemini is multimodal,
 *  so the audio is passed inline alongside the text prompt. */
export async function gradeAudio(
  system: string,
  user: string,
  audioBase64: string,
  mimeType: string,
): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set.");
  if (!client) client = new GoogleGenerativeAI(key);

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SPOKEN_SCHEMA,
      maxOutputTokens: 2048,
      temperature: 0.4,
    },
  });

  let text: string;
  try {
    const result = await model.generateContent([
      { text: user },
      { inlineData: { mimeType: mimeType || "audio/mp4", data: audioBase64 } },
    ]);
    text = result.response.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/blocked|safety/i.test(msg)) {
      throw new Error("The coaching model declined to respond to this input.");
    }
    if (/mime|unsupported|invalid.*audio|audio.*format/i.test(msg)) {
      throw new Error(
        "That audio format couldn't be processed. Try recording again, or use a different browser.",
      );
    }
    throw new Error("The AI coach failed to process the recording. Please try again.");
  }

  if (!text.trim()) {
    throw new Error("The AI coach returned no feedback. Please try again.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The AI coach returned malformed feedback. Please try again.");
  }
}
