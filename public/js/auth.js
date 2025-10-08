// src/js/auth.js

// Simulação de usuários (apenas para MVP)
// Depois substituiremos por requisição à rota /api/login
const mockUsers = {
  corp: { email: "corp@example.com", password: "1234" },
  func: { email: "func@example.com", password: "1234" },
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedRole = document.querySelector("input[name='role']:checked").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validação simples
    if (!email || !password) {
      errorMsg.textContent = "Preencha todos os campos.";
      return;
    }

    // Autenticação fake
    const user = mockUsers[selectedRole];
    if (user && email === user.email && password === user.password) {
      // Salvar sessão no localStorage (simples para MVP)
      localStorage.setItem("role", selectedRole);
      localStorage.setItem("email", email);

      // Redirecionar para a tela certa
      if (selectedRole === "corp") {
        window.location.href = "corp.html";
      } else {
        window.location.href = "func.html";
      }
    } else {
      errorMsg.textContent = "Credenciais inválidas. Tente novamente.";
    }
  });
});

