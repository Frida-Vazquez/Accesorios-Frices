// src/frontend/pages/register.js
import { renderPage } from "../layout/mainLayout.js";

export function registerPage() {

  const content = `
  <section class="flex justify-center items-center py-12">

    <div class="w-[380px] bg-white shadow-xl rounded-2xl p-6 animate-fadeIn">

      <!-- Logo -->
      <img src="/static/logo.png"
           class="w-40 mx-auto mb-4 animate-fadeIn"
           alt="Accesorios Frices" />

      <!-- Tabs -->
      <div class="flex border-b mb-5">
          <a href="/login"
             class="flex-1 text-center py-2 text-gray-500 hover:text-[#C89A3D] transition">
            Login
          </a>

          <button class="flex-1 text-center py-2 text-[#C89A3D] border-b-2 border-[#C89A3D] font-semibold">
            Register
          </button>
      </div>

      <!-- Formulario Registro -->
      <h2 class="text-lg font-semibold text-[#5c4b2a] mb-3">Crear Cuenta</h2>

      <div class="space-y-3">
        <input id="reg-nombre"
               placeholder="Nombre completo"
               class="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#d9d4c8] text-[#3d2f17]
                      focus:ring-2 focus:ring-[#C89A3D] outline-none"
        />

        <input id="reg-email"
               type="email"
               placeholder="Correo"
               class="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#d9d4c8] text-[#3d2f17]
                      focus:ring-2 focus:ring-[#C89A3D] outline-none"
        />

        <input id="reg-pass"
               type="password"
               placeholder="Contraseña"
               class="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#d9d4c8] text-[#3d2f17]
                      focus:ring-2 focus:ring-[#C89A3D] outline-none"
        />

        <button id="regBtn"
                class="w-full bg-[#C89A3D] text-white py-2 rounded-full font-medium
                       hover:bg-[#A0782F] transition">
          Registrarse
        </button>

        <p id="msg-reg" class="text-sm text-[#6d5630] h-5"></p>

      </div>

    </div>
  </section>

  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.6s ease; }
  </style>

  <script>
    (function(){
      const btn = document.getElementById("regBtn");
      const msg = document.getElementById("msg-reg");
      const API_URL = "/api/clientes";

      if (!btn) return;

      btn.onclick = async () => {
        msg.textContent = "";

        const nombre = document.getElementById("reg-nombre").value.trim();
        const email  = document.getElementById("reg-email").value.trim();
        const pass   = document.getElementById("reg-pass").value.trim();

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password: pass })
        });

        const data = await res.json();

        if (!res.ok) {
          msg.textContent = data.message || "Error al registrar.";
          return;
        }

      msg.textContent = "Registro exitoso ";
      setTimeout(() => window.location.href = "/login", 1000);
      };
    })();
  </script>
  `;

  return renderPage({ title: "Accesorios Frices — Registro", content });
}
