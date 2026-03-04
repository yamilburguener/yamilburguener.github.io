// =======================
// DATOS Y MEZCLA
// =======================

const valores = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

mezclar(valores);

// =======================
// VARIABLES DE ESTADO
// =======================

let primera = null;
let segunda = null;
let bloqueo = false;
let paresEncontrados = 0;
let tiempo = 20;
let juegoActivo = true;

const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");

// =======================
// CUENTA REGRESIVA
// =======================

const intervalo = setInterval(() => {
    tiempo--;
    timerDisplay.textContent = "Tiempo: " + tiempo;

    if (tiempo <= 0) {
        clearInterval(intervalo);
        juegoActivo = false;
        bloqueo = true;
        console.log("Gracias por participar");
    }

}, 1000);

// =======================
// CREACIÓN DE FICHAS
// =======================

valores.forEach((valor) => {

    const boton = document.createElement("button");
    boton.dataset.valor = valor;
    boton.textContent = "";
    grid.appendChild(boton);

    boton.addEventListener("click", () => {

        if (!juegoActivo) return;
        if (bloqueo) return;
        if (boton.classList.contains("matched")) return;
        if (boton === primera) return;

        boton.textContent = valor;

        if (!primera) {

            primera = boton;

        } else {

            segunda = boton;
            bloqueo = true;

            if (primera.dataset.valor === segunda.dataset.valor) {

                primera.classList.add("matched");
                segunda.classList.add("matched");
                paresEncontrados++;

                resetTurno();

                if (paresEncontrados === 6) {
                    clearInterval(intervalo);
                    juegoActivo = false;
                    console.log("Ganaste");
                }

            } else {

                setTimeout(() => {
                    primera.textContent = "";
                    segunda.textContent = "";
                    resetTurno();
                }, 800);

            }
        }

    });

});

// =======================
// RESET TURNO
// =======================

function resetTurno() {
    primera = null;
    segunda = null;
    bloqueo = false;
}