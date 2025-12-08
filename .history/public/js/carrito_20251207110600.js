// public/js/carrito.js

const API_URL = "/api";
const CLIENTE_TOKEN_KEY = "frices_token";

function getClienteToken() {
  return localStorage.getItem(CLIENTE_TOKEN_KEY);
}

function authHeader() {
  const token = getClienteToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const carritoVacioEl = document.getElementById("carritoVacio");
const carritoContenidoEl = document.getElementById("carritoContenido");
const listaItemsEl = document.getElementById("listaItems");
const subtotalTextoEl = document.getElementById("subtotalTexto");
const btnPagar = document.getElementById("btnPagar");
const btnVaciar = document.getElementById("btnVaciar");

function renderCarrito(data) {
  const { items = [], total = 0 } = data || {};

  if (!items.length) {
    carritoVacioEl.classList.remove("hidden");
    carritoContenidoEl.classList.add("hidden");
    return;
  }

  carritoVacioEl.classList.add("hidden");
  carritoContenidoEl.classList.remove("hidden");

  listaItemsEl.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("article");
    row.className =
      "flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0";

    const imgSrc =
      item.urlImagen ||
      "/static/assets/no-image.png";

    row.innerHTML = `
      <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img src="${imgSrc}" alt="${item.nombre}"
             class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="text-sm font-semibold">${item.nombre}</h3>
            <p class="text-xs text-gray-500 line-clamp-2">
              ${item.descripcion || ""}
            </p>
          </div>
          <button
            type="button"
            class="text-xs text-gray-400 hover:text-red-500"
            data-remove="${item.productoId}"
          >
            ✕
          </button>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2 text-xs">
            <button
              type="button"
              class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              data-minus="${item.productoId}"
            >-</button>
            <span class="w-8 text-center">${item.cantidad}</span>
            <button
              type="button"
              class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              data-plus="${item.productoId}"
            >+</button>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">
              $${Number(item.precioUnitario).toFixed(2)} c/u
            </p>
            <p class="text-sm font-semibold">
              $${Number(item.subtotal).toFixed(2)} MXN
            </p>
          </div>
        </div>
      </div>
    `;

    listaItemsEl.appendChild(row);
  });

  subtotalTextoEl.textContent = `$${Number(total).toFixed(2)} MXN`;

  // Eventos plus / minus / remove
  listaItemsEl.querySelectorAll("[data-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productoId = Number(btn.getAttribute("data-plus"));
      const item = data.items.find((i) => i.productoId === productoId);
      if (!item) return;
      actualizarCantidad(productoId, item.cantidad + 1);
    });
  });

  listaItemsEl.querySelectorAll("[data-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productoId = Number(btn.getAttribute("data-minus"));
      const item = data.items.find((i) => i.productoId === productoId);
      if (!item) return;
      actualizarCantidad(productoId, item.cantidad - 1);
    });
  });

  listaItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productoId = Number(btn.getAttribute("data-remove"));
      eliminarItem(productoId);
    });
  });
}

async function cargarCarrito() {
  if (!getClienteToken()) {
    carritoVacioEl.classList.remove("hidden");
    carritoContenidoEl.classList.add("hidden");
    return;
  }

  try {
    const resp = await fetch(`${API_URL}/carrito`, {
      headers: {
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("No se pudo cargar el carrito.");
    const data = await resp.json();
    renderCarrito(data);
  } catch (err) {
    console.error("Error al cargar carrito:", err);
    carritoVacioEl.classList.remove("hidden");
    carritoContenidoEl.classList.add("hidden");
  }
}

async function actualizarCantidad(productoId, cantidad) {
  try {
    const resp = await fetch(`${API_URL}/carrito/item`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!resp.ok) throw new Error("No se pudo actualizar la cantidad.");

    const data = await resp.json();
    renderCarrito(data);
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
    alert("No se pudo actualizar la cantidad.");
  }
}

async function eliminarItem(productoId) {
  try {
    const resp = await fetch(`${API_URL}/carrito/item/${productoId}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("No se pudo eliminar el producto.");
    const data = await resp.json();
    renderCarrito(data);
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    alert("No se pudo eliminar el producto.");
  }
}

async function vaciarCarrito() {
  try {
    const resp = await fetch(`${API_URL}/carrito/vaciar`, {
      method: "POST",
      headers: {
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("No se pudo vaciar el carrito.");
    const data = await resp.json();
    renderCarrito(data);
  } catch (err) {
    console.error("Error al vaciar carrito:", err);
    alert("No se pudo vaciar el carrito.");
  }
}

async function checkout() {
  try {
    const resp = await fetch(`${API_URL}/carrito/checkout`, {
      method: "POST",
      headers: {
        ...authHeader(),
      },
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data?.message || "Error en checkout");
    }

    alert(
      `Compra realizada (demo).\nTotal pagado: $${Number(
        data.totalPagado || 0
      ).toFixed(2)} MXN`
    );

    await cargarCarrito();
  } catch (err) {
    console.error("Error en checkout:", err);
    alert("No se pudo completar la compra.");
  }
}

// Eventos botones principales
if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    const ok = confirm("¿Seguro que quieres vaciar el carrito?");
    if (ok) vaciarCarrito();
  });
}

if (btnPagar) {
  btnPagar.addEventListener("click", () => {
    checkout();
  });
}

// Carga inicial
cargarCarrito();
