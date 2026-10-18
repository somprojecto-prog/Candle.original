import type Lenis from "lenis";
import { HEADER_H } from "@/lib/constants";

let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null): void {
  instance = l;
}

export function scrollToHash(hash: string, offset: number = -HEADER_H): void {
  if (typeof window === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hash === "#top") {
    if (instance) instance.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    return;
  }

  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = id ? document.getElementById(id) : null;
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}
