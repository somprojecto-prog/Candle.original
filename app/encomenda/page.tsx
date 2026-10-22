import type { Metadata } from "next";
import Link from "next/link";
import OrderForm from "./OrderForm";

const BRAND = "CTRL + SHIFT + CANDLE";

export const metadata: Metadata = {
  title: `Encomenda | ${BRAND}`,
  description: "Encomende a sua vela. Preencha os dados de entrega.",
};

export default function EncomendaPage() {
  return (
    <main className="min-h-screen bg-ink px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="font-body text-[0.65rem] uppercase tracking-[0.4em] text-gold-dim transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          ← Voltar
        </Link>

        <header className="mt-8 mb-10">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.5em] text-gold-dim">
            {BRAND}
          </p>
          <h1 className="mt-3 font-display text-4xl text-gold sm:text-5xl">
            Encomenda
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-gold/70">
            Preencha os dados abaixo e entraremos em contacto para confirmar a
            sua encomenda.
          </p>
        </header>

        <OrderForm />
      </div>
    </main>
  );
}
