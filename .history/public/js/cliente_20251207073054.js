const API_URL = "/api";
const CLIENTE_TOKEN_KEY = "frices_token";

function getClienteToken() {
  return localStorage.getItem(CLIENTE_TOKEN_KEY);
}

function authHeader() {
  const token = getClienteToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== CARRITO: AGREGAR PRODUCTO ==========
async function agregarAlCarrito(productoId) {
  if (!getClienteToken()) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    window.location.href = "/static/auth/login.html"; // ajusta ruta si es otra
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

    await resp.json();
    alert("Producto agregado al carrito ✨");
  } catch (e) {
    console.error(e);
    alert("Ocurrió un error al agregar al carrito.");
  }
}
