<?php
$assetVersion = '20251112';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Pourfect - Drink & Rate</title>
  <meta name="description" content="Descubre y califica los mejores tragos y cócteles con Pourfect">
  <link rel="stylesheet" href="style.css?v=<?php echo $assetVersion; ?>">
</head>
<body>
  <!-- HEADER UNIFICADO -->
  <header class="topbar" id="topbar">
    <div class="logo-box">
      <img src="imagenes/logo-mini.png" alt="Mini Logo" class="logo-mini">
      <div class="titulo-header">
        Pourfect <span class="subtitulo">Drink & Rate</span>
      </div>
    </div>

    <!-- Controles de búsqueda -->
    <div class="nav-search">
      <input type="text" id="busqueda" placeholder="Buscar trago..." aria-label="Buscar tragos">
      <select id="filtro" aria-label="Filtrar por tipo">
        <option value="todos">Todos</option>
        <option value="con-alcohol">Con alcohol</option>
        <option value="sin-alcohol">Sin alcohol</option>
        <option value="postre">Postres</option>
        <option value="shot">Shots</option>
        <option value="tropical">Tropicales</option>
        <option value="clasico">Clásicos</option>
        <option value="trending">Trending</option>
      </select>
      <button id="btnBuscarUsuarios" onclick="mostrarBusquedaUsuarios()" class="btn small" title="Buscar usuarios">👥</button>
      <button id="btnInfoGeneral" onclick="cambiarPantalla('pantallaInfo')" class="btn small" title="Información sobre tragos">ℹ️</button>
    </div>

    <nav class="nav-right">
      <!-- Antes de iniciar sesión -->
      <button id="btnLogin" onclick="mostrarLogin()" class="btn small">Iniciar sesión</button>
      <button id="btnRegistro" onclick="mostrarRegistro()" class="btn small">Registrarse</button>

      <!-- Después de iniciar sesión -->
      <button id="btnPerfil" onclick="mostrarPerfil()" class="btn small oculto">Perfil</button>
      <button id="btnCerrar" onclick="cerrarSesion()" class="btn small oculto">Cerrar sesión</button>
    </nav>
  </header>

  <main id="main">
    <!-- Pantalla 1 - Portada -->
    <section id="pantalla1" class="pantalla activa">
      <div class="portada-wrap">
        <img src="imagenes/logo-portada.png" alt="Logo Pourfect" class="logo-portada">
      </div>
    </section>

    <!-- Pantalla 3 - Login/Registro -->
    <section id="pantalla3" class="pantalla">
      <div class="login-content">
        <!-- Imagen principal en el centro -->
        <div class="main-image-container">
          <img src="imagenes/pant2.png" alt="Descripción de funcionalidades" class="main-image" id="pant2Image">
          <div class="sparkle sparkle-1">✨</div>
          <div class="sparkle sparkle-2">✨</div>
          <div class="sparkle sparkle-3">✨</div>
        </div>
        
        <!-- Imagen de pie de página -->
        <div class="footer-image-container">
          <img src="imagenes/tomenybeban.png" alt="Vasos y copas de cócteles" class="footer-image" id="tomenImage">
          <div class="bounce-icon bounce-1">🍸</div>
          <div class="bounce-icon bounce-2">🍹</div>
          <div class="bounce-icon bounce-3">🥃</div>
        </div>
        
      </div>
      
      <div id="formularios" class="formularios"></div>
    </section>

    <!-- Pantalla 4 - Menú de tragos -->
    <section id="pantalla4" class="pantalla">
      <div id="lista-tragos" class="grid" role="grid" aria-label="Lista de tragos"></div>
    </section>

    <!-- Pantalla Perfil -->
    <section id="pantallaPerfil" class="pantalla">
      <main class="main-content perfil">
        <div class="perfil-top">
          <img id="perfilFoto" src="imagenes/avatar.png" alt="Foto de perfil" class="perfil-foto">
          <div class="perfil-meta">
            <p id="perfilUsuario">@usuario</p>
            <p id="perfilBio">Biografía (máx 30 caracteres)</p>
            <div class="perfil-buttons">
              <button id="btnEditarPerfil" class="btn">Editar perfil</button>
              <button onclick="cerrarSesion()" class="btn" style="background: #666;">Cerrar sesión</button>
            </div>
          </div>
        </div>

        <section>
          <h3>Mis favoritos</h3>
          <div id="perfilFavoritos" class="grid" role="grid" aria-label="Tragos favoritos"></div>
        </section>

        <section>
          <h3>Mis creaciones</h3>
          <div id="perfilCreaciones" class="grid" role="grid" aria-label="Tragos creados por el usuario"></div>
        </section>

        <section>
          <h3>Agregar nuevo trago</h3>
          <form id="formAgregarTrago" enctype="multipart/form-data" class="form-vertical">
            <input type="text" name="nombre" placeholder="Nombre del trago" required aria-label="Nombre del trago">
            <select name="tipo" required aria-label="Tipo de trago">
              <option value="con-alcohol">Con alcohol</option>
              <option value="sin-alcohol">Sin alcohol</option>
              <option value="postre">Postre</option>
              <option value="shot">Shot</option>
              <option value="tropical">Tropical</option>
              <option value="clasico">Clásico</option>
              <option value="trending">Trending</option>
            </select>
            <textarea name="descripcion" placeholder="Descripción" maxlength="500" required aria-label="Descripción del trago"></textarea>
            <textarea name="ingredientes" placeholder="Ingredientes (separados por coma)" required aria-label="Lista de ingredientes"></textarea>
            <textarea name="pasos" placeholder="Pasos (separados por salto de línea)" required aria-label="Pasos de preparación"></textarea>
            <input type="file" name="imagen" accept=".jpg,.jpeg" required aria-label="Imagen del trago (solo JPG)">
            <button type="submit" class="btn">Guardar trago</button>
          </form>
        </section>
      </main>
    </section>

    <!-- Pantalla Info -->
    <section id="pantallaInfo" class="pantalla info-pantalla">
      <main class="main-content">
        <div class="info-header">
          <div class="info-title-section">
            <h2>🍹 Guía Completa de Coctelería</h2>
            <p class="info-subtitle">Todo lo que necesitas saber para preparar tragos profesionales</p>
          </div>
          <button onclick="cambiarPantalla('pantalla4')" class="btn close-info-btn">
            <span>✕</span> Cerrar
          </button>
        </div>
        
        <article class="info-card techniques-card">
          <h3>🍹 Técnicas de preparación</h3>
          <h4>Métodos básicos:</h4>
          <ul>
            <li><strong>Agitar (shaking):</strong> batir los ingredientes con hielo en coctelera para enfriar y emulsionar. Ideal para cócteles con jugos, cremas o huevo.</li>
            <li><strong>Remover (stirring):</strong> mezclar suavemente en vaso mezclador con cuchara larga, ideal para tragos transparentes como Martinis o Negronis.</li>
            <li><strong>Macerar (muddling):</strong> presionar suavemente frutas o hierbas (como menta o lima) para liberar aromas y jugos. Base de Mojitos y Caipirinhas.</li>
            <li><strong>Licuar (blending):</strong> usar licuadora para tragos frozen o frutales (como daiquiris o batidos con Baileys).</li>
          </ul>
          
          <h4>Técnicas avanzadas:</h4>
          <ul>
            <li><strong>Colado simple:</strong> se usa colador común para quitar hielo o trozos grandes.</li>
            <li><strong>Doble colado:</strong> se usa colador fino adicional para lograr una textura más limpia y profesional.</li>
            <li><strong>Escarchar:</strong> decorar el borde del vaso con azúcar o sal (típico en Margaritas o tragos dulces).</li>
            <li><strong>Flamear:</strong> técnica avanzada donde se prende fuego un ingrediente alcohólico para sabor y aroma (usar con cuidado).</li>
            <li><strong>Layering (capas):</strong> crear capas de diferentes densidades para efectos visuales espectaculares.</li>
          </ul>
        </article>
        
        <article class="info-card materials-card">
          <h3>🥂 Materiales y Cristalería</h3>
          <h4>Herramientas esenciales:</h4>
          <ul>
            <li><strong>Coctelera (shaker):</strong> para mezclar ingredientes rápidamente con hielo. Existen Boston shaker y cobbler shaker.</li>
            <li><strong>Colador (strainer):</strong> separa el líquido del hielo o pulpas al servir. El Hawthorne strainer es el más versátil.</li>
            <li><strong>Cuchara de bar (bar spoon):</strong> para remover o medir pequeñas cantidades. Tiene un extremo en espiral para mezclar.</li>
            <li><strong>Muddler (maceta):</strong> para machacar frutas, hierbas o azúcar. Puede ser de madera o acero inoxidable.</li>
            <li><strong>Medidor (jigger):</strong> permite dosificar con precisión las medidas de cada ingrediente. Fundamental para consistencia.</li>
            <li><strong>Cuchillo y tabla:</strong> para cortar frutas o preparar garnishes. Un cuchillo de chef afilado es esencial.</li>
            <li><strong>Abrelatas / destapador / sacacorchos:</strong> esenciales para vinos y bebidas embotelladas.</li>
          </ul>
          
          <h4>Vasos y copas más usados:</h4>
          <ul>
            <li><strong>Old Fashioned (rocks glass):</strong> bajo y ancho, ideal para tragos cortos como Negroni o Whisky Sour.</li>
            <li><strong>Highball (vaso largo):</strong> para cócteles con gaseosas o jugos, como Mojito o Cuba Libre.</li>
            <li><strong>Copa de cóctel (martini glass):</strong> para tragos servidos sin hielo, tipo Martini o Cosmopolitan.</li>
            <li><strong>Copa flauta:</strong> perfecta para tragos con espumante, como Mimosa o Spritz.</li>
            <li><strong>Copa margarita:</strong> ancha y con borde, usada para Margaritas y tragos frozen.</li>
            <li><strong>Copa hurricane o tulipán:</strong> típica para tragos tropicales como Piña Colada o Mai Tai.</li>
            <li><strong>Copa de vino / balón:</strong> usada en sangrías, clericós o cócteles frutales.</li>
            <li><strong>Shot glass:</strong> para tragos fuertes o degustaciones (Perla Negra, tequila, etc.).</li>
          </ul>
        </article>
        
        <article class="info-card tips-card">
          <h3>💡 Consejos del bartender</h3>
          <h4>Fundamentos básicos:</h4>
          <ul>
            <li><strong>Hielo de calidad:</strong> usa hielo duro y transparente para evitar que se derrita rápido y agüe el trago.</li>
            <li><strong>Medir siempre:</strong> respeta las proporciones para mantener el equilibrio de sabores.</li>
            <li><strong>Ingredientes frescos:</strong> jugos naturales, hierbas frescas y frutas maduras hacen la diferencia.</li>
            <li><strong>Prueba y ajusta:</strong> antes de servir, prueba el trago y corrige dulzor, acidez o alcohol.</li>
            <li><strong>Presentación:</strong> un garnish atractivo eleva cualquier cóctel.</li>
          </ul>
          
          <h4>Errores comunes:</h4>
          <ul>
            <li>No agitar con suficiente hielo.</li>
            <li>Usar jugo de lima o limón embotellado en lugar de fresco.</li>
            <li>No enfriar los vasos antes de servir.</li>
            <li>Descuidar la limpieza de la barra y utensilios.</li>
            <li>Sobrebatir cocteles con huevo, generando textura incorrecta.</li>
          </ul>
        </article>
      </main>
    </section>

    <!-- Pantalla Buscar Usuarios -->
    <section id="pantallaBuscarUsuarios" class="pantalla">
      <main class="main-content">
        <div class="info-header">
          <div class="info-title-section">
            <h2>👥 Buscar usuarios</h2>
            <p class="info-subtitle">Explora mixólogos y comparte recetas</p>
          </div>
          <button onclick="cambiarPantalla('pantalla4')" class="btn close-info-btn">
            <span>✕</span> Cerrar
          </button>
        </div>

        <div class="busqueda-usuarios">
          <input type="text" id="busquedaUsuarios" placeholder="Buscar usuarios..." aria-label="Buscar usuarios">
          <button class="btn" onclick="buscarUsuarios()">Buscar</button>
        </div>

        <div id="resultadosUsuarios" class="usuarios-grid" role="list" aria-label="Resultados de búsqueda de usuarios"></div>
      </main>
    </section>
  </main>

  <!-- Modal de detalle de trago -->
  <div id="modal" class="modal">
    <div class="modal-content">
      <div class="modal-left">
        <img id="modalImagen" src="imagenes/placeholder.jpg" alt="Imagen del trago">
      </div>
      <div class="modal-right">
        <button id="cerrarModal" class="btn close-btn">✕</button>
        <h2 id="modalTitulo">Nombre del trago</h2>
        <p id="modalDescripcion"></p>
        <div id="modalIngredientesWrapper">
          <h3>Ingredientes</h3>
          <ul id="modalIngredientes"></ul>
        </div>
        <div id="modalPasosWrapper">
          <h3>Pasos</h3>
          <ol id="modalPasos"></ol>
        </div>
        <div id="modalEstrellas"></div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="datos/tragos.js?v=<?php echo $assetVersion; ?>" defer></script>
  <script src="js/api.js?v=<?php echo $assetVersion; ?>" defer></script>
  <script src="script.js?v=<?php echo $assetVersion; ?>" defer></script>
</body>
</html>

