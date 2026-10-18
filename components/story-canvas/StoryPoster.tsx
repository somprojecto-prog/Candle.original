"use client";

import ProductPoster from "@/components/product/ProductPoster";
import { STORY_FOCUS } from "@/lib/story";

export default function StoryPoster({ hidden }: { hidden: boolean }) {
  const [fx, fy] = STORY_FOCUS[0];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 transition-opacity duration-300 motion-reduce:transition-none ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      style={{
        left: `${fx * 100}%`,
        top: `${fy * 100}%`,
        width: "36vw",
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
      }}
    >
      <ProductPoster view="hero" className="h-full w-full" />
    </div>
  );
}
