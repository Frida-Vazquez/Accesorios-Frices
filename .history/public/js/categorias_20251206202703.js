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

// ==== SUBIR IMAGEN AL SERVIDOR ====
// file: objeto File de <input type="file">
async function uploadImagenCategoria(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("imagen", file); // "imagen" = mismo nombre que en upload.single("imagen")

  try {
    const res = await fetch(`${API_BASE}/categorias/upload`, {  // 👈 IMPORTANTE
      method: "POST",
      headers: {
        ...authHeader(), // NO pongas "Content-Type" aquí
      },
      body: formData,
    });

    console.log("Status POST /categorias/upload:", res.status);

    if (res.status === 401) {
      handleAuthError();
      return null;
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.error("Error al subir imagen:", txt);
      setMessage("Error al subir imagen", "error");
      return null;
    }

    const data = await res.json();
    console.log("Respuesta upload imagen:", data);

    return data.url || null;
  } catch (err) {
    console.error("Error en uploadImagenCategoria:", err);
    setMessage("Error al subir imagen", "error");
    return null;
  }
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

  modalTitle.textContent = modo === "editar" ? "Editar categoría" : "Nueva categoría";
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
  document.getElementById("catImagenUrl").value = cat.imagen_url || ""; // mantenemos la URL que ya tenía
  // NO llenamos el input file, eso el navegador no lo permite

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

    if (res.status === 401) return handleAuthError();
    if (!res.ok) {
      setMessage("Error al eliminar categoría", "error");
      return;
    }

    setMessage("Categoría eliminada");
    loadCategorias();
  } catch (err) {
    console.error("Error en deleteCategoria:", err);
    setMessage("Error al eliminar categoría", "error");
  }
}

// ==== INICIO DE LA PÁGINA ====
document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) {
    return handleAuthError();
  }

  const form = document.getElementById("categoriaForm");
  const catIdInput = document.getElementById("catId");
  const catNombreInput = document.getElementById("catNombre");
  const catDescripcionInput = document.getElementById("catDescripcion");
  const catImagenUrlInput = document.getElementById("catImagenUrl");
  const catImagenFileInput = document.getElementById("catImagenFile");
  const resetBtn = document.getElementById("btnResetForm");
  const btnLogout = document.getElementById("btnLogout");
  const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const modal = document.getElementById("modalCategoria");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "/login";
    });
  }

  if (btnNuevaCategoria) {
    btnNuevaCategoria.addEventListener("click", () => {
      catIdInput.value = "";
      form.reset();
      // aseguramos limpiar también la URL oculta
      catImagenUrlInput.value = "";
      openModalCategoria("nueva");
    });
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
      closeModalCategoria();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModalCategoria();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModalCategoria();
    }
  });

  loadCategorias();

  // Guardar categoría
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = catIdInput.value;

    // 1) si hay archivo seleccionado, lo subimos primero
    let imagenUrl = catImagenUrlInput.value || null;

    const file = catImagenFileInput.files[0];
    if (file) {
      const subida = await uploadImagenCategoria(file);
      if (!subida) {
        // si falló la subida, no seguimos
        return;
      }
      imagenUrl = subida;
      // guardamos la URL en el hidden por si se vuelve a abrir el modal
      catImagenUrlInput.value = imagenUrl;
    }

    // 2) armamos el payload para la API de categorías
    const body = {
      nombre: catNombreInput.value.trim(),
      descripcion: catDescripcionInput.value.trim(),
      imagen_url: imagenUrl,
    };

    console.log("→ Enviando categoría", { id, body });

    try {
      const url = `${API_BASE}/categorias${id ? "/" + id : ""}`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(body),
      });

      console.log(`${method} ${url} status:`, res.status);

      if (res.status === 401) return handleAuthError();
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Error al guardar categoría:", res.status, errText);
        setMessage("Error al guardar categoría", "error");
        return;
      }

      setMessage("Categoría guardada correctamente");
      form.reset();
      catIdInput.value = "";
      catImagenUrlInput.value = "";
      closeModalCategoria();
      loadCategorias();
    } catch (err) {
      console.error("Error en submit de categoría:", err);
      setMessage("Error al guardar categoría", "error");
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      catIdInput.value = "";
      form.reset();
      catImagenUrlInput.value = "";
    });
  }
});
