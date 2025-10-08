// api/_utils.js

// Faz o parse do body independente de vir string ou objeto (Vercel varia)
export function parseBody(req) {
  try {
    if (req?.body == null) return {};
    if (typeof req.body === "string" && req.body.length) return JSON.parse(req.body);
    if (typeof req.body === "object") return req.body;
    return {};
  } catch (e) {
    console.error("Body parse error:", e);
    return {};
  }
}

// Resposta JSON padronizada (evita problemas de header)
export function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}
