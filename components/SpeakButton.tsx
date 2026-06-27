"use client";

import { useEffect, useState } from "react";

// Reads text aloud using the browser's built-in speech synthesis
// (Web Speech API). Works on iPad Safari; no API key needed.
export function SpeakButton({
  text,
  label = "Listen",
}: {
  text: string;
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
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
    utterance.rate = 1;
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
