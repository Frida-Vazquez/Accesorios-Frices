// public/js/carrito.js

const CARRITO_KEY = "frices_carrito";

function getCarrito() {
  try {
    const raw = localStorage.getItem(CARRITO_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setCarrito(lista) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(lista));
}

function renderCarrito() {
  const cont = document.getElementById("carritoContainer");
  const totalSpan = document.getElementById("carritoTotal");

  if (!cont || !totalSpan) return;

  cont.innerHTML = "";

  const carrito = getCarrito();

  if (!carrito.length) {
    cont.innerHTML = `
      <p class="text-gray-600">
        Tu carrito está vacío.
      </p>
    `;
    totalSpan.textContent = "$0.00";
    return;
  }

  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.cantidad * item.precio;
    total += subtotal;

    const div = document.createElement("div");
    div.className =
      "bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center gap-4";

    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img
          src="${item.imagen}"
          alt="${item.nombre}"
          class="w-16 h-16 object-cover rounded-md border"
        />
        <div>
          <p class="font-medium text-sm md:text-base">${item.nombre}</p>
          <p class="text-xs text-gray-500">Cantidad: ${item.cantidad}</p>
          <p class="text-xs text-gray-500">Precio: $${item.precio.toFixed(2)}</p>
          <p class="text-xs md:text-sm font-semibold mt-1">
            Subtotal: $${subtotal.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        class="text-red-600 text-xs md:text-sm hover:underline"
        onclick="eliminarItem(${index})"
      >
        Eliminar
      </button>
    `;

    cont.appendChild(div);
  });

  totalSpan.textContent = `$${total.toFixed(2)}`;
}

function eliminarItem(index) {
  const carrito = getCarrito();
  carrito.splice(index, 1);
  setCarrito(carrito);
  renderCarrito();
}

function checkout() {
  const carrito = getCarrito();
  if (!carrito.length) {
    alert("Tu carrito está vacío.");
    return;
  }

  setCarrito([]);
  renderCarrito();
  alert("Compra realizada con éxito ✨");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();

  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", checkout);
  }
});
