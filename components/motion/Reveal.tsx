"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const show = () => {
        gsap.set(el, { opacity: 1, y: 0 });
      };

      try {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;

        if (rect.bottom < 0) {
          show();
          return;
        }

        const play = () =>
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay,
              ease: "power2.out",
            },
          );

        if (rect.top < vh * 0.88) {
          play();
          return;
        }

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: play,
          onEnterBack: show,
        });
      } catch {
        show();
      }
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
