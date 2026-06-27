"use client";

import { useEffect, useRef, useState } from "react";
import type { Drill, SpokenFeedback } from "@/lib/types";
import { DELIVERY_MAP } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { ScoreBar } from "./ScoreBar";
import { SpeakButton } from "./SpeakButton";

const MAX_SECONDS = 90;

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const c of ["audio/mp4", "audio/webm", "audio/ogg"]) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      /* ignore */
    }
  }
  return "";
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const s = String(reader.result);
      resolve(s.slice(s.indexOf(",") + 1)); // strip the data: prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function SpeakPractice({
  moduleSlug,
  drill,
}: {
  moduleSlug: string;
  drill: Drill;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SpokenFeedback | null>(null);
  const { record } = useProgress();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    setRecording(false);
  }

  async function start() {
    setError(null);
    setFeedback(null);
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError("Recording isn't supported in this browser. Try Safari on iPad.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMimeType();
      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const type = rec.mimeType || mime || "audio/mp4";
        const blob = new Blob(chunksRef.current, { type });
        setAudioBlob(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        cleanupStream();
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
      setSeconds(0);
      setAudioBlob(null);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stop();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError(
        "Microphone access was blocked. Allow the mic for this site in Safari, then try again.",
      );
      cleanupStream();
    }
  }

  async function submit() {
    if (!audioBlob || loading) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const base64 = await blobToBase64(audioBlob);
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug,
          drillId: drill.id,
          audio: base64,
          mimeType: audioBlob.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      const fb = data.feedback as SpokenFeedback;
      setFeedback(fb);
      const scores = fb.delivery.map((d) => d.score);
      const avg = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
      record(moduleSlug, drill.id, avg);
      // Nudge the allowance indicator to refresh now that spend was recorded.
      window.dispatchEvent(new Event("articulate:usage"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      {/* Recorder controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-paper p-4">
        {!recording ? (
          <button
            onClick={start}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
            {audioBlob ? "Re-record" : "Record"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white shadow-sm"
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-sm bg-red-400" />
            Stop
          </button>
        )}

        {recording ? (
          <span className="text-sm tabular-nums text-ink-soft">
            ● {fmt(seconds)} <span className="text-ink-mute">/ {fmt(MAX_SECONDS)}</span>
          </span>
        ) : null}

        {audioUrl && !recording ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio src={audioUrl} controls className="h-9 max-w-[200px]" />
        ) : null}

        {audioBlob && !recording ? (
          <button
            onClick={submit}
            disabled={loading}
            className="ml-auto rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Coaching…" : "Get spoken feedback"}
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-ink-mute">
        Speak your answer aloud (up to 90s). The coach transcribes it and scores your
        delivery — pace, filler words, clarity, and enunciation.
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-4 text-sm text-ink-mute">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Listening to your recording and scoring your delivery…
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-accent/30 bg-accent-wash/50 p-4 text-sm text-accent">
          {error}
        </div>
      ) : null}

      {feedback ? <SpokenFeedbackPanel feedback={feedback} /> : null}
    </div>
  );
}

function SpokenFeedbackPanel({ feedback }: { feedback: SpokenFeedback }) {
  return (
    <div className="mt-6 space-y-6 border-t border-ink/10 pt-6">
      <p className="font-serif text-lg leading-snug">{feedback.headline}</p>

      {feedback.delivery.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {feedback.delivery.map((d) => (
            <ScoreBar
              key={d.key}
              label={DELIVERY_MAP[d.key]?.label ?? d.key}
              score={d.score}
              comment={d.comment}
            />
          ))}
        </div>
      ) : null}

      {feedback.fillerWords.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Fillers heard
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {feedback.fillerWords.map((w, i) => (
              <span
                key={i}
                className="rounded-full bg-accent-wash px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {w}
              </span>
            ))}
          </div>
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

      {feedback.modelDelivery ? (
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Say it like this
            </h4>
            <SpeakButton text={feedback.modelDelivery} label="Hear it" />
          </div>
          <blockquote className="mt-2 rounded-lg border-l-2 border-accent bg-paper p-4 font-serif text-[15px] leading-relaxed text-ink">
            {feedback.modelDelivery}
          </blockquote>
        </div>
      ) : null}

      {feedback.transcript ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-accent hover:underline">
            What the coach heard (transcript)
          </summary>
          <p className="mt-2 whitespace-pre-wrap rounded-lg bg-paper p-3 leading-relaxed text-ink-mute">
            {feedback.transcript}
          </p>
        </details>
      ) : null}
    </div>
  );
}
