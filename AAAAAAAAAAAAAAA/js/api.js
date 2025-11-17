/**
 * Cliente API para Pourfect
 * Archivo: js/api.js
 */

class PourfectAPI {
    constructor() {
        this.baseURL = './api';
        this.mode = 'api';
        this.debug = false;
        
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (this.debug) {
            console.log('API Base URL:', this.baseURL);
            console.log('Mode:', this.mode);
        }
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
            credentials: 'include', // Incluir cookies para mantener sesión PHP
            ...options
        };

        if (this.debug) {
            console.log('API Request:', {
                url: url,
                method: config.method || 'GET',
                headers: config.headers,
                body: config.body
            });
        }

        try {
            const response = await fetch(url, config);
            if (this.debug) console.log('API Response Status:', response.status);
            
            const data = await response.json();
            if (this.debug) console.log('API Response Data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            if (this.debug) {
                console.error('Error en API:', error);
                console.error('URL intentada:', url);
                console.error('Configuración:', config);
            }
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

    async register(usuario, password) {
        return this.request('auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify({ usuario, password })
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

    async updateProfile(usuario, bio, foto = null) {
        return this.request('auth.php?action=update', {
            method: 'PUT',
            body: JSON.stringify({ action: 'update', usuario, bio, foto })
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
        const response = await api.login(usuario, password);
        if (response.status === 'success') {
            return response.user;
        }
    } catch (error) {
        throw new Error(error.message || 'Error en el login');
    }
}

// Manejar registro
async function handleRegister(usuario, password) {
    try {
        const response = await api.register(usuario, password);
        if (response.status === 'success') {
            return response.user;
        }
    } catch (error) {
        throw new Error(error.message || 'Error en el registro');
    }
}

// Manejar logout
async function handleLogout() {
    try {
        await api.logout();
        return true;
    } catch (error) {
        console.error('Error en logout:', error);
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
        return [];
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
        return [];
    }
}

// Toggle favorito en la API
async function toggleFavoriteAPI(drinkId, drinkName) {
    try {
        const response = await api.toggleFavorite(drinkId);
        if (response.status === 'success') {
            return response.is_favorite;
        }
    } catch (error) {
        console.error('Error toggleando favorito:', error);
        return false;
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
        // En modo local, guardar como creación del usuario
        if (api.mode === 'local') {
            const user = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
            const key = user && user.usuario ? `userDrinks_${user.usuario}` : 'userDrinks_guest';
            const lista = JSON.parse(localStorage.getItem(key) || '[]');
            const id = Date.now();
            lista.unshift({ ...drinkData, id });
            localStorage.setItem(key, JSON.stringify(lista));
            return id;
        }

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
async function updateProfileAPI(usuario, bio, foto = null) {
    try {
        const response = await api.updateProfile(usuario, bio, foto);
        if (response.status === 'success') {
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
function isAPIMode() { return true; }

// Función para mostrar información del modo de funcionamiento
function showModeInfo() {
    const mode = api.mode;
    const protocol = window.location.protocol;
    
    console.log('=== MODO DE FUNCIONAMIENTO ===');
    console.log('Protocolo:', protocol);
    console.log('Modo:', mode);
    
    console.log('🌐 Ejecutándose en modo API');
    console.log('📡 Conectando con servidor backend');
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


