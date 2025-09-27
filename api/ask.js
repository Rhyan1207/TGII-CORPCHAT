// api/login.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { role, email, password } = JSON.parse(req.body || "{}");

    if (!role || !email || !password) {
      return res.status(400).json({ error: "Missing fields: role, email, password" });
    }

    // MOCK de credenciais (MVP). Trocar por Supabase depois.
    const users = {
      corp: { email: "corp@example.com", password: "1234", orgId: "demo-org" },
      func: { email: "func@example.com", password: "1234", orgId: "demo-org" },
    };

    const u = users[role];
    if (!u || u.email !== email || u.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Token fake só para fluxo do MVP
    const token = Buffer.from(`${role}:${email}:${Date.now()}`).toString("base64");

    return res.status(200).json({
      ok: true,
      role,
      orgId: u.orgId,
      token, // no MVP é só um marcador de sessão
    });
  } catch (err) {
    return res.status(500).json({ error: "Login error", detail: String(err) });
  }
}

