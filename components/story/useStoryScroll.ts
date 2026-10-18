"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HEADER_H } from "@/lib/constants";
import { resetStoryState, STORY_SECTION_IDS, storyEase, storyState } from "@/lib/story";
import { useStoryMode } from "@/components/story/useStoryMode";

gsap.registerPlugin(ScrollTrigger);

/**
 * start[i] = início do pin da secção i; end[i] = fim do pin.
 * Entre end[i] e start[i+1] a câmera transita; fora disso, phase é o inteiro do passo.
 */
function computePhase(y: number, start: number[], end: number[]): number {
  if (y <= end[0]) return 0;
  for (let i = 0; i < 4; i++) {
    if (y < start[i + 1]) {
      const span = start[i + 1] - end[i];
      return span > 0 ? i + storyEase((y - end[i]) / span) : i;
    }
    // Intervalo degenerado (start[i+1] <= end[i]) cai aqui: salto seco para i + 1.
    if (i + 1 < 4 && y <= end[i + 1]) return i + 1;
  }
  return 4;
}

export function useStoryScroll(rootRef: RefObject<HTMLElement | null>): void {
  const mode = useStoryMode();

  useEffect(() => {
    if (mode !== "on") {
      resetStoryState();
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    let start: number[] = [];
    let end: number[] = [];
    let lastY = -1;
    let cancelled = false;

    const measure = () => {
      const scrollY = window.scrollY;
      const s: number[] = [];
      const e: number[] = [];
      for (const id of STORY_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + scrollY;
        const bottom = top + el.offsetHeight;
        s.push(Math.max(0, top - HEADER_H));
        e.push(bottom - window.innerHeight);
      }
      start = s;
      end = e;
      lastY = -1;
    };

    const tick = () => {
      if (start.length !== STORY_SECTION_IDS.length) return;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;

      storyState.phase = computePhase(y, start, end);
      const margin = window.innerHeight * 1.2;
      storyState.active = y > start[0] - margin && y < end[end.length - 1] + margin;
    };

    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    gsap.ticker.add(tick);

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      resetStoryState();
    };
  }, [mode, rootRef]);
}
