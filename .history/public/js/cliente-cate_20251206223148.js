// public/js/cliente-cate.js

const API_URL = "/api";

// 1. Sacar el slug de la URL: /collections/anillos -> "anillos"
const slug = window.location.pathname.split("/").pop();

// 2. Elementos del DOM
const titulo = document.getElementById("tituloCategoria");
const subtitulo = document.getElementById("subtitulo");
const grid = document.getElementById("gridProductos");

async function cargarCategoriaYProductos() {
  try {
    // a) Obtener datos de la categoría desde la API por su slug
    //    Ej: GET /api/categorias/slug/anillos
    const respCat = await fetch(`${API_URL}/categorias/slug/${slug}`);

    if (!respCat.ok) {
      titulo.textContent = "Categoría no encontrada";
      subtitulo.textContent = "";
      grid.innerHTML = `
        <p class="col-span-full text-gray-600">
          No se encontró esta categoría.
        </p>`;
      return;
    }

    const categoria = await respCat.json();
    const categoriaId = categoria.id;
    const nombreCategoria = categoria.nombre;

    // b) Actualizar encabezados
    titulo.textContent = nombreCategoria;
    subtitulo.textContent = `Productos de ${nombreCategoria}`;

    // c) Pedir productos de esa categoría
    //    Ej: GET /api/productos?categoria_id=3
    const respProd = await fetch(
      `${API_URL}/productos?categoria_id=${categoriaId}`
    );
    const productos = await respProd.json();

    grid.innerHTML = "";

    if (!productos.length) {
      grid.innerHTML = `
        <p class="col-span-full text-gray-600">
          No hay productos en esta categoría por ahora.
        </p>`;
      return;
    }

    // d) Pintar tarjetas de productos
    productos.forEach((p) => {
      const card = document.createElement("article");
      card.className =
        "bg-white rounded-3xl shadow-md overflow-hidden flex flex-col";

      card.innerHTML = `
        <div class="h-52 overflow-hidden">
          <img
            src="${p.url_imagen || "/static/assets/no-image.png"}"
            alt="${p.nombre}"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="text-sm font-semibold mb-1 line-clamp-2">${p.nombre}</h3>
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
    console.error(err);
    grid.innerHTML = `
      <p class="col-span-full text-red-600">
        Ocurrió un error al cargar los productos.
      </p>`;
  }
}

// Ejecutar al cargar la página
cargarCategoriaYProductos();
