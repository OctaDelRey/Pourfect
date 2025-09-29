// --------------------
// Manejo de pantallas
// --------------------
function cambiarPantalla(nro) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  const pantallas = ["pantalla1","pantalla2","pantalla3","pantalla4","pantallaFavoritos"];
  const id = nro === "favoritos" ? "pantallaFavoritos" : pantallas[nro-1];
  document.getElementById(id).classList.add("activa");
}
// --------------------
// Pantalla inicial
// --------------------
function activarPantallaInicial() {
  const salirPantalla1 = () => {
    cambiarPantalla(2);
    document.removeEventListener("keydown", salirPantalla1);
    document.removeEventListener("click", salirPantalla1);
  };
  document.addEventListener("keydown", salirPantalla1);
  document.addEventListener("click", salirPantalla1);
}

activarPantallaInicial();

document.getElementById("btnSiguiente").addEventListener("click", () => cambiarPantalla(3));

// --------------------
// Login y registro
// --------------------
function mostrarLogin() {
  document.getElementById("formularios").innerHTML = `
    <div class="form-card">
      <h3>Login</h3>
      <input type="text" id="loginUser" placeholder="Usuario">
      <input type="password" id="loginPass" placeholder="Contraseña">
      <button class="btn" onclick="hacerLogin()">Ingresar</button>
    </div>`;
}
function mostrarRegistro() {
  document.getElementById("formularios").innerHTML = `
    <div class="form-card">
      <h3>Registrarse</h3>
      <input type="text" id="regUser" placeholder="Usuario">
      <input type="password" id="regPass" placeholder="Contraseña">
      <button class="btn" onclick="hacerRegistro()">Crear cuenta</button>
    </div>`;
}
function hacerLogin() {
  alert("¡Bienvenido/a!");
  cambiarPantalla(4);
}
function hacerRegistro() {
  alert("¡Cuenta creada con éxito!");
  cambiarPantalla(4);
}

// --------------------
// Renderizado de tragos
// --------------------
function renderTragos(lista, destinoId="lista-tragos") {
  const cont = document.getElementById(destinoId);
  cont.innerHTML = "";
  lista.forEach(t => {
    const card = document.createElement("div");
    card.className = "trago";
    card.innerHTML = `
      <img src="imagenes/${t.imagen}" alt="${t.nombre}" class="thumb">
      <div class="content">
        <h3>${t.nombre}</h3>
        <p>${t.descripcion}</p>
        <div class="actions">
          <button class="btn btn-fav" onclick='toggleFavorito("${t.nombre}")'>
            ${isFavorito(t.nombre) ? "Quitar ⭐" : "Favorito ⭐"}
          </button>
        </div>
      </div>`;
    // abrir modal al clickear la tarjeta entera
    card.addEventListener("click", e => {
      if (!e.target.classList.contains("btn-fav")) openModal(t);
    });
    cont.appendChild(card);
  });
}
// --------------------
// Cerrar modal
// --------------------
document.getElementById("cerrarModal").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("show");
});
// --------------------
// Modal detalle trago
// --------------------
function openModal(trago) {
  document.getElementById("modalTitulo").textContent = trago.nombre;
  document.getElementById("modalImagen").src = "imagenes/" + trago.imagen;
  document.getElementById("modalDescripcion").textContent = trago.descripcion;

  // Ingredientes
  const ul = document.getElementById("modalIngredientes");
  ul.innerHTML = "";
  trago.ingredientes.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  });

  // Paso a paso
  const ol = document.getElementById("modalPasos");
  ol.innerHTML = "";
  if (trago.pasos) {
    trago.pasos.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      ol.appendChild(li);
    });
  }

  renderEstrellas(trago.nombre);
  document.getElementById("modal").classList.add("show");
}

// --------------------
// Estrellas de puntaje
// --------------------
function renderEstrellas(tragoNombre) {
  const cont = document.getElementById("modalEstrellas");
  cont.innerHTML = "<h4>Puntaje</h4>";
  const wrap = document.createElement("div");
  wrap.className = "estrellas";
  let rating = localStorage.getItem("rating_" + tragoNombre) || 0;
  rating = parseInt(rating);
  for (let i=1;i<=5;i++) {
    const star = document.createElement("span");
    star.className = "estrella" + (i<=rating ? " activa" : "");
    star.textContent = "★";
    star.onclick = () => {
      localStorage.setItem("rating_" + tragoNombre, i);
      renderEstrellas(tragoNombre);
    };
    wrap.appendChild(star);
  }
  cont.appendChild(wrap);
}

// --------------------
// Favoritos
// --------------------
function toggleFavorito(nombre) {
  let favs = JSON.parse(localStorage.getItem("favoritos") || "[]");
  if (favs.includes(nombre)) {
    favs = favs.filter(f => f !== nombre);
  } else {
    favs.push(nombre);
  }
  localStorage.setItem("favoritos", JSON.stringify(favs));
  renderTragos(tragos);
}
function isFavorito(nombre) {
  let favs = JSON.parse(localStorage.getItem("favoritos") || "[]");
  return favs.includes(nombre);
}
document.getElementById("btnFavoritos").addEventListener("click", () => {
  cambiarPantalla("favoritos");
  let favs = JSON.parse(localStorage.getItem("favoritos") || "[]");
  renderTragos(tragos.filter(t => favs.includes(t.nombre)), "lista-favoritos");
});

// --------------------
// Búsqueda y filtro
// --------------------
document.getElementById("busqueda").addEventListener("input", filtrarTragos);
document.getElementById("filtro").addEventListener("change", filtrarTragos);

function filtrarTragos() {
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const tipo = document.getElementById("filtro").value;
  let filtrados = tragos.filter(t =>
    t.nombre.toLowerCase().includes(texto) &&
    (tipo==="todos" || t.tipo===tipo)
  );
  renderTragos(filtrados);
}

// --------------------
// Inicializar
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  renderTragos(tragos);
});
