import * as THREE from "three";

export interface Delta {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}
export const makeDelta = (): Delta => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });

interface LidKey {
  p: readonly [number, number, number];
  r: readonly [number, number, number];
}

export const LID_KEYS: readonly LidKey[] = [
  { p: [0, 0, 0], r: [0, 0, 0] },
  { p: [-0.3, 0.6, 0.2], r: [0.45, 0, 0.32] },
  { p: [0, 0.9, 0], r: [0.6, 0, -0.1] },
  { p: [0, 0, 0], r: [0, 0, 0] },
];

export function lidDelta(stage: number, out: Delta): Delta {
  const s = THREE.MathUtils.clamp(stage, 0, 3);
  const i = Math.min(Math.floor(s), 2);
  const t = s - i;
  const a = LID_KEYS[i];
  const b = LID_KEYS[i + 1];
  const { lerp } = THREE.MathUtils;
  out.x = lerp(a.p[0], b.p[0], t);
  out.y = lerp(a.p[1], b.p[1], t);
  out.z = lerp(a.p[2], b.p[2], t);
  out.rx = lerp(a.r[0], b.r[0], t);
  out.ry = lerp(a.r[1], b.r[1], t);
  out.rz = lerp(a.r[2], b.r[2], t);
  return out;
}

export const boxLiftY = (l: number): number => (l <= 1 ? l * 1.6 : 1.6 + (l - 1) * 4.0);
export const boxOpacity = (l: number): number => 1 - THREE.MathUtils.smoothstep(l, 1.35, 1.9);
