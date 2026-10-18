"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/scrollTo";

interface ButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
}

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    if (id !== "top" && !document.getElementById(id)) return;
    e.preventDefault();
    scrollToHash(href);
    window.history.replaceState(null, "", href);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded text-btn uppercase transition duration-200 motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        size === "sm" ? "h-10 px-5" : "h-12 px-8",
        variant === "primary"
          ? "bg-gold text-ink hover:bg-gold-hi hover:-translate-y-px"
          : "border border-gold bg-transparent text-gold hover:bg-gold/10 hover:-translate-y-px",
        className,
      )}
    >
      {children}
    </a>
  );
}
