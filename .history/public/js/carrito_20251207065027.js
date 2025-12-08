// public/js/carrito.js

const API_URL = "/api";
const CLIENTE_TOKEN_KEY = "frices_token";

// ========== SESIÓN CLIENTE ==========
function getClienteToken() {
  return localStorage.getItem(CLIENTE_TOKEN_KEY);
}

function authHeader() {
  const token = getClienteToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== CARGAR CARRITO EN LA PÁGINA ==========
async function cargarCarritoPagina() {
  const cont = document.getElementById("carritoContainer");
  const totalSpan = document.getElementById("carritoTotal");

  if (!cont || !totalSpan) return;

  try {
    const resp = await fetch(`${API_URL}/carrito`, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("Error al obtener carrito");

    const data = await resp.json();
    renderCarritoPagina(data);
  } catch (e) {
    console.error(e);
    cont.innerHTML = "<p>No se pudo cargar el carrito.</p>";
    totalSpan.textContent = "$0.00";
  }
}

function renderCarritoPagina(data) {
  const cont = document.getElementById("carritoContainer");
  const totalSpan = document.getElementById("carritoTotal");

  cont.innerHTML = "";

  if (!data || !data.items || data.items.length === 0) {
    cont.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalSpan.textContent = "$0.00";
    return;
  }

  let total = 0;

  data.items.forEach((item) => {
    const subtotal = item.cantidad * item.precio_unitario;
    total += subtotal;

    const div = document.createElement("div");
    div.className =
      "bg-white rounded-lg shadow p-4 flex justify-between items-center gap-4";

    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${
          item.producto_imagen ||
          "https://via.placeholder.com/100x100?text=IMG"
        }"
          class="w-16 h-16 object-cover rounded-md border" />
        <div>
          <p class="font-medium">${item.producto_nombre}</p>
          <p class="text-sm text-gray-500">Cantidad: ${item.cantidad}</p>
          <p class="text-sm text-gray-500">Precio: $${item.precio_unitario}</p>
          <p class="text-sm font-semibold mt-1">Subtotal: $${subtotal.toFixed(
            2
          )}</p>
        </div>
      </div>

      <button class="text-red-600 text-sm"
              onclick="eliminarItemPagina(${item.id})">
        Eliminar
      </button>
    `;

    cont.appendChild(div);
  });

  totalSpan.textContent = `$${total.toFixed(2)}`;
}

// ========== ELIMINAR UN PRODUCTO DEL CARRITO ==========
async function eliminarItemPagina(itemId) {
  try {
    const resp = await fetch(`${API_URL}/carrito/item/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!resp.ok) throw new Error("Error al eliminar producto");

    await cargarCarritoPagina();
  } catch (e) {
    console.error(e);
    alert("No se pudo eliminar el producto.");
  }
}

// ========== CHECKOUT (FINALIZAR COMPRA) ==========
async function checkoutPagina() {
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
    cargarCarritoPagina(); // recarga el carrito (debería quedar vacío)
  } catch (e) {
    console.error(e);
    alert("No se pudo finalizar la compra.");
  }
}

// ========== INIT AL CARGAR ==========
document.addEventListener("DOMContentLoaded", () => {
  if (!getClienteToken()) {
    alert("Debes iniciar sesión para ver tu carrito.");
    window.location.href = "/static/auth/login.html"; // ajusta si tu login está en otra ruta
    return;
  }

  cargarCarritoPagina();

  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", checkoutPagina);
  }
});
