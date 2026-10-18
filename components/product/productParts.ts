import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { FIT, NAMED_NODES } from "./config";

export interface PartData {
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
}

export interface ProductParts {
  jar: PartData;
  tray: PartData;
  lid: PartData;
  boxMeshes: PartData[];
  boxPosition: THREE.Vector3;
  lidRadius: number;
  lidHeight: number;
}

interface Comp {
  geo: THREE.BufferGeometry;
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  roundness: number;
  aspect: number;
  hRatio: number;
}

interface Raw {
  lid: Comp;
  candle: Comp;
  tray: Comp;
  ring: { x: number; z: number } | null;
  boxes: Comp[];
}

function bakeWorld(root: THREE.Object3D, requireIndex: boolean): THREE.BufferGeometry | null {
  root.updateWorldMatrix(true, true);
  const list: THREE.BufferGeometry[] = [];
  let ok = true;

  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const src = o.geometry as THREE.BufferGeometry;
    const pos = src.getAttribute("position");
    if (!pos) return;
    if (requireIndex && !src.index) {
      ok = false;
      return;
    }
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      arr[i * 3] = pos.getX(i);
      arr[i * 3 + 1] = pos.getY(i);
      arr[i * 3 + 2] = pos.getZ(i);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const idx = src.index
      ? Uint32Array.from(src.index.array)
      : Uint32Array.from({ length: pos.count }, (_, i) => i);
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.applyMatrix4(o.matrixWorld);
    list.push(g);
  });

  if (!ok || list.length === 0) {
    list.forEach((g) => g.dispose());
    return null;
  }
  if (list.length === 1) return list[0];
  const merged = BufferGeometryUtils.mergeGeometries(list, false);
  list.forEach((g) => g.dispose());
  return merged;
}

function splitComponents(src: THREE.BufferGeometry, minVerts: number): THREE.BufferGeometry[] {
  const pos = src.getAttribute("position");
  const index = src.index;
  if (!index) return [];
  const I = index.array;
  const V = pos.count;

  const parent = new Int32Array(V);
  for (let i = 0; i < V; i++) parent[i] = i;
  const find = (x: number): number => {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    let cur = x;
    while (parent[cur] !== r) {
      const n = parent[cur];
      parent[cur] = r;
      cur = n;
    }
    return r;
  };
  for (let t = 0; t < I.length; t += 3) {
    const ra = find(I[t]);
    const rb = find(I[t + 1]);
    if (ra !== rb) parent[ra] = rb;
    const rc = find(I[t + 2]);
    const rr = find(I[t + 1]);
    if (rc !== rr) parent[rc] = rr;
  }

  const compOf = new Int32Array(V);
  const rootToComp = new Map<number, number>();
  const vCount: number[] = [];
  for (let v = 0; v < V; v++) {
    const r = find(v);
    let c = rootToComp.get(r);
    if (c === undefined) {
      c = vCount.length;
      rootToComp.set(r, c);
      vCount.push(0);
    }
    compOf[v] = c;
    vCount[c]++;
  }

  const keep = vCount.map((n) => n > minVerts);
  const tCount = new Array<number>(vCount.length).fill(0);
  for (let t = 0; t < I.length; t += 3) tCount[compOf[I[t]]]++;

  const positions = vCount.map((n, c) => (keep[c] ? new Float32Array(n * 3) : null));
  const indices = tCount.map((n, c) => (keep[c] ? new Uint32Array(n * 3) : null));
  const vCur = new Array<number>(vCount.length).fill(0);
  const tCur = new Array<number>(vCount.length).fill(0);
  const remap = new Int32Array(V);

  for (let v = 0; v < V; v++) {
    const c = compOf[v];
    const p = positions[c];
    if (!p) continue;
    const k = vCur[c]++;
    remap[v] = k;
    p[k * 3] = pos.getX(v);
    p[k * 3 + 1] = pos.getY(v);
    p[k * 3 + 2] = pos.getZ(v);
  }
  for (let t = 0; t < I.length; t += 3) {
    const c = compOf[I[t]];
    const ia = indices[c];
    if (!ia) continue;
    const k = tCur[c];
    ia[k] = remap[I[t]];
    ia[k + 1] = remap[I[t + 1]];
    ia[k + 2] = remap[I[t + 2]];
    tCur[c] += 3;
  }

  const out: THREE.BufferGeometry[] = [];
  for (let c = 0; c < vCount.length; c++) {
    const p = positions[c];
    const ia = indices[c];
    if (!p || !ia) continue;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setIndex(new THREE.BufferAttribute(ia, 1));
    out.push(g);
  }
  return out;
}

function measure(geo: THREE.BufferGeometry): Comp {
  geo.computeBoundingBox();
  const box = (geo.boundingBox ?? new THREE.Box3()).clone();
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const pos = geo.getAttribute("position");
  let maxR2 = 0;
  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i) - center.x;
    const dz = pos.getZ(i) - center.z;
    const r2 = dx * dx + dz * dz;
    if (r2 > maxR2) maxR2 = r2;
  }
  const foot = Math.max(size.x, size.z);
  return {
    geo,
    box,
    size,
    center,
    roundness: foot > 0 ? Math.sqrt(maxR2) / (foot / 2) : 0,
    aspect: foot > 0 ? Math.min(size.x, size.z) / foot : 0,
    hRatio: foot > 0 ? size.y / foot : 0,
  };
}

function findRing(c: Comp): { x: number; z: number } | null {
  const pos = c.geo.getAttribute("position");
  const yMin = c.box.max.y - 0.12 * c.size.y;
  const rMax = 0.4 * Math.max(c.size.x, c.size.z);
  let n = 0;
  let sx = 0;
  let sz = 0;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) < yMin) continue;
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dx = x - c.center.x;
    const dz = z - c.center.z;
    if (dx * dx + dz * dz > rMax * rMax) continue;
    n++;
    sx += x;
    sz += z;
  }
  return n >= 12 ? { x: sx / n, z: sz / n } : null;
}

function classify(comps: Comp[]): Raw | null {
  const round = (c: Comp) => c.roundness < 1.1 && c.aspect > 0.85;

  const lid = comps.filter((c) => round(c) && c.hRatio < 0.2).sort((a, b) => a.hRatio - b.hRatio)[0];
  const candle = comps
    .filter((c) => c !== lid && round(c) && c.hRatio >= 0.9)
    .sort((a, b) => a.roundness - b.roundness)[0];
  const trayCands = comps.filter(
    (c) => c !== lid && c !== candle && c.aspect > 0.8 && c.hRatio > 0.3 && c.hRatio < 0.6,
  );
  let tray: Comp | undefined;
  let ring: { x: number; z: number } | null = null;
  for (const c of trayCands) {
    const r = findRing(c);
    if (r) {
      tray = c;
      ring = r;
      break;
    }
  }
  if (!tray) tray = trayCands[0];

  if (!lid || !candle || !tray) return null;

  const remaining = comps.filter((c) => c !== lid && c !== candle && c !== tray);
  if (remaining.length === 0) return null;
  const vol = (c: Comp) => c.size.x * c.size.y * c.size.z;
  const outer = [...remaining].sort((a, b) => vol(b) - vol(a))[0];
  const boxes = remaining.filter((c) => c === outer || c.box.intersectsBox(outer.box));

  return { lid, candle, tray, ring, boxes };
}

function fromNamed(scene: THREE.Group): Raw | null {
  const keys = Object.keys(NAMED_NODES) as (keyof typeof NAMED_NODES)[];
  const found: Partial<Record<keyof typeof NAMED_NODES, THREE.Object3D>> = {};
  scene.traverse((o) => {
    if (!o.name) return;
    keys.forEach((k) => {
      if (!found[k] && NAMED_NODES[k].test(o.name)) found[k] = o;
    });
  });
  const { lid, boxBody, tray, candle } = found;
  if (!lid || !boxBody || !tray || !candle) return null;

  const geos = [lid, boxBody, tray, candle].map((n) => bakeWorld(n, false));
  if (geos.some((g) => g === null)) {
    geos.forEach((g) => g?.dispose());
    return null;
  }
  const [gl, gb, gt, gc] = geos as THREE.BufferGeometry[];
  return {
    lid: measure(gl),
    boxes: [measure(gb)],
    tray: measure(gt),
    candle: measure(gc),
    ring: null,
  };
}

function fit(geo: THREE.BufferGeometry, srcCenter: THREE.Vector3, scale: THREE.Vector3): THREE.BufferGeometry {
  geo.translate(-srcCenter.x, -srcCenter.y, -srcCenter.z);
  geo.scale(scale.x, scale.y, scale.z);
  const out = BufferGeometryUtils.toCreasedNormals(geo, Math.PI / 6);
  if (out !== geo) geo.dispose();
  return out;
}

function assemble(raw: Raw): ProductParts {
  const { lid, candle, tray, ring, boxes } = raw;
  const v = new THREE.Vector3();

  const sj = FIT.jar.height / candle.size.y;
  const jarGeo = fit(candle.geo, candle.center, v.set(sj, sj, sj));
  const jarPos = new THREE.Vector3(0, FIT.jar.centerY, 0);

  const sl = FIT.lid.diameter / Math.max(lid.size.x, lid.size.z);
  const lidH = lid.size.y * sl;
  const lidGeo = fit(lid.geo, lid.center, v.set(sl, sl, sl));
  const lidPos = new THREE.Vector3(0, FIT.lid.bottomY + lidH / 2, 0);

  const [tw, th, td] = FIT.tray.size;
  const tsx = tw / tray.size.x;
  const tsz = td / tray.size.z;
  const trayGeo = fit(tray.geo, tray.center, v.set(tsx, th / tray.size.y, tsz));
  let ox = 0;
  let oz = 0;
  if (ring) {
    const fx = ring.x - tray.center.x;
    const fz = ring.z - tray.center.z;
    if (Math.hypot(fx, fz) < 0.15 * Math.max(tray.size.x, tray.size.z)) {
      ox = -fx * tsx;
      oz = -fz * tsz;
    }
  }
  const trayPos = new THREE.Vector3(ox, FIT.tray.bottomY + th / 2, oz);

  const union = new THREE.Box3();
  boxes.forEach((b) => union.union(b.box));
  const uSize = union.getSize(new THREE.Vector3());
  const uCenter = union.getCenter(new THREE.Vector3());
  const [bw, bh, bd] = FIT.box.size;
  const bs = new THREE.Vector3(bw / uSize.x, bh / uSize.y, bd / uSize.z);

  const boxMeshes: PartData[] = boxes.map((b) => {
    const offset = b.center.clone().sub(uCenter).multiply(bs);
    return {
      geometry: fit(b.geo, b.center, bs),
      position: offset,
    };
  });
  const boxPosition = new THREE.Vector3(0, FIT.box.bottomY + bh / 2, 0);

  return {
    jar: { geometry: jarGeo, position: jarPos },
    tray: { geometry: trayGeo, position: trayPos },
    lid: { geometry: lidGeo, position: lidPos },
    boxMeshes,
    boxPosition,
    lidRadius: FIT.lid.diameter / 2,
    lidHeight: lidH,
  };
}

let cachedParts: ProductParts | null | undefined;

export function buildProductFromGltf(scene: THREE.Group): ProductParts | null {
  if (cachedParts !== undefined) return cachedParts;

  scene.updateMatrixWorld(true);

  const named = fromNamed(scene);
  if (named) {
    cachedParts = assemble(named);
    return cachedParts;
  }

  const merged = bakeWorld(scene, true);
  if (!merged) {
    console.warn("[productParts] No usable indexed geometry in GLB.");
    cachedParts = null;
    return null;
  }
  const comps = splitComponents(merged, 200).map(measure);
  merged.dispose();

  const raw = classify(comps);
  if (!raw) {
    console.warn("[productParts] Geometry classification failed; using placeholders.");
    console.table(
      comps.map((c, i) => ({
        i,
        sx: +c.size.x.toFixed(3),
        sy: +c.size.y.toFixed(3),
        sz: +c.size.z.toFixed(3),
        roundness: +c.roundness.toFixed(3),
        aspect: +c.aspect.toFixed(3),
        hRatio: +c.hRatio.toFixed(3),
      })),
    );
    comps.forEach((c) => c.geo.dispose());
    cachedParts = null;
    return null;
  }

  const used = new Set([raw.lid, raw.candle, raw.tray, ...raw.boxes]);
  comps.forEach((c) => {
    if (!used.has(c)) c.geo.dispose();
  });
  cachedParts = assemble(raw);
  return cachedParts;
}
