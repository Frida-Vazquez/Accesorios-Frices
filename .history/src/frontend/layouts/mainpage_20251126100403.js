// src/frontend/layout/basepage.js

export function renderPage({ title = "Accesorios Frices", content = "" }) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>

      <!-- Tailwind CDN -->
      <script src="https://cdn.tailwindcss.com"></script>

      <!-- Fuente -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

      <style>
        body { font-family: 'Inter', sans-serif; }
      </style>
    </head>

    <body class="bg-gradient-to-b from-rose-50 to-pink-50 min-h-screen flex flex-col">

      <!-- NAVBAR -->
      <nav class="w-full bg-white/90 backdrop-blur shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-500 text-white font-bold text-lg shadow">
            AF
          </span>
          <div class="leading-tight">
            <p class="text-xl font-bold text-rose-600">Accesorios Frices</p>
            <p class="text-xs text-gray-500">Brilla todos los días ✨</p>
          </div>
        </a>

        <div id="nav-right" class="flex items-center gap-5 text-sm">
          <!-- Aquí se insertan los botones dinámicamente -->
        </div>
      </nav>

      <!-- MAIN CONTENT -->
      <main class="flex-1 w-full max-w-5xl mx-auto p-6">
        ${content}
      </main>

      <!-- FOOTER -->
      <footer class="text-center text-xs py-4 text-gray-500 border-t bg-white/70">
        © ${new Date().getFullYear()} Accesorios Frices — Hecho con amor y brillo 💖
      </footer>

      <!-- SCRIPT DE SESIÓN -->
      <script>
        (function () {
          const navRight = document.getElementById("nav-right");
          if (!navRight) return;

          // Cambia las keys para que sean de Accesorios Frices
          const token = localStorage.getItem("af_token");
          const name  = localStorage.getItem("af_user_name") || "Mi cuenta";

          if (token) {
            // Usuario logueado
            navRight.innerHTML = \`
              <a href="/" class="hover:text-rose-500">Inicio</a>
              <a href="/catalogo" class="hover:text-rose-500">Catálogo</a>
              <a href="/carrito" class="hover:text-rose-500">Carrito</a>

              <span class="text-gray-700">Hola, \${name}</span>

              <button id="logoutBtn"
                class="px-3 py-1 border border-rose-500 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition text-xs">
                Cerrar sesión
              </button>
            \`;

            document.getElementById("logoutBtn").onclick = () => {
              localStorage.removeItem("af_token");
              localStorage.removeItem("af_user_name");
              window.location.href = "/";
            };

          } else {
            // Usuario NO logueado
            navRight.innerHTML = \`
              <a href="/" class="hover:text-rose-500">Inicio</a>
              <a href="/catalogo" class="hover:text-rose-500">Catálogo</a>
              <a href="/login" class="hover:text-rose-500">Iniciar sesión</a>
              <a href="/registro"
                class="px-3 py-1 bg-rose-500 text-white rounded-full hover:bg-rose-400 transition text-xs">
                Registrarse
              </a>
            \`;
          }
        })();
      </script>

    </body>
  </html>
  `;
}
