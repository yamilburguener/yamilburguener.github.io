var panelIntr; // bug: error panelIntro. variable para los paneles
//var panelMensaj;
var n_panel_titila = 0; // para hide/show
var b_panel = false; // para hide/show
var textP_1, textP_2; // para panel de puntaje

function panel(_i) {
    //  -------- paneles del juego -------------
    // if (_i != 2) {
    panelIntr = createDiv("");
    panelIntr.id("panelIntro");
    panelIntr.position((windowWidth - panelIntr.width) / 2, 190); // posiciona panel
    // } else {
    //    panelMensaj = createDiv("");
    //    panelMensaj.id("panelMensaje");
    //}
    var text_1, text_2, text_nivel;

    if (_i === 0) {
        //seccion = 0;

        personaje_intro.style("display: block;margin-left: auto; margin-right: auto");
        personaje_intro.parent("panelIntro");
        personaje_intro.show();

        text_1 = createP("Tienes la difícil tarea de sacarle el género al idioma patriarcal. Para saltar presiona una TECLA o CLIC. ¡Suerte!");
        text_1.style("text-align: justify; font: 20px mi_fuente"); //;font-size: 13px
        text_2 = createP("Presione una TECLA / CLIC  para iniciar"); //Presione TECLA/CLIC para JUGAR
    } 
    else if (_i == 1) {
        panelIntr.style("width: 250px;");
        panelIntr.position((windowWidth - panelIntr.width) / 2 + 125, 190 + 90); // posiciona panel

        //  -------- muestra nivel -------------
        personaje_small.style("display: block;margin-left: auto; margin-right: auto");
        personaje_small.parent("panelIntro");
        personaje_small.show();

        if (NIVEL != 8) text_1 = createP("NIVEL " + NIVEL);
        else text_1 = createP("NIVEL X");
        
        text_2 = createP("Presione TECLA / CLIC"); //Presione TECLA/CLIC para JUGAR
    } 
    else if (_i == 2) {
        personaje_intro.style("display: block;margin-left: auto; margin-right: auto");
        personaje_intro.parent("panelIntro");
        personaje_intro.show();

        text_1 = createP("PUNTAJE FINAL " + n_puntaje);
        text_2 = createP("Valió la pena intentarlo.");
    }
    text_1.style("text-align: center; font: 26px mi_fuente");
    text_1.parent("panelIntro");

    text_2.style("text-align: center; font: 18px mi_fuente");
    text_2.parent("panelIntro");
}

function panel_puntaje(_i) {

    if (_i === 0) {
        panelIntr = createDiv("");
        panelIntr.id("panelIntro");
        panelIntr.style("width: 250px;");
        panelIntr.style("padding: 25px");
        //panelIntr.style("height: 200px;");
        //panelIntr.style("border: 2px solid #000000");
        panelIntr.position((windowWidth - panelIntr.width) / 2 + 125, 190 + 90); // posiciona panel

        textP_1 = createP("");
        textP_2 = createP("");
        textP_1.style("text-align: center; font: 26px mi_fuente");
        textP_1.parent("panelIntro");
        textP_2.style("text-align: center; font: 18px mi_fuente");
        textP_2.parent("panelIntro");
    }
    else if (_i == 1) {
        var n = int(rampa_puntaje * 0.01) * 100;
        textP_1.html("PUNTAJE " + n);
        if (rampa_puntaje == n_puntaje) {
            if (NIVEL == 1) {
                textP_2.html("¡TU PUNTAJE ES DE " + n_puntaje + "! PERO MUCHO TEXTO QUEDÓ IRRECONOCIBLE. INTENTA MEJORAR EN EL NIVEL 2.");
            } 
            else if (NIVEL == 2) {
                textP_2.html("!TU PUNTAJE YA ES DE " + n_puntaje + "! PERO SIGUES DESTRUYENDO MUCHO TEXTO. INTENTA MEJORAR EN EL NIVEL 3.");
            }
            else if (NIVEL == 3) {
                textP_2.html("HE AQUÍ UN CONTRAPUNTO ENTRE LA SENSIBLE NECESIDAD DE BUSCAR LA IGUALDAD DE GÉNERO, Y LA DESTRUCCIÓN DEL IDIOMA COMO SOLUCIÓN INMEDIATA.");
            }
            else if (NIVEL == 4) {
                textP_2.html("LA PRÓXIMA, PRUEBA SALTAR ENTRE LAS CONSONANTES Y SOLO CAER EN LAS VOCALES PATRIARCALES.");
            }
            else if (NIVEL == 5) {
                textP_2.html("SI LLEGASTE HASTA " + n_puntaje + ", ES PORQUE ESTÁS TOMÁNDOLE GUSTO AL MUNDO DE LAS EXIS. ¡VE POR EL NIVEL 6!");
            }
            else if (NIVEL == 6) {
                textP_2.html("HE AQUÍ UN CONTRAPUNTO ENTRE LA SENSIBLE NECESIDAD DE BUSCAR LA IGUALDAD DE GÉNERO, Y LA DESTRUCCIÓN DEL IDIOMA COMO SOLUCIÓN INMEDIATA.");
            }
            else if (NIVEL == 7) {
                textP_2.html("¡LLEGASTE A  " + n_puntaje + ", FELICITACIONES! TE ESPERA SOLO EL NIVEL NIRVANA FINAL.");
            }
        }
    }
}