/* versión de las librerias: 
p5.js v0.9.0 July 01, 2019
p5.sound.js v0.3.11 2019-03-14
p5.js v0.9.0 July 01, 2019
*/

var img_woman, img_man, img_nadie, img_girl, img_boy, img_robot;
var img_mundo, img_casa, img_desgaste, img_vacia;
var rotacion = 0;
var pg1, pg2, pg_mundo;
var pg_boton;

var mundo_proporcion = 2.0;
var mundo_vel = 0.002; //0.02
var mundo_bool = true;
var mundo_x, mundo_y;
var mundo_speedX, mundo_speedY = 0.1;

var fuente_texto = [];

//var elije_cont = 0;
var cont_opcion = 0;
var tiempo_opcion = 0.0, tiempo_hijos = 0;

var rosa_H = 237, rosa_S = 53;
var celeste_H = 141, celeste_S = 255;
var violeta_H = 186, violeta_S = 118; // HSB = 186, 118, 166

var icono = [];
icono[0] = {
    tH: 0, tS: 0, info: ""
};
icono[1] = {
    tH: 0, tS: 0, info: ""
};

var persona = [];
persona[0] = {
    sexo: "nadie", tH: 0, tS: 0, img: Image, n_hijos: 0, n_casas: 0, sonido: 0
};
persona[1] = {
    sexo: "nadie", tH: 0, tS: 0, img: Image, n_hijos: 0, n_casas: 0, sonido: 0
};

var botones = [];
var b_botones = true;
var selector_boton = [];
var selector_nTotal = 19; // orig: 11 (parejas) + 4 (solos) + 2 ( robots) + 2 (trios)
var selector_cont = 0;
var tiempo_boton;
var seccion = "";
var familias_cont = 0;
var b_cartel_1 = false, b_cartel_2 = false, b_cartel_3 = true; //para activar cartel
var parejas = [];
var color_ranH, color_ranS;
var back_fade = 255; // para que vaya oscureciendo en fondo

var zoom_mundo = 1.0;
var estrellas = [];
var tiempo; // latencia entre secciones
var n_colonia; // nº de colonia
var b_celular = false;
var b_para_cel = true; // no se usa
var link; // para ubicar link a info

var musica = [];

// -------------------------------------------------------------
p5.disableFriendlyErrors = true; //https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
//p5.prototype._handleMotion._setProperty('deviceOrientation', 'landscape');

function preload() {
    img_woman = loadImage("assets/woman_white.png");
    img_man = loadImage("assets/man_white.png");
    img_girl = loadImage("assets/girl.png");
    img_boy = loadImage("assets/boy.png");
    img_robot = loadImage("assets/robot_small.png");

    img_mundo = loadImage("assets/mundo.png");
    img_casa = loadImage("assets/casa.png");
    img_desgaste = loadImage("assets/lineas.png");

    fuente_texto[0] = loadFont('assets/fuentes/Stencilia-A.ttf');
    fuente_texto[1] = loadFont('assets/fuentes/RussoOne-Regular.ttf');

    for (let i = 0; i < 5; i++) { // sonido boton: caldo_3 t caldo_4
        musica[i] = loadSound("assets/sonidos/caldo_" + i + ".mp3");
        musica[i].setVolume(1.0);
    }
}


// ----------------------------------- SETUP --------------------------------------
function setup() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        b_celular = true;
        alert("THIS APP VERSION DON'T WORK IN MOBILE DEVICE");
    } else {
        b_celular = false
    }

    canvas = createCanvas(1000, 600);//1280, 720);
    //canvas.parent('sketch-holder');
    var w = ubic_w();
    var h = ubic_h();
    canvas.position(w, h); 

    link = createA('https://yamilburguener.blogspot.com/2019/05/caldo.html', 'info');
    link.id("inf");
    link.position(w + 480, h + 300 + 310);
    //deviceOrientation = LANDSCAPE;
    frameRate(200);

    pg1 = createGraphics(1000 * mundo_proporcion, 600 * mundo_proporcion);
    Setup_Escenario(pg1);
    pg2 = createGraphics(1000 * mundo_proporcion, 600 * mundo_proporcion);
    Setup_Escenario(pg2);

    pg_mundo = createGraphics(1000 * mundo_proporcion + 100, 600 * mundo_proporcion + 100);
    Setup_Escenario(pg_mundo);
    pg_mundo.imageMode(CENTER);
    pg_mundo.textFont(fuente_texto[0]);
    pg_mundo.textAlign(CENTER, CENTER);
    pg_mundo.noStroke();
    pg_mundo.rectMode(CENTER);
    pg_mundo.textSize(10);

    imageMode(CENTER);
    colorMode(HSB, 255);
    textFont(fuente_texto[1]);
    textAlign(CENTER, CENTER);
    noStroke();
    rectMode(CENTER);
    textSize(10);
    cursor();

    mundo_x = width / 2;
    mundo_y = height + 50;
    if (random(1) < 0.5) mundo_speedX = -0.1; else mundo_speedX = 0.1;

    img_nadie = createImage(11, 28);
    persona[0].img = img_nadie;
    persona[1].img = img_nadie;
    icono[0].info = img_nadie;
    icono[1].info = img_nadie;

    // orden de opciones ------------------------------
    // primeros cuatro: solo parejas; 
    // del 5º al 8º no sale robot y empiezan a salir los solos y gente neutra; luego el resto
    let _a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];//
    _a = shuffle(_a); //_a = mi_shuffle(_a);

    let _b = subset(_a, 0, 4);
    let _c = subset(_a, 4, 10);

    let _d = [11, 12, 13, 14];
    let _e = _c.concat(_d);
    _e = shuffle(_e);

    let _f = subset(_e, 0, 4);
    let _g = subset(_e, 4, 8);
    //print (_b + " www " +_f + " :::  "+_g);
    let _h = [15, 16, 17, 18]; // robots y trios
    let _i = _g.concat(_h);
    _i = shuffle(_i);

    selector_boton = _b.concat(_f);
    selector_boton = selector_boton.concat(_i);//concat(_b, _f, _b);
    //selector_boton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    //selector_boton = [0, 5, 12, 1, 8, 4, 11, 18, 2, 16, 10, 3, 9, 13, 14, 15, 6, 17, 7]; // para video
    selector_cont = 0;
    print(selector_boton);
    // --------------------------------------------------

    tiempo = millis() + 5000;
    seccion = "titulo";

    for (let i = 0; i < 5; i++) {
        musica[i].playMode('restart');
    }

    color_ranH = random(100), // (para video: 5)
    color_ranS = random(30, 155); // restringe cantidad de colores (para video: 130)
    n_colonia = int(random(100000000)); // crea nº de colonia
    Arma_pg_mundo("mundo");
}


// ----------------------------------- DRAW --------------------------------------
function draw() {
    // fondo ---------------------------------
    //let m = map(mouseX, 0, width, 0, 255);
    let m; //let m = map(familias_cont, 50, 700, 255, 0);
    if (familias_cont > 50) {
        m = map(selector_cont, 1, 16, 255, 0);
        if (back_fade > m) {
            back_fade -= 0.1;
        }
    }

    back_fade = constrain(back_fade, 0, 255);
    background(back_fade);
    //fill(111);
    //text(familias_cont, 300, 10);
    /* let ro1 = rotacion % (PI * 2);
    text(ro1, 600, 10);*/

    // secciones ------------------------------
    if (seccion == "opciones" && millis() > tiempo_boton) {
        if (selector_cont < selector_nTotal) {
            if (b_botones) {
                b_botones = false;

                Pre_Opcion(selector_boton[selector_cont]);
                botones.push(new Boton(icono[0].info, icono[1].info, selector_boton[selector_cont]));
                seccion = "ingreso";

            } else {
                botones[0].isFinished();
                botones.splice(0, 1);

                b_botones = true;
                tiempo_boton = millis() + 2000;
            }
        } else if (parejas.length > 0) {
            // fin de las opciones
            Arma_pg_mundo("cartel 3");
            tiempo = millis() + 15000;
            //musica[0].stop();
            seccion = "hacia universo";
        }
    }
    else if (seccion == "ingreso") {
        botones[0].ingreso();



    }
    else if (seccion == "seleccion") {
        let r = int((tiempo_boton - millis()) * 0.001);
        if (r < 0) r = 0;
        botones[0].regresiva(r);

        if (millis() > tiempo_boton) {
            selector_cont++;
            botones[0].color("no");
            seccion = "salida por izquierda";
        }
    }
    else if (seccion == "salida por izquierda") {
        botones[0].salida_izq();
    }
    else if (seccion == "salida por derecha") {
        botones[0].salida_der();
    }
    else if (seccion == "hacia universo") {
        // al final del codigo
    }
    else if (seccion == "universo") {
        if (zoom_mundo > 0.001) estrellas.push(new Estrella(random(width), random(height)));

        if (estrellas.length > 0) {
            for (let i = estrellas.length - 1; i >= 0; i--) {
                estrellas[i].update();
            }
        }

        let v = constrain(zoom_mundo, 0.0, 1.0);
        musica[1].setVolume(v);
        musica[2].setVolume(v);
    }

    if (parejas.length > 0) {// if (elije_opcion.length > 0) {//
        if (millis() > tiempo_opcion && zoom_mundo > 0.5) {

            let m = map(parejas.length, 1, 7, 400, 0, true); // orig: 0, 8, 800, 10  // antes: elije_cont
            var t = map(tiempo_hijos, 0, 20, 300, -300); // influye la cant de hijos de las parejas
            tiempo_opcion = millis() + m + t; // latencia de las entradas

            var o = cont_opcion % parejas.length; // antes: elije_cont

            Escenario(pg1, o);
            if (!b_celular) Escenario(pg2, o);

            cont_opcion++;
        }
    }


    // ubicacion mundo
    //if (!b_celular) {
    if (mundo_x < width / 2 - 100 || mundo_x > width / 2 + 100) { //centro = width / 2
        mundo_speedX = mundo_speedX * -1;
    }
    mundo_x = mundo_x + mundo_speedX;
    if (seccion != "universo") {
        if (mundo_y < height + 30 || mundo_y > height + 70) { //centro = height + 50
            mundo_speedY = mundo_speedY * -1;
        }
        mundo_y = mundo_y + mundo_speedY;
    } else {
        mundo_y -= 0.6;
        if (mundo_y <= 400) mundo_y = 400;
    }
    //}

    // movimiento mundo --------------------------
    //blendMode(BLEND); //Normal
    rotacion += mundo_vel;
    let ro = rotacion % (PI * 2);

    if (seccion != "universo") {
        // imprime mundo y escenario 1 -------------
        push();
        translate(mundo_x, mundo_y);
        ////let ro = rotacion % (PI * 2);
        if (b_celular) {
            //Rota_en_celular(ro);
        } else {
            rotate(ro);
        }
        image(pg_mundo, 0, 0);//image(img_mundo, 0, 0);

        // cartel --------------------
        if (!b_cartel_1) {
            if (familias_cont > 100) {//if (ro > 0 && ro < 2 && familias_cont > 50) {
                b_cartel_1 = true; // activa cartel
                Arma_pg_mundo("cartel 1");
            }
        }
        if (!b_cartel_2) {
            if (familias_cont > 500) { // orig: 300
                b_cartel_2 = true; // activa cartel
                Arma_pg_mundo("cartel 2");
            }
        }
        pop();

    } else {
        // universo -------------
        push();
        translate(mundo_x, mundo_y);
        ////let ro = rotacion % (PI * 2);
        if (b_celular) {
            //Rota_en_celular(ro);
        } else {
            rotate(ro);
        }

        zoom_mundo -= 0.001;
        if (zoom_mundo < 0.001) zoom_mundo = 0.001;
        image(pg_mundo, 0, 0, pg_mundo.width * zoom_mundo, pg_mundo.height * zoom_mundo);

        //image(pg1, 0, 0, pg1.width * zoom_mundo, pg1.height * zoom_mundo);
        pop();
    }
    //pop();

    // imprime escenario 2 -------------
    if (!b_celular) {
        push();
        if (seccion != "universo") {
            translate(mundo_x - 3, mundo_y - 10);
        } else {
            let _x = map(zoom_mundo, 1, 0.001, 3, 0);
            let _y = map(zoom_mundo, 1, 0.001, 10, 0);
            translate(mundo_x - _x, mundo_y - _y);
        }
        ro = (rotacion * 1.08) % (PI * 2);
        rotate(ro);

        if (seccion != "universo") {
            image(pg2, 0, 0);
        } else {
            image(pg2, 0, 0, pg2.width * zoom_mundo, pg2.height * zoom_mundo);
        }
        pop();
    }

    // imprime "seccion" luego del mundo
    if (seccion == "titulo") {
        textAlign(CENTER);
        fill(220, 20, 120);
        textSize(92);
        text("CALDO", width / 2, height / 2);
        //rotate(0.01);
        fill(0);
        textSize(90);
        text("CALDO", width / 2, height / 2);
        //rotate(-0.01);

        if (millis() > tiempo) {
            textSize(10);

            tiempo_boton = millis();
            seccion = "opciones";
        }
    }
    else if (seccion == "hacia universo") {

        //if (millis() > tiempo) {
        if (mouseIsPressed && millis() > tiempo) {
            saveCanvas(canvas, 'colony_photo_' + n_colonia, 'jpg');
            musica[0].setVolume(0.0, 5);//musica[0].stop();//musica[1].stop();
            //musica[1].setVolume(0.0, 30);
            //musica[2].setVolume(0.0, 35);

            seccion = "universo";
        }

        // texto final
        if (millis() > tiempo) {
            let a = millis() % 1000;
            if (a < 500) {
                fill(255, 255, 255);
                textAlign(CENTER);
                textSize(45);
                text("CLICK", width / 2, height / 2 - 24);
                textSize(20);
                text("TO LET IT GO", width / 2, height / 2 + 15);
            }
        }
    }
}






// otras funciones ------------------------------------------------

// -------------------- clic en boton con Opcion ----------------------------------
function Clic_Opcion() {
    if (seccion != "salida por izquierda") {

        /*if (touches.length > 0) { // comprueba si se ejecuta desde celular
            //if (touches[0].x != 0) {
            b_celular = true;
            //} 
        } else {
            b_celular = false;
        }*/

        Opcion(selector_boton[selector_cont]);//elije_opcion[elije_opcion.length - 1]);

        selector_cont++; //cantidad de botones que pasan.
        //elije_cont++; //cantidad de elegidos.
        botones[0].color("clicked");
        if (parejas.length == 1) musica[0].loop();
        else if (parejas.length == 4) musica[1].loop();
        else if (parejas.length == 7) musica[2].loop();
        let r = int (random (3, 5));
        musica[r].play(); // sonido boton

        seccion = "salida por derecha";
    }
}

function Clic_Over() {
    botones[0].color("over");
}

function Clic_Out() {
    botones[0].color("out");
}


function Setup_Escenario(_pg) {

    let w = ubic_w();
    let h = ubic_h();
    _pg.position(w, h);
    _pg.clear();//background(255); // clear();
    //_pg.blendMode(SCREEN);//EXCLUSION, DIFFERENCE, HARD_LIGHT, BLEND, SCREEN
    _pg.colorMode(HSB, 255);
    //_pg.imageMode(CENTER);

}

function Escenario(_pg, _o) {
    if (_pg == pg1) _pg.clear();

    familias_cont++;

    _pg.push();
    _pg.translate(_pg.width / 2, _pg.height / 2);
    var pg_rotacion;
    pg_rotacion = random(PI * 2);
    _pg.rotate(pg_rotacion);// % (PI * 2));

    //if (mundo_bool) {
    var pos_x = random(-20, 20);

    var ini = -height / 2 * mundo_proporcion + 15;
    var fin = -img_man.height * 2;
    var pos_y = random(ini, fin);

    var m_h = map(pos_y, ini, fin, img_woman.height, 10);

    // lineas blancas del robot ----------------------
    if (parejas[_o].sexo(1) == "robot") {
        //let xx = random(500, 1500);
        //let yy = map(pos_y, -572, -56, 0, 1200);
        for (let i = 0; i < 10; i++) {
            //Desgaste(_pg, pos_x, pos_y);
            let s; // signo
            if (random(1) > 0.5) s = 1; else s = -1;
            let x = pos_x + 20 * s + random(25 * s);
            if (random(1) > 0.5) s = 1; else s = -1;
            let y = pos_y + 5 * s + random(10 * s);
            _pg.blendMode(BLEND); // NORMAL
            _pg.noTint();
            _pg.image(img_desgaste, x, y, parejas[_o].imagen(0).width, m_h);
        }
    }


    var lado;
    if (parejas[_o].sexo(1) == "nadie") {
        lado = 7; // solos van siempre del mismo lado
    } else {
        let r = random(1); // parejas: de que lado va la mujer y el hombre
        if (r < 0.5) lado = 7;
        else lado = -7;
    }
    //}

    for (let i = 0; i < 2; i++) {
        let r = random(3); // orig: 3
        if (r < parejas[_o].para_color_padres()) {
            persona[i].tH = parejas[_o].colorH(i);
            persona[i].tS = parejas[_o].colorS(i);
        } else {
            persona[i].tH = random(color_ranH, color_ranH + 50); // antes:  + 155
            persona[i].tS = random(color_ranS, color_ranS + 100);
        }
    }
    //}

    if (random(1) < 0.7) _pg.blendMode(SCREEN);//EXCLUSION, DIFFERENCE, HARD_LIGHT, BLEND, SCREEN
    else _pg.blendMode(EXCLUSION);

    if (parejas[_o].sexo(0) != "mujer verde") {
        _pg.tint(persona[0].tH, persona[0].tS, 240);
    } else {
        _pg.tint(persona[0].tH, persona[0].tS, 121);
    }
    _pg.image(parejas[_o].imagen(0), pos_x + lado, pos_y, parejas[_o].imagen(0).width, m_h); //persona[0].img.width, m_h
    _pg.tint(persona[1].tH, persona[1].tS, 240);
    _pg.image(parejas[_o].imagen(1), pos_x - lado, pos_y, parejas[_o].imagen(1).width, m_h); //persona[1].img.width

    if (_o == 17 || _o == 18) {
        _pg.image(parejas[_o].imagen(0), pos_x - lado * 2, pos_y, parejas[_o].imagen(0).width, m_h); //persona 3 del trio
    }

    var cant_hijos = int(random(parejas[_o].limite_hijos() + 1)); //random(persona[0].n_hijos + 1)
    if (cant_hijos > 0) {

        if (parejas[_o].sexo(1) == "nadie") {
            lado = 10;
        } else {
            lado = random(1); // de que lado van los hijos
            if (lado < 0.5) lado = 10;
            else lado = -10;
        }

        // hijos -----------------
        for (var i = 0; i < cant_hijos; i++) {
            var r = random(4); // orig: 3
            if (r < parejas[_o].para_color_hijos(0)) {
                if (parejas[_o].sexo(0) == "mujer verde" && random(1) > 0.5) { // bug: si mujer es verde
                    persona[0].tH = 237, persona[0].tS = 53; // puede tener hija rosa
                }
                _pg.tint(persona[0].tH, persona[0].tS, 240);
            } else if (r < parejas[_o].para_color_hijos(1)) {
                _pg.tint(persona[1].tH, persona[1].tS, 240);
            } else {
                let rH = random(color_ranH, color_ranH + 50); // antes: + 155
                let rS = random(color_ranS, color_ranS + 100);
                _pg.tint(rH, rS, 240);
            }
            if (parejas[_o].sexo(0) == "mujer" && parejas[_o].sexo(1) == "hombre" && random(1) > 0.95) {
                _pg.tint(random(255), random(255), 240);
            }

            var m_hh = map(pos_y, ini, fin, img_girl.height, 5);
            if (random(1) < 0.5) {
                _pg.image(img_girl, pos_x + lado * 1.2 + (lado * (i + 1)), pos_y + 5, img_girl.width, m_hh);
            } else {
                _pg.image(img_boy, pos_x + lado * 1.2 + (lado * (i + 1)), pos_y + 5, img_boy.width, m_hh);
            }
        }

    }
    // Casas -----------------------
    if (random(30) < parejas[_o].casas()) { // orig: 35   //persona[0].n_casas
        var pos_x1 = 0;
        var ini1 = -height / 2 * mundo_proporcion;// + (img_man.height * 2);
        var fin1 = -img_casa.height * 2;
        var pos_y1 = random(ini1, fin1);

        var m_h1 = map(pos_y1, ini1, fin1, img_casa.height, 20);

        _pg.tint(255);
        _pg.blendMode(DIFFERENCE);//EXCLUSION, DIFFERENCE, HARD_LIGHT, BLEND, SCREEN
        _pg.image(img_casa, pos_x1, pos_y1, img_casa.width, m_h1);
    }

    //}
    _pg.pop();


    if (_pg == pg1) {
        //pg_mundo.push();
        pg_mundo.image(_pg, pg_mundo.width / 2, pg_mundo.height / 2);
        //pg_mundo.pop();
    }


}

function Arma_pg_mundo(_s) {
    if (_s == "mundo") {
        pg_mundo.image(img_mundo, pg_mundo.width / 2, pg_mundo.height / 2);
    }
    let r;
    if (b_celular) {
        r = random(4, 5.5); //rango para ver los 3 carteles sin que gire nada
    } else {
        r = rotacion % (PI * 2);
    }
    // cartel -------------------- 
    if (_s == "cartel 1") {
        pg_mundo.push();
        pg_mundo.translate(pg_mundo.width / 2, pg_mundo.height / 2);

        pg_mundo.rotate((PI * 2 - PI / 2) - r);
        pg_mundo.fill(255);
        pg_mundo.rect(0, -605, 130, 30); //150
        pg_mundo.rect(-72 + 20, -583, 5, 30); // -573
        pg_mundo.rect(72 - 20, -583, 5, 30);
        pg_mundo.fill(0);
        pg_mundo.textFont(fuente_texto[0]);
        pg_mundo.text("OUR FREE COLONY! PRETI DISH N" + n_colonia, 0, -605, 120, 50);
        //THIS IS YOUR WORLD | BIENVENIDOS A LA COLONIA //WELCOME TO COLONY 132 / WE ARE FREE COLONY
        pg_mundo.pop();
    }
    else if (_s == "cartel 2") {
        pg_mundo.push();
        pg_mundo.translate(pg_mundo.width / 2, pg_mundo.height / 2);
        //let r = rotacion % (PI * 2);
        pg_mundo.rotate((PI * 2 - PI / 2) - r);
        pg_mundo.fill(230);
        pg_mundo.rect(0, -605, 130, 30); //150
        pg_mundo.rect(-72 + 20, -582, 5, 30);
        pg_mundo.rect(72 - 20, -582, 5, 30);
        pg_mundo.fill(30);
        let _r = random(1); // (para video: 0.30)
        if (_r > 0.75) {
            pg_mundo.text("WE ARE GRATEFUL, BUT WE HAVE PROBLEMS", 0, -606, 120, 50);
        } else if (_r > 0.50) {
            pg_mundo.text("HELP! THE ECOSYSTEM IS COLLAPSING", 0, -606, 120, 50);
        } else if (_r > 0.25) {
            pg_mundo.text("SOMETHING SPECIAL IS GROWING", 0, -606, 120, 50);
        } else {
            pg_mundo.text("WE WILL NEVER BE A CULTURE BROTH", 0, -606, 120, 50);
        }
        //HONGOS $1 C/U //HELP. THE ECOSYSTEM IS COLLAPSING// WE WILL NEVER BE A CULTURE BROTH
        pg_mundo.pop();
    }
    else if (_s == "cartel 3") {
        pg_mundo.push();
        pg_mundo.translate(pg_mundo.width / 2, pg_mundo.height / 2);
        //let r = rotacion % (PI * 2);
        pg_mundo.rotate((PI * 2 - PI / 2) - r);
        pg_mundo.fill(255, 255, 255);
        pg_mundo.rect(0, -605, 130, 30); //150
        pg_mundo.rect(-72 + 20, -581, 5, 30);
        pg_mundo.rect(72 - 20, -581, 5, 30);
        pg_mundo.fill(0);
        pg_mundo.textFont(fuente_texto[0]);
        pg_mundo.text("LET US GO, PLEASE!", 0, -605, 120, 50); //ALERT: EVACUATE COLONY FOR SURVIVAL
        pg_mundo.pop();
    }
}

function Rota_en_celular(_ro) {
    let s = second() % 5;
    if (s == 1) b_para_cel = true;
    if (s === 0 && b_para_cel) {
        b_para_cel = false;
        rotate(_ro);
    }
}

/*function Desgaste(_pg, _x, _y) { // un solo pixel  ///-572 (ini) -56 (fin)

    //let x = 1000;//random(400, 400 + 1150);
    //let y = random(0, 1150 + 25);
    let x = random(_x - 40, _x + 40);
    let y = random(_y - 40, _y + 40);
    _pg.blendMode(BLEND); // Normal
    _pg.noTint();
    _pg.image(img_desgaste, x, y);

    //_pg.set(x, y, img_vacia);
    //_pg.set(x, y, color(115, 210, 110, 255));//color(0, 0, 0, 0));

    //_pg.updatePixels();
}*/

function mi_shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// posiciona los objetos ----------------------------------------
function windowResized() {
    var w = ubic_w();
    var h = ubic_h();
    canvas.position(w, h);
    link.position(w + 480, h + 300 + 310);
}

this.ubic_w = function () {
    var w = (windowWidth - width) / 2; // windowWidth funciona con browser manipulados con zoom
    if (w < 0) w = 0;
    return w;
}
this.ubic_h = function () {
    var h = (windowHeight - height) / 2;
    if (h < 0) h = 0;
    return h;
}


//function keyTyped() {
/*if (key == 'z') {
    mundo_bool = !mundo_bool;
    if (mundo_bool) mundo_vel = 0.002;
    else mundo_vel = 0;
}*/
/*if (key == 'f') {
    musica[0].setVolume(0.0, 5);
    //seccion = "universo";
}*/
//}


/*function mouseClicked() {
    pg_mundo.push();
    pg_mundo.translate(mouseX, mouseY);
    let ro = (rotacion * -1) % (PI * 2);
    pg_mundo.rotate(ro);
    pg_mundo.fill(0);
    pg_mundo.ellipse(0, 0, 20, 20);
    pg_mundo.pop();
    return false;
}*/
