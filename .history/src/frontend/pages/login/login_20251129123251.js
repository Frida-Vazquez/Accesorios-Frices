// src/frontend/pages/login.js
import { renderPage } from "../layout/mainpage.js";

export function loginPage() {

  const content = `
  <section class="flex justify-center items-center py-12">

    <div class="w-[380px] bg-white shadow-xl rounded-2xl p-6 animate-fadeIn">

      <!-- Logo -->
      <img src="/static/logo.png"
           class="w-40 mx-auto mb-4 animate-fadeIn"
           alt="Accesorios Frices" />

      <!-- Tabs -->
      <div class="flex border-b mb-5">
          <button class="flex-1 text-center py-2 text-[#C89A3D] border-b-2 border-[#C89A3D] font-semibold">
            Login
          </button>

          <a href="/registro"
             class="flex-1 text-center py-2 text-gray-500 hover:text-[#C89A3D] transition">
            Register
          </a>
      </div>

      <!-- Formulario Login -->
      <h2 class="text-lg font-semibold text-[#5c4b2a] mb-3">Iniciar Sesión</h2>

      <div class="space-y-3">
        <input id="log-email"
               type="email"
               placeholder="Correo"
               class="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#d9d4c8] text-[#3d2f17]
                      focus:ring-2 focus:ring-[#C89A3D] focus:border-[#C89A3D] outline-none"
        />

        <input id="log-pass"
               type="password"
               placeholder="Contraseña"
               class="w-full px-3 py-2 rounded-lg bg-[#faf8f3] border border-[#d9d4c8] text-[#3d2f17]
                      focus:ring-2 focus:ring-[#C89A3D] focus:border-[#C89A3D] outline-none"
        />

        <button id="loginBtn"
                class="w-full bg-[#C89A3D] text-white py-2 rounded-full font-medium
                       hover:bg-[#A0782F] transition">
          Entrar
        </button>

        <p id="msg-login" class="text-sm text-[#6d5630] h-5"></p>

        <button class="text-sm text-[#A0782F] hover:text-[#6a4f28] transition mx-auto block">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

    </div>
  </section>

  <!-- Animaciones -->
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.6s ease; }
  </style>

  <script>
    (function(){
      const btn = document.getElementById("loginBtn");
      const msg = document.getElementById("msg-login");
      const API_URL = "/api/auth/login";

      if (!btn) return;

      btn.onclick = async () => {
        msg.textContent = "";

        const email = document.getElementById("log-email").value.trim();
        const pass  = document.getElementById("log-pass").value.trim();

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass })
        });

        const data = await res.json();

        if (!res.ok) {
          msg.textContent = data.message || "Error al iniciar sesión.";
          return;
        }

        // Guardar sesión
        localStorage.setItem("af_token", data.token);
        localStorage.setItem("af_user_name", data.nombre || email);

        window.location.href = "/";
      };
    })();
  </script>
  `;


  return renderPage({ title: "Accesorios Frices — Login", content });
}
