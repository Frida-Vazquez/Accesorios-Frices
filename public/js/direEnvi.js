// public/js/direEnvi.js

// Lee los campos del formulario y devuelve el objeto direEnvi
window.leerDireEnvi = function () {
  return {
    nombre: document.getElementById("dir_nombre")?.value.trim(),
    telefono: document.getElementById("dir_telefono")?.value.trim(),
    calle: document.getElementById("dir_calle")?.value.trim(),
    colonia: document.getElementById("dir_colonia")?.value.trim(),
    ciudad: document.getElementById("dir_ciudad")?.value.trim(),
    estado: document.getElementById("dir_estado")?.value.trim(),
    cp: document.getElementById("dir_cp")?.value.trim(),
    referencias: document.getElementById("dir_referencias")?.value.trim(),
  };
};

// Valida que los campos obligatorios estén completos
window.validarDireEnvi = function (direEnvi) {
  const errores = [];

  if (!direEnvi.nombre) errores.push("El nombre es obligatorio.");
  if (!direEnvi.telefono) errores.push("El teléfono es obligatorio.");
  if (!direEnvi.calle) errores.push("La calle y número son obligatorios.");
  if (!direEnvi.colonia) errores.push("La colonia es obligatoria.");
  if (!direEnvi.ciudad) errores.push("La ciudad es obligatoria.");
  if (!direEnvi.estado) errores.push("El estado es obligatorio.");
  if (!direEnvi.cp) errores.push("El código postal es obligatorio.");

  const errorEl = document.getElementById("dir_error");
  if (!errorEl) return errores.length === 0;

  if (errores.length) {
    errorEl.textContent = errores.join(" ");
    errorEl.classList.remove("hidden");
    return false;
  } else {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    return true;
  }
};
