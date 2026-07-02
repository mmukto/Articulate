"use client";

import { useEffect } from "react";
import { useMaybeUser } from "./auth";
import { hasChosenLevel, levelById } from "@/lib/levels";
import { hasChosenProfession, professionById } from "@/lib/professions";

const KEY = "iart:pendingCheckout";
const PREFS_KEY = "iart:pendingPrefs";

// Called when a signed-out user picks a paid plan, just before sign-up opens.
// We persist the choice so it survives the whole sign-up + email-verification
// flow (which can land the user anywhere and drop URL params).
export function stashCheckout(tier: string, levels: string[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ tier, levels }));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Mounted app-wide inside <SignedIn>. As soon as the user is authenticated, if a
// paid plan was stashed before sign-up, resume checkout — regardless of where
// Clerk's sign-up flow landed them — so the card prompt is never skipped.
export function CheckoutResume() {
  useEffect(() => {
    let pending: { tier?: string; levels?: string[] } | null = null;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      pending = JSON.parse(raw);
    } catch {
      return;
    }
    // Consume once so it can't loop or fire on a later visit.
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    if (!pending?.tier) return;

    let cancelled = false;
    (async () => {
      // The session cookie can lag a beat behind the post-sign-up redirect, so
      // retry a few times on 401 before giving up.
      for (let i = 0; i < 5 && !cancelled; i++) {
        try {
          const res = await fetch("/api/billing/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tier: pending.tier, levels: pending.levels ?? [] }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data?.url) {
            window.location.href = data.url as string;
            return;
          }
          if (res.status === 401) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          break; // a real error — fall through to the pricing page
        } catch {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      if (!cancelled) window.location.href = "/pricing?status=resume_failed";
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

// Called when a signed-out user picks a plan on the pricing page, just before
// sign-up opens: persists the chosen profession (always) and — for the Free
// plan, which has no checkout step to carry it — the chosen level, so both can
// be applied once the account exists (below).
export function stashPrefs(prefs: { level?: string; profession?: string }) {
  try {
    sessionStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Mounted app-wide inside <SignedIn>. When sign-up stashed a chosen level and/or
// profession, write them to the new account's metadata as soon as the user is
// authenticated — so "sign up as a Student, Undergraduate" actually lands there
// instead of the defaults. Never overrides choices the account already has.
export function LevelResume() {
  const { user } = useMaybeUser();
  useEffect(() => {
    if (!user) return;
    let prefs: { level?: string; profession?: string } | null = null;
    try {
      const raw = sessionStorage.getItem(PREFS_KEY);
      if (!raw) return;
      prefs = JSON.parse(raw);
    } catch {
      return;
    }
    // Consume once so a later visit can't re-apply a stale choice.
    try {
      sessionStorage.removeItem(PREFS_KEY);
    } catch {
      /* ignore */
    }
    if (!prefs) return;

    const patch: Record<string, unknown> = {};
    const level = prefs.level;
    if (level && levelById(level) === level && !hasChosenLevel(user.unsafeMetadata)) {
      patch.level = level;
    }
    const profession = prefs.profession;
    if (
      profession &&
      professionById(profession) === profession &&
      !hasChosenProfession(user.unsafeMetadata)
    ) {
      patch.profession = profession;
    }
    if (Object.keys(patch).length === 0) return;
    user
      .update({ unsafeMetadata: { ...(user.unsafeMetadata ?? {}), ...patch } })
      .catch(() => {});
  }, [user]);

  return null;
}
