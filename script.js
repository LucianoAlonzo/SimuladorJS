// declaro los coeficientes de materiales por metro cuadrado aproximadamente
const PORTLAND_COEF = 0.2; //bolsas de portland por m²
const ARENA_COEF = 0.03; // metros cúbicos de arena por m²
const LADRILLOS_COEF = 60; // cantidad de ladrillos por m²

//pido y valido las dimensiones
function pedirDimensiones() {
  const largoUsuario = prompt("Ingrese el largo en metros:");
  if (largoUsuario === null) return null;
  const anchoDato = prompt("Ingrese el ancho en metros:");
  if (anchoDato === null) return null;

  const largo = parseFloat(largoUsuario);
  const ancho = parseFloat(anchoDato);

  if (isNaN(largo) || isNaN(ancho) || largo <= 0 || ancho <= 0) {
    alert("Dimensiones inválidas. Ingresa números mayores a 0.");
    return pedirDimensiones();
  }
  return { largo, ancho };
}

//calculo área y materiales
function calcularCantidades({ largo, ancho }) {
  const area = largo * ancho;
  const portland = area * PORTLAND_COEF;
  const arena = area * ARENA_COEF;
  const ladrillos = area * LADRILLOS_COEF;
  return { area, portland, arena, ladrillos };
}

//muestro los resultados por alert y consola
function mostrarResultados({ area, portland, arena, ladrillos }) {
  const mensaje =
    `Para ${area.toFixed(2)} m² necesitas:\n` +
    `- ${portland.toFixed(2)} bolsas de portland\n` +
    `- ${arena.toFixed(2)} m³ de arena\n` +
    `- ${ladrillos.toFixed(0)} ladrillos`;//acá el toFixed es cero porque lo ideal es hablar de ladrillos enteros 
  alert(mensaje);
  console.log(mensaje);
}

// función principal
function calcularMateriales() {
  let repetir = true;
  while (repetir) {
    const dimensiones = pedirDimensiones();
    if (!dimensiones) break;
    const resultado = calcularCantidades(dimensiones);
    mostrarResultados(resultado);
    repetir = confirm("¿Desea realizar otro cálculo?");
  }
}

calcularMateriales();
