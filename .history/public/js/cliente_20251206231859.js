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
            src="${
  cat.url_imagen ||
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
    const res = await fetch(`${API_URL}/productos`);
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


// ========== INIT AL CARGAR ==========
document.addEventListener("DOMContentLoaded", () => {
  loadCategorias();
  loadProductosSlider();
  initUserMenu();
});
