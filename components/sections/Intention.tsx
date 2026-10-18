import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import SpecList from "@/components/sections/SpecList";
import { SECTION_IDS } from "@/lib/constants";
import { INTENTION } from "@/lib/content";

export default function Intention() {
  return (
    <StorySection id={SECTION_IDS.about} step="intention" tone="raised">
      <div className="grid items-center gap-16 lg:grid-cols-12 story:gap-10">
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <Reveal as="h2" className="text-h2 font-display text-fg">
            {INTENTION.title}
          </Reveal>
          <div className="mt-8">
            <SpecList items={INTENTION.items} />
          </div>
        </div>
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <ProductSlot view="intention" className="aspect-[4/5] lg:aspect-auto lg:h-[640px]" />
          </Reveal>
        </div>
      </div>
    </StorySection>
  );
}
