import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { DIMENSIONS } from "../course";

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
