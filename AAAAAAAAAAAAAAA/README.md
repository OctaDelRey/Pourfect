# 🍹 Pourfect - Aplicación de Tragos y Cócteles

## 📋 **Instrucciones para Despliegue en Hostinger**

### **🎯 Información del Proyecto:**
- **Aplicación web** para descubrir, calificar y gestionar tragos
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP con MariaDB
- **Base de datos**: `u157683007_pourfect`

### **🔧 Credenciales de Base de Datos:**
- **Usuario**: `u157683007_octash`
- **Contraseña**: `Gaelyyael11`
- **Base de datos**: `u157683007_pourfect`
- **Host**: `localhost`

## 📁 **Estructura de Archivos para Hostinger**

```
public_html/
├── index.html                    ✅ Página principal
├── style.css                     ✅ Estilos
├── script.js                     ✅ Lógica JavaScript
├── database_structure.sql       ✅ Estructura de BD
├── README.md                     ✅ Documentación
├── INSTRUCCIONES_PROFESORA.md    ✅ Instrucciones para profesora
├── config/
│   └── database.php             ✅ Configuración BD
├── api/
│   ├── auth.php                 ✅ API autenticación
│   └── drinks.php               ✅ API tragos
├── js/
│   └── api.js                   ✅ Cliente API
├── datos/
│   └── tragos.js                ✅ Datos iniciales
└── imagenes/
    ├── avatar.png               ✅ Avatar por defecto
    ├── mojito.jpg               ✅ Imágenes de tragos
    └── ... (todas las imágenes)  ✅ Imágenes
```

## 🚀 **Pasos para Despliegue**

### **1. Subir Archivos a Hostinger**
```
1. Subir todos los archivos a public_html/
2. Mantener la estructura de carpetas
3. Verificar permisos de archivos PHP (644)
```

### **2. Crear Base de Datos**
```
1. En Hostinger: Crear base de datos "pourfect"
2. Usar credenciales: u157683007_octash / Gaelyyael11
```

### **3. Configurar Base de Datos**
```
1. Abrir HeidiSQL
2. Conectar con las credenciales
3. Ejecutar database_structure.sql
4. Verificar que se crearon las tablas
```

### **4. Probar Funcionamiento**
```
1. https://tu-dominio.com/ - Aplicación principal
2. Verificar que todas las funciones funcionan
```

## 🎯 **Funcionalidades Implementadas**

### **🔐 Autenticación:**
- ✅ Registro de usuarios
- ✅ Login con validación
- ✅ Logout seguro
- ✅ Perfil de usuario editable

### **🍹 Gestión de Tragos:**
- ✅ Lista de tragos desde BD
- ✅ Búsqueda y filtrado
- ✅ Sistema de favoritos
- ✅ Calificaciones con estrellas
- ✅ Agregar nuevos tragos

### **🔄 Características Técnicas:**
- ✅ **API REST** completa
- ✅ **Seguridad** con hash de contraseñas
- ✅ **Fallback** a datos locales si falla API
- ✅ **Responsive** design
- ✅ **Validaciones** de entrada

## 🔧 **Solución de Problemas**

### **Error "You have been blocked":**
1. Verificar que el dominio esté configurado
2. Comprobar que los archivos estén en public_html/
3. Usar subdominio de Hostinger si es necesario

### **Error de Conexión a BD:**
1. Verificar credenciales en config/database.php
2. Comprobar que la base de datos existe
3. Ejecutar database_structure.sql

### **Error 500 en API:**
1. Verificar permisos de archivos PHP
2. Comprobar sintaxis en archivos PHP
3. Revisar logs de error en Hostinger

## 📊 **Verificación Post-Despliegue**

### **✅ Checklist de Funcionamiento:**
- [ ] Página principal carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Login de usuarios funciona
- [ ] Lista de tragos se carga desde BD
- [ ] Búsqueda y filtrado funcionan
- [ ] Favoritos se guardan en BD
- [ ] Calificaciones se guardan en BD
- [ ] Perfil se actualiza correctamente

## 🎉 **¡Listo para Producción!**

La aplicación incluye:
- ✅ **Backend completo** con PHP y MariaDB
- ✅ **API REST** para todas las operaciones
- ✅ **Seguridad robusta** implementada
- ✅ **Escalabilidad** para miles de usuarios
- ✅ **Compatibilidad** total con el frontend

---
**Desarrollado por**: OctaDelRey
**Fecha**: 5/10/2025

**Versión**: 4.0.0
