// public/js/favoritos.js

const API_URL = "/api";
const FAVORITOS_KEY = "frices_favoritos";

const gridFav = document.getElementById("gridFavoritos");

// ====== FAVORITOS EN LOCALSTORAGE ======
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
    favs = favs.filter((x) => x !== id); // quitar
  } else {
    favs.push(id); // agregar
  }
  setFavoritos(favs);
  return favs;
}

function normalizeProductos(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

// ====== RENDER DE TARJETAS EN FAVORITOS ======
function renderFavoritos(lista) {
  gridFav.innerHTML = "";

  if (!lista.length) {
    gridFav.innerHTML = `
      <p class="col-span-full text-gray-600 text-sm">
        Aún no tienes productos en favoritos 💜
      </p>`;
    return;
  }

  const favIds = getFavoritos();

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
    const esFav = favIds.includes(p.id);

    card.innerHTML = `
      <!-- BOTÓN FAVORITO -->
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
          data-add-cart
            class="text-xs px-3 py-1 rounded-full border border-[#8a555b] text-[#8a555b] hover:bg-[#8a555b] hover:text-white transition"
          >
            Agregar
          </button>
        </div>
      </div>
    `;

    // evento del corazoncito: si lo quitas, desaparece de la lista
    const favBtn = card.querySelector("[data-fav]");
    if (favBtn) {
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorito(p.id);
        cargarFavoritos(); // volvemos a cargar para que se quite
      });
    }

    gridFav.appendChild(card);
  });
}

// ====== CARGAR FAVORITOS DESDE LA BD ======
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

    // Si hay IDs en LS que ya no existen en BD, los limpiamos:
    const validIds = seleccionados.map((p) => p.id);
    if (validIds.length !== favIds.length) {
      setFavoritos(validIds);
    }

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
