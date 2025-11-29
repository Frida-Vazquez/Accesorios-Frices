// src/frontend/pages/home.js
import { renderPage } from "../layout/mainpage.js";

export function homePage() {
  const content = `
    <section class="mt-12 text-center">

      <h1 class="text-4xl font-bold text-rose-600 mb-4">
        Bienvenida a Accesorios Frices 💎
      </h1>

      <p class="text-gray-700 text-lg max-w-2xl mx-auto mb-10">
        Diseños elegantes, modernos y hipoalergénicos.  
        Aretes, cadenas y sets pensados para que brilles todos los días ✨
      </p>

      <div class="flex justify-center gap-4">
        <a 
          href="/catalogo" 
          class="px-6 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition">
          Ver catálogo
        </a>

        <a 
          href="/login" 
          class="px-6 py-2 rounded-full border border-rose-500 text-rose-600 hover:bg-rose-50 transition">
          Iniciar sesión
        </a>
      </div>
    </section>

    <!-- Productos destacados -->
    <section class="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-7">

      <!-- Producto 1 -->
      <div class="bg-white shadow rounded-2xl p-5 hover:shadow-lg transition">
        <img src="/static/logo.png" 
             class="w-full h-40 object-contain mb-4"
             alt="Set acero inoxidable">
        <h2 class="text-lg font-semibold text-gray-800">Set acero inoxidable</h2>
        <p class="text-gray-600 text-sm">Incluye aretes + cadena</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-full hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

      <!-- Producto 2 -->
      <div class="bg-white shadow rounded-2xl p-5 hover:shadow-lg transition">
        <img src="/static/logo.png" 
             class="w-full h-40 object-contain mb-4"
             alt="Aretes oro laminado">
        <h2 class="text-lg font-semibold text-gray-800">Aretes oro laminado</h2>
        <p class="text-gray-600 text-sm">Elegantes, hipoalergénicos y duraderos</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-full hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

      <!-- Producto 3 -->
      <div class="bg-white shadow rounded-2xl p-5 hover:shadow-lg transition">
        <img src="/static/logo.png" 
             class="w-full h-40 object-contain mb-4"
             alt="Cadenas minimalistas">
        <h2 class="text-lg font-semibold text-gray-800">Cadenas minimalistas</h2>
        <p class="text-gray-600 text-sm">Perfectas para tu día a día</p>
        <button class="mt-3 w-full bg-rose-500 text-white py-1.5 rounded-full hover:bg-rose-400 transition">
          Ver más
        </button>
      </div>

    </section>
  `;

  return renderPage({
    title: "Accesorios Frices | Inicio",
    content,
  });
}
