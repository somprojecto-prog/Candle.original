import { notFound } from "next/navigation";
import ProductViewerLazy from "@/components/product/ProductViewerLazy";
import type { ProductView } from "@/lib/constants";

const VIEW_LIST: readonly ProductView[] = ["hero", "statement", "intention", "offer"];

export default function DevProductPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-ink text-fg">
      <p className="px-6 py-4 text-caption uppercase text-muted">
        Dev · product views preview
      </p>
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
        {VIEW_LIST.map((view) => (
          <div key={view} className="relative h-[600px] bg-[#0A0A0A]">
            <span className="absolute left-3 top-3 z-10 text-caption uppercase text-gold">
              {view}
            </span>
            <ProductViewerLazy view={view} priority interactive />
          </div>
        ))}
      </div>
    </main>
  );
}
