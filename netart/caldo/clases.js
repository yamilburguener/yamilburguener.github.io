function Pareja(_H0, _S0, _se0, _i0, _H1, _S1, _se1, _i1, _hi, _ca, _cp, _ch0, _ch1) {
    this.cH = Array(2); // color H
    this.cS = Array(2); // color S
    this.sex = Array(2);
    this.img = Array(2);

    this.cH[0] = _H0; // color H
    this.cS[0] = _S0; // color S
    this.sex[0] = _se0;
    this.img[0] = _i0;
    this.cH[1] = _H1; // color H
    this.cS[1] = _S1; // color S
    this.sex[1] = _se1;
    this.img[1] = _i1;

    //this.img[2] = _i1; // para trios

    this.n_hijos = _hi;
    this.n_casas = _ca;
    this.color_padres = _cp;

    this.color_hijos = Array(2);
    this.color_hijos[0] = _ch0;
    this.color_hijos[1] = _ch1;

    //this.sonido = int(random(5));

    this.colorH = function (_n) {
        return this.cH[_n];
    }

    this.colorS = function (_n) {
        return this.cS[_n];
    }

    this.sexo = function (_n) {
        return this.sex[_n];
    }

    this.imagen = function (_n) {
        return this.img[_n];
    }

    this.limite_hijos = function () {
        return this.n_hijos;
    }

    this.para_color_padres = function () {
        return this.color_padres;
    }

    this.para_color_hijos = function (_n) {
        return this.color_hijos[_n];
    }

    this.casas = function () {
        return this.n_casas;
    }

    /*this.musica = function () {
        sonidos[this.sonido].play();
    }*/
}

// --------------------------------------------------------
class Boton {

    constructor(_i1, _i2, _o) {
        this.xi = -200;
        this.xf = windowWidth / 2 - 80;
        this.y = windowHeight / 2 - 80;
        this.o = _o; // para opcion
        this.v = 40; // velocidad inicial
        this.cr = 5;

        this.boton_opcion = createButton("");//CLICK TO ACCEPT
        this.boton_opcion.class("boton_css");
        this.boton_opcion.position(this.xi, this.y);//(this.xi, this.y);

        if (_i1 == "img_woman") {
            this.i1 = 'assets/woman_red.png';
        } else if (_i1 == "img_woman_aborto") { //img_woman_panuelo
            this.i1 = 'assets/woman_aborto.png'; //woman_panuelo.png    
        } else if (_i1 == "img_woman_feminista") { //img_woman_panuelo
            this.i1 = 'assets/woman_feminista.png'; //woman_panuelo.png
        } else if (_i1 == "img_woman_neutro") { //img_woman_panuelo
            this.i1 = 'assets/woman_neutro.png'; //woman_panuelo.png
        }else if (_i1 == "img_woman_salvemos") { //img_woman_panuelo
            this.i1 = 'assets/woman_salvemos.png'; //woman_panuelo.png    
        } else if (_i1 == "img_man") {
            this.i1 = 'assets/man_red.png';
        } else if (_i1 == "img_man_neutro") {
            this.i1 = 'assets/man_neutro.png';
        } else if (_i1 == "img_nadie") {
            this.i1 = 'assets/pixel_vacio.png';
        } else if (_i1 == "img_robot") {
            this.i1 = 'assets/robot_big.png';
        }
        this.img1 = createImg(this.i1);//
        this.img1.style('position: relative; top: 10px; padding: 0px 2px');
        //this.img1.style("position: absolute; top: 10px; left: 35px");
        this.img1.style('filter: hue-rotate(' + 360 / 255 * icono[0].tH + 'deg)');

        if (_i2 == "img_woman") {
            this.i2 = 'assets/woman_red.png';
        } else if (_i2 == "img_woman_feminista") { //img_woman_panuelo
            this.i2 = 'assets/woman_feminista.png'; //woman_panuelo.png
        } else if (_i2 == "img_man") {
            this.i2 = 'assets/man_red.png';
        } else if (_i2 == "img_man_salvemos") { 
            this.i2 = 'assets/man_salvemos.png';  
        }else if (_i2 == "img_nadie") {
            this.i2 = 'assets/pixel_vacio.png';
        } else if (_i2 == "img_robot") {
            this.i2 = 'assets/robot_big.png';
        }
        this.img2 = createImg(this.i2); //'assets/man_red.png'
        this.img2.style('position: relative; top: 10px; padding: 0px 2px');
        //this.img2.style("position: absolute; top: 10px; left: 85px");
        this.img2.style('filter: hue-rotate(' + 360 / 255 * icono[1].tH + 'deg)');

        let r = random(1);
        if (r < 0.5) {
            this.img1.parent(this.boton_opcion);
            this.img2.parent(this.boton_opcion);
        } else {
            this.img2.parent(this.boton_opcion);
            this.img1.parent(this.boton_opcion);
        }

        // trios ---------- tercer icono
        if (_o == 17 || _o == 18) {
            if (_o == 17) {
                this.i3 = 'assets/woman_neutro.png';
            }
            else if (_o == 18) {
                this.i3 = 'assets/man_neutro.png'; //man_panuelo
            }
            this.img3 = createImg(this.i3);
            this.img3.style('position: relative; top: 10px; padding: 0px 2px');
            this.img3.style('filter: hue-rotate(' + 360 / 255 * 186 + 'deg)'); // violeta
            this.img3.parent(this.boton_opcion);
        }
        // ----------------

        this.titulo = createP("CLICK TO ACCEPT");
        this.titulo.style("position: relative; padding: 15px 0px 0px");
        this.titulo.style("text-align: center; font-size: 13px");
        this.titulo.parent(this.boton_opcion);

        this.cuenta_regresiva = createP(this.cr);
        this.cuenta_regresiva.style("position: relative; top: -10px; padding: 0px 0px 0px");
        this.cuenta_regresiva.style("text-align: center; font-size: 20px");
        this.cuenta_regresiva.parent(this.boton_opcion);

        this.boton_opcion.mouseClicked(Clic_Opcion);
        this.boton_opcion.mouseOver(Clic_Over);
        this.boton_opcion.mouseOut(Clic_Out);
    }

    ingreso() {
        this.xi += this.v;
        if (this.v < 0 && this.xi <= this.xf) this.v *= -0.8;
        else if (this.v > 0 && this.xi >= this.xf) this.v *= -0.8;

        if (abs(this.v) > 0.4) {
            this.boton_opcion.position(this.xi, this.y);
        } else {
            this.boton_opcion.position(this.xf, this.y);
            this.v = 0.1;
            tiempo_boton = millis() + 5000;
            seccion = "seleccion";
        }
    }

    regresiva(_n) {
        this.cuenta_regresiva.html(_n);
    }

    color(_c) {
        if (_c == "over") {
            this.boton_opcion.style("background-color: rgba(220, 220, 220, 0.8)");
        } else if (_c == "clicked") {
            this.cuenta_regresiva.html("YES");
            this.v = 0.1; // bug: para que no salga por izquierda, si .v queda negativo
            this.boton_opcion.style("background-color: rgba(255, 255, 255, 0.7); border-color: green"); //; color: #eeeeee
            //this.boton_opcion.style("outline: 0px;"); // bug chrome: movida a index
        } else if (_c == "out") {
            this.boton_opcion.style("background-color: rgba(255, 255, 255, 0.7)");//border-color: red
        } else if (_c == "no") {
            this.cuenta_regresiva.html("NO");
            this.boton_opcion.style("background-color: rgba(255, 255, 255, 0.7); border-color: red");
        }
    }

    salida_izq() {
        this.xf -= this.v;
        this.v *= 1.2;
        this.boton_opcion.position(this.xf, this.y);
        if (this.xf < - 550) {
            seccion = "opciones";
            tiempo_boton = millis() + 2000;
        }
    }

    salida_der() {
        this.xf += this.v;
        this.v *= 1.2;
        this.boton_opcion.position(this.xf, this.y);
        if (this.xf > windowWidth + 160) {
            seccion = "opciones";
            tiempo_boton = millis() + 2000;
            this.isFinished();
        }
    }

    isFinished() {
        this.boton_opcion.remove();
        return true;
    }
}

// --------------------------------------------------------
class Estrella {

    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    update() {
        fill(random(150, 255));
        ellipse(this.x, this.y, 1, 1);
        //stroke(255);
        //point(this.x, this.y);
    }

}