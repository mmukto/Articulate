"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMaybeUser, type MaybeClerkUser } from "@/components/auth";
import { CLERK_ENABLED } from "@/lib/clerk-config";

// Per-user progress tracking with cross-device sync.
//
// Source of truth is the signed-in user's Clerk `unsafeMetadata.progress`
// (stored on Clerk's servers, so it follows the account to any device).
// localStorage is kept as an instant local cache; on load we merge the two so
// offline/just-recorded attempts aren't lost. Writes go to both.

const KEY = "articulate:progress:v2";
const EVENT = "articulate:progress";

export interface DrillStat {
  attempts: number;
  best: number; // best score seen, 0-100
  last: number; // most recent score, 0-100
  updatedAt: number; // epoch ms
}

export type ProgressData = Record<string, DrillStat>;

export function drillKey(moduleSlug: string, drillId: string): string {
  return `${moduleSlug}/${drillId}`;
}

function storageKey(userId?: string | null): string {
  return `${KEY}:${userId ?? "guest"}`;
}

function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function readLocal(key: string): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" ? (obj as ProgressData) : {};
  } catch {
    return {};
  }
}

function writeLocal(key: string, data: ProgressData): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage may be unavailable; ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

// Identifies the local-only progress bucket when Clerk auth is disabled.
const GUEST_ID = "guest";

type ClerkUser = MaybeClerkUser | null;

function readCloud(user: ClerkUser): ProgressData {
  const p = (user?.unsafeMetadata as { progress?: unknown } | undefined)?.progress;
  return p && typeof p === "object" ? (p as ProgressData) : {};
}

function mergeEntry(a: DrillStat | undefined, b: DrillStat | undefined): DrillStat {
  if (!a) return b!;
  if (!b) return a;
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  return {
    attempts: Math.max(a.attempts, b.attempts),
    best: Math.max(a.best, b.best),
    last: newer.last,
    updatedAt: newer.updatedAt,
  };
}

function merge(a: ProgressData, b: ProgressData): ProgressData {
  const out: ProgressData = { ...a };
  for (const k of Object.keys(b)) out[k] = mergeEntry(out[k], b[k]);
  return out;
}

async function pushCloud(user: ClerkUser, progress: ProgressData): Promise<void> {
  if (!user) return;
  try {
    await user.update({
      unsafeMetadata: { ...(user.unsafeMetadata ?? {}), progress },
    });
  } catch {
    /* offline or rate-limited; localStorage still holds the data */
  }
}

/** Subscribe to the signed-in user's progress (cloud + local, merged).
 *  `mounted` guards against hydration mismatch. */
export function useProgress() {
  const { user, isLoaded } = useMaybeUser();
  // With auth disabled there's no account, so progress lives under a local
  // "guest" bucket (localStorage only — there's no cloud to sync to).
  const userId = user?.id ?? (CLERK_ENABLED ? null : GUEST_ID);
  const [data, setData] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const localKey = storageKey(userId);
    const cloud = readCloud(user);
    const merged = merge(cloud, readLocal(localKey));

    setData(merged);
    setMounted(true);
    writeLocal(localKey, merged);

    // One-time reconciliation: if local carried attempts the cloud didn't have,
    // push the merged set up. Guard by userId so it runs once per account.
    if (
      userId &&
      syncedRef.current !== userId &&
      JSON.stringify(cloud) !== JSON.stringify(merged)
    ) {
      syncedRef.current = userId;
      void pushCloud(user, merged);
    }

    const refresh = () => setData(merge(readCloud(user), readLocal(localKey)));
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
    // `user` is intentionally omitted: its identity changes after every
    // metadata write, and including it would re-run this reconciliation loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isLoaded]);

  /** Record an attempt at a drill with its score (0-100). Writes local + cloud. */
  const record = useCallback(
    (moduleSlug: string, drillId: string, score: number) => {
      if (!userId) return; // only track for signed-in users
      const localKey = storageKey(userId);
      const map = readLocal(localKey);
      const k = drillKey(moduleSlug, drillId);
      const s = clampScore(score);
      const prev = map[k];
      map[k] = {
        attempts: (prev?.attempts ?? 0) + 1,
        best: Math.max(prev?.best ?? 0, s),
        last: s,
        updatedAt: Date.now(),
      };
      writeLocal(localKey, map);
      // Merge against current cloud so a write from another device isn't clobbered.
      void pushCloud(user, merge(readCloud(user), map));
    },
    [userId, user],
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey(userId));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
    void pushCloud(user, {});
  }, [userId, user]);

  const isPracticed = useCallback(
    (moduleSlug: string, drillId: string) => drillKey(moduleSlug, drillId) in data,
    [data],
  );

  const countOf = useCallback(
    (keys: string[]) => keys.filter((k) => k in data).length,
    [data],
  );

  return { data, record, clear, isPracticed, countOf, mounted };
}
