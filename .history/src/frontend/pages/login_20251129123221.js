// src/frontend/pages/login.js
import { renderPage } from "../layout/mainpage.js";   // ← IMPORT CORREGIDO

export function loginPage() {
  const content = `
    ... (tu contenido igual)
  `;

  return renderPage({ title: "Accesorios Frices — Login", content });
}
