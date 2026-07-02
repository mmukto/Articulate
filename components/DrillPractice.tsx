"use client";

import { useRef, useState } from "react";
import type { Drill, Feedback } from "@/lib/types";
import { DIMENSION_MAP } from "@/lib/course";
import { LEVEL_MAP } from "@/lib/levels";
import { useProgress } from "@/lib/progress";
import { ScoreBar } from "./ScoreBar";
import { SpeakButton } from "./SpeakButton";
import { SpeakPractice, type SpeakPracticeHandle } from "./SpeakPractice";
import { PracticedBadge } from "./PracticedBadge";

type Mode = "write" | "speak";

function overallColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-600";
  return "text-danger";
}

export function DrillPractice({
  moduleSlug,
  drill,
}: {
  moduleSlug: string;
  drill: Drill;
}) {
  // Speak leads: spoken practice is the flagship mode, so it's first and the
  // default (highlighted). Writing is one tap away.
  const [mode, setMode] = useState<Mode>("speak");
  // The 🎙 Speak button IS the recorder control: in speak mode, tapping it
  // records → stops → records a new take (via the imperative handle below).
  // SpeakPractice reports recording state back so the button can show it.
  const speakRef = useRef<SpeakPracticeHandle>(null);
  const [recording, setRecording] = useState(false);

  return (
    <div className="rounded-xl border border-ink/10 bg-white/60 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-serif text-xl font-semibold tracking-tight">
          {drill.title}
        </h3>
        <span
          title="This scenario is matched to your career level"
          className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2 py-0.5 text-[11px] font-medium text-ink-mute"
        >
          <span aria-hidden>◐</span>
          {LEVEL_MAP[drill.level ?? "senior"].name}
        </span>
        <PracticedBadge moduleSlug={moduleSlug} drillId={drill.id} />
        <div className="ml-auto flex flex-wrap gap-1.5">
          {drill.focus.map((k) => (
            <span
              key={k}
              className="rounded-full bg-accent-wash px-2.5 py-0.5 text-xs font-medium text-accent"
            >
              {DIMENSION_MAP[k].label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-paper p-4 text-sm leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">Scenario. </span>
        {drill.scenario}
      </div>

      <p className="mt-4 font-medium">{drill.task}</p>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-accent hover:underline">
          Coaching tips
        </summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-ink-mute">
          {drill.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </details>

      {/* Mode toggle. The Speak button doubles as the one recording control. */}
      <div className="mt-4 inline-flex rounded-lg border border-ink/15 bg-paper p-0.5 text-sm">
        <button
          onClick={() => {
            if (mode !== "speak") {
              setMode("speak"); // first tap opens speak practice; next tap records
              return;
            }
            speakRef.current?.toggleRecording();
          }}
          aria-label={
            mode !== "speak"
              ? "Switch to spoken practice"
              : recording
                ? "Stop recording"
                : "Start recording"
          }
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === "speak"
              ? recording
                ? "bg-ink text-white shadow-sm"
                : "bg-accent text-white shadow-sm"
              : "text-ink-soft hover:text-accent"
          }`}
        >
          {mode === "speak" && recording ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-sm bg-red-400" />
              Stop
            </>
          ) : (
            "🎙 Speak"
          )}
        </button>
        <button
          onClick={() => {
            setMode("write");
            setRecording(false); // leaving speak mode ends any recording
          }}
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
            mode === "write"
              ? "bg-accent text-white shadow-sm"
              : "text-ink-soft hover:text-accent"
          }`}
        >
          ✍️ Write
        </button>
      </div>

      {mode === "write" ? (
        <WritePractice moduleSlug={moduleSlug} drill={drill} />
      ) : (
        <SpeakPractice
          ref={speakRef}
          moduleSlug={moduleSlug}
          drill={drill}
          onRecordingChange={setRecording}
        />
      )}
    </div>
  );
}

function WritePractice({
  moduleSlug,
  drill,
}: {
  moduleSlug: string;
  drill: Drill;
}) {
  const { record } = useProgress();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;

  async function submit() {
    if (!response.trim() || loading) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, drillId: drill.id, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      const fb = data.feedback as Feedback;
      setFeedback(fb);
      record(moduleSlug, drill.id, fb.overall);
      // Nudge the allowance indicator to refresh now that spend was recorded.
      window.dispatchEvent(new Event("articulate:usage"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get feedback.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFeedback(null);
    setError(null);
  }

  return (
    <div className="mt-4">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder={drill.placeholder || "Write your response here…"}
        rows={6}
        maxLength={6000}
        className="w-full resize-y rounded-lg border border-ink/15 bg-white p-3 text-sm leading-relaxed shadow-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-ink-mute">{wordCount} words</span>
        <div className="flex gap-2">
          {feedback ? (
            <button
              onClick={reset}
              className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Revise
            </button>
          ) : null}
          <button
            onClick={submit}
            disabled={loading || !response.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Coaching…" : feedback ? "Re-score" : "Get feedback"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-4 text-sm text-ink-mute">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          The coach is reading your response and scoring it against the rubric…
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-danger/30 bg-danger-wash/60 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {feedback ? <FeedbackPanel feedback={feedback} /> : null}
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: Feedback }) {
  return (
    <div className="mt-6 space-y-6 border-t border-ink/10 pt-6">
      {/* Overall + headline */}
      <div className="flex items-start gap-5">
        <div className="text-center">
          <div
            className={`font-serif text-4xl font-bold tabular-nums ${overallColor(
              feedback.overall,
            )}`}
          >
            {feedback.overall}
          </div>
          <div className="text-xs uppercase tracking-widest text-ink-mute">overall</div>
        </div>
        <p className="flex-1 font-serif text-lg leading-snug">{feedback.headline}</p>
      </div>

      {/* Dimension scores */}
      {feedback.dimensions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {feedback.dimensions.map((d) => (
            <ScoreBar
              key={d.key}
              label={DIMENSION_MAP[d.key]?.label ?? d.key}
              score={d.score}
              comment={d.comment}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {feedback.strengths.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              What worked
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-600">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {feedback.improvements.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Sharpen this
            </h4>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Rewrite */}
      {feedback.rewrite ? (
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
              A stronger version
            </h4>
            <SpeakButton text={feedback.rewrite} label="Hear it" />
          </div>
          <blockquote className="mt-2 rounded-lg border-l-2 border-accent bg-paper p-4 font-serif text-[15px] leading-relaxed text-ink">
            {feedback.rewrite}
          </blockquote>
          {feedback.rewriteRationale ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-mute">
              {feedback.rewriteRationale}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Next drill */}
      {feedback.drill ? (
        <div className="rounded-lg bg-accent-wash/50 p-4">
          <span className="text-sm font-semibold text-accent">Try next: </span>
          <span className="text-sm leading-relaxed text-ink-soft">{feedback.drill}</span>
        </div>
      ) : null}
    </div>
  );
}
