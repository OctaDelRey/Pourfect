/**
 * Miguel - Mascota interactiva de Pourfect
 * Archivo: js/miguel.js
 */

class Miguel {
    constructor() {
        this.isActive = false;
        this.currentImage = 1;
        this.positions = ['izquierda', 'derecha', 'arriba', 'abajo'];
        this.currentPosition = 0;
        this.intervalId = null;
        this.animationTimeout = null;
        this.isAnimating = false;
        
        // Configuración de Miguel
        this.config = {
            showInterval: 15000, // Aparece cada 15 segundos
            hideDelay: 5000,     // Se oculta después de 5 segundos
            imageChangeInterval: 3000, // Cambia imagen cada 3 segundos
            minShowTime: 3000,   // Mínimo tiempo visible
            maxShowTime: 8000    // Máximo tiempo visible
        };
        
        this.init();
    }
    
    init() {
        this.createMiguelElement();
        this.startRandomAppearances();
        console.log('🐾 Miguel está listo para aparecer!');
    }
    
    createMiguelElement() {
        // Crear elemento de Miguel si no existe
        if (!document.getElementById('miguel')) {
            const miguelDiv = document.createElement('div');
            miguelDiv.id = 'miguel';
            miguelDiv.className = 'miguel';
            miguelDiv.innerHTML = `
                <img src="imagenes/mascota1.png" alt="Miguel" class="miguel-imagen" id="miguel-imagen">
            `;
            document.body.appendChild(miguelDiv);
            
            // Aplicar filtros CSS para remover fondo negro
            this.applyTransparencyFix();
        }
    }
    
    applyTransparencyFix() {
        const miguelImg = document.getElementById('miguel-imagen');
        if (miguelImg) {
            // Aplicar estilos para remover fondo negro
            miguelImg.style.mixBlendMode = 'multiply';
            miguelImg.style.filter = 'contrast(1.2) brightness(1.1)';
            miguelImg.style.background = 'transparent';
            miguelImg.style.backgroundColor = 'transparent';
            
            // Intentar usar canvas para procesar la imagen
            this.processImageTransparency(miguelImg);
        }
    }
    
    processImageTransparency(img) {
        // Crear canvas para procesar la imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dibujar la imagen
            ctx.drawImage(img, 0, 0);
            
            // Obtener datos de píxeles
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Procesar píxeles para hacer transparente el negro
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Si el píxel es negro o muy oscuro, hacerlo transparente
                if (r < 50 && g < 50 && b < 50) {
                    data[i + 3] = 0; // Alpha = 0 (transparente)
                }
            }
            
            // Aplicar los datos modificados
            ctx.putImageData(imageData, 0, 0);
            
            // Reemplazar la imagen con el canvas procesado
            img.src = canvas.toDataURL();
        };
    }
    
    startRandomAppearances() {
        // Miguel aparece aleatoriamente cada cierto tiempo
        this.intervalId = setInterval(() => {
            if (!this.isActive && !this.isAnimating) {
                this.showMiguel();
            }
        }, this.config.showInterval);
    }
    
    showMiguel() {
        if (this.isActive || this.isAnimating) return;
        
        this.isActive = true;
        this.isAnimating = true;
        
        // Seleccionar posición aleatoria
        this.currentPosition = Math.floor(Math.random() * this.positions.length);
        const position = this.positions[this.currentPosition];
        
        // Seleccionar imagen aleatoria
        this.currentImage = Math.random() < 0.5 ? 1 : 2;
        
        const miguel = document.getElementById('miguel');
        const miguelImg = document.getElementById('miguel-imagen');
        
        if (!miguel || !miguelImg) return;
        
        // Configurar posición y imagen
        miguel.className = `miguel miguel-${position}`;
        miguelImg.src = `imagenes/mascota${this.currentImage}.png`;
        
        // Mostrar Miguel con animación
        miguel.classList.add('activo', 'apareciendo');
        
        // Cambiar imagen periódicamente mientras está visible
        this.startImageRotation();
        
        // Ocultar después de un tiempo aleatorio
        const showTime = Math.random() * (this.config.maxShowTime - this.config.minShowTime) + this.config.minShowTime;
        
        setTimeout(() => {
            this.hideMiguel();
        }, showTime);
        
        // Efectos especiales aleatorios
        this.randomSpecialEffects();
        
        console.log(`🐾 Miguel apareció desde la ${position} con imagen ${this.currentImage}`);
    }
    
    hideMiguel() {
        if (!this.isActive) return;
        
        const miguel = document.getElementById('miguel');
        if (!miguel) return;
        
        this.isActive = false;
        this.isAnimating = true;
        
        // Animación de desaparición
        miguel.classList.add('desapareciendo');
        
        setTimeout(() => {
            miguel.classList.remove('activo', 'apareciendo', 'desapareciendo', 'saludando', 'rebotando');
            this.isAnimating = false;
            this.stopImageRotation();
        }, 600);
        
        console.log('🐾 Miguel se ocultó');
    }
    
    startImageRotation() {
        this.stopImageRotation(); // Limpiar rotación anterior
        
        this.intervalId = setInterval(() => {
            if (this.isActive) {
                this.currentImage = this.currentImage === 1 ? 2 : 1;
                const miguelImg = document.getElementById('miguel-imagen');
                if (miguelImg) {
                    miguelImg.src = `imagenes/mascota${this.currentImage}.png`;
                }
            }
        }, this.config.imageChangeInterval);
    }
    
    stopImageRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    randomSpecialEffects() {
        if (!this.isActive) return;
        
        const miguel = document.getElementById('miguel');
        if (!miguel) return;
        
        // Efectos aleatorios
        const effects = ['saludando', 'rebotando'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        // Aplicar efecto después de un pequeño delay
        setTimeout(() => {
            if (this.isActive) {
                miguel.classList.add(randomEffect);
                
                // Remover efecto después de la animación
                setTimeout(() => {
                    miguel.classList.remove(randomEffect);
                }, 1000);
            }
        }, 1000);
    }
    
    // Método para forzar aparición de Miguel (para testing)
    forceShow() {
        this.showMiguel();
    }
    
    // Método para ocultar Miguel manualmente
    forceHide() {
        this.hideMiguel();
    }
    
    // Método para cambiar configuración
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Reiniciar intervalos si están activos
        if (this.intervalId) {
            this.stopImageRotation();
            this.startRandomAppearances();
        }
    }
    
    // Método para destruir Miguel
    destroy() {
        this.stopImageRotation();
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
        
        const miguel = document.getElementById('miguel');
        if (miguel) {
            miguel.remove();
        }
        
        console.log('🐾 Miguel se fue para siempre...');
    }
}

// Crear instancia global de Miguel
let miguelInstance = null;

// Inicializar Miguel cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    // Solo crear Miguel si estamos en la pantalla principal (no en login)
    if (document.getElementById('main') || document.querySelector('.pantalla.activa')) {
        miguelInstance = new Miguel();
    }
});

// Función para reiniciar Miguel (útil para cambios de pantalla)
function reiniciarMiguel() {
    if (miguelInstance) {
        miguelInstance.destroy();
    }
    
    // Esperar un poco antes de crear nueva instancia
    setTimeout(() => {
        if (document.getElementById('main') || document.querySelector('.pantalla.activa')) {
            miguelInstance = new Miguel();
        }
    }, 1000);
}

// Función para mostrar Miguel manualmente (para testing)
function mostrarMiguel() {
    if (miguelInstance) {
        miguelInstance.forceShow();
    }
}

// Función para ocultar Miguel manualmente
function ocultarMiguel() {
    if (miguelInstance) {
        miguelInstance.forceHide();
    }
}

// Exportar funciones para uso global
window.Miguel = Miguel;
window.miguelInstance = miguelInstance;
window.reiniciarMiguel = reiniciarMiguel;
window.mostrarMiguel = mostrarMiguel;
window.ocultarMiguel = ocultarMiguel;
