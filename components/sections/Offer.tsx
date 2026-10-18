import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import SpecList from "@/components/sections/SpecList";
import { CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { OFFER } from "@/lib/content";

export default function Offer() {
  return (
    <StorySection id={SECTION_IDS.offer} step="offer" tone="raised">
      <div className="grid items-center gap-12 lg:grid-cols-12 story:gap-10">
        <div className="lg:col-span-6 story:lg:order-2 story:lg:col-start-7">
          <Reveal>
            <div className="rounded border border-line bg-ink story:border-transparent story:bg-transparent">
              <ProductSlot view="offer" className="h-[420px] lg:h-[600px]" />
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 story:lg:order-1 story:lg:col-start-1">
          <Reveal as="h2" className="text-h2 font-display text-fg">
            {OFFER.title}
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-6 font-display text-[clamp(2.5rem,1.6rem+3vw,4rem)] leading-none text-fg story:mt-[clamp(1rem,2.5vh,1.5rem)]"
          >
            <span className="sr-only">{OFFER.priceLabel}</span>
            {OFFER.price}
          </Reveal>
          <div className="mt-10 story:mt-[clamp(1.25rem,3vh,2.5rem)]">
            <SpecList items={OFFER.info} />
          </div>
          <Reveal delay={0.2} className="mt-10 story:mt-[clamp(1.25rem,3vh,2.5rem)]">
            <Button href={CHECKOUT_URL} className="w-full sm:w-auto">
              {OFFER.cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </StorySection>
  );
}
