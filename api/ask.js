// api/ask.js
import { parseBody, json } from "./_utils.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function callOpenAI(messages) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.2,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`OpenAI error: ${resp.status} - ${text}`);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content || "Sem resposta do modelo.";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔥 AQUI É A CORREÇÃO: usar parseBody em vez de JSON.parse(req.body)
    const body = await parseBody(req);

    const {
      orgId,
      question,
      // Para MVP sem DB: o front pode enviar os textos.
      // Quando conectar ao DB, buscaremos por orgId direto no backend.
      companyText = "",
      laborText = "",
    } = body || {};

    if (!orgId) return res.status(400).json({ error: "Missing orgId" });
    if (!question) return res.status(400).json({ error: "Missing question" });

    const system = [
      "Você é um assistente de rh corporativo.",
      ".Responda APENAS com base nos conteúdos fornecidos a seguir.",
      "Se a informação não estiver nos textos e nos dados fornecidos pela empresa, aja de forma natural: explique que não há um registro interno específico sobre isso, mas continue ajudando usando conhecimento geral confiável. Quando necessário, use informações universais ou de domínio público (incluindo leis, boas práticas e conteúdos encontrados na web), deixando claro que são referências externas e que o usuário deve confirmar com o RH caso existam regras próprias. Se perceber que o funcionário está confuso, inseguro ou precisando de apoio, responda de maneira acolhedora e proativa, oferecendo ajuda adicional..",
      "Seja direto, educado e objetivo. Use linguagem natural para funcionários.",
    ].join(" ");

    const context = [
      "=== BASE DA EMPRESA ===",
      companyText || "(vazio)",
      "",
      "=== RH / LEIS TRABALHISTAS ===",
      laborText || "(vazio)",
    ].join("\n");

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Contexto:\n${context}\n\nPergunta do funcionário: ${question}`,
      },
    ];

    // Fallback sem chave
    if (!OPENAI_API_KEY) {
      let fallback = "Não encontrei referência a isso na base fornecida.";
      const all = `${companyText}\n${laborText}`.toLowerCase();
      const qLower = question.toLowerCase();

      if (all.includes("horário") || qLower.includes("horário")) {
        fallback =
          "Horários não definidos no MVP. Solicite ao RH ou verifique a Base da Empresa atualizada.";
      } else if (all.includes("pis") || qLower.includes("pis")) {
        fallback =
          "Consulte seu PIS no app oficial ou com o RH. (MVP sem integração).";
      }

      return res
        .status(200)
        .json({ ok: true, answer: fallback, provider: "fallback" });
    }

    const answer = await callOpenAI(messages);
    return res.status(200).json({ ok: true, answer, provider: "openai" });
  } catch (err) {
    console.error("Ask error:", err);
    return res.status(500).json({ error: "Ask error", detail: String(err) });
  }
}
