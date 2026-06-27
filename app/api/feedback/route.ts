import { NextRequest, NextResponse } from "next/server";
import { getDrill } from "@/lib/course";
import { gradeResponse } from "@/lib/feedback";

// Feedback grading can take a few seconds with adaptive thinking — give it room.
export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_RESPONSE_CHARS = 6000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { moduleSlug, drillId, response } = (body ?? {}) as {
    moduleSlug?: string;
    drillId?: string;
    response?: string;
  };

  if (!moduleSlug || !drillId) {
    return NextResponse.json(
      { error: "moduleSlug and drillId are required." },
      { status: 400 },
    );
  }
  if (typeof response !== "string" || response.trim().length === 0) {
    return NextResponse.json(
      { error: "Write a response before requesting feedback." },
      { status: 400 },
    );
  }
  if (response.length > MAX_RESPONSE_CHARS) {
    return NextResponse.json(
      { error: `Response is too long (max ${MAX_RESPONSE_CHARS} characters).` },
      { status: 400 },
    );
  }

  const found = getDrill(moduleSlug, drillId);
  if (!found) {
    return NextResponse.json({ error: "Unknown drill." }, { status: 404 });
  }

  try {
    const feedback = await gradeResponse(found.module, found.drill, response);
    return NextResponse.json({ feedback });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate feedback.";
    // Surface a clean message; log the detail server-side.
    console.error("[feedback] grading failed:", err);
    const isConfig = message.includes("isn't configured");
    return NextResponse.json(
      { error: message },
      { status: isConfig ? 503 : 500 },
    );
  }
}
