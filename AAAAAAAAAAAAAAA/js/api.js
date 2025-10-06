/**
 * Cliente API para Pourfect
 * Archivo: js/api.js
 */

class PourfectAPI {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Realizar petición HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('Error en API:', error);
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
        if (search) params.append('search', search);
        if (tipo) params.append('tipo', tipo);
        if (page > 1) params.append('page', page);

        return this.request(`drinks.php?action=list&${params.toString()}`, {
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
        if (response.status === 'success') {
            return response.drinks;
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

// Función para detectar si estamos en modo API o local
function isAPIMode() {
    // Verificar si existe el archivo de configuración de la API
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
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
window.isAPIMode = isAPIMode;
