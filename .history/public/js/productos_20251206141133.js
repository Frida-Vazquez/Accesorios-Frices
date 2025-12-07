// public/js/productos.js

// ========= CONFIG BÁSICA =========
const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

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
  window.location.href = "/login";
}

// ========= MENSAJES =========
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

// ========= NORMALIZADORES =========
function normalizeCategoriasResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.categorias)) return data.categorias;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function normalizeProductosResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.productos)) return data.productos;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// ========= CARGAR CATEGORÍAS EN EL SELECT =========
async function loadCategoriasSelect() {
  try {
    const res = await fetch(`${API_BASE}/categorias`, {
      headers: authHeader(),
    });

    if (res.status === 401 || res.status === 403) return handleAuthError();
    if (!res.ok) {
      setMessage("Error al cargar categorías", "error");
      return;
    }

    const raw = await res.json();
    const categorias = normalizeCategoriasResponse(raw);

    const select = document.getElementById("prodCategoria");
    select.innerHTML = `<option value="">Selecciona una categoría</option>`;

    categorias.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombre;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error en loadCategoriasSelect:", err);
    setMessage("Error al cargar categorías", "error");
  }
}

// ========= CARGAR PRODUCTOS EN LA TABLA =========
async function loadProductos() {
  try {
    const res = await fetch(`${API_BASE}/productos`, {
      headers: authHeader(),
    });

    if (res.status === 401 || res.status === 403) return handleAuthError();
    if (!res.ok) {
      setMessage("Error al cargar productos", "error");
      return;
    }

    const raw = await res.json();
    const lista = normalizeProductosResponse(raw);

    const tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = "";

    lista.forEach((p) => {
      const catNombre =
        p.categoria_nombre ||
        (p.categoria && p.categoria.nombre) ||
        p.categoria ||
        p.categoria_id ||
        "";

      const tr = document.createElement("tr");
      tr.classList.add("border-b");

      tr.innerHTML = `
        <td class="py-2 pr-2">${p.id}</td>
        <td class="py-2 pr-2">${p.nombre}</td>
        <td class="py-2 pr-2">${catNombre}</td>
        <td class="py-2 pr-2">$${Number(p.precio || 0).toFixed(2)}</td>
        <td class="py-2 pr-2">${p.stock ?? ""}</td>
        <td class="py-2 pr-2">${p.destacado ? "Sí" : "No"}</td>
        <td class="py-2 pr-2 flex gap-2">
          <button class="btn-edit px-3 py-1 border rounded text-xs" data-id="${p.id}">
            Editar
          </button>
          <button class="btn-delete px-3 py-1 border border-red-400 text-red-600 rounded text-xs" data-id="${p.id}">
            Eliminar
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Eventos editar / eliminar
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => editProducto(btn.dataset.id, lista));
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteProducto(btn.dataset.id));
    });
  } catch (err) {
    console.error("Error en loadProductos:", err);
    setMessage("Error al cargar productos", "error");
  }
}

// ========= RELLENAR FORM PARA EDITAR =========
function editProducto(id, productos) {
  const p = productos.find((prod) => String(prod.id) === String(id));
  if (!p) return;

  document.getElementById("prodId").value = p.id;
  document.getElementById("prodNombre").value = p.nombre || "";
  document.getElementById("prodDescripcion").value = p.descripcion || "";
  document.getElementById("prodPrecio").value = p.precio || "";
  document.getElementById("prodStock").value = p.stock ?? "";
  document.getElementById("prodImagen").value = p.imagen_url || p.imagen || "";
  document.getElementById("prodCategoria").value =
    p.categoria_id || p.categoria || "";
  document.getElementById("prodDestacado").checked = !!p.destacado;
}

// ========= ELIMINAR PRODUCTO =========
async function deleteProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_BASE}/productos/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (res.status === 401 || res.status === 403) return handleAuthError();
    if (!res.ok) {
      setMessage("No se pudo eliminar el producto", "error");
      return;
    }

    setMessage("Producto eliminado correctamente");
    loadProductos();
  } catch (err) {
    console.error("Error en deleteProducto:", err);
    setMessage("Error al eliminar producto", "error");
  }
}

// ========= INICIO DE LA PÁGINA =========
document.addEventListener("DOMContentLoaded", () => {
  // Validar sesión
  if (!getToken()) {
    return handleAuthError();
  }

  // Botón logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "/login";
    });
  }

  const form = document.getElementById("productoForm");
  const btnReset = document.getElementById("btnResetForm");

  // Cargar combos y tabla
  loadCategoriasSelect();
  loadProductos();

  // Guardar producto
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("prodId").value;
    const body = {
      nombre: document.getElementById("prodNombre").value.trim(),
      descripcion: document.getElementById("prodDescripcion").value.trim(),
      precio: Number(document.getElementById("prodPrecio").value || 0),
      categoria_id: document.getElementById("prodCategoria").value,
      stock: Number(document.getElementById("prodStock").value || 0),
      imagen_url: document.getElementById("prodImagen").value.trim(),
      destacado: document.getElementById("prodDestacado").checked,
    };

    const url = id
      ? `${API_BASE}/productos/${id}`
      : `${API_BASE}/productos`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401 || res.status === 403) return handleAuthError();
      if (!res.ok) {
        setMessage("No se pudo guardar el producto", "error");
        return;
      }

      setMessage("Producto guardado correctamente");
      form.reset();
      document.getElementById("prodId").value = "";
      loadProductos();
    } catch (err) {
      console.error("Error en submit producto:", err);
      setMessage("Error al guardar producto", "error");
    }
  });

  // Limpiar formulario
  btnReset.addEventListener("click", () => {
    form.reset();
    document.getElementById("prodId").value = "";
  });
});
