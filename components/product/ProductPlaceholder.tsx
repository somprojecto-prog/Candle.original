"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import type { ProductView } from "@/lib/constants";
import { FIT } from "./config";
import { createProductMaterials } from "./materials";
import { VIEWS } from "./views";

interface ProductPlaceholderProps {
  view: ProductView;
}

export default function ProductPlaceholder({ view }: ProductPlaceholderProps) {
  const mats = useMemo(() => createProductMaterials(false), []);
  const cfg = VIEWS[view];
  const [tw, th, td] = FIT.tray.size;
  const [bw, bh, bd] = FIT.box.size;
  const jarR = FIT.lid.diameter / 2 - 0.05;
  const lidR = FIT.lid.diameter / 2;
  const lidH = 0.18;

  return (
    <group>
      {/* Tray */}
      <RoundedBox
        args={[tw, th, td]}
        radius={0.04}
        smoothness={4}
        position={[0, FIT.tray.bottomY + th / 2, 0]}
        material={mats.tray}
      />

      {/* Jar */}
      <mesh position={[0, FIT.jar.centerY, 0]} material={mats.jar}>
        <cylinderGeometry args={[jarR, jarR, FIT.jar.height, 48]} />
      </mesh>

      {/* Lid */}
      {cfg.lid === "seated" && (
        <mesh position={[0, FIT.lid.bottomY + lidH / 2, 0]} material={mats.lid}>
          <cylinderGeometry args={[lidR, lidR, lidH, 48]} />
        </mesh>
      )}

      {/* Box */}
      {cfg.box && (
        <mesh position={[0, FIT.box.bottomY + bh / 2, 0]} material={mats.box}>
          <boxGeometry args={[bw, bh, bd]} />
        </mesh>
      )}
    </group>
  );
}
