"use client";

import { useEffect, useRef, type MutableRefObject, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface DragRotateHandle {
  nudge: (deg: number) => void;
}

interface DragRotateProps {
  enabled: boolean;
  range: number;
  handleRef: MutableRefObject<DragRotateHandle | null>;
  children: ReactNode;
}

export default function DragRotate({ enabled, range, handleRef, children }: DragRotateProps) {
  const group = useRef<THREE.Group>(null);
  const rotY = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    handleRef.current = {
      nudge: (deg: number) => {
        rotY.current = THREE.MathUtils.clamp(rotY.current + (deg * Math.PI) / 180, (-range * Math.PI) / 180, (range * Math.PI) / 180);
        if (group.current) group.current.rotation.y = rotY.current;
        invalidate();
      },
    };
    return () => {
      handleRef.current = null;
    };
  }, [handleRef, range, invalidate]);

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      rotY.current = THREE.MathUtils.clamp(
        rotY.current + dx * 0.005,
        (-range * Math.PI) / 180,
        (range * Math.PI) / 180,
      );
      if (group.current) group.current.rotation.y = rotY.current;
      invalidate();
    };
    const onUp = (e: PointerEvent) => {
      dragging.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [enabled, range, gl, invalidate]);

  return <group ref={group}>{children}</group>;
}
