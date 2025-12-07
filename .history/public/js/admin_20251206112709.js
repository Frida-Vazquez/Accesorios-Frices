// public/admin.js

// ================== CONFIG BÁSICA ==================
const API_BASE = "/api";
const TOKEN_KEY = "frices_token";

let clientes = [];
let categorias = [];
let productos = [];

// ================== SESIÓN / TOKEN ==================
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

// ================== MENSAJES ==================
function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;
  box.textContent = msg || "";
  box.classList.remove("error", "success");
  if (msg) {
    box.classList.add(type);
    setTimeout(() => {
      box.textContent = "";
      box.classList.remove("error", "success");
    }, 4000);
  }
}

function handleAuthError() {
  alert("Tu sesión ha expirado o no tienes permisos.");
  clearSession();
  window.location.href = "/";
}

// ================== TABS ==================
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".admin-section");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // quitar estado del resto
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // ocultar todas las secciones
      sections.forEach((sec) => sec.classList.add("hidden"));

      // mostrar la elegida
      const sectionId = btn.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.remove("hidden");
      }
    });
  });
}


// ================== MODALES ==================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
}

function initModalClose() {
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => {
      const modal = el.closest(".modal");
      if (modal) modal.classList.add("hidden");
    });
  });

  // Cerrar al hacer click en backdrop
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", () => {
      const modal = backdrop.closest(".modal");
      if (modal) modal.classList.add("hidden");
    });
  });
}

// ================== HELPERS FETCH ==================
async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!headers["Content-Type"] && options.method && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // puede no venir body
  }

  if (res.status === 401 || res.status === 403) {
    handleAuthError();
    throw new Error("No autorizado");
  }

  if (!res.ok) {
    const msg = data?.message || "Error en la petición";
    throw new Error(msg);
  }

  return data;
}

// ================== RENDER: CLIENTES ==================
function renderClientes() {
  const tbody = document.getElementById("clientesTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!clientes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No hay clientes registrados.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  clientes.forEach((c) => {
    const tr = document.createElement("tr");
    const created =
      c.created_at || c.createdAt
        ? new Date(c.created_at || c.createdAt).toLocaleString()
        : "";

    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.activo ? "Sí" : "No"}</td>
      <td>${created}</td>
      <td>
        <button class="btn-sm edit" data-action="edit-cliente" data-id="${c.id}">Editar</button>
        <button class="btn-sm delete" data-action="delete-cliente" data-id="${c.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ================== RENDER: CATEGORÍAS ==================
function renderCategorias() {
  const tbody = document.getElementById("categoriasTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!categorias.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No hay categorías registradas.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  categorias.forEach((cat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.nombre}</td>
      <td>${cat.descripcion || ""}</td>
      <td>${cat.activa ? "Sí" : "No"}</td>
      <td>
        <button class="btn-sm edit" data-action="edit-categoria" data-id="${cat.id}">Editar</button>
        <button class="btn-sm delete" data-action="delete-categoria" data-id="${cat.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Llenar combo de categorías para producto
  const select = document.getElementById("productoCategoria");
  if (select) {
    select.innerHTML = "";
    categorias
      .filter((c) => c.activa)
      .forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.nombre;
        select.appendChild(opt);
      });
  }
}

// ================== RENDER: PRODUCTOS ==================
function renderProductos() {
  const tbody = document.getElementById("productosTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!productos.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.textContent = "No hay productos registrados.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  productos.forEach((p) => {
    const categoriaNombre =
      p.categoriaNombre || p.categoria || p.nombre_categoria || p.categoria_id || "";

    const tr = document.createElement("tr"); // 👈 aquí faltaba el const
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${categoriaNombre}</td>
      <td>$${Number(p.precio).toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.activo ? "Sí" : "No"}</td>
      <td>
        <button class="btn-sm edit" data-action="edit-producto" data-id="${p.id}">Editar</button>
        <button class="btn-sm delete" data-action="delete-producto" data-id="${p.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// ================== LOADERS (GET) ==================
async function loadClientes() {
  try {
    const resp = await apiFetch("/clientes");
    clientes = Array.isArray(resp) ? resp : resp.data || [];
    renderClientes();
  } catch (err) {
    console.error(err);
    setMessage("Error al cargar clientes: " + err.message, "error");
  }
}

async function loadCategorias() {
  try {
    const resp = await apiFetch("/categorias");
    categorias = Array.isArray(resp) ? resp : resp.data || [];
    renderCategorias();
  } catch (err) {
    console.error(err);
    setMessage("Error al cargar categorías: " + err.message, "error");
  }
}

async function loadProductos() {
  try {
    const resp = await apiFetch("/productos");
    productos = Array.isArray(resp) ? resp : resp.data || [];
    renderProductos();
  } catch (err) {
    console.error(err);
    setMessage("Error al cargar productos: " + err.message, "error");
  }
}

// ================== CRUD CLIENTES ==================
function openClienteModal(cliente) {
  const title = document.getElementById("clienteModalTitle");
  const idInput = document.getElementById("clienteId");
  const nombreInput = document.getElementById("clienteNombre");
  const emailInput = document.getElementById("clienteEmail");
  const passwordInput = document.getElementById("clientePassword");
  const activoInput = document.getElementById("clienteActivo");

  if (cliente) {
    title.textContent = "Editar cliente";
    idInput.value = cliente.id;
    nombreInput.value = cliente.nombre;
    emailInput.value = cliente.email;
    passwordInput.value = "";
    activoInput.checked = !!cliente.activo;
  } else {
    title.textContent = "Nuevo cliente";
    idInput.value = "";
    nombreInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    activoInput.checked = true;
  }

  openModal("clienteModal");
}

function initClientesEvents() {
  const btnNuevoCliente = document.getElementById("btnNuevoCliente");
  const tbody = document.getElementById("clientesTbody");
  const form = document.getElementById("clienteForm");

  if (btnNuevoCliente) {
    btnNuevoCliente.addEventListener("click", () => openClienteModal());
  }

  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === "edit-cliente") {
        const c = clientes.find((x) => x.id === id);
        if (c) openClienteModal(c);
      } else if (action === "delete-cliente") {
        if (!confirm("¿Eliminar este cliente?")) return;
        try {
          await apiFetch(`/clientes/${id}`, { method: "DELETE" });
          setMessage("Cliente eliminado correctamente", "success");
          await loadClientes();
        } catch (err) {
          setMessage("Error al eliminar cliente: " + err.message, "error");
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("👉 Enviando producto desde el formulario");
      const id = document.getElementById("clienteId").value;
      const nombre = document.getElementById("clienteNombre").value.trim();
      const email = document.getElementById("clienteEmail").value.trim();
      const password = document.getElementById("clientePassword").value.trim();
      const activo = document.getElementById("clienteActivo").checked;

      if (!nombre || !email) {
        setMessage("Nombre y correo son obligatorios", "error");
        return;
      }

      const payload = { nombre, email, activo };

      try {
        if (id) {
          // actualizar
          if (password) payload.password = password;
          await apiFetch(`/clientes/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setMessage("Cliente actualizado", "success");
        } else {
          // crear nuevo — contraseña obligatoria
          if (!password) {
            setMessage("La contraseña es obligatoria para un nuevo cliente", "error");
            return;
          }
          payload.password = password;
          await apiFetch("/clientes", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          setMessage("Cliente creado", "success");
        }

        closeModal("clienteModal");
        await loadClientes();
      } catch (err) {
        console.error(err);
        setMessage("Error al guardar cliente: " + err.message, "error");
      }
    });
  }
}

// ================== CRUD CATEGORÍAS ==================
function openCategoriaModal(cat) {
  const title = document.getElementById("categoriaModalTitle");
  const idInput = document.getElementById("categoriaId");
  const nombreInput = document.getElementById("categoriaNombre");
  const descInput = document.getElementById("categoriaDescripcion");
  const activaInput = document.getElementById("categoriaActiva");

  if (cat) {
    title.textContent = "Editar categoría";
    idInput.value = cat.id;
    nombreInput.value = cat.nombre;
    descInput.value = cat.descripcion || "";
    activaInput.checked = !!cat.activa;
  } else {
    title.textContent = "Nueva categoría";
    idInput.value = "";
    nombreInput.value = "";
    descInput.value = "";
    activaInput.checked = true;
  }

  openModal("categoriaModal");
}

function initCategoriasEvents() {
  const btnNuevaCategoria = document.getElementById("btnNuevaCategoria");
  const tbody = document.getElementById("categoriasTbody");
  const form = document.getElementById("categoriaForm");

  if (btnNuevaCategoria) {
    btnNuevaCategoria.addEventListener("click", () => openCategoriaModal());
  }

  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === "edit-categoria") {
        const cat = categorias.find((x) => x.id === id);
        if (cat) openCategoriaModal(cat);
      } else if (action === "delete-categoria") {
        if (!confirm("¿Eliminar esta categoría?")) return;
        try {
          await apiFetch(`/categorias/${id}`, { method: "DELETE" });
          setMessage("Categoría eliminada", "success");
          await loadCategorias();
          await loadProductos(); // por si afecta productos
        } catch (err) {
          setMessage("Error al eliminar categoría: " + err.message, "error");
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("categoriaId").value;
      const nombre = document.getElementById("categoriaNombre").value.trim();
      const descripcion = document
        .getElementById("categoriaDescripcion")
        .value.trim();
      const activa = document.getElementById("categoriaActiva").checked;

      if (!nombre) {
        setMessage("El nombre de la categoría es obligatorio", "error");
        return;
      }

      const payload = { nombre, descripcion, activa };

      try {
        if (id) {
          await apiFetch(`/categorias/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setMessage("Categoría actualizada", "success");
        } else {
          await apiFetch("/categorias", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          setMessage("Categoría creada", "success");
        }
        closeModal("categoriaModal");
        await loadCategorias();
        await loadProductos();
      } catch (err) {
        console.error(err);
        setMessage("Error al guardar categoría: " + err.message, "error");
      }
    });
  }
}

// ================== CRUD PRODUCTOS ==================
function openProductoModal(prod) {
  const title = document.getElementById("productoModalTitle");
  const idInput = document.getElementById("productoId");
  const nombreInput = document.getElementById("productoNombre");
  const categoriaSelect = document.getElementById("productoCategoria");
  const precioInput = document.getElementById("productoPrecio");
  const stockInput = document.getElementById("productoStock");
  const urlInput = document.getElementById("productoUrlImagen");
  const descInput = document.getElementById("productoDescripcion");
  const activoInput = document.getElementById("productoActivo");
  const materialInput = document.getElementById("productoMaterial");
  const colorInput = document.getElementById("productoColor");
  const destacadoInput = document.getElementById("productoDestacado");
  const enOfertaInput = document.getElementById("productoEnOferta");

  if (prod) {
    title.textContent = "Editar producto";
    idInput.value = prod.id;
    nombreInput.value = prod.nombre;
    categoriaSelect.value =
      prod.categoria_id || prod.categoriaId || prod.categoria || "";
    precioInput.value = prod.precio;
    stockInput.value = prod.stock;
    urlInput.value = prod.url_imagen || prod.urlImagen || "";
    descInput.value = prod.descripcion || "";
    activoInput.checked = !!prod.activo;
    materialInput.value = prod.material || "";
    colorInput.value = prod.color_principal || prod.color || "";
    destacadoInput.checked = !!prod.destacado;
    enOfertaInput.checked = !!prod.en_oferta || !!prod.enOferta;
  } else {
    title.textContent = "Nuevo producto";
    idInput.value = "";
    nombreInput.value = "";
    if (categorias.length && categoriaSelect) {
      categoriaSelect.value = categorias[0].id;
    }
    precioInput.value = "";
    stockInput.value = "0";
    urlInput.value = "";
    descInput.value = "";
    activoInput.checked = true;
    materialInput.value = "";
    colorInput.value = "";
    destacadoInput.checked = false;
    enOfertaInput.checked = false;
  }

  openModal("productoModal");
}

function initProductosEvents() {
  const btnNuevoProducto = document.getElementById("btnNuevoProducto");
  const tbody = document.getElementById("productosTbody");
  const form = document.getElementById("productoForm");

  if (btnNuevoProducto) {
    btnNuevoProducto.addEventListener("click", () => openProductoModal());
  }

  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === "edit-producto") {
        const p = productos.find((x) => x.id === id);
        if (p) openProductoModal(p);
      } else if (action === "delete-producto") {
        if (!confirm("¿Eliminar este producto?")) return;
        try {
          await apiFetch(`/productos/${id}`, { method: "DELETE" });
          setMessage("Producto eliminado", "success");
          await loadProductos();
        } catch (err) {
          setMessage("Error al eliminar producto: " + err.message, "error");
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("productoId").value;
      const nombre = document.getElementById("productoNombre").value.trim();
      const categoriaId = Number(
        document.getElementById("productoCategoria").value
      );
      const precio = Number(
        document.getElementById("productoPrecio").value || 0
      );
      const stock = Number(
        document.getElementById("productoStock").value || 0
      );
      const urlImagen = document
        .getElementById("productoUrlImagen")
        .value.trim();
      const descripcion = document
        .getElementById("productoDescripcion")
        .value.trim();
      const activo = document.getElementById("productoActivo").checked;
      const material = document
        .getElementById("productoMaterial")
        .value.trim();
      const color = document.getElementById("productoColor").value.trim();
      // (destacado y oferta solo en UI por ahora)
      // const destacado = document.getElementById("productoDestacado").checked;
      // const enOferta = document.getElementById("productoEnOferta").checked;

      if (!nombre || !categoriaId || isNaN(precio)) {
        setMessage(
          "Nombre, categoría y precio son campos obligatorios para un producto",
          "error"
        );
        return;
      }

      const payload = {
        nombre,
        categoria_id: categoriaId,
        precio,
        stock,
        url_imagen: urlImagen || null,
        descripcion,
        activo,
        material: material || null,
        color_principal: color || null,
      };

      try {
        if (id) {
          await apiFetch(`/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setMessage("Producto actualizado", "success");
        } else {
          await apiFetch("/productos", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          setMessage("Producto creado", "success");
        }
        closeModal("productoModal");
        await loadProductos();
      } catch (err) {
        console.error(err);
        setMessage("Error al guardar producto: " + err.message, "error");
      }
    });
  }
}

// ================== INIT PRINCIPAL ==================
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    alert("Debes iniciar sesión para acceder al panel de administración.");
    window.location.href = "/";
    return;
  }

  // Validar sesión y roles
  try {
    const data = await apiFetch("/auth/validate", { method: "GET" });
    const user = data.user || {};
    const roles = Array.isArray(user.roles) ? user.roles : [];

    if (!roles.includes("ADMIN")) {
      alert("Solo usuarios ADMIN pueden acceder al panel.");
      window.location.href = "/";
      return;
    }

    const headerUser = document.getElementById("adminUserName");
    if (headerUser) {
      headerUser.textContent = user.nombre || user.email || "Admin";
    }
  } catch (err) {
    console.error(err);
    // apiFetch ya maneja 401/403 con handleAuthError
    return;
  }

  // Botón logout en header
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "/";
    });
  }

  initTabs();
  initModalClose();
  initClientesEvents();
  initCategoriasEvents();
  initProductosEvents();

  // Cargar datos iniciales
  await loadCategorias();
  await loadClientes();
  await loadProductos();
});
