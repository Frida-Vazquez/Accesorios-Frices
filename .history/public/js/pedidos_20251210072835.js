// public/js/pedidos.js

const API_URL = "/api";
const TOKEN_KEY = "frices_token"; // o el que uses para admin

// ============ AUTH (solo para encabezado Authorization) ============
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============ MENSAJES EN LA VISTA ============
function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = msg || "";
  box.className =
    type === "error"
      ? "mb-4 text-sm text-red-600"
      : "mb-4 text-sm text-green-600";

  if (msg) {
    setTimeout(() => {
      box.textContent = "";
      box.className = "";
    }, 3000);
  }
}

// ============ HELPER PARA LLAMAR A LA API ============
async function apiFetch(path, options = {}) {
  const resp = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    let msg = "Error al cargar pedidos";
    try {
      const errData = await resp.json();
      if (errData.message) msg = errData.message;
    } catch (_) {}
    setMessage(msg, "error");
    throw new Error(msg);
  }

  return resp.json();
}

// ============ CARGAR Y PINTAR PEDIDOS ============
async function cargarPedidos() {
  try {
    const pedidos = await apiFetch("/pedidos");

    const tbody = document.getElementById("tablaPedidos");
    tbody.innerHTML = "";

    if (!pedidos.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-4 text-center text-slate-500">
            No hay pedidos registrados aún.
          </td>
        </tr>
      `;
      return;
    }

    for (const p of pedidos) {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-slate-50";

      tr.innerHTML = `
        <td class="py-2 px-2">${p.id}</td>
        <td class="py-2 px-2">${p.fecha ?? ""}</td>
        <td class="py-2 px-2">${p.cliente_nombre ?? ""}</td>
        <td class="py-2 px-2">${p.cliente_email ?? ""}</td>
        <td class="py-2 px-2">${p.estado ?? ""}</td>
        <td class="py-2 px-2">$${Number(p.total || 0).toFixed(2)}</td>
      `;

      tbody.appendChild(tr);
    }
  } catch (e) {
    console.error("Error al cargar pedidos:", e);
  }
}

// ============ LOGOUT ADMIN ============
function setupLogout() {
  const btn = document.getElementById("btnLogout");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/static/auth/login.html";
  });
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  // Si quieres forzar que solo entre con token, descomenta:
  // if (!getToken()) {
  //   window.location.href = "/static/auth/login.html";
  //   return;
  // }

  setupLogout();
  cargarPedidos();
});
