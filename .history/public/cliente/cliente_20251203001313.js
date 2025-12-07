// public/js/cliente.js

// ================== CONFIG BÁSICA ==================
const API_URL = "/api";

// Claves para sesión del CLIENTE (distinta del admin)
const CLIENTE_TOKEN_KEY = "cliente_token";
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
}

// ================== HELPER RESPUESTAS ==================
function parseData(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

// ========== CARGAR CATEGORÍAS DESDE LA BD ==========
async function loadCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const json = await res.json();
    const categorias = parseData(json);

    const grid = document.getElementById("categoriasGrid");
    if (!grid) return;
    grid.innerHTML = "";

    if (categorias.length === 0) {
      grid.innerHTML = `<p class="col-span-4 text-center text-sm text-gray-500">
        Aún no hay categorías disponibles.
      </p>`;
      return;
    }

    categorias.forEach((cat) => {
      const card = document.createElement("article");
      card.className =
        "flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer";

      const imagen =
        cat.imagen_url ||
        cat.imagen ||
        cat.foto ||
        "https://via.placeholder.com/400x500?text=Categoria";

      card.innerHTML = `
        <div class="w-full aspect-[4/5] overflow-hidden">
          <img
            src="${imagen}"
            alt="${cat.nombre || "Categoría"}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="py-4 text-center text-sm text-gray-700">
          ${cat.nombre || "Sin nombre"}
        </div>
      `;

      // Ejemplo para redirigir a productos por categoría:
      // card.addEventListener("click", () => {
      //   window.location.href = "/tienda.html?categoria=" + cat.id;
      // });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
}
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
  const desc =
    prod.descripcion ||
    "Descubre esta pieza seleccionada especialmente para ti.";
  const imagen =
    prod.imagen_url ||
    prod.imagen ||
    prod.foto ||
    "https://via.placeholder.com/800x800?text=Producto";
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
  }, 5000); // cambia cada 5 segundos
}

async function loadProductosSlider() {
  try {
    const res = await fetch(`${API_URL}/productos`);
    const json = await res.json();
    const productos = parseData(json);

    if (!productos.length) {
      console.warn("No hay productos para el slider");
      return;
    }

    // Baraja los productos para que salgan al azar
    productosSlider = shuffle(productos);
    prodIndex = 0;
    renderProductoSlide();
    resetProdInterval();

    // Botones siguiente / anterior
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
        // window.location.href = "/producto.html?id=" + prod.id;
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

  if (!userMenuBtn || !userMenu || !userNameText || !logoutBtn) return;

  const token = getClienteToken();
  const nombre = getClienteNombre();

  // Si NO hay sesión → el icono lleva al login
  if (!token) {
    userMenuBtn.addEventListener("click", () => {
      // Ajusta esta ruta al HTML de login/registro de clientes
      window.location.href = "/static/index.html";
    });
    // No mostramos menú (se queda hidden)
    return;
  }

  // Si hay sesión → mostramos menú con el nombre del cliente
  userNameText.textContent = nombre || "Mi cuenta";

  // Abrir/cerrar menú
  userMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
  });

  // Cerrar menú si hace click fuera
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });

  // Cerrar sesión
  logoutBtn.addEventListener("click", () => {
    clearClienteSession();
    // Después de cerrar sesión puedes mandarlo al login o al inicio
    window.location.href = "/static/index.html"; // o "/"
  });
}

// ========== INIT AL CARGAR LA PÁGINA ==========
document.addEventListener("DOMContentLoaded", () => {
  loadCategorias();
  loadProductosSlider();
  initUserMenu();

});
