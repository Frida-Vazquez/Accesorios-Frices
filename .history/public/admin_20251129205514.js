// public/admin.js

const API_BASE = "/api";
const TOKEN_KEY = "mt_token"; // puedes cambiar luego el nombre si quieres
const USER_KEY = "mt_user";

let clientes = [];
let categorias = [];
let productos = [];

function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }
  return { token, user };
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function authHeader() {
  const { token } = getSession();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  box.textContent = msg || "";
  box.classList.remove("error", "success");
  if (msg) box.classList.add(type);
}

function handleAuthError() {
  alert("Tu sesión ha expirado o no tienes permisos.");
  clearSession();
  window.location.href = "/";
}

// ===== Tabs =====
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const sectionId = btn.dataset.section;
      document
        .querySelectorAll(".admin-section")
        .forEach((sec) => sec.classList.remove("active"));
      document.getElementById(sectionId).classList.add("active");
    });
  });
}

// ===== Modales =====
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function initModalClose() {
  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => {
      el.closest(".modal").classList.add("hidden");
    });
  });
}

// ===== RENDER: CLIENTES =====
function renderClientes() {
  const tbody = document.getElementById("clientesTbody");
  tbody.innerHTML = "";

  if (!clientes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No hay clientes registrados.";
    tbody.appendChild(tr);
    tr.appendChild(td);
    return;
  }

  clientes.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.activo ? "Sí" : "No"}</td>
      <td>${c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</td>
      <td>
        <button class="btn-sm edit" data-action="edit-cliente" data-id="${c.id}">Editar</button>
        <button class="btn-sm delete" data-action="delete-cliente" data-id="${c.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== RENDER: CATEGORÍAS =====
function renderCategorias() {
  const tbody = document.getElementById("categoriasTbody");
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

  // combo de producto
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

// ===== RENDER: PRODUCTOS =====
function renderProductos() {
  const tbody = document.getElementById("productosTbody");
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
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoriaNombre || ""}</td>
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

// ===== LOADERS =====
async function loadClientes() {
  setMessage("Cargando clientes...");
  try {
    const res = await fetch(`${API_BASE}/clientes`, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    if (res.status === 401 || res.status === 403) return handleAuthError();
    if (!res.ok) throw new Error();
    const json = await res.json();
    clientes = json.data || [];
    renderClientes();
    setMessage("");
  } catch {
    setMessage("Error al cargar clientes", "error");
  }
}

async function loadCategorias() {
  try {
    const res = await fetch(`${API_BASE}/categorias`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    categorias = json.data || [];
    renderCategorias();
  } catch {
    setMessage("Error al cargar categorías", "error");
  }
}

async function loadProductos() {
  try {
    const res = await fetch(`${API_BASE}/productos`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    productos = json.data || [];
    renderProductos();
  } catch {
    setMessage("Error al cargar productos", "error");
  }
}

// ===== CRUD CLIENTES =====
function initClientesEvents() {
  document
    .getElementById("btnNuevoCliente")
    .addEventListener("click", () => openClienteModal());

  document
    .getElementById("clientesTbody")
    .addEventListener("click", async (e) => {
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
          const res = await fetch(`${API_BASE}/clientes/${id}`, {
            method: "DELETE",
            headers: authHeader(),
          });
          if (res.status === 401 || res.status === 403) return handleAuthError();
          if (!res.ok && res.status !== 204) throw new Error();
          setMessage("Cliente eliminado correctamente", "success");
          await loadClientes();
        } catch {
          setMessage("Error al eliminar cliente", "error");
        }
      }
    });

  document
    .getElementById("clienteForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("clienteId").value;
      const nombre = document.getElementById("clienteNombre").value.trim();
      const email = document.getElementById("clienteEmail").value.trim();
      const password = document.getElementById("clientePassword").value.trim();
      const activo = document.getElementById("clienteActivo").checked;

      const payload = { nombre, email, activo };

      if (id) {
        if (password) payload.password = password;
        try {
          const res = await fetch(`${API_BASE}/clientes/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
          if (res.status === 401 || res.status === 403) return handleAuthError();
          if (!res.ok) throw new Error();
          setMessage("Cliente actualizado", "success");
          closeModal("clienteModal");
          await loadClientes();
        } catch {
          setMessage("Error al actualizar cliente", "error");
        }
      } else {
        payload.password = password;
        try {
          const res = await fetch(`${API_BASE}/clientes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
          if (res.status === 401 || res.status === 403) return handleAuthError();
          if (!res.ok) throw new Error();
          setMessage("Cliente creado", "success");
          closeModal("clienteModal");
          await loadClientes();
        } catch {
          setMessage("Error al crear cliente", "error");
        }
      }
    });
}

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

// ===== CRUD CATEGORÍAS =====
function initCategoriasEvents() {
  document
    .getElementById("btnNuevaCategoria")
    .addEventListener("click", () => openCategoriaModal());

  document
    .getElementById("categoriasTbody")
    .addEventListener("click", async (e) => {
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
          const res = await fetch(`${API_BASE}/categorias/${id}`, {
            method: "DELETE",
            headers: {
              ...authHeader(),
            },
          });
          if (res.status === 401 || res.status === 403) return handleAuthError();
          if (!res.ok && res.status !== 204) throw new Error();
          setMessage("Categoría eliminada", "success");
          await loadCategorias();
          await loadProductos(); // por si había productos de esa categoría
        } catch {
          setMessage("Error al eliminar categoría", "error");
        }
      }
    });

  document
    .getElementById("categoriaForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("categoriaId").value;
      const nombre = document.getElementById("categoriaNombre").value.trim();
      const descripcion = document
        .getElementById("categoriaDescripcion")
        .value.trim();
      const activa = document.getElementById("categoriaActiva").checked;

      const payload = { nombre, descripcion, activa };

      try {
        let res;
        if (id) {
          res = await fetch(`${API_BASE}/categorias/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch(`${API_BASE}/categorias`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
        }

        if (res.status === 401 || res.status === 403) return handleAuthError();
        if (!res.ok) throw new Error();
        setMessage("Categoría guardada", "success");
        closeModal("categoriaModal");
        await loadCategorias();
        await loadProductos();
      } catch {
        setMessage("Error al guardar categoría", "error");
      }
    });
}

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

// ===== CRUD PRODUCTOS =====
function initProductosEvents() {
  document
    .getElementById("btnNuevoProducto")
    .addEventListener("click", () => openProductoModal());

  document
    .getElementById("productosTbody")
    .addEventListener("click", async (e) => {
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
          const res = await fetch(`${API_BASE}/productos/${id}`, {
            method: "DELETE",
            headers: {
              ...authHeader(),
            },
          });
          if (res.status === 401 || res.status === 403) return handleAuthError();
          if (!res.ok && res.status !== 204) throw new Error();
          setMessage("Producto eliminado", "success");
          await loadProductos();
        } catch {
          setMessage("Error al eliminar producto", "error");
        }
      }
    });

  document
    .getElementById("productoForm")
    .addEventListener("submit", async (e) => {
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
      const destacado = document.getElementById("productoDestacado").checked;
      const enOferta = document.getElementById("productoEnOferta").checked;

      const payload = {
        nombre,
        categoriaId,
        precio,
        stock,
        urlImagen: urlImagen || undefined,
        descripcion,
        activo,
        material: material || undefined,
        color: color || undefined,
        destacado,
        enOferta,
      };

      try {
        let res;
        if (id) {
          res = await fetch(`${API_BASE}/productos/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch(`${API_BASE}/productos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
          });
        }

        if (res.status === 401 || res.status === 403) return handleAuthError();
        if (!res.ok) throw new Error();
        setMessage("Producto guardado", "success");
        closeModal("productoModal");
        await loadProductos();
      } catch {
        setMessage("Error al guardar producto", "error");
      }
    });
}

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
    categoriaSelect.value = prod.categoriaId;
    precioInput.value = prod.precio;
    stockInput.value = prod.stock;
    urlInput.value = prod.urlImagen || "";
    descInput.value = prod.descripcion || "";
    activoInput.checked = !!prod.activo;
    materialInput.value = prod.material || "";
    colorInput.value = prod.color || "";
    destacadoInput.checked = !!prod.destacado;
    enOfertaInput.checked = !!prod.enOferta;
  } else {
    title.textContent = "Nuevo producto";
    idInput.value = "";
    nombreInput.value = "";
    if (categorias.length) {
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

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
  const { token, user } = getSession();

  if (!token || !user) {
    return (window.location.href = "/");
  }

  // Solo ADMIN puede entrar
  if (!user.roles || !user.roles.includes("ADMIN")) {
    alert("Solo usuarios ADMIN pueden acceder al panel.");
    return (window.location.href = "/");
  }

  // Mostrar nombre en header
  document.getElementById("adminUserName").textContent =
    user.nombre || user.email;

  initTabs();
  initModalClose();
  initClientesEvents();
  initCategoriasEvents();
  initProductosEvents();

  // Logout desde header
  document.getElementById("adminLogoutBtn").addEventListener("click", () => {
    clearSession();
    window.location.href = "/";
  });

  // Cargar datos iniciales (categorías primero para combos)
  await loadCategorias();
  await loadClientes();
  await loadProductos();
});
