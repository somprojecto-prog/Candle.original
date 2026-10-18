"use client";

import { useId } from "react";
import type { ProductView } from "@/lib/constants";

interface ProductPosterProps {
  view: ProductView;
  className?: string;
}

const BG =
  "radial-gradient(60% 55% at 50% 52%, rgba(255,255,255,0.04), rgba(255,255,255,0) 70%)";
const EDGE = "#2A2A2A";
const GOLD = "#C9A84C";

function Tray() {
  return (
    <g strokeLinejoin="round">
      <polygon points="160,354 300,392 300,458 160,420" fill="#101010" stroke={EDGE} />
      <polygon points="300,392 440,354 440,420 300,458" fill="#0b0b0b" stroke={EDGE} />
      <polygon points="160,354 300,316 440,354 300,392" fill="#151515" stroke={EDGE} />
      <polygon
        points="178,354 300,321 422,354 300,387"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <ellipse cx="300" cy="354" rx="86" ry="21" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.8" />
    </g>
  );
}

function Jar({ jarId, open }: { jarId: string; open: boolean }) {
  return (
    <g>
      <path d="M223 216 V354 A77 18 0 0 0 377 354 V216 Z" fill={`url(#${jarId})`} stroke={EDGE} />
      <rect x="240" y="224" width="9" height="124" rx="4.5" fill="#fff" opacity="0.07" />
      <rect x="352" y="228" width="3" height="116" rx="1.5" fill="#fff" opacity="0.04" />
      <ellipse cx="300" cy="216" rx="77" ry="18" fill="#0e0e0e" stroke={EDGE} />
      {open && (
        <>
          <ellipse cx="300" cy="217" rx="68" ry="15" fill="#040404" />
          <ellipse
            cx="300"
            cy="216"
            rx="72"
            ry="16.5"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.4"
            strokeWidth="0.8"
          />
        </>
      )}
    </g>
  );
}

function Lid() {
  return (
    <g>
      <path d="M217 194 V216 A83 20 0 0 0 383 216 V194 Z" fill="#0f0f0f" stroke={EDGE} />
      <ellipse cx="300" cy="194" rx="83" ry="20" fill="#171717" stroke={EDGE} />
      <ellipse
        cx="300"
        cy="194"
        rx="62"
        ry="14.5"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <ellipse cx="300" cy="194" rx="6" ry="1.5" fill={GOLD} fillOpacity="0.4" />
    </g>
  );
}

function GiftBox({ faceId }: { faceId: string }) {
  return (
    <g strokeLinejoin="round">
      <Tray />
      <polygon points="180,176 300,210 300,390 180,356" fill={`url(#${faceId})`} stroke={EDGE} />
      <polygon points="300,210 420,176 420,356 300,390" fill="#0c0c0c" stroke={EDGE} />
      <polygon points="180,176 300,142 420,176 300,210" fill="#171717" stroke={EDGE} />
      <polygon
        points="192,176 300,146 408,176 300,206"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <line x1="180" y1="330" x2="300" y2="364" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" />
    </g>
  );
}

export default function ProductPoster({ view, className = "h-full w-full" }: ProductPosterProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const jar = `${uid}j`;
  const face = `${uid}f`;

  const stackTransform =
    view === "intention" ? "translate(300 300) scale(1.4) translate(-300 -330)" : undefined;

  return (
    <div aria-hidden="true" className={className} style={{ backgroundImage: BG }}>
      <svg
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        focusable="false"
      >
        <defs>
          <linearGradient id={jar} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#090909" />
            <stop offset="0.22" stopColor="#1b1b1b" />
            <stop offset="0.34" stopColor="#0f0f0f" />
            <stop offset="0.7" stopColor="#080808" />
            <stop offset="1" stopColor="#121212" />
          </linearGradient>
          <linearGradient id={face} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#161616" />
            <stop offset="1" stopColor="#0d0d0d" />
          </linearGradient>
        </defs>

        {view === "offer" ? (
          <GiftBox faceId={face} />
        ) : (
          <g transform={stackTransform}>
            <Tray />
            <Jar jarId={jar} open={view === "intention"} />
            {view !== "intention" && <Lid />}
          </g>
        )}
      </svg>
    </div>
  );
}
