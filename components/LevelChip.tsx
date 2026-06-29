"use client";

import Link from "next/link";
import { LEVEL_MAP, readLevel, hasChosenLevel } from "@/lib/levels";
import { useMaybeUser } from "@/components/auth";

// Persistent header chip showing the signed-in user's career level (or a nudge
// to set it). Links to the modules, where the level can be changed (selection
// lives on module pages and the Plans page, not on progress).
export default function LevelChip() {
  const { user } = useMaybeUser();
  if (!user) return null;

  const chosen = hasChosenLevel(user.unsafeMetadata);
  const label = chosen ? LEVEL_MAP[readLevel(user.unsafeMetadata)].name : "Set your level";

  return (
    <Link
      href="/#modules"
      title="Your career level — change it on any module or the Plans page"
      className={`hidden items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors sm:inline-flex ${
        chosen
          ? "border-ink/15 text-ink-mute hover:border-accent hover:text-accent"
          : "border-accent/40 text-accent hover:bg-accent-wash/40"
      }`}
    >
      <span aria-hidden>◐</span>
      {label}
    </Link>
  );
}
