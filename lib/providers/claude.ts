import Anthropic from "@anthropic-ai/sdk";
import { DIMENSIONS } from "../course";

// Claude provider. Structured output via forced tool use: the model must call
// `submit_feedback`, and we read its already-parsed `input`.

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const FEEDBACK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    overall: { type: "integer", description: "Overall score 0-100." },
    headline: { type: "string", description: "One-sentence verdict on the response." },
    dimensions: {
      type: "array",
      description: "A score and comment for each rubric dimension.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string", enum: DIMENSIONS.map((d) => d.key) },
          score: { type: "integer", description: "Score 0-100 for this dimension." },
          comment: { type: "string", description: "One concrete sentence." },
        },
        required: ["key", "score", "comment"],
      },
    },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    rewrite: { type: "string", description: "A stronger version of the response." },
    rewriteRationale: { type: "string" },
    drill: { type: "string", description: "One targeted next micro-exercise." },
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

const FEEDBACK_TOOL: Anthropic.Tool = {
  name: "submit_feedback",
  description: "Return structured coaching feedback on the learner's response.",
  input_schema: FEEDBACK_SCHEMA as unknown as Anthropic.Tool.InputSchema,
};

let client: Anthropic | null = null;

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function grade(system: string, user: string): Promise<unknown> {
  if (!client) client = new Anthropic();

  // `thinking` is omitted: claude-opus-4-8 permits omitting it, and a thinking
  // budget is incompatible with forced tool choice.
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system,
    tools: [FEEDBACK_TOOL],
    tool_choice: { type: "tool", name: FEEDBACK_TOOL.name },
    messages: [{ role: "user", content: user }],
  });

  if (message.stop_reason === "refusal") {
    throw new Error("The coaching model declined to respond to this input.");
  }

  const toolUse = message.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("No feedback was returned by the model. Please try again.");
  }

  return toolUse.input;
}
