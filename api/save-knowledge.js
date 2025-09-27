// api/save-knowledge.js

import crypto from "crypto";

const ENC_SECRET = process.env.ENC_SECRET || "change-this-in-production-32bytes!!!!";

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash("sha256").update(ENC_SECRET).digest();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orgId, companyText, laborText, aiProvider, aiApiKey } = JSON.parse(req.body || "{}");

    if (!orgId) return res.status(400).json({ error: "Missing orgId" });

    const payload = {
      orgId,
      companyText: companyText || "",
      laborText: laborText || "",
      aiProvider: aiProvider || "openai",
      aiApiKeyEncrypted: aiApiKey ? encrypt(aiApiKey) : null,
      updatedAt: new Date().toISOString(),
    };

    // MVP: apenas retorna eco. (TODO: salvar no Supabase)
    // Exemplo de como seria:
    // await supabase.from("org_knowledge").upsert({ org_id: orgId, company_text: companyText, labor_text: laborText })
    // await supabase.from("org_settings").upsert({ org_id: orgId, ai_provider: aiProvider, ai_api_key_encrypted: encrypt(aiApiKey) })

    return res.status(200).json({ ok: true, saved: payload });
  } catch (err) {
    return res.status(500).json({ error: "Save error", detail: String(err) });
  }
}

