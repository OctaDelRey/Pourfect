document.addEventListener("DOMContentLoaded", () => {
  const pantallas = document.querySelectorAll(".pantalla");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const modal = document.getElementById("modal");
  const cerrarModal = document.getElementById("cerrarModal");

  function cambiarPantalla(n) {
    pantallas.forEach((p, i) => p.classList.toggle("activa", i === n-1));
  }

  document.getElementById("pantalla1").addEventListener("click", () => cambiarPantalla(2));
  document.addEventListener("keydown", (e) => {
  // Solo cambiar a pantalla2 si estoy en pantalla1
  const pantalla1Activa = document.getElementById("pantalla1").classList.contains("activa");
  if (pantalla1Activa) {
    cambiarPantalla(2);
  }
});
  btnSiguiente.addEventListener("click", () => cambiarPantalla(3));

  cerrarModal.addEventListener("click", () => modal.style.display = "none");

  fetch("datos/tragos.json")
    .then(res => res.json())
    .then(tragos => mostrarTragos(tragos));

  function mostrarTragos(tragos) {
    const lista = document.getElementById("lista-tragos");
    const busqueda = document.getElementById("busqueda");
    const filtro = document.getElementById("filtro");

    function render() {
      const texto = busqueda.value.toLowerCase();
      const tipo = filtro.value;
      lista.innerHTML = "";
      tragos.filter(t => 
        (tipo === "todos" || t.tipo === tipo) && 
        t.nombre.toLowerCase().includes(texto)
      ).forEach(t => {
        const div = document.createElement("div");
        div.className = "trago";
       div.innerHTML = `
  <img src="imagenes/${t.imagen}" alt="${t.nombre}">
  <h3>${t.nombre}</h3>
  <div class="estrellas" data-trago="${t.nombre}">
    ${crearEstrellas(t.nombre)}
  </div>
`;

        div.onclick = () => abrirModal(t);
        lista.appendChild(div);
      });
    }
    busqueda.addEventListener("input", render);
    filtro.addEventListener("change", render);
    render();
  function abrirModal(trago) {
  document.getElementById("modalTitulo").textContent = trago.nombre;
  document.getElementById("modalImagen").src = "imagenes/" + trago.imagen;
  document.getElementById("modalDescripcion").textContent = trago.descripcion;

  const ul = document.getElementById("modalIngredientes");
  ul.innerHTML = "";
  trago.ingredientes.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  });

  // Mostrar estrellas en el modal
  const modalEstrellas = document.getElementById("modalEstrellas");
  modalEstrellas.innerHTML = `
    <h3>Puntuación</h3>
    <div class="estrellas" data-trago="${trago.nombre}">
      ${crearEstrellas(trago.nombre)}
    </div>
  `;

  modal.style.display = "block";
}

  }

  function abrirModal(trago) {
    document.getElementById("modalTitulo").textContent = trago.nombre;
    document.getElementById("modalImagen").src = "imagenes/" + trago.imagen;
    document.getElementById("modalDescripcion").textContent = trago.descripcion;
    const ul = document.getElementById("modalIngredientes");
    ul.innerHTML = "";
    trago.ingredientes.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ul.appendChild(li);
    });
    modal.style.display = "block";
  }
});
// Mostrar formulario login o registro
function mostrarLogin() {
  const formDiv = document.getElementById("formularios");
  formDiv.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <input type="email" id="loginEmail" placeholder="Email"><br>
    <input type="password" id="loginPass" placeholder="Contraseña"><br>
    <button onclick="login()">Entrar</button>
  `;
}

function mostrarRegistro() {
  const formDiv = document.getElementById("formularios");
  formDiv.innerHTML = `
    <h2>Registro</h2>
    <input type="text" id="regNombre" placeholder="Nombre"><br>
    <input type="email" id="regEmail" placeholder="Email"><br>
    <input type="password" id="regPass" placeholder="Contraseña"><br>
    <button onclick="registrar()">Crear Cuenta</button>
  `;
}

// Guardar usuario en localStorage
function registrar() {
  const nombre = document.getElementById("regNombre").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;

  if (!nombre || !email || !pass) {
    alert("Por favor completa todos los campos");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuarios.find(u => u.email === email)) {
    alert("Ese email ya está registrado");
    return;
  }

  usuarios.push({ nombre, email, pass });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso, ahora puedes iniciar sesión");
  mostrarLogin();
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let usuario = usuarios.find(u => u.email === email && u.pass === pass);

  if (usuario) {
    alert("Bienvenido " + usuario.nombre + " 🎉");
    document.getElementById("formularios").innerHTML = "";
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
    document.getElementById("pantalla4").classList.add("activa");
  } else {
    alert("Email o contraseña incorrectos");
  }
}
// Genera las estrellas de un trago según la puntuación guardada
function crearEstrellas(nombreTrago) {
  let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || {};
  let puntuacion = puntuaciones[nombreTrago] || 0;

  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="estrella ${i <= puntuacion ? "activa" : ""}" data-valor="${i}">&#9733;</span>`;
  }
  return html;
}

// Maneja clic en una estrella
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("estrella")) {
    const valor = parseInt(e.target.dataset.valor);
    const trago = e.target.parentElement.dataset.trago;

    let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || {};
    puntuaciones[trago] = valor;
    localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));

    // Actualizar las estrellas de ese trago
    e.target.parentElement.innerHTML = crearEstrellas(trago);
  }
});