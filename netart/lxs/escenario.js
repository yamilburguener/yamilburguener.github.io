var fondo_lejos, fondo_cerca;
var img_fondo_l, img_fondo_c;

var plataforma = [];

var img_A, img_E, img_I, img_O, img_U,
    img_B, img_C, img_D, img_F, img_G, img_H, img_J, img_K, img_L, img_M, img_N,
    img_eNie, img_P, img_Q, img_R, img_S, img_T, img_V, img_W, img_X, img_Y, img_Z,
    img_A_acento, img_E_acento, img_I_acento, img_O_acento, img_U_acento,
    img_punto, img_dos_puntos, img_coma, img_comillas, img_puntoycoma;

var borde = [];
var img_esquirla, img_puntaje;
var personaje_intro, personaje_small;

var width_total;
var background_rgb = []; // colores de fondo de c/nivel

var plataformas; // group

var letra = []; // para texto

function preload() {

    loadStrings('assets/texto.txt', pickString, noAnda);

    personaje_intro = createImg("assets/p_intro.png");
    personaje_small = createImg("assets/p_small.png");
    personaje_intro.hide();
    personaje_small.hide();

    img_A = loadImage("assets/letras/A.png");
    img_E = loadImage("assets/letras/E.png");
    img_I = loadImage("assets/letras/I.png");
    img_O = loadImage("assets/letras/O.png");
    img_U = loadImage("assets/letras/U.png");

    img_B = loadImage("assets/letras/B.png");
    img_C = loadImage("assets/letras/C.png");
    img_D = loadImage("assets/letras/D.png");
    img_F = loadImage("assets/letras/F.png");
    img_G = loadImage("assets/letras/G.png");
    img_H = loadImage("assets/letras/H.png");
    img_J = loadImage("assets/letras/J.png");
    img_K = loadImage("assets/letras/K.png");
    img_L = loadImage("assets/letras/L.png");
    img_M = loadImage("assets/letras/M.png");
    img_N = loadImage("assets/letras/N.png");
    img_eNie = loadImage("assets/letras/eNie.png");
    img_P = loadImage("assets/letras/P.png");
    img_Q = loadImage("assets/letras/Q.png");
    img_R = loadImage("assets/letras/R.png");
    img_S = loadImage("assets/letras/S.png");
    img_T = loadImage("assets/letras/T.png");
    img_V = loadImage("assets/letras/V.png");
    img_W = loadImage("assets/letras/W.png");
    img_X = loadImage("assets/letras/X.png");
    img_Y = loadImage("assets/letras/Y.png");
    img_Z = loadImage("assets/letras/Z.png");

    img_A_acento = loadImage("assets/letras/A_acento.png");
    img_E_acento = loadImage("assets/letras/E_acento.png");
    img_I_acento = loadImage("assets/letras/I_acento.png");
    img_O_acento = loadImage("assets/letras/O_acento.png");
    img_U_acento = loadImage("assets/letras/U_acento.png");

    img_punto = loadImage("assets/letras/punto.png");
    img_dos_puntos = loadImage("assets/letras/dos_puntos.png");
    img_coma = loadImage("assets/letras/coma.png");
    img_comillas = loadImage("assets/letras/comillas.png");
    img_puntoycoma = loadImage("assets/letras/puntoycoma.png");

    img_esquirla = loadImage("assets/esquirla.png");
    img_puntaje = loadImage("assets/100.png");

    //img_fondo_l = loadImage("assets/fondo1.png");
    //img_fondo_c = loadImage("assets/fondo2.png");

    // ------------------ carga de sonidos ---------------
    sonido['corre'] = loadSound("assets/corre.ogg");
    sonido['salta'] = loadSound("assets/salto2.ogg");
    sonido['esquirla'] = loadSound("assets/sale_esquirla.ogg");
    //sonido['sale_esquirla'].playMode('restart');
    sonido['cae'] = loadSound("assets/cae6.ogg");
    sonido['cae'].playMode('restart');
    sonido['exis'] = loadSound("assets/exis3.ogg");
    // ---------------------------------------------------
    loaded = true;

}

function Escenario(_n) {
    plataformas = new Group();

    /* fondo_lejos = createSprite(nw * camara_prop / 2, nh * camara_prop / 2);
   fondo_lejos.addImage(img_fondo_l);

   fondo_cerca = createSprite(nw * camara_prop / 2, nh * camara_prop / 2);
   fondo_cerca.addImage(img_fondo_c);*/

    background_rgb[0] = color(random(255), 15, 255); // 25
    //color(185, 255, 223);
    //color(218,185,255);
    //color(255, 247, 169);

    // textos (556 plataformas aprox)--------------------------------------------
    if (_n == 0) {
        //    plataformas = new Group();
    } 
    else if (_n == 1) {
        //plataformas = new Group();
        if (CAMARA_FINAL == 0.4) Arma_texto(1, 0, 12);
        else Arma_texto(10, 126, 126 + 8);
        p_inicial_x = 60; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 2) {
        if (CAMARA_FINAL == 0.4) Arma_texto(2, 14, 26);
        else Arma_texto(20, 140, 140 + 8);
        p_inicial_x = 190; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 3) {
        if (CAMARA_FINAL == 0.4) Arma_texto(3, 28, 28 + 10);
        else Arma_texto(30, 154, 154 + 8);
        p_inicial_x = 220; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 4) {
        if (CAMARA_FINAL == 0.4) Arma_texto(4, 42, 54);
        else Arma_texto(40, 168, 168 + 8);
        p_inicial_x = 60; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 5) {
        if (CAMARA_FINAL == 0.4) Arma_texto(5, 56, 56 + 12);
        else Arma_texto(50, 182, 182 + 8);
        p_inicial_x = 250; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 6) {
        if (CAMARA_FINAL == 0.4) Arma_texto(6, 70, 70 + 12);
        else Arma_texto(60, 196, 196 + 7);
        p_inicial_x = 210; // posiciona caida del personaje segun nivel
    } 
    else if (_n == 7) {
        if (CAMARA_FINAL == 0.4) Arma_texto(7, 84, 84 + 12);
        else Arma_texto(70, 210, 210 + 8);
        p_inicial_x = 180; // posiciona caida del personaje segun nivel
    }
    else if (_n == 8) {
        if (CAMARA_FINAL == 0.4) Arma_texto(7, 98, 98 + 12);
        else Arma_texto(70, 224, 224 + 8);
        p_inicial_x = 180; // posiciona caida del personaje segun nivel
    }
    // --------------------------------------------------------------------

    for (var i = 0; i < plataforma.length; i++) {
        plataforma[i].restitution = 0.7;
        plataforma[i].friction = 0.3;
        //plataforma[i].debug = true;
        //plataforma[i].visible = false; 
        //plataforma[i].setCollider("rectangle", 0, 0, 10, 10);
        plataformas.add(plataforma[i]);
    }
}

function pickString(linea) { // para ir tomando los renglones de texto del txt

    for (var i = 0; i < linea.length; i++) {

        letra[i] = [];
        letra[i] = split(linea[i], "");
    }
}

function noAnda() {
    print("no Anda");
}


// Arma textos --------------------------------------------------
function Arma_texto(_nn, _i, _f) { // nivel, for inicial, for final
    //var n = 0; 
    var h = 0; //genera el espacio entre lineas de texto
    var ii = 0; // para index plataforma

    for (var l = _i; l <= _f; l++) { //< letra.length; l++) { //nuevo renglon

        var w = 20; // para generar espacio entre letras
        // --------------------------- // version desktop. genera laberinto
        if (_nn == 1) { // version desktop
            if (l == 1) w = 285;
            else if (l == 3) w = 90;
            else if (l == 5) w = 250;
            else if (l == 7) w = 83;
            else if (l == 9) w = 163;
            else if (l == 11) w = 146;
        } 
        else if (_nn == 2) { // version desktop
            if (l == 1 + 14) w = 70;
            else if (l == 3 + 14) w = 370;
            else if (l == 5 + 14) w = 260;
            else if (l == 7 + 14) w = 90;
            else if (l == 9 + 14) w = 163;
            else if (l == 11 + 14) w = 70;
        } 
        else if (_nn == 3) { // version desktop
            if (l == 7 + 28) w = 225;
            else if (l == 9 + 28) w = 370;
        } 
        else if (_nn == 4) { // version desktop
            if (l == 1 + 42) w = 60;
            else if (l == 3 + 42) w = 160;
            else if (l == 5 + 42) w = 440;
            else if (l == 8 + 42) w = 560;
            else if (l == 10 + 42) w = 770;
            else if (l == 12 + 42) w = 685;
        } 
        else if (_nn == 5) { // version desktop
            if (l == 1 + 56) w = 155;
            else if (l == 3 + 56) w = 85;
            else if (l == 5 + 56) w = 95;
            else if (l == 7 + 56) w = 65;
            else if (l == 9 + 56) w = 155;
            else if (l == 11 + 56) w = 20;
        } 
        else if (_nn == 6) { // version desktop
            if (l == 3 + 70) w = 85;
            else if (l == 5 + 70) w = 410;
            else if (l == 7 + 70) w = 250;
            else if (l == 9 + 70) w = 260;
            else if (l == 11 + 70) w = 360;
        } 
        else if (_nn == 7) { // version desktop
            if (l == 3 + 84) w = 270;
            else if (l == 5 + 84) w = 295;
            else if (l == 8 + 84) w = 205;
            else if (l == 10 + 84) w = 135;
            //else if (l == 12 + 84) w = 1285;
        } 
        // ----------------------------- // version celu. genera laberinto
        else if (_nn == 10) { // version celu
            if (l == 126 + 1) w = 250;
            else if (l == 126 + 3) w = 115;
            else if (l == 126 + 5) w = 20;
            else if (l == 126 + 7) w = 100;
        } 
        else if (_nn == 20) { // version celu
            if (l == 140 + 1) w = 60;
            else if (l == 140 + 3) w = 60;
            else if (l == 140 + 5) w = 65;
            else if (l == 140 + 7) w = 260;
        } 
        else if (_nn == 30) { // version celu
            if (l == 154 + 1) w = 95;
            else if (l == 154 + 3) w = 85;
            else if (l == 154 + 5) w = 190;
            else if (l == 154 + 7) w = 130;
        } 
        else if (_nn == 40) { // version celu
            if (l == 168 + 1) w = 70;
            else if (l == 168 + 3) w = 125;
            else if (l == 168 + 7) w = 145;
        } 
        else if (_nn == 50) { // version celu
            if (l == 182 + 1) w = 150;
            else if (l == 182 + 3) w = 90;
            else if (l == 182 + 5) w = 250;
            else if (l == 182 + 7) w = 85;
        } 
        else if (_nn == 60) { // version celu
            if (l == 196 + 3) w = 295;
            else if (l == 196 + 5) w = 60;
            else if (l == 196 + 7) w = 290;
        } 
        else if (_nn == 70) { // version celu
            if (l == 210 + 1) w = 180;
            else if (l == 210 + 3) w = 90;
            else if (l == 210 + 5) w = 250;
            else if (l == 210 + 7) w = 85;
        }

        for (var i = 0; i < letra[l].length; i++) { // nueva letra

            if (letra[l][i] != " ") {
                plataforma[ii] = createSprite(w, h);

                if (letra[l][i] == 'A') {
                    plataforma[ii].addImage(img_A);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'Á') {
                    plataforma[ii].addImage(img_A_acento);
                    plataforma[ii].position.y -= 4;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'a') {
                    plataforma[ii].addImage(img_A);
                    vocal[ii] = 2;
                } else if (letra[l][i] == 'E') {
                    plataforma[ii].addImage(img_E);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'É') {
                    plataforma[ii].addImage(img_E_acento);
                    plataforma[ii].position.y -= 4;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'e') {
                    plataforma[ii].addImage(img_E);
                    vocal[ii] = 2;
                } else if (letra[l][i] == 'I') {
                    plataforma[ii].addImage(img_I);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'Í') {
                    plataforma[ii].addImage(img_I_acento);
                    plataforma[ii].position.y -= 4;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'O') {
                    plataforma[ii].addImage(img_O);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'Ó') {
                    plataforma[ii].addImage(img_O_acento);
                    plataforma[ii].position.y -= 4;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'o') { // premio
                    plataforma[ii].addImage(img_O);
                    vocal[ii] = 2;
                } else if (letra[l][i] == 'U') {
                    plataforma[ii].addImage(img_U);
                    vocal[ii] = 1;
                } else if (letra[l][i] == 'Ú') {
                    plataforma[ii].addImage(img_U_acento);
                    plataforma[ii].position.y -= 4;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                    vocal[ii] = 1;
                } else vocal[ii] = 0;

                if (letra[l][i] == 'B') plataforma[ii].addImage(img_B);
                else if (letra[l][i] == 'C') plataforma[ii].addImage(img_C);
                else if (letra[l][i] == 'D') plataforma[ii].addImage(img_D);
                else if (letra[l][i] == 'F') plataforma[ii].addImage(img_F);
                else if (letra[l][i] == 'G') plataforma[ii].addImage(img_G);
                else if (letra[l][i] == 'H') plataforma[ii].addImage(img_H);
                else if (letra[l][i] == 'J') {
                    plataforma[ii].addImage(img_J);
                    plataforma[ii].position.y = h + 3;
                } else if (letra[l][i] == 'K') plataforma[ii].addImage(img_K);
                else if (letra[l][i] == 'L') plataforma[ii].addImage(img_L);
                else if (letra[l][i] == 'M') plataforma[ii].addImage(img_M);
                else if (letra[l][i] == 'N') plataforma[ii].addImage(img_N);
                else if (letra[l][i] == 'Ñ') {
                    plataforma[ii].addImage(img_eNie);
                    plataforma[ii].position.y = h - 5;
                    plataforma[ii].setCollider("rectangle", 0, 4, 29, 32);
                } else if (letra[l][i] == 'P') plataforma[ii].addImage(img_P);
                else if (letra[l][i] == 'Q') {
                    plataforma[ii].addImage(img_Q);
                    plataforma[ii].position.y = h + 2;
                } else if (letra[l][i] == 'R') plataforma[ii].addImage(img_R);
                else if (letra[l][i] == 'S') plataforma[ii].addImage(img_S);
                else if (letra[l][i] == 'T') plataforma[ii].addImage(img_T);
                else if (letra[l][i] == 'V') plataforma[ii].addImage(img_V);
                else if (letra[l][i] == 'W') plataforma[ii].addImage(img_W);
                else if (letra[l][i] == 'X') plataforma[ii].addImage(img_X);
                else if (letra[l][i] == 'Y') plataforma[ii].addImage(img_Y);
                else if (letra[l][i] == 'Z') plataforma[ii].addImage(img_Z);

                else if (letra[l][i] == '.') {
                    plataforma[ii].addImage(img_punto);
                    plataforma[ii].position.y = h + 13;
                } else if (letra[l][i] == ':') {
                    plataforma[ii].addImage(img_dos_puntos);
                    plataforma[ii].position.y = h + 4;
                } else if (letra[l][i] == ',') {
                    plataforma[ii].addImage(img_coma);
                    plataforma[ii].position.y = h + 13;
                    plataforma[ii].position.x = w - 6;
                } else if (letra[l][i] == '"') {
                    plataforma[ii].addImage(img_comillas);
                    plataforma[ii].position.y = h - 11;
                } else if (letra[l][i] == ';') {
                    plataforma[ii].addImage(img_puntoycoma);
                    plataforma[ii].position.y = h + 13;
                }

                ii += 1;
            } else w += 37; // espacio entre palabras. letra manual: 25

            w += 27; // espacio entre letras. letra manual: 28
        }
        //n++;
        //plataforma_h[n] = h;
        h += 120; //100
    }
    // bordes -----------------------------------------
    borde[0] = createSprite(-10, 1024 / 2, 10, 1024 * camara_prop); // orig 10 de ancho
    borde[1] = createSprite(width_total + 5, 1024 / 2, 10, 1024 * camara_prop); // 720 o nw??

    borde[0].shapeColor = color(0, 0, 0); // orig 111,111,111
    borde[1].shapeColor = color(0, 0, 0);

}
// ----------------------------------------------------