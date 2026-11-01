"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

/**
 * Contrato do POST ${NEXT_PUBLIC_ADMIN_URL}/api/orders
 * Resposta 201: { orderNumber, total, checkoutUrl? }
 * Se vier checkoutUrl, o cliente é enviado para a página de pagamento do Stripe.
 */
type PaymentMethod = "online" | "entrega";

type OrderPayload = {
  customerName: string;
  phone: string; // 10 dígitos (EUA)
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string; // 2 letras, ex. CA
    postalCode: string; // 12345 ou 12345-6789
    country: "USA";
  };
  quantity: number;
  notes?: string;
  paymentMethod: PaymentMethod;
};

const MAX_QUANTITY = 10;

const US_STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; hint: string }[] = [
  {
    value: "online",
    title: "Pagar online",
    hint: "Cartão, Apple Pay ou Google Pay, numa página segura do Stripe.",
  },
  {
    value: "entrega",
    title: "Pagar na entrega",
    hint: "Paga quando receber a encomenda.",
  },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  postalCode: string;
  quantity: string;
  notes: string;
  paymentMethod: string;
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
  state: "",
  postalCode: "",
  quantity: "1",
  notes: "",
  // Por defeito "entrega" enquanto o Stripe não foi testado. Para começar em
  // "Pagar online", troque por "online".
  paymentMethod: "entrega",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

/** Só dígitos; aceita +1 / 1 à frente e devolve os 10 dígitos. */
function usPhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function validate(f: FormState): Errors {
  const e: Errors = {};

  const name = f.name.trim();
  if (!name) e.name = "Indique o seu nome.";
  else if (name.length < 3) e.name = "O nome deve ter pelo menos 3 caracteres.";

  const phone = usPhoneDigits(f.phone);
  if (!f.phone.trim()) e.phone = "Indique o seu telefone.";
  else if (phone.length !== 10)
    e.phone = "Telefone inválido. Use 10 dígitos, por exemplo (555) 123-4567.";

  const email = f.email.trim();
  if (!email) e.email = "Indique o seu email.";
  else if (!EMAIL_RE.test(email)) e.email = "Email inválido. Exemplo: nome@exemplo.com";

  if (!f.street.trim()) e.street = "Indique a rua.";
  if (!f.number.trim()) e.number = "Indique o número.";
  if (!f.city.trim()) e.city = "Indique a cidade.";

  if (!f.state) e.state = "Selecione o estado.";
  else if (!US_STATES.some(([code]) => code === f.state))
    e.state = "Estado inválido.";

  const zip = f.postalCode.trim();
  if (!zip) e.postalCode = "Indique o ZIP code.";
  else if (!ZIP_RE.test(zip))
    e.postalCode = "ZIP inválido. Use 12345 ou 12345-6789.";

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
    phone: usPhoneDigits(f.phone),
    email: f.email.trim().toLowerCase(),
    address: {
      street: f.street.trim(),
      number: f.number.trim(),
      ...(complement ? { complement } : {}),
      city: f.city.trim(),
      state: f.state,
      postalCode: f.postalCode.trim(),
      country: "USA",
    },
    quantity: Number(f.quantity),
    ...(notes ? { notes } : {}),
    paymentMethod: f.paymentMethod === "online" ? "online" : "entrega",
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
  children: ReactNode;
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

function SuccessCard({
  kicker,
  title,
  orderNumber,
  children,
}: {
  kicker: string;
  title: string;
  orderNumber: string;
  children: ReactNode;
}) {
  return (
    <section
      role="status"
      className="rounded-2xl border border-gold-dim/50 bg-ink2 p-8 text-center sm:p-12"
    >
      <p className="font-body text-[0.65rem] uppercase tracking-[0.5em] text-gold-dim">
        {kicker}
      </p>
      <h2 className="mt-4 font-display text-3xl text-gold sm:text-4xl">{title}</h2>
      <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-gold-dim">
        Número da encomenda
      </p>
      <p className="mt-2 break-all font-display text-3xl text-gold">{orderNumber}</p>
      <p className="mt-6 font-body text-sm leading-relaxed text-gold/70">{children}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-gold px-10 py-4 font-body text-xs uppercase tracking-[0.4em] text-ink transition-all duration-300 hover:bg-[#D9BC7C] hover:shadow-[0_0_40px_rgba(201,169,98,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        Voltar ao início
      </Link>
    </section>
  );
}

// Enquanto estiver a true, mostra por baixo do erro o motivo técnico.
// Pôr false antes de vender a sério.
const DEBUG = true;

export default function OrderForm({
  paidOrder,
  cancelledOrder,
}: {
  paidOrder?: string;
  cancelledOrder?: string;
}) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Se o cliente voltar atrás a partir do Stripe, o botão não pode ficar preso.
  useEffect(() => {
    const onShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

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
    setDebugInfo(null);

    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    let redirecting = false;
    const adminUrl = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "").replace(/\/$/, "");
    const target = `${adminUrl}/api/orders`;
    try {
      const res = await fetch(target, {
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
        if (DEBUG) {
          setDebugInfo(
            `POST ${target || "(vazio)"} → ${res.status}` +
              (data && typeof data.error === "string" ? ` · ${data.error}` : ""),
          );
        }
        return;
      }

      const num = String(data?.orderNumber ?? data?.order?.orderNumber ?? "—");
      const checkoutUrl =
        data && typeof data.checkoutUrl === "string" ? data.checkoutUrl : null;

      if (checkoutUrl) {
        redirecting = true;
        window.location.assign(checkoutUrl);
        return;
      }

      if (form.paymentMethod === "online") {
        // Encomenda criada mas sem página de pagamento: não mostrar "sucesso".
        setServerError(
          `A encomenda ${num} foi registada, mas não foi possível abrir a página de pagamento. Contacte-nos para concluir o pagamento.`,
        );
        return;
      }

      setOrderNumber(num);
    } catch (e) {
      setServerError(
        "Não foi possível contactar o servidor de encomendas. Tente novamente dentro de instantes.",
      );
      if (DEBUG) {
        setDebugInfo(
          `POST ${target || "(vazio)"} → falhou antes de chegar (endereço errado ou CORS). ${
            e instanceof Error ? e.message : ""
          }`,
        );
      }
    } finally {
      if (!redirecting) setSubmitting(false);
    }
  }

  // Voltou do Stripe depois de pagar.
  if (paidOrder) {
    return (
      <SuccessCard kicker="Pagamento recebido" title="Obrigado." orderNumber={paidOrder}>
        Guarde este número. Entraremos em contacto por email para confirmar a
        entrega.
      </SuccessCard>
    );
  }

  // Encomenda criada com pagamento na entrega.
  if (orderNumber) {
    return (
      <SuccessCard
        kicker="Encomenda registada"
        title={`Obrigado, ${form.name.trim().split(" ")[0]}.`}
        orderNumber={orderNumber}
      >
        Guarde este número. Entraremos em contacto através do email{" "}
        {form.email.trim()} para confirmar a entrega. O pagamento é feito na
        entrega.
      </SuccessCard>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {cancelledOrder && (
        <p
          role="status"
          className="rounded-lg border border-gold-dim/60 px-4 py-3 font-body text-sm text-gold/90"
        >
          O pagamento da encomenda {cancelledOrder} não foi concluído. Pode
          preencher os dados e tentar de novo.
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl text-gold">Os seus dados</legend>
        <Field label="Nome completo" id="name" error={errors.name}>
          <input type="text" autoComplete="name" {...props("name")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefone" id="phone" error={errors.phone}>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(555) 123-4567"
              {...props("phone")}
            />
          </Field>
          <Field label="Email" id="email" error={errors.email}>
            <input type="email" autoComplete="email" {...props("email")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-2 font-display text-2xl text-gold">Morada de entrega</legend>
        <p className="font-body text-xs text-gold-dim">
          Entregamos apenas nos Estados Unidos (EUA).
        </p>
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
            placeholder="Apt, suite, andar…"
            autoComplete="address-line2"
            {...props("complement")}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Cidade" id="city" error={errors.city}>
            <input type="text" autoComplete="address-level2" {...props("city")} />
          </Field>
          <Field label="Estado" id="state" error={errors.state}>
            <select autoComplete="address-level1" {...props("state")}>
              <option value="">Selecione</option>
              {US_STATES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </Field>
          <Field label="ZIP code" id="postalCode" error={errors.postalCode}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="12345"
              {...props("postalCode")}
            />
          </Field>
        </div>
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

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl text-gold">Pagamento</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {PAYMENT_OPTIONS.map((o) => {
            const selected = form.paymentMethod === o.value;
            return (
              <label
                key={o.value}
                className={`cursor-pointer rounded-lg border px-4 py-4 transition-colors focus-within:ring-1 focus-within:ring-gold ${
                  selected
                    ? "border-gold bg-ink"
                    : "border-gold-dim/50 bg-ink2 hover:border-gold-dim"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={o.value}
                  checked={selected}
                  onChange={() => set("paymentMethod", o.value)}
                  className="sr-only"
                />
                <span className="block font-body text-sm text-gold">{o.title}</span>
                <span className="mt-1 block font-body text-xs text-gold/60">{o.hint}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/60 px-4 py-3 font-body text-sm text-red-400"
        >
          {serverError}
        </p>
      )}

      {DEBUG && debugInfo && (
        <p className="break-all rounded-lg border border-gold-dim/50 px-4 py-3 font-body text-xs text-gold/80">
          Diagnóstico: {debugInfo}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gold px-10 py-4 font-body text-xs uppercase tracking-[0.4em] text-ink transition-all duration-300 hover:bg-[#D9BC7C] hover:shadow-[0_0_40px_rgba(201,169,98,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting
          ? form.paymentMethod === "online"
            ? "A abrir o pagamento…"
            : "A enviar…"
          : form.paymentMethod === "online"
            ? "Continuar para o pagamento"
            : "Confirmar encomenda"}
      </button>
    </form>
  );
}
