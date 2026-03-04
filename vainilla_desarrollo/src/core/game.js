import { VALORES, TIEMPO_INICIAL, PARES_A_ENCONTRAR, IMAGENES_OCULTAS, IMAGEN_DORSO } from '../constants.js';
import { S_CLIC, S_SEL, S_PUNTO, S_ERROR, S_GANA, S_PIERDE } from '../constants.js';
import { mezclar } from '../utils/helpers.js';
import { actualizarTimer, crearFicha, grid, mostrarPantalla } from '../ui/dom.js';

let primera = null;
let segunda = null;
let bloqueo = false;
let paresEncontrados = 0;
let tiempo = TIEMPO_INICIAL;
let juegoActivo = false;
let intervalo = null;
const s_clic = S_CLIC, s_sel = S_SEL, s_punto = S_PUNTO,
    s_error = S_ERROR, s_gana = S_GANA, s_pierde = S_PIERDE;

export function iniciarJuego() {
    mostrarPantalla('game');

    // Mezclar valores
    const valoresMezclados = [...VALORES];
    mezclar(valoresMezclados);

    // Reiniciar estado
    paresEncontrados = 0;
    tiempo = TIEMPO_INICIAL;
    juegoActivo = true;
    bloqueo = false;
    primera = null;
    segunda = null;

    if (intervalo) clearInterval(intervalo);
    actualizarTimer(tiempo);

    // Limpiar grid
    grid.innerHTML = '';

    // Crear fichas
    valoresMezclados.forEach((valor) => {
        const ficha = crearFicha(valor, manejarClick);
        grid.appendChild(ficha);
    });

    // Iniciar cuenta regresiva
    iniciarContador();

    s_clic.currentTime = 0, s_clic.play();
}

function iniciarContador() {
    intervalo = setInterval(() => {
        tiempo--;
        actualizarTimer(tiempo);

        if (tiempo <= 0) {
            finalizarJuego("lose");

            s_pierde.currentTime = 0, s_pierde.play();
        }
    }, 1000);
}
// 
function manejarClick(boton) {
    // Si el juego no esta activo, o esta bloqueado, o la ficha ya esta emparejada, o es la misma ficha, no hacer nada
    if (!juegoActivo || bloqueo || boton.classList.contains("matched") || boton === primera) return;

    // Pone la imagen de la ficha
    boton.style.backgroundImage = `url(${IMAGENES_OCULTAS[boton.dataset.valor]})`;
    boton.style.backgroundSize = "cover";
    boton.style.backgroundPosition = "center";
    boton.style.backgroundRepeat = "no-repeat";
    boton.classList.add("selected");
    // Si es la primera ficha, guardarla
    if (!primera) {
        primera = boton;
    } else {
        segunda = boton;
        bloqueo = true;

        verificarPareja();
    }

    s_sel.currentTime = 0, s_sel.play();
}

function verificarPareja() {
    if (primera.dataset.valor === segunda.dataset.valor) {
        primera.classList.add("matched");
        segunda.classList.add("matched");
        paresEncontrados++;

        resetTurno();

        setTimeout(() => {
            s_punto.currentTime = 0, s_punto.play();
        }, 300);

        if (paresEncontrados === PARES_A_ENCONTRAR) {
            finalizarJuego("win");

            setTimeout(() => {
                s_gana.currentTime = 0, s_gana.play();
            }, 600);
        }
    } else {
        setTimeout(() => {
            segunda.style.backgroundImage = `url(${IMAGEN_DORSO})`;
            segunda.style.backgroundSize = "cover";
            segunda.style.backgroundPosition = "center";
            segunda.style.backgroundRepeat = "no-repeat";
            //
            primera.style.backgroundImage = `url(${IMAGEN_DORSO})`;
            primera.style.backgroundSize = "cover";
            primera.style.backgroundPosition = "center";
            primera.style.backgroundRepeat = "no-repeat";
            segunda.classList.remove("selected");
            primera.classList.remove("selected");
            resetTurno();
        }, 1000);

        setTimeout(() => {
            s_error.currentTime = 0, s_error.play();
        }, 200);
    }
}

function resetTurno() {
    primera = null;
    segunda = null;
    bloqueo = false;
}

function finalizarJuego(resultado) {
    clearInterval(intervalo);
    juegoActivo = false;
    bloqueo = true;

    // Pequeño delay para ver la última carta
    setTimeout(() => {
        mostrarPantalla(resultado);
    }, 500);
}
