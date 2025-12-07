// public/app.js

const API_BASE = "/api"; // ajusta si usas /api/v1, etc.

// ===== Referencias al DOM =====
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const welcomeSection = document.getElementById("welcomeSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerNombre = document.getElementById("registerNombre");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const goToRegister = document.getElementById("goToRegister");
const goToLogin = document.getElementById("goToLogin");

const messageBox = document.getElementById("message");
const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");

// ===== Helpers UI =====
function showMessage(msg, type = "success") {
  messageBox.textContent = msg || "";
  messageBox.classList.remove("error", "success");
  if (msg) {
    messageBox.classList.add(type);
  }
}

function showLogin() {
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
  welcomeSection.classList.add("hidden");
}

function showRegister() {
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
  welcomeSection.classList.add("hidden");
}

function showWelcome(user) {
  loginSection.classList.add("hidden");
  registerSection.classList.add("hidden");
  welcomeSection.classList.remove("hidden");
  welcomeText.textContent = `Hola ${user.nombre}, has iniciado sesión en Accesorios Frices con el correo ${user.email}.`;
}

// ===== Manejo de token en localStorage =====
const TOKEN_KEY = "frices_token";
const USER_KEY = "frices_user";

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      user = null;
    }
  }
  return { token, user };
}

// helper: saber si el usuario es ADMIN
function isAdmin(user) {
  return Array.isArray(user?.roles) && user.roles.includes("ADMIN");
}

// ===== Listeners para cambiar entre login / registro =====
goToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  showMessage("");
  showRegister();
});

goToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  showMessage("");
  showLogin();
});

// ===== Enviar login =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("Iniciando sesión en Accesorios Frices...", "success");

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showMessage("Por favor ingresa tu correo y contraseña.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg =
        errorData?.message ||
        "Credenciales inválidas o error en el servidor de Accesorios Frices.";
      showMessage(msg, "error");
      return;
    }

    const data = await res.json();
    // { token, user: { id, nombre, email, roles: [...] } }
    saveSession(data.token, data.user);

    if (isAdmin(data.user)) {
      // 👉 si es admin, lo mandamos al panel
      window.location.href = "/static/admin/admin.html";
    } else {
      // cliente normal: se queda en la pantalla de bienvenida
      showMessage("Inicio de sesión correcto. ¡Disfruta tus accesorios! 💎", "success");
      showWelcome(data.user);
    }
  } catch (err) {
    console.error(err);
    showMessage(
      "Error de red al intentar iniciar sesión en Accesorios Frices.",
      "error"
    );
  }
});

// ===== Enviar registro (crear cliente) =====
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("Creando tu cuenta en Accesorios Frices...", "success");

  const nombre = registerNombre.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!nombre || !email || !password) {
    showMessage("Todos los campos son obligatorios.", "error");
    return;
  }

  if (password.length < 8) {
    showMessage("La contraseña debe tener al menos 8 caracteres.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        activo: true,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg =
        errorData?.message ||
        "No se pudo crear la cuenta en Accesorios Frices.";
      showMessage(msg, "error");
      return;
    }

    const data = await res.json();
    showMessage(
      "Cuenta creada correctamente ✨ Ahora puedes iniciar sesión.",
      "success"
    );

    registerForm.reset();
    showLogin();
    // tratamos de rellenar el mail que acaba de registrarse
    loginEmail.value = data.email || email;
  } catch (err) {
    console.error(err);
    showMessage(
      "Error de red al crear la cuenta en Accesorios Frices.",
      "error"
    );
  }
});

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
  clearSession();
  showMessage("Sesión cerrada en Accesorios Frices.", "success");
  showLogin();
});

// ===== Al cargar la página, revisar si ya hay sesión =====
window.addEventListener("DOMContentLoaded", () => {
  const { token, user } = getSession();
  if (token && user) {
    // si ya estaba logueado y es admin, lo mando directo a /admin
    if (isAdmin(user)) {
      window.location.href = "/static/admin/admin.html";
    } else {
      showMessage("Sesión restaurada en Accesorios Frices.", "success");
      showWelcome(user);
    }
  } else {
    showLogin();
  }
});
