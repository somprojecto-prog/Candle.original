"use client";

import type { MouseEvent } from "react";
import { BRAND, MARK_PATH, NAV, SHOP_URL } from "@/lib/constants";
import { scrollToHash } from "@/lib/scrollTo";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Header() {
  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href !== "#top" && !document.getElementById(href.slice(1))) return;
    e.preventDefault();
    scrollToHash(href);
    window.history.replaceState(null, "", href);
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-line bg-ink/85 backdrop-blur">
      <Container className="flex h-full items-center justify-between">
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          className="flex items-center gap-3"
          aria-label={`${BRAND} — back to top`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_PATH} alt="" className="h-6 w-auto" />
          <span className="text-caption uppercase text-gold">{BRAND}</span>
        </a>

        <div className="flex items-center gap-10">
          <nav aria-label="Primary" className="hidden gap-10 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="text-[0.9375rem] text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button href={SHOP_URL} size="sm">
            Shop
          </Button>
        </div>
      </Container>
    </header>
  );
}
