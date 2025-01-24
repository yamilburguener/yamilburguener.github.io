// -------------------- Pre Opciones ----------------------------------
function Pre_Opcion(_p) {

    if (_p == 0) {
        // estandar: mujer rosa, hombre celeste
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man";
    } else if (_p == 1) {
        // mujer verde pro-aborto y hombre celeste
        icono[0].tH = 106;
        icono[0].tS = 255;
        icono[0].info = "img_woman_aborto"; //106, 255 //img_woman_panuelo
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man";
    } else if (_p == 2) {
        // invertido: mujer celeste, hombre rosa
        icono[0].tH = celeste_H;
        icono[0].tS = celeste_S;
        icono[0].info = "img_woman";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_man";
    } else if (_p == 3) {
        // mujer rosa, hombre rosa
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_man";
    } else if (_p == 4) {
        // mujer (celeste), hombre celeste: salvemos las 2 vidas
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman_salvemos";
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man_salvemos";
    } else if (_p == 5) {
        // dos mujeres rosa y celeste
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_woman";
    } else if (_p == 6) {
        // dos mujeres violetas feministas 8M (antes celeste)
        icono[0].tH = 220;//rosa_H;
        icono[0].tS = 158;//rosa_S;
        icono[0].info = "img_woman_feminista"; //img_woman_panuelo
        icono[1].tH = 220;//rosa_H;
        icono[1].tS = 158;//rosa_S;
        icono[1].info = "img_woman_feminista"; // img_woman_panuelo
    } else if (_p == 7) {
        // dos mujeres rosas
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_woman";
    } else if (_p == 8) {
        // 2 hombres celeste y rosa
        icono[0].tH = celeste_H;
        icono[0].tS = celeste_S;
        icono[0].info = "img_man";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_man";
    } else if (_p == 9) {
        // 2 hombres rosas
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_man";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_man";
    } else if (_p == 10) {
        // 2 hombres celestes
        icono[0].tH = celeste_H;
        icono[0].tS = celeste_S;
        icono[0].info = "img_man";
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man";
    } else if (_p == 11) {
        // mujer sola rosa
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_nadie";
    } else if (_p == 12) {
        // hombre solo celeste
        icono[0].tH = celeste_H;
        icono[0].tS = celeste_S;
        icono[0].info = "img_man";
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_nadie";
    } else if (_p == 13) {
        // mujer neutra y hombre celeste ////antes: mujer solo rosa
        icono[0].tH = violeta_H;
        icono[0].tS = violeta_S;
        icono[0].info = "img_woman_neutro"; //img_woman_panuelo
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man";
    } else if (_p == 14) {
        // hombre neutro y mujer rosa ////antes: hombre solo rosa
        icono[0].tH = violeta_H;
        icono[0].tS = violeta_S;
        icono[0].info = "img_man_neutro";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_woman";
    } else if (_p == 15) {
        // mujer y robot
        icono[0].tH = rosa_H;
        icono[0].tS = rosa_S;
        icono[0].info = "img_woman";
        icono[1].tH = 0;
        icono[1].tS = 0;
        icono[1].info = "img_robot";
    } else if (_p == 16) {
        // hombre y robot
        icono[0].tH = celeste_H;
        icono[0].tS = celeste_S;
        icono[0].info = "img_man";
        icono[1].tH = 0;
        icono[1].tS = 0;
        icono[1].info = "img_robot";
    } else if (_p == 17) {
        // mujer neutra, mujer neutra y hombre
        icono[0].tH = violeta_H;
        icono[0].tS = violeta_S;
        icono[0].info = "img_woman_neutro"; //img_woman_neutro
        icono[1].tH = celeste_H;
        icono[1].tS = celeste_S;
        icono[1].info = "img_man";
    } else if (_p == 18) {
        // hombre neutro, hombre neutro y mujer
        icono[0].tH = violeta_H;
        icono[0].tS = violeta_S;
        icono[0].info = "img_man_neutro";
        icono[1].tH = rosa_H;
        icono[1].tS = rosa_S;
        icono[1].info = "img_woman";
    }

}
function Opcion(_o) {
    // Opciones -----------------
    if (_o == 0) {
        // estandar: mujer rosa, hombre celeste
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            5, 2, 2.8, 1.4, 2.8)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1
        // color padre (0 a 3): de 0 al valor (va color del ser) del valor a 3 (va random)  
        // proporcion color hijos: de 0 a 1ºvalor (color madre) de 1º a 2º valor(c. padres) de 2ºv a 3 (c.random)
    } else if (_o == 1) {
        // mujer verde pro-aborto y hombre celeste
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer verde", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            3, 3, 1.7, 1.2, 2.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 2) {
        // invertido: mujer celeste, hombre rosa
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 3, 1.2, 0.5, 1.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 3) {
        // mujer rosa, hombre rosa
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 5, 1.5, 0.5, 1)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 4) {
        // mujer (celeste), hombre celeste: salvemos las 2 vidas
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            7, 1, 2.9, 1.0, 2.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 5) {
        // dos mujeres rosa y celeste
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "mujer", img_woman,
            2, 2, 1, 0.8, 1.6)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 6) {
        // dos mujeres violetas feministas
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "mujer", img_woman,
            0, 2, 2.5, 0, 0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 7) {
        // dos mujeres rosas
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "mujer", img_woman,
            1, 4, 1.5, 0.5, 1)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 8) {
        // 2 hombres celeste y rosa
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            2, 2, 2.0, 1, 2)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 9) {
        // 2 hombres rosas
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 7, 1.5, 0.5, 1)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 10) {
        // 2 hombres celestes
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            0, 7, 2.5, 0, 0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 11) {
        // mujer sola rosa
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "nadie", img_nadie,
            1, 2, 2.5, 1.3, 1.3)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 12) {
        // hombre solo celeste
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "nadie", img_nadie,
            1, 2, 2.5, 1.3, 1.3)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 13) {
        // mujer neutra y hombre celeste (new)
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 4, 1, 1.0, 2.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 14) {
        // hombre neutro y mujer rosa (new)
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 4, 1, 1.0, 2.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1
    } else if (_o == 15) {
        // mujer y robot
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "robot", img_robot,
            0, 5, 1, 0, 0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1

    } else if (_o == 16) {
        // hombre y robot
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "robot", img_robot,
            0, 5, 1, 0, 0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1
    } else if (_o == 17) {
        // mujer neutra, mujer neutra y hombre
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "mujer", img_woman,
            icono[1].tH, icono[1].tS, "hombre", img_man,
            1, 1, 1, 0.5, 1.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1
    }
    else if (_o == 18) {
        // hombre neutro, hombre neutro y mujer
        parejas.push(new Pareja(icono[0].tH, icono[0].tS, "hombre", img_man,
            icono[1].tH, icono[1].tS, "mujer", img_woman,
            1, 1, 1, 0.5, 1.0)); // n_hijos, n_casas, color_padres, color_hijos0, color_hijos1
    }

    // calculo: cant hijos influye en latencia de las entradas
    var t = parejas[parejas.length - 1].limite_hijos();
    tiempo_hijos += t;
    tiempo_hijos = constrain(tiempo_hijos, 0, 20); // a mayor cant. mas parejas con hijos 
    

}
// --------------------------------------------------------------------------


