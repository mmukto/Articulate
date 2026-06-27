import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getUsageSummary } from "@/lib/limits";

export const runtime = "nodejs";

// Read-only allowance summary for the signed-in user. The raw spend lives in
// server-only Clerk metadata, so the client reads this computed summary instead.
// Returns { enabled: false } when there's no metered user (auth off / signed out),
// letting the indicator render nothing without special-casing errors.
export async function GET() {
  if (!CLERK_ENABLED) return NextResponse.json({ enabled: false });

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ enabled: false });

  try {
    const summary = await getUsageSummary(userId);
    return NextResponse.json({ enabled: true, ...summary });
  } catch (err) {
    console.error("[usage] summary failed:", err);
    return NextResponse.json({ enabled: false });
  }
}
