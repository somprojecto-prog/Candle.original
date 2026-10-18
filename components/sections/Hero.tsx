import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import ScrollIndicator from "@/components/sections/ScrollIndicator";
import { SECTION_IDS, SHOP_URL } from "@/lib/constants";
import { HERO, SUPPORTING_COPY } from "@/lib/content";

export default function Hero() {
  return (
    <StorySection id={SECTION_IDS.top} step="hero" tone="base" divider={false} flush fill>
      <div className="grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 md:py-0 lg:grid-cols-12 story:min-h-0">
        <div className="lg:col-span-6 story:lg:col-span-5">
          <Reveal as="h1" className="text-h1 font-display text-fg">
            {HERO.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-[34ch] text-body text-muted">
            {SUPPORTING_COPY.heroSubtitle}
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <Button href={SHOP_URL}>{HERO.cta}</Button>
          </Reveal>
        </div>
        <div className="lg:col-span-6 story:lg:col-span-6 story:lg:col-start-7">
          <Reveal delay={0.15}>
            <ProductSlot view="hero" priority interactive className="h-[420px] sm:h-[520px] lg:h-[min(680px,70vh)]" />
          </Reveal>
        </div>
      </div>
      <ScrollIndicator />
    </StorySection>
  );
}
