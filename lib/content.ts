export const HERO = {
  title: "Deep Work.",
  cta: "Shop Deep Work",
  scroll: "Scroll",
} as const;

export const STATEMENT = {
  title: "Designed for Deep Focus",
} as const;

export const INTENTION = {
  title: "Created with Intention",
  items: [
    "Hand-poured soy wax blend",
    "Crackling wood wick",
    "Clean-burning",
    "Non-toxic",
  ],
} as const satisfies { title: string; items: readonly string[] };

export const NOTES = {
  title: "Deep Work Notes",
  items: ["Bergamot", "Cedarwood", "Sandalwood", "Amber", "Black Pepper"],
} as const satisfies { title: string; items: readonly string[] };

export const OFFER = {
  title: "Deep Work Candle",
  price: "$49.99",
  priceLabel: "Price: ",
  info: ["16 oz", "Soy wax blend", "Wood wick", "80+ hours burn time"],
  cta: "Shop Deep Work",
} as const satisfies {
  title: string;
  price: string;
  priceLabel: string;
  info: readonly string[];
  cta: string;
};

export const CLOSING = {
  title: "Built for Focus. Made for More.",
  cta: "Shop Deep Work",
} as const;

export const SUPPORTING_COPY = {
  heroSubtitle: "A focused candle for concentration, creativity, and flow.",
  statementPositioning:
    "Curated to create the ideal atmosphere for concentration, creativity, and flow.",
  statementSupport: "Light it. Lock in. Get to work.",
  notesSupport: "A focused, grounding blend engineered for long sessions.",
  closingSupport: "More than a candle — a signal to shift into deep work.",
} as const;
