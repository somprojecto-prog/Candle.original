import StorySection from "@/components/story/StorySection";
import Reveal from "@/components/motion/Reveal";
import { SECTION_IDS } from "@/lib/constants";
import { NOTES, SUPPORTING_COPY } from "@/lib/content";

export default function Notes() {
  const last = NOTES.items.length - 1;

  return (
    <StorySection id={SECTION_IDS.notes} step="notes" tone="base">
      <div className="grid gap-12 lg:grid-cols-12 story:items-center story:gap-10">
        <div className="lg:col-span-5 story:lg:col-span-4">
          <Reveal as="h2" className="text-h2 font-display text-fg">
            {NOTES.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 text-body text-muted">
            {SUPPORTING_COPY.notesSupport}
          </Reveal>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7 story:lg:col-span-4 story:lg:col-start-9">
          {NOTES.items.map((note, i) => (
            <Reveal
              as="li"
              key={note}
              delay={i * 0.08}
              className={`flex items-baseline gap-6 border-t border-line py-6 story:py-[clamp(0.75rem,2.2vh,1.5rem)] ${
                i === last ? "border-b" : ""
              }`}
            >
              <span className="text-caption uppercase text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] leading-tight text-fg">
                {note}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </StorySection>
  );
}
