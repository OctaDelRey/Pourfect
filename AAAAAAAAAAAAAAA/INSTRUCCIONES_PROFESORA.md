# 📋 **Instrucciones para Profesora - Despliegue Pourfect**

## 🎯 **Resumen del Proyecto**
Aplicación web completa para gestión de tragos y cócteles con:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP con MariaDB
- **Funcionalidades**: Registro, login, favoritos, calificaciones, búsqueda

## 🔧 **Credenciales de Hostinger**
- **Usuario BD**: `u157683007_octash`
- **Contraseña BD**: `Gaelyyael11`
- **Base de datos**: `u157683007_pourfect`
- **Host**: `localhost`

## 📁 **Archivos a Subir a public_html/**

### **Archivos Principales:**
```
✅ index.html - Página principal
✅ style.css - Estilos
✅ script.js - Lógica JavaScript
✅ simple_test.php - Prueba de conexión
✅ test_connection.php - Prueba de base de datos
✅ database_structure.sql - Estructura de BD
```

### **Carpetas:**
```
✅ config/ - Configuración de base de datos
✅ api/ - APIs de autenticación y tragos
✅ js/ - Cliente JavaScript para API
✅ datos/ - Datos iniciales de tragos
✅ imagenes/ - Todas las imágenes de tragos
```

## 🚀 **Pasos de Despliegue**

### **1. Subir Archivos**
```
1. Subir todos los archivos a public_html/
2. Mantener estructura de carpetas
3. Verificar que no falte ningún archivo
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
4. Verificar que se crearon las tablas:
   - usuarios
   - tragos
   - favoritos
   - calificaciones
```

### **4. Probar Funcionamiento**
```
1. https://tu-dominio.com/simple_test.php
   - Debe mostrar "PHP funcionando" y "Conexión BD exitosa"
   
2. https://tu-dominio.com/test_connection.php
   - Debe mostrar estado de las tablas
   
3. https://tu-dominio.com/
   - Debe cargar la aplicación principal
```

## 🧪 **Archivos de Prueba**

### **simple_test.php**
- Verifica que PHP funciona
- Prueba conexión a base de datos
- Muestra información del servidor

### **test_connection.php**
- Prueba conexión específica a la BD
- Muestra estado de las tablas
- Cuenta registros existentes

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

## 📊 **Verificación Final**

### **✅ Checklist de Funcionamiento:**
- [ ] Página principal carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Login de usuarios funciona
- [ ] Lista de tragos se carga desde BD
- [ ] Búsqueda y filtrado funcionan
- [ ] Favoritos se guardan en BD
- [ ] Calificaciones se guardan en BD
- [ ] Perfil se actualiza correctamente

## 🎯 **Funcionalidades de la Aplicación**

### **🔐 Autenticación:**
- Registro de usuarios con validación
- Login con hash de contraseñas
- Logout seguro
- Perfil de usuario editable

### **🍹 Gestión de Tragos:**
- Lista de tragos desde base de datos
- Búsqueda y filtrado por nombre y tipo
- Sistema de favoritos persistente
- Calificaciones con estrellas
- Agregar nuevos tragos

### **🔄 Características Técnicas:**
- API REST completa
- Seguridad con hash de contraseñas
- Fallback a datos locales si falla API
- Responsive design
- Validaciones de entrada

## 🎉 **¡Listo para Producción!**

La aplicación incluye:
- ✅ Backend completo con PHP y MariaDB
- ✅ API REST para todas las operaciones
- ✅ Seguridad robusta implementada
- ✅ Escalabilidad para miles de usuarios
- ✅ Compatibilidad total con el frontend

## 📞 **Soporte**

Si hay algún problema:
1. Revisar logs de error en Hostinger
2. Probar archivos de prueba
3. Verificar configuración de base de datos
4. Comprobar permisos de archivos

---
**Proyecto**: Pourfect - Aplicación de Tragos  
**Desarrollado por**: [Nombre del estudiante]  
**Fecha**: [Fecha actual]  
**Versión**: 1.0.0
