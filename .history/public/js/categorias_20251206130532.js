// public/js/categorias.js
// Este archivo SUPONE que admin.js ya está cargado
// y nos da: API_BASE, getToken(), authHeader(), setMessage(), handleAuthError()

document.addEventListener("DOMContentLoaded", () => {
  // Si no hay sesión, salimos
  if (!getToken()) {
    return handleAuthError();
  }

  const form = document.getElementById("categoriaForm");
  const catIdInput = document.getElementById("catId");
  const catNombreInput = document.getElementById("catNombre");
  const catDescripcionInput = document.getElementById("catDescripcion");
  const resetBtn = document.getElementById("btnResetForm");
  const tbody = document.getElementById("tablaCategorias");

  if (!form || !tbody) {
    console.error("No se encontró el formulario o la tabla de categorías");
    return;
  }

  async function loadCategorias() {
    try {
      console.log("→ Cargando categorías...");
      const res = await fetch(`${API_BASE}/categorias`, {
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

      // Eventos de editar / eliminar
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

    catIdInput.value = cat.id;
    catNombreInput.value = cat.nombre;
    catDescripcionInput.value = cat.descripcion || "";
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

  // Guardar (crear/editar)
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

  // Limpiar
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      catIdInput.value = "";
      form.reset();
    });
  }

  // Cargar lista al entrar
  loadCategorias();
});
