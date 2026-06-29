"use client";

import { useEffect } from "react";
import { useMaybeUser } from "./auth";
import { hasChosenLevel, levelById } from "@/lib/levels";

const KEY = "iart:pendingCheckout";
const LEVEL_KEY = "iart:pendingLevel";

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

// Called when a signed-out user picks the FREE plan with a career level chosen,
// just before sign-up opens. Free sign-up has no checkout step to carry the
// choice, so we persist it and apply it once the account exists (below).
export function stashLevel(level: string) {
  try {
    sessionStorage.setItem(LEVEL_KEY, level);
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Mounted app-wide inside <SignedIn>. When a free signup stashed a chosen level,
// write it to the new account's metadata as soon as the user is authenticated —
// so "sign up free as Executive" actually lands on Executive instead of the
// default. Never overrides a level the user already has (picker or purchase).
export function LevelResume() {
  const { user } = useMaybeUser();
  useEffect(() => {
    if (!user) return;
    let level: string | null = null;
    try {
      level = sessionStorage.getItem(LEVEL_KEY);
    } catch {
      return;
    }
    if (!level) return;
    // Consume once so a later visit can't re-apply a stale choice.
    try {
      sessionStorage.removeItem(LEVEL_KEY);
    } catch {
      /* ignore */
    }
    if (levelById(level) !== level) return; // ignore invalid ids
    if (hasChosenLevel(user.unsafeMetadata)) return; // don't override an existing choice
    user
      .update({ unsafeMetadata: { ...(user.unsafeMetadata ?? {}), level } })
      .catch(() => {});
  }, [user]);

  return null;
}
