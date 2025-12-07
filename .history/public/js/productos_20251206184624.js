// ========= CONFIG BÁSICA =========
const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

// ========= SCROLL PERSONALIZADO =========
let scrollContainer = null;
let scrollThumb = null;

function updateCustomScrollbar() {
  if (!scrollContainer || !scrollThumb) return;

  const visible = scrollContainer.clientHeight;
  const total = scrollContainer.scrollHeight;

  // Si no hay contenido para hacer scroll, ocultamos la barra
  if (total <= visible) {
    scrollThumb.style.display = "none";
    return;
  } else {
    scrollThumb.style.display = "block";
  }

  // Altura del thumb proporcional
  const ratio = visible / total;
  const thumbHeight = Math.max(visible * ratio, 30); // mínimo 30px
  scrollThumb.style.height = thumbHeight + "px";

  // Actualizar posición según scroll actual
  const maxThumbTravel = visible - thumbHeight;
  const scrollRatio = scrollContainer.scrollTop / (total - visible);
  const thumbY = maxThumbTravel * scrollRatio;
  scrollThumb.style.transform = `translateY(${thumbY}px)`;
}

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
        <td class="py-2 px-3 text-center">${p.id}</td>
        <td class="py-2 px-3 text-center">${p.nombre}</td>
        <td class="py-2 px-3 text-center">${p.descripcion || ""}</td>
        <td class="py-2 px-3 text-center">${catNombre}</td>
        <td class="py-2 px-3 text-center">$${Number(p.precio || 0).toFixed(2)}</td>
        <td class="py-2 px-3 text-center">${p.stock ?? ""}</td>
        <td class="py-2 px-3 text-center">${p.destacado ? "Sí" : "No"}</td>

        <td class="py-2 px-3 text-center">${p.tipo_pieza || ""}</td>
        <td class="py-2 px-3 text-center">${p.material || ""}</td>
        <td class="py-2 px-3 text-center">${p.color_principal || ""}</td>
        <td class="py-2 px-3 text-center">${p.es_hipoalergenico ? "Sí" : "No"}</td>
        <td class="py-2 px-3 text-center">${p.es_ajustable ? "Sí" : "No"}</td>
        <td class="py-2 px-3 text-center">${p.largo_cm ?? ""}</td>
        <td class="py-2 px-3 text-center w-24">${p.activo ? "Sí" : "No"}</td>

        <td class="py-2 px-3 text-center w-32">
          <div class="flex gap-2 justify-center">
            <button class="btn-edit px-3 py-1 border rounded text-xs" data-id="${p.id}">
              Editar
            </button>
            <button class="btn-delete px-3 py-1 border border-red-400 text-red-600 rounded text-xs" data-id="${p.id}">
              Eliminar
            </button>
          </div>
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

    // 👉 actualizar barra personalizada
    updateCustomScrollbar();
  } catch (err) {
    console.error("Error en loadProductos:", err);
    setMessage("Error al cargar productos", "error");
  }
}

// ========= RELLENAR FORM PARA EDITAR =========
function editProducto(id, productos) {
  const p = productos.find((prod) => String(prod.id) === String(id));
  if (!p) return;

  const form = document.getElementById("productoForm");

  document.getElementById("prodId").value = p.id;
  document.getElementById("prodNombre").value = p.nombre || "";
  document.getElementById("prodDescripcion").value = p.descripcion || "";
  document.getElementById("prodPrecio").value = p.precio || "";
  document.getElementById("prodStock").value = p.stock ?? "";
  document.getElementById("prodCategoria").value =
    p.categoria_id || p.categoria || "";
  document.getElementById("prodDestacado").checked = !!p.destacado;

  // NUEVOS CAMPOS
  document.getElementById("prodTipoPieza").value = p.tipo_pieza || "";
  document.getElementById("prodMaterial").value = p.material || "";
  document.getElementById("prodColorPrincipal").value =
    p.color_principal || "";
  document.getElementById("prodHipoalergenico").checked =
    !!p.es_hipoalergenico;
  document.getElementById("prodAjustable").checked = !!p.es_ajustable;
  document.getElementById("prodLargoCm").value = p.largo_cm ?? "";
  document.getElementById("prodActivo").checked =
    p.activo === 0 ? false : true;
  // FIN NUEVOS CAMPOS

  // Guardamos la URL actual de la imagen (si tiene) para enviarla en el update
  form.dataset.currentImage =
    p.url_imagen || p.imagen_url || p.imagen || "";
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

  // Botón logout (por si luego lo agregas en el header)
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "/login";
    });
  }

  const form = document.getElementById("productoForm");
  const btnReset = document.getElementById("btnResetForm");

  // Conectar scroll personalizado
  scrollContainer = document.getElementById("scrollTablaProductos");
  scrollThumb = document.getElementById("scrollThumb");

  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", () => {
      updateCustomScrollbar();
    });
  }

  // Cargar combos y tabla
  loadCategoriasSelect();
  loadProductos();

  // Guardar producto (CREAR / EDITAR)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("prodId").value;

    const formData = new FormData();
    formData.append(
      "nombre",
      document.getElementById("prodNombre").value.trim()
    );
    formData.append(
      "descripcion",
      document.getElementById("prodDescripcion").value.trim()
    );
    formData.append(
      "precio",
      document.getElementById("prodPrecio").value || 0
    );
    formData.append(
      "categoria_id",
      document.getElementById("prodCategoria").value
    );
    formData.append(
      "stock",
      document.getElementById("prodStock").value || 0
    );
    formData.append(
      "destacado",
      document.getElementById("prodDestacado").checked ? "true" : "false"
    );

    // NUEVOS CAMPOS ENVIADOS AL BACKEND
    formData.append(
      "tipo_pieza",
      document.getElementById("prodTipoPieza").value.trim()
    );
    formData.append(
      "material",
      document.getElementById("prodMaterial").value.trim()
    );
    formData.append(
      "color_principal",
      document.getElementById("prodColorPrincipal").value.trim()
    );
    formData.append(
      "es_hipoalergenico",
      document.getElementById("prodHipoalergenico").checked ? "true" : "false"
    );
    formData.append(
      "es_ajustable",
      document.getElementById("prodAjustable").checked ? "true" : "false"
    );
    formData.append(
      "largo_cm",
      document.getElementById("prodLargoCm").value || 0
    );
    formData.append(
      "activo",
      document.getElementById("prodActivo").checked ? "true" : "false"
    );
    // FIN NUEVOS CAMPOS

    // Si estamos editando y ya había una imagen guardada, la mandamos
    if (form.dataset.currentImage) {
      formData.append("url_imagen", form.dataset.currentImage);
    }

    // Archivo de imagen (nuevo)
    const fileInput = document.getElementById("prodImagen");
    if (fileInput && fileInput.files.length > 0) {
      formData.append("imagen", fileInput.files[0]); // 👈 mismo nombre: "imagen"
    }

    const url = id
      ? `${API_BASE}/productos/${id}`
      : `${API_BASE}/productos`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...authHeader(), // NO ponemos Content-Type, fetch lo hace solo
        },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) return handleAuthError();
      if (!res.ok) {
        setMessage("No se pudo guardar el producto", "error");
        return;
      }

      setMessage("Producto guardado correctamente");
      form.reset();
      document.getElementById("prodId").value = "";
      delete form.dataset.currentImage;
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
    delete form.dataset.currentImage;
  });
});
