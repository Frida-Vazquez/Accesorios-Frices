// ==== CONFIG BÁSICA ====
const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

// ==== SESIÓN ====
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
  alert("Tu sesión ha expirado o no es válida.");
  clearSession();
  window.location.href = "/login";
}

// ==== MENSAJES ====
function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = msg || "";
  box.className = type === "error" ? "text-red-600" : "text-green-600";

  if (msg) {
    setTimeout(() => {
      box.textContent = "";
      box.className = "";
    }, 3000);
  }
}

// ==== NORMALIZAR RESPUESTA DE API ====
function normalizeCategoriasResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.categorias)) return data.categorias;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// ==== CARGAR CATEGORÍAS ====
async function loadCategorias() {
  try {
    console.log("→ GET", `${API_BASE}/categorias`);
    const res = await fetch(`${API_BASE}/categorias`, {
      headers: authHeader(),
    });

    console.log("Status GET /categorias:", res.status);

    if (res.status === 401) return handleAuthError();
    if (!res.ok) {
      setMessage("Error al cargar categorías", "error");
      return;
    }

    const raw = await res.json();
    console.log("Respuesta cruda /categorias:", raw);

    const lista = normalizeCategoriasResponse(raw);
    console.log("Lista normalizada:", lista);

    const tbody = document.getElementById("tablaCategorias");
    tbody.innerHTML = "";

    lista.forEach((c) => {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      // Si tiene imagen_url, mostramos miniatura; si no, texto "Sin imagen"
      const imagenTd = c.imagen_url
        ? `<img src="${c.imagen_url}" class="w-10 h-10 object-cover rounded-lg border" />`
        : `<span class="text-xs text-gray-400">Sin imagen</span>`;

      tr.innerHTML = `
        <td class="py-2">${c.id}</td>
        <td class="py-2">${c.nombre}</td>
        <td class="py-2">${c.descripcion || ""}</td>
        <td class="py-2">
          ${imagenTd}
        </td>
        <td class="py-2">
          <div class="flex gap-2">
            <button class="edit px-3 py-1 border rounded text-xs" data-id="${c.id}">Editar</button>
            <button class="delete px-3 py-1 border border-red-400 text-red-600 rounded text-xs" data-id="${c.id}">
              Eliminar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Eventos de edición y eliminación
    document.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editCategoria(btn.dataset.id, lista))
    );

    document.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategoria(btn.dataset.id))
    );
  } catch (err) {
    console.error("Error en loadCategorias:", err);
    setMessage("Error al cargar categorías", "error");
  }
}

// ==== ABRIR / CERRAR MODAL ====
function openModalCategoria(modo = "nueva") {
  const modal = document.getElementById("modalCategoria");
  const modalTitle = document.getElementById("modalTitle");

  if (modo === "editar") {
    modalTitle.textContent = "Editar categoría";
  } else {
    modalTitle.textContent = "Nueva categoría";
  }

  modal.classList.remove("hidden");
}

function closeModalCategoria() {
  const modal = document.getElementById("modalCategoria");
  modal.classList.add("hidden");
}

// Cuando damos clic en "Editar"
function editCategoria(id, categorias) {
  const cat = categorias.find((c) => c.id == id);
  if (!cat) return;

  document.getElementById("catId").value = cat.id;
  document.getElementById("catNombre").value = cat.nombre;
  document.getElementById("catDescripcion").value = cat.descripcion || "";
  document.getElementById("catImagenUrl").value = cat.imagen_url || ""; // <-- NUEVO

  openModalCategoria("editar");
}

async function deleteCategoria(id) {
  if (!confirm("¿Eliminar categoría?")) return;

  try {
    const res = await fetch(`${API_BASE}/categorias/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    console.log("Status DELETE /categorias/:id", res.status);

    if (res.status === 401) return handleAu
