"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignUpButton } from "@/components/auth";
import { TIERS, drillsPerModule, tierById, type TierId } from "@/lib/tiers";
import { LEVELS, LEVEL_MAP, DEFAULT_LEVEL, parseLevels, type Level } from "@/lib/levels";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/site";

type CancelBreakdown = {
  tierName: string;
  levelCount: number;
  price: number;
  aiCostUsd: number;
  drillsCompleted: number;
  drillTotal: number;
  drillCharge: number;
  refund: number;
};

const sameLevels = (a: Level[], b: Level[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

export default function PricingPage() {
  const [currentTier, setCurrentTier] = useState<TierId | null>(null);
  const [ownedLevels, setOwnedLevels] = useState<Level[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([DEFAULT_LEVEL]);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelData, setCancelData] = useState<CancelBreakdown | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const sessionId = params.get("session_id");
    const intent = params.get("intent"); // tier to resume after signup
    const intentLevels = parseLevels(params.get("levels"));
    if (status === "success") {
      setNotice("Thanks! Your subscription is active — updating your plan…");
    } else if (status === "cancel") {
      setNotice("Checkout canceled — no charge was made.");
    }

    let cancelled = false;

    async function load(): Promise<{ tierId: TierId } | null> {
      try {
        const d = await fetch("/api/usage", { cache: "no-store" }).then((r) => r.json());
        if (cancelled || !d?.enabled) return null;
        setSignedIn(true);
        setCurrentTier(d.tierId as TierId);
        const owned = (Array.isArray(d.levels) ? d.levels : []) as Level[];
        setOwnedLevels(owned);
        // Preselect the levels they own, or their current career level.
        setSelectedLevels(owned.length > 0 ? owned : [(d.currentLevel as Level) ?? DEFAULT_LEVEL]);
        return d as { tierId: TierId };
      } catch {
        return null;
      }
    }

    (async () => {
      // After checkout, reconcile straight from Stripe so the plan reflects even
      // if the webhook is slow — then load the usage summary.
      if (status === "success" && sessionId) {
        await fetch("/api/billing/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }
      let d = await load();
      if (status === "success") {
        // Belt-and-suspenders: if it still reads Free, poll a few times.
        for (let i = 0; i < 6 && !cancelled && (!d || d.tierId === "free"); i++) {
          await new Promise((r) => setTimeout(r, 1500));
          d = await load();
        }
        if (!cancelled) {
          setNotice(
            d && d.tierId !== "free"
              ? "Your subscription is active."
              : "Payment received — your plan is taking a moment to activate. Refresh in a few seconds.",
          );
        }
      } else if (intent && d) {
        // Just signed up after picking a paid plan → resume to checkout. Clean
        // the URL first so a refresh/back doesn't re-trigger it.
        const validTier = TIERS.find((t) => t.id === intent && t.priceUsd > 0);
        window.history.replaceState({}, "", "/pricing");
        if (validTier && !cancelled) {
          const lv = intentLevels.length > 0 ? intentLevels : selectedLevels;
          setSelectedLevels(lv);
          await subscribe(validTier.id, lv);
        }
      } else if (d && d.tierId === "free") {
        // Self-heal: a past purchase may never have been recorded (missed
        // webhook). Recover it from Stripe by email, then reload.
        const r = await fetch("/api/billing/sync", { method: "POST" })
          .then((res) => res.json())
          .catch(() => null);
        if (!cancelled && r?.ok) await load();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleLevel(id: Level) {
    setSelectedLevels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  }
  const levelCount = selectedLevels.length;

  async function post(url: string, body?: unknown): Promise<void> {
    const res = await fetch(url, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data?.error || "Something went wrong.");
    window.location.href = data.url as string;
  }

  async function subscribe(tier: TierId, levels: Level[] = selectedLevels) {
    if (levels.length === 0) {
      setError("Pick at least one career level first.");
      return;
    }
    setError(null);
    setBusy(tier);
    try {
      await post("/api/billing/checkout", { tier, levels });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setBusy(null);
    }
  }

  // After a signed-out user picks a paid plan and signs up, Clerk redirects back
  // here with ?intent=<tier>&levels=… — resume straight to checkout.
  function intentUrl(tier: TierId): string {
    const lv = encodeURIComponent(selectedLevels.join(","));
    return `/pricing?intent=${tier}&levels=${lv}`;
  }

  async function manage() {
    setError(null);
    setBusy("manage");
    try {
      await post("/api/billing/portal");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't open the billing portal.");
      setBusy(null);
    }
  }

  // Fetch the refund preview (no charge yet) and show the confirmation panel.
  async function openCancel() {
    setError(null);
    setBusy("cancel");
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Couldn't load cancellation details.");
      setCancelData(data as CancelBreakdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function confirmCancel() {
    setError(null);
    setBusy("cancel-confirm");
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.canceled) throw new Error(data?.error || "Couldn't cancel.");
      setCancelData(null);
      setCurrentTier("free");
      setNotice(
        `Your ${data.tierName} plan is canceled. A refund of $${Number(data.refund).toFixed(2)} is on its way.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Plans &amp; pricing
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          All plans include every lesson and the AI coach. Higher plans unlock more drills
          per module. <span className="font-medium text-ink">Pricing is per career level</span> —
          the price below is for one level, so all three levels cost 3×. Billed annually.
        </p>
      </header>

      {/* Current subscription summary */}
      {signedIn && currentTier && currentTier !== "free" ? (
        <section className="rounded-xl border-2 border-accent bg-accent-wash/30 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-accent">
            Your current plan
          </div>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl font-semibold text-ink">
              {tierById(currentTier).name}
              <span className="font-normal text-ink-soft">
                {" · "}
                {ownedLevels.length} level{ownedLevels.length === 1 ? "" : "s"}
              </span>
            </h2>
            <span className="font-serif text-lg font-semibold text-ink">
              $
              {(tierById(currentTier).priceUsd * Math.max(1, ownedLevels.length)).toFixed(2)}
              <span className="text-sm font-normal text-ink-mute"> /year</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {ownedLevels.length > 0
              ? `Career level${ownedLevels.length === 1 ? "" : "s"}: ` +
                ownedLevels.map((l) => LEVEL_MAP[l].name).join(", ")
              : "—"}
          </p>
        </section>
      ) : null}

      {/* Level chooser — the price below multiplies by how many you pick. */}
      <section className="rounded-xl border border-ink/10 bg-white/50 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold tracking-tight">
            Which level(s) do you want to train?
          </h2>
          <span className="text-sm text-ink-mute">
            {levelCount === 0
              ? "Pick at least one"
              : `${levelCount} selected — prices below × ${levelCount}`}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Each plan is billed once per level you choose. You can practice a level’s full drill
          set once it’s on your plan; switch which level you’re practicing anytime.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const on = selectedLevels.includes(l.id);
            const owned = ownedLevels.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => toggleLevel(l.id)}
                title={l.blurb}
                aria-pressed={on}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  on
                    ? "border-accent bg-accent text-white"
                    : "border-ink/15 text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {on ? "✓ " : ""}
                {l.name}
                {owned ? <span className={on ? "text-white/80" : "text-ink-mute"}> · owned</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      {notice ? (
        <div className="rounded-lg border border-accent/30 bg-accent-wash/40 px-4 py-3 text-sm text-ink-soft">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {cancelData ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-sm">
          <h3 className="font-serif text-lg font-semibold text-ink">
            Cancel your {cancelData.tierName} plan
            {cancelData.levelCount > 1 ? ` (${cancelData.levelCount} levels)` : ""}?
          </h3>
          <p className="mt-1 text-ink-soft">
            Cancellation is immediate. Your refund is your annual price minus the AI
            coaching you’ve used and the drills you’ve completed:
          </p>
          <dl className="mx-auto mt-3 max-w-xs space-y-1 text-ink">
            <div className="flex justify-between">
              <dt>Annual price</dt>
              <dd>${cancelData.price.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-ink-mute">
              <dt>− AI usage</dt>
              <dd>−${cancelData.aiCostUsd.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-ink-mute">
              <dt>
                − Drills used ({cancelData.drillsCompleted}/{cancelData.drillTotal})
              </dt>
              <dd>−${cancelData.drillCharge.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-red-200 pt-1 font-semibold">
              <dt>Refund</dt>
              <dd>${cancelData.refund.toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={confirmCancel}
              disabled={busy === "cancel-confirm"}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
            >
              {busy === "cancel-confirm" ? "Canceling…" : "Confirm cancellation"}
            </button>
            <button
              onClick={() => setCancelData(null)}
              className="rounded-md border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Keep my plan
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          // Owns this exact tier *and* the same set of levels → nothing to change.
          const isExactCurrent =
            isCurrent && tier.priceUsd > 0 && sameLevels(selectedLevels, ownedLevels);
          const perModule = drillsPerModule(tier);
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-xl border p-5 ${
                tier.highlight
                  ? "border-accent bg-accent-wash/30 shadow-sm"
                  : "border-ink/10 bg-white/50"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-lg font-semibold">{tier.name}</h2>
                {tier.highlight ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Popular
                  </span>
                ) : null}
              </div>
              <div className="mt-2">
                <span className="font-serif text-2xl font-semibold">
                  {tier.priceUsd === 0 ? "Free" : `$${tier.priceUsd.toFixed(2)}`}
                </span>
                {tier.priceUsd > 0 ? (
                  <span className="text-sm text-ink-mute"> / level / year</span>
                ) : null}
              </div>
              {tier.priceUsd > 0 && levelCount > 1 ? (
                <p className="mt-1 text-xs text-ink-mute">
                  ${(tier.priceUsd * levelCount).toFixed(2)}/year for {levelCount} levels
                </p>
              ) : null}
              <p className="mt-2 text-sm text-ink-soft">{tier.blurb}</p>
              <div className="mt-3 text-sm text-ink">
                <span className="font-semibold">{tier.drillTotal}</span> drills
                <span className="text-ink-mute"> / level · {perModule}/module</span>
              </div>

              <div className="mt-auto space-y-2 pt-5">
                {!signedIn ? (
                  // Signed out: choosing a plan starts sign-up, then resumes here.
                  tier.priceUsd === 0 ? (
                    <SignUpButton mode="modal" forceRedirectUrl="/">
                      <button className="w-full rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent">
                        Sign up free
                      </button>
                    </SignUpButton>
                  ) : (
                    <SignUpButton mode="modal" forceRedirectUrl={intentUrl(tier.id)}>
                      <button
                        disabled={levelCount === 0}
                        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {levelCount === 0
                          ? "Pick a level above"
                          : `Choose ${tier.name} — $${(tier.priceUsd * levelCount).toFixed(2)}`}
                      </button>
                    </SignUpButton>
                  )
                ) : tier.priceUsd === 0 ? (
                  <div className="rounded-md border border-ink/10 px-4 py-2 text-center text-sm text-ink-mute">
                    {isCurrent ? "Current plan" : "Included"}
                  </div>
                ) : (
                  <>
                    {isExactCurrent ? (
                      <div className="rounded-md border border-ink/15 px-4 py-2 text-center text-sm font-medium text-ink-mute">
                        Current plan
                      </div>
                    ) : (
                      <button
                        onClick={() => subscribe(tier.id)}
                        disabled={busy === tier.id || levelCount === 0}
                        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {busy === tier.id
                          ? "Starting…"
                          : levelCount === 0
                            ? "Pick a level above"
                            : `${
                                isCurrent
                                  ? "Update"
                                  : currentTier && currentTier !== "free"
                                    ? `Switch to ${tier.name}`
                                    : `Choose ${tier.name}`
                              } — $${(tier.priceUsd * levelCount).toFixed(2)}`}
                      </button>
                    )}
                    {isCurrent ? (
                      <div className="space-y-1 text-center">
                        <button
                          onClick={openCancel}
                          disabled={busy === "cancel"}
                          className="block w-full text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-60"
                        >
                          {busy === "cancel" ? "Loading…" : "Cancel subscription"}
                        </button>
                        <button
                          onClick={manage}
                          disabled={busy === "manage"}
                          className="block w-full text-xs text-ink-mute underline-offset-2 hover:text-accent hover:underline disabled:opacity-60"
                        >
                          {busy === "manage" ? "Opening…" : "Manage billing"}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!signedIn ? (
        <p className="text-center text-sm text-ink-mute">
          Pick a plan above to create your account, or{" "}
          <SignInButton mode="modal">
            <button className="text-accent hover:underline">sign in</button>
          </SignInButton>{" "}
          if you already have one.
        </p>
      ) : null}

      <p className="text-center text-xs text-ink-mute">
        Payments are processed securely by Stripe. You can cancel anytime — your refund is
        your annual price minus your AI usage and the drills you’ve completed. Questions?{" "}
        <a href={SUPPORT_MAILTO} className="text-accent hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  );
}
