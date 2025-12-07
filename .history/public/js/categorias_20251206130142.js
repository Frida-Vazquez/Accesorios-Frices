// public/js/categorias.js

const API = "/api";
const TOKEN_KEY = "frices_token";

// ======== helpers de sesión/mensajes =========
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

function handleAuthError() {
  alert("Tu sesión ha expirado.");
  clearSession();
  window.location.href = "/login";
}

// ======== cargar categorías =========
async function loadCategorias() {
  try {
    console.log("→ Cargando categorías...");
    const res = await fetch(`${API}/categorias`, {
      headers: authHeader(),
    });

    if (res.status === 401) return handleAuthError();
    if (!res.ok) {
      console.error("Error al cargar categorías:", res.status);
      setMessage("Error al cargar categorías", "error");
      return;
    }

    const data = await res.json();
    console.log("Respuesta /categorias:", data);

    // Soporta array plano o { categorias: [...] }
    const lista = Array.isArray(data) ? data : data.categorias || [];

    const tbody = document.getElementById("tablaCategorias");
    tbody.innerHTML = "";

    lista.forEach((c) => {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
        <td class="py-2">${c.id}</td>
        <td class="py-2">${c.nombre}</td>
        <td class="py-2">${c.descripcion || ""}</td>
        <td class="py-2 flex gap-2">
          <button class="edit px-3 py-1 border rounded" data-id="${c.id}">Editar</button>
          <button class="delete px-3 py-1 border border-red-400 text-red-600 rounded" data-id="${c.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // eventos editar/eliminar
    document.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editCategoria(btn.dataset.id, lista))
    );

    document.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategoria(btn.dataset.id))
    );
  } catch (err) {
    console.error("Error en loadCategorias:", err);
    setMessage("Error al cargar categorías (revisa consola)", "error");
  }
}

function editCategoria(id, categorias) {
  const cat = categorias.find((c) => c.id == id);
  if (!cat) return;

  document.getElementById("catId").value = cat.id;
  document.getElementById("catNombre").value = cat.nombre;
  document.getElementById("catDescripcion").value = cat.descripcion || "";
}

// ======== eliminar =========
async function deleteCategoria(id) {
  if (!confirm("¿Eliminar categoría?")) return;

  try {
    const res = await fetch(`${API}/categorias/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

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

// ======== inicio de la página =========
document.addEventListener("DOMContentLoaded", () => {
  // comprobar sesión
  if (!getToken()) {
    window.location.href = "/login";
    return;
  }

  // botón logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "/login";
    });
  }

  // referencias al formulario
  const form = document.getElementById("categoriaForm");
  const catIdInput = document.getElementById("catId");
  const catNombreInput = document.getElementById("catNombre");
  const catDescripcionInput = document.getElementById("catDescripcion");

  // cargar lista al entrar
  loadCategorias();

  // submit guardar
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = catIdInput.value;
    const body = {
      nombre: catNombreInput.value.trim(),
      descripcion: catDescripcionInput.value.trim(),
    };

    try {
      const res = await fetch(`${API}/categorias${id ? "/" + id : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) return handleAuthError();
      if (!res.ok) {
        console.error("Error al guardar categoría:", res.status);
        setMessage("Error al guardar categoría", "error");
        return;
      }

      setMessage("Categoría guardada correctamente");
      form.reset();
      catIdInput.value = "";
      loadCategorias();
    } catch (err) {
      console.error("Error en submit de categoría:", err);
      setMessage("Error al guardar categoría", "error");
    }
  });

  // botón limpiar
  document.getElementById("btnResetForm").addEventListener("click", () => {
    catIdInput.value = "";
    form.reset();
  });
});
