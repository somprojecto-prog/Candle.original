"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

/**
 * Contrato assumido para o corpo do POST /api/orders (Order sem id, status,
 * total e datas). Quando lib/orders/types.ts existir, trocar por:
 *   import type { Order } from "@/lib/orders/types";
 *   type OrderPayload = Omit<Order, "id" | "status" | "total" | "createdAt" | "updatedAt">;
 * e ajustar os nomes dos campos em buildPayload() se forem diferentes.
 */
type OrderPayload = {
  customerName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  quantity: number;
  notes?: string;
};

const MAX_QUANTITY = 10;
const COUNTRIES = ["Portugal", "Angola"] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  postalCode: string;
  country: string;
  quantity: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  street: "",
  number: "",
  complement: "",
  city: "",
  postalCode: "",
  country: "Portugal",
  quantity: "1",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: FormState): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (!name) e.name = "Indique o seu nome.";
  else if (name.length < 3) e.name = "O nome deve ter pelo menos 3 caracteres.";

  const phone = f.phone.replace(/[\s.-]/g, "");
  if (!phone) e.phone = "Indique o seu telefone.";
  else if (f.country === "Portugal" && !/^(\+351|00351)?[29]\d{8}$/.test(phone))
    e.phone = "Telefone inválido. Use 9 dígitos, por exemplo 912 345 678.";
  else if (f.country === "Angola" && !/^(\+244|00244)?9\d{8}$/.test(phone))
    e.phone = "Telefone inválido. Use 9 dígitos, por exemplo 923 456 789.";

  const email = f.email.trim();
  if (!email) e.email = "Indique o seu email.";
  else if (!EMAIL_RE.test(email))
    e.email = "Email inválido. Exemplo: nome@exemplo.pt";

  if (!f.street.trim()) e.street = "Indique a rua.";
  if (!f.number.trim()) e.number = "Indique o número.";
  if (!f.city.trim()) e.city = "Indique a cidade.";

  const cp = f.postalCode.trim();
  if (f.country === "Portugal") {
    if (!cp) e.postalCode = "Indique o código postal.";
    else if (!/^\d{4}-\d{3}$/.test(cp))
      e.postalCode = "Código postal inválido. Formato: 0000-000.";
  } else if (cp && cp.length > 12) {
    e.postalCode = "Código postal demasiado longo.";
  }

  if (!COUNTRIES.includes(f.country as (typeof COUNTRIES)[number]))
    e.country = "Selecione um país.";

  const q = Number(f.quantity);
  if (!f.quantity.trim()) e.quantity = "Indique a quantidade.";
  else if (!Number.isInteger(q) || q < 1)
    e.quantity = "A quantidade deve ser um número inteiro, no mínimo 1.";
  else if (q > MAX_QUANTITY)
    e.quantity = `A quantidade máxima por encomenda é ${MAX_QUANTITY}.`;

  if (f.notes.length > 500)
    e.notes = "As notas não podem ter mais de 500 caracteres.";

  return e;
}

function buildPayload(f: FormState): OrderPayload {
  const complement = f.complement.trim();
  const notes = f.notes.trim();
  return {
    customerName: f.name.trim(),
    phone: f.phone.replace(/[\s.-]/g, ""),
    email: f.email.trim().toLowerCase(),
    address: {
      street: f.street.trim(),
      number: f.number.trim(),
      ...(complement ? { complement } : {}),
      city: f.city.trim(),
      postalCode: f.postalCode.trim(),
      country: f.country,
    },
    quantity: Number(f.quantity),
    ...(notes ? { notes } : {}),
  };
}

const inputCls =
  "w-full rounded-lg border border-gold-dim/50 bg-ink2 px-4 py-3 font-body text-sm text-gold placeholder:text-gold-dim/70 transition-colors focus:border-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold aria-[invalid=true]:border-red-400";

function Field({
  label,
  id,
  error,
  optional,
  className = "",
  children,
}: {
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-body text-[0.65rem] uppercase tracking-[0.3em] text-gold-dim"
      >
        {label}
        {optional && <span className="normal-case tracking-normal"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-2 font-body text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function OrderForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function props(key: keyof FormState) {
    return {
      id: key,
      name: key,
      value: form[key],
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `${key}-erro` : undefined,
      className: inputCls,
      onChange: (
        ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
      ) => set(key, ev.target.value),
    } as const;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting) return;
    setServerError(null);

    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL ?? ""}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setServerError(
          (data && typeof data.error === "string" && data.error) ||
            "Não foi possível registar a encomenda. Tente novamente dentro de instantes.",
        );
        return;
      }

      const num =
        data?.orderNumber ?? data?.order?.orderNumber;
      setOrderNumber(num != null ? String(num) : "—");
    } catch {
      setServerError(
        "Sem ligação ao servidor. Verifique a sua internet e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <section
        role="status"
        className="rounded-2xl border border-gold-dim/50 bg-ink2 p-8 text-center sm:p-12"
      >
        <p className="font-body text-[0.65rem] uppercase tracking-[0.5em] text-gold-dim">
          Encomenda registada
        </p>
        <h2 className="mt-4 font-display text-3xl text-gold sm:text-4xl">
          Obrigado, {form.name.trim().split(" ")[0]}.
        </h2>
        <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-gold-dim">
          Número da encomenda
        </p>
        <p className="mt-2 break-all font-display text-3xl text-gold">{orderNumber}</p>
        <p className="mt-6 font-body text-sm leading-relaxed text-gold/70">
          Guarde este número. Entraremos em contacto através do email{" "}
          {form.email.trim()} para confirmar a entrega.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-10 py-4 font-body text-xs uppercase tracking-[0.4em] text-ink transition-all duration-300 hover:bg-[#D9BC7C] hover:shadow-[0_0_40px_rgba(201,169,98,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          Voltar ao início
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl text-gold">Os seus dados</legend>
        <Field label="Nome completo" id="name" error={errors.name}>
          <input type="text" autoComplete="name" {...props("name")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefone" id="phone" error={errors.phone}>
            <input type="tel" autoComplete="tel" inputMode="tel" {...props("phone")} />
          </Field>
          <Field label="Email" id="email" error={errors.email}>
            <input type="email" autoComplete="email" {...props("email")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl text-gold">Morada de entrega</legend>
        <div className="grid grid-cols-3 gap-5">
          <Field label="Rua" id="street" error={errors.street} className="col-span-2">
            <input type="text" autoComplete="address-line1" {...props("street")} />
          </Field>
          <Field label="Número" id="number" error={errors.number}>
            <input type="text" autoComplete="off" {...props("number")} />
          </Field>
        </div>
        <Field label="Complemento" id="complement" optional error={errors.complement}>
          <input
            type="text"
            placeholder="Andar, porta, bloco…"
            autoComplete="address-line2"
            {...props("complement")}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cidade" id="city" error={errors.city}>
            <input type="text" autoComplete="address-level2" {...props("city")} />
          </Field>
          <Field
            label="Código postal"
            id="postalCode"
            error={errors.postalCode}
            optional={form.country !== "Portugal"}
          >
            <input
              type="text"
              autoComplete="postal-code"
              placeholder={form.country === "Portugal" ? "0000-000" : ""}
              {...props("postalCode")}
            />
          </Field>
        </div>
        <Field label="País" id="country" error={errors.country}>
          <select autoComplete="country-name" {...props("country")}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl text-gold">Encomenda</legend>
        <Field label="Quantidade" id="quantity" error={errors.quantity} className="max-w-[10rem]">
          <input type="number" inputMode="numeric" min={1} max={MAX_QUANTITY} {...props("quantity")} />
        </Field>
        <Field label="Notas" id="notes" optional error={errors.notes}>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Instruções de entrega, presente, etc."
            {...props("notes")}
          />
        </Field>
      </fieldset>

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/60 px-4 py-3 font-body text-sm text-red-400"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold px-10 py-4 font-body text-xs uppercase tracking-[0.4em] text-ink transition-all duration-300 hover:bg-[#D9BC7C] hover:shadow-[0_0_40px_rgba(201,169,98,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "A enviar…" : "Confirmar encomenda"}
      </button>
    </form>
  );
}
