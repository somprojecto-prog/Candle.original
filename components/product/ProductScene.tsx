"use client";

import React, {
  Component,
  Suspense,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { ProductView } from "@/lib/constants";
import { USE_GLB } from "./config";
import { VIEWS } from "./views";
import DragRotate, { type DragRotateHandle } from "./DragRotate";
import ProductModel from "./ProductModel";
import ProductPlaceholder from "./ProductPlaceholder";

interface ProductSceneProps {
  view: ProductView;
  interactive: boolean;
  dragRef: MutableRefObject<DragRotateHandle | null>;
  onReady: () => void;
  debugCamera?: Partial<{
    azim: number;
    elev: number;
    dist: number;
    fov: number;
    targetY: number;
  }>;
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight color="#fff1d6" intensity={2.2} position={[4, 6, 5]} />
      <spotLight
        color="#C9A84C"
        position={[-5, 3, -4]}
        intensity={25}
        angle={0.5}
        penumbra={1}
      />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#ffffff"
          position={[-6, 1, 4]}
          rotation-y={2.159}
          scale={[1, 9, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#ffffff"
          position={[6, 1, 4]}
          rotation-y={-2.159}
          scale={[1, 9, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#fff1d6"
          position={[0, 7, 0]}
          rotation-x={Math.PI / 2}
          scale={[10, 6, 1]}
        />
      </Environment>
    </>
  );
}

function CameraSetup({
  view,
  debug,
}: {
  view: ProductView;
  debug?: ProductSceneProps["debugCamera"];
}) {
  const { camera, size, invalidate } = useThree();
  const cfg = VIEWS[view];
  const azim = debug?.azim ?? cfg.camera.azim;
  const elev = debug?.elev ?? cfg.camera.elev;
  const dist = debug?.dist ?? cfg.camera.dist;
  const fov = debug?.fov ?? cfg.camera.fov;
  const ty = debug?.targetY ?? cfg.camera.target[1];
  const tx = cfg.camera.target[0];
  const tz = cfg.camera.target[2];

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const d = dist * THREE.MathUtils.clamp(1.78 / aspect, 1, 1.6);
    const elevR = (elev * Math.PI) / 180;
    const azimR = (azim * Math.PI) / 180;

    cam.position.set(
      tx + d * Math.cos(elevR) * Math.sin(azimR),
      ty + d * Math.sin(elevR),
      tz + d * Math.cos(elevR) * Math.cos(azimR),
    );
    cam.fov = fov;
    cam.near = 0.1;
    cam.far = 60;
    cam.updateProjectionMatrix();
    cam.lookAt(tx, ty, tz);
    cam.updateMatrixWorld();
    invalidate();
  }, [camera, invalidate, size.width, size.height, azim, elev, dist, fov, tx, ty, tz]);

  return null;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });

  return null;
}

class GlbBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("[GlbBoundary]", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function ProductScene({
  view,
  interactive,
  dragRef,
  onReady,
  debugCamera,
}: ProductSceneProps) {
  const cfg = VIEWS[view];

  const placeholder = (
    <>
      <ProductPlaceholder view={view} />
      <FirstFrame onReady={onReady} />
    </>
  );

  return (
    <>
      <StudioLights />
      <CameraSetup view={view} debug={debugCamera} />

      <DragRotate enabled={interactive} range={cfg.dragRange} handleRef={dragRef}>
        {USE_GLB ? (
          <GlbBoundary fallback={placeholder}>
            <Suspense fallback={null}>
              <ProductModel view={view} />
              <FirstFrame onReady={onReady} />
            </Suspense>
          </GlbBoundary>
        ) : (
          placeholder
        )}
      </DragRotate>

      <ContactShadows
        position={[0, -1.0, 0]}
        opacity={0.55}
        blur={2.6}
        scale={8}
        far={3}
        resolution={512}
        color="#000000"
      />
    </>
  );
}
