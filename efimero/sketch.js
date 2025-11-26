let b_trigger = false;
let seres = [];
//const X_opciones = [[20, 10, 5, 0, 0, -10], [17, 8, 5, 0, 0, 0, 0, -5],[15, 10, 5, 0, 0, 0, -5], [10, 5, 5, 5, 5, 0, -5]]  //  [10, 5, 5, 5, 5, 0, -5];const X_opciones = [[20, 10, 5, 0, 0, -10], [17, 8, 5, 0, 0, 0, 0, -5],[15, 10, 5, 0, 0, 0, -5], [10, 5, 5, 5, 5, 0, -5]] //  [10, 5, 5, 5, 5, 0, -5];
//const X_opciones = [[16, 8, 4, 0, 0, -8], [14, 6, 4, 0, 0, 0, 0, -4],[12, 8, 4, 0, 0, 0, -4], [8, 4, 4, 4, 4, 0, -4]] //  [10, 5, 5, 5, 5, 0, -5];
const X_opciones = [[18, 10, 5, 0, 0, -10], [15, 8, 5, 0, 0, 0, 0, -5],
[13, 10, 5, 0, 0, 0, -5], [10, 5, 5, 5, 3, 0, -5]];
let X_grilla = [];
let memo_cont = 0, memoR = [], memo_lim;
let ser_cont, ser_dist, ser_lim;
let barra_av = []
const barra_dur = [3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let barra_notas = [], barra_tipo = "";
let cg_clave = []
let hojas = 0, hojas_memo;
let col_back;
let unis = [], unis_destinoY;
const unis_sent = ["ini", "fin"];
let solo = 0, solo_ini = 0, solo_fin = 49, b_solo;
let curve_T;
let col_pent = [];
let valorY_rango;
let valorX_rango;
let notas = [];
let notas_largo;
let notas_gesto;
let b_pausa = false;
let graba_ho, graba_ba;

function setup() {

  let cv = createCanvas(1080, 1080);
  cv.parent("cv");
  cv.id("fu");
  cv.class("fu");
  pixelDensity(1);

  frameRate(30);
  colorMode(HSB);
  imageMode(CENTER);

  //For testing purposes, if I activate this part of the code, the outputs work consistently.
  /* let mi_seed = Math.floor(9999999999 * random()); //9749902258
  print("seed: " + mi_seed);
  randomSeed(mi_seed);
  m0 = random(), m1 = random(), m2 = random(), m3 = random(), m4 = random();
  seedRandomness(); */

  /* let mi_seed = m0*9999999;
  randomSeed(mi_seed);
  print("seed: " + mi_seed); */

  for (let i = 0; i < 10; i++) {
    cg_clave[i] = createGraphics(100, 100);
    cg_clave[i].colorMode(HSB);
    cg_clave[i].stroke(0);
    cg_clave[i].noFill();
  }

  prepara_sketch();
}

function prepara_sketch() {
  console.log("::::: Fugax - Yamil Burguener 2025")
  print(m0, m1, m2, m3, m4) // bug
  hojas = 0, ser_cont = 0, memo_cont = 0;
  seres = [], notas = [];
  clear();

  // image setting -------------------------------------
  curve_T = map(m0, 0, 1, 0, 3.5); // slider 1
  curveTightness(curve_T);
  console.log("[1] Curve tightness of the graphs (0.0 - 3.5): " + curve_T.toFixed(2));

  col_back = 60 + randomM0() * 35
  background(col_back);
  let _nl = [1, 5, 5, 10, 10, 10];
  notas_largo = _nl[int(randomM0() * _nl.length)];
  let _ng = ["asc", "desc", "random"];
  notas_gesto = _ng[int(randomM0() * _ng.length)];

  valorX_rango = m1 * 2; // slider 2
  console.log("[2] Independence between melodic lines (0.0 - 2.0): " + valorX_rango.toFixed(2));

  let _vy = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  valorY_rango = _vy[int(m2 * _vy.length)]; // slider 3
  console.log("[3] Vertical movements of the lines of the staves (0.5 - 10): " + valorY_rango);

  // tipos de barra
  let _r = randomM0();// m3
  if (_r < 0.35) {
    barra_tipo = "together";
    let _b = 0;
    for (let i = 0; i < barra_dur.length; i++) {
      _b += barra_dur[i];
      let _l = [1, 2, 3, 100]
      memo_lim = _l[int(randomM0() * _l.length)];
    }
    _b = _b / barra_dur.length;
    barra_notas = [_b];
  } else if (_r < 0.8) {
    barra_tipo = "slightly separated";
    barra_notas = barra_dur;
    let _l = [10, 100, 100]
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
  //console.log("[4] Musical scrollbar advance: " + barra_tipo)

  ser_dist = int(constrain(map(m3, 0, 0.5, 1, 8), 1, 8));
  ser_lim = map(ser_dist, 1, 8, 240, 80);
  console.log("[4] Distance between lines (1 - 8) " + ser_dist); // slider 4

  col_pent[0] = m4 * 360, _cp = "";
  if (col_pent[0] > 320) { col_pent[0] = map(col_pent[0], 320, 360, 0, 360), col_pent[1] = 0, col_pent[2] = 0.5; _cp = "º & black color" }
  else if (col_pent[0] < 5) { col_pent[0] = randomM0() * 360, col_pent[1] = 0, col_pent[2] = 0; _cp = "º & no color" }
  else { col_pent[1] = 90, col_pent[2] = 0.08; _cp = "º" }
  console.log("[5] Score fill color: " + int(col_pent[0]) + _cp); // slider 5 

  for (let i = 0; i < 200; i++) {
    memoR[i] = randomM1();
  }

  let _op = int(randomM0() * 4);
  for (let h = 0; h < 20; h++) {
    X_grilla[h] = []; // 1 por cada hoja, 20 en total
    for (let i = 0; i < 50; i++) {
      X_grilla[h][i] = X_opciones[_op][i % X_opciones[_op].length];
    }
    X_grilla[h] = _shuffle(X_grilla[h]);
  }

  // unisonos
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
  if (randomM0() < 0.9) for (let i = 0; i < 50; i++) { unis[i][3] = true; unis[i][12] = true; } // unisono total

  let _s = 0, _yy = 0;
  ////let _desde = 164, _dist = 1;
  let _desde = map(ser_dist, 8, 1, 164, height / 2 - 25);

  for (let _y = 0; _y < 50; _y++) { //100
    memo_cont = 0;
    seres.push(new Ser(_s, 100, _desde + _yy * ser_dist)); //_s, 100, 164 + _y * 8
    _yy++;
    if (_y % 5 == 4) _yy += 5
    _s += 1;
  }

  elije_solo();

  for (let i = 0; i < 10; i++) {
    cg_clave[i].curveTightness(curve_T)
    claves(i);
  }

  let _h = [0, 1, 1, 2, 4];
  graba_ho = _h[int(randomM4() * _h.length)];
  let _b = [24, 35, 35, 35, 43];
  graba_ba = _b[int(randomM4() * _b.length)];

  loop(), b_pausa = false, frameCount = 0;
  b_trigger = false // bug
}

function draw() {

  if (resetAnimation) {
    print("resetAnimation") // bug
    prepara_sketch();
    resetAnimation = false;
  }
  const _a = 0.12 + ((sin(frameCount * 0.009) + 1) * 0.05); // 0.12 a 0.22
  fill(col_back, _a); noStroke(); // 0.2
  rect(0, 0, width, height);
  for (let i = 0; i < seres.length; i++) {
    if (i >= solo_ini && i <= solo_fin) {
      stroke(0, 0.09);
      strokeWeight(2);
      noFill();
      seres[i].dibuja();

    }
    seres[i].calcula_barra();
  }

  if (frameCount % 2 == 0) {
    let _i;
    if (notas_gesto == "desc") _i = int(frameCount * 0.5) % 50;
    else if (notas_gesto == "asc") _i = 49 - int(frameCount * 0.5) % 50;
    else _i = int(memo_random() * 50)
    _i = int(map(_i, 0, 49, solo_ini, solo_fin));
    let _n = seres[_i].nota()
    if (_n[0]) notas.push(new Nota(_n[1], _n[2], _n[3]))
  }
  for (let i = 0; i < notas.length; i++) {
    notas[i].dibuja();
    if (notas[i].final()) { notas.splice(i, 1); }
  }

  if (!b_trigger && (int(hojas) == graba_ho && seres[0].barraUbic() > graba_ba || int(hojas) > graba_ho)) {
    b_trigger = true;
    triggerPreview();
    grabaImagen(); //Activate to verify the consistency of the outputs (bug)
  }
}

function elije_solo() {
  if (barra_tipo == "together") {
    b_solo = true;
    solo = 5 + int(randomM3() * 7);
    // print("solo " + solo) // bug
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
    if (_i < 6) { // clave de sol: G
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w - 5, _h); cg_clave[_i].curveVertex(_w - 5, _h)

      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + 10 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w - 10 + (randomM0() * 4 - 2), _h + 10 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w - 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2))

      cg_clave[_i].curveVertex(_w + 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2))

      cg_clave[_i].curveVertex(_w + 6 + (randomM0() * 4 - 2), _h - 27 + (randomM0() * 4 - 2))

      cg_clave[_i].curveVertex(_w + 2 + (randomM0() * 4 - 2), _h - 30 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w + (randomM0() * 4 - 2), _h - 3 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w - 4 + (randomM0() * 4 - 2), _h + 30 + (randomM0() * 4 - 2))

      cg_clave[_i].curveVertex(_w - 15, _h + 27); cg_clave[_i].curveVertex(_w - 15, _h + 27)
      cg_clave[_i].endShape();
    }
    else { // clave de fa : F
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w + 5, _h - 4); cg_clave[_i].curveVertex(_w + 5, _h - 4);

      cg_clave[_i].curveVertex(_w + 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2));
      cg_clave[_i].curveVertex(_w - 5 + (randomM0() * 4 - 2), _h + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w - 5 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w + 10 + (randomM0() * 4 - 2), _h - 10 + (randomM0() * 4 - 2))
      cg_clave[_i].curveVertex(_w + 13 + (randomM0() * 4 - 2), _h + 8 + (randomM0() * 4 - 2))

      cg_clave[_i].curveVertex(_w, _h + 25); cg_clave[_i].curveVertex(_w, _h + 25)
      cg_clave[_i].endShape();

      cg_clave[_i].strokeWeight(2);
      cg_clave[_i].beginShape(POINTS);
      cg_clave[_i].vertex(_w + 18 + (randomM0() * 2 - 1), _h - 4 + (randomM0() * 2 - 1))
      cg_clave[_i].vertex(_w + 18 + (randomM0() * 2 - 1), _h + 3 + (randomM0() * 2 - 1))
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
    grabaImagen()
  }
  if (key == "p" || key == "P") {
    b_pausa = !b_pausa;
    if (!b_pausa) {
      loop();
    } else {
      noLoop();
    }
  }
  if (key == "f" || key == "F") { // bug
    let fs = fullscreen()
    fullscreen(!fs)
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
    this.co = [] // coordenadas
    for (let i = 0; i <= 50; i++) this.co[i] = createVector(0, 0);
    this.co[0] = createVector(_x, _y);
    this.ini = createVector(_x, _y)

    this.barra = 5 // donde arranca: 1 a 50 avanza; 51 a 60 no se imprime 
    this.barra_av = []

    let _b = _shuffle(barra_notas)
    for (let i = 0; i < _b.length; i++) {
      this.barra_av[i] = (_b[(i + _index) % _b.length] * 0.5) /// bug el 0.1
    }
    this.unisono;
    this.actualizar();
  }

  dibuja() {

    beginShape();
    const _tb = map(this.barra, 0, 50, 35, 15);
    let _limI = int(constrain(this.barra - _tb, 0, 50));
    let _limF = constrain(this.barra + 5, 0, 50);

    for (let i = _limI; i < _limF; i++) {
      if (this.index % 5 == 0) {
        if (abs(this.co[_limI].y - this.co[i].y) < 170) fill(col_pent[0], 90, col_pent[1], col_pent[2]) // 60, 0.08
        else noFill();
      }
      else if (this.index % 6 == 1) {
        if (abs(this.co[_limI].y - this.co[i].y) < 170) fill((col_pent[0] + 335) % 360, 90, col_pent[1], col_pent[2]) //35. 0.08
        else noFill()
      }
      else if (this.index % 39 == int(frameCount * 0.01) % 10) {
        if (abs(this.co[_limI].y - this.co[i].y) < 200) fill((col_pent[0] + 180) % 360, 100, 90, 0.1) // 120
        else noFill()
      }
      curveVertex(this.co[i].x, this.co[i].y)
      if (i == 0 || i == 49) curveVertex(this.co[i].x, this.co[i].y)
    }

    if (_limI < 5 && this.index % 5 == 4) {
      tint(0, 0.2);
      if (this.index < 30) image(cg_clave[int((this.index - 4) / 5)], this.co[1].x + 20, this.co[0].y - 10)
      else image(cg_clave[int((this.index - 4) / 5)], this.co[1].x + 20, this.co[0].y - 25)
    }
    endShape();

    //// barra --------
    if (this.index % 2 == 0) fill((col_pent[0] + 170) % 360, 100, 90, 0.2); else fill(0, 0.15);
    //const _ba = constrain(int(this.barra), 0, 50)
    if (this.barra < 49) {
      const _ve = p5.Vector.lerp(this.co[int(this.barra)], this.co[int(this.barra) + 1], this.barra % 1);
      rect(_ve.x - 3, _ve.y - 3, 6, 6);
    }
  }

  calcula_barra() {

    let _av = this.barra_av[frameCount % this.barra_av.length]
    this.barra += _av;
    if (this.barra > 59) {
      memo_cont = 0;
      if (hojas > 17) {
        hojas = 0;
        elije_solo();
      }
      seres[this.index].actualizar();
      hojas += 0.02;
      hojas = round(hojas, 2);
      //print("if " + hojas, hojas_memo + 1) // bug
      if (int(hojas) == hojas_memo + 1) {
        // cambio de hoja ---------------------------------------
        unis_destinoY = 164 + (int(randomM0() * 90) * 8);

        // print(int(hojas), solo) // bug
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
      this.barra -= 43 + 10
    }
  }

  actualizar() {

    let x_memo = this.ini.x;
    let y_memo = this.ini.y;
    this.unisono = unis[this.index][int(hojas)]

    for (let i = 0; i < 50; i++) {
      if (i > 0) this.co[i].x = this.co[i - 1].x + X_grilla[int(hojas)][(i + int(this.index * valorX_rango)) % X_grilla[int(hojas)].length] * 5;
      else if (unis_sent[hojas_memo % 2] == "fin") this.co[i].y = this.ini.y;

      let _si = constrain((sin(ser_cont * 0.01) * 0.3), 0, 1) // 0 a 0.3

      if (this.co[i].x == x_memo || memo_random() < _si) {
        // modifica el y
        if (unis_sent[hojas_memo % 2] == "fin" || !this.unisono) {
          if (i > 0) {
            let _yy = this.valorY()
            this.co[i].y = this.co[i - 1].y + _yy;
          }
        }
        else {
          if (unis_sent[hojas_memo % 2] == "ini" && i < 6) this.co[i].y = unis_destinoY;
          else if (i > 0) this.co[i].y = this.co[i - 1].y
        }
      } else {
        if ((unis_sent[hojas_memo % 2] == "fin" && this.unisono && i > 10) ||
          unis_sent[hojas_memo % 2] == "ini" && this.unisono && i < 40) { //> 10

          let _fi
          // direcciona el y hacia unisono
          if (unis_sent[hojas_memo % 2] == "fin") {
            this.co[i].y = y_memo; //orig
            _fi = createVector(this.co[i].x, unis_destinoY); //orig
          }
          else {
            this.co[i].y = this.ini.y // guarda en memoria
            _fi = createVector(this.co[i].x, unis_destinoY); // arma el vector a arrancar
          }

          //let _m = map(i, 0, 49, 0, 1)// 0, 1)//
          let _m = abs(sin(i * 0.033))//let _m = abs(sin(i * 0.03))
          if (unis_sent[hojas_memo % 2] == "ini") _m = map(_m, 0, 1, 1, 0)// solo para unisono comienzo


          let _ve = p5.Vector.lerp(this.co[i], _fi, _m);
          this.co[i].y = _ve.y
        } else {
          // mantiene el y
          this.co[i].y = y_memo;
        }
      }
      this.co[i].x = constrain(this.co[i].x, 100, width - 100);
      x_memo = this.co[i].x // new
      if (!this.unisono) y_memo = this.co[i].y // new

      // limites

      if (this.co[i].y > height - ser_lim) { this.co[i].y -= ser_lim * 3; } //240  ser_dist * _lim / 2
      else if (this.co[i].y < ser_lim) { this.co[i].y += height - ser_lim * 3; } //240
    }
    this.co[49].x = width - 100;
  }

  barraUbic() {

    return this.barra
  }

  nota() {

    const _ba = constrain(int(this.barra), 0, 50)
    let _x = this.co[_ba].x
    if (_x > 90 && _x < width - 90 && this.barra < 45) return [true, this.co[_ba].x, this.co[_ba].y, this.index];
    return [false, 0, 0]
  }

  valorY() {

    let _yy = [-4, -2, 2, 4]
    let _r = int(memo_random() * 4)
    ser_cont++;
    _yy[_r] *= 1 + (abs(sin(ser_cont * 0.005)) * valorY_rango)
    return _yy[_r]
  }
}

class Nota {

  constructor(_x, _y, _i) {
    this.x = _x;
    this.y = _y; if (randomM0() < 0.2) this.y -= 4;
    this.index = _i;
    let _v = map(_x, 0, width, 130, 70); // 190, 50 bug
    this.vida = _v;
    if (_x > width - 200) this.largo = 10;
    else this.largo = int(10 + int(randomM0() * notas_largo) * 10);

    let _al = [-1, -1, -1, -1, -1, 0, 1];
    this.alte = _al[int(randomM0() * _al.length)]
    this.graf = [];
    if (randomM0() < 0.3) this.grafico();
    if (curve_T > 0.5 && curve_T < 1.5) this.tipo = "rect";
    else if (curve_T > 2.5) this.tipo = "circle";
    else if (randomM0() < 0.5) this.tipo = "rect"; else this.tipo = "circle";
  }

  dibuja() {

    this.vida--;
    fill(0, 0.2);
    if (this.tipo == "rect") rect(this.x - 3, this.y - 3, 6, 6);
    else circle(this.x, this.y, 6);
    noFill(), stroke(0, 0.2), strokeWeight(2); //2
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
      point(this.graf[i].x, this.graf[i].y)
    }
    noStroke()
  }

  alteracion(_i) {

    let _w = this.x - 10;
    let _h = this.y;
    noFill(); strokeWeight(1);//1
    beginShape();

    if (_i == 0) { // #
      vertex(_w - 5, _h - 1);//  
      vertex(_w + 5, _h - 3);// 
      endShape(); beginShape();
      vertex(_w - 5, _h + 3);//  
      vertex(_w + 5, _h + 1);//
      endShape(); beginShape();
      vertex(_w - 2, _h - 6);//  
      vertex(_w - 2, _h + 6);
      endShape(); beginShape();
      vertex(_w + 2, _h - 6);
      vertex(_w + 2, _h + 6);

    } else if (_i == 1) { // b
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
    if (this.index < 25) _yy = -35; else _yy = 35
    let _w = this.x + 2;
    let _h = this.y + _yy;
    for (let i = 0; i < 6; i++) {
      this.graf[i] = createVector(_w + int(-5 + memo_random() * 5), _h + int(-5 + memo_random() * 5))
    }

  }

  final() {

    if (this.vida < 0) { return true }
    else { return false }
  }
}
