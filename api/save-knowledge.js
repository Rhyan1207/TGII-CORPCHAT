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

    // 🔥 CORREÇÃO PRINCIPAL:
    // Se vier objeto, usa direto. Se vier string, faz parse.
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body || {});

    const { orgId, companyText, laborText, aiProvider, aiApiKey } = body;

    if (!orgId) {
      return res.status(400).json({ error: "Missing orgId" });
    }

    const payload = {
      orgId,
      companyText: companyText || "",
      laborText: laborText || "",
      aiProvider: aiProvider || "openai",
      aiApiKeyEncrypted: aiApiKey ? encrypt(aiApiKey) : null,
      updatedAt: new Date().toISOString(),
    };

    // MVP: apenas retorna eco
    return res.status(200).json({ ok: true, saved: payload });

  } catch (err) {
    console.error("Save-knowledge error:", err);
    return res.status(500).json({ error: "Save error", detail: String(err) });
  }
}
