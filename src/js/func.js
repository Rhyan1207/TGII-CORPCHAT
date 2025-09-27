// src/js/func.js

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat");
  const questionInput = document.getElementById("question");
  const sendBtn = document.getElementById("send-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const status = document.getElementById("status");

  // Verifica se usuário é funcionário
  const role = localStorage.getItem("role");
  if (role !== "func") {
    alert("Acesso restrito. Faça login como Funcionário.");
    window.location.href = "index.html";
    return;
  }

  // Função para adicionar mensagens no chat
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("msg", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll automático
  }

  // Evento de enviar mensagem
  sendBtn.addEventListener("click", () => handleSend());
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  function handleSend() {
    const question = questionInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    questionInput.value = "";
    status.textContent = "Aguarde, consultando IA...";

    // --- MVP: resposta local usando dados salvos ---
    const companyInfo = localStorage.getItem("companyInfo") || "";
    const laborInfo = localStorage.getItem("laborInfo") || "";

    // Resposta fake usando localStorage
    setTimeout(() => {
      let answer = "Não encontrei nada relacionado a isso na base da empresa.";
      const allInfo = `${companyInfo}\n${laborInfo}`.toLowerCase();

      if (allInfo.includes("horário") || question.toLowerCase().includes("horário")) {
        answer = "Nosso horário de funcionamento é das 8h às 18h (exemplo).";
      } else if (allInfo.includes("pis") || question.toLowerCase().includes("pis")) {
        answer = "Você pode consultar seu PIS no RH ou no app da Caixa (exemplo).";
      } else if (companyInfo || laborInfo) {
        answer = "Essa resposta está limitada ao MVP local. A IA trará dados mais completos em breve.";
      }

      addMessage(answer, "bot");
      status.textContent = "";
    }, 800);

    // --- Futuro: enviar pergunta ao backend ---
    // fetch("/api/ask", { method: "POST", body: JSON.stringify({ question }) })
    //   .then(res => res.json())
    //   .then(data => addMessage(data.answer, "bot"))
    //   .catch(() => addMessage("Erro ao consultar IA.", "bot"))
    //   .finally(() => status.textContent = "");
  }

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  });
});

