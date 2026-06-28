"use client";

import { useEffect, useRef, useState } from "react";

// Reads text aloud using the browser's built-in speech synthesis (Web Speech
// API) — no API key, works on iPad Safari. Browsers ship a default voice that
// often sounds robotic, so we actively pick the most natural English voice the
// device offers (Windows "…Natural" online voices, Chrome's "Google US
// English", macOS/iOS "Samantha", etc.) and speak at a human cadence.

// Rank a voice by quality signals in its name/metadata. Higher is better.
function voiceScore(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  let s = 0;
  if (/natural|neural/.test(n)) s += 120; // Windows 11 / Edge neural voices
  if (/google/.test(n)) s += 80; // Chrome's higher-quality voices
  if (/premium|enhanced/.test(n)) s += 70; // macOS/iOS premium voices
  if (/\b(samantha|ava|allison|serena|jenny|aria|siri|karen|moira|tessa|nora)\b/.test(n)) s += 60;
  if (/\(online\)|online/.test(n)) s += 40; // online voices tend to be neural
  if (v.localService === false) s += 25; // cloud/online > on-device fallback
  if (/^en-us/i.test(v.lang)) s += 15;
  if (/^en/i.test(v.lang)) s += 5;
  if (/\b(zira|david|mark|hazel|george)\b/.test(n)) s += 8; // older SAPI — usable
  if (/espeak|compact|robot|eloquence/.test(n)) s -= 80; // known robotic
  return s;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const pool = english.length ? english : voices;
  return pool.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0] ?? null;
}

export function SpeakButton({
  text,
  label = "Listen",
}: {
  text: string;
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    const synth = window.speechSynthesis;
    const refresh = () => {
      voiceRef.current = pickBestVoice(synth.getVoices());
    };
    refresh(); // voices may already be loaded
    // Some browsers populate voices asynchronously; listen for the update.
    synth.addEventListener("voiceschanged", refresh);
    return () => synth.removeEventListener("voiceschanged", refresh);
  }, []);

  // Stop any speech if the component unmounts.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported || !text.trim()) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voiceRef.current ?? pickBestVoice(synth.getVoices());
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }
    // A touch slower than default reads more naturally and less clipped.
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
      aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
    >
      {speaking ? "■ Stop" : `▶ ${label}`}
    </button>
  );
}
