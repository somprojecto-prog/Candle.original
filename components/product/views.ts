import type { ProductView } from "@/lib/constants";

export interface ViewConfig {
  box: boolean;
  lid: "seated" | "off";
  camera: {
    target: [number, number, number];
    dist: number;
    elev: number;
    azim: number;
    fov: number;
  };
  dragRange: number;
}

export const VIEWS: Record<ProductView, ViewConfig> = {
  hero: {
    box: false,
    lid: "seated",
    camera: { target: [0, -0.05, 0], dist: 6.4, elev: 14, azim: 30, fov: 28 },
    dragRange: 50,
  },
  statement: {
    box: false,
    lid: "seated",
    camera: { target: [0, -0.05, 0], dist: 6.2, elev: 16, azim: 12, fov: 28 },
    dragRange: 30,
  },
  intention: {
    box: false,
    lid: "off",
    camera: { target: [0, -0.35, 0], dist: 4.2, elev: 32, azim: -25, fov: 28 },
    dragRange: 25,
  },
  offer: {
    box: true,
    lid: "seated",
    camera: { target: [0, 0.0, 0], dist: 7.8, elev: 14, azim: 32, fov: 28 },
    dragRange: 35,
  },
};
