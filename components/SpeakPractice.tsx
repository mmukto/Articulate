"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Drill, SpokenFeedback } from "@/lib/types";
import { DELIVERY_MAP } from "@/lib/rubric";
import { useProgress } from "@/lib/progress";
import { ScoreBar } from "./ScoreBar";
import { SpeakButton } from "./SpeakButton";
import { ConfettiBurst, CELEBRATION_SCORE } from "./Confetti";

const MAX_SECONDS = 90;

/** Overall spoken score: the average of the delivery dimensions, rounded —
 *  the same number progress tracking records for a spoken attempt. */
function overallOf(fb: SpokenFeedback): number {
  const scores = fb.delivery.map((d) => d.score);
  return scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
}

function overallColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-600";
  return "text-danger";
}

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

/** Imperative handle for the drill's 🎙 Speak button (in DrillPractice), which
 *  is the ONLY recording control: it records, stops, and re-records. */
export interface SpeakPracticeHandle {
  toggleRecording: () => void;
}

export const SpeakPractice = forwardRef<
  SpeakPracticeHandle,
  {
    moduleSlug: string;
    drill: Drill;
    /** Fired when recording starts/stops so the Speak button can show state. */
    onRecordingChange?: (recording: boolean) => void;
  }
>(function SpeakPractice({ moduleSlug, drill, onRecordingChange }, ref) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SpokenFeedback | null>(null);
  // Bumped on every 90+ delivery score; the changing key re-fires the confetti.
  const [celebrate, setCelebrate] = useState(0);
  const { record } = useProgress();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function setRecordingState(v: boolean) {
    setRecording(v);
    onRecordingChange?.(v);
  }

  function cleanupStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  // Cleanup on unmount (also tells the Speak button recording has ended).
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      onRecordingChange?.(false);
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
    setRecordingState(false);
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
      setRecordingState(true);
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

  // The 🎙 Speak button (in DrillPractice) drives the whole flow through this
  // handle: tap to record, tap to stop, tap again for a new take.
  useImperativeHandle(
    ref,
    () => ({
      toggleRecording: () => {
        if (loading) return;
        if (recording) stop();
        else void start();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recording, loading],
  );

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
      const overall = overallOf(fb);
      if (overall >= CELEBRATION_SCORE) setCelebrate((c) => c + 1);
      record(moduleSlug, drill.id, overall);
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
      {/* Recorder status — the 🎙 Speak button above is the only control. */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-paper p-4">
        {recording ? (
          <span className="text-sm tabular-nums text-ink-soft">
            ● {fmt(seconds)} <span className="text-ink-mute">/ {fmt(MAX_SECONDS)}</span>
          </span>
        ) : audioUrl ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio src={audioUrl} controls className="h-9 max-w-[200px]" />
        ) : (
          <span className="text-sm text-ink-mute">
            Tap <span className="font-medium text-ink">🎙 Speak</span> above to start
            recording.
          </span>
        )}

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
        The 🎙 Speak button records, stops, and re-records (up to 90s per take). The
        coach transcribes your answer and scores your delivery — pace, filler words,
        clarity, and enunciation.
      </p>

      {loading ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-4 text-sm text-ink-mute">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Listening to your recording and scoring your delivery…
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-danger/30 bg-danger-wash/60 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {feedback ? <SpokenFeedbackPanel feedback={feedback} /> : null}
      {celebrate > 0 ? <ConfettiBurst key={celebrate} /> : null}
    </div>
  );
});

function SpokenFeedbackPanel({ feedback }: { feedback: SpokenFeedback }) {
  const overall = overallOf(feedback);
  return (
    <div className="mt-6 space-y-6 border-t border-ink/10 pt-6">
      {/* Overall delivery + headline, mirroring the written feedback panel. */}
      <div className="flex items-start gap-5">
        <div className="text-center">
          <div
            className={`font-serif text-4xl font-bold tabular-nums ${overallColor(overall)}`}
          >
            {overall}
          </div>
          <div className="text-xs uppercase tracking-widest text-ink-mute">overall</div>
        </div>
        <p className="flex-1 font-serif text-lg leading-snug">{feedback.headline}</p>
      </div>

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
