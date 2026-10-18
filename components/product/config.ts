export const USE_GLB = true;
export const GLB_DRACO = false;

export const NAMED_NODES = {
  lid: /^lid$/i,
  boxBody: /^box[_ ]?body$/i,
  tray: /^tray$/i,
  candle: /^candle$/i,
} as const;

export const FIT = {
  jar: { height: 1.4, centerY: 0 },
  lid: { diameter: 1.38, bottomY: 0.705 },
  tray: { size: [2.2, 0.55, 2.3] as const, bottomY: -1.0 },
  box: { size: [2.26, 1.5, 2.36] as const, bottomY: -0.47 },
} as const;
