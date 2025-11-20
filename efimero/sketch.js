// cambiar los random por randomM0
// 
// 
let mi_seed;
let b_trigger = false
let seres = [];
let X_opciones = [[20, 10, 5, 0, 0, -10], [17, 8, 5, 0, 0, 0, 0, -5],
[15, 10, 5, 0, 0, 0, -5], [10, 5, 5, 5, 5, 0, -5]] //  [10, 5, 5, 5, 5, 0, -5];
let X_grilla = [];
let memo_cont = 0, memoR = [];
let ser_cont = 0
let barra_av = []
let barras_notas = [3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let cg_clave = []
let hojas = 1;
let hojas_r = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
let hojas_memo
let col_back;
let unis = [], unis_destinoY;
let unis_sent = ["ini", "fin"];

let curve_T; // 0 a 5
let col_pent = []; // color pentagramas
let valorY_rango; // 0.5 a 10
let valorX_rango; // 0.0 a 2.0

let notas = [];
let notas_largo;
let notas_gesto;

let b_pausa = false;

function setup() {

  let cv = createCanvas(1080, 1080);
  cv.parent("cv");
  cv.id("ttt");
  cv.class("ttt");
  pixelDensity(1);

  frameRate(30)
  colorMode(HSB);
  //noFill();
  imageMode(CENTER)

  mi_seed = Math.floor(9999999999 * random()); //220400118
  print("seed: " + mi_seed);
  randomSeed(mi_seed);
  noiseSeed(mi_seed);

  prepara_sketch()
print(resetAnimation)
  //resetAnimation = false; // bug
}

function prepara_sketch() {
print("prepara sketch")
print(m0, randomM0())
  clear();
  // random(0.035) * 100;
  curve_T = map(m0, 0, 1, 0, 3.5); // slider 0
  curveTightness(curve_T) // 0 a 4 (en negativo se pasa de largo)
  print("[0] curveTightnes [0-3.5] :" + curve_T)

  // image setting -------------------------------------
  col_back = 60 + randomM0() * 35// random(60, 95);
  background(col_back);
  notas_largo = random([1, 5, 5, 10, 10, 10]) // maxima duracion de notas
  notas_gesto = random(["asc", "desc", "random"]); print(notas_gesto)
  //m1 = random(0.2) * 10; print("[1] Independencia de las lineas melodicas [0-2]: " + valorX_rango)
  valorX_rango = m1; // slider 1
  //m2 = random([0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); print("[2] Movimientos verticales [0.5-10]: " + valorY_rango)
  valorY_rango = m2; // slider 2
  // tipos de barra
  let _r = random(), _bt = ""
  if (_r < 0.2) {
    _bt = "bastante juntos"
    let _b = 0;
    for (let i = 0; i < barras_notas.length; i++) {
      _b += barras_notas[i]
    }
    _b = _b / barras_notas.length
    barras_notas = [_b]

  } else if (_r < 0.8) {
    _bt = "basico"
  } else {
    _bt = "solapados" //independientes y solapados
    let _l = barras_notas.length
    for (let j = 0; j < 100; j++) {
      for (let i = 0; i < _l; i++) {
        barras_notas.push(barras_notas[i])
      }
    }
  }
  print("[3] barra: " + _bt)

  col_pent[0] = random(360)
  print("[4] Score fill color: " + col_pent[0]); // rango: sin color - color hug 360º - color negro
  if (col_pent[0] > 300) { col_pent[0] = map(col_pent[0], 300, 360, 0, 360), col_pent[1] = 0, col_pent[2] = 0.8 }
  else if (col_pent[0] < 5) { col_pent[0] = random(360), col_pent[1] = 0, col_pent[2] = 0 }
  else { col_pent[1] = 90, col_pent[2] = 0.08 }

  for (let i = 0; i < 1000; i++) {
    memoR[i] = random();
  }

  let _op = int(random(4))
  for (let h = 0; h < 20; h++) {
    X_grilla[h] = []; // 1 por cada hoja, 20 en total
    for (let i = 0; i < 50; i++) {
      X_grilla[h][i] = X_opciones[_op][i % X_opciones[_op].length];
    }
    X_grilla[h] = shuffle(X_grilla[h])
  }

  // unisonos
  for (let i = 0; i < 50; i++) {
    unis[i] = []
  }
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 20; j++) unis[i][j] = random([false, false, false, true])
    for (let k = 0; k < 4; k++) {
      if (i < 49) i++;
      for (let j = 0; j < 20; j++) unis[i][j] = unis[i - 1][j]
    }
  }

  unis_destinoY = height / 2
  if (random() < 0.9) for (let i = 0; i < 50; i++) { unis[i][4] = true; unis[i][4 + 7] = true; } // unisono total



  let _s = 0;
  for (let _y = 0; _y < 100; _y++) {
    memo_cont = 0//_s; bug // reset
    seres.push(new Ser(_s, 50, 180 + _y * 8)); // aca!
    if (_y % 5 == 4) _y += 5
    _s += 1;
  }

  for (let i = 0; i < 10; i++) {
    cg_clave[i] = createGraphics(100, 100);
    cg_clave[i].colorMode(HSB)
    cg_clave[i].curveTightness(curve_T)
    cg_clave[i].stroke(0);
    cg_clave[i].noFill()
    claves(i);
  }
}

function draw() {
  if (resetAnimation) { // no entiendo
    prepara_sketch();
    resetAnimation = false;
  }
  fill(col_back, 0.2); noStroke();
  rect(0, 0, width, height);

  for (let i = 0; i < seres.length; i++) {//
    stroke(0, 0.1); //0.3
    strokeWeight(1);
    noFill();
    seres[i].dibuja();
    seres[i].dibuja_barra();
  }

  if (frameCount % 2 == 0) {
    let _i;
    if (notas_gesto == "desc") _i = int(frameCount * 0.5) % 50;
    else if (notas_gesto == "asc") _i = 49 - int(frameCount * 0.5) % 50;
    else _i = int(memo_random() * 50)
    let _n = seres[_i].nota()
    if (_n[0]) notas.push(new Nota(_n[1], _n[2], _n[3]))
  }
  for (let i = 0; i < notas.length; i++) {
    notas[i].dibuja();
    if (notas[i].final()) { notas.splice(i, 1); }
  }

  /*noStroke() bug
  fill(0, 0.5)
  text(int(hojas), width / 2, 50)
  if (frameRate() < 21) print(int("frameRate: " + frameRate()))*/

  if (!b_trigger && int(hojas) == 2 && seres[0].barraUbic() > 40) {
    b_trigger = true;
    triggerPreview();
    grabaImagen();
  }
}

function memo_random() {

  /* memo_cont++;
   let _m = constrain((sin(memo_cont * 0.001) * 0.5) + 0.5, 0, 0.9999);
   if (memo_cont > hojas_r[int(hojas) % hojas_r.length]) memo_cont = 0;
   return 0.5//bug*/

  memo_cont++;
  //if (memo_cont > 100) memo_cont = 0;
  return memoR[memo_cont];
}


function claves(_i) {

  cg_clave[_i].clear()
  let _w = cg_clave[_i].width / 2;
  let _h = cg_clave[_i].height / 2;

  for (let i = 0; i < 2; i++) {
    if (_i < 6) { // clave de sol: G
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w - 5, _h); cg_clave[_i].curveVertex(_w - 5, _h)

      cg_clave[_i].curveVertex(_w + 5 + random(-2, 2), _h + random(-2, 2))
      cg_clave[_i].curveVertex(_w + 5 + random(-2, 2), _h + 10 + random(-2, 2))
      cg_clave[_i].curveVertex(_w - 10 + random(-2, 2), _h + 10 + random(-2, 2))
      cg_clave[_i].curveVertex(_w - 10 + random(-2, 2), _h - 10 + random(-2, 2))

      cg_clave[_i].curveVertex(_w + 10 + random(-2, 2), _h - 10 + random(-2, 2))

      cg_clave[_i].curveVertex(_w + 6 + random(-2, 2), _h - 27 + random(-2, 2))

      cg_clave[_i].curveVertex(_w + 2 + random(-2, 2), _h - 30 + random(-2, 2))
      cg_clave[_i].curveVertex(_w + random(-2, 2), _h - 3 + random(-2, 2))
      cg_clave[_i].curveVertex(_w - 4 + random(-2, 2), _h + 30 + random(-2, 2))

      cg_clave[_i].curveVertex(_w - 15, _h + 27); cg_clave[_i].curveVertex(_w - 15, _h + 27)
      cg_clave[_i].endShape();
    }
    else { // clave de fa : F
      cg_clave[_i].beginShape();
      cg_clave[_i].curveVertex(_w + 5, _h - 4); cg_clave[_i].curveVertex(_w + 5, _h - 4);

      cg_clave[_i].curveVertex(_w + 5 + random(-2, 2), _h + random(-2, 2));
      cg_clave[_i].curveVertex(_w - 5 + random(-2, 2), _h + random(-2, 2))
      cg_clave[_i].curveVertex(_w - 5 + random(-2, 2), _h - 10 + random(-2, 2))
      cg_clave[_i].curveVertex(_w + 10 + random(-2, 2), _h - 10 + random(-2, 2))
      cg_clave[_i].curveVertex(_w + 13 + random(-2, 2), _h + 8 + random(-2, 2))

      cg_clave[_i].curveVertex(_w, _h + 25); cg_clave[_i].curveVertex(_w, _h + 25)
      cg_clave[_i].endShape();

      cg_clave[_i].strokeWeight(2);
      cg_clave[_i].beginShape(POINTS);
      cg_clave[_i].vertex(_w + 18 + random(-1, 1), _h - 4 + random(-1, 1))
      cg_clave[_i].vertex(_w + 18 + random(-1, 1), _h + 3 + random(-1, 1))
      cg_clave[_i].endShape();
      cg_clave[_i].strokeWeight(1);
    }
  }
}

function grabaImagen() {

  console.log("saving!")
  saveCanvas("nnn" + mi_seed + ".png")
}

function keyReleased() {

  if (key == "s" || key == "S") {
    grabaImagen()
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen()
    fullscreen(!fs)
  }
  if (key == "p" || key == "P") {
    b_pausa = !b_pausa;
    if (!b_pausa) {
      loop();
    } else {
      noLoop();
    }
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

    let _b = shuffle(barras_notas)
    for (let i = 0; i < _b.length; i++) {
      this.barra_av[i] = (_b[(i + _index) % _b.length] * 0.5) /// bug el 0.1
    }

    this.unisono;
    this.actualizar();
  }

  dibuja() {

    beginShape();
    let _limI = int(constrain(this.barra - 25, 0, 50)) //barra - 25
    let _limF = constrain(this.barra + 10, 0, 50)

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
  }

  dibuja_barra() {

    let _av = this.barra_av[frameCount % this.barra_av.length]
    if (this.index % 2 == 0) fill((col_pent[0] + 170) % 360, 100, 90, 0.2); else fill(0, 0.15);
    //const _ba = constrain(int(this.barra), 0, 50)
    if (this.barra < 49) {
      const _ve = p5.Vector.lerp(this.co[int(this.barra)], this.co[int(this.barra) + 1], this.barra % 1);
      rect(_ve.x - 3, _ve.y - 3, 6, 6);
    }

    this.barra += _av //0.25// * (2 + cos(barra_cont++ * 0.001));
    if (this.barra > 59) {
      if (hojas > hojas_r.length - 1) {
        print("reset");
        hojas = 0; memo_cont = 0;
      }
      else { memo_cont = 0 }// int(hojas) * 2 + this.index * 2 }

      seres[this.index].actualizar();
      hojas += 0.02 // es lo mismo que 1 / 50

      if (int(hojas) == hojas_memo + 1) {
        // cambio de hoja ---------------------------------------
        unis_destinoY = 180 + (int(random(90)) * 8)// 90 para 1080
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
      // let _c = int(constrain(map(hojas, 0, 4, 0, 30), 4, 30)) //5, 50  pocos random a muchos random
      if (i > 0) this.co[i].x = this.co[i - 1].x + X_grilla[int(hojas)][(i + int(this.index * valorX_rango)) % X_grilla[int(hojas)].length] * 5 // [(i + this.index * int(hojas)) % _c] * 5  // new
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
          let _m = abs(sin(i * 0.03))//let _m = abs(sin(i * 0.0075))// % 1.58)//
          if (unis_sent[hojas_memo % 2] == "ini") _m = map(_m, 0, 1, 1, 0)// solo para unisono comienzo


          let _ve = p5.Vector.lerp(this.co[i], _fi, _m);
          this.co[i].y = _ve.y
        } else {
          // mantiene el y
          this.co[i].y = y_memo;
        }
      }
      this.co[i].x = constrain(this.co[i].x, 50, width - 50);
      x_memo = this.co[i].x // new
      if (!this.unisono) y_memo = this.co[i].y // new

      // limites
      if (this.co[i].y > height - 80) this.co[i].y -= height - 240;
      else if (this.co[i].y < 80) this.co[i].y += height - 240;
    }
    this.co[49].x = width - 50;
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

    let _yy = [-4, -2, 2, 4]// [-16,-12,-8,8,12,16]
    let _r = int(memo_random() * 4)//let _r = int(memo_random() * 16)
    ser_cont++;

    _yy[_r] *= 1 + (abs(sin(ser_cont * 0.005)) * valorY_rango)
    //print(_yy[_r])
    return _yy[_r]//random([2, 1, 0.5, -1, -2])
  }
}

class Nota {

  constructor(_x, _y, _i) {
    this.x = _x;
    this.y = _y; if (random() < 0.2) this.y -= 4
    this.index = _i;
    let _v = map(_x, 0, width, 190, 50)
    this.vida = _v;
    this.largo = int(10 + int(random() * notas_largo) * 10)
    this.alte = random([-1, -1, -1, -1, -1, 0, 1])
    this.graf = []
    if (random() < 0.3) this.grafico();
  }

  dibuja() {

    this.vida--;
    fill(0, 0.5);
    circle(this.x, this.y, 5);
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
