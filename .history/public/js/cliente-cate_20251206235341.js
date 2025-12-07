// public/js/cliente-cate.js

const API_URL = "/api";
const CLIENTE_TOKEN_KEY = "frices_token";

// /collections/anillos -> "anillos"
const slugUrl = window.location.pathname.split("/").pop();

const titulo = document.getElementById("tituloCategoria");
const subtitulo = document.getElementById("subtitulo");
const grid = document.getElementById("gridProductos");

// ===== helpers =====
function slugify(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, "-")            // espacios -> guiones
    .replace(/[^a-z0-9\-]/g, "");    // quita caracteres raros
}

function normalizeProductos(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

function getClienteToken() {
  return localStorage.getItem(CLIENTE_TOKEN_KEY);
}

// ===== lógica principal =====
async function cargarCategoriaYProductos() {
  try {
    // 1) Traer TODAS las categorías
    const respCat = await fetch(`${API_URL}/categorias`);
    if (!respCat.ok) {
      console.error("Error /api/categorias status:", respCat.status);
      throw new Error("No se pudieron cargar las categorías");
    }
    const categorias = await respCat.json();

    // 2) Buscar la categoría por slug
    const categoria = categorias.find(
      (cat) => (cat.slug || slugify(cat.nombre)) === slugUrl
    );

    if (!categoria) {
      titulo.textContent = "Categoría no encontrada";
      subtitulo.textContent = "";
      grid.innerHTML = `
        <p class="col-span-full text-gray-600">
          No se encontró esta categoría.
        </p>`;
      return;
    }

    const categoriaId = Number(categoria.id);
    const nombreCategoria = categoria.nombre;

    // 3) Encabezados
    titulo.textContent = nombreCategoria;
    subtitulo.textContent = `Productos de ${nombreCategoria}`;

    // 4) Traer productos DESDE LA API con token (como en admin/slider)
    const token = getClienteToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // ahora usamos el endpoint público y ya NO necesitamos headers
const respProd = await fetch(`${API_URL}/productos/public`);


    let raw;
    try {
      raw = await respProd.json();
    } catch (e) {
      console.error("No se pudo parsear respuesta de /api/productos:", e);
      throw new Error("No se pudieron leer los productos");
    }

    if (!respProd.ok) {
      console.error("Error /api/productos status:", respProd.status, raw);
      throw new Error("No se pudieron cargar los productos");
    }

    const todos = normalizeProductos(raw);

    // 5) Filtrar por categoría (probando distintos nombres de campo)
    const productos = todos.filter((p) => {
      const catId =
        p.categoria_id ??
        p.categoriaId ??
        p.id_categoria ??
        p.idCategoria ??
        null;
      return Number(catId) === categoriaId;
    });

    grid.innerHTML = "";

    if (!productos.length) {
      grid.innerHTML = `
        <p class="col-span-full text-gray-600">
          No hay productos en esta categoría por ahora.
        </p>`;
      return;
    }

    // 6) Pintar cards
    productos.forEach((p) => {
      const card = document.createElement("article");
      card.className =
        "bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col";

      const imgSrc =
        p.url_imagen ||
        p.imagen_url ||
        p.imagen ||
        p.foto ||
        "/static/assets/no-image.png";

      card.innerHTML = `
        <div class="h-52 overflow-hidden">
          <img
            src="${imgSrc}"
            alt="${p.nombre}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="text-sm font-semibold mb-1 line-clamp-2">
            ${p.nombre}
          </h3>
          <p class="text-xs text-gray-500 mb-2 line-clamp-2">
            ${p.descripcion || ""}
          </p>
          <div class="mt-auto flex items-center justify-between">
            <span class="font-bold text-sm">
              $${Number(p.precio || 0).toFixed(2)} MXN
            </span>
            <button
              class="text-xs px-3 py-1 rounded-full border border-[#8a555b] text-[#8a555b] hover:bg-[#8a555b] hover:text-white transition"
            >
              Agregar
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error en cargarCategoriaYProductos:", err);
    titulo.textContent = "Error al cargar la categoría";
    subtitulo.textContent = "";
    grid.innerHTML = `
      <p class="col-span-full text-red-600">
        Ocurrió un error al cargar los productos.
      </p>`;
  }
}

cargarCategoriaYProductos();
