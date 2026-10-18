import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "@/components/ui/Container";

interface SectionProps {
  id: string;
  tone?: "base" | "raised";
  divider?: boolean;
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Section({
  id,
  tone = "base",
  divider = true,
  bleed = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-[120px]",
        tone === "raised" ? "bg-ink2" : "bg-ink",
        divider && "border-t border-line",
        className,
      )}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
