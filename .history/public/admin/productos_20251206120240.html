const API = "/api";
const TOKEN_KEY = "frices_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

function setMessage(msg, error = false) {
  const box = document.getElementById("adminMessage");
  box.textContent = msg;
  box.className = error ? "text-red-600" : "text-green-600";
  setTimeout(() => (box.textContent = ""), 3000);
}

function handleAuthError() {
  alert("Sesión expirada.");
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
}

async function loadCategorias() {
  const res = await fetch(`${API}/categorias`, { headers: authHeader() });

  if (res.status === 401) return handleAuthError();

  const data = await res.json();
  const tbody = document.getElementById("tablaCategorias");
  tbody.innerHTML = "";

  data.forEach((c) => {
    tbody.innerHTML += `
      <tr class="border-b">
        <td class="py-2">${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.descripcion || ""}</td>
        <td class="flex gap-2 py-2">
          <button class="edit px-3 py-1 border rounded" data-id="${c.id}">Editar</button>
          <button class="delete px-3 py-1 border border-red-400 text-red-600 rounded" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  document.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", () => editCategoria(btn.dataset.id, data))
  );

  document.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", () => deleteCategoria(btn.dataset.id))
  );
}

function editCategoria(id, categorias) {
  const cat = categorias.find((c) => c.id == id);
  document.getElementById("catId").value = cat.id;
  document.getElementById("catNombre").value = cat.nombre;
  document.getElementById("catDescripcion").value = cat.descripcion || "";
}

async function deleteCategoria(id) {
  if (!confirm("¿Eliminar categoría?")) return;

  const res = await fetch(`${API}/categorias/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (res.status === 401) return handleAuthError();

  setMessage("Categoría eliminada");
  loadCategorias();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!getToken()) return (window.location.href = "/login");

  loadCategorias();

  const form = document.getElementById("categoriaForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = catId.value;
    const body = {
      nombre: catNombre.value.trim(),
      descripcion: catDescripcion.value.trim(),
    };

    const res = await fetch(`${API}/categorias${id ? "/" + id : ""}`, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) return handleAuthError();

    setMessage("Guardado correctamente");
    form.reset();
    catId.value = "";
    loadCategorias();
  });

  document.getElementById("btnResetForm").addEventListener("click", () => {
    catId.value = "";
    form.reset();
  });
});
