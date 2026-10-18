import { BRAND, MARK_PATH, NAV, TAGLINE } from "@/lib/constants";
import Container from "@/components/ui/Container";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label={`${BRAND} — back to top`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK_PATH} alt="" className="h-6 w-auto" />
            <span className="text-caption uppercase text-gold">{BRAND}</span>
          </a>
          <nav aria-label="Footer" className="flex gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.9375rem] text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[0.875rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {BRAND}. All rights reserved.
          </p>
          <p>{TAGLINE}</p>
        </div>
      </Container>
    </footer>
  );
}
