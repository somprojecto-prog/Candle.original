# CTRL + SHIFT + CANDLE

Premium landing page for a deep work candle.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS 3.4 · React Three Fiber (product) · GSAP · Lenis

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Assets

- `public/models/candle.glb` — product model (optional for first deploy; posters are used)
- `public/brand/emblem.png` — circular gold logo (optional)
- `public/brand/mark.svg` — header icon

## Checkout URL

Edit `lib/constants.ts`:

```ts
export const CHECKOUT_URL = "https://your-checkout-url";
```

## Deploy

Import the repository on **Vercel**. Zero configuration needed.

## Structure

```
app/                  layout, page, globals, dev/product
components/
  layout/             Header, Footer
  providers/          SmoothScroll
  ui/                 Container, Section, Button
  motion/             Reveal
  sections/           Hero, ProductStatement, Intention, Notes, Offer, Closing
  product/            ProductViewerLazy + posters
lib/                  constants, content, scrollTo, cn
public/               models, brand
```
