import { DIMENSIONS, DIMENSION_MAP } from "./course";
import type { Drill, Module } from "./types";

// Provider-agnostic prompts shared by every AI backend. Keeping these in one
// place means Claude and Gemini grade against identical instructions.

export const SYSTEM_PROMPT = `You are an exacting but encouraging executive communication coach. You train people to write and speak with clarity, concision, structure, precision, and executive presence.

You evaluate a learner's response to a specific drill and return structured feedback. Your standards are high — the bar is "would this land with a busy, skeptical executive?" — but your tone is constructive: you want the learner to improve, not feel crushed.

Rules:
- Be specific. Reference the learner's actual words. Generic praise or criticism is useless.
- Score honestly. A genuinely excellent response can score 90+. A response riddled with hedging and buried points should score in the 40s-60s, not the 80s. Reserve the top of the range for responses that need almost no edits.
- The rewrite must preserve the learner's intent and any facts they supplied. Improve delivery, structure, and word choice — don't fabricate data they didn't give (unless the drill explicitly invites invented specifics).
- Keep every field tight. This is communication coaching; model good concision in your own feedback.
- If the response is empty, off-task, or nonsensical, score low, say so plainly in the headline, and use the rewrite to demonstrate a strong answer to the drill.
- Every score is an integer from 0 to 100.`;

export function buildUserPrompt(
  module: Module,
  drill: Drill,
  response: string,
): string {
  const focusLabels = drill.focus.map((k) => DIMENSION_MAP[k].label).join(", ");
  const rubric = DIMENSIONS.map(
    (d) => `- ${d.label} (${d.key}): ${d.description}`,
  ).join("\n");

  return `# Module
${module.number}. ${module.title} — ${module.tagline}
Core idea: ${module.lesson.summary}

# Drill: ${drill.title}
Scenario presented to the learner:
${drill.scenario}

Task the learner was asked to do:
${drill.task}

This drill especially emphasizes: ${focusLabels}.

# Rubric (score every dimension 0-100)
${rubric}

# The learner's response
"""
${response.trim() || "(the learner submitted nothing)"}
"""

Evaluate the response against the rubric. Score all five dimensions, but weight your overall judgment toward the emphasized dimensions for this drill (${focusLabels}). Return your feedback in the required structured format. Include exactly one entry per rubric dimension in "dimensions".`;
}
