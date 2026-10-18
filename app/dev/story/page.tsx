import { notFound } from "next/navigation";
import StoryDev from "@/components/story-canvas/StoryDev";

type SearchParams = Record<string, string | string[] | undefined>;

const parsePhase = (v: string | string[] | undefined): number => {
  const s = Array.isArray(v) ? v[0] : v;
  if (s === undefined || s.trim() === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

export default async function DevStoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  return <StoryDev initialPhase={parsePhase(sp.phase)} />;
}
