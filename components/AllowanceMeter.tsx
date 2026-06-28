"use client";

import { useCallback, useEffect, useState } from "react";

// Small read-only indicator of how much of the signed-in user's annual AI
// allowance has been used. Reads the server-computed summary from /api/usage
// (raw spend lives in server-only Clerk metadata, not exposed to the client).
// Refreshes on window focus and whenever a coaching call dispatches the
// "articulate:usage" event, so the percentage ticks up right after feedback.

const USAGE_EVENT = "articulate:usage";

interface Summary {
  enabled: boolean;
  tierName?: string;
  percentUsed?: number;
  spentUsd?: number;
  budgetUsd?: number;
  daysLeft?: number;
}

export default function AllowanceMeter() {
  const [data, setData] = useState<Summary | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/usage", { cache: "no-store" });
      if (res.ok) setData((await res.json()) as Summary);
    } catch {
      /* non-critical indicator — ignore network errors */
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh = () => void load();
    window.addEventListener("focus", refresh);
    window.addEventListener(USAGE_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener(USAGE_EVENT, refresh);
    };
  }, [load]);

  if (!data || !data.enabled || data.percentUsed == null) return null;

  const pct = Math.max(0, Math.min(100, data.percentUsed));
  const warn = pct >= 80;
  const title =
    `${data.tierName ?? "Free"} plan · ` +
    `$${(data.spentUsd ?? 0).toFixed(2)} of $${(data.budgetUsd ?? 0).toFixed(0)} used` +
    (data.daysLeft != null ? ` · renews in ${data.daysLeft} day${data.daysLeft === 1 ? "" : "s"}` : "");

  return (
    <a
      href="/pricing"
      title={title}
      className={`hidden items-center gap-1.5 text-xs sm:inline-flex ${
        warn ? "text-red-700" : "text-ink-mute"
      } transition-colors hover:text-accent`}
    >
      <span
        aria-hidden
        className="block h-1.5 w-10 overflow-hidden rounded-full bg-ink/10"
      >
        <span
          className={`block h-full rounded-full ${warn ? "bg-red-600" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span aria-label={`${pct}% of your annual allowance used`}>
        <span className="lg:hidden">{`${pct}%`}</span>
        <span className="hidden lg:inline">
          {`${pct}% of your annual allowance used`}
        </span>
      </span>
    </a>
  );
}
