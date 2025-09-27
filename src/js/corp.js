// src/js/corp.js

document.addEventListener("DOMContentLoaded", () => {
  // Elementos da página
  const companyInfo = document.getElementById("company-info");
  const laborInfo = document.getElementById("labor-info");
  const aiKey = document.getElementById("ai-key");
  const saveBtn = document.getElementById("save-btn");
  const statusMsg = document.getElementById("status-msg");
  const logoutBtn = document.getElementById("logout-btn");

  // Verifica se está logado como corporação
  const role = localStorage.getItem("role");
  if (role !== "corp") {
    alert("Acesso restrito. Faça login como Corporação.");
    window.location.href = "index.html";
    return;
  }

  // Carrega dados salvos do LocalStorage (MVP)
  const savedCompany = localStorage.getItem("companyInfo");
  const savedLabor = localStorage.getItem("laborInfo");
  const savedKey = localStorage.getItem("aiKey");

  if (savedCompany) companyInfo.value = savedCompany;
  if (savedLabor) laborInfo.value = savedLabor;
  if (savedKey) aiKey.value = savedKey;

  // Função de salvar
  saveBtn.addEventListener("click", () => {
    localStorage.setItem("companyInfo", companyInfo.value);
    localStorage.setItem("laborInfo", laborInfo.value);
    localStorage.setItem("aiKey", aiKey.value);

    statusMsg.textContent = "Dados salvos com sucesso!";
    statusMsg.style.color = "green";

    setTimeout(() => (statusMsg.textContent = ""), 3000);
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  });
});

