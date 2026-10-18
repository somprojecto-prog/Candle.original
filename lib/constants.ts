export const BRAND = "CTRL + SHIFT + CANDLE";
export const TAGLINE = "Focus. Reset. Elevate.";
export const COLORS = {
  ink: "#0A0A0A",
  ink2: "#111111",
  fg: "#F5F5F5",
  muted: "#A3A3A3",
  gold: "#C9A84C",
  line: "#2A2A2A",
} as const;

export const HEADER_H = 72;
export const SMOOTH_SCROLL = true;

export const SECTION_IDS = {
  top: "top",
  product: "product",
  about: "about",
  notes: "notes",
  offer: "offer",
  closing: "closing",
} as const;

export const NAV = [
  { label: "Product", href: "#product" },
  { label: "Notes", href: "#notes" },
  { label: "About", href: "#about" },
] as const;

export const SHOP_URL = "#offer";
export const CHECKOUT_URL = "#checkout";

export const MODEL_PATH = "/models/candle.glb";
export const EMBLEM_PATH = "/brand/emblem.png";
export const MARK_PATH = "/brand/mark.svg";

export type ProductView = "hero" | "statement" | "intention" | "offer";
