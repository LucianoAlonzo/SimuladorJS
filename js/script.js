// declaro los coeficientes de materiales por metro cuadrado aproximadamente
const PORTLAND_COEF = 0.2; // bolsas de portland por m²
const ARENA_COEF = 0.03; // m³ de arena por m²
const LADRILLOS_COEF = 60; // cantidad de ladrillos por m²

// traigo el registro que haya en local storage (si lo hay)
let registro = JSON.parse(localStorage.getItem("registro")) || [];

// guardo el array registro en localstorage
function guardar_storage() {
  localStorage.setItem("registro", JSON.stringify(registro));
}

// calculo área y materiales
function calcularCantidades({ largo, ancho }) {
  const area = largo * ancho;
  const portland = area * PORTLAND_COEF;
  const arena = area * ARENA_COEF;
  const ladrillos = area * LADRILLOS_COEF;
  return { area, portland, arena, ladrillos };
}

// pinta el resultado en el div "resultado" (en esta func uso math.ceil para que las bolsas de portland estén "redondeadas")
function pintar_resultado({ area, portland, arena, ladrillos }) {
  const cont = document.querySelector("#resultado");
  if (!cont) return;
  cont.innerHTML = `
    <div class="alert alert-success mb-0">
      <strong>resultado</strong><br>
      para <b>${area.toFixed(2)} m²</b> necesitas:<br>
      - ${Math.ceil(portland)} bolsas de portland<br> 
      - ${arena.toFixed(2)} m³ de arena<br>
      - ${ladrillos.toFixed(0)} ladrillos
    </div>
  `;
}

// renderizo la tabla del registro 
function render_registro() {
  const cuerpoTabla = document.querySelector("#tabla-registro");
  if (!cuerpoTabla) return;
  cuerpoTabla.innerHTML = "";
  for (let i = 0; i < registro.length; i++) {
    const item = registro[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td>${item.fecha}</td>
      <td>${item.area.toFixed(2)}</td>
      <td>${Math.ceil(item.portland)}</td>
      <td>${item.arena.toFixed(2)}</td>
      <td>${item.ladrillos.toFixed(0)}</td>
      <td><button class="btn btn-sm btn-outline-danger" data-index="${i}">eliminar</button></td>
    `;
    cuerpoTabla.appendChild(tr);
  }
}

// funcion para limpiar el registro y re imprimir la tabla
function limpiar_registro() {
  registro = [];
  guardar_storage();
  render_registro();
  const cont = document.querySelector("#resultado");
  if (cont)
    cont.innerHTML = `<div class="alert alert-info mb-0">registro vaciado.</div>`;
}

// valído las medidas de los inputs y remplazo comas por puntos
function leer_numero(input_elemento) {
  if (!input_elemento) return NaN;
  const valor = (input_elemento.value || "").replace(",", ".");
  return parseFloat(valor);
}

// evento principal cuando se carga el dom
document.addEventListener("DOMContentLoaded", () => {
  //esto serían referencias a inputs y botones
  const form = document.querySelector("#calc-form");
  const input_largo = document.querySelector("#largo");
  const input_ancho = document.querySelector("#ancho");
  const btn_limpiar = document.querySelector("#btn-limpiar");
  const tabla = document.querySelector("#tabla-registro");

  // muestro la tabla inicial traída desde localstorage
  render_registro();

  // cuando se hace el envío del formulario, calculo y guardo en localstorage
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const largo = leer_numero(input_largo);
      const ancho = leer_numero(input_ancho);

      if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
        const cont = document.querySelector("#resultado");
        if (cont)
          cont.innerHTML = `<div class="alert alert-warning mb-0">dimensiones inválidas. ingresá números mayores a 0.</div>`;
        return;
      }

      const dimensiones = { largo, ancho };
      const res = calcularCantidades(dimensiones);
      pintar_resultado(res);

      // guardo el cálculo en el registro y actualizo localstorage
      const item = {
        fecha: new Date().toLocaleString(),
        largo,
        ancho,
        area: res.area,
        portland: res.portland,
        arena: res.arena,
        ladrillos: res.ladrillos,
      };
      registro.push(item);
      guardar_storage();
      render_registro();
    });
  }

  // botón limpiar registro
  if (btn_limpiar) {
    btn_limpiar.addEventListener("click", limpiar_registro);
  }

  // eliminar item por índice
  if (tabla) {
    tabla.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-index]");
      if (!btn) return;
      const indice = parseInt(btn.dataset.index, 10);
      if (isNaN(indice) || indice < 0 || indice >= registro.length) return;
      registro.splice(indice, 1);
      guardar_storage();
      render_registro();
      const cont = document.querySelector("#resultado");
      if (cont)
        cont.innerHTML = `<div class="alert alert-success mb-0">elemento eliminado del registro.</div>`;
    });
  }
});
