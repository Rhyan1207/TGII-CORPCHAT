// src/js/corp.js

document.addEventListener("DOMContentLoaded", () => {
  // Elementos da página
  const companyInfo = document.getElementById("company-info");
  const laborInfo = document.getElementById("labor-info");
  const aiKey = document.getElementById("ai-key");
  const saveBtn = document.getElementById("save-btn");
  const statusMsg = document.getElementById("status-msg");
  const logoutBtn = document.getElementById("logout-btn");

  // Elemento novo: upload de logo
  const logoUpload = document.getElementById("logo-upload");

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
  const savedLogo = localStorage.getItem("orgLogo");

  if (savedCompany) companyInfo.value = savedCompany;
  if (savedLabor) laborInfo.value = savedLabor;
  if (savedKey) aiKey.value = savedKey;

  // Apenas exibir que o logo já existe (se quiser futuramente mostrar preview)
  if (savedLogo) {
    console.log("Logo carregado do localStorage.");
  }

  // Função: capturar imagem, converter para base64 e salvar
  if (logoUpload) {
    logoUpload.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result; // Já vem em base64
        localStorage.setItem("orgLogo", base64);
        statusMsg.textContent = "Logo salva no navegador.";
        statusMsg.style.color = "green";

        setTimeout(() => (statusMsg.textContent = ""), 2500);
      };

      reader.onerror = () => {
        statusMsg.textContent = "Erro ao carregar a imagem.";
        statusMsg.style.color = "crimson";
      };

      reader.readAsDataURL(file); // Converte para Base64
    });
  }

  // Função de salvar textos e chave
  saveBtn.addEventListener("click", async () => {
    statusMsg.textContent = "";
    saveBtn.disabled = true;

    // Salva local (MVP)
    localStorage.setItem("companyInfo", companyInfo.value);
    localStorage.setItem("laborInfo", laborInfo.value);
    localStorage.setItem("aiKey", aiKey.value);

    try {
      // Envia para o backend (Vercel)
      const resp = await fetch("/api/save-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: "demo-org",
          companyText: companyInfo.value,
          laborText: laborInfo.value,
          aiProvider: "openai",
          aiApiKey: aiKey.value,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Falha ao salvar no servidor: ${resp.status} ${errText}`);
      }

      statusMsg.textContent = "Dados salvos com sucesso!";
      statusMsg.style.color = "green";
    } catch (e) {
      console.error(e);
      statusMsg.textContent = "Erro ao salvar. Verifique sua conexão e tente novamente.";
      statusMsg.style.color = "crimson";
    } finally {
      setTimeout(() => (statusMsg.textContent = ""), 3000);
      saveBtn.disabled = false;
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  });
});
// src/js/corp.js

document.addEventListener("DOMContentLoaded", () => {
  // Elementos da página
  const companyInfo = document.getElementById("company-info");
  const laborInfo = document.getElementById("labor-info");
  const aiKey = document.getElementById("ai-key");
  const saveBtn = document.getElementById("save-btn");
  const statusMsg = document.getElementById("status-msg");
  const logoutBtn = document.getElementById("logout-btn");

  // NOVO — Nome da empresa
  const companyNameInput = document.getElementById("company-name");

  // Upload de logo
  const logoUpload = document.getElementById("logo-upload");

  // Verifica se está logado como corporação
  const role = localStorage.getItem("role");
  if (role !== "corp") {
    alert("Acesso restrito. Faça login como Corporação.");
    window.location.href = "index.html";
    return;
  }

  // Carrega dados salvos
  const savedCompany = localStorage.getItem("companyInfo");
  const savedLabor = localStorage.getItem("laborInfo");
  const savedKey = localStorage.getItem("aiKey");
  const savedLogo = localStorage.getItem("orgLogo");
  const savedCompanyName = localStorage.getItem("companyName");

  if (savedCompany) companyInfo.value = savedCompany;
  if (savedLabor) laborInfo.value = savedLabor;
  if (savedKey) aiKey.value = savedKey;
  if (savedCompanyName && companyNameInput) companyNameInput.value = savedCompanyName;

  if (savedLogo) console.log("Logo carregada do localStorage.");

  // Upload do logo → salva como base64
  if (logoUpload) {
    logoUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        localStorage.setItem("orgLogo", reader.result);
        statusMsg.textContent = "Logo salva no navegador.";
        statusMsg.style.color = "green";
        setTimeout(() => (statusMsg.textContent = ""), 2500);
      };

      reader.onerror = () => {
        statusMsg.textContent = "Erro ao carregar a imagem.";
        statusMsg.style.color = "crimson";
      };

      reader.readAsDataURL(file);
    });
  }

  // SALVAR TUDO
  saveBtn.addEventListener("click", async () => {
    statusMsg.textContent = "";
    saveBtn.disabled = true;

    // Salva local (MVP)
    localStorage.setItem("companyInfo", companyInfo.value);
    localStorage.setItem("laborInfo", laborInfo.value);
    localStorage.setItem("aiKey", aiKey.value);

    // NOVO — Salvar nome da empresa
    if (companyNameInput) {
      localStorage.setItem("companyName", companyNameInput.value.trim());
    }

    try {
      const resp = await fetch("/api/save-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: "demo-org",
          companyText: companyInfo.value,
          laborText: laborInfo.value,
          aiProvider: "openai",
          aiApiKey: aiKey.value,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Falha ao salvar no servidor: ${resp.status} ${errText}`);
      }

      statusMsg.textContent = "Dados salvos com sucesso!";
      statusMsg.style.color = "green";
    } catch (e) {
      console.error(e);
      statusMsg.textContent = "Erro ao salvar. Verifique sua conexão.";
      statusMsg.style.color = "crimson";
    } finally {
      setTimeout(() => (statusMsg.textContent = ""), 3000);
      saveBtn.disabled = false;
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "index.html";
  });
});

