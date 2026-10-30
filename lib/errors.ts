/** Traduz erros do servidor numa mensagem útil (sem expor detalhes sensíveis). */
export function describeServerError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const code = (e as { code?: string } | null)?.code ?? "";

  if (msg.includes("AUTH_SECRET")) {
    return "Falta a variável AUTH_SECRET na Vercel (mínimo 32 caracteres). Acrescente-a e faça Redeploy.";
  }
  if (e instanceof Error && e.name === "PrismaClientValidationError") {
    return "Valor inválido ao gravar. Confirme ORDER_UNIT_PRICE na Vercel (ex.: 49.99, com ponto e sem símbolo).";
  }
  if (code === "P2022") {
    return "A tabela Order no Supabase tem colunas diferentes. Apague-a (Table Editor) e volte a correr o supabase.sql.";
  }
  if (code === "P2021" || code === "P2010" || /does not exist/i.test(msg)) {
    return "As tabelas ainda não existem. Execute o código supabase.sql no SQL Editor do Supabase.";
  }
  if (/Environment variable not found|DATABASE_URL|DIRECT_URL/i.test(msg)) {
    return "Falta DATABASE_URL ou DIRECT_URL na Vercel. Acrescente-as e faça Redeploy.";
  }
  if (
    /^P1/.test(code) ||
    /Can't reach database|Authentication failed|Tenant or user not found|password authentication/i.test(msg)
  ) {
    return "Não foi possível ligar à base de dados. Verifique a palavra-passe e o endereço em DATABASE_URL e DIRECT_URL.";
  }
  if (/^P\d{4}$/.test(code)) {
    return `Erro na base de dados (código ${code}). Veja os Logs da Vercel (procure ERRO_PAINEL).`;
  }
  return "Erro no servidor. Veja os Logs da Vercel (procure ERRO_PAINEL).";
}
