import { MathUtils } from "three";
import { storyState } from "@/lib/story";

export const smooth = { phase: storyState.phase };

const LAMBDA = 5;
const SNAP = 2e-4;

export function stepSmooth(dt: number): void {
  const target = storyState.phase;
  if (Math.abs(target - smooth.phase) < SNAP) {
    smooth.phase = target;
    return;
  }
  smooth.phase = MathUtils.damp(smooth.phase, target, LAMBDA, dt);
}
