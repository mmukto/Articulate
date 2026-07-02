"use client";

import { useEffect, useRef, useState } from "react";

// Celebration confetti, flashed when a drill scores CELEBRATION_SCORE or
// better. Self-contained canvas animation (no dependencies): two cannons fire
// brand-colored pieces from the bottom corners, gravity brings them down, and
// the whole thing fades and unmounts itself after ~2.5s. Respects
// prefers-reduced-motion by not animating at all.
//
// Usage: keep a counter in state, bump it on each qualifying score, and render
// <ConfettiBurst key={counter} /> — the changing key re-mounts (re-fires) it.

export const CELEBRATION_SCORE = 90;

const COLORS = ["#6b6ed4", "#abadea", "#2f9e8f", "#59a96a", "#e0b64c", "#d4726b"];
const DURATION_MS = 2600;
const FADE_MS = 600;
const PIECES_PER_CANNON = 70;

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
}

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pieces: Piece[] = [];
    const cannon = (originX: number, angleCenter: number) => {
      for (let i = 0; i < PIECES_PER_CANNON; i++) {
        const angle = angleCenter + rand(-0.5, 0.5);
        const speed = rand(9, 22) * dpr;
        pieces.push({
          x: originX,
          y: H,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.25, 0.25),
          w: rand(5, 9) * dpr,
          h: rand(8, 14) * dpr,
          color: COLORS[i % COLORS.length],
        });
      }
    };
    // Bottom-left firing up-right; bottom-right firing up-left (canvas y is down).
    cannon(0.08 * W, -Math.PI / 3);
    cannon(0.92 * W, (-2 * Math.PI) / 3);

    const gravity = 0.35 * dpr;
    const drag = 0.99;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha =
        t > DURATION_MS - FADE_MS ? Math.max(0, (DURATION_MS - t) / FADE_MS) : 1;
      for (const p of pieces) {
        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (t < DURATION_MS) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    // rAF is throttled/paused in background tabs — guarantee the overlay is
    // removed on schedule even if the animation loop never gets to finish.
    const failsafe = window.setTimeout(() => setDone(true), DURATION_MS + 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, []);

  if (done) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-confetti
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
