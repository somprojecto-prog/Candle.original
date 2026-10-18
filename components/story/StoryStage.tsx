"use client";

import dynamic from "next/dynamic";
import { useStoryMode } from "@/components/story/useStoryMode";

const StoryCanvas = dynamic(() => import("@/components/story-canvas/StoryCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function StoryStage() {
  if (useStoryMode() !== "on") return null;

  return (
    <div aria-hidden className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-svh">
      <StoryCanvas />
    </div>
  );
}
