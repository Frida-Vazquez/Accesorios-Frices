// public/js/pedido-detalle.js

const API_URL = "/api";
const TOKEN_KEY = "frices_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setMessage(msg, type = "success") {
  const box = document.getElementById("adminMessage");
  if (!box) return;

  box.textContent = msg || "";
  box.className =
    type === "error"
      ? "mb-2 text-sm text-red-600"
      : "mb-2 text-sm text-green-600";

  if (msg) {
    setTimeout(() => {
      box.textContent = "";
      box.className = "";
    }, 3000);
  }
}

async function apiFetch(path, options = {}) {
  const resp = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    let msg = "Error al cargar el pedido";
    try {
      const errData = await resp.json();
      if (errData.message) msg = errData.message;
    } catch (_) {}
    setMessage(msg, "error");
    throw new Error(msg);
  }

  return resp.json();
}

function getPedidoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function cargarDetallePedido() {
  const pedidoId = getPedidoIdFromUrl();
  if (!pedidoId) {
    setMessage("No se especificó un ID de pedido.", "error");
    return;
  }

  try {
    const pedido = await apiFetch(`/pedidos/${pedidoId}`);

    // Resumen
    const resumenEl = document.getElementById("resumenPedido");
    resumenEl.innerHTML = `
      <p><span class="font-semibold">ID:</span> ${pedido.id}</p>
      <p><span class="font-semibold">Fecha:</span> ${pedido.fecha ?? ""}</p>
      <p><span class="font-semibold">Cliente:</span> ${pedido.cliente_nombre ?? ""}</p>
      <p><span class="font-semibold">Email:</span> ${pedido.cliente_email ?? ""}</p>
      <p><span class="font-semibold">Estado:</span> ${pedido.estado ?? ""}</p>
      <p><span class="font-semibold">Total:</span> $${Number(pedido.total || 0).toFixed(2)}</p>
    `;

    // Items
    const tbody = document.getElementById("tablaItemsPedido");
    tbody.innerHTML = "";

    if (!pedido.items || !pedido.items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="py-3 text-center text-slate-500">
            Este pedido no tiene productos registrados.
          </td>
        </tr>
      `;
      return;
    }

    for (const item of pedido.items) {
      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
        <td class="py-2 px-2">
          ${item.nombre || `Producto ${item.producto_id}`}
        </td>
        <td class="py-2 px-2">${item.cantidad}</td>
        <td class="py-2 px-2">$${Number(item.precio_unitario || 0).toFixed(2)}</td>
        <td class="py-2 px-2">$${Number(item.subtotal || 0).toFixed(2)}</td>
      `;

      tbody.appendChild(tr);
    }
  } catch (e) {
    console.error("Error al cargar detalle de pedido:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // si quieres obligar a tener token admin, aquí podrías checarlo
  cargarDetallePedido();
});
