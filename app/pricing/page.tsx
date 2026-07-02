"use client";

import { useEffect, useRef, useState } from "react";
import { SignInButton, SignUpButton, useMaybeUser } from "@/components/auth";
import { stashCheckout, stashPrefs } from "@/components/CheckoutResume";
import { TIERS, drillsPerModule, tierById, FREE_MODULE_LIMIT, type TierId } from "@/lib/tiers";
import { LEVELS, DEFAULT_LEVEL, readLevel, type Level } from "@/lib/levels";
import {
  PROFESSIONS,
  PROFESSION_MAP,
  DEFAULT_PROFESSION,
  professionById,
  levelInfoFor,
  type Profession,
} from "@/lib/professions";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/site";

type CancelInfo = {
  tierName: string;
  levelCount: number;
  accessUntil: number; // epoch ms the paid access ends
};

const fmtDate = (ms: number) =>
  ms ? new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "your renewal date";

const sameLevels = (a: Level[], b: Level[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

export default function PricingPage() {
  const [currentTier, setCurrentTier] = useState<TierId | null>(null);
  const [ownedLevels, setOwnedLevels] = useState<Level[]>([]);
  const [ownedProfessions, setOwnedProfessions] = useState<Profession[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([DEFAULT_LEVEL]);
  // Picked FIRST (before levels): the profession the plan will COVER. It names
  // the levels (Student → High school / Undergraduate / Postgraduate) and is
  // recorded on the subscription at checkout (professions are paid, like
  // levels). It intentionally does NOT write the practice preference — the
  // practice profession follows the plan.
  const [profession, setProfession] = useState<Profession>(DEFAULT_PROFESSION);
  // Once the user touches the dropdown, background /api/usage loads (e.g. the
  // post-checkout poll) must not clobber their fresh pick with a stale value.
  const professionTouched = useRef(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelData, setCancelData] = useState<CancelInfo | null>(null);
  // Whether the current paid plan is set to cancel at period end, and when.
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [accessUntil, setAccessUntil] = useState<number | null>(null);
  // Set when a subscriber is about to upgrade in place (charges the card on
  // file) — drives the confirm-before-charge dialog.
  const [confirmUpgrade, setConfirmUpgrade] = useState<{
    tierId: TierId;
    tierName: string;
    newAnnual: number;
    amountDueNow: number | null; // exact prorated charge from Stripe
    loading: boolean;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const sessionId = params.get("session_id");
    if (status === "success") {
      setNotice("Thanks! Your subscription is active — updating your plan…");
    } else if (status === "cancel") {
      setNotice("Checkout canceled — no charge was made.");
    } else if (status === "resume_failed") {
      setNotice("Almost there — choose your plan below to finish checkout.");
    }

    let cancelled = false;

    async function load(): Promise<{ tierId: TierId } | null> {
      try {
        const d = await fetch("/api/usage", { cache: "no-store" }).then((r) => r.json());
        if (cancelled || !d?.enabled) return null;
        setSignedIn(true);
        setCurrentTier(d.tierId as TierId);
        const ownedProf = (Array.isArray(d.professions) ? d.professions : []) as Profession[];
        setOwnedProfessions(ownedProf);
        // Preselect the profession their plan covers, else their preference.
        if (!professionTouched.current) {
          setProfession(
            ownedProf.length > 0 ? ownedProf[0] : professionById(d.currentProfession),
          );
        }
        setCancelAtPeriodEnd(d.cancelAtPeriodEnd === true);
        setAccessUntil(typeof d.accessUntil === "number" ? d.accessUntil : null);
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

  // Keep the practice level pointed at a level the user owns. If their saved
  // preference isn't one they pay for, switch it to their highest owned level —
  // so the header chip, progress page, and module drills all reflect what they
  // bought instead of defaulting to a lower level.
  const { user } = useMaybeUser();
  useEffect(() => {
    if (!user || ownedLevels.length === 0) return;
    const pref = readLevel(user.unsafeMetadata);
    if (ownedLevels.includes(pref)) return;
    const target = ownedLevels[ownedLevels.length - 1];
    user
      .update({ unsafeMetadata: { ...(user.unsafeMetadata ?? {}), level: target } })
      .catch(() => {});
  }, [user, ownedLevels]);

  function toggleLevel(id: Level) {
    // Levels you already pay for are locked on — you can add levels, but
    // swapping/dropping one requires cancel + re-subscribe.
    if (ownedLevels.includes(id)) return;
    setSelectedLevels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  }
  const levelCount = selectedLevels.length;
  const onPaidPlan = signedIn && !!currentTier && currentTier !== "free";

  // Selecting a profession here only changes what a purchase would cover — it
  // never rewrites the account's practice profession (that follows the plan,
  // and free accounts lock to their first choice).
  function changeProfession(next: Profession) {
    professionTouched.current = true;
    setProfession(next);
  }
  // A subscriber selecting a profession outside their plan can't upgrade in
  // place — profession swaps require cancel + re-subscribe.
  const professionSwap =
    onPaidPlan && ownedProfessions.length > 0 && !ownedProfessions.includes(profession);

  // New subscriptions go straight to Stripe Checkout (which shows the card form,
  // so there's no surprise charge). In-place upgrades charge the saved card
  // silently, so confirm first.
  function requestSubscribe(tierId: TierId, tierName: string) {
    if (selectedLevels.length === 0) {
      setError("Pick at least one career level first.");
      return;
    }
    if (onPaidPlan) {
      const levels = selectedLevels;
      setConfirmUpgrade({
        tierId,
        tierName,
        newAnnual: tierById(tierId).priceUsd * levels.length,
        amountDueNow: null,
        loading: true,
      });
      // Fetch the exact prorated charge to show before they confirm.
      fetch("/api/billing/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId, levels, profession }),
      })
        .then((r) => r.json())
        .then((d) =>
          setConfirmUpgrade((prev) =>
            prev && prev.tierId === tierId
              ? {
                  ...prev,
                  amountDueNow: typeof d?.amountDueNow === "number" ? d.amountDueNow : null,
                  loading: false,
                }
              : prev,
          ),
        )
        .catch(() =>
          setConfirmUpgrade((prev) => (prev ? { ...prev, loading: false } : prev)),
        );
    } else {
      void subscribe(tierId);
    }
  }

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
      await post("/api/billing/checkout", { tier, levels, profession });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setBusy(null);
    }
  }


  // Fetch the cancel preview (no change yet) and show the confirmation panel.
  async function openCancel() {
    setError(null);
    setBusy("cancel");
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Couldn't load cancellation details.");
      setCancelData(data as CancelInfo);
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
      // Access continues until period end — the plan stays current, just won't renew.
      setCancelAtPeriodEnd(true);
      if (typeof data.accessUntil === "number") setAccessUntil(data.accessUntil);
      setNotice(
        `Your ${data.tierName} plan will end on ${fmtDate(Number(data.accessUntil))}. You keep full access until then.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  async function resumePlan() {
    setError(null);
    setBusy("resume");
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.resumed) throw new Error(data?.error || "Couldn't resume.");
      setCancelAtPeriodEnd(false);
      setNotice(`Your ${data.tierName} plan will continue and renew as usual.`);
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
          per module.{" "}
          <span className="font-medium text-ink">
            Pricing is per career level, per profession
          </span>{" "}
          — the price below covers one level in your chosen profession, so all three
          levels cost 3×. Billed annually.
        </p>
      </header>

      {/* Signed-out visitors create their account *by choosing a plan* (the header
          "Sign up" routes here), so make that explicit. */}
      {!signedIn ? (
        <div className="rounded-xl border border-accent/40 bg-accent-wash/30 p-4 text-center text-sm text-ink-soft">
          <span className="font-medium text-ink">To sign up, choose a plan below.</span>{" "}
          Pick your <span className="font-medium text-ink">profession</span>, then your{" "}
          <span className="font-medium text-ink">level(s)</span>, then start with{" "}
          <span className="font-medium text-ink">Free</span> or a paid plan — account creation
          continues from there.
        </div>
      ) : null}

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
              {(
                tierById(currentTier).priceUsd *
                Math.max(1, ownedLevels.length) *
                Math.max(1, ownedProfessions.length)
              ).toFixed(2)}
              <span className="text-sm font-normal text-ink-mute"> /year</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {ownedProfessions.length > 0
              ? `Profession: ${ownedProfessions
                  .map((p) => PROFESSION_MAP[p].name)
                  .join(", ")} · `
              : ""}
            {ownedLevels.length > 0
              ? `Level${ownedLevels.length === 1 ? "" : "s"}: ` +
                ownedLevels
                  .map((l) => levelInfoFor(ownedProfessions[0] ?? profession, l).name)
                  .join(", ")
              : "—"}
          </p>
        </section>
      ) : null}

      {/* Step 1: profession, Step 2: level(s). The profession comes first — it
          names the levels (Student → High school / Undergraduate / Postgraduate)
          and is saved to the account at sign-up. */}
      <section id="plans" className="scroll-mt-24 rounded-xl border border-ink/10 bg-white/50 p-5">
        <h2 className="font-serif text-lg font-semibold tracking-tight">
          1. What&apos;s your profession?
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Drills and AI coaching are written for your profession — your plan covers the
          profession you pick here.
        </p>
        <select
          value={profession}
          onChange={(e) => changeProfession(e.target.value as Profession)}
          aria-label="Your profession"
          className="mt-3 w-full max-w-sm rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {PROFESSIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-ink-mute">
          {PROFESSION_MAP[profession].blurb}
        </p>
        {professionSwap ? (
          <p className="mt-1.5 text-xs text-amber-700">
            Your plan covers{" "}
            <span className="font-medium">
              {ownedProfessions.map((p) => PROFESSION_MAP[p].name).join(", ")}
            </span>
            . Switching professions requires canceling and re-subscribing.
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/10 pt-4">
          <h2 className="font-serif text-lg font-semibold tracking-tight">
            2. Which level(s) do you want to train?
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
            const info = levelInfoFor(profession, l.id);
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => toggleLevel(l.id)}
                title={owned ? "Included in your plan — switching levels needs cancel + re-subscribe" : info.blurb}
                aria-pressed={on}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  owned ? "cursor-default" : ""
                } ${
                  on
                    ? "border-accent bg-accent text-white"
                    : "border-ink/15 text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {on ? "✓ " : ""}
                {info.name}
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
            You’ll keep full access until{" "}
            <span className="font-medium text-ink">{fmtDate(cancelData.accessUntil)}</span>, then
            your plan won’t renew. Annual plans aren’t refundable, so there’s no charge or refund
            now — and you can resume anytime before that date.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={confirmCancel}
              disabled={busy === "cancel-confirm"}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
            >
              {busy === "cancel-confirm" ? "Canceling…" : "Cancel at period end"}
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

      {confirmUpgrade ? (
        <div className="rounded-xl border-2 border-accent bg-accent-wash/30 p-5 text-sm">
          <h3 className="font-serif text-lg font-semibold text-ink">
            Upgrade to {confirmUpgrade.tierName}?
          </h3>
          <p className="mt-1 text-ink-soft">
            {confirmUpgrade.loading ? (
              "Calculating the exact amount…"
            ) : confirmUpgrade.amountDueNow != null ? (
              <>
                Your card on file will be charged{" "}
                <span className="font-semibold text-ink">
                  ${confirmUpgrade.amountDueNow.toFixed(2)}
                </span>{" "}
                now (the prorated difference for the rest of your billing year), then $
                {confirmUpgrade.newAnnual.toFixed(2)}/year at renewal. The new drills unlock
                right away.
              </>
            ) : (
              <>
                Your card on file will be charged the prorated difference now, then $
                {confirmUpgrade.newAnnual.toFixed(2)}/year at renewal. The new drills unlock
                right away.
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-ink-mute">
            Renews annually and is non-refundable. Cancel anytime to stop the next renewal.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => void subscribe(confirmUpgrade.tierId)}
              disabled={busy === confirmUpgrade.tierId || confirmUpgrade.loading}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
            >
              {busy === confirmUpgrade.tierId
                ? "Processing…"
                : confirmUpgrade.loading
                  ? "Calculating…"
                  : confirmUpgrade.amountDueNow != null
                    ? `Confirm — pay $${confirmUpgrade.amountDueNow.toFixed(2)}`
                    : "Confirm — charge my card"}
            </button>
            <button
              onClick={() => setConfirmUpgrade(null)}
              className="rounded-md border border-ink/15 px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          // Owns this exact tier, levels, and profession → nothing to change.
          const isExactCurrent =
            isCurrent &&
            tier.priceUsd > 0 &&
            sameLevels(selectedLevels, ownedLevels) &&
            !professionSwap;
          const perModule = drillsPerModule(tier);
          // Once on a paid plan, move the highlight to the current tier and drop
          // the "Popular" flag; otherwise keep highlighting the popular tier.
          const isHighlighted = onPaidPlan ? isCurrent : !!tier.highlight;
          const showPopular = !!tier.highlight && !onPaidPlan;
          // A lower tier than the current one can't be switched to in place —
          // downgrades require cancel + re-subscribe.
          const isDowngrade =
            onPaidPlan && !isCurrent && tier.priceUsd < tierById(currentTier).priceUsd;
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-xl border p-5 ${
                isHighlighted
                  ? "border-accent bg-accent-wash/30 shadow-sm"
                  : "border-ink/10 bg-white/50"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-lg font-semibold">{tier.name}</h2>
                {showPopular ? (
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
                {tier.priceUsd === 0 ? (
                  <span>
                    First {FREE_MODULE_LIMIT} modules <span className="text-ink-mute">· 1 drill each</span>
                  </span>
                ) : (
                  <>
                    <span className="font-semibold">{tier.drillTotal}</span> drills
                    <span className="text-ink-mute"> / level · {perModule}/module</span>
                  </>
                )}
              </div>

              <div className="mt-auto space-y-2 pt-5">
                {!signedIn ? (
                  // Signed out: choosing a plan starts sign-up, then resumes here.
                  tier.priceUsd === 0 ? (
                    <SignUpButton mode="modal" forceRedirectUrl="/">
                      <button
                        onClick={() =>
                          stashPrefs({
                            level: selectedLevels[selectedLevels.length - 1] ?? DEFAULT_LEVEL,
                            profession,
                          })
                        }
                        className="w-full rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
                      >
                        Sign up free
                      </button>
                    </SignUpButton>
                  ) : (
                    <SignUpButton mode="modal" forceRedirectUrl="/pricing">
                      <button
                        onClick={() =>
                          stashCheckout(tier.id, selectedLevels, {
                            profession,
                            level: selectedLevels[selectedLevels.length - 1] ?? DEFAULT_LEVEL,
                          })
                        }
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
                    ) : professionSwap ? (
                      <div className="rounded-md border border-ink/10 px-4 py-2 text-center text-xs text-ink-mute">
                        Cancel to switch professions
                      </div>
                    ) : isDowngrade ? (
                      <div className="rounded-md border border-ink/10 px-4 py-2 text-center text-xs text-ink-mute">
                        Cancel to move to a lower plan
                      </div>
                    ) : (
                      <button
                        onClick={() => requestSubscribe(tier.id, tier.name)}
                        disabled={busy === tier.id || levelCount === 0}
                        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {busy === tier.id
                          ? "Starting…"
                          : levelCount === 0
                            ? "Pick a level above"
                            : `${
                                isCurrent
                                  ? "Add levels"
                                  : onPaidPlan
                                    ? `Upgrade to ${tier.name}`
                                    : `Choose ${tier.name}`
                              } — $${(tier.priceUsd * levelCount).toFixed(2)}/yr`}
                      </button>
                    )}
                    {isCurrent ? (
                      <div className="space-y-1 text-center">
                        {cancelAtPeriodEnd ? (
                          <>
                            <p className="text-xs text-ink-mute">
                              Ends {fmtDate(accessUntil ?? 0)} — won’t renew
                            </p>
                            <button
                              onClick={resumePlan}
                              disabled={busy === "resume"}
                              className="block w-full text-xs text-accent underline-offset-2 hover:underline disabled:opacity-60"
                            >
                              {busy === "resume" ? "Resuming…" : "Resume plan"}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={openCancel}
                            disabled={busy === "cancel"}
                            className="block w-full text-xs text-red-700 underline-offset-2 hover:underline disabled:opacity-60"
                          >
                            {busy === "cancel" ? "Loading…" : "Cancel subscription"}
                          </button>
                        )}
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

      <div className="rounded-lg border border-ink/10 bg-white/50 p-4 text-xs leading-relaxed text-ink-mute">
        <p className="font-medium text-ink">Subscription terms</p>
        <p className="mt-1">
          By subscribing you agree that: plans are priced per career level and per
          profession, and billed <span className="font-medium text-ink">annually</span>,
          renewing automatically each year; your plan unlocks drills for the profession and
          level(s) you purchase (switching either requires canceling and re-subscribing);
          you can cancel anytime to stop the next renewal and keep full access until your
          renewal date;{" "}
          <span className="font-medium text-ink">annual plans are non-refundable</span>. Upgrades
          are charged immediately (prorated). AI coaching is generated by software and is meant
          as practice, not professional advice. Payments are processed securely by Stripe.
        </p>
        <p className="mt-1.5">
          Questions?{" "}
          <a href={SUPPORT_MAILTO} className="text-accent hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
