// public/js/cliente-cate.js

const API_URL = "/api";
const FAVORITOS_KEY = "frices_favoritos";

// /collections/aretes -> "aretes"
const slugUrl = window.location.pathname.split("/").pop();

const titulo = document.getElementById("tituloCategoria");
const subtitulo = document.getElementById("subtitulo");
const grid = document.getElementById("gridProductos");

// arrays en memoria
let productosOriginales = []; // todos los de la categoría
let productosFiltrados = [];  // vista actual

// ========== HELPERS ==========

function slugify(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

function normalizeProductos(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

function getFavoritos() {
  try {
    const raw = localStorage.getItem(FAVORITOS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setFavoritos(lista) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
}

function toggleFavorito(id) {
  let favs = getFavoritos();
  if (favs.includes(id)) {
    favs = favs.filter((x) => x !== id);
  } else {
    favs.push(id);
  }
  setFavoritos(favs);
  return favs;
}

function esFavorito(id) {
  return getFavoritos().includes(id);
}

// ========== RENDER DE PRODUCTOS (con corazoncito) ==========

function crearTarjeta(prod) {
  const favs = getFavoritos();
  const isFav = favs.includes(prod.id);

  return `
    <article class="bg-white rounded-3xl shadow-sm overflow-hidden relative">

      <!-- BOTÓN FAVORITO -->
      <button
        class="absolute top-3 right-3 text-xl fav-btn"
        data-id="${prod.id}"
      >
        ${isFav ? "❤️" : "🤍"}
      </button>

      <div class="w-full aspect-[4/5] overflow-hidden">
        <img src="${prod.url_imagen}" class="w-full h-full object-cover" />
      </div>

      <div class="p-4 text-sm">
        <h3 class="font-semibold">${prod.nombre}</h3>
        <p class="text-gray-600 text-xs mb-2">${prod.descripcion}</p>
        <p class="font-bold mb-3">$${prod.precio} MXN</p>

        <button class="px-4 py-2 rounded-full border text-xs">
          Agregar
        </button>
      </div>
    </article>
  `;
}


  const favs = getFavoritos();

  lista.forEach((p) => {
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col relative";

    const imgSrc =
      p.url_imagen ||
      p.imagen_url ||
      p.imagen ||
      p.foto ||
      "/static/assets/no-image.png";

    const precioNum = Number(p.precio || 0);
    const esFav = favs.includes(p.id);

    card.innerHTML = `
      <button
        type="button"
        data-fav
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-sm ${
          esFav ? "text-red-500" : "text-gray-400"
        }"
        title="${esFav ? "Quitar de favoritos" : "Agregar a favoritos"}"
      >
        ${esFav ? "♥" : "♡"}
      </button>

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
            $${precioNum.toFixed(2)} MXN
          </span>
          <button
            class="text-xs px-3 py-1 rounded-full border border-[#8a555b] text-[#8a555b] hover:bg-[#8a555b] hover:text-white transition"
          >
            Agregar
          </button>
        </div>
      </div>
    `;

    // evento corazoncito
    const favBtn = card.querySelector("[data-fav]");
    if (favBtn) {
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const nuevosFavs = toggleFavorito(p.id);
        const ahoraFav = nuevosFavs.includes(p.id);
        favBtn.textContent = ahoraFav ? "♥" : "♡";
        favBtn.classList.toggle("text-red-500", ahoraFav);
        favBtn.classList.toggle("text-gray-400", !ahoraFav);
        favBtn.title = ahoraFav
          ? "Quitar de favoritos"
          : "Agregar a favoritos";
      });
    }

    grid.appendChild(card);
  });
}

// ========== CARGA INICIAL (categoría + productos) ==========

async function cargarCategoriaYProductos() {
  try {
    // 1) Categorías
    const respCat = await fetch(`${API_URL}/categorias`);
    if (!respCat.ok) throw new Error("No se pudieron cargar las categorías");
    const categorias = await respCat.json();

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

    titulo.textContent = nombreCategoria;
    subtitulo.textContent = `Productos de ${nombreCategoria}`;

    // 2) Productos públicos
    const respProd = await fetch(`${API_URL}/productos/public`);
    const raw = await respProd.json();
    if (!respProd.ok) throw new Error("No se pudieron cargar los productos");

    const todos = normalizeProductos(raw);

    const productos = todos.filter(
      (p) => Number(p.categoria_id) === categoriaId
    );

    productosOriginales = productos.slice();
    productosFiltrados = productos.slice();

    renderProductos(productosFiltrados);
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

// ========== FILTROS ==========

function aplicarFiltros() {
  let lista = productosOriginales.slice();

  const enStockEl = document.getElementById("filterEnStock");
  const minPriceEl = document.getElementById("filterMinPrice");
  const maxPriceEl = document.getElementById("filterMaxPrice");
  const sortEl = document.getElementById("filterSort");

  const enStock = enStockEl?.checked;
  const minPrice = minPriceEl?.value ? Number(minPriceEl.value) : null;
  const maxPrice = maxPriceEl?.value ? Number(maxPriceEl.value) : null;
  const sort = sortEl?.value || "";

  // filtro stock
  if (enStock) {
    lista = lista.filter((p) => Number(p.stock || 0) > 0 && p.activo);
  }

  // filtro precio
  lista = lista.filter((p) => {
    const precio = Number(p.precio || 0);
    if (minPrice !== null && precio < minPrice) return false;
    if (maxPrice !== null && precio > maxPrice) return false;
    return true;
  });

  // orden
  switch (sort) {
    case "nombre-asc":
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      break;
    case "nombre-desc":
      lista.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
      break;
    case "precio-asc":
      lista.sort(
        (a, b) => Number(a.precio || 0) - Number(b.precio || 0)
      );
      break;
    case "precio-desc":
      lista.sort(
        (a, b) => Number(b.precio || 0) - Number(a.precio || 0)
      );
      break;
    case "fecha-asc":
      lista.sort(
        (a, b) =>
          new Date(a.created_at) - new Date(b.created_at)
      );
      break;
    case "fecha-desc":
      lista.sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      );
      break;
    case "mas-vendidos":
      // no tenemos campo de ventas, usamos stock como aproximación
      lista.sort(
        (a, b) => Number(b.stock || 0) - Number(a.stock || 0)
      );
      break;
  }

  productosFiltrados = lista;
  renderProductos(productosFiltrados);
}

function limpiarFiltros() {
  const enStockEl = document.getElementById("filterEnStock");
  const minPriceEl = document.getElementById("filterMinPrice");
  const maxPriceEl = document.getElementById("filterMaxPrice");
  const sortEl = document.getElementById("filterSort");

  if (enStockEl) enStockEl.checked = false;
  if (minPriceEl) minPriceEl.value = "";
  if (maxPriceEl) maxPriceEl.value = "";
  if (sortEl) sortEl.value = "";

  productosFiltrados = productosOriginales.slice();
  renderProductos(productosFiltrados);
}

// ========== PANEL FILTRO: eventos ==========

function initFiltrosUI() {
  const openBtn = document.getElementById("filterOpenBtn");
  const panel = document.getElementById("filterPanel");
  const closeBtn = document.getElementById("filterCloseBtn");
  const applyBtn = document.getElementById("filterApplyBtn");
  const clearBtn = document.getElementById("filterClearBtn");

  if (!openBtn || !panel) return;

  openBtn.addEventListener("click", () => {
    panel.classList.remove("hidden");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  }

  panel.addEventListener("click", (e) => {
    if (e.target === panel) {
      panel.classList.add("hidden");
    }
  });

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      aplicarFiltros();
      panel.classList.add("hidden");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      limpiarFiltros();
    });
  }
}


// ========== INIT ==========

document.addEventListener("DOMContentLoaded", () => {
  cargarCategoriaYProductos();
  initFiltrosUI();
});

