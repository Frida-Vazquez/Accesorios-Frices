// public/js/carrito.js

const API_URL = "/api";
const CARRITO_KEY = "frices_carrito";
const CLIENTE_TOKEN_KEY = "frices_token";

/* ================== HELPERS LOCALSTORAGE ================== */

function getCarritoLS() {
  try {
    const raw = localStorage.getItem(CARRITO_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveCarritoLS(items) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  updateCartCountBadge();
}

/* ================== BADGE DEL ICONO 🛒 ================== */

function updateCartCountBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const carrito = getCarritoLS();
  const total = carrito.reduce((acc, it) => acc + (it.cantidad || 0), 0);

  if (!total) {
    badge.textContent = "0";
    badge.classList.add("hidden");
  } else {
    badge.textContent = String(total);
    badge.classList.remove("hidden");
  }
}

/* ================== AGREGAR AL CARRITO (GLOBAL) ================== */

function agregarAlCarrito(productoId, cantidad = 1) {
  const token = localStorage.getItem(CLIENTE_TOKEN_KEY);
  if (!token) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    window.location.href = "/static/auth/login.html"; // ajusta si tu login está en otro lado
    return;
  }

  let carrito = getCarritoLS();
  const idx = carrito.findIndex((it) => it.productoId === productoId);

  if (idx >= 0) {
    carrito[idx].cantidad += cantidad;
  } else {
    carrito.push({ productoId, cantidad });
  }

  saveCarritoLS(carrito);
  alert("Producto agregado al carrito.");
}

/* ================== PARSE DATA (IGUAL QUE EN CLIENTE) ================== */

function parseDataCarrito(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  if (resp && Array.isArray(resp.items)) return resp.items;
  return [];
}

/* ================== RENDER DE LA PÁGINA CARRITO ================== */

async function renderCarritoPage() {
  const grid = document.getElementById("gridCarrito");
  if (!grid) {
    // No estamos en carrito.html, solo actualiza badge
    updateCartCountBadge();
    return;
  }

  const totalSpan = document.getElementById("totalCarrito");
  const msgVacio = document.getElementById("msgCarritoVacio");

  const carrito = getCarritoLS();

  if (!carrito.length) {
    grid.innerHTML = "";
    if (msgVacio) msgVacio.classList.remove("hidden");
    if (totalSpan) totalSpan.textContent = "$0.00 MXN";
    updateCartCountBadge();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/productos/public`);
    const raw = await res.json();
    if (!res.ok) throw new Error("No se pudieron cargar productos.");

    const productos = parseDataCarrito(raw);
    const mapa = {};
    productos.forEach((p) => {
      mapa[p.id] = p;
    });

    grid.innerHTML = "";
    if (msgVacio) msgVacio.classList.add("hidden");

    let total = 0;

    carrito.forEach((item) => {
      const prod = mapa[item.productoId];
      if (!prod) return;

      const imgSrc =
        prod.url_imagen ||
        prod.imagen_url ||
        prod.imagen ||
        prod.foto ||
        "/static/assets/no-image.png";

      const precioNum = Number(prod.precio || 0);
      const subtotal = precioNum * item.cantidad;
      total += subtotal;

      const card = document.createElement("article");
      card.className =
        "bg-white rounded-3xl shadow-sm overflow-hidden flex gap-4 p-4 items-center";

      card.innerHTML = `
        <div class="w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl">
          <img src="${imgSrc}" alt="${prod.nombre}"
            class="w-full h-full object-cover" />
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold mb-1 line-clamp-2">
            ${prod.nombre}
          </h3>
          <p class="text-xs text-gray-500 mb-1 line-clamp-2">
            ${prod.descripcion || ""}
          </p>
          <p class="text-xs text-gray-600 mb-2">
            Precio unitario: $${precioNum.toFixed(2)} MXN
          </p>
          <div class="flex items-center gap-3 text-xs">
            <button data-accion="menos" data-id="${item.productoId}"
              class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
              -
            </button>
            <span class="font-semibold" data-cant="${item.productoId}">
              ${item.cantidad}
            </span>
            <button data-accion="mas" data-id="${item.productoId}"
              class="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
              +
            </button>
            <button data-accion="eliminar" data-id="${item.productoId}"
              class="ml-4 text-red-500 hover:underline">
              Quitar
            </button>
          </div>
        </div>
        <div class="text-right text-sm font-bold">
          $${subtotal.toFixed(2)} MXN
        </div>
      `;

      grid.appendChild(card);
    });

    if (totalSpan) totalSpan.textContent = `$${total.toFixed(2)} MXN`;
    updateCartCountBadge();

    // eventos de +, -, quitar
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-accion]");
      if (!btn) return;

      const accion = btn.dataset.accion;
      const id = Number(btn.dataset.id);
      let carritoAct = getCarritoLS();
      const idx = carritoAct.findIndex((it) => it.productoId === id);
      if (idx < 0) return;

      if (accion === "mas") {
        carritoAct[idx].cantidad += 1;
      } else if (accion === "menos") {
        carritoAct[idx].cantidad -= 1;
        if (carritoAct[idx].cantidad <= 0) {
          carritoAct.splice(idx, 1);
        }
      } else if (accion === "eliminar") {
        carritoAct.splice(idx, 1);
      }

      saveCarritoLS(carritoAct);
      renderCarritoPage(); // recarga vista
    });
  } catch (err) {
    console.error("Error al cargar carrito:", err);
    grid.innerHTML = `
      <p class="col-span-full text-red-600 text-sm">
        Ocurrió un error al cargar tu carrito.
      </p>`;
    if (totalSpan) totalSpan.textContent = "$0.00 MXN";
  }
}

/* ================== PAGO (SIMULADO) ================== */

function initPagoCarrito() {
  const btnPagar = document.getElementById("btnPagar");
  if (!btnPagar) return;

  btnPagar.addEventListener("click", () => {
    const carrito = getCarritoLS();
    if (!carrito.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Aquí en un futuro puedes integrar stripe, mercado pago, etc.
    alert("¡Gracias por tu compra! Nos pondremos en contacto contigo.");
    saveCarritoLS([]);
    renderCarritoPage();
  });
}

/* ================== INIT ================== */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCountBadge();
  renderCarritoPage();
  initPagoCarrito();
});

// Si se modifica el carrito desde otra pestaña:
window.addEventListener("storage", (e) => {
  if (e.key === CARRITO_KEY) {
    updateCartCountBadge();
  }
});
