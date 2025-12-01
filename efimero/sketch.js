let b_trigger = false;
let seres = [], ser_cont, ser_dist, ser_lim;;
const X_opciones = [[18, 10, 5, 0, 0, -10], [15, 8, 5, 0, 0, 0, 0, -5],
[13, 10, 5, 0, 0, 0, -5], [10, 5, 5, 5, 3, 0, -5]];
let X_grilla = [];
let memo_cont = 0, memoR = [], memo_lim;
let barra_av = [];
const barra_dur = [3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let barra_notas = [], barra_tipo = "";
let cg_clave = []
let hojas = 0, hojas_memo = -1;
let col_back;
let unis = [], unis_destinoY;
const unis_sent = ["ini", "fin"];
let solo = 0, solo_ini = 0, solo_fin = 49, b_solo;
let curve_T;
let col_pent = [];
let valorY_rango, valorX_rango;
let notas = [], notas_largo, notas_gesto;
let b_pausa = false;
let graba_ho;


function setup() {

  let cv = createCanvas(1080, 1080);
  cv.parent("cv");
  cv.id("fu");
  cv.class("fu");
  pixelDensity(1);
  frameRate(30);
  colorMode(HSB);
  imageMode(CENTER);
  for (let i = 0; i < 10; i++) {
    cg_clave[i] = createGraphics(100, 100);
    cg_clave[i].colorMode(HSB);
    cg_clave[i].stroke(0);
    cg_clave[i].noFill();
  }

  prepara_sketch();
}

function prepara_sketch() {

  console.log("::::: Fugax - Yamil Burguener 2025");
  hojas = 0, ser_cont = 0, memo_cont = 0, hojas_memo = -1;
  seres = [], notas = [];
  clear();
  // image setting -------------------------------------
  if (m0 < 0.65) curve_T = map(m0, 0, 0.65, 0, 1.7); else curve_T = map(m0, 0.65, 1, 1.7, 3.5); // slider 1
  curveTightness(curve_T);
  console.log("[1] Curve tightness of the graphs (0.0 - 3.5): " + curve_T.toFixed(2));

  col_back = 62 + randomM0() * 35;
  background(col_back);
  let _nl = [1, 5, 5, 10, 10, 10];
  notas_largo = _nl[int(randomM0() * _nl.length)];
  let _ng = ["asc", "desc", "random"];
  notas_gesto = _ng[int(randomM0() * _ng.length)];
  // bar types
  let _tb = constrain(map(m1, 0, 1, -0.5, 1), 0, 1);
  if (_tb < 0.35) {
    barra_tipo = "together";
    let _b = 0, _l = [1, 2, 3, 1, 2, 3, 100];
    memo_lim = _l[int(randomM0() * _l.length)];
    for (let i = 0; i < barra_dur.length; i++) _b += barra_dur[i];
    _b = _b / barra_dur.length;
    barra_notas[0] = _b;
  } else if (_tb < 0.8) {
    barra_tipo = "slightly separated";
    barra_notas = barra_dur;
    let _l = [10, 100];
    memo_lim = _l[int(randomM0() * _l.length)];
  } else {
    barra_tipo = "very loose";
    let _l = barra_dur.length
    for (let j = 0; j < 100; j++) {
      for (let i = 0; i < _l; i++) {
        barra_notas.push(barra_dur[i])
      }
    }
    memo_lim = 100;
  }
  valorX_rango = _tb * 2; // slider 2
  console.log("[2] Independence between melodic lines (0.0 - 2.0): " + valorX_rango.toFixed(2));

  let _vy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 7, 8, 9, 10];
  valorY_rango = _vy[int(m2 * _vy.length)]; // slider 3
  console.log("[3] Vertical movements of the lines of the staves (1 - 10): " + valorY_rango);

  let _e = 0; if (valorY_rango < 4) _e = 3;
  ser_dist = int(constrain(map(m3, 0, 0.5, 1 + _e, 8), 1, 8));
  ser_lim = map(ser_dist, 1, 8, 240, 80);
  console.log("[4] Distance between lines (1 - 8): " + ser_dist); // slider 4

  let _cp = ""; col_pent[0] = m4 * 360;
  if (col_pent[0] > 320) { col_pent[0] = map(col_pent[0], 320, 360, 0, 360), col_pent[1] = 0, col_pent[2] = 0.45; _cp = int((col_pent[0] + 180) % 360) + "º & black color" }
  else if (col_pent[0] < 10) { col_pent[0] = randomM0() * 360, col_pent[1] = 0, col_pent[2] = 0; _cp = int((col_pent[0] + 180) % 360) + "º & no color" }
  else { col_pent[1] = 90, col_pent[2] = 0.04; _cp = int(col_pent[0]) + "º" }
  console.log("[5] Main score fill color: " + _cp); // slider 5 

  for (let i = 0; i < 200; i++) memoR[i] = randomM1();

  let _op = int(randomM0() * 4);
  for (let h = 0; h < 20; h++) {
    X_grilla[h] = [];
    for (let i = 0; i < 50; i++) {
      X_grilla[h][i] = X_opciones[_op][i % X_opciones[_op].length];
    }
    X_grilla[h] = _shuffle(X_grilla[h]);
  }
  // unisons
  for (let i = 0; i < 50; i++) {
    unis[i] = [];
  }
  let _un = [false, false, false, true];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 20; j++) unis[i][j] = _un[int(randomM0() * _un.length)];
    for (let k = 0; k < 4; k++) {
      if (i < 49) i++;
      for (let j = 0; j < 20; j++) unis[i][j] = unis[i - 1][j]
    }
  }
  unis_destinoY = height / 2;
  if (randomM0() < 0.9) for (let i = 0; i < 50; i++) { unis[i][3] = true; unis[i][12] = true; }
  let _s = 0, _yy = 0;
  let _desde = map(ser_dist, 8, 1, 164, height / 2 - 25);
  for (let _y = 0; _y < 50; _y++) {
    memo_cont = 0;
    seres.push(new Ser(_s, 100, _desde + _yy * ser_dist));
    _yy++;
    if (_y % 5 == 4) _yy += 5;
    _s += 1;
  }

  elije_solo();

  for (let i = 0; i < 10; i++) {
    cg_clave[i].curveTightness(curve_T);
    claves(i);
  }
  let _h = [0, 1, 1, 2, 4];
  graba_ho = _h[int(randomM4() * _h.length)];

  b_pausa = false, frameCount = 0;
}


function draw() {

  if (resetAnimation) {
    prepara_sketch();
    resetAnimation = false;
  }
  noCursor();
  let _a;
  if (int(hojas) != graba_ho) _a = map(seres[0].barraUbic(), 0, 60, 0.11, 0.04); else _a = 0.11;
  fill(col_back, _a); noStroke();
  rect(0, 0, width, height);
  for (let i = 0; i < seres.length; i++) {
    if (i >= solo_ini && i <= solo_fin) seres[i].dibuja();
    seres[i].calcula_barra();
  }

  if (frameCount % 2 == 0) {
    let _i;
    if (notas_gesto == "desc") _i = int(frameCount * 0.5) % 50;
    else if (notas_gesto == "asc") _i = 49 - int(frameCount * 0.5) % 50;
    else _i = int(memo_random() * 50);
    _i = int(map(_i, 0, 49, solo_ini, solo_fin));
    let _n = seres[_i].nota();
    if (_n[0]) notas.push(new Nota(_n[1], _n[2], _n[3]));
  }
  for (let i = 0; i < notas.length; i++) {
    notas[i].dibuja();
    if (notas[i].final()) notas.splice(i, 1);
  }
  if (!b_trigger) {
    if ((int(hojas) == graba_ho && seres[0].barraUbic() > 42) || int(hojas) > graba_ho) {
      b_trigger = true;
      triggerPreview();
      //grabaImagen(); //bug
    }
  }
}

function elije_solo() {

  if (barra_tipo == "together") {
    b_solo = true;
    solo = 5 + int(randomM3() * 7);
  }
}

function memo_random() {

  memo_cont++;
  if (memo_cont > memo_lim) memo_cont = 0;
  return memoR[memo_cont];
}

function _shuffle(array) {

  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(randomM2() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function claves(_i) {

  cg_clave[_i].clear()
  let _w = cg_clave[_i].width / 2;
  let _h = cg_clave[_i].height / 2;
  for (let i = 0; i < 2; i++) {
    if (_i < 6) { // G clef
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w - 5, _h); cg_clave[_i].curveVertex(_w - 5, _h)
      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 10 + (randomM0() * 4 - 2), _h + 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 6 + (randomM0() * 4 - 2), _h - 27 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 2 + (randomM0() * 4 - 2), _h - 30 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + (randomM0() * 4 - 2), _h - 3 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 4 + (randomM0() * 4 - 2), _h + 30 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 15, _h + 27); cg_clave[_i].curveVertex(_w - 15, _h + 27);
      cg_clave[_i].endShape();
    }
    else { // F clef
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w + 5, _h - 4); cg_clave[_i].curveVertex(_w + 5, _h - 4);
      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 5 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w + 13 + (randomM0() * 4 - 2), _h + 8 + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w, _h + 25); cg_clave[_i].curveVertex(_w, _h + 25);
      cg_clave[_i].endShape();

      cg_clave[_i].strokeWeight(2);
      cg_clave[_i].beginShape(POINTS);
      cg_clave[_i].vertex(_w + 18 + (randomM0() * 2 - 1), _h - 4 + (randomM0() * 2 - 1));
      cg_clave[_i].vertex(_w + 18 + (randomM0() * 2 - 1), _h + 3 + (randomM0() * 2 - 1));
      cg_clave[_i].endShape();
      cg_clave[_i].strokeWeight(1);
    }
  }
}

function grabaImagen() {

  console.log("saving!")
  let now = new Date();
  let seedName = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
  saveCanvas("Fugax_" + seedName + ".png")
}

function keyReleased() {

  if (key == "s" || key == "S") {
    grabaImagen();
  }
  if (key == "p" || key == "P") {
    b_pausa = !b_pausa;
    if (!b_pausa) loop(); else noLoop();
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResizedUser() {
  // Handle resizing if needed, but since canvas is fixed at 1080x1080, maybe nothing
  // resizeCanvas(canvasWidth, canvasHeight); // If dynamic, but here fixed
}


// ----------------------------------------------
class Ser {

  constructor(_index, _x, _y) {
    this.index = _index;
    this.co = []
    for (let i = 0; i <= 50; i++) this.co[i] = createVector(0, 0);
    this.co[0] = createVector(_x, _y);
    this.ini = createVector(_x, _y)
    this.barra = 0;
    this.barra_av = []
    let _b = _shuffle(barra_notas)
    for (let i = 0; i < _b.length; i++) {
      this.barra_av[i] = _b[(i + _index) % _b.length] * 0.5;
    }
    this.unisono;
    const _sw = [1, 2, 2, 3];
    this.sw = _sw[int(randomM0() * 4)];
    this.actualizar();
  }

  dibuja() {
    stroke(0, 0.04); strokeWeight(this.sw); noFill();
    beginShape();
    const _tb = map(this.barra, 0, 50, 50, 15);
    let _limI; if (int(hojas != graba_ho)) _limI = int(constrain(this.barra - _tb, 0, 50)); else _limI = 0;
    let _limF = constrain(this.barra + 7, 0, 50);
    for (let i = _limI; i < _limF; i++) {
      if (this.index % 5 == 0) {
        if (abs(this.co[_limI].y - this.co[i].y) < 170) fill(col_pent[0], 90, col_pent[1], col_pent[2]);
        else noFill();
      }
      else if (this.index % 6 == 1) {
        if (abs(this.co[_limI].y - this.co[i].y) < 170) fill((col_pent[0] + 335) % 360, 90, col_pent[1], col_pent[2]);
        else noFill();
      }
      else if (this.index % 39 == int(frameCount * 0.01) % 10) {
        if (abs(this.co[_limI].y - this.co[i].y) < 200) fill((col_pent[0] + 180) % 360, 100, 90, 0.05);
        else noFill();
      }
      curveVertex(this.co[i].x, this.co[i].y);
      if (i == 0 || i == 49) curveVertex(this.co[i].x, this.co[i].y);
    }

    if (_limI < 5 && this.index % 5 == 4) {
      tint(0, 0.13);
      if (this.index < 30) image(cg_clave[int((this.index - 4) / 5)], this.co[1].x + 20, this.co[0].y - 10);
      else image(cg_clave[int((this.index - 4) / 5)], this.co[1].x + 20, this.co[0].y - 25);
    }
    endShape();
    // reading bar
    if (this.index % 2 == 0) fill((col_pent[0] + 170) % 360, 100, 90, 0.2); else fill(0, 0.15);
    if (this.barra < 49) {
      const _ve = p5.Vector.lerp(this.co[int(this.barra)], this.co[int(this.barra) + 1], this.barra % 1);
      rect(_ve.x - 3, _ve.y - 3, 6, 6);
    }
  }

  calcula_barra() {

    let _av = this.barra_av[frameCount % this.barra_av.length]
    this.barra += _av;
    if (this.barra > 54) {
      memo_cont = 0;
      if (hojas > 17) {
        hojas = 0;
        elije_solo();
      }
      seres[this.index].actualizar();

      hojas += 0.02;
      hojas = round(hojas, 2);
      if (int(hojas) == hojas_memo + 1) {
        // page turn
        unis_destinoY = 164 + (int(randomM0() * 90) * 8);
        if (b_trigger && randomM4() > 0.9) graba_ho = int(hojas);
        if (int(hojas) == solo && barra_tipo == "together") {
          let _si = [10, 15, 20, 25, 30];
          solo_ini = _si[int(randomM3() * _si.length)];
          solo_fin = solo_ini + 9;
          b_solo = true;
        } else {
          b_solo = false;
          solo_ini = 0; solo_fin = 49;
        }
      }
      hojas_memo = int(hojas)
      if (this.index % 5 == 0) claves(int(this.index / 5));
      this.barra = 0;
    }
  }

  actualizar() {

    let x_memo = this.ini.x;
    let y_memo = this.ini.y;
    this.unisono = unis[this.index][int(hojas)];

    for (let i = 0; i < 50; i++) {
      if (i > 0) this.co[i].x = this.co[i - 1].x + X_grilla[int(hojas)][(i + int(this.index * valorX_rango)) % X_grilla[int(hojas)].length] * 5;
      else if (unis_sent[hojas_memo % 2] == "fin") this.co[i].y = this.ini.y;

      let _si = constrain((sin(ser_cont * 0.01) * 0.3), 0, 1)
      if (this.co[i].x == x_memo || memo_random() < _si) {
        // y change
        if (unis_sent[hojas_memo % 2] == "fin" || !this.unisono) {
          if (i > 0) {
            let _yy = this.valorY();
            this.co[i].y = this.co[i - 1].y + _yy;
          }
        }
        else {
          if (unis_sent[hojas_memo % 2] == "ini" && i < 6) this.co[i].y = unis_destinoY;
          else if (i > 0) this.co[i].y = this.co[i - 1].y
        }
      } else {
        if ((unis_sent[hojas_memo % 2] == "fin" && this.unisono && i > 10) ||
          unis_sent[hojas_memo % 2] == "ini" && this.unisono && i < 40) {
          // make unison
          let _fi;
          if (unis_sent[hojas_memo % 2] == "fin") {
            this.co[i].y = y_memo;
            _fi = createVector(this.co[i].x, unis_destinoY);
          } else {
            this.co[i].y = this.ini.y;
            _fi = createVector(this.co[i].x, unis_destinoY);
          }
          let _m = abs(sin(i * 0.033));
          if (unis_sent[hojas_memo % 2] == "ini") _m = map(_m, 0, 1, 1, 0);
          let _ve = p5.Vector.lerp(this.co[i], _fi, _m);
          this.co[i].y = _ve.y;
        } else {
          this.co[i].y = y_memo;
        }
      }
      this.co[i].x = constrain(this.co[i].x, 100, width - 100);
      x_memo = this.co[i].x;
      if (!this.unisono) y_memo = this.co[i].y;
      // limits
      if (this.co[i].y > height - ser_lim) { this.co[i].y -= ser_lim * 3; }
      else if (this.co[i].y < ser_lim) { this.co[i].y += height - ser_lim * 3; }
    }
    this.co[49].x = width - 100;
  }

  barraUbic() {

    return this.barra
  }

  nota() {

    const _ba = constrain(int(this.barra), 0, 50);
    let _x = this.co[_ba].x;
    if (_x > 150 && _x < width - 110 && this.barra < 45) return [true, this.co[_ba].x, this.co[_ba].y, this.index];
    return [false, 0, 0];
  }

  valorY() {

    let _yy = [-4, -2, 2, 4];
    let _r = int(memo_random() * 4);
    ser_cont++;
    _yy[_r] *= 1 + (abs(sin(ser_cont * 0.005)) * valorY_rango);
    return _yy[_r];
  }
}

class Nota {

  constructor(_x, _y, _i) {
    this.x = _x;
    this.y = _y; if (randomM0() < 0.2) this.y -= 4;
    this.index = _i;
    let _v;
    if (int(hojas) != graba_ho) _v = map(_x, 0, width, 140, 65);
    else _v = map(_x, 0, width, 300, 10);
    this.vida = _v;
    if (_x > width - 200) this.largo = 10;
    else this.largo = int(10 + int(randomM0() * notas_largo) * 10);
    let _al = [-1, -1, -1, -1, -1, 0, 1];
    this.alte = _al[int(randomM0() * _al.length)];
    this.graf = [];
    if (randomM0() < 0.3) this.grafico();
    if (curve_T > 0.5 && curve_T < 1.5) this.tipo = "rect";
    else if (curve_T > 2.5) this.tipo = "circle";
    else if (randomM0() < 0.5) this.tipo = "rect"; else this.tipo = "circle";
  }

  dibuja() {

    this.vida--;
    fill(0, 0.12);
    if (this.tipo == "rect") rect(this.x - 3, this.y - 3, 6, 6);
    else circle(this.x, this.y, 6);
    noFill(), stroke(0, 0.08), strokeWeight(2);
    beginShape();
    if (this.index < 25) {
      curveVertex(this.x + 4, this.y); curveVertex(this.x + 4, this.y);
      curveVertex(this.x + 2, this.y - 25);
      curveVertex(this.x + this.largo, this.y - 25); curveVertex(this.x + this.largo, this.y - 25);
    } else {
      curveVertex(this.x - 4, this.y); curveVertex(this.x - 4, this.y);
      curveVertex(this.x - 2, this.y + 25);
      curveVertex(this.x + this.largo, this.y + 25); curveVertex(this.x + this.largo, this.y + 25);
    }
    endShape();

    if (this.alte == 0) this.alteracion(0);
    else if (this.alte == 1) this.alteracion(1);

    for (let i = 0; i < this.graf.length; i++) {
      point(this.graf[i].x, this.graf[i].y);
    }
    noStroke();
  }

  alteracion(_i) {

    let _w = this.x - 10;
    let _h = this.y;
    noFill(); strokeWeight(1);
    beginShape();

    if (_i == 0) { // alteration #
      vertex(_w - 5, _h - 1);
      vertex(_w + 5, _h - 3);
      endShape(); beginShape();
      vertex(_w - 5, _h + 3);
      vertex(_w + 5, _h + 1);
      endShape(); beginShape();
      vertex(_w - 2, _h - 6);
      vertex(_w - 2, _h + 6);
      endShape(); beginShape();
      vertex(_w + 2, _h - 6);
      vertex(_w + 2, _h + 6);
    }
    else if (_i == 1) { // alteration b
      vertex(_w - 1, _h - 10);
      vertex(_w - 1, _h + 2);
      endShape(); beginShape();
      curveVertex(_w - 1, _h + 2); curveVertex(_w - 1, _h + 2);
      curveVertex(_w + 2, _h - 4);
      curveVertex(_w + 4, _h - 1);
      curveVertex(_w - 2, _h + 7); curveVertex(_w - 1, _h + 7);
    }
    endShape();
  }

  grafico() {

    let _yy;
    if (this.index < 25) _yy = -35; else _yy = 35;
    let _w = this.x + 2;
    let _h = this.y + _yy;
    for (let i = 0; i < 6; i++) {
      this.graf[i] = createVector(_w + int(-4 + memo_random() * 8), _h + int(-4 + memo_random() * 8));
    }
  }

  final() {

    if (this.vida < 0) { return true; }
    else { return false; }
  }
}
