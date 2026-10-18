import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import { SECTION_IDS } from "@/lib/constants";
import { STATEMENT, SUPPORTING_COPY } from "@/lib/content";

export default function ProductStatement() {
  return (
    <StorySection id={SECTION_IDS.product} step="reveal" tone="base">
      <div className="story:grid story:grid-cols-12 story:items-center story:gap-10">
        <div className="mx-auto max-w-[760px] text-center story:col-span-5 story:mx-0 story:max-w-none story:text-left">
          <Reveal as="h2" className="text-h2 font-display text-fg">
            {STATEMENT.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mx-auto mt-6 max-w-[56ch] text-body text-muted story:mx-0 story:max-w-[44ch]">
            {SUPPORTING_COPY.statementPositioning}
          </Reveal>
          <Reveal as="p" delay={0.2} className="mt-8 text-caption uppercase text-gold">
            {SUPPORTING_COPY.statementSupport}
          </Reveal>
        </div>
        <Reveal className="mt-16 story:col-span-6 story:col-start-7 story:mt-0">
          <ProductSlot view="statement" className="h-[460px] md:h-[600px]" />
        </Reveal>
      </div>
    </StorySection>
  );
}
