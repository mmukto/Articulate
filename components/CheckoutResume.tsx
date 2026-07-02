"use client";

import { useEffect } from "react";
import { useMaybeUser, type MaybeClerkUser } from "./auth";
import { hasChosenLevel, levelById } from "@/lib/levels";
import { hasChosenProfession, professionById } from "@/lib/professions";

const KEY = "iart:pendingCheckout";
const PREFS_KEY = "iart:pendingPrefs";
// Written by builds before the profession feature; read once for users who
// started sign-up on the old bundle and finished after a deploy.
const LEGACY_LEVEL_KEY = "iart:pendingLevel";

interface PendingPrefs {
  level?: string;
  profession?: string;
}

// Validate stashed prefs and write them to the account's metadata. Never
// overrides a choice the account already has. Awaitable so callers can make
// sure the write lands BEFORE navigating away (e.g. to Stripe).
async function applyPrefs(user: MaybeClerkUser, prefs: PendingPrefs): Promise<void> {
  if (!user) return;
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
  try {
    await user.update({ unsafeMetadata: { ...(user.unsafeMetadata ?? {}), ...patch } });
  } catch {
    /* offline / rate-limited — don't block the flow */
  }
}

// Read-and-consume a sessionStorage stash. Consumes BEFORE parsing so a
// corrupt value can't survive and be reprocessed on every later mount.
function takeStash(key: string): string | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(key);
    if (raw !== null) sessionStorage.removeItem(key);
  } catch {
    return null;
  }
  return raw;
}

// Called when a signed-out user picks a paid plan, just before sign-up opens.
// We persist the plan AND the chosen profession/level so they survive the whole
// sign-up + email-verification flow (which can land the user anywhere and drop
// URL params). One payload, one consumer — the prefs are applied before the
// Stripe redirect so the navigation can't cancel the metadata write.
export function stashCheckout(tier: string, levels: string[], prefs?: PendingPrefs) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ tier, levels, ...prefs }));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Mounted app-wide inside <SignedIn>. As soon as the user is authenticated, if a
// paid plan was stashed before sign-up, apply the stashed profession/level to
// the account, then resume checkout — regardless of where Clerk's sign-up flow
// landed them — so the card prompt is never skipped.
export function CheckoutResume() {
  const { user } = useMaybeUser();
  useEffect(() => {
    if (!user) return;
    const raw = takeStash(KEY);
    if (!raw) return;
    let pending: { tier?: string; levels?: string[] } & PendingPrefs;
    try {
      pending = JSON.parse(raw);
    } catch {
      return;
    }
    if (!pending?.tier) return;

    let cancelled = false;
    (async () => {
      // Save the chosen profession/level FIRST — the Stripe redirect below
      // replaces the page, which would abort an in-flight metadata write.
      await applyPrefs(user, pending);
      // The session cookie can lag a beat behind the post-sign-up redirect, so
      // retry a few times on 401 before giving up.
      for (let i = 0; i < 5 && !cancelled; i++) {
        try {
          const res = await fetch("/api/billing/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tier: pending.tier,
              levels: pending.levels ?? [],
              profession: pending.profession,
            }),
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
    // The user object's identity changes on every metadata write; keying on id
    // keeps this one-shot per session (the stash is consumed on first run).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return null;
}

// Called when a signed-out user picks the FREE plan, just before sign-up opens:
// persists the chosen profession and level so they can be applied once the
// account exists (below). Paid plans carry their prefs inside stashCheckout.
export function stashPrefs(prefs: PendingPrefs) {
  try {
    sessionStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* sessionStorage unavailable — ignore */
  }
}

// Mounted app-wide inside <SignedIn>. When a free sign-up stashed a chosen
// level/profession, write them to the new account's metadata as soon as the
// user is authenticated — so "sign up free as a Student, Undergraduate"
// actually lands there instead of the defaults.
export function LevelResume() {
  const { user } = useMaybeUser();
  useEffect(() => {
    if (!user) return;
    let prefs: PendingPrefs | null = null;
    const raw = takeStash(PREFS_KEY);
    if (raw) {
      try {
        prefs = JSON.parse(raw);
      } catch {
        prefs = null;
      }
    }
    // Migration: a sign-up started on a pre-professions bundle stashed only a
    // bare level string under the old key.
    const legacyLevel = takeStash(LEGACY_LEVEL_KEY);
    if (!prefs && legacyLevel) prefs = { level: legacyLevel };
    if (!prefs) return;
    void applyPrefs(user, prefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return null;
}
