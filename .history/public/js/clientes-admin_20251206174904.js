// public/js/clientes-admin.js

const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

let clientes = [];

// ========= SESIÓN / AUTH =========
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

// ========= MENSAJES =========
function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = msg || "";
  box.className = "";

  if (!msg) return;

  box.className =
    type === "error"
      ? "text-red-600"
      : "text-green-600";

  setTimeout(() => {
    box.textContent = "";
    box.className = "";
  }, 3000);
}

// ========= FETCH HELPER =========
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
    let text;
    try {
      text = await res.text();
    } catch (e) {
      text = `Error ${res.status}`;
    }
    throw new Error(text || `Error ${res.status}`);
  }

  if (res.status === 204) return null; // sin contenido
  return res.json();
}

// ========= NORMALIZAR RESPUESTAS =========
function normalizeClientesResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.clientes)) return data.clientes;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function normalizeCliente(data) {
  // por si viene envuelto en {cliente: {...}} o {data: {...}}
  if (!data) return null;
  if (data.cliente) return data.cliente;
  if (data.data) return data.data;
  return data;
}

// ========= CARGAR / RENDER =========
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
      <td class="px-3 py-2">
        ${c.created_at ? new Date(c.created_at).toLocaleString() : ""}
      </td>
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

// ========= MODAL =========
function openClienteModal(cliente = null) {
  const modal = document.getElementById("clienteModal");
  const title = document.getElementById("clienteModalTitle");

  const inputId = document.getElementById("clienteId");
  const inputNombre = document.getElementById("clienteNombre");
  const inputEmail = document.getElementById("clienteEmail");
  const inputTelefono = document.getElementById("clienteTelefono");
  const inputActivo = document.getElementById("clienteActivo");

  if (cliente) {
    title.textContent = "Editar cliente";
    inputId.value = cliente.id;
    inputNombre.value = cliente.nombre || "";
    inputEmail.value = cliente.email || "";
    inputTelefono.value = cliente.telefono || "";
    inputActivo.checked = !!cliente.activo;
  } else {
    title.textContent = "Nuevo cliente";
    inputId.value = "";
    inputNombre.value = "";
    inputEmail.value = "";
    inputTelefono.value = "";
    inputActivo.checked = true;
  }

  modal.classList.remove("hidden");
}

function closeClienteModal() {
  const modal = document.getElementById("clienteModal");
  if (!modal) return;
  modal.classList.add("hidden");
}

// ========= CREAR / ACTUALIZAR =========
async function saveCliente(event) {
  event.preventDefault();

  const inputId = document.getElementById("clienteId");
const inputNombre = document.getElementById("clienteNombre");
const inputEmail = document.getElementById("clienteEmail");
const inputTelefono = document.getElementById("clienteTelefono");
const inputActivo = document.getElementById("clienteActivo");
const inputPassword = document.getElementById("clientePassword"); // 👈 NUEVO


  const id = inputId.value ? Number(inputId.value) : null;

  const payload = {
    nombre: inputNombre.value.trim(),
    email: inputEmail.value.trim(),
    telefono: inputTelefono.value.trim() || null,
    activo: !!inputActivo.checked,
  };

  if (!payload.nombre || !payload.email) {
    setMessage("Nombre y email son obligatorios.", "error");
    return;
  }

  try {
    let resp;
    if (id) {
      // EDITAR
      resp = await apiFetch(`/clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const actualizado = normalizeCliente(resp);
      // actualizo en el array
      const idx = clientes.findIndex((c) => c.id === id);
      if (idx !== -1 && actualizado) {
        clientes[idx] = { ...clientes[idx], ...actualizado };
      }
      setMessage("Cliente actualizado correctamente.");
    } else {
      // CREAR
      resp = await apiFetch("/clientes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const creado = normalizeCliente(resp);
      if (creado) {
        clientes.push(creado);
      }
      setMessage("Cliente creado correctamente.");
    }

    renderClientes();
    closeClienteModal();
  } catch (err) {
    console.error(err);
    setMessage("Error al guardar cliente: " + err.message, "error");
  }
}

// ========= ELIMINAR =========
async function deleteCliente(id) {
  if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

  try {
    await apiFetch(`/clientes/${id}`, { method: "DELETE" });
    clientes = clientes.filter((c) => c.id !== id);
    renderClientes();
    setMessage("Cliente eliminado correctamente.");
  } catch (err) {
    console.error(err);
    setMessage("Error al eliminar cliente: " + err.message, "error");
  }
}

// ========= EVENTOS =========
function initEventosTabla() {
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
      const cliente = clientes.find((c) => c.id === id);
      if (cliente) {
        openClienteModal(cliente);
      }
    }
  });
}

function initEventosModal() {
  const modal = document.getElementById("clienteModal");
  const form = document.getElementById("clienteForm");
  const btnNuevoCliente = document.getElementById("btnNuevoCliente");

  if (btnNuevoCliente) {
    btnNuevoCliente.addEventListener("click", () => openClienteModal());
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.dataset.closeModal !== undefined) {
        closeClienteModal();
      }
    });
  }

  if (form) {
    form.addEventListener("submit", saveCliente);
  }
}

// ========= INICIO =========
document.addEventListener("DOMContentLoaded", () => {
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

  initEventosTabla();
  initEventosModal();
  loadClientes();
});
