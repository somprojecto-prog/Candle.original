import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { CLOSING, SUPPORTING_COPY } from "@/lib/content";

export default function Closing() {
  return (
    <Section id={SECTION_IDS.closing} tone="base">
      <div className="text-center">
        <Reveal
          as="h2"
          className="mx-auto max-w-[18ch] text-h1 font-display text-fg"
        >
          {CLOSING.title}
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mx-auto mt-6 max-w-[48ch] text-body text-muted"
        >
          {SUPPORTING_COPY.closingSupport}
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <Button href={CHECKOUT_URL}>{CLOSING.cta}</Button>
        </Reveal>
      </div>
    </Section>
  );
}
