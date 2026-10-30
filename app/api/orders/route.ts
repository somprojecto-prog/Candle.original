import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { describeServerError } from "@/lib/errors";
import { clientIp, limited } from "@/lib/rate-limit";
import { createOrder } from "@/lib/orders/repository";
import { createOrderSchema, firstError } from "@/lib/orders/validation";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** Público: a loja envia aqui as encomendas dos clientes. */
export async function POST(req: Request) {
  const headers = corsHeaders(req);

  if (limited(`order:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tente novamente dentro de alguns minutos." },
      { status: 429, headers },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400, headers });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400, headers });
  }

  try {
    const order = await createOrder(parsed.data);
    // Só devolve o necessário ao cliente.
    return NextResponse.json(
      { orderNumber: order.orderNumber, total: order.total },
      { status: 201, headers },
    );
  } catch (e) {
    console.error("ERRO_PAINEL (encomenda):", e);
    return NextResponse.json({ error: describeServerError(e) }, { status: 500, headers });
  }
}
