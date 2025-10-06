// --------------------
// Variables globales
// --------------------
let usuarioActivo = null;

// --------------------
// Manejo de pantallas
// --------------------
function cambiarPantalla(destino) {
  let id = (typeof destino === "number") ? "pantalla" + destino : destino;

  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));

  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add("activa");
  } else {
    console.error("Pantalla no encontrada:", id);
  }

  // mostrar u ocultar header
  const topbar = document.getElementById("topbar");
  if (id === "pantalla1") {
    topbar.style.display = "none";
  } else {
    topbar.style.display = "flex";
  }

  // Cargar tragos cuando se accede a la pantalla 4
  if (id === "pantalla4") {
    cargarTragosAPI();
  }
}

// --------------------
// Pantalla inicial
// --------------------
function activarPantallaInicial() {
  const salirPantalla1 = () => {
    cambiarPantalla(3); // ahora va directo a login/registro
    document.removeEventListener("keydown", salirPantalla1);
    document.removeEventListener("click", salirPantalla1);
  };
  document.addEventListener("keydown", salirPantalla1);
  document.addEventListener("click", salirPantalla1);
}

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

async function hacerLogin() {
  const usuario = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  
  // Validaciones de seguridad
  if (!usuario || !pass) {
    alert("Por favor completa todos los campos");
    return;
  }
  
  if (usuario.length < 3) {
    alert("El nombre de usuario debe tener al menos 3 caracteres");
    return;
  }
  
  if (usuario.length > 20) {
    alert("El nombre de usuario no puede tener más de 20 caracteres");
    return;
  }
  
  if (pass.length < 4) {
    alert("La contraseña debe tener al menos 4 caracteres");
    return;
  }
  
  // Validar caracteres permitidos
  if (!/^[a-zA-Z0-9_]+$/.test(usuario)) {
    alert("El nombre de usuario solo puede contener letras, números y guiones bajos");
    return;
  }
  
  try {
    // Intentar login con API
    if (typeof handleLogin === 'function') {
      const user = await handleLogin(usuario, pass);
      alert("¡Bienvenido/a " + user.usuario + "!");
      iniciarSesion(user);
    } else {
      // Fallback a método local si no hay API
      const usuarioData = {
        usuario: usuario,
        foto: 'avatar.png',
        bio: 'Usuario de Pourfect'
      };
      alert("¡Bienvenido/a " + usuario + "!");
      iniciarSesion(usuarioData);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function hacerRegistro() {
  const usuario = document.getElementById("regUser").value.trim();
  const pass = document.getElementById("regPass").value;
  
  // Validaciones de seguridad
  if (!usuario || !pass) {
    alert("Por favor completa todos los campos");
    return;
  }
  
  if (usuario.length < 3) {
    alert("El nombre de usuario debe tener al menos 3 caracteres");
    return;
  }
  
  if (usuario.length > 20) {
    alert("El nombre de usuario no puede tener más de 20 caracteres");
    return;
  }
  
  if (pass.length < 4) {
    alert("La contraseña debe tener al menos 4 caracteres");
    return;
  }
  
  if (pass.length > 50) {
    alert("La contraseña no puede tener más de 50 caracteres");
    return;
  }
  
  // Validar caracteres permitidos en nombre de usuario
  if (!/^[a-zA-Z0-9_]+$/.test(usuario)) {
    alert("El nombre de usuario solo puede contener letras, números y guiones bajos");
    return;
  }
  
  // Verificar que la contraseña no sea demasiado simple
  if (pass === usuario) {
    alert("La contraseña no puede ser igual al nombre de usuario");
    return;
  }
  
  try {
    // Intentar registro con API
    if (typeof handleRegister === 'function') {
      const user = await handleRegister(usuario, pass);
      alert("¡Cuenta creada con éxito!");
      iniciarSesion(user);
    } else {
      // Fallback a método local si no hay API
      const usuarioData = {
        usuario: usuario,
        foto: 'avatar.png',
        bio: 'Nuevo usuario de Pourfect'
      };
  alert("¡Cuenta creada con éxito!");
      iniciarSesion(usuarioData);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// --------------------
// Renderizado de tragos
// --------------------
function renderTragos(lista, destinoId = "lista-tragos") {
  const cont = document.getElementById(destinoId);
  if (!cont) {
    console.error("Contenedor no encontrado:", destinoId);
    return;
  }
  
  cont.innerHTML = "";
  lista.forEach(t => {
    const card = document.createElement("div");
    card.className = "trago";
    card.innerHTML = `
      <img src="imagenes/${t.imagen}" alt="${t.nombre}" class="thumb" onerror="this.src='imagenes/placeholder.jpg'">
      <div class="content">
        <h3>${t.nombre}</h3>
        <p>${t.descripcion}</p>
        <div class="actions">
          <button class="btn btn-fav" onclick='toggleFavoritoAPI(${t.id}, "${t.nombre}")'>
            ${t.is_favorite ? "Quitar ⭐" : "Favorito ⭐"}
          </button>
        </div>
      </div>`;
    card.addEventListener("click", e => {
      if (!e.target.classList.contains("btn-fav")) {
        openModal(t);
      }
    });
    cont.appendChild(card);
  });
}

// --------------------
// Modal detalle trago
// --------------------
function openModal(trago) {
  document.getElementById("modalTitulo").textContent = trago.nombre;
  document.getElementById("modalImagen").src = "imagenes/" + trago.imagen;
  document.getElementById("modalImagen").onerror = function() {
    this.src = 'imagenes/placeholder.jpg';
  };
  document.getElementById("modalDescripcion").textContent = trago.descripcion;

  const ul = document.getElementById("modalIngredientes");
  ul.innerHTML = "";
  trago.ingredientes.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  });

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
// Cerrar modal
// --------------------
function cerrarModal() {
  document.getElementById("modal").classList.remove("show");
}

// --------------------
// Estrellas de puntaje
// --------------------
function renderEstrellas(tragoNombre) {
  const cont = document.getElementById("modalEstrellas");
  cont.innerHTML = "<h4>Puntaje</h4>";
  const wrap = document.createElement("div");
  wrap.className = "estrellas";
  let rating = parseInt(localStorage.getItem("rating_" + tragoNombre) || 0);
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "estrella" + (i <= rating ? " activa" : "");
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
  
  // Actualizar la vista actual
  if (typeof tragos !== 'undefined') {
  renderTragos(tragos);
  }
}

function isFavorito(nombre) {
  let favs = JSON.parse(localStorage.getItem("favoritos") || "[]");
  return favs.includes(nombre);
}

// --------------------
// Búsqueda y filtro
// --------------------
function filtrarTragos() {
  if (typeof tragos === 'undefined') {
    console.error("Array de tragos no disponible");
    return;
  }
  
  const texto = document.getElementById("busqueda").value.toLowerCase();
  const tipo = document.getElementById("filtro").value;
  let filtrados = tragos.filter(t =>
    t.nombre.toLowerCase().includes(texto) &&
    (tipo === "todos" || t.tipo === tipo)
  );
  renderTragos(filtrados);
}

// --------------------
// Perfil
// --------------------
function mostrarPerfil() {
  cambiarPantalla('pantallaPerfil');
  usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null') || {
    usuario: 'Invitado',
    foto: 'avatar.png',
    bio: ''
  };
  
  // Restaurar el HTML original del perfil si estaba en modo edición
  const perfilTop = document.querySelector('.perfil-top');
  if (perfilTop && perfilTop.innerHTML.includes('form-card')) {
    perfilTop.innerHTML = `
      <img id="perfilFoto" src="imagenes/avatar.png" alt="Foto de perfil" class="perfil-foto">
      <div class="perfil-meta">
        <p id="perfilUsuario">@usuario</p>
        <p id="perfilBio">Biografía (máx 30 caracteres)</p>
        <div class="perfil-buttons">
          <button id="btnVerFavoritos" class="btn">Mis Favoritos</button>
          <button id="btnEditarPerfil" class="btn">Editar perfil</button>
          <button id="btnInfoGeneral" onclick="cambiarPantalla('pantallaInfo')" class="btn">Info. sobre tragos</button>
          <button onclick="cerrarSesion()" class="btn" style="background: #666;">Cerrar sesión</button>
        </div>
      </div>
    `;
  }
  
  // Cargar imagen del usuario
  let imagenSrc = 'imagenes/avatar.png';
  if (usuarioActivo.foto && usuarioActivo.foto !== 'avatar.png') {
    // Si es una imagen personalizada, intentar cargarla desde localStorage
    const imagenBase64 = localStorage.getItem('userImage_' + usuarioActivo.foto);
    if (imagenBase64) {
      imagenSrc = imagenBase64;
    } else {
      imagenSrc = 'imagenes/' + usuarioActivo.foto;
    }
  }
  
  document.getElementById('perfilFoto').src = imagenSrc;
  document.getElementById('perfilUsuario').textContent = '@' + (usuarioActivo.usuario || 'invitado');
  document.getElementById('perfilBio').textContent = (usuarioActivo.bio || 'Sin biografía').slice(0, 30);
  mostrarFavoritosPerfil();
  
  // Configurar botón de editar perfil
  const btnEditar = document.getElementById('btnEditarPerfil');
  if (btnEditar) {
    btnEditar.onclick = mostrarFormularioEditarPerfil;
  }
  
  // Configurar botón de ver favoritos
  const btnFavoritos = document.getElementById('btnVerFavoritos');
  if (btnFavoritos) {
    btnFavoritos.onclick = mostrarFavoritosPerfil;
  }
  
  // Agregar botón de volver al menú
  const perfilButtons = document.querySelector('.perfil-buttons');
  if (perfilButtons && !document.getElementById('btnVolverMenu')) {
    const btnVolver = document.createElement('button');
    btnVolver.id = 'btnVolverMenu';
    btnVolver.className = 'btn';
    btnVolver.innerHTML = '← Volver al menú';
    btnVolver.onclick = () => cambiarPantalla('pantalla4');
    btnVolver.style.background = '#666';
    perfilButtons.insertBefore(btnVolver, perfilButtons.firstChild);
  }
}

function mostrarFavoritosPerfil() {
  // Usar API si está disponible
  if (typeof cargarFavoritosAPI === 'function') {
    cargarFavoritosAPI();
  } else {
    // Fallback a método local
    if (typeof tragos === 'undefined') {
      console.error("Array de tragos no disponible");
      return;
    }
    
  const lista = JSON.parse(localStorage.getItem('favoritos') || '[]');
  const favs = tragos.filter(t => lista.includes(t.nombre));
  renderTragos(favs, 'perfilFavoritos');
  }
}

function mostrarFormularioEditarPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
  
  const formulario = `
    <div class="form-card" style="max-width: 400px;">
      <h3>Editar Perfil</h3>
      <input type="text" id="editUsuario" placeholder="Usuario" value="${usuario.usuario || ''}">
      <textarea id="editBio" placeholder="Biografía (máx 100 caracteres)" maxlength="100">${usuario.bio || ''}</textarea>
      <input type="file" id="editFoto" accept=".jpg,.jpeg,.png" title="Solo archivos JPG y PNG">
      <small style="color: #666; font-size: 0.8rem;">Formatos permitidos: JPG, PNG</small>
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button class="btn" onclick="guardarPerfil()" style="flex: 1;">Guardar</button>
        <button class="btn" onclick="cancelarEdicionPerfil()" style="flex: 1; background: #666;">Cancelar</button>
      </div>
    </div>
  `;
  
  document.querySelector('.perfil-top').innerHTML = formulario;
}

async function guardarPerfil() {
  const nuevoUsuario = document.getElementById('editUsuario').value.trim();
  const nuevaBio = document.getElementById('editBio').value.trim();
  const nuevaFoto = document.getElementById('editFoto').files[0];
  
  // Validaciones de seguridad
  if (!nuevoUsuario) {
    alert('El nombre de usuario es obligatorio');
    return;
  }
  
  if (nuevoUsuario.length < 3) {
    alert('El nombre de usuario debe tener al menos 3 caracteres');
    return;
  }
  
  if (nuevoUsuario.length > 20) {
    alert('El nombre de usuario no puede tener más de 20 caracteres');
    return;
  }
  
  // Validar caracteres permitidos en nombre de usuario
  if (!/^[a-zA-Z0-9_]+$/.test(nuevoUsuario)) {
    alert('El nombre de usuario solo puede contener letras, números y guiones bajos');
    return;
  }
  
  if (nuevaBio.length > 100) {
    alert('La biografía no puede tener más de 100 caracteres');
    return;
  }
  
  let nombreFoto = 'avatar.png';
  
  // Si se seleccionó una imagen, procesarla
  if (nuevaFoto) {
    // Verificar tamaño del archivo (máximo 2MB)
    if (nuevaFoto.size > 2 * 1024 * 1024) {
      alert('La imagen no puede ser mayor a 2MB');
      return;
    }
    
    // Verificar que sea JPG o PNG
    const extension = nuevaFoto.name.toLowerCase().split('.').pop();
    if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
      alert('Solo se permiten archivos JPG y PNG');
      return;
    }
    
    // Verificar que el archivo sea realmente una imagen
    if (!nuevaFoto.type.startsWith('image/')) {
      alert('El archivo seleccionado no es una imagen válida');
      return;
    }
    
    // Crear un nombre único y seguro para la imagen
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    nombreFoto = `user_${timestamp}_${randomId}.${extension}`;
    
    // Guardar la imagen en localStorage como base64
    const reader = new FileReader();
    reader.onload = function(e) {
      // Limpiar imágenes anteriores del usuario
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('userImage_') && key !== 'userImage_' + nombreFoto) {
          localStorage.removeItem(key);
        }
      });
      
      localStorage.setItem('userImage_' + nombreFoto, e.target.result);
    };
    reader.readAsDataURL(nuevaFoto);
  }
  
  try {
    // Intentar actualizar con API
    if (typeof updateProfileAPI === 'function') {
      await updateProfileAPI(nuevoUsuario, nuevaBio);
    }
    
    // Actualizar datos locales
    const usuarioActualizado = {
      usuario: nuevoUsuario,
      bio: nuevaBio,
      foto: nombreFoto
    };
    
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
    usuarioActivo = usuarioActualizado;
    
    // Actualizar inmediatamente el avatar en el botón de perfil
    actualizarHeader();
    
    // Mostrar mensaje de éxito con emoji
    alert('✅ Perfil actualizado correctamente');
    mostrarPerfil(); // Recargar el perfil
    
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    alert('Error: ' + error.message);
  }
}

function cancelarEdicionPerfil() {
  mostrarPerfil(); // Volver al perfil normal
}

// --------------------
// Sesión
// --------------------
function iniciarSesion(usuario) {
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  usuarioActivo = usuario;
  actualizarHeader();
  cambiarPantalla('pantalla4');
}

async function cerrarSesion() {
  try {
    // Intentar logout con API
    if (typeof handleLogout === 'function') {
      await handleLogout();
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar datos locales siempre
  localStorage.removeItem('usuarioActivo');
    usuarioActivo = null;
  actualizarHeader();
    cambiarPantalla(3); // Volver a login/registro
  }
}

function actualizarHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  const navSearch = document.querySelector('.nav-search');
  
  // Mostrar/ocultar botones de login/registro
  document.getElementById('btnLogin').classList.toggle('oculto', !!usuario);
  document.getElementById('btnRegistro').classList.toggle('oculto', !!usuario);
  
  // Mostrar/ocultar botones de perfil/cerrar sesión
  document.getElementById('btnPerfil').classList.toggle('oculto', !usuario);
  document.getElementById('btnCerrar').classList.toggle('oculto', !usuario);
  
  // Mostrar/ocultar barra de búsqueda
  if (navSearch) {
    navSearch.classList.toggle('oculto', !usuario);
  }
  
  // Actualizar avatar del usuario si está logueado
  if (usuario) {
    const btnPerfil = document.getElementById('btnPerfil');
    if (btnPerfil) {
      // Cargar imagen del usuario
      let imagenSrc = 'imagenes/avatar.png';
      if (usuario.foto && usuario.foto !== 'avatar.png') {
        const imagenBase64 = localStorage.getItem('userImage_' + usuario.foto);
        if (imagenBase64) {
          imagenSrc = imagenBase64;
        } else {
          imagenSrc = 'imagenes/' + usuario.foto;
        }
      }
      
      btnPerfil.innerHTML = `
        <img src="${imagenSrc}" alt="Avatar" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px;">
        Perfil
      `;
    }
  } else {
    const btnPerfil = document.getElementById('btnPerfil');
    if (btnPerfil) {
      btnPerfil.innerHTML = 'Perfil';
    }
  }
}

// --------------------
// Cargar tragos desde API
// --------------------
async function cargarTragosAPI() {
  try {
    // Intentar cargar desde API
    if (typeof loadDrinksFromAPI === 'function') {
      const tragos = await loadDrinksFromAPI();
      renderTragos(tragos);
    } else {
      // Fallback a datos locales
      if (typeof tragos !== 'undefined') {
        renderTragos(tragos);
      }
    }
  } catch (error) {
    console.error('Error cargando tragos:', error);
    // Fallback a datos locales
    if (typeof tragos !== 'undefined') {
      renderTragos(tragos);
    }
  }
}

// --------------------
// Toggle favorito con API
// --------------------
async function toggleFavoritoAPI(drinkId, drinkName) {
  try {
    // Intentar con API
    if (typeof toggleFavoriteAPI === 'function') {
      const isFavorite = await toggleFavoriteAPI(drinkId, drinkName);
      // Recargar la lista para reflejar cambios
      cargarTragosAPI();
      return isFavorite;
    } else {
      // Fallback a método local
      return toggleFavorito(drinkName);
    }
  } catch (error) {
    console.error('Error toggleando favorito:', error);
    // Fallback a método local
    return toggleFavorito(drinkName);
  }
}

// --------------------
// Calificar trago con API
// --------------------
async function calificarTragoAPI(drinkId, rating) {
  try {
    // Intentar con API
    if (typeof rateDrinkAPI === 'function') {
      return await rateDrinkAPI(drinkId, rating);
    } else {
      // Fallback a método local
      return true;
    }
  } catch (error) {
    console.error('Error calificando trago:', error);
    return false;
  }
}

// --------------------
// Cargar favoritos desde API
// --------------------
async function cargarFavoritosAPI() {
  try {
    // Intentar cargar desde API
    if (typeof loadFavoritesFromAPI === 'function') {
      const favoritos = await loadFavoritesFromAPI();
      renderTragos(favoritos, 'perfilFavoritos');
    } else {
      // Fallback a método local
      mostrarFavoritosPerfil();
    }
  } catch (error) {
    console.error('Error cargando favoritos:', error);
    // Fallback a método local
    mostrarFavoritosPerfil();
  }
}

// --------------------
// Agregar trago con API
// --------------------
async function agregarTragoAPI(drinkData) {
  try {
    // Intentar con API
    if (typeof addDrinkToAPI === 'function') {
      const drinkId = await addDrinkToAPI(drinkData);
      alert("Trago agregado con éxito!");
      cargarTragosAPI(); // Recargar lista
      return drinkId;
    } else {
      // Fallback a método local
      if (typeof tragos !== 'undefined') {
        tragos.push(drinkData);
        localStorage.setItem('tragos', JSON.stringify(tragos));
        alert("Trago agregado con éxito!");
        cargarTragosAPI();
      }
    }
  } catch (error) {
    console.error('Error agregando trago:', error);
    alert("Error: " + error.message);
  }
}

// --------------------
// Seguridad y limpieza
// --------------------
function limpiarDatosAntiguos() {
  // Limpiar imágenes antiguas del localStorage
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('userImage_')) {
      const timestamp = key.split('_')[1];
      const fechaImagen = new Date(parseInt(timestamp));
      const fechaActual = new Date();
      const diferenciaDias = (fechaActual - fechaImagen) / (1000 * 60 * 60 * 24);
      
      // Eliminar imágenes más antiguas de 30 días
      if (diferenciaDias > 30) {
        localStorage.removeItem(key);
      }
    }
  });
}

function validarEntrada(entrada, tipo) {
  if (tipo === 'usuario') {
    return /^[a-zA-Z0-9_]{3,20}$/.test(entrada);
  }
  if (tipo === 'password') {
    return entrada.length >= 4 && entrada.length <= 50;
  }
  if (tipo === 'bio') {
    return entrada.length <= 100;
  }
  return false;
}

// --------------------
// Inicialización
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Limpiar sesión previa al cargar para evitar estado confuso
  localStorage.removeItem('usuarioActivo');
  
  // Limpiar datos antiguos
  limpiarDatosAntiguos();
  
  // Inicializar pantalla
  activarPantallaInicial();
  
  // Configurar eventos del modal
  document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
  
  // Configurar eventos de búsqueda
  const busqueda = document.getElementById("busqueda");
  const filtro = document.getElementById("filtro");
  
  if (busqueda) {
    busqueda.addEventListener("input", filtrarTragos);
  }
  if (filtro) {
    filtro.addEventListener("change", filtrarTragos);
  }
  
  // Configurar formulario de agregar trago
  const formAgregar = document.getElementById("formAgregarTrago");
  if (formAgregar) {
    formAgregar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
        const nuevoTrago = {
          nombre: formData.get('nombre'),
          descripcion: formData.get('descripcion'),
          tipo: formData.get('tipo'),
          imagen: 'placeholder.jpg', // En una app real subirías la imagen
          ingredientes: formData.get('ingredientes').split(',').map(i => i.trim()),
          pasos: formData.get('pasos').split('\n').map(p => p.trim()).filter(p => p)
        };
        
        // Intentar agregar con API
        if (typeof agregarTragoAPI === 'function') {
          await agregarTragoAPI(nuevoTrago);
        } else {
          // Fallback a método local
          if (typeof tragos !== 'undefined') {
            tragos.push(nuevoTrago);
            localStorage.setItem('tragos', JSON.stringify(tragos));
          }
          alert("Trago agregado con éxito!");
          cargarTragosAPI();
        }
        
        e.target.reset();
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }
  
  // Cargar tragos cuando se accede a la pantalla 4
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const pantalla4 = document.getElementById('pantalla4');
        if (pantalla4 && pantalla4.classList.contains('activa')) {
          if (typeof tragos !== 'undefined') {
            renderTragos(tragos);
          }
        }
      }
    });
  });
  
  // Observar cambios en las pantallas
  document.querySelectorAll('.pantalla').forEach(pantalla => {
    observer.observe(pantalla, { attributes: true });
  });
  
  // Actualizar header
  actualizarHeader();
  
  // Cerrar modal al hacer clic fuera
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      cerrarModal();
    }
  });
});