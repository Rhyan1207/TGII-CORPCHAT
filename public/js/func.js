// src/js/func.js

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat");
  const questionInput = document.getElementById("question");
  const sendBtn = document.getElementById("send-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const status = document.getElementById("status");

  // NOVO: elementos de identidade
  const logoImg = document.getElementById("corp-logo");
  const companyNameBox = document.getElementById("company-name-box");
  const companyNameDisplay = document.getElementById("company-name-display");

  // Garante que é funcionário
  const role = localStorage.getItem("role");
  if (role !== "func") {
    alert("Acesso restrito. Faça login como Funcionário.");
    window.location.href = "index.html";
    return;
  }

  // Carregar logo salvo
  const savedLogo = localStorage.getItem("orgLogo");
  if (savedLogo && logoImg) {
    logoImg.src = savedLogo;
    logoImg.style.display = "block";
  }

  // NOVO: carregar nome da empresa
  const savedCompanyName = localStorage.getItem("companyName");
  if (savedCompanyName && companyNameBox && companyNameDisplay) {
    companyNameDisplay.textContent = savedCompanyName;
    companyNameBox.style.display = "block";
  }

  // Utilitários
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("msg", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function askBackend(question) {
    const payload = {
      orgId: "demo-org",
      question,
      companyText: localStorage.getItem("companyInfo") || "",
      laborText: localStorage.getItem("laborInfo") || "",
    };

    const resp = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`Erro na API /api/ask: ${resp.status} ${errText}`);
    }

    const data = await resp.json().catch(() => ({}));
    return data?.answer || "Sem resposta do backend.";
  }

  async function handleSend() {
    const question = questionInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    questionInput.value = "";
    questionInput.focus();

    sendBtn.disabled = true;
    status.textContent = "Consultando IA...";
    status.style.color = "#666";

    try {
      const answer = await askBackend(question);
      addMessage(answer, "bot");
    } catch (e) {
      console.error(e);
      addMessage("Erro ao consultar IA. Tente novamente em instantes.", "bot");
    } finally {
      status.textContent = "";
      sendBtn.disabled = false;
    }
  }

  // Eventos
  sendBtn.addEventListener("click", handleSend);
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  });
});