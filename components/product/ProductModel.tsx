"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MODEL_PATH } from "@/lib/constants";
import type { ProductView } from "@/lib/constants";
import { GLB_DRACO } from "./config";
import { buildProductFromGltf } from "./productParts";
import { createProductMaterials } from "./materials";
import { VIEWS } from "./views";

interface ProductModelProps {
  view: ProductView;
}

export default function ProductModel({ view }: ProductModelProps) {
  const { scene } = useGLTF(MODEL_PATH, GLB_DRACO);
  const invalidate = useThree((s) => s.invalidate);
  const mats = useMemo(() => createProductMaterials(true), []);
  const cfg = VIEWS[view];

  const parts = useMemo(() => {
    try {
      return buildProductFromGltf(scene as THREE.Group);
    } catch (e) {
      console.error("[ProductModel] build failed", e);
      return null;
    }
  }, [scene]);

  useEffect(() => {
    invalidate();
    return () => mats.dispose();
  }, [mats, invalidate]);

  if (!parts) return null;

  return (
    <group>
      <mesh
        geometry={parts.jar.geometry}
        position={parts.jar.position}
        material={mats.jar}
      />
      <mesh
        geometry={parts.tray.geometry}
        position={parts.tray.position}
        material={mats.tray}
      />
      {cfg.lid === "seated" && (
        <mesh
          geometry={parts.lid.geometry}
          position={parts.lid.position}
          material={mats.lid}
        />
      )}
      {cfg.box && (
        <group position={parts.boxPosition}>
          {parts.boxMeshes.map((m, i) => (
            <mesh
              key={i}
              geometry={m.geometry}
              position={m.position}
              material={mats.box}
            />
          ))}
        </group>
      )}
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
