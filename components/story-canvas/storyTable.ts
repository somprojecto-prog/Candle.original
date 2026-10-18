import { MathUtils } from "three";

export interface Track {
  values: readonly number[];
  windows?: readonly (readonly [number, number] | undefined)[];
}

export const TRACKS = {
  boxLift: {
    values: [0, 2, 2, 2, 0],
    windows: [undefined, [0, 0.7], undefined, undefined, [0.5, 1]],
  },
  lidStage: {
    values: [0, 0, 1, 2, 3],
    windows: [undefined, undefined, [0.2, 1], [0, 1], [0, 0.55]],
  },
} as const satisfies Record<string, Track>;

export function sampleTrack(t: Track, phase: number): number {
  const n = t.values.length;
  const p = MathUtils.clamp(phase, 0, n - 1);
  const i = Math.min(Math.floor(p), n - 2);
  let f = p - i;
  const w = t.windows?.[i + 1];
  if (w) f = MathUtils.clamp((f - w[0]) / Math.max(w[1] - w[0], 1e-6), 0, 1);
  return MathUtils.lerp(t.values[i], t.values[i + 1], f);
}
