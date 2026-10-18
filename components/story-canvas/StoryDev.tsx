"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { resetStoryState, STORY_FOCUS, STORY_STEPS, storyState } from "@/lib/story";

const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

const MAX = STORY_STEPS.length - 1;

function focusAt(phase: number, aspect: number): [number, number] {
  const p = Math.min(Math.max(phase, 0), MAX);
  const i = Math.min(Math.floor(p), MAX - 1);
  const t = p - i;
  const a = STORY_FOCUS[i];
  const b = STORY_FOCUS[i + 1];
  let fx = a[0] + (b[0] - a[0]) * t;
  const fy = a[1] + (b[1] - a[1]) * t;
  if (aspect < 1.5) {
    const k = Math.min(Math.max((aspect - 1) / 0.5, 0), 1);
    fx = 0.5 + (fx - 0.5) * k;
  }
  return [fx, fy];
}

export default function StoryDev({ initialPhase }: { initialPhase: number }) {
  const [phase, setPhase] = useState(Math.min(Math.max(initialPhase, 0), MAX));
  const [aspect, setAspect] = useState(16 / 9);

  useEffect(() => {
    storyState.phase = phase;
    storyState.active = true;
  }, [phase]);

  useEffect(() => () => resetStoryState(), []);

  useEffect(() => {
    const update = () => setAspect(window.innerWidth / Math.max(window.innerHeight, 1));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [fx, fy] = focusAt(phase, aspect);

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] text-fg">
      <StoryCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
        style={{ left: `${fx * 100}%`, top: `${fy * 100}%` }}
      />

      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center gap-4 border-t border-line bg-ink/90 px-6 py-4">
        <span className="text-caption uppercase text-gold">phase {phase.toFixed(2)}</span>
        <input
          type="range"
          min={0}
          max={MAX}
          step={0.01}
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="min-w-[240px] flex-1 accent-[#C9A84C]"
          aria-label="Story phase"
        />
        <div className="flex gap-2">
          {STORY_STEPS.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => setPhase(i)}
              className="rounded border border-line px-3 py-1 text-caption uppercase text-muted hover:border-gold hover:text-gold"
            >
              {i} {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
