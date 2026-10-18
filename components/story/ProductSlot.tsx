"use client";

import type { ProductView } from "@/lib/constants";
import ProductViewerLazy from "@/components/product/ProductViewerLazy";
import { useStoryMode } from "@/components/story/useStoryMode";

interface ProductSlotProps {
  view: ProductView;
  className?: string;
  interactive?: boolean;
  priority?: boolean;
}

export default function ProductSlot({
  view,
  className,
  interactive,
  priority,
}: ProductSlotProps) {
  const mode = useStoryMode();

  if (mode === "on") return <div aria-hidden className={className} />;

  return (
    <ProductViewerLazy
      view={view}
      className={className}
      interactive={interactive}
      priority={priority}
    />
  );
}
