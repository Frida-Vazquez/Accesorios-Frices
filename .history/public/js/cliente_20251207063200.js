// public/js/cliente.js
// public/cliente/cliente.js

const API_URL = "/api";

// Usamos el mismo token que el login/admin:
const CLIENTE_TOKEN_KEY = "frices_token";
const CLIENTE_NOMBRE_KEY = "cliente_nombre";


// ================== SESIÓN CLIENTE ==================
function getClienteToken() {
  return localStorage.getItem(CLIENTE_TOKEN_KEY);
}

function getClienteNombre() {
  return localStorage.getItem(CLIENTE_NOMBRE_KEY);
}

function clearClienteSession() {
  localStorage.removeItem(CLIENTE_TOKEN_KEY);
  localStorage.removeItem(CLIENTE_NOMBRE_KEY);
  localStorage.removeItem("cliente_token"); // por si acaso
}

function authHeader() {
  const token = getClienteToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// ================== HELPER RESPUESTAS ==================
function parseData(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}


// ================== CARGAR CATEGORÍAS ==================
// Función para generar un slug a partir del nombre
function slugify(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, "-")            // espacios -> guiones
    .replace(/[^a-z0-9\-]/g, "");    // quita caracteres raros
}

// ================== CARGAR CATEGORÍAS ==================
async function loadCategorias() {
  const grid = document.getElementById("categoriasGrid");
  if (!grid) return;

  try {
    const resp = await fetch(`${API_URL}/categorias`);
    const data = await resp.json();

    grid.innerHTML = "";

    data.forEach((cat) => {
      const slug = cat.slug || slugify(cat.nombre);

      const article = document.createElement("article");
      article.className =
        "bg-white rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition";

      article.addEventListener("click", () => {
        window.location.href = `/collections/${slug}`;
      });

      article.innerHTML = `
        <div class="w-full aspect-[4/5] overflow-hidden">
          <img
            src="${cat.url_imagen ||
        cat.imagen_url ||
        cat.imagen ||
        cat.foto ||
        "https://via.placeholder.com/600x800?text=Categoria"
        }"
            alt="${cat.nombre}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="bg-white text-center py-3 text-xs md:text-sm font-semibold tracking-wide text-gray-800">
          ${cat.nombre.toUpperCase()}
        </div>
      `;

      grid.appendChild(article);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <p class="col-span-full text-gray-600">
        No se pudieron cargar las categorías.
      </p>`;
  }
}


// ================== INICIO ==================
window.addEventListener("DOMContentLoaded", () => {
  // aquí ya haces lo que tenías (saludo, user, etc.)
  loadCategorias(); // 👈 asegúrate de llamarla
});

// ========== SLIDER DE PRODUCTOS DESDE LA BD ==========
let productosSlider = [];
let prodIndex = 0;
let prodInterval = null;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderProductoSlide() {
  if (!productosSlider.length) return;

  const prod = productosSlider[prodIndex];

  const nombre = prod.nombre || "Producto destacado";
  const desc = prod.descripcion || "Descubre esta pieza seleccionada especialmente para ti.";
  const imagen =
    prod.imagen_url || prod.imagen || prod.foto || "https://via.placeholder.com/800x800?text=Producto";

  const precio =
    prod.precio != null ? `$${Number(prod.precio).toFixed(2)} MXN` : "";

  const catNombre = prod.categoria_nombre || prod.categoria || "Selección Frices";

  const catEl = document.getElementById("prodCategoria");
  const nomEl = document.getElementById("prodNombre");
  const descEl = document.getElementById("prodDescripcion");
  const imgEl = document.getElementById("prodImagen");
  const precioEl = document.getElementById("prodPrecio");
  const dotsContainer = document.getElementById("prodDots");

  if (catEl) catEl.textContent = catNombre;
  if (nomEl) nomEl.textContent = nombre;
  if (descEl) descEl.textContent = desc;
  if (precioEl) precioEl.textContent = precio;

  if (imgEl) {
    imgEl.src = imagen;
    imgEl.alt = nombre;
  }

  // Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    productosSlider.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className =
        "w-2 h-2 rounded-full " +
        (i === prodIndex ? "bg-[#8a555b]" : "bg-gray-300");

      dot.addEventListener("click", () => {
        prodIndex = i;
        renderProductoSlide();
        resetProdInterval();
      });

      dotsContainer.appendChild(dot);
    });
  }
}

function resetProdInterval() {
  if (prodInterval) clearInterval(prodInterval);

  if (!productosSlider.length) return;

  prodInterval = setInterval(() => {
    prodIndex = (prodIndex + 1) % productosSlider.length;
    renderProductoSlide();
  }, 5000);
}

async function loadProductosSlider() {
  try {
    const res = await fetch(`${API_URL}/productos/public`);
    const json = await res.json();
    const productos = parseData(json);

    if (!productos.length) {
      console.warn("No hay productos para el slider");
      return;
    }

    productosSlider = shuffle(productos);
    prodIndex = 0;

    renderProductoSlide();
    resetProdInterval();

    // Botones
    const btnPrev = document.getElementById("prodPrev");
    const btnNext = document.getElementById("prodNext");
    const verBtn = document.getElementById("prodVerBtn");
    const agregarBtn = document.getElementById("prodAgregarBtn");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        prodIndex =
          (prodIndex - 1 + productosSlider.length) % productosSlider.length;
        renderProductoSlide();
        resetProdInterval();
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        prodIndex = (prodIndex + 1) % productosSlider.length;
        renderProductoSlide();
        resetProdInterval();
      });
    }

    if (verBtn) {
      verBtn.addEventListener("click", () => {
        const prod = productosSlider[prodIndex];
        alert("Aquí iría la vista detalle del producto ID " + prod.id);
      });
    }

    if (agregarBtn) {
      agregarBtn.addEventListener("click", () => {
        const prod = productosSlider[prodIndex];
        alert("Aquí agregarías al carrito el producto ID " + prod.id);
      });
    }
  } catch (err) {
    console.error("Error cargando productos slider:", err);
  }
}


// ========== MENÚ DEL USUARIO (CLIENTE) ==========
function initUserMenu() {
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userMenu = document.getElementById("userMenu");
  const userNameText = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutClienteBtn");
  const userGreeting = document.getElementById("userGreeting");

  if (!userMenuBtn || !userMenu || !userNameText || !logoutBtn) return;

  const token = getClienteToken();
  const nombreCompleto = getClienteNombre();

  // SIN SESIÓN
  if (!token) {
    if (userGreeting) userGreeting.textContent = "";

    userMenuBtn.addEventListener("click", () => {
      window.location.href = "/static/auth/login.html";
    });

    return;
  }

  // CON SESIÓN
  if (nombreCompleto) {
    const primerNombre = nombreCompleto.split(" ")[0];
    if (userGreeting) userGreeting.textContent = `Hola, ${primerNombre}`;
    userNameText.textContent = nombreCompleto;
  } else {
    userNameText.textContent = "Mi cuenta";
  }

  // Abrir/cerrar menú
  userMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });

  logoutBtn.addEventListener("click", () => {
    clearClienteSession();
    window.location.href = "/static/cliente/cliente.html";
  });
}

// ========== CARRITO - PANEL LATERAL ==================

// Abrir / cerrar panel
function openCart() {
  document.getElementById("cartOverlay")?.classList.remove("hidden");
  document.getElementById("cartPanel")?.classList.remove("hidden");
  cargarCarrito(); // cada vez que abres, refresca
}

function closeCart() {
  document.getElementById("cartOverlay")?.classList.add("hidden");
  document.getElementById("cartPanel")?.classList.add("hidden");
}

// Cargar carrito desde la API
async function cargarCarrito() {
  try {
    const resp = await fetch(`${API_URL}/carrito`, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("Error al obtener carrito");

    const data = await resp.json();
    renderCart(data);
  } catch (e) {
    console.error(e);
    const cont = document.getElementById("cartItems");
    if (cont) cont.innerHTML = "<p>No se pudo cargar el carrito.</p>";
  }
}

function renderCart(data) {
  const cont = document.getElementById("cartItems");
  const totalSpan = document.getElementById("cartTotal");
  const badge = document.getElementById("cartCount");

  if (!cont || !totalSpan || !badge) return;

  cont.innerHTML = "";

  if (!data || !data.items || data.items.length === 0) {
    cont.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalSpan.textContent = "$0.00";
    badge.textContent = "0";
    return;
  }

  let total = 0;
  let cantidadTotal = 0;

  data.items.forEach((item) => {
    const subtotal = item.cantidad * item.precio_unitario;
    total += subtotal;
    cantidadTotal += item.cantidad;

    const div = document.createElement("div");
    div.className = "flex gap-3 items-center";

    div.innerHTML = `
      <img src="${item.producto_imagen || "/static/assets/placeholder.png"}"
           class="w-16 h-16 object-cover rounded-md border" />

      <div class="flex-1">
        <p class="font-medium">${item.producto_nombre}</p>
        <p class="text-sm text-gray-500">Cantidad: ${item.cantidad}</p>
        <p class="text-sm text-gray-500">Precio: $${item.precio_unitario}</p>
        <p class="text-sm font-semibold mt-1">Subtotal: $${subtotal.toFixed(2)}</p>
      </div>

      <button class="text-red-600 text-sm"
              onclick="eliminarItemCarrito(${item.id})">
        🗑
      </button>
    `;

    cont.appendChild(div);
  });

  totalSpan.textContent = `$${total.toFixed(2)}`;
  badge.textContent = cantidadTotal;
}

async function eliminarItemCarrito(itemId) {
  try {
    const resp = await fetch(`${API_URL}/carrito/item/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("Error al eliminar producto");

    await cargarCarrito();
  } catch (e) {
    console.error(e);
    alert("No se pudo eliminar el producto.");
  }
}

async function checkoutCarrito() {
  try {
    const resp = await fetch(`${API_URL}/carrito/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("Error en checkout");

    const data = await resp.json();
    alert("Compra realizada con éxito ✨");
    console.log("Pedido:", data);
    cargarCarrito();
  } catch (e) {
    console.error(e);
    alert("No se pudo finalizar la compra.");
  }
}

// Agregar producto al carrito (lo usarás desde el slider y desde las tarjetas)
async function agregarAlCarrito(productoId) {
  if (!getClienteToken()) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/carrito/agregar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ productoId, cantidad: 1 }),
    });

    if (!resp.ok) throw new Error("No se pudo agregar al carrito");

    const data = await resp.json();
    alert("Producto agregado al carrito ✨");
    renderCart(data); // actualiza panel y numerito
  } catch (e) {
    console.error(e);
    alert("Ocurrió un error al agregar al carrito.");
  }
}






// ================== FAVORITOS - CONTADOR NAVBAR ==================
function getFavoritosLS() {
  try {
    const raw = localStorage.getItem("frices_favoritos");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function updateFavCountBadge() {
  const badge = document.getElementById("favCount");
  if (!badge) return;

  const favs = getFavoritosLS();
  const total = favs.length;

  badge.textContent = total;

  if (total > 0) {
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

// si cambian los favoritos desde otra pestaña, actualizamos también
window.addEventListener("storage", (e) => {
  if (e.key === "frices_favoritos") {
    updateFavCountBadge();
  }
});


// ========== INIT AL CARGAR ==========
document.addEventListener("DOMContentLoaded", () => {
  loadCategorias();
  loadProductosSlider();
  initUserMenu();
  updateFavCountBadge();
});
