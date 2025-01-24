/* versión de las librerias: 
p5.js v0.6.1 April 27, 2018
p5.sound.js v0.3.7 2018-01-19
p5.dom.js v0.3.4 Jan 19, 2017
p5.play, 2015

Credits:
Fonts: 
- "The Million Mile Man" de Geronimo Fonts
- "Luckiest Guy" de Astigmatic One Eye Typographic Institute
*/

p5.disableFriendlyErrors = true; //https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance

var GRAVITY = 2; // gravedad
var JUMP = 12; // fuerza del salto
var SPEED = 7; // velocidad del personaje
var NIVEL = 0; // nivel del juego (0)
var CAMARA_FINAL = 0.4; //0.4 desktop, 0.6 smartphone

var personaje; // variable de nuestro personaje
var p_speed_x = 0; // para velocidad del personaje
var jump_cant = 0; // para que no pueda treparse a las plataformas tan facilmente
var jump_speed_x = 1; // la velocidad se duplica cuando salta
var caida_time = 150; // a los cuantos ms de estár cayendo se toma como una caida
var dir_avanza = 1; // direccion del avance del personaje
var n_collide = 0; // para cuando se queda avanzando contra una letra
var b_jump = false;
var b_saltar = false;

//var b_camera = true;
var camara_pos_x; //= 900;
var camara_pos_y; // = 500 + 580; // + 380;
var camara_vel_x, camara_vel_y; // seguimiento de camara
var camara_prop; // proporción entre 2.5 o 1.66666667

var seccion = -1; // “seccion” varios estados

var vocal = [];
var esquirla = []; // "x"s que se desprenden del persanoje
var canvas;
var b_fade_final = false; //fade al pasar de pantalla

var tiempo_final = 0; // glitch final de hoja
var p_inicial_x; // para posicionar el personaje en la caida inicial
var b_parallax_final = false; // bug para pasar de nivel
var b_iniciar = true; // para iniciar juego luego del panel inicial
//var b_celular = true; // para ver si se ejecuta desde celular

var sonido = []; // sonidos
var b_sonido_corre = true;
//var c_sonido = 0;

var loaded = false; // para que cargue bine los sonidos, etc.

var n_puntaje = 0; // puntaje de xs correctas
var rampa_puntaje = 0;
var gana_puntos = []; // para class


// ===================================== SETUP =============================================
function setup() {
    canvas = createCanvas(720, 720);
    canvas.parent('sketch-holder');
    canvas.position((windowWidth - width) / 2, 50);
    frameRate(30);
    noStroke();
    colorMode(HSB);
    deviceOrientation = PORTRAIT;
    
    Escenario(NIVEL); // Se crea el escenario (plataformas y fondos: en Escenario.js)

    // se crea el personaje y sus estados -----------------------------
    personaje = createSprite(0, 0);
    personaje.addAnimation("corre", "assets/r1.png", "assets/r1.png",
                           "assets/r1.png", "assets/r1.png", "assets/r1.png", "assets/r2.png");
    personaje.addAnimation("salta", "assets/s1.png", "assets/s2.png");
    personaje.addAnimation("cae", "assets/s1.png", "assets/s2.png");
    personaje.visible = false; // al comienzo esta invisible hasta que desaparece panel intro
    personaje.depth = 5;
    //personaje.debug = true;
    personaje.setCollider("circle", 0, 0, 20); // personaje.setCollider("rectangle", 0, 0, 30, 30);//
    // -----------------------------------------------------------------

    Iniciando();
    seccion = 0;
    panel(0); // panel introduccion al juego. ir a paneles.js
    noCursor();
}


// =================================== DRAW =====================================
function draw() {
    // “seccion” tiene 5 estados: 
    //(-1) celular o pc (0) intro (1) cae personaje (2) juego (3) cierre (4) wait... (5) end

    if (loaded && seccion === 0) {

        if (NIVEL != 0) {
            Zoom_camara(1);
            background(background_rgb[0]); //255,247,169
            drawSprites(); // ir a libreria p5.play.js
        } else {
            background(0); ////////
            tiempo_final = millis() + 1000;
        }
        // titilan los paneles -------------
        if (NIVEL > 0) {
            n_panel_titila++;
            if (n_panel_titila % 30 === 0) { // 24 es 1 segundo
                b_panel ^= true;
                if (b_panel) panelIntr.show();
                else panelIntr.hide();
            }
        }
        // ---------------------------------
    } 
    // -------------------- cae personaje ----------------------
    else if (seccion == 1) {
        background(background_rgb[0]);
        Zoom_camara(2);

        for (var i = 0; i < plataforma.length; i++) {
            if (personaje.collide(plataforma[i])) {
                Cambia_vocal(i);
                Salta();
                seccion = 2;
                //sonido['cae'].setLoop(false);
                break;
            }
        }
        // el personaje cae
        personaje.velocity.y += GRAVITY * 0.25;
        drawSprites(); // ir a libreria p5.play.js
    } 
    // -------------------- juego ----------------------
    else if (seccion == 2) {

        var rb = random(1);
        if (rb < 0.18) { // orig. 0.2
            blendMode(BURN); //DODGE
        } else {
            background(background_rgb[0]);
            textSize(40);
        }
        // bug: para que no se escape por los bordes
        if (personaje.position.x < 0) {
            //print("extremo " + personaje.position.x);
            personaje.position.x = 30;
        } else if (personaje.position.x > width_total) {
            //print("extremo " + personaje.position.x);
            personaje.position.x = width_total - 30;
        }


        // -------------------- personaje en plataformas -------------
        // si el personaje NO está saltando --------------------------
        if (!b_jump) {
            // colisión de personaje y plataformas----------------
            var n = 0; // variable para activar la animación (cae) en una caida
            for (var i = 0; i < plataforma.length; i++) {
                if (personaje.collide(plataforma[i])) {

                    Cambia_vocal(i);

                    if (personaje.touching.top) { //new in -------
                        plataforma[i].position.y += int(random(1, 4)); //letras se unden
                        n_collide = 0;
                        personaje.velocity.y = 0;

                    } else if (personaje.touching.bottom) {
                        plataforma[i].position.y += int(random(1, 4)); //letras se unden
                        n_collide = 0;
                        personaje.velocity.y = 0;

                        p_estado("corre", 4, 9);
                    } else { // new out ---------
                        n_collide++;
                        if (n_collide > 2) { //cuando se traba en una letra

                            personaje.velocity.y += GRAVITY;
                            Cae();

                        }
                    }

                    n++;
                    caida_time = millis() + 100;

                    if (b_sonido_corre) {
                        sonido['corre'].setVolume(1.0, 0.1); // rodando
                        sonido['cae'].setVolume(0, 0.1);
                        b_sonido_corre = false;
                    }
                }
            }
            if (n === 0) {
                if (millis() > caida_time && !b_sonido_corre) Cae();
            }


            personaje.velocity.y += GRAVITY; // agregado
        }
        // -----------------------------------------------------------
        else { // si el personaje está saltando ----------------------
            var n = 0; // variable para activar la animación (cae) en una caida
            personaje.velocity.y += GRAVITY;
            if (millis() > jump_cant) { //antes jump_time ¿?
                for (var i = 0; i < plataforma.length; i++) {
                    if (personaje.collide(plataforma[i])) {

                        Cambia_vocal(i);

                        // cuando personaje colisiona con plataformas desde un salto
                        if (personaje.touching.top) { // new in -------
                            plataforma[i].position.y += int(random(3, 10)); //letras se unden
                        } else if (personaje.touching.bottom) {
                            p_estado("corre", 4, 9);
                            plataforma[i].position.y += int(random(3, 10)); //letras se unden
                        } // new out -------
                        /*if (personaje.touching.top) print(i + " top");
            if (personaje.touching.bottom) print(i + " bottom");
            if (personaje.touching.left) print(i + " left");
            if (personaje.touching.right) print(i + " right");*/
                        b_jump = false;
                        jump_speed_x = 1;
                        if (p_speed_x === 0) Cae();

                        n++;
                        caida_time = millis() + 150; // para sonido 'cae'

                    }
                }
            }
            if (n === 0) {
                if (millis() > caida_time && !b_sonido_corre) Cae();
            }
        }
        // -----------------------------------------------------------

        // ------------------------ desplazamiento personaje ------------------
        if (personaje.collide(borde[1])) {
            // el personaje rebota contra el borde
            dir_avanza = -1;
            Avanza(dir_avanza);
        } else
            if (personaje.collide(borde[0])) {
                dir_avanza = 1;
                Avanza(dir_avanza);
            } else {
                // el personaje avanza
                personaje.position.x += p_speed_x * jump_speed_x;
            }

        Zoom_camara(5);

        // para Class GanaPuntos ---------------------------------
        if (gana_puntos !== null) {
            for (var i = gana_puntos.length - 1; i >= 0; i--) {
                gana_puntos[i].render();

                if (gana_puntos[i].isFinished()) {
                    gana_puntos.splice(i, 1);
                }
            }
        }
        // ----------------------------------------------------

        // para Class Esquirla ---------------------------------
        if (esquirla !== null) {
            for (var i = esquirla.length - 1; i >= 0; i--) {

                for (var ii = 0; ii < plataforma.length; ii++) {
                    esquirla[i].contacto(ii); // antes esquirla[i].contacto(plataforma[ii]);
                }
                if (esquirla[i].isFinished()) {
                    esquirla.splice(i, 1);
                }
            }
            // sí cae en precipicio ----------------
            if (esquirla.length <= 0 && personaje.position.y > 1800 && b_parallax_final && gana_puntos.length <= 0) {
                sonido['corre'].setVolume(0.0, 0.5); // bug: si cae con letra enganchada
                seccion = 3;
                tiempo_final = millis() + 100;
            }
        }

        drawSprites(); // ir a libreria p5.play.js
    } 
    // -------------------- cierre ----------------------
    else if (seccion == 3) {
        blendMode(BURN);
        var r = random(4, 7);
        if (random(2) < 1.0)
            camera.position.x = camera.position.x + (r * -1);
        else
            camera.position.x = camera.position.x + r;

        drawSprites(); // ir a libreria p5.play.js

        if (millis() >= tiempo_final) {
            tiempo_final = millis() + 3000;
            b_panel = true;
            seccion = 3.5;
        }
    }
    // ---------------- panel puntaje ---------------------
    else if (seccion == 3.5) {
        if (millis() >= tiempo_final) {
            if (b_panel) {
                panel_puntaje(0);
                b_panel = false;
            }
            if (rampa_puntaje < n_puntaje) {
                rampa_puntaje += 10;
                if (rampa_puntaje % 100 === 0) sonido['exis'].play(0, 1, 1, 0.22);
            } 
            else {
                rampa_puntaje = n_puntaje;
                tiempo_final = millis() + 5000;
                seccion = 4;
            }
            panel_puntaje(1);
        }
    }
    // -------------------- wait... ----------------------  
    else if (seccion == 4) {

        if (millis() >= tiempo_final) {
            if (NIVEL != 0) {
                // fade final ----------------
                Zoom_camara(1);
                colorMode(RGB);
                fill(0, 10);
                rect(0, -150, width * camara_prop, height * camara_prop);
                colorMode(HSB);
                if (millis() >= tiempo_final + 3000) {
                    panelIntr.remove();
                    b_fade_final = true;
                }
            }

            if (b_fade_final || NIVEL === 0) {
                background(0);
                b_fade_final = false; // fade_final = 0;

                NIVEL++;
                if (NIVEL <= 8) {
                    for (var i = plataforma.length - 1; i >= 0; i--) {
                        plataforma[i].remove();
                        plataforma.splice(i, 1);
                    }
                    plataformas.removeSprites();

                    //proporciones para celulares o computadoras
                    camara_prop = (width / CAMARA_FINAL) / width; // 2.5 o 1.66
                    width_total = width * camara_prop; // 1800 o 1200

                    //NIVEL++;
                    Escenario(NIVEL);
                    Iniciando();
                    panelIntr.remove();
                    panel(1);
                } else {
                    panel(2);
                    seccion = 5;
                }
            }
        }
    }
}



// =============================== OTRAS FUNCIONES ============================

// tipos de animaciones del personaje ------------------------
function p_estado(_e, _f, _r) {
    personaje.changeAnimation(_e);
    personaje.animation.frameDelay = _f;
    personaje.rotationSpeed = _r;
}

function Salta() {

    if (!b_jump && millis() > jump_cant) { // cuando presiona la tecla: solo una vez
        b_jump = true; // SALTANDO;
        p_estado("salta", 4, 5);
        personaje.velocity.y = -JUMP;
        jump_speed_x = 3;
        //jump_time = millis() + 70;
        jump_cant = millis() + 300;

        esquirla.push(new Esquirla(personaje.position.x, personaje.position.y));

        // sonidos ---------------------------
        sonido['salta'].play(0, random(0.8, 1.01));
        if (random(2) > 1.2) sonido['esquirla'].play(0, random(0.8, 1.01));
        sonido['corre'].setVolume(0, 0.1); // orig 0.03
        sonido['cae'].setVolume(0, 0.1);
        b_sonido_corre = true;
    }
}

function Cae() {
    p_estado("cae", 7, 7);
    // sonidos ---------------------------
    sonido['corre'].setVolume(0, 0.1);
    sonido['cae'].setVolume(1, 0.1);
    sonido['cae'].play();
    b_sonido_corre = true;
}
// -----------------------------------------------------------

function Avanza(_i) {
    // va hacia derecha
    if (_i == 1) {
        p_speed_x = SPEED;
        personaje.mirrorX(1);
    } else {
        // va hacia izquierda
        p_speed_x = -SPEED;
        personaje.mirrorX(-1);
    }
}

// cambia personaje toca una vocal, la cambia por una x
function Cambia_vocal(_i) {
    if (vocal[_i] > 0) {
        // exis animada
        plataforma[_i].addAnimation("anim", "assets/x1.png", "assets/x2.png", "assets/x3.png",
                                    "assets/x4.png");
        plataforma[_i].changeAnimation("anim");
        plataforma[_i].animation.frameDelay = 2;
        plataforma[_i].animation.looping = false;

        if (vocal[_i] == 2) {
            n_puntaje += 100; //suma puntaje
            gana_puntos.push(new GanaPuntos(plataforma[_i].position.x, plataforma[_i].position.y - 60));
            sonido['exis'].play();//0, 0.4);
        } else {
            sonido['exis'].play(); //(0, random(0.8, 1.01));
        }
        vocal[_i] = 0;
    }
}

// Class GanaPuntos -------------------------------------------
function GanaPuntos(_x, _y) {
    this.x = _x;
    this.y = _y;

    this.puntos = createSprite(this.x, this.y);
    this.puntos.addImage(img_puntaje);
    this.puntos.depth = 20;
    this.t = millis() + 3000;

    this.render = function() {
        if (int(millis() * 0.01) % 2 === 0) {
            this.puntos.visible = true;
        } else {
            this.puntos.visible = false;
        }
    }

    this.isFinished = function() {
        if (millis() > this.t) {
            this.puntos.remove();
            return true;
        } else {
            return false;
        }
    }
}
// camara -----------
function Zoom_camara(_i) {

    if (_i == 1) {
        camera.position.x = camara_pos_x;
        camera.position.y = camara_pos_y;
        camera.zoom = CAMARA_FINAL; //proporción 2,5
    } else
        if (_i == 2) {
            camara_vel_x = personaje.position.x + (355 - p_inicial_x);
            camara_vel_y = 0;
            camera.position.x = camara_vel_x; //x;
            camera.position.y = camara_vel_y;
            camera.zoom = 1.0;
        } else
            if (_i == 5) {
                var z = map(personaje.position.y, 0, width / 2 + 500, 1.0, CAMARA_FINAL); // 0.8 - CAMARA_FINAL
                z = constrain(z, CAMARA_FINAL, 1.0);

                var y;
                camera.zoom = z;

                if (z > CAMARA_FINAL) {
                    y = map(personaje.position.y, -150, height * camara_prop / 2, personaje.position.y - 100, camara_pos_y);
                    Velocidad_Camara(personaje.position.x, y);

                    camera.position.x = camara_vel_x; //personaje.position.x; //x;
                    camera.position.y = camara_vel_y; //y;
                } else {
                    Velocidad_Camara(camara_pos_x, camara_pos_y);

                    camera.position.x = camara_vel_x;
                    camera.position.y = camara_vel_y;
                }

                /*var s = map(z, 0.4, 1.0, 1.5, 0.5);
    fondo_lejos.scale = s;
    s = map(z, 0.4, 1.0, 1.5, 1.3);
    fondo_cerca.scale = s;*/

            }
}

function Velocidad_Camara(_x, _y) {
    var e;
    if (camera.zoom > CAMARA_FINAL) {
        e = map(camera.zoom, 1.0, CAMARA_FINAL, 15, 10);

        var limite_izq = map(camera.zoom, 1.0, CAMARA_FINAL, width / 2, 288 * camara_prop); //720
        var limite_der = map(camera.zoom, 1.0, CAMARA_FINAL, width * camara_prop - width / 2, 432 * camara_prop); //1080
        if (personaje.position.x > limite_izq && personaje.position.x < limite_der) {
            // desplazamiento cámara: la camara sigue al personaje
            if (camera.position.x < personaje.position.x - SPEED) camara_vel_x += SPEED * jump_speed_x;
            else if (camera.position.x > personaje.position.x + SPEED) camara_vel_x -= SPEED * jump_speed_x;
        } else {
            if (personaje.position.x <= limite_izq && camera.position.x > limite_izq) {
                camara_vel_x -= SPEED;
            }
            if (personaje.position.x >= limite_der && camera.position.x < limite_der) {
                camara_vel_x += SPEED;
            }
        }
    } else {
        e = 4;

        if (camara_vel_x < _x - e) camara_vel_x += e;
        else if (camara_vel_x > _x + e) camara_vel_x -= e;
        else {
            var r = 0;
            if (random(2) < 0.2) r = random(3, 10);
            camara_vel_x = _x + random(-r, r);
            b_parallax_final = true;
        }
    }

    e = map(camera.zoom, 1.0, CAMARA_FINAL, 3, 6); // 3, 1

    if (camara_vel_y < _y - e) camara_vel_y += e;
    else if (camara_vel_y > _y + e) camara_vel_y -= e;
    else {
        //fondo_erase += 1;
        camara_vel_y = _y;
    }

}
// -------------------------------------------------------------

function touchStarted() { // celu y compu
    if (b_iniciar) {
        To_press();
        b_iniciar = false;
    } else {
        if (b_saltar)
            if (seccion > 1)  Salta();
        b_saltar = false;
    }
    // bug problema con audio en Chrome
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}

function touchEnded() { // celu y compu
    b_saltar = true;
}

function keyPressed() {
    To_press();
}

function mousePressed() { // celu y compu
    if (CAMARA_FINAL != 0.6) To_press(); // bug: salta inicio de celu
}

function To_press() {
    if (seccion === 0) { // para remover panel introduccion
        if (touches.length > 0) { // comprueba si se ejecuta desde celular
            if (touches[0].x != 0) {
                CAMARA_FINAL = 0.6;
            }
        }

        panelIntr.remove();
        personaje.visible = true; // aparece el personaje cuando desaparece el panel
        if (NIVEL != 0) {
            seccion = 1;
            //sonido['cae'].loop(); //(0,1,1,0.8,0.1);
            //sonido['cae'].setVolume(1, 2.0);
        } else {
            // primera vez que ingresa al juego
            seccion = 4;
            // bug problema con audio en Chrome
            if (getAudioContext().state !== 'running') {
                getAudioContext().resume();
            }

            if (loaded) {
                sonido['corre'].setVolume(0.0, 0.0); //
                sonido['corre'].loop();
                //sonido['cae'].setVolume(0.0, 0.0); //
                //sonido['cae'].loop();
            }
        }
        Zoom_camara(2);
        p_estado("salta", 4, 2);
        Avanza(dir_avanza);

    } 
    else if (seccion == 1) {
        seccion = 2;
        Salta();
    } 
    else if (seccion == 2) {
        Salta();
    }
}

function Iniciando() {
    b_iniciar = true;
    b_saltar = true; //bug
    b_jump = false;
    seccion = 0;
    personaje.position.x = p_inicial_x;
    personaje.position.y = -1050;
    personaje.velocity.y = 0;
    // camara --------------
    camara_pos_x = width_total / 2; //900
    camara_pos_y = (height * camara_prop / 2) - 150; //900
    Zoom_camara(1);
}

function windowResized() {
    canvas.position((windowWidth - width) / 2, 50);
    panelIntr.position(0, 0); // posiciona panel
}