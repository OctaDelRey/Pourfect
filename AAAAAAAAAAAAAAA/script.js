// --------------------
// Variables globales
// --------------------
let usuarioActivo = null;

// --------------------
// Manejo de pantallas
// --------------------
function cambiarPantalla(destino) {
  let id = (typeof destino === "number") ? "pantalla" + destino : destino;

  // Verificar que el DOM esté listo
  if (!document.querySelectorAll(".pantalla").length) {
    console.warn("DOM no está listo, reintentando en 100ms...");
    setTimeout(() => cambiarPantalla(destino), 100);
    return;
  }

  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));

  const pantalla = document.getElementById(id);
  if (pantalla) {
    pantalla.classList.add("activa");
  } else {
    console.error("Pantalla no encontrada:", id);
    console.log("Pantallas disponibles:", Array.from(document.querySelectorAll(".pantalla")).map(p => p.id));
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
      <button class="close-form-btn" onclick="cerrarFormularios()" title="Cerrar">✕</button>
      <h3>Login</h3>
      <input type="text" id="loginUser" placeholder="Usuario">
      <input type="password" id="loginPass" placeholder="Contraseña">
      <button class="btn" onclick="hacerLogin()">Ingresar</button>
    </div>`;
}

function mostrarRegistro() {
  document.getElementById("formularios").innerHTML = `
    <div class="form-card">
      <button class="close-form-btn" onclick="cerrarFormularios()" title="Cerrar">✕</button>
      <h3>Registrarse</h3>
      <input type="text" id="regUser" placeholder="Usuario">
      <input type="password" id="regPass" placeholder="Contraseña">
      <button class="btn" onclick="hacerRegistro()">Crear cuenta</button>
    </div>`;
}

function cerrarFormularios() {
  document.getElementById("formularios").innerHTML = '';
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
  
  // Validar que lista sea un array
  if (!Array.isArray(lista)) {
    console.error("Lista no es un array:", lista);
    cont.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>Error cargando favoritos</p>";
    return;
  }
  
  cont.innerHTML = "";
  
  // Mostrar mensaje si no hay favoritos
  if (lista.length === 0) {
    cont.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>No tienes favoritos aún</p>";
    return;
  }
  
  lista.forEach(t => {
    // Verificar si es favorito (tanto para API como local)
    const isFavorite = t.is_favorite || isFavorito(t.nombre);
    
    const card = document.createElement("div");
    card.className = "trago";
    card.innerHTML = `
      <img src="imagenes/${t.imagen}" alt="${t.nombre}" class="thumb" onerror="this.src='imagenes/placeholder.jpg'">
      <div class="content">
        <h3>${t.nombre}</h3>
        <p>${t.descripcion}</p>
        <div class="actions">
          <button class="btn-fav" onclick='toggleFavoritoAPI(${t.id || 0}, "${t.nombre}")' title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            ${isFavorite ? "❤️" : "🤍"}
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

  renderEstrellas(trago);
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
function renderEstrellas(trago) {
  const cont = document.getElementById("modalEstrellas");
  cont.innerHTML = "<h4>Calificación</h4>";
  
  // Mostrar promedio de calificaciones
  const promedio = trago.promedio || 0;
  const totalCalificaciones = trago.total_calificaciones || 0;
  
  const infoDiv = document.createElement("div");
  infoDiv.innerHTML = `
    <p style="margin: 5px 0; color: #666;">
      ⭐ Promedio: ${promedio.toFixed(1)}/5 (${totalCalificaciones} calificaciones)
    </p>
  `;
  cont.appendChild(infoDiv);
  
  // Estrellas para calificar
  const wrap = document.createElement("div");
  wrap.className = "estrellas";
  wrap.innerHTML = "<small>Tu calificación:</small>";
  
  let miRating = parseInt(localStorage.getItem("rating_" + trago.nombre) || 0);
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "estrella" + (i <= miRating ? " activa" : "");
    star.textContent = "★";
    star.onclick = async () => {
      localStorage.setItem("rating_" + trago.nombre, i);
      // Intentar guardar en API
      await calificarTragoAPI(trago.id || 0, i);
      renderEstrellas(trago);
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
  
  let filtrados = tragos.filter(t => {
    const coincideTexto = t.nombre.toLowerCase().includes(texto);
    
    if (tipo === "todos") return coincideTexto;
    if (tipo === "con-alcohol") return coincideTexto && t.tipo === "con-alcohol";
    if (tipo === "sin-alcohol") return coincideTexto && t.tipo === "sin-alcohol";
    if (tipo === "postre") return coincideTexto && t.tipo === "postre";
    if (tipo === "shot") return coincideTexto && t.tipo === "shot";
    if (tipo === "tropical") return coincideTexto && esTropical(t);
    if (tipo === "clasico") return coincideTexto && esClasico(t);
    if (tipo === "trending") return coincideTexto && esTrending(t);
    
    return coincideTexto;
  });
  
  renderTragos(filtrados);
}

// Funciones auxiliares para categorizar tragos
function esTropical(trago) {
  const ingredientesTropicales = ['piña', 'coco', 'mango', 'maracuyá', 'toronja', 'grapefruit', 'tropical'];
  const descripcionTropical = trago.descripcion.toLowerCase();
  const ingredientes = trago.ingredientes.join(' ').toLowerCase();
  
  return ingredientesTropicales.some(ing => 
    descripcionTropical.includes(ing) || ingredientes.includes(ing)
  ) || ['Blue Lagoon', 'Sex on the Beach', 'Piña Colada', 'Malibu'].includes(trago.nombre);
}

function esClasico(trago) {
  const clasicos = ['Mojito', 'Margarita', 'Martini', 'Negroni', 'Daiquiri', 'Gin Tonic', 'Cuba Libre', 'Vesper (James Bond)', 'White Russian (The Big Lebowski)', 'The Godfather', 'Blood and Sand', 'Bronx Cocktail'];
  return clasicos.includes(trago.nombre);
}

function esTrending(trago) {
  const trending = ['Espresso Martini', 'Whiskey Highball', 'Paloma Picante', 'Dark \'N\' Stormy', 'Fernet con Coca', 'Gancia con Sprite', 'Caipiroska'];
  return trending.includes(trago.nombre);
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
    
    // Agregar datos de calificaciones y favoritos como en el menú principal
    const favsConCalificaciones = favs.map(trago => ({
      ...trago,
      promedio: Math.random() * 2 + 3, // Promedio entre 3-5
      total_calificaciones: Math.floor(Math.random() * 50) + 10, // 10-60 calificaciones
      is_favorite: true // Los favoritos siempre están marcados como favoritos
    }));
    
    renderTragos(favsConCalificaciones, 'perfilFavoritos');
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
  
  // Mostrar/ocultar botón de búsqueda de usuarios
  const btnBuscarUsuarios = document.getElementById('btnBuscarUsuarios');
  if (btnBuscarUsuarios) {
    btnBuscarUsuarios.classList.toggle('oculto', !usuario);
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
        <img src="${imagenSrc}" alt="Avatar" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px; object-fit: cover;" onerror="this.src='imagenes/avatar.png'">
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
        // Agregar datos de calificaciones simulados para datos locales
        const tragosConCalificaciones = tragos.map(trago => ({
          ...trago,
          promedio: Math.random() * 2 + 3, // Promedio entre 3-5
          total_calificaciones: Math.floor(Math.random() * 50) + 10, // 10-60 calificaciones
          is_favorite: isFavorito(trago.nombre)
        }));
        renderTragos(tragosConCalificaciones);
      }
    }
  } catch (error) {
    console.error('Error cargando tragos:', error);
    // Fallback a datos locales
    if (typeof tragos !== 'undefined') {
      const tragosConCalificaciones = tragos.map(trago => ({
        ...trago,
        promedio: Math.random() * 2 + 3, // Promedio entre 3-5
        total_calificaciones: Math.floor(Math.random() * 50) + 10, // 10-60 calificaciones
        is_favorite: isFavorito(trago.nombre)
      }));
      renderTragos(tragosConCalificaciones);
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
      toggleFavorito(drinkName);
      // Recargar la vista actual
      if (typeof tragos !== 'undefined') {
        renderTragos(tragos);
      }
      return true;
    }
  } catch (error) {
    console.error('Error toggleando favorito:', error);
    // Fallback a método local
    toggleFavorito(drinkName);
    // Recargar la vista actual
    if (typeof tragos !== 'undefined') {
      renderTragos(tragos);
    }
    return true;
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
      // Fallback a método local - guardar en localStorage
      console.log(`Calificación guardada localmente: ${rating} estrellas`);
      return true;
    }
  } catch (error) {
    console.error('Error calificando trago:', error);
    // Fallback a método local
    console.log(`Calificación guardada localmente: ${rating} estrellas`);
    return true;
  }
}

// --------------------
// Cargar favoritos desde API
// --------------------
async function cargarFavoritosAPI() {
  try {
    console.log('Cargando favoritos...');
    
    // Intentar cargar desde API
    if (typeof loadFavoritesFromAPI === 'function') {
      console.log('Usando API para cargar favoritos');
      const favoritos = await loadFavoritesFromAPI();
      console.log('Favoritos cargados desde API:', favoritos);
      renderTragos(favoritos, 'perfilFavoritos');
    } else {
      // Fallback a método local directo
      console.log('Usando método local para cargar favoritos');
      if (typeof tragos === 'undefined') {
        console.error("Array de tragos no disponible");
        return;
      }
      
      const lista = JSON.parse(localStorage.getItem('favoritos') || '[]');
      console.log('Lista de favoritos del localStorage:', lista);
      const favs = tragos.filter(t => lista.includes(t.nombre));
      console.log('Favoritos filtrados:', favs);
      renderTragos(favs, 'perfilFavoritos');
    }
  } catch (error) {
    console.error('Error cargando favoritos:', error);
    // Fallback a método local directo
    if (typeof tragos === 'undefined') {
      console.error("Array de tragos no disponible");
      return;
    }
    
    const lista = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const favs = tragos.filter(t => lista.includes(t.nombre));
    renderTragos(favs, 'perfilFavoritos');
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
// Búsqueda de usuarios
// --------------------
function mostrarBusquedaUsuarios() {
  cambiarPantalla('pantallaBuscarUsuarios');
  // Limpiar resultados anteriores
  document.getElementById('resultadosUsuarios').innerHTML = '';
}

async function buscarUsuarios() {
  const termino = document.getElementById('busquedaUsuarios').value.trim();
  
  if (!termino) {
    alert('Por favor ingresa un término de búsqueda');
    return;
  }
  
  try {
    // Intentar búsqueda con API
    if (typeof searchUsersAPI === 'function') {
      const usuarios = await searchUsersAPI(termino);
      mostrarResultadosUsuarios(usuarios);
    } else {
      // Fallback a búsqueda local simulada
      const usuariosSimulados = generarUsuariosSimulados(termino);
      mostrarResultadosUsuarios(usuariosSimulados);
    }
  } catch (error) {
    console.error('Error buscando usuarios:', error);
    alert('Error al buscar usuarios: ' + error.message);
  }
}

function generarUsuariosSimulados(termino) {
  // Generar usuarios simulados para demostración
  const usuariosBase = [
    { usuario: 'mixologist_pro', bio: 'Especialista en cócteles clásicos', foto: 'avatar.png', tragos: ['Mojito', 'Margarita', 'Martini'] },
    { usuario: 'bartender_creative', bio: 'Creador de cócteles innovadores', foto: 'avatar.png', tragos: ['Cosmopolitan', 'Daiquiri', 'Negroni'] },
    { usuario: 'cocktail_master', bio: 'Maestro de la coctelería', foto: 'avatar.png', tragos: ['Old Fashioned', 'Manhattan', 'Whiskey Sour'] },
    { usuario: 'drink_explorer', bio: 'Explorador de sabores únicos', foto: 'avatar.png', tragos: ['Caipirinha', 'Pina Colada', 'Sangria'] }
  ];
  
  return usuariosBase.filter(u => 
    u.usuario.toLowerCase().includes(termino.toLowerCase()) ||
    u.bio.toLowerCase().includes(termino.toLowerCase())
  );
}

function mostrarResultadosUsuarios(usuarios) {
  const contenedor = document.getElementById('resultadosUsuarios');
  
  if (usuarios.length === 0) {
    contenedor.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No se encontraron usuarios</p>';
    return;
  }
  
  contenedor.innerHTML = '';
  
  usuarios.forEach(usuario => {
    const card = document.createElement('div');
    card.className = 'usuario-card';
    card.onclick = () => verPerfilUsuario(usuario);
    
    // Cargar avatar del usuario
    let avatarSrc = 'imagenes/avatar.png';
    if (usuario.foto && usuario.foto !== 'avatar.png') {
      const imagenBase64 = localStorage.getItem('userImage_' + usuario.foto);
      if (imagenBase64) {
        avatarSrc = imagenBase64;
      } else {
        avatarSrc = 'imagenes/' + usuario.foto;
      }
    }
    
    card.innerHTML = `
      <div class="usuario-header">
        <img src="${avatarSrc}" alt="Avatar" class="usuario-avatar" onerror="this.src='imagenes/avatar.png'">
        <div class="usuario-info">
          <h3>@${usuario.usuario}</h3>
          <p>Miembro desde 2024</p>
        </div>
      </div>
      <div class="usuario-bio">${usuario.bio || 'Sin biografía'}</div>
      <div class="usuario-stats">
        <span>${usuario.tragos ? usuario.tragos.length : 0} tragos creados</span>
        <span>⭐ 4.5 promedio</span>
      </div>
      <div class="usuario-tragos">
        <h4>Tragos creados:</h4>
        <div class="tragos-list">
          ${usuario.tragos ? usuario.tragos.map(trago => `<span class="trago-tag">${trago}</span>`).join('') : '<span>Sin tragos creados</span>'}
        </div>
      </div>
    `;
    
    contenedor.appendChild(card);
  });
}

function verPerfilUsuario(usuario) {
  // Crear modal para mostrar perfil detallado del usuario
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h2>Perfil de @${usuario.usuario}</h2>
        <button onclick="this.closest('.modal').remove()" class="btn" style="background: #666;">✕</button>
      </div>
      <div class="modal-body">
        <div class="usuario-header" style="margin-bottom: 20px;">
          <img src="${usuario.foto && usuario.foto !== 'avatar.png' ? 
            (localStorage.getItem('userImage_' + usuario.foto) || 'imagenes/' + usuario.foto) : 
            'imagenes/avatar.png'}" 
            alt="Avatar" class="usuario-avatar" style="width: 80px; height: 80px;" 
            onerror="this.src='imagenes/avatar.png'">
          <div class="usuario-info">
            <h3>@${usuario.usuario}</h3>
            <p>Miembro desde 2024</p>
            <p>⭐ Promedio: 4.5/5</p>
          </div>
        </div>
        <div class="usuario-bio" style="margin-bottom: 20px;">
          <strong>Biografía:</strong><br>
          ${usuario.bio || 'Sin biografía disponible'}
        </div>
        <div class="usuario-stats" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between;">
            <span>📊 ${usuario.tragos ? usuario.tragos.length : 0} tragos creados</span>
            <span>❤️ ${Math.floor(Math.random() * 50) + 10} favoritos</span>
          </div>
        </div>
        <div class="usuario-tragos">
          <h4>Tragos creados por este usuario:</h4>
          <div class="tragos-list">
            ${usuario.tragos ? usuario.tragos.map(trago => 
              `<span class="trago-tag" onclick="buscarTragoPorUsuario('${trago}', '${usuario.usuario}')">${trago}</span>`
            ).join('') : '<span>Sin tragos creados</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function buscarTragoPorUsuario(nombreTrago, usuario) {
  // Buscar el trago específico creado por el usuario
  alert(`Buscando "${nombreTrago}" creado por @${usuario}\n\nEsta funcionalidad te llevaría a ver los detalles específicos del trago creado por este usuario.`);
  // Aquí podrías implementar la búsqueda específica del trago
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
// Interacciones divertidas para pantalla de login
// --------------------
function initLoginInteractions() {
  // Interacción con las imágenes
  const pant2Image = document.getElementById('pant2Image');
  const tomenImage = document.getElementById('tomenImage');
  
  if (pant2Image) {
    pant2Image.addEventListener('click', () => {
      // Efecto de rotación al hacer clic
      pant2Image.style.transform = 'rotate(5deg) scale(1.1)';
      setTimeout(() => {
        pant2Image.style.transform = 'rotate(0deg) scale(1)';
      }, 300);
      
      // Crear efecto de partículas
      createParticleEffect(pant2Image, '✨');
    });
  }
  
  if (tomenImage) {
    tomenImage.addEventListener('click', () => {
      // Efecto de salto
      tomenImage.style.transform = 'translateY(-10px) scale(1.05)';
      setTimeout(() => {
        tomenImage.style.transform = 'translateY(0) scale(1)';
      }, 200);
      
      // Crear efecto de partículas
      createParticleEffect(tomenImage, '🍸');
    });
  }
}

// Función para crear efecto de partículas
function createParticleEffect(element, emoji) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.textContent = emoji;
    particle.style.position = 'fixed';
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.fontSize = '1.5rem';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.animation = `particleExplosion ${1 + Math.random()}s ease-out forwards`;
    
    // Dirección aleatoria
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 100 + Math.random() * 50;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    particle.style.setProperty('--endX', endX + 'px');
    particle.style.setProperty('--endY', endY + 'px');
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1500);
  }
}

// Función para crear explosión de corazones
function createHeartExplosion(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const hearts = ['❤️', '💚', '💙', '💜', '🧡', '💛'];
  
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'fixed';
    heart.style.left = centerX + 'px';
    heart.style.top = centerY + 'px';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = `heartExplosion ${2 + Math.random()}s ease-out forwards`;
    
    // Dirección aleatoria
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance - 100; // Subir más
    
    heart.style.setProperty('--endX', endX + 'px');
    heart.style.setProperty('--endY', endY + 'px');
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 2500);
  }
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
  
  // Inicializar interacciones de login
  initLoginInteractions();
  
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
  
  // Configurar búsqueda de usuarios
  const busquedaUsuarios = document.getElementById("busquedaUsuarios");
  if (busquedaUsuarios) {
    busquedaUsuarios.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        buscarUsuarios();
      }
    });
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