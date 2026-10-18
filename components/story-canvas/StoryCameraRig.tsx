"use client";

import { useFrame } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { sampleStoryCamera } from "./storyCamera";
import { smooth, stepSmooth } from "./storySmooth";

export default function StoryCameraRig(): null {
  useFrame((state, dt) => {
    stepSmooth(Math.min(dt, 0.05));
    sampleStoryCamera(
      smooth.phase,
      state.camera as PerspectiveCamera,
      state.size.width / Math.max(state.size.height, 1),
    );
  }, -1);

  return null;
}
