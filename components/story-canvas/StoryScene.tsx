"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Invalidator from "./Invalidator";
import StoryCameraRig from "./StoryCameraRig";
import StoryPlaceholder from "./StoryPlaceholder";

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight color="#fff1d6" intensity={2.4} position={[4, 6, 5]} />
      <spotLight color="#C9A84C" position={[-5, 3, -4]} intensity={20} angle={0.5} penumbra={1} />
      <pointLight color="#ffffff" intensity={0.4} position={[0, 4, 2]} />
    </>
  );
}

function FirstFrame({ onReady }: { onReady: () => void }): null {
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

export default function StoryScene({ onReady }: { onReady: () => void }) {
  return (
    <>
      <StudioLights />
      <StoryCameraRig />
      <Invalidator />
      <StoryPlaceholder />
      <FirstFrame onReady={onReady} />
      <ContactShadows
        position={[0, -1.0, 0]}
        opacity={0.5}
        blur={2.6}
        scale={8}
        far={3}
        resolution={512}
        color="#000000"
      />
    </>
  );
}
