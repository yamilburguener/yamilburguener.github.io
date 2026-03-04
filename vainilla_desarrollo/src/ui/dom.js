import { IMAGEN_DORSO } from '../constants.js';

export const grid = document.getElementById("grid");
export const timerDisplay = document.getElementById("timer");
export const startScreen = document.getElementById("start-screen");
export const gameScreen = document.getElementById("game-screen");
export const winScreen = document.getElementById("win-screen");
export const loseScreen = document.getElementById("lose-screen");
export const btnStart = document.getElementById("btn-start");
export const btnsReset = document.querySelectorAll(".btn-reset");

export function mostrarPantalla(id) {
    // Ocultar todas las pantallas
    [startScreen, gameScreen, winScreen, loseScreen].forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });

    // Mostrar la pantalla correspondiente
    if (id === 'game') gameScreen.classList.remove('hidden');
    else if (id === 'win') winScreen.classList.remove('hidden');
    else if (id === 'lose') loseScreen.classList.remove('hidden');
    else startScreen.classList.remove('hidden');
}

export function actualizarTimer(tiempo) {
    if (timerDisplay) {
        timerDisplay.textContent = `Tiempo: ${tiempo}`;
    }
}

export function crearFicha(valor, onClick) {
    const boton = document.createElement("button");
    boton.style.backgroundImage = `url(${IMAGEN_DORSO})`;
    boton.style.backgroundSize = "cover";
    boton.style.backgroundPosition = "center";
    boton.style.backgroundRepeat = "no-repeat";
    // data-valor
    boton.dataset.valor = valor;
    boton.className = "card";
    boton.textContent = "";
    boton.addEventListener("click", () => onClick(boton));
    return boton;
}
