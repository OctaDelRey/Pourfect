/**
 * Cliente API para Pourfect
 * Archivo: js/api.js
 */

class PourfectAPI {
    constructor() {
        // Detectar si estamos en un entorno local o en servidor
        const isLocal = window.location.protocol === 'file:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        
        // Detectar si estamos en modo archivo (sin servidor)
        const isFileMode = window.location.protocol === 'file:';
        
        if (isFileMode) {
            // Para modo archivo, deshabilitar API y usar solo localStorage
            this.baseURL = null;
            this.mode = 'local';
        } else {
            // Para servidor (local o producción), usar la ruta de la API
            this.baseURL = './api';
            this.mode = 'api';
        }
        
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        console.log('API Base URL:', this.baseURL);
        console.log('Mode:', this.mode);
    }

    /**
     * Realizar petición HTTP
     */
    async request(endpoint, options = {}) {
        // Si estamos en modo local, no hacer peticiones HTTP
        if (this.mode === 'local') {
            throw new Error('API no disponible en modo local');
        }
        
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        console.log('API Request:', {
            url: url,
            method: config.method || 'GET',
            headers: config.headers,
            body: config.body
        });

        try {
            const response = await fetch(url, config);
            console.log('API Response Status:', response.status);
            
            const data = await response.json();
            console.log('API Response Data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('Error en API:', error);
            console.error('URL intentada:', url);
            console.error('Configuración:', config);
            throw error;
        }
    }

    /**
     * Autenticación
     */
    async login(usuario, password) {
        return this.request('auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ usuario, password })
        });
    }

    async register(usuario, password, email = null) {
        return this.request('auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify({ usuario, password, email })
        });
    }

    async logout() {
        return this.request('auth.php?action=logout', {
            method: 'POST'
        });
    }

    async getProfile() {
        return this.request('auth.php?action=profile', {
            method: 'GET'
        });
    }

    async updateProfile(usuario, bio, email = null) {
        return this.request('auth.php?action=update', {
            method: 'PUT',
            body: JSON.stringify({ usuario, bio, email })
        });
    }

    async checkAuth() {
        return this.request('auth.php?action=check', {
            method: 'GET'
        });
    }

    /**
     * Tragos
     */
    async getDrinks(search = '', tipo = '', page = 1) {
        const params = new URLSearchParams();
        if (search) {
            params.append('action', 'search');
            params.append('query', search);
        } else if (tipo && tipo !== 'todos') {
            params.append('action', 'by_type');
            params.append('tipo', tipo);
        } else {
            params.append('action', 'all');
        }
        if (page > 1) params.append('page', page);

        return this.request(`drinks_data.php?${params.toString()}`, {
            method: 'GET'
        });
    }

    async getDrinkDetail(id) {
        return this.request(`drinks.php?action=detail&id=${id}`, {
            method: 'GET'
        });
    }

    async getFavorites() {
        return this.request('drinks.php?action=favorites', {
            method: 'GET'
        });
    }

    async addDrink(drinkData) {
        return this.request('drinks.php?action=add', {
            method: 'POST',
            body: JSON.stringify(drinkData)
        });
    }

    async toggleFavorite(drinkId) {
        return this.request('drinks.php?action=favorite', {
            method: 'POST',
            body: JSON.stringify({ drink_id: drinkId })
        });
    }

    async rateDrink(drinkId, rating) {
        return this.request('drinks.php?action=rate', {
            method: 'POST',
            body: JSON.stringify({ drink_id: drinkId, rating: rating })
        });
    }

    /**
     * Usuarios
     */
    async searchUsers(query) {
        return this.request(`users.php?action=search&query=${encodeURIComponent(query)}`, {
            method: 'GET'
        });
    }

    async getUserProfile(userId) {
        return this.request(`users.php?action=profile&id=${userId}`, {
            method: 'GET'
        });
    }

    /**
     * Tragos del usuario
     */
    async getUserDrinks() {
        return this.request('drinks.php?action=user_drinks', {
            method: 'GET'
        });
    }

    async deleteDrink(drinkId) {
        return this.request(`drinks.php?action=delete&id=${drinkId}`, {
            method: 'DELETE'
        });
    }
}

// Instancia global de la API
const api = new PourfectAPI();

/**
 * Funciones de utilidad para el frontend
 */

// Verificar autenticación al cargar la página
async function checkAuthentication() {
    try {
        // Si estamos en modo local, verificar localStorage
        if (api.mode === 'local') {
            const userData = localStorage.getItem('usuarioActivo');
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        }
        
        const response = await api.checkAuth();
        if (response.authenticated) {
            return response.user;
        }
        return null;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return null;
    }
}

// Manejar login
async function handleLogin(usuario, password) {
    try {
        // Si estamos en modo local, usar autenticación simulada
        if (api.mode === 'local') {
            // Simular autenticación local
            const userData = {
                id: Date.now(),
                usuario: usuario,
                foto: 'avatar.png',
                bio: 'Usuario de Pourfect',
                email: null
            };
            
            // Guardar usuario en localStorage
            localStorage.setItem('usuarioActivo', JSON.stringify(userData));
            return userData;
        }
        
        const response = await api.login(usuario, password);
        if (response.status === 'success') {
            // Guardar usuario en localStorage para compatibilidad
            localStorage.setItem('usuarioActivo', JSON.stringify(response.user));
            return response.user;
        }
    } catch (error) {
        throw new Error(error.message || 'Error en el login');
    }
}

// Manejar registro
async function handleRegister(usuario, password, email = null) {
    try {
        // Si estamos en modo local, usar registro simulado
        if (api.mode === 'local') {
            // Simular registro local
            const userData = {
                id: Date.now(),
                usuario: usuario,
                foto: 'avatar.png',
                bio: 'Nuevo usuario de Pourfect',
                email: email
            };
            
            // Guardar usuario en localStorage
            localStorage.setItem('usuarioActivo', JSON.stringify(userData));
            return userData;
        }
        
        const response = await api.register(usuario, password, email);
        if (response.status === 'success') {
            // Guardar usuario en localStorage para compatibilidad
            localStorage.setItem('usuarioActivo', JSON.stringify(response.user));
            return response.user;
        }
    } catch (error) {
        throw new Error(error.message || 'Error en el registro');
    }
}

// Manejar logout
async function handleLogout() {
    try {
        // Si estamos en modo local, solo limpiar localStorage
        if (api.mode === 'local') {
            localStorage.removeItem('usuarioActivo');
            return true;
        }
        
        await api.logout();
        localStorage.removeItem('usuarioActivo');
        return true;
    } catch (error) {
        console.error('Error en logout:', error);
        // Limpiar localStorage aunque haya error
        localStorage.removeItem('usuarioActivo');
        return true;
    }
}

// Cargar tragos desde la API
async function loadDrinksFromAPI(search = '', tipo = '') {
    try {
        const response = await api.getDrinks(search, tipo);
        if (response.success) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Error cargando tragos:', error);
        // Fallback a datos locales si hay error
        return typeof tragos !== 'undefined' ? tragos : [];
    }
}

// Cargar favoritos desde la API
async function loadFavoritesFromAPI() {
    try {
        const response = await api.getFavorites();
        if (response.status === 'success') {
            return response.favorites;
        }
        return [];
    } catch (error) {
        console.error('Error cargando favoritos:', error);
        // Fallback a localStorage
        const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
        return typeof tragos !== 'undefined' ? tragos.filter(t => favs.includes(t.nombre)) : [];
    }
}

// Toggle favorito en la API
async function toggleFavoriteAPI(drinkId, drinkName) {
    try {
        const response = await api.toggleFavorite(drinkId);
        if (response.status === 'success') {
            // Actualizar localStorage para compatibilidad
            let favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
            if (response.is_favorite) {
                if (!favs.includes(drinkName)) {
                    favs.push(drinkName);
                }
            } else {
                favs = favs.filter(f => f !== drinkName);
            }
            localStorage.setItem('favoritos', JSON.stringify(favs));
            return response.is_favorite;
        }
    } catch (error) {
        console.error('Error toggleando favorito:', error);
        // Fallback a método local
        return toggleFavorito(drinkName);
    }
}

// Calificar trago en la API
async function rateDrinkAPI(drinkId, rating) {
    try {
        const response = await api.rateDrink(drinkId, rating);
        if (response.status === 'success') {
            return true;
        }
    } catch (error) {
        console.error('Error calificando trago:', error);
        return false;
    }
}

// Agregar trago a la API
async function addDrinkToAPI(drinkData) {
    try {
        const response = await api.addDrink(drinkData);
        if (response.status === 'success') {
            return response.drink_id;
        }
    } catch (error) {
        console.error('Error agregando trago:', error);
        throw error;
    }
}

// Actualizar perfil en la API
async function updateProfileAPI(usuario, bio, email = null) {
    try {
        const response = await api.updateProfile(usuario, bio, email);
        if (response.status === 'success') {
            // Actualizar localStorage
            const userData = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
            userData.usuario = usuario;
            userData.bio = bio;
            if (email) userData.email = email;
            localStorage.setItem('usuarioActivo', JSON.stringify(userData));
            return true;
        }
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        throw error;
    }
}

// Buscar usuarios en la API
async function searchUsersAPI(query) {
    try {
        const response = await api.searchUsers(query);
        if (response.status === 'success') {
            return response.users;
        }
        return [];
    } catch (error) {
        console.error('Error buscando usuarios:', error);
        return [];
    }
}

// Obtener perfil de usuario desde la API
async function getUserProfileAPI(userId) {
    try {
        const response = await api.getUserProfile(userId);
        if (response.status === 'success') {
            return response;
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo perfil de usuario:', error);
        return null;
    }
}

// Obtener tragos del usuario desde la API
async function getUserDrinksAPI() {
    try {
        const response = await api.getUserDrinks();
        if (response.status === 'success') {
            return response.drinks;
        }
        return [];
    } catch (error) {
        console.error('Error obteniendo tragos del usuario:', error);
        return [];
    }
}

// Eliminar trago desde la API
async function deleteDrinkAPI(drinkId) {
    try {
        const response = await api.deleteDrink(drinkId);
        if (response.status === 'success') {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error eliminando trago:', error);
        return false;
    }
}

// Función para detectar si estamos en modo API o local
function isAPIMode() {
    // Verificar si existe el archivo de configuración de la API
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

// Función para mostrar información del modo de funcionamiento
function showModeInfo() {
    const mode = api.mode;
    const protocol = window.location.protocol;
    
    console.log('=== MODO DE FUNCIONAMIENTO ===');
    console.log('Protocolo:', protocol);
    console.log('Modo:', mode);
    
    if (mode === 'local') {
        console.log('ℹ️ Ejecutándose en modo local (sin servidor)');
        console.log('📝 Los datos se guardan en localStorage');
        console.log('🔧 Para usar la API completa, ejecuta con un servidor web');
    } else {
        console.log('🌐 Ejecutándose en modo API');
        console.log('📡 Conectando con servidor backend');
    }
}

// Exportar funciones para uso global
window.PourfectAPI = PourfectAPI;
window.api = api;
window.checkAuthentication = checkAuthentication;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.loadDrinksFromAPI = loadDrinksFromAPI;
window.loadFavoritesFromAPI = loadFavoritesFromAPI;
window.toggleFavoriteAPI = toggleFavoriteAPI;
window.rateDrinkAPI = rateDrinkAPI;
window.addDrinkToAPI = addDrinkToAPI;
window.updateProfileAPI = updateProfileAPI;
window.searchUsersAPI = searchUsersAPI;
window.getUserProfileAPI = getUserProfileAPI;
window.getUserDrinksAPI = getUserDrinksAPI;
window.deleteDrinkAPI = deleteDrinkAPI;
window.isAPIMode = isAPIMode;
window.showModeInfo = showModeInfo;

// Mostrar información del modo al cargar
showModeInfo();


