// p5.min.js: /*! p5.js v0.8.0 April 08, 2019 */
// p5.dom.min.js /*! p5.js v0.8.0 April 08, 2019 */

p5.disableFriendlyErrors = true;

var txt;
var termita = [];
var canvas;

var emo = [];
var hoja, c_lupa1, c_lupa2, titulo;
var parche;
var sizemax_emo = 25;
var dir_x = [];
var cEmo; // cantidad de emoticones
var cNace_emo = 0;
var bNace_emo = true;
var r_bNace = 1; // 1º emoticon sale sin demora
var nMouse = 0;
var tMouse = 0;
var p_ini = [];
var p_fin = [];
var pix; // pixel negro
var change_go = true;
var canvas;
var texto_cargando;

//var rec = true; // para grabar frames
//var cont_rec = 0; // para grabar frames

// ---------------- SETUP -------------------------
function setup() {
  canvas = createCanvas(hoja.width, hoja.height);
  canvas.parent('sketch-holder');
  canvas.mousePressed(emoticon_go);

  rectMode(CENTER);
  noStroke();
  image(hoja, (width - hoja.width) / 2, 0);
  imageMode(CENTER);

  image(titulo, width / 2, 24);
  c_lupa1 = get(width / 2 - 122 / 2, 20 - 32 / 2, 122, 32);
  image(titulo, width / 2, height - 14);
  c_lupa2 = get(width / 2 - 122 / 2, height - 20 - 32 / 2, 122, 32);
  parche = createVector(1, 1);
  pix = color(0, 0, 0, random(100, 255)); // pixel negro
  cursor(CROSS);

  texto_cargando.hide();//
}


// ------------------ DRAW -------------------
function draw() {
  // nacimiento de emoticon ------
  if (bNace_emo) {
    if (random(r_bNace) < 1) {
      r_bNace = 500;
      termita.push(new Termita(cNace_emo, p_ini[cNace_emo], p_fin[cNace_emo]));
      cNace_emo++;
      if (cNace_emo >= cEmo) bNace_emo = false;
    }
  }
  // vida de emoticon -------
  if (termita !== null) {
    for (var i = termita.length - 1; i >= 0; i--) {

      termita[i].update();
      termita[i].render();

      if (termita[i].isFinished()) {
        termita.splice(i, 1);
      }
    }
  }
  // interaccion con mouse ------
  if (tMouse + 2000 < millis()) nMouse = 0;
  if (nMouse === 0) {
    noCursor();
    image(c_lupa1, width / 2, 20);
    image(c_lupa2, width / 2, height - 20);
    nMouse = 2;
  }
  /*// rec frame --------------
  if (rec) {
    cont_rec++;
    saveCanvas(canvas, 'save/screen' + cont_rec + '.png', 'png');
  }*/
}

// ---------------------- TERMITA ---------------------
function Termita(_n, _pi, _pf) {
  this.n = _n;
  this.x = int(random(2));
  this.pi = _pi;
  this.pf = _pf;
  this.s = 1;
  this.dir = 1;
  this.estado = -1; // estado
  this.vida_t = 1000000; // tiempo de vida en millis
  this.a = 0.0; // para sin() , para la onda en Y
  this.cMi_sin = 3;
  this.to_p_y = 50; // size parche.y inicial
  this.aper = 5;
  this.accel = 0.005;

  if (this.pi.z === 0) this.dirP = 0; // arriba, dirección de las tiras
  else if (this.pi.z == 1) this.dirP = 1; // abajo
  else this.dirP = int(random(2));

  if (this.x === 0) {
    this.dir = 1; // de izq a der
    this.x = 1;
  } else {
    this.dir = -1; // de der a izq
    this.x = width - 1;
  }
  this.y = this.pi.y;

  // remove--------
  this.isFinished = function() {
    if (this.estado == 3) {
      return true;
    } else {
      return false;
    }
  }

  // mov avatar ----
  this.update = function() {
    // previa: se direcciona a la palabra
    if (this.estado < 0) {
      /*if (this.y > this.pi.y - 5 && this.y < this.pi.y + 5) {
        if (this.dir == 1) {
          if (this.x > this.pi.x) this.estado = 0;
        } else
        if (this.dir == -1) {
          if (this.x < this.pf.x) this.estado = 0;
        }
      }*/
      if (this.dir == 1 && this.x > this.pf.x - random(140)) {
        this.dir = -1;
        if (this.y > this.pi.y - 5 && this.y < this.pi.y + 5) {
          this.estado = 0;
        }
      } else if (this.dir == -1 && this.x < this.pi.x + random(140)) {
        this.dir = 1;
        if (this.y > this.pi.y - 5 && this.y < this.pi.y + 5) {
          this.estado = 0;
        }
      }



      if (this.y < this.pi.y) this.y = this.y + random(0, 1);
      else this.y = this.y - random(0, 1);
      this.x = this.x + (this.accel * this.dir);
      this.accel += 0.001;
      if (this.accel > 1) this.accel = 1;
    } else
    if (this.estado > -1) {
      // crecimiento de la termita, etc -----
      if (millis() >= this.vida_t) this.estado = 2;
      this.x = this.x + (0.6 * this.dir); //this.x = this.x + 0.3 * this.dir;

      if (this.x > this.pf.x) this.dir = -1;
      else if (this.x < this.pi.x) this.dir = 1;

      if (this.estado === 0) {

        if (this.s >= sizemax_emo) {
          this.s = sizemax_emo;
          var v = (this.pf.x - this.pi.x) * 250; // calcula la vida total
          //print(this.n + " - " + v);
          this.vida_t = millis() + v;
          this.estado = 1;
        } else this.s += 0.1; // 0.08
        //if (this.ss < sizemax_emo) this.ss += 0.05; //this.ss += 0.005;
      } else
      if (this.estado == 2) {
        if (this.s > 0.2) this.s -= 0.05; // 0.03
        else {
          this.estado = 3;
        }
      }
    }
  }

  this.render = function() {
    // parche ------------
    if (this.estado < 0) {

      // inicio --------------------------
      var i = map(this.accel, 0, 1, 6, 3);
      fill(0, random(10, 155));
      rect(this.x + random(-3, 3), this.y + random(-i, i), random(1, 3), random(1, i));
    } else {

      var c;
      imageMode(CORNER);
      var rBlend;

      if (random(2) > 0.1) { // solo a veces....

        if (this.estado === 0 || this.estado == 1) {
          rBlend = int(random(4)); //6
          if (random(2) > 1.5) {
            // parches/tiras -----------------------------
            this.to_p_y += random(5);
            parche.x = random(this.s);
            parche.y = this.to_p_y; //height - this.y;

            // this.cInc += 10;

            var inc = TWO_PI / 2.001; //sin()   TWO_PI / 25.0
            this.a = (this.a + inc);
            this.cMi_sin += 0.05; //0.05
            var mi_sin = sin(this.a) * this.cMi_sin; //3

            if (this.dirP === 0) {
              c = hoja.get(this.x, this.y, 1, parche.y);
              this.parche_blend(this.x - parche.x / 2, mi_sin + this.y, c, rBlend);
            } else {
              c = hoja.get(this.x, this.y - parche.y - this.s, 1, parche.y);
              this.parche_blend(this.x - parche.x / 2, mi_sin + this.y - parche.y - this.s, c, rBlend);
            }
          } else {
            // stencil emos ------------------------------
            rBlend = 3; //burn
            parche.x = this.s;
            parche.y = this.s;
            c = emo[this.n].get(random(10), random(10), random(5, 25), random(1, 10));
            this.parche_blend(this.x + random(-this.s, this.s),
              this.y + random(-this.s * 1.5, this.s * 1.5), c, rBlend);

          }

        } else {
          // fila de letras finales ------
          // if (random(2) > 0.4) { // solo a veces....
          parche.x = this.s;
          parche.y = this.s;
          r_x = random(3);
          r_y = 15 + random(this.s * 2.2);
          if (random(2) > 1) r_x *= -1;
          if (random(2) > 1) r_y *= -1;
          c = hoja.get(this.x - parche.x / 2, this.y - parche.y / 2,
            parche.x, parche.y);
          blend(c, 0, 0, parche.x, parche.y,
            this.x - parche.x / 2 + r_x, this.y - parche.y / 2 + r_y,
            parche.x / 1.5, parche.y / 1.5, DARKEST);
          // } else {
          // salpicado de letras finales ------
          if (random(2) > 1) {
            this.aper = 5;
            parche.x = this.s;
            parche.y = this.s;
            var to_dirP;
            if (this.dirP === 0) to_dirP = -1; // inv. para abajo
            else if (this.dirP == 1) to_dirP = 1; // inv. para arriba
            r_y = random(4); // * to_dirP;
            //c = hoja.get(this.x - parche.x / 2, this.y - parche.y / 2,
            //parche.x, parche.y);
            for (i = 0; i < 8; i++) {
              r_x = random(this.pi.x - this.aper, this.pf.x + this.aper); //random(-this.s*10, this.s*10);
              //ii = ii * 2;//+= 30;
              r_y *= 1.7;
              blend(c, 0, 0, parche.x, parche.y,
                r_x, (this.y - this.s / 2) + (r_y * to_dirP),
                parche.x / 2, parche.y / 2, BURN);
              //this.x - this.s / 2 + r_x, this.y - this.s / 2 + r_y + i * (to_dirP * (20 + ii)),
              this.aper += 20;
            }
          }
        }
      }

      //}
      // lineas negras ---------
      imageMode(CENTER);
      var cola;
      if (this.dir == 1) cola = -this.s / 2;
      else cola = this.s / 2;
      for (i = 0; i < 3; i++) {
        var linea_x = this.x + cola;
        var linea_y = this.y + random(-this.s / 2, this.s / 2);

        //pix = hoja.get(linea_x, linea_y, this.s + 2, 1);
        push();
        translate(random(linea_x - 3, linea_x + 3), random(linea_y - 5, linea_y + 5));
        //rotate(random(-0.2, 0.2));
        fill(pix); //tint(255);
        //image(pix, 0, 0); //image(pix, 0, 0);//, this.s * random(0.1, 0.7), 1);
        rect(0, 0, this.s * random(0.1, 1), int(random(1, 3)));
        pop();
      }
      // emoticon --------
      push();
      //tint(255);//tint(255, random(20, 255));
      translate(this.x, this.y);
      rotate(random(-0.2, 0.2));
      image(emo[this.n], 0, 0, this.s, this.s);
      pop();
    }
  }

  // avatar hacia nuevo lugar --------------------------------------------
  this.change = function() {
    if (this.estado < 0) {
      var mY = mouseY;
      //if (mY > height) mY = height - 20;
      var mX1 = mouseX - random(60, 100);
      var mX2 = mouseX + random(60, 100);
      if (mX1 < 30) mX1 = 30;
      if (mX2 > width - 30) mX2 = width - 30;
      var mouseV1 = createVector(mX1, mY);
      var mouseV2 = createVector(mX2, mY);
      this.pi = mouseV1;
      this.pf = mouseV2;
      if (mY > height / 2) this.dirP = 1; // dirección de las tiras
      else this.dirP = 0;
      change_go = false;
    }
  }

  this.parche_blend = function(_x, _y, c, _rb) {
    // DARKEST, MULTIPLY, HARD_LIGHT ??, BURN, DIFFERENCE??
    if (_rb === 0) blend(c, 0, 0, parche.x, parche.y, _x, _y, random(1, 31), parche.y, DARKEST);
    else if (_rb == 1) blend(c, 0, 0, parche.x, parche.y, _x, _y, random(21, 41), parche.y, DARKEST);
    else if (_rb == 2) blend(c, 0, 0, parche.x, parche.y, _x, _y, random(1, 31), parche.y, NORMAL);
    else blend(c, 0, 0, parche.x, parche.y, _x, _y, random(1, 11), parche.y, BURN);
  }
}

function mouseMoved() {
  nMouse = 1;
  tMouse = millis();
  cursor(CROSS);

  var mX = mouseX - 60;
  if (mX < 0) mX = 0;
  else if (mX > width) mX = width;
  var mY = mouseY - 15;
  if (mY < 0) mY = 0;
  else if (mY > height) mY = height;

  var cc = hoja.get(mX, mY, 120, 30);
  image(cc, width / 2, 20);
  image(cc, width / 2, height - 20);
  noFill();
  stroke(25);
  rect(width / 2, 20, 120, 30);
  rect(width / 2, height - 20, 120, 30);
}

function emoticon_go() {
  if (termita !== null) {
    for (var i = termita.length - 1; i >= 0; i--) {
      if (change_go) termita[i].change();
    }
    change_go = true;
  }
}

// preload -----------------------------------------------
function preload() {

  texto_cargando = createP("Cargando...");
  texto_cargando.id("centrado");


  txt = int(random(6)); // --------------- TXT ----------------------
  //if (txt == 4) txt = 2;
  datos_parche();

  hoja = loadImage("assets/tx" + txt + ".jpg");
  titulo = loadImage("assets/termitask_titulo.png");
  if (txt === 0) {
    emo[0] = loadImage("assets/emo16.png"); // sol
    emo[1] = loadImage("assets/emo20.png"); // colombia
    emo[2] = loadImage("assets/emo19.png"); // montaña
    emo[3] = loadImage("assets/emo21.png"); // dedo up
    emo[4] = loadImage("assets/emo08.png"); // feliz bienestar
    emo[5] = loadImage("assets/emo23.png"); // flor
    emo[6] = loadImage("assets/emo22.png"); // luna noche
    emo[7] = loadImage("assets/emo23.png"); // flor

  } else
  if (txt == 1) {
    emo[0] = loadImage("assets/emo11.png"); // suiza
    emo[1] = loadImage("assets/emo10.png"); // send
    emo[2] = loadImage("assets/emo07.png"); // cansado
    emo[3] = loadImage("assets/emo11.png"); // suiza
    emo[4] = loadImage("assets/emo09.png"); // guitarra
    emo[5] = loadImage("assets/emo12.png"); // tango
    emo[6] = loadImage("assets/emo08.png"); // feliz
    emo[7] = loadImage("assets/emo03.png"); // amor
    emo[8] = loadImage("assets/emo04.png"); // enojado

  } else
  if (txt == 2) {
    emo[0] = loadImage("assets/emo13.png"); // corazon roto
    emo[1] = loadImage("assets/emo14.png"); // mano saluda
    emo[2] = loadImage("assets/emo15.png"); // tristeza
    emo[3] = loadImage("assets/emo16.png"); // sol
    emo[4] = loadImage("assets/emo17.png"); // comer
    emo[5] = loadImage("assets/emo18.png"); // reloj
    emo[6] = loadImage("assets/emo21.png"); // dedo arrriba
  } else
  if (txt == 3) {
    emo[0] = loadImage("assets/emo10.png"); // send carta
    emo[1] = loadImage("assets/emo24.png"); // rezo
    emo[2] = loadImage("assets/emo27.png"); // españa
    emo[3] = loadImage("assets/emo24.png"); // rezo
    emo[4] = loadImage("assets/emo27.png"); // españa
    emo[5] = loadImage("assets/emo26.png"); // paloma
    emo[6] = loadImage("assets/emo27.png"); // españa
    emo[7] = loadImage("assets/emo24.png"); // rezo
    emo[8] = loadImage("assets/emo25.png"); // santito
  } else
  if (txt == 4) {
    emo[0] = loadImage("assets/emo29.png"); // elgrito: angustia, desesperacion
    emo[1] = loadImage("assets/emo06.png"); // mala onda
    emo[2] = loadImage("assets/emo32.png"); // corazon verde
    emo[3] = loadImage("assets/emo30.png"); // calabera
    emo[4] = loadImage("assets/emo26.png"); // paloma
    emo[5] = loadImage("assets/emo05.png"); // bien, ok
    emo[6] = loadImage("assets/emo08.png"); // feliz
    emo[7] = loadImage("assets/emo33.png"); // cocina
    emo[8] = loadImage("assets/emo31.png"); // mujer indu
  } else
  if (txt == 5) {
    emo[0] = loadImage("assets/emo34.png"); // rusia
    emo[1] = loadImage("assets/emo35.png"); // casa
    emo[2] = loadImage("assets/emo36.png"); // pequeño
    emo[3] = loadImage("assets/emo37.png"); // cara sin boca
    emo[4] = loadImage("assets/emo38.png"); // anteojos
    emo[5] = loadImage("assets/emo39.png"); // reir
    emo[6] = loadImage("assets/emo40.png"); // casamiento
  }
}


function datos_parche() {
  if (txt === 0) {
    // ubicacion palabras
    p_ini[0] = createVector(620, 195, 0); // para abajo
    p_fin[0] = createVector(815, 195);
    p_ini[1] = createVector(560, 230, 0);
    p_fin[1] = createVector(650, 230);
    p_ini[2] = createVector(205, 370, 2);
    p_fin[2] = createVector(275, 370);
    p_ini[3] = createVector(275, 520, 2);
    p_fin[3] = createVector(510, 520);
    p_ini[4] = createVector(450, 700, 2); // random
    p_fin[4] = createVector(560, 700);
    p_ini[5] = createVector(480, 950, 0);
    p_fin[5] = createVector(530, 950);
    p_ini[6] = createVector(590, 1025, 1); //1 para arriba
    p_fin[6] = createVector(665, 1025);
    p_ini[7] = createVector(130, 560, 0); //para abajo
    p_fin[7] = createVector(350, 560);
  } else
  if (txt == 1) {
    p_ini[0] = createVector(375, 75, 0);
    p_fin[0] = createVector(465, 75);
    p_ini[1] = createVector(515, 220, 0);
    p_fin[1] = createVector(555, 220);
    p_ini[2] = createVector(580, 308, 2);
    p_fin[2] = createVector(640, 308);
    p_ini[3] = createVector(300, 385, 2);
    p_fin[3] = createVector(380, 385);
    p_ini[4] = createVector(145, 445, 0);
    p_fin[4] = createVector(235, 445);
    p_ini[5] = createVector(375, 445, 0); // para abajo
    p_fin[5] = createVector(465, 445);
    p_ini[6] = createVector(670, 502, 2);
    p_fin[6] = createVector(710, 502);
    p_ini[7] = createVector(65, 562, 1); //1 para arriba
    p_fin[7] = createVector(95, 562);
    p_ini[8] = createVector(135, 275, 1); //1 para arriba
    p_fin[8] = createVector(250, 275);
  } else
  if (txt == 2) {
    p_ini[0] = createVector(620, 238, 0); // para abajo
    p_fin[0] = createVector(755, 238);
    p_ini[1] = createVector(355, 305, 1); //1 para arriba
    p_fin[1] = createVector(430, 305);
    p_ini[2] = createVector(360, 365, 0); // para abajo
    p_fin[2] = createVector(520, 365);
    p_ini[3] = createVector(160, 670, 1);
    p_fin[3] = createVector(340, 670);
    p_ini[4] = createVector(530, 668, 2); //2
    p_fin[4] = createVector(640, 668);
    p_ini[5] = createVector(820, 672, 2); //random
    p_fin[5] = createVector(970, 672);
    p_ini[6] = createVector(545, 295, 2); //random
    p_fin[6] = createVector(570, 295);
  } else
  if (txt == 3) {
    p_ini[0] = createVector(630, 240, 1); //1 para arriba
    p_fin[0] = createVector(780, 240);
    p_ini[1] = createVector(365, 287, 1); //1 para arriba
    p_fin[1] = createVector(520, 287);
    p_ini[2] = createVector(525, 318, 1); // para arriba
    p_fin[2] = createVector(580, 318);
    p_ini[3] = createVector(675, 322, 0); // para abajo
    p_fin[3] = createVector(755, 322);
    p_ini[4] = createVector(350, 350, 0); //
    p_fin[4] = createVector(555, 350);
    p_ini[5] = createVector(525, 808, 0); //
    p_fin[5] = createVector(750, 808);
    p_ini[6] = createVector(130, 898, 1); //
    p_fin[6] = createVector(370, 898);
    p_ini[7] = createVector(420, 1208, 1); //
    p_fin[7] = createVector(505, 1208);
    p_ini[8] = createVector(180, 1265, 1); //
    p_fin[8] = createVector(240, 1265);
  } else
  if (txt == 4) {
    p_ini[0] = createVector(300, 95, 0); // 
    p_fin[0] = createVector(390, 95);
    p_ini[1] = createVector(530, 175, 1); // para arriba
    p_fin[1] = createVector(750, 175);
    p_ini[2] = createVector(490, 200, 0); // para abajo
    p_fin[2] = createVector(660, 200);
    p_ini[3] = createVector(30, 338, 2); //
    p_fin[3] = createVector(90, 338);
    p_ini[4] = createVector(390, 415, 2); //
    p_fin[4] = createVector(545, 415);
    p_ini[5] = createVector(155, 550, 2); //
    p_fin[5] = createVector(235, 550);
    p_ini[6] = createVector(30, 925, 2); //
    p_fin[6] = createVector(85, 925);
    p_ini[7] = createVector(620, 925, 2); //
    p_fin[7] = createVector(690, 925);
    p_ini[8] = createVector(255, 1054, 1); //
    p_fin[8] = createVector(395, 1054);
  } else
  if (txt == 5) {
    p_ini[0] = createVector(470, 150, 1); // para arriba
    p_fin[0] = createVector(522, 150);
    p_ini[1] = createVector(440, 227, 0); // para abajo
    p_fin[1] = createVector(525, 227);
    p_ini[2] = createVector(90, 323, 2); // 
    p_fin[2] = createVector(273, 323);
    p_ini[3] = createVector(95, 478, 0); // 
    p_fin[3] = createVector(375, 478);
    p_ini[4] = createVector(380, 682, 2); // 
    p_fin[4] = createVector(450, 682);
    p_ini[5] = createVector(550, 937, 1); // 
    p_fin[5] = createVector(695, 937);
    p_ini[6] = createVector(570, 365, 2); // 
    p_fin[6] = createVector(610, 365);
  }

  cEmo = p_ini.length; // cantidad de emoticones

}