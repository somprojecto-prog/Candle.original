"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { storyState } from "@/lib/story";
import { smooth } from "./storySmooth";

const EPS = 0.0005;
const WARMUP_FRAMES = 30;
const TAIL_FRAMES = 24;

export default function Invalidator(): null {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let warm = 0;
    let tail = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (warm < WARMUP_FRAMES) {
        warm++;
        invalidate();
        return;
      }
      if (!storyState.active) {
        tail = 0;
        return;
      }
      if (Math.abs(smooth.phase - storyState.phase) > EPS) {
        tail = TAIL_FRAMES;
        invalidate();
      } else if (tail > 0) {
        tail--;
        invalidate();
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  return null;
}
