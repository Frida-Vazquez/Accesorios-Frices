// public/js/clientes-admin.js

const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

let clientes = [];

// ===== SESIÓN / AUTH =====
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleAuthError() {
  alert("Tu sesión ha expirado o no tienes permisos.");
  clearSession();
  window.location.href = "/";
}

// ===== MENSAJES =====
function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = msg || "";
  box.className = "";

  if (!msg) return;

  box.className =
    type === "error" ? "text-red-600" : "text-green-600";

  setTimeout(() => {
    box.textContent = "";
    box.className = "";
  }, 3000);
}

// ===== FETCH HELPER =====
async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...authHeader(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    handleAuthError();
    throw new Error("No autorizado");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }

  return res.json();
}

// ===== NORMALIZAR RESPUESTA =====
function normalizeClientesResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.clientes)) return data.clientes;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// ===== CARGAR / RENDERIZAR CLIENTES =====
async function loadClientes() {
  try {
    const resp = await apiFetch("/clientes");
    clientes = normalizeClientesResponse(resp);
    renderClientes();
  } catch (err) {
    console.error(err);
    setMessage("Error al cargar clientes: " + err.message, "error");
  }
}

function renderClientes() {
  const tbody = document.getElementById("clientesTbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!clientes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "px-3 py-2 text-center text-gray-500";
    td.textContent = "No hay clientes registrados.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  clientes.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2">${c.id}</td>
      <td class="px-3 py-2">${c.nombre}</td>
      <td class="px-3 py-2">${c.email}</td>
      <td class="px-3 py-2">${c.telefono || "-"}</td>
      <td class="px-3 py-2">${c.activo ? "Sí" : "No"}</td>
      <td class="px-3 py-2">${c.created_at ? new Date(c.created_at).toLocaleString() : ""}</td>
      <td class="px-3 py-2 space-x-2">
        <button class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                data-action="edit" data-id="${c.id}">
          Editar
        </button>
        <button class="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                data-action="delete" data-id="${c.id}">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== ELIMINAR (básico) =====
async function deleteCliente(id) {
  if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

  try {
    await apiFetch(`/clientes/${id}`, { method: "DELETE" });
    clientes = clientes.filter((c) => c.id !== id);
    renderClientes();
    setMessage("Cliente eliminado correctamente");
  } catch (err) {
    console.error(err);
    setMessage("Error al eliminar cliente: " + err.message, "error");
  }
}

// Delegación de eventos en la tabla
function initTableEvents() {
  const tbody = document.getElementById("clientesTbody");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "delete") {
      deleteCliente(id);
    } else if (action === "edit") {
      alert("Editar cliente (aquí luego podemos abrir un modal).");
    }
  });
}

// ===== INICIO =====
document.addEventListener("DOMContentLoaded", () => {
  // si no hay token, fuera
  if (!getToken()) {
    window.location.href = "/";
    return;
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "/";
    });
  }

  initTableEvents();
  loadClientes();
});
