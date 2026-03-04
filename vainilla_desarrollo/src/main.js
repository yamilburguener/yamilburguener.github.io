// CSS
// import './assets/css/index.css'

// Core
import { iniciarJuego } from './core/game.js'
import { btnStart, btnsReset } from './ui/dom.js'

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  // Botón de inicio
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      iniciarJuego();
      console.log('Juego iniciado');
    });
  }

  // Botones de reinicio (Ganaste/Perdiste)
  if (btnsReset) {
    btnsReset.forEach(btn => {
      btn.addEventListener('click', () => {
        iniciarJuego();
      });
    });
  }
});
