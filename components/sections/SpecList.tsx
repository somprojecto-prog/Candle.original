import Reveal from "@/components/motion/Reveal";

interface SpecListProps {
  items: readonly string[];
}

export default function SpecList({ items }: SpecListProps) {
  return (
    <ul className="border-t border-line">
      {items.map((item, i) => (
        <Reveal
          as="li"
          key={item}
          delay={i * 0.08}
          className="flex items-center gap-4 border-b border-line py-4 text-body text-fg"
        >
          <span aria-hidden className="h-px w-3 shrink-0 bg-gold" />
          {item}
        </Reveal>
      ))}
    </ul>
  );
}
