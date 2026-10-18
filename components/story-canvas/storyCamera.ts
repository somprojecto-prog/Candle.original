import * as THREE from "three";
import { STORY_FOCUS } from "@/lib/story";

export interface StoryCamKey {
  target: readonly [number, number, number];
  height: number;
  width: number;
  fillH: number;
  maxW: number;
  elev: number;
  azim: number;
  fov: number;
}

export const STORY_CAMERA: readonly StoryCamKey[] = [
  { target: [0, 0.0, 0], height: 2.1, width: 3.2, fillH: 0.58, maxW: 0.42, elev: 12, azim: 30, fov: 28 },
  { target: [0, -0.05, 0], height: 1.9, width: 2.4, fillH: 0.62, maxW: 0.42, elev: 16, azim: 14, fov: 28 },
  { target: [0, 0.2, 0], height: 2.4, width: 2.2, fillH: 0.82, maxW: 0.48, elev: 22, azim: -24, fov: 28 },
  { target: [0, 0.55, 0], height: 3.0, width: 1.9, fillH: 0.72, maxW: 0.34, elev: 12, azim: 0, fov: 28 },
  { target: [0, 0.0, 0], height: 2.1, width: 3.2, fillH: 0.58, maxW: 0.42, elev: 10, azim: 38, fov: 28 },
];

const N = STORY_CAMERA.length;
const D2R = Math.PI / 180;
const MAX_ELEV = 85;

const _target = new THREE.Vector3();
const _off = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _sph = new THREE.Spherical();
const { lerp, clamp } = THREE.MathUtils;

function distanceFor(k: StoryCamKey, aspect: number): number {
  const th = Math.tan((k.fov * D2R) / 2);
  const distH = k.height / k.fillH / (2 * th);
  const distW = k.width / k.maxW / (2 * th * aspect);
  return Math.max(distH, distW);
}

export function sampleStoryCamera(
  phase: number,
  camera: THREE.PerspectiveCamera,
  aspect: number,
): void {
  const p = clamp(phase, 0, N - 1);
  const i = Math.min(Math.floor(p), N - 2);
  const t = p - i;
  const a = STORY_CAMERA[i];
  const b = STORY_CAMERA[i + 1];

  _target.set(
    lerp(a.target[0], b.target[0], t),
    lerp(a.target[1], b.target[1], t),
    lerp(a.target[2], b.target[2], t),
  );

  const dist = lerp(distanceFor(a, aspect), distanceFor(b, aspect), t);
  const elev = clamp(lerp(a.elev, b.elev, t), -MAX_ELEV, MAX_ELEV) * D2R;
  let dAz = b.azim - a.azim;
  dAz -= 360 * Math.round(dAz / 360);
  const azim = (a.azim + dAz * t) * D2R;
  const fov = lerp(a.fov, b.fov, t);

  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }

  _sph.set(dist, Math.PI / 2 - elev, azim);
  _off.setFromSpherical(_sph);
  camera.position.copy(_target).add(_off);
  camera.lookAt(_target);
  camera.updateMatrix();
  _right.setFromMatrixColumn(camera.matrix, 0);
  _up.setFromMatrixColumn(camera.matrix, 1);

  const fa = STORY_FOCUS[i];
  const fb = STORY_FOCUS[i + 1];
  let fx = lerp(fa[0], fb[0], t);
  const fy = lerp(fa[1], fb[1], t);
  if (aspect < 1.5) fx = lerp(0.5, fx, clamp((aspect - 1) / 0.5, 0, 1));

  const ndcX = 2 * fx - 1;
  const ndcY = 1 - 2 * fy;
  const halfH = dist * Math.tan((camera.fov * D2R) / 2);
  const halfW = halfH * aspect;
  camera.position.addScaledVector(_right, -ndcX * halfW).addScaledVector(_up, -ndcY * halfH);
}
