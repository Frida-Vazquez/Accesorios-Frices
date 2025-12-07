// public/js/categorias.js

// Usamos lo que ya existe en admin.js:
// - API_BASE
// - getToken()
// - authHeader()
// - setMessage()
// - handleAuthError()

async function loadCategorias() {
  try {
    console.log("→ Cargando categorías...");
    const res = await fetch(`${API_BASE}/categorias`, {
      headers: authHeader(),
    });

    if (res.status === 401) return handleAuthError();

    if (!res.ok) {
      console.error("Error al cargar categorías", res.status);
      setMessage("Error al cargar categorías", "error");
      return;
    }

    const data = await res.json();
    console.log("Respuesta de /categorias:", data);

    // Si tu API regresa { categorias: [...] } ajustamos:
    const lista = Array.isArray(data) ? data : data.categorias || [];

    const tbody = document.getElementById("tablaCategorias");
    tbody.innerHTML = "";

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

    // Eventos de editar
    document.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", () => editCategoria(btn.dataset.id, lista))
    );

    // Eventos de eliminar
    document.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => deleteCategoria(btn.dataset.id))
    );
  } catch (err) {
    console.error("Error en loadCategorias:", err);
    setMessage("Error al cargar categorías (consulta consola)", "error");
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
    const res = await fetch(`${API_BASE}/categorias/${id}`, {
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

document.addEventListener("DOMContentLoaded", () => {
  // Si no hay token, mandamos a login
  if (!getToken()) {
    window.location.href = "/login";
    return;
  }

  const form = document.getElementById("categoriaForm");
  const catIdInput = document.getElementById("catId");
  const catNombreInput = document.getElementById("catNombre");
  const catDescripcionInput = document.getElementById("catDescripcion");

  // Cargar lista al entrar
  loadCategorias();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = catIdInput.value;
    const body = {
      nombre: catNombreInput.value.trim(),
      descripcion: catDescripcionInput.value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/categorias${id ? "/" + id : ""}`, {
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

  document.getElementById("btnResetForm").addEventListener("click", () => {
    catIdInput.value = "";
    form.reset();
  });
});
