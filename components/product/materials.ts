import * as THREE from "three";
import { COLORS } from "@/lib/constants";

export interface ProductMaterials {
  box: THREE.MeshStandardMaterial;
  tray: THREE.MeshStandardMaterial;
  jar: THREE.MeshPhysicalMaterial;
  lid: THREE.MeshPhysicalMaterial;
  gold: THREE.MeshStandardMaterial;
  dispose: () => void;
}

export function createProductMaterials(doubleSide: boolean): ProductMaterials {
  const side = doubleSide ? THREE.DoubleSide : THREE.FrontSide;

  const box = new THREE.MeshStandardMaterial({
    color: "#141414",
    roughness: 0.8,
    metalness: 0,
    side,
  });
  const tray = new THREE.MeshStandardMaterial({
    color: "#101010",
    roughness: 0.9,
    metalness: 0,
    side,
  });
  const jar = new THREE.MeshPhysicalMaterial({
    color: "#050505",
    roughness: 0.14,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    side,
  });
  const lid = new THREE.MeshPhysicalMaterial({
    color: "#0C0C0C",
    roughness: 0.4,
    metalness: 0.2,
    side,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    roughness: 0.35,
    metalness: 0.8,
  });

  return {
    box,
    tray,
    jar,
    lid,
    gold,
    dispose: () => {
      box.dispose();
      tray.dispose();
      jar.dispose();
      lid.dispose();
      gold.dispose();
    },
  };
}
