// src/frontend/pages/home.js
import { renderPage } from "../layouts/mainpage.js";

export function homePage() {
  const content = `
    <section class="text-center mb-10 mt-4">
      <h1 class="text-3xl font-bold text-rose-600">Bienvenida a Accesorios Frices 💎</h1>
      <p class="text-gray-600 mt-2">Descubre nuestros aretes, cadenas y sets diseñados para brillar todos los días ✨</p>
    </section>

    <!-- Productos destacados -->
    <section class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

      <!-- Producto 1 -->
      <div class="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
        <img src="/static/logo.png"
          class="w-full h-40 object-contain mb-3" alt="Producto">
        <h2 class="text-lg font-semibold text-gray-800">Set Acero inoxidable</h2>
        <p class="text-sm text-gray-600 mt-1">Aretes + cadena (acero inoxidable)</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-xl hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

      <!-- Producto 2 -->
      <div class="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
        <img src="/static/logo.png"
          class="w-full h-40 object-contain mb-3" alt="Producto">
        <h2 class="text-lg font-semibold text-gray-800">Aretes de oro laminado</h2>
        <p class="text-sm text-gray-600 mt-1">Elegantes, hipoalergénicos y duraderos</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-xl hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

      <!-- Producto 3 -->
      <div class="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
        <img src="/static/logo.png"
          class="w-full h-40 object-contain mb-3" alt="Producto">
        <h2 class="text-lg font-semibold text-gray-800">Cadenas minimalistas</h2>
        <p class="text-sm text-gray-600 mt-1">Perfectas para uso diario</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-xl hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

    </section>
  `;

  return renderPage({
    title: "Accesorios Frices – Inicio",
    content,
  });
}
