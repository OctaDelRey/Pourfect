// --------------------
// Variables globales
// --------------------
let usuarioActivo = null;
let catalogoTragos = [];

function normalizarTragoLocal(trago, idx = 0) {
  return {
    id: trago.id || idx + 1000,
    nombre: trago.nombre || 'Trago sin nombre',
    descripcion: trago.descripcion || '',
    tipo: trago.tipo || 'con-alcohol',
    imagen: trago.imagen || 'placeholder.jpg',
    ingredientes: Array.isArray(trago.ingredientes) ? trago.ingredientes : [],
    pasos: Array.isArray(trago.pasos) ? trago.pasos : [],
    promedio: trago.promedio || Math.round((Math.random() * 2 + 3) * 10) / 10,
    total_calificaciones: trago.total_calificaciones || Math.floor(Math.random() * 50) + 10,
    is_favorite: typeof trago.is_favorite !== 'undefined' ? !!trago.is_favorite : isFavorito(trago.nombre || '')
  };
}

function normalizarTragoAPI(trago, fallbackId = 0) {
  const ingredientes =
    Array.isArray(trago.ingredientes) ? trago.ingredientes :
    (Array.isArray(trago.ingredientes_list) ? trago.ingredientes_list :
    (typeof trago.ingredientes === 'string'
      ? trago.ingredientes.split('\n').map(t => t.trim()).filter(Boolean)
      : []));

  const pasos =
    Array.isArray(trago.pasos) ? trago.pasos :
    (typeof trago.pasos === 'string'
      ? trago.pasos.split('\n').map(t => t.trim()).filter(Boolean)
      : []);

  return {
    id: trago.id || fallbackId || Date.now(),
    nombre: trago.nombre || 'Trago sin nombre',
    descripcion: trago.descripcion || '',
    tipo: trago.tipo || 'con-alcohol',
    imagen: trago.imagen || 'placeholder.jpg',
    ingredientes,
    pasos,
    promedio: typeof trago.promedio !== 'undefined'
      ? Number(trago.promedio)
      : (typeof trago.promedio_calificacion !== 'undefined'
        ? Math.round(Number(trago.promedio_calificacion) * 10) / 10
        : 0),
    total_calificaciones: trago.total_calificaciones ? Number(trago.total_calificaciones) : 0,
    is_favorite: typeof trago.is_favorite !== 'undefined' ? !!trago.is_favorite : isFavorito(trago.nombre || '')
  };
}

function storageKey(suffix) {
  const base = suffix || 'app';
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  if (usuario && usuario.usuario) {
    return `${base}_${usuario.usuario}`;
  }
  return `${base}_guest`;
}

function getFavoritosLocales() {
  return JSON.parse(localStorage.getItem(storageKey('favoritos')) || '[]');
}

function saveFavoritosLocales(lista) {
  localStorage.setItem(storageKey('favoritos'), JSON.stringify(lista));
}

function isFavorito(nombre) {
  const lista = getFavoritosLocales();
  return lista.includes(nombre);
}

function toggleFavorito(nombre) {
  const lista = getFavoritosLocales();
  const idx = lista.indexOf(nombre);
  if (idx >= 0) {
    lista.splice(idx, 1);
  } else {
    lista.push(nombre);
  }
  saveFavoritosLocales(lista);
  return lista.includes(nombre);
}

// Resolver ruta/imagen para mostrar desde servidor
function resolverImagen(nombre) {
  if (!nombre) return 'imagenes/placeholder.jpg';
  if (typeof nombre === 'string' && nombre.startsWith('data:')) return nombre;
  return 'imagenes/' + nombre;
}

// Cargar/guardar creaciones por usuario
function getUserCreations() {
  return JSON.parse(localStorage.getItem(storageKey('userDrinks')) || '[]');
}

function saveUserCreations(lista) {
  localStorage.setItem(storageKey('userDrinks'), JSON.stringify(lista));
}

function addUserCreation(trago) {
  const lista = getUserCreations();
  lista.unshift(trago);
  saveUserCreations(lista);
}

function deleteUserCreation(id) {
  const lista = getUserCreations().filter(t => t.id !== id);
  saveUserCreations(lista);
}
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
  // Cargar datos guardados si existen
  const savedUser = localStorage.getItem('rememberedUser') || '';
  const isRemembered = localStorage.getItem('rememberMe') === 'true';
  
  document.getElementById("formularios").innerHTML = `
    <div class="form-card">
      <button class="close-form-btn" onclick="cerrarFormularios()" title="Cerrar">✕</button>
      <h3>Login</h3>
      <input type="text" id="loginUser" placeholder="Usuario" value="${savedUser}">
      <input type="password" id="loginPass" placeholder="Contraseña">
      <div class="remember-me-container">
        <label class="remember-me-label">
          <input type="checkbox" id="rememberMe" ${isRemembered ? 'checked' : ''}>
          <span class="checkmark"></span>
          Recordarme
        </label>
      </div>
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
  const rememberMe = document.getElementById("rememberMe").checked;
  
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
      
      // Manejar funcionalidad "Recordarme"
      if (rememberMe) {
        localStorage.setItem('rememberedUser', usuario);
        localStorage.setItem('rememberMe', 'true');
        // Guardar sesión por 30 días
        const sessionExpiry = new Date();
        sessionExpiry.setDate(sessionExpiry.getDate() + 30);
        localStorage.setItem('sessionExpiry', sessionExpiry.toISOString());
      } else {
        // Limpiar datos de recordar si no está marcado
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('sessionExpiry');
      }
      
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
  
  // Mostrar mensaje si no hay tragos disponibles
  if (lista.length === 0) {
    cont.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>No hay tragos para mostrar en este momento</p>";
    return;
  }
  
  lista.forEach(t => {
    const promedio = typeof t.promedio === 'number' ? t.promedio : Number(t.promedio) || 0;
    const totalCalificaciones = typeof t.total_calificaciones === 'number'
      ? t.total_calificaciones
      : Number(t.total_calificaciones) || 0;
    const isFavorite = !!t.is_favorite;
    const descripcion = t.descripcion || 'Descripción no disponible';
    
    const card = document.createElement("div");
    card.className = "trago";
    card.innerHTML = `
      <img src="${resolverImagen(t.imagen, 'drink')}" alt="${t.nombre}" class="thumb" onerror="this.src='imagenes/placeholder.jpg'" loading="lazy">
      <div class="content">
        <h3>${t.nombre}</h3>
        <p>${descripcion}</p>
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          ⭐ ${promedio.toFixed(1)} · ${totalCalificaciones} calificaciones
        </p>
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
  document.getElementById("modalImagen").src = resolverImagen(trago.imagen, 'drink');
  document.getElementById("modalImagen").onerror = function() {
    this.src = 'imagenes/placeholder.jpg';
  };
  document.getElementById("modalDescripcion").textContent = trago.descripcion;

  const ul = document.getElementById("modalIngredientes");
  ul.innerHTML = "";
  const ingredientes = Array.isArray(trago.ingredientes) ? trago.ingredientes : [];
  if (ingredientes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Ingredientes no disponibles";
    ul.appendChild(li);
  } else {
    ingredientes.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ul.appendChild(li);
    });
  }

  const ol = document.getElementById("modalPasos");
  ol.innerHTML = "";
  const pasos = Array.isArray(trago.pasos) ? trago.pasos : [];
  if (pasos.length) {
    pasos.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      ol.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Pasos no disponibles";
    ol.appendChild(li);
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
  const promedio = typeof trago.promedio === 'number' ? trago.promedio : Number(trago.promedio) || 0;
  const totalCalificaciones = typeof trago.total_calificaciones === 'number'
    ? trago.total_calificaciones
    : Number(trago.total_calificaciones) || 0;
  const miRating = Number(trago.user_rating) || 0;
  
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

  const label = document.createElement("small");
  label.textContent = miRating ? `Tu calificación: ${miRating}/5` : "Tu calificación: pendiente";
  label.style.minWidth = "140px";
  wrap.appendChild(label);
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "estrella" + (i <= miRating ? " activa" : "");
    star.textContent = "★";
    star.onclick = async () => {
      // Intentar guardar en API
      await calificarTragoAPI(trago, i);
      renderEstrellas(trago);
    };
    wrap.appendChild(star);
  }
  cont.appendChild(wrap);
}

// --------------------
// Favoritos
// --------------------
// ya no se usan favoritos locales

// --------------------
// Búsqueda y filtro
// --------------------
function filtrarTragos() {
  const texto = (document.getElementById("busqueda").value || '').toLowerCase();
  const tipo = document.getElementById("filtro").value;
  const fuente = Array.isArray(catalogoTragos) ? catalogoTragos : [];

  if (!fuente.length) {
    console.warn("No hay catálogo de tragos disponible para filtrar");
    cargarTragosAPI();
    return;
  }

  const filtrados = fuente.filter(t => {
    const nombre = (t.nombre || '').toLowerCase();
    const descripcion = (t.descripcion || '').toLowerCase();
    const ingredientesTexto = Array.isArray(t.ingredientes) ? t.ingredientes.join(' ').toLowerCase() : '';
    const coincideTexto = !texto || nombre.includes(texto) || descripcion.includes(texto) || ingredientesTexto.includes(texto);

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
  const descripcionTropical = (trago.descripcion || '').toLowerCase();
  const ingredientes = Array.isArray(trago.ingredientes) ? trago.ingredientes.join(' ').toLowerCase() : '';
  
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
  
  // Cargar imagen del usuario desde servidor
  let imagenSrc = resolverImagen(usuarioActivo.foto || 'avatar.png');
  
  document.getElementById('perfilFoto').src = imagenSrc;
  document.getElementById('perfilUsuario').textContent = '@' + (usuarioActivo.usuario || 'invitado');
  document.getElementById('perfilBio').textContent = (usuarioActivo.bio || 'Sin biografía').slice(0, 30);
  mostrarFavoritosPerfil();
  
  // Configurar botón de editar perfil
  const btnEditar = document.getElementById('btnEditarPerfil');
  if (btnEditar) {
    btnEditar.onclick = mostrarFormularioEditarPerfil;
  }
  
  // Cargar creaciones del perfil
  mostrarCreacionesPerfil();
  
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
  cargarFavoritosAPI();
}

function mostrarCreacionesPerfil() { cargarCreacionesAPI(); }

async function cargarCreacionesAPI() {
  try {
    const apiCreaciones = await getUserDrinksAPI();
    const normalizadasAPI = Array.isArray(apiCreaciones)
      ? apiCreaciones.map((t, idx) => normalizarTragoAPI(t, idx + 1))
      : [];

    renderTragosConEliminar(normalizadasAPI, 'perfilCreaciones');
  } catch (error) {
    console.error('Error cargando creaciones:', error);
    const contenedor = document.getElementById('perfilCreaciones');
    if (contenedor) {
      contenedor.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Error cargando creaciones</p>';
    }
  }
}


function mostrarFormularioEditarPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
  
  const formulario = `
    <div class="form-card" style="max-width: 400px;">
      <h3>Editar Perfil</h3>
      <input type="text" id="editUsuario" placeholder="Usuario" value="${usuario.usuario || ''}">
      <textarea id="editBio" placeholder="Biografía (máx 100 caracteres)" maxlength="100">${usuario.bio || ''}</textarea>
      <input type="file" id="editFoto" accept=".jpg,.jpeg" title="Solo archivos JPG">
      <small style="color: #666; font-size: 0.8rem;">Formato permitido: JPG</small>
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
  
  // Si se seleccionó una imagen, subirla al servidor
  if (nuevaFoto) {
    if (nuevaFoto.size > 2 * 1024 * 1024) { alert('La imagen no puede ser mayor a 2MB'); return; }
    const extension = nuevaFoto.name.toLowerCase().split('.').pop();
    if (extension !== 'jpg' && extension !== 'jpeg') { alert('Solo se permiten archivos JPG'); return; }
    if (!nuevaFoto.type.startsWith('image/')) { alert('El archivo seleccionado no es una imagen válida'); return; }
    const fd = new FormData();
    fd.append('foto', nuevaFoto);
    const resp = await fetch('./api/upload_profile.php', { method: 'POST', body: fd });
    const data = await resp.json();
    if (!resp.ok || data.status !== 'success') { alert('Error subiendo foto: ' + (data.message || '')); return; }
    nombreFoto = data.filename;
  }
  
  try {
    // Actualizar perfil en API
    if (typeof updateProfileAPI === 'function') {
      await updateProfileAPI(nuevoUsuario, nuevaBio, nombreFoto);
    }
    // Refrescar cache local mínima sólo para header
    usuarioActivo = { ...(usuarioActivo || {}), usuario: nuevoUsuario, bio: nuevaBio, foto: nombreFoto };
    
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
    
    // Limpiar datos de "Recordarme" al cerrar sesión
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('sessionExpiry');
    
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
      let imagenSrc = resolverImagen(usuario.foto || 'avatar.png');
      
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
    let listaFinal = [];
    const creadosLocales = getUserCreations().map((t, idx) => normalizarTragoLocal(t, idx + 5000));

    let baseAPI = [];
    if (typeof loadDrinksFromAPI === 'function') {
      try {
        baseAPI = await loadDrinksFromAPI();
      } catch (apiError) {
        console.error('Error API tragos:', apiError);
      }
    }

    const normalizadosAPI = Array.isArray(baseAPI) ? baseAPI.map((t, idx) => normalizarTragoAPI(t, idx + 1)) : [];
    const baseLocales = typeof tragos !== 'undefined'
      ? tragos.map((t, idx) => {
          const normalizado = normalizarTragoLocal(t, idx + 100);
          if (!normalizado.promedio) {
            normalizado.promedio = Math.round((Math.random() * 2 + 3) * 10) / 10;
          }
          if (!normalizado.total_calificaciones) {
            normalizado.total_calificaciones = Math.floor(Math.random() * 50) + 10;
          }
          return normalizado;
        })
      : [];

    const agregados = new Map();
    const insertar = (trago) => {
      if (!trago || !trago.nombre) return;
      const clave = trago.nombre.toLowerCase();
      if (agregados.has(clave)) return;
      agregados.set(clave, true);
      listaFinal.push(trago);
    };

    normalizadosAPI.forEach(insertar);
    creadosLocales.forEach(insertar);
    baseLocales.forEach(insertar);

    if (listaFinal.length === 0) {
      listaFinal = creadosLocales.length ? creadosLocales : baseLocales;
    }

    listaFinal.forEach(trago => {
      trago.is_favorite = ((typeof trago.is_favorite === 'boolean' ? trago.is_favorite : false) || isFavorito(trago.nombre || ''));
    });

    catalogoTragos = listaFinal;
    renderTragos(listaFinal);
  } catch (error) {
    console.error('Error cargando tragos:', error);
    if (typeof tragos !== 'undefined') {
      const fallback = tragos.map((trago, idx) => normalizarTragoLocal(trago, idx + 100));
      catalogoTragos = fallback;
      renderTragos(fallback);
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
      const fuente = catalogoTragos.length ? catalogoTragos : (typeof tragos !== 'undefined' ? tragos : []);
      renderTragos(fuente);
      return true;
    }
  } catch (error) {
    console.error('Error toggleando favorito:', error);
    // Fallback a método local
    toggleFavorito(drinkName);
    // Recargar la vista actual
    const fuente = catalogoTragos.length ? catalogoTragos : (typeof tragos !== 'undefined' ? tragos : []);
    renderTragos(fuente);
    return true;
  }
}

// --------------------
// Calificar trago con API
// --------------------
async function calificarTragoAPI(trago, rating) {
  const drinkId = trago.id || 0;
  try {
    // Intentar con API
    if (typeof rateDrinkAPI === 'function' && drinkId) {
      await rateDrinkAPI(drinkId, rating);
    } else {
      // Fallback a método local - guardar en localStorage
      console.log(`Calificación guardada localmente: ${rating} estrellas`);
    }
  } catch (error) {
    console.error('Error calificando trago:', error);
    // Fallback a método local
    console.log(`Calificación guardada localmente: ${rating} estrellas`);
  }
  trago.user_rating = rating;
  return true;
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
      const normalizados = Array.isArray(favoritos)
        ? favoritos.map((t, idx) => normalizarTragoAPI(t, idx + 1))
        : [];
      normalizados.forEach(f => f.is_favorite = true);
      renderTragos(normalizados, 'perfilFavoritos');
    } else {
      // Fallback a método local directo
      console.log('Usando método local para cargar favoritos');
      if (typeof tragos === 'undefined') {
        console.error("Array de tragos no disponible");
        return;
      }
      
      const lista = JSON.parse(localStorage.getItem(storageKey('favoritos')) || '[]');
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
    if (typeof searchUsersAPI !== 'function') {
      throw new Error('API de usuarios no disponible');
    }
    const usuarios = await searchUsersAPI(termino);
    mostrarResultadosUsuarios(usuarios);
  } catch (error) {
    console.error('Error buscando usuarios:', error);
    alert('Error al buscar usuarios: ' + error.message);
  }
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
    const anioRegistro = usuario.fecha_registro ? new Date(usuario.fecha_registro).getFullYear() : '—';
    const totalTragos = typeof usuario.total_tragos === 'number'
      ? usuario.total_tragos
      : (usuario.tragos ? usuario.tragos.length : 0);
    const promedioUsuario = typeof usuario.promedio_calificacion === 'number'
      ? usuario.promedio_calificacion
      : 0;
    
    // Cargar avatar del usuario
    let avatarSrc = 'imagenes/avatar.png';
    if (usuario.foto && usuario.foto !== 'avatar.png') {
      avatarSrc = 'imagenes/' + usuario.foto;
    }
    
    card.innerHTML = `
      <div class="usuario-header">
        <img src="${avatarSrc}" alt="Avatar" class="usuario-avatar" onerror="this.src='imagenes/avatar.png'">
        <div class="usuario-info">
          <h3>@${usuario.usuario}</h3>
          <p>Miembro desde ${anioRegistro}</p>
        </div>
      </div>
      <div class="usuario-bio">${usuario.bio || 'Sin biografía'}</div>
      <div class="usuario-stats">
        <span>${totalTragos} tragos creados</span>
        <span>⭐ ${promedioUsuario ? promedioUsuario.toFixed(1) : '—'} promedio</span>
      </div>
      <div class="usuario-tragos">
        <h4>Tragos creados:</h4>
        <div class="tragos-list">
          ${usuario.tragos && usuario.tragos.length
            ? usuario.tragos.map(trago => `<span class="trago-tag">${trago}</span>`).join('')
            : '<span>Sin lista pública</span>'}
        </div>
      </div>
    `;
    
    contenedor.appendChild(card);
  });
}

async function verPerfilUsuario(usuario) {
  let perfil = { ...usuario };
  let listaTragos = Array.isArray(usuario.tragos) ? [...usuario.tragos] : [];

  if (usuario.id && typeof getUserProfileAPI === 'function') {
    try {
      const data = await getUserProfileAPI(usuario.id);
      if (data && data.user) {
        perfil = { ...perfil, ...data.user };
      }
      if (data && Array.isArray(data.drinks)) {
        listaTragos = data.drinks.map(d => d.nombre);
      }
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
    }
  }

  const promedio = typeof perfil.promedio_calificacion === 'number' ? perfil.promedio_calificacion : 0;
  const totalTragos = typeof perfil.total_tragos === 'number'
    ? perfil.total_tragos
    : (listaTragos ? listaTragos.length : 0);
  const favoritos = typeof perfil.total_favoritos === 'number'
    ? perfil.total_favoritos
    : (perfil.favoritos ?? '—');
  const anioRegistro = perfil.fecha_registro ? new Date(perfil.fecha_registro).getFullYear() : '—';
  const avatarModal = perfil.foto && perfil.foto !== 'avatar.png'
    ? 'imagenes/' + perfil.foto
    : 'imagenes/avatar.png';

  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h2>Perfil de @${perfil.usuario}</h2>
        <button onclick="this.closest('.modal').remove()" class="btn" style="background: #666;">✕</button>
      </div>
      <div class="modal-body">
        <div class="usuario-header" style="margin-bottom: 20px;">
          <img src="${avatarModal}" 
            alt="Avatar" class="usuario-avatar" style="width: 80px; height: 80px;" 
            onerror="this.src='imagenes/avatar.png'">
          <div class="usuario-info">
            <h3>@${perfil.usuario}</h3>
            <p>Miembro desde ${anioRegistro}</p>
            <p>⭐ Promedio: ${promedio ? promedio.toFixed(1) : '—'}/5</p>
          </div>
        </div>
        <div class="usuario-bio" style="margin-bottom: 20px;">
          <strong>Biografía:</strong><br>
          ${perfil.bio || 'Sin biografía disponible'}
        </div>
        <div class="usuario-stats" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span>📊 ${totalTragos} tragos creados</span>
            <span>❤️ Favoritos: ${favoritos}</span>
          </div>
        </div>
        <div class="usuario-tragos">
          <h4>Tragos creados por este usuario:</h4>
          <div class="tragos-list">
            ${listaTragos && listaTragos.length
              ? listaTragos.map(trago => 
                `<span class="trago-tag" onclick="buscarTragoPorUsuario('${trago}', '${perfil.usuario}')">${trago}</span>`
              ).join('')
              : '<span>Sin tragos publicados</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
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
// Funcionalidad "Recordarme"
// --------------------
function verificarSesionGuardada() {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  
  if (rememberMe && sessionExpiry) {
    const expiryDate = new Date(sessionExpiry);
    const now = new Date();
    
    // Verificar si la sesión no ha expirado
    if (now < expiryDate) {
      const savedUser = localStorage.getItem('rememberedUser');
      if (savedUser) {
        // Auto-login con usuario guardado
        console.log('Sesión guardada encontrada para:', savedUser);
        // No hacer auto-login automático por seguridad, solo mostrar mensaje
        setTimeout(() => {
          if (confirm(`¿Deseas continuar con la sesión de ${savedUser}?`)) {
            // Aquí podrías implementar auto-login si quieres
            // Por ahora solo pre-llenamos el formulario
            mostrarLogin();
          }
        }, 1000);
      }
    } else {
      // Sesión expirada, limpiar datos
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('sessionExpiry');
      console.log('Sesión guardada expirada, datos limpiados');
    }
  }
}

// --------------------
// Inicialización
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay sesión guardada con "Recordarme"
  verificarSesionGuardada();
  
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
        // Subir imagen al servidor (solo API)
        const file = formData.get('imagen');
        let imagenNombre = 'placeholder.jpg';
        if (file && file.size) {
          // Validaciones comunes
          if (file.size > 2 * 1024 * 1024) { alert('La imagen no puede ser mayor a 2MB'); return; }
          const ext = (file.name.toLowerCase().split('.').pop() || 'jpg');
          if (!['jpg','jpeg','png','webp'].includes(ext)) { alert('Solo se permiten imágenes JPG, PNG o WebP'); return; }

          const fd = new FormData();
          fd.append('imagen', file);
          const resp = await fetch('./api/upload.php', { method: 'POST', body: fd });
          const data = await resp.json();
          if (!resp.ok || data.status !== 'success') throw new Error(data.message || 'Error subiendo imagen');
          imagenNombre = data.filename;
        }

        const nuevoTrago = {
          nombre: formData.get('nombre'),
          descripcion: formData.get('descripcion'),
          tipo: formData.get('tipo'),
          imagen: imagenNombre,
          ingredientes: formData.get('ingredientes').split(',').map(i => i.trim()),
          pasos: formData.get('pasos').split('\n').map(p => p.trim()).filter(p => p)
        };
        
        await addDrinkToAPI(nuevoTrago);
        alert("Trago agregado con éxito!");
        cargarTragosAPI();
        mostrarCreacionesPerfil();
        
        e.target.reset();
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }
  
  // (Eliminado) Re-render forzado de pantalla4 que sobreescribía resultados de la API
  
  // Actualizar header
  actualizarHeader();
  
  // Cerrar modal al hacer clic fuera
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") {
      cerrarModal();
    }
  });
});

// Función para renderizar tragos con botón de eliminar (para creaciones del usuario)
function renderTragosConEliminar(lista, destinoId = "perfilCreaciones") {
  const cont = document.getElementById(destinoId);
  if (!cont) {
    console.error("Contenedor no encontrado:", destinoId);
    return;
  }
  
  // Validar que lista sea un array
  if (!Array.isArray(lista)) {
    console.error("Lista no es un array:", lista);
    cont.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>Error cargando creaciones</p>";
    return;
  }
  
  cont.innerHTML = "";
  
  // Mostrar mensaje si no hay creaciones
  if (lista.length === 0) {
    cont.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>No has creado ningún trago aún</p>";
    return;
  }
  
  lista.forEach(t => {
    const promedio = typeof t.promedio === 'number' ? t.promedio : Number(t.promedio) || 0;
    const totalCalificaciones = typeof t.total_calificaciones === 'number'
      ? t.total_calificaciones
      : Number(t.total_calificaciones) || 0;
    const descripcion = t.descripcion || 'Descripción no disponible';
    const card = document.createElement("div");
    card.className = "trago";
    card.innerHTML = `
      <img src="${resolverImagen(t.imagen, 'drink')}" alt="${t.nombre}" class="thumb" onerror="this.src='imagenes/placeholder.jpg'" loading="lazy">
      <div class="content">
        <h3>${t.nombre}</h3>
        <p>${descripcion}</p>
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          ⭐ ${promedio.toFixed(1)} · ${totalCalificaciones} calificaciones
        </p>
        <div class="actions">
          <button class="btn-fav" onclick='eliminarTrago(${t.id}, "${t.nombre}")' title="Eliminar trago" style="background: #dc3545; color: white;">
            🗑️
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

// Función para eliminar trago con confirmación
async function eliminarTrago(tragoId, tragoNombre) {
  // Mostrar confirmación
  const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el trago "${tragoNombre}"?\n\nEsta acción no se puede deshacer.`);
  
  if (!confirmacion) {
    return;
  }
  
  try {
    if (window.api && window.api.mode === 'api') {
      const ok = await deleteDrinkAPI(tragoId);
      if (!ok) throw new Error('No se pudo eliminar en el servidor');
    } else {
      throw new Error('API no disponible para eliminar tragos');
    }
    alert('✅ Trago eliminado exitosamente');

    // Recargar las creaciones
    mostrarCreacionesPerfil();
    // Refrescar lista principal
    cargarTragosAPI();
  } catch (error) {
    console.error('Error eliminando trago:', error);
    alert('❌ Error al eliminar el trago: ' + error.message);
  }
}