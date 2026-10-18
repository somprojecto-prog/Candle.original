import { HERO } from "@/lib/content";

export default function ScrollIndicator() {
  return (
    <div
      aria-hidden
      className="absolute bottom-8 left-0 right-0 hidden justify-center md:flex"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-caption uppercase text-muted">{HERO.scroll}</span>
        <span className="h-10 w-px bg-gold/60 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
