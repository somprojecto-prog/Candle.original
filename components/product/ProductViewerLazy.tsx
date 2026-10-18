"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { ProductView } from "@/lib/constants";
import ProductPoster from "./ProductPoster";
import type { ProductViewerProps } from "./ProductViewer";

export type { ProductViewerProps } from "./ProductViewer";

const loading = (view: ProductView) =>
  function PosterLoading() {
    return (
      <div className="relative h-full w-full">
        <ProductPoster view={view} className="absolute inset-0" />
      </div>
    );
  };

const Hero = dynamic<ProductViewerProps>(() => import("./ProductViewer"), {
  ssr: false,
  loading: loading("hero"),
});
const Statement = dynamic<ProductViewerProps>(() => import("./ProductViewer"), {
  ssr: false,
  loading: loading("statement"),
});
const Intention = dynamic<ProductViewerProps>(() => import("./ProductViewer"), {
  ssr: false,
  loading: loading("intention"),
});
const Offer = dynamic<ProductViewerProps>(() => import("./ProductViewer"), {
  ssr: false,
  loading: loading("offer"),
});

const VIEWERS: Record<ProductView, ComponentType<ProductViewerProps>> = {
  hero: Hero,
  statement: Statement,
  intention: Intention,
  offer: Offer,
};

export default function ProductViewerLazy(props: ProductViewerProps) {
  const Viewer = VIEWERS[props.view];
  return <Viewer {...props} />;
}
