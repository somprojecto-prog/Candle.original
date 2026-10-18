import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { STORY_SECTION_VH, type StoryStep } from "@/lib/story";
import Container from "@/components/ui/Container";

interface StorySectionProps {
  id: string;
  step: StoryStep;
  tone?: "base" | "raised";
  divider?: boolean;
  flush?: boolean;
  fill?: boolean;
  className?: string;
  children: ReactNode;
}

export default function StorySection({
  id,
  step,
  tone = "base",
  divider = true,
  flush = false,
  fill = false,
  className,
  children,
}: StorySectionProps) {
  const style = { "--story-min": `${STORY_SECTION_VH[step]}svh` } as CSSProperties;

  return (
    <section
      id={id}
      data-story-step={step}
      style={style}
      className={cn(
        "relative z-10",
        tone === "raised" ? "bg-ink2" : "bg-ink",
        divider && "border-t border-line story:border-transparent",
        !flush && "py-20 md:py-[120px] story:py-0",
        "story:bg-transparent story:min-h-[var(--story-min)]",
        className,
      )}
    >
      <div
        className={cn(
          fill && "flex min-h-[calc(100svh-72px)] items-center",
          "story:sticky story:top-[72px] story:flex story:h-[calc(100svh-72px)] story:min-h-0 story:items-center",
        )}
      >
        <Container className="story:w-full">{children}</Container>
      </div>
    </section>
  );
}
