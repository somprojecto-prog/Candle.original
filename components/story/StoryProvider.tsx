"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getStoryMode,
  setStoryMode,
  STORY_FAIL_EVENT,
  storyFlags,
  type StoryMode,
} from "@/lib/story";
import StoryStage from "@/components/story/StoryStage";
import { useStoryScroll } from "@/components/story/useStoryScroll";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = "(min-width: 900px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

let webglCache: boolean | null = null;
function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function computeMode(failed: boolean): StoryMode {
  const wide = window.matchMedia(DESKTOP_QUERY).matches;
  const webgl = hasWebGL();
  let forced: string | null = null;

  if (process.env.NODE_ENV !== "production") {
    const q = new URLSearchParams(window.location.search).get("story");
    if (q === "on" || q === "off") forced = q;
  }

  const result: StoryMode = forced
    ? (forced as StoryMode)
    : wide && webgl && !failed
      ? "on"
      : "off";

  if (process.env.NODE_ENV !== "production" && result === "off") {
    console.info("[story] off:", { wide, webgl, failed, forced });
  }
  return result;
}

export default function StoryProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onFail = () => setFailed(true);
    window.addEventListener(STORY_FAIL_EVENT, onFail);
    return () => window.removeEventListener(STORY_FAIL_EVENT, onFail);
  }, []);

  useEffect(() => {
    const mqDesktop = window.matchMedia(DESKTOP_QUERY);
    const mqReduced = window.matchMedia(REDUCED_QUERY);
    let raf = 0;

    const apply = () => {
      storyFlags.reducedMotion = mqReduced.matches;
      const next = computeMode(failed);
      document.documentElement.dataset.story = next;
      if (next !== getStoryMode()) {
        setStoryMode(next);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    apply();
    mqDesktop.addEventListener("change", apply);
    mqReduced.addEventListener("change", apply);

    return () => {
      cancelAnimationFrame(raf);
      mqDesktop.removeEventListener("change", apply);
      mqReduced.removeEventListener("change", apply);
    };
  }, [failed]);

  useStoryScroll(rootRef);

  return (
    <div ref={rootRef} data-story-root className="relative">
      <StoryStage />
      {children}
    </div>
  );
}
