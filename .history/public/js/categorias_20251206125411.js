// public/js/categorias.js

const API = "/api";
const TOKEN_KEY = "frices_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setMessage(msg, error = false) {
  const box = document.getElementById("adminMessage");
  if (!box) return;
  box.textContent = msg || "";
  box.className = error ? "text-red-600" : "text-green-600";

  if (msg) {
    setTimeout(() => {
      box.textContent = "";
      box.className = "";
    }, 3000);
  }
}

function handleAuthError() {
  alert("Sesión expirada.");
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
}

async function loadCategorias() {
  try {
    console.log("→ Cargando categorías...");
    const res = await fetch(`${API}/categorias`, { headers: authHeader() });

    if (res.status === 401) return handleAuthError();

    if (!res.ok) {
      console.error("Error al cargar categorías", res.status);
      setMessage("Error al cargar categorías", true);
      return;
    }

    const data = await res.json();
    console.log("Categorías recibidas de la API:", data);

    const tbody = document.getElementById("tablaCategorias");
    tbody.innerHTML = "";

    // Si tu API regresa { categorias: [...] }, cambia a: const lista = data.categorias;
    const lista = Array.isArray(data) ? data : data.categorias || [];

    lista.forEach((c) => {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
        <td class="py-2">${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.descripcion || ""}</td>
        <td class="flex gap-2 py-2">
          <button class="edit px-3 py-1 border rounded" data-id="${c.id}">Editar</button>
          <button class="delete px-3 py-1 border border-red-400 text-red-600 rounded" data-id="${c.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Listeners de editar
    document.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editCategoria(btn.dataset.id, lista))
    );

    // Listeners de eliminar
    document.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategoria(btn.dataset.id))
    );
  } catch (err) {
    console.error("Error en loadCategorias:", err);
    setMessage("Error al cargar categorías (revisa consola)", true);
  }
}

function editCategoria(id, categorias) {
  const cat = categorias.find((c) => c.id == id);
  if (!cat) return;

  document.getElementById("catId").value = cat.id;
  document.getElementById("catNombre").value = cat.nombre;
  document.getElementById("catDescripcion").value = cat.descripcion || "";
}

async function deleteCategoria(id) {
  if (!confirm("¿Eliminar categoría?")) return;

  try {
    const res = await fetch(`${API}/categorias/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (res.status === 401) return handleAuthError();

    if (!res.ok) {
      setMessage("Error al eliminar categoría", true);
      return;
    }

    setMessage("Categoría eliminada");
    loadCategorias();
  } catch (err) {
    console.error("Error en deleteCategoria:", err);
    setMessage("Error al eliminar categoría", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) {
    window.location.href = "/login";
    return;
  }

  const catIdInput = document.getElementById("catId");
  const catNombreInput = document.getElementById("catNombre");
  const catDescripcionInput = document.getElementById("catDescripcion");

  loadCategorias();

  const form = document.getElementById("categoriaForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = catIdInput.value;
    const body = {
      nombre: catNombreInput.value.trim(),
      descripcion: catDescripcionInput.value.trim(),
    };

    console.log("→ Enviando categoría", { id, body });

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
        console.error("Error al guardar categoría", res.status);
        setMessage("Error al guardar categoría", true);
        return;
      }

      setMessage("Guardado correctamente");
      form.reset();
      catIdInput.value = "";
      await loadCategorias(); // recargar lista
    } catch (err) {
      console.error("Error en submit de categoría:", err);
      setMessage("Error al guardar categoría", true);
    }
  });

  document.getElementById("btnResetForm").addEventListener("click", () => {
    catIdInput.value = "";
    form.reset();
  });
});
