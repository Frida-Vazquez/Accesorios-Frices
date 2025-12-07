// public/js/favoritos.js

const API_URL = "/api";
const FAVORITOS_KEY = "frices_favoritos";

const gridFav = document.getElementById("gridFavoritos");

// helpers para favoritos (mismas claves que en cliente-cate)
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

function normalizeProductos(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

// render de tarjetas en favoritos
function renderFavoritos(lista) {
  gridFav.innerHTML = "";

  if (!lista.length) {
    gridFav.innerHTML = `
      <p class="col-span-full text-gray-600 text-sm">
        Aún no tienes productos en favoritos 💜
      </p>`;
    return;
  }

  lista.forEach((p) => {
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col";

    const imgSrc =
      p.url_imagen ||
      p.imagen_url ||
      p.imagen ||
      p.foto ||
      "/static/assets/no-image.png";

    const precioNum = Number(p.precio || 0);

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

    gridFav.appendChild(card);
  });
}

async function cargarFavoritos() {
  const favIds = getFavoritos();

  if (!favIds.length) {
    renderFavoritos([]);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/productos/public`);
    const raw = await res.json();
    if (!res.ok) throw new Error("No se pudieron cargar los productos");

    const todos = normalizeProductos(raw);

    const seleccionados = todos.filter((p) => favIds.includes(p.id));

    renderFavoritos(seleccionados);
  } catch (err) {
    console.error("Error al cargar favoritos:", err);
    gridFav.innerHTML = `
      <p class="col-span-full text-red-600 text-sm">
        Ocurrió un error al cargar tus favoritos.
      </p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarFavoritos();
});
