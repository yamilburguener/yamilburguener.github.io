/*
----- Coding Tutorial by Patt Vira ----- 
Name: Differential Line Growth //Crecimiento de línea diferencial
Video Tutorial: https://youtu.be/1viK2qKuP-Y

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
//Quadtree  #DifferentialGrowth
https://en.wikipedia.org/wiki/Quadtree

Quadtree and Differential Growth by Daniel Shiffman & Patt Vira


https://tonejs.github.io/docs/15.1.3/modules.html
*/
let bFrame = false // bug
let seccion = "cargando";
let mi_seed;
let b_preview = true, b_clic = false;
let nodos = [];
let nodos_forma, n_ubicX = [], n_ubicY = []
let nodos_esp = []; // "big o small";
let n_num, n_numP = [];

//let insertDistance = 10; // 5 (lo deje en 10)
let separacion = 10 * 4// insertDistance * 4; // separationDistance: mas grande menos atraccion // * 2
let margin, marginB;
//let maxPoints = 1000;
//let nodos_total = 80, 
let nodos_n = 0

let quadtree;
let boundary;
let capacity = 10; // 10, cantidad de puntos por rectangulo. a menor numero subdivide más los cuadrados (mas proceso)

let nodos_color = []

let pg_fondo, pg_clic, pg_titulo;
let titInicio;
let col_tipo = "", col_back = [], col_line = []
let vel_fC;  // velocidad del frameCount 


let pg_pers, col_pers = []
let personas = [], pers_vivo = [], pers_cant = 0
//let pers_memo = [], pers_cont = 0, pers_azar = []//{x = 0, y = 0, cont = 0}
//let _ctx, cv
let esc_cant = 0, esc_tam = 70 // escalones

let soundR = [], sound_cont = 0
let b_play = true, b_sound = false
let secu = // notas del acorde
  [[27 + 12, 35, 43, 50], [24 + 12, 39, 43, 45], [22 + 12, 36, 45, 53], [24 + 12, 40, 47, 48], // primeros
  [36, 38, 40, 41], [37, 38, 40, 41], [36, 37, 40, 42], // cerrados
  [24, 38, 40, 45], [28, 36, 44, 47], [24, 38, 39, 47], [26, 41, 45, 49], [24, 40, 42, 45], [28, 42, 43, 50], [25, 41, 43, 48]]
let secu_n = 0, n_cont = 0;
let acorde = [[""], [""], [""], [""]];
let n_line = [[[0], [0], [0], [0]], [[0], [0], [0], [0]],
[[0], [0], [0], [0]], [[0], [0], [0], [0]]] //[[0], [0], [0], [0]]
let n_vol = [[[0], [0], [0], [0]], [[0], [0], [0], [0]],
[[0], [0], [0], [0]], [[0], [0], [0], [0]]] //[[0], [0], [0], [0]]
//let voz = [0,0]
//let b_desaf = true
let sampler = [], sampler_loaded = []//, sampler_tipo; // si suena el 0 e el 1
let sampler_fade = [[0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1]]
let sampler_fN = -1, sampler_fDir = 1
let vol_final
let BPM = 100, BPM_rall;
let intervalo_n0, intervalo_n1, intervalo_n2, intervalo_n3
let b_newTempo = false

function preload() {
  const channel = new Tone.Channel({ volume: 0, channelCount: 2 })
  //const reverb = new Tone.JCReverb({ roomSize: 1, wet: 1 })
  const reverb = new Tone.Reverb({ decay: 2, preDecay: 2, wet: 0.99 }) // decay: 2, wet: 1

  sampler[0] = new Tone.Sampler({
    C0: 'piano_c1-p.mp3', C1: 'piano_c2-p.mp3', C2: 'piano_c3-p.mp3',
    C3: 'piano_c4-p.mp3', C4: 'piano_c5-p.mp3', C5: 'piano_c6-p.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[2] = true; }
  })
  sampler[0].chain(channel)

  sampler[1] = new Tone.Sampler({
    //C1: 'piano_c1-p.mp3',C2: 'piano_c2-p.mp3', C3: 'piano_c3-p.mp3',
    //C4: 'piano_c4-p.mp3',C5: 'piano_c5-p.mp3',C6: 'piano_c6-p.mp3'

    //C1: 'piano_c1-p.mp3',//C2: 'piano_c2-p.mp3',
    // G2: 'violin_G2.mp3',C3: 'violin_C3.mp3', G3: 'violin_G3.mp3', G4: 'violin_G4.mp3',G5: 'violin_G5.mp3',

    C0: 'piano_c1-p.mp3',//C2: 'piano_c2-p.mp3',
    G1: 'violin_G2.mp3', C2: 'violin_C3.mp3', G2: 'violin_G3.mp3', G3: 'violin_G4.mp3', G4: 'violin_G5.mp3',
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[0] = true; }
  })
  sampler[1].chain(channel)

  sampler[2] = new Tone.Sampler({
    'A#1': 'vozFade_Bb1.mp3', A2: 'vozFade_A2.mp3', G3: 'voz_G3.mp3', C4: 'piano_c4-p.mp3', C5: 'piano_c5-p.mp3', C6: 'piano_c6-p.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[1] = true; }
  })
  sampler[2].chain(channel)

  vol_final = new Tone.Gain(1.3);//new Tone.Volume(2)
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  })
  const limiter = new Tone.Limiter(-0.5);

  channel.chain(reverb, comp, vol_final, limiter, Tone.Destination)
 // vol_final.mute = true;
}


function setup() {
  //const cv = createCanvas(2160, 2160)
  let cv = createCanvas(2160, 2160);
  cv.parent("cv");
  cv.id("nnn");
  cv.class("nnn");

  cv.drawingContext.getContextAttributes().willReadFrequently = true; // por la advertencia de Canvas2D ¿?
  //cv.drawingContext.willReadFrequently = true;
  //cv.elt.getContext('2d', { willReadFrequently: true });
  pixelDensity(1);
  colorMode(HSB);

  mi_seed = Math.floor(9999999999 * $fx.rand());
  randomSeed(mi_seed);
  noiseSeed(mi_seed);

  // loop setting --------------------
  for (let i = 0; i < 1000; i++) {
    soundR[i] = random()
  }

  // visual config -----------------------------
  if (random() < 0.6) { col_tipo = "light", col_back = [3, 85], col_line = [10, 90, 99], col_pers = [20] }
  else { col_tipo = "dark", col_back = [5, 20], col_line = [80, 20, 66], col_pers = [230] }

  nodos_forma = random(["sculpture", "tree", "labyrinth", "loneliness", "cells-group", "ghost-house"])// ghost = caras

  if (nodos_forma != "ghost-house") n_num = [40, 50, 10];
  else n_num = [14, 14, 19, 25]//[50, 35, 12]//[25, 19, 10]//[50, 35, 10]// [40, 50, 10] bug! ....  [14, 14, 19, 25]  para ghost

  let _r = random();
  if (_r < 0.3) { espacio_config("small", 0) }
  else if (_r < 0.8) { espacio_config("big", 7) }
  else { espacio_config("vague", -1) } // vago


  if (nodos_forma == "loneliness") {
    if (random() < 0.3) { // izq-der
      n_ubicX[0] = random([width * 0.25, width * 0.75]), n_ubicX[1] = n_ubicX[0]
      if (n_ubicX[0] == width * 0.25) n_ubicX[2] = width * 0.75; else n_ubicX[2] = width * 0.25
      n_ubicY = [height * 0.25, height * 0.75, height * 0.5]
    } else { // up-down
      n_ubicY[0] = random([height * 0.25, height * 0.75]), n_ubicY[1] = n_ubicY[0]
      if (n_ubicY[0] == width * 0.25) n_ubicY[2] = width * 0.75; else n_ubicY[2] = width * 0.25
      n_ubicX = [width * 0.25, width * 0.75, width * 0.5]
    }
  } else if (nodos_forma == "ghost-house") {
    let _s = [0, 1, 2, 3, 4, 5]; _s = shuffle(_s)
    for (let i = 0; i < 6; i++) {
      const _uX = (2.5 + _s[i]) * width * 0.1;
      const _uY = random(height * 0.25, height * 0.75);
      for (let j = 0; j < 4; j++) {
        if (j == 0) { // ojo izq
          n_ubicX[i * 4 + j] = _uX - 100; n_ubicY[i * 4 + j] = _uY - 100;
        } else if (j == 1) { // ojo der
          n_ubicX[i * 4 + j] = _uX + 100; n_ubicY[i * 4 + j] = _uY - 100;
        } else if (j == 2) { // boca
          n_ubicX[i * 4 + j] = _uX; n_ubicY[i * 4 + j] = _uY + 150;
        } else if (j == 3) { // cara
          n_ubicX[i * 4 + j] = _uX; n_ubicY[i * 4 + j] = _uY;
        }
      }
    }
    n_ubicX[24] = width / 2; n_ubicY[24] = height / 2
  }


  if (random() < 0.65) nodos_color[0] = random(20, 75); else nodos_color[0] = random(160, 200)
  nodos_color[1] = (nodos_color[0] + 120) % 360, nodos_color[2] = (nodos_color[0] + 240) % 360

  for (let i = 0; i < 25; i++) {
    if (i < 4 || i > 23) pers_vivo[i] = false; //(i < 4 || i > 20)
    else if (random() < 0.6) { pers_vivo[i] = true; pers_cant++ } else { pers_vivo[i] = false } // '.5
  }
  vel_fC = random([70,90,110,122,122,122,122])
  
print("velocidad: "+vel_fC)
  // ---------------------------
  boundary = new Rect(width / 2, height / 2, width / 2, height / 2);
  quadtree = new QuadTree(boundary, capacity);
  for (let i = 0; i <= 2; i++) {
    nodos[i] = [];
    ordena(i);
    nodos_n = i
  }

  pg_pers = createGraphics(width, height)
  pg_pers.noStroke();
  // ---------------------------
  arma_fondo()
  /* pg_fondo.drawingContext.shadowOffsetX = random([-3, -2, 2, 3])
   pg_fondo.drawingContext.shadowOffsetY = random([-3, -2, 2, 3])
   if (col_tipo == "dark") pg_fondo.drawingContext.shadowColor = color("#eeeeee22")
   else pg_fondo.drawingContext.shadowColor = color("#22222233")*/
  arma_pg_clic()


  // music config -------------------------------
  if (col_tipo == "light") sampler[1].volume.value = -6; //bug
  else sampler[1].volume.value = -12;

  secu = shuffle(secu)
  let _tr = random([0, 1, 2, "no"]) // transpone un acorde
  if (_tr != "no") {
    for (let i = 0; i < 4; i++) {
      secu[_tr][i]++
    }
  }

  let _t = random([-2, -1, 0, 1, 2]) // tono
  if (col_tipo == "light") _t += 12; else _t += 5;// bug
  for (let n = 0; n < secu.length; n++) {
    for (let i = 0; i < 4; i++) { secu[n][i] = secu[n][i] + _t; }
  }
  print("tono:" + _t, "transpone acorde:" + _tr + "º") // bug

  // arma glissandos
  for (let a = 0; a < 4; a++) { // lo que era secu_n -> los acordes
    for (let n = 0; n < 4; n++) {
      glissando(a, n, secu[a][n], secu[a + 1][n]) // acorde, voz del acorde, notas del acorde, y notas deo a siguiente
    }
  }
  // arma string de acordes
  for (let a = 0; a < 4; a++) {
    for (let n = 0; n < 4; n++) {
      const nota = Tone.Frequency(secu[a][n], "midi").toNote();
      acorde[a][n] = nota;
    }
  }
  BPM_rall = map(vel_fC,70,122,0.13,0.1);

  pg_titulo = createGraphics(width, height)
  pg_titulo.colorMode(HSB), pg_titulo.textAlign(CENTER)
  const _fu = loadFont('./assets/Ubuntu-Regular.ttf')
  pg_titulo.textFont(_fu) 
  titInicio = millis() + 9999;

  frameRate(30);

  // fxhash features ---------------------
  const _nD = int(int(nodos_color[0]) * 0.1) * 10;
  $fx.features({
    "model": nodos_esp[0] + " " + nodos_forma,
    "background": col_tipo,
    "main color hue": _nD + "s°",
    "labyrinth people": pers_cant
  })

  console.log("nnnnn. Yamil Burguener. 2025")
  console.log("seed number: " + mi_seed)
  console.log(JSON.stringify($fx.getFeatures()))
}

function draw() {

  if (bFrame) { // bug provisorio
    pg_fondo.textSize(30)
    pg_fondo.fill(255)
    pg_fondo.rect(100, 100, 250, 100)
    pg_fondo.fill(0)
    pg_fondo.text(int(frameRate()), 200, 150)
  }

  image(pg_fondo, 0, 0);

  if (seccion == "cargando") {
    muestra_titulo()
  }
  if (seccion == "jugando") {

    // personas ----------------------------------
    for (let i = 0; i < personas.length; i++) {
      personas[i].update()
      //if (b_newTempo) personas[i].frena()
      //if (cajas[i].final()) { cajas.splice(i, 1) }
    }
    image(pg_pers, 0, 0)

    quadtree.clearQuadtree();
    for (let n = 0; n < nodos_n; n++) {
      for (let i = 0; i < nodos[n].length; i++) {
        let p = new Point(
          nodos[n][i].position.x,
          nodos[n][i].position.y,
          nodos[n][i]
        );
        quadtree.insert(p);
      }
    }

    /* for (let n = 0; n < nodos_n; n++) {
       for (let i = 0; i < nodos[n].length; i++) {
         let n1 = nodos[n][i].position;
         //for (let ii = 0; ii < nodos[n].length; ii++) {
           let n2 = nodos[n][(i + 1) % nodos[n].length].position;
          // if (i != ii) {
          //   n2 = nodos[n][(ii + 1) % nodos[n].length].position;
   
             //let miC = 100 * cos(frameCount * 0.05) + 1
             //   stroke(miC)
             line(n1.x, n1.y, n2.x, n2.y);
             //ii += 5;
          // }
         //}
       }
     }*/

    for (let n = 0; n < nodos_n; n++) {
      if (random() < 0.95) {
        pg_fondo.stroke(col_line[0], 0.1)//; fill(10, 0.1)
      } else {
        pg_fondo.stroke(10, 99, 99, 0.1)
      }

      if (random() < 0.95) { // 0.95
        pg_fondo.noFill()
      } else {
        if (random() < nodos_color[3]) { pg_fondo.fill(col_line[1], 0.15) } //bug blanco < 0.6 normal < 0.95 small ..... col_line[1], 0.05
        else {
          if ((frameCount > 3500 && random() < 0.85) || random() < 0.5) {
            pg_fondo.fill(nodos_color[0], 99, col_line[2], 0.02) // , 0.05
          }//nodos_n >= 20 || 0.8 -> 99, 99, 0.05
          else {
            const _r = random([nodos_color[1], nodos_color[2]])//[(nodos_color + 120) % 360, (nodos_color + 240) % 360])
            pg_fondo.fill(_r, 99, col_line[2], 0.03) //99, 99, 0.05
          }
        }
      }

      pg_fondo.beginShape();
      for (let i = 0; i < nodos[n].length; i++) {
        //if (i == int(nodos[n].length/2)) {noStroke()}

        const n1 = nodos[n][i].position;

        pg_fondo.curveVertex(n1.x, n1.y);
      }
      pg_fondo.endShape();
    }
    for (let n = 0; n < nodos_n; n++) {
      for (let i = 0; i < nodos[n].length; i++) {
        let range = new Circle(
          nodos[n][i].position.x,
          nodos[n][i].position.y,
          separacion
        );
        let neighbors = [];
        quadtree.query(range, neighbors); //consulta

        nodos[n][i].update(nodos[n], neighbors);
        //nodos[n][i].display();

        // escalones ----------------------
        if (frameCount % 2 == 0) {

          for (let nn = 0; nn < nodos_n; nn++) {
            if (n != nn) {
              let _d = dist(nodos[n][i].position.x, nodos[n][i].position.y,
                nodos[nn][i % nodos[nn].length].position.x, nodos[nn][i % nodos[nn].length].position.y)
              if (_d < esc_tam) { // 70 a 120 segun separacion
                pg_fondo.line(nodos[n][i].position.x, nodos[n][i].position.y,
                  nodos[nn][i % nodos[nn].length].position.x, nodos[nn][i % nodos[nn].length].position.y)
                ////esc_cant++;
              }
            }
          }

        }
      }
    }
    ////if (frameCount % 2 == 0) {  print(esc_cant, esc_tam) ; esc_cant = 0;}

    /* if (nodos.length < maxPoints) {
      //insert();
    } else {
      //noLoop();
      print("Max Points Reached");
    }*/

    // partitura -----------------------------------
    if (frameCount % vel_fC == 0) {// % 70 a 122 .... ver si cambiamos a 30......
      if (nodos_n < 25) {
        if (nodos_n == 2) Rep_nota1(14400 / BPM)
        else if (nodos_n == 3) Rep_nota3(13000 / BPM)
        else if (nodos_n == 4) Rep_nota0(15000 / BPM)

        if (nodos_n < 24 || frameCount > 3500) { //> 3500
          nodos_n++
          nodos[nodos_n] = [];
          ordena(nodos_n);
        }

        //separacion = map(frameCount % 1550, 0, 1550, 30, 90) // 30, 100
        //if (sampler_fN < 4) separacion *= 0.6 // bug small *= 0.5 

        if (sampler_fN < 4) separacion = map(frameCount % 1098, 0, 1098, 54, 22) // small
        else separacion = map(frameCount % 1550, 0, 1550, 30, 90) // 30, 100 big

        print("nodos: " + nodos_n + " " + separacion) //bug! entra demasiadas veces cuando vel_fC es menor a 122  
      }
      else {
        separacion += random(-10, 10)
        separacion = constrain(separacion, 30, 90 * nodos_esp[1]) // bug *0.6 para small 
        nodos[nodos_n] = [];
        ordena(nodos_n);
      }
      esc_tam = constrain(map(separacion, 30, 80, 70, 100), 70, 100); // 70, 120

      if (nodos_esp[0] == "vague" && nodos_n % 4 == 0) {
        espacio_config("vague", -1);
      }
    }
    // rall final -------------------
    if (nodos_n == 25 && frameCount > 4200) {//secu_n == 3 && n_cont ==  189){//  b_newTempo) { 
      BPM -= BPM_rall //0.1 ... 0.13 
      b_clic = false;
      if (BPM <= 40) fin_todo()
    }
  }
  // personas viejo

  if (!b_sound && b_clic && (millis() % 3000) > 1500) image(pg_clic, 0, 0)

}

/*function insert() {
  for (let i = 0; i < nodos.length; i++) {
    let n1 = nodos[i].position;
    let n2 = nodos[(i + 1) % nodos.length].position;
    let diff = p5.Vector.sub(n2, n1);

    if (diff.mag() > insertDistance) {
      diff.mult(0.5);
      let insertIndex = (i + 1) % nodos.length;
      nodos.splice(insertIndex, 0, new Node(n1.x + diff.x, n1.y + diff.y));
      //break;
    }
  }p
}*/

function ordena(_n) {

  let _max, _ubicX, _ubicY, _tam_ra;
  if (nodos_forma == "sculpture") {
    _max = constrain(map(_n, 0, 10, 3, 7), 3, 7)// mayor es mas organico - de 3 a 7
    _ubicX = width * 0.5
    _ubicY = map(_n % 26, 0, 25, height * 0.8, height * 0.2)
    _tam_ra = map(_ubicY, height * 0.8, height * 0.2, 120, 55) // tamaño inicial elipse 55
    margin = 30, marginB = 200
  }
  else if (nodos_forma == "tree") {
    _max = constrain(map(_n, 4, 18, 8, 3), 3, 8)
    if (_n < 17) { _ubicX = width * 0.5 + random(-180, 180); _ubicY = height * 0.35 }
    else { _ubicX = width * 0.5; _ubicY = map(_n, 17, 24, height * 0.55, height * 0.85) }
    _tam_ra = 70
    margin = 30
    if (_n < 17) marginB = 1000; else marginB = 150
  } if (nodos_forma == "labyrinth") {
    _max = constrain(map(_n, 0, 10, 3, 7), 3, 7)// mayor es mas organico - de 3 a 7
    _ubicX = random(width * 0.48, width * 0.52); _ubicY = random(height * 0.48, height * 0.52)
    _tam_ra = map(_n, 0, 24, 70, 900); //120
    margin = 30, marginB = margin
  }
  else if (nodos_forma == "loneliness") {
    _max = constrain(map(_n, 0, 10, 3, 7), 3, 7)// mayor es mas organico - de 3 a 7
    if (_n < 23) {
      _ubicX = random([n_ubicX[0], n_ubicX[1]]) // 0.75 y 0.75
      _ubicY = random([n_ubicY[0], n_ubicY[1]])
    } else {
      _ubicX = n_ubicX[2], _ubicY = n_ubicY[2]
    }
    _tam_ra = map(_n, 0, 24, 1400, 100);
    margin = 110, marginB = 110
  }
  else if (nodos_forma == "cells-group") {
    _max = random([3, 8])
    if (nodos_esp[0] == "big") {
      //_max = constrain(map(_n, 0, 15, 8, 3), 3, 8)// mayor es mas organico - de 3 a 7
      _ubicX = int(random(1, 5)) * width * 0.2;
      _ubicY = int(random(1, 5)) * height * 0.2;
      _tam_ra = 500;
    } else {
      _ubicX = width * 0.35 + int(random(0, 7)) * (width * 0.05);
      _ubicY = height * 0.35 + int(random(0, 7)) * (height * 0.05);
      _tam_ra = map(_n, 0, 25, 20, 60);
    }
    margin = 150, marginB = 150
  }
  else if (nodos_forma == "ghost-house") {
    _max = constrain(map(_n, 0, 20, 7, 3), 3, 7)// mayor es mas organico - de 3 a 7
    _ubicX = n_ubicX[_n]; _ubicY = n_ubicY[_n];
    if (_n % 4 == 3) _tam_ra = 380; else if (_n % 4 == 2) _tam_ra = 200; else _tam_ra = 90;
    if (nodos_esp[1] == 1) { margin = 330, marginB = 330 } else { margin = 730, marginB = 730 } // solucion practica
  }

  if (_n == 25) { _max = random(1, 10); print(_max); }// random(-2, 2); _max = constrain(_max, 3, 7); print("final " + _max) }
  //const _tam_ra = 100// map(_ubicY, height * 0.8, height * 0.2, 120, 55) // tamaño inicial elipse 55
  const _ini = random(PI)
  //let _nu
  if (nodos_forma == "ghost-house") n_numP[_n] = n_num[_n % 4]; else n_numP[_n] = random(n_num);
  /* if (_n < 9) _nu = 50// map(_n, 0, 17, 50, 30) //10
  else if (_n < 17) _nu = 35
  else _nu = 10// map(_n, 17, 24, 20, 10) //40 */
  let _m = constrain (map(_tam_ra, 20, 1400, 0.04, 0),0,0.04); 

  for (let i = 0; i < n_numP[_n]; i++) { // 10, 40 o 50
    let angle = _ini + (TWO_PI / n_numP[_n]) * i * random(1 - _m, 1 + _m); //random(0.95, 1.05);
    let x = _ubicX + _tam_ra * cos(angle); //random(width)//
    let y = _ubicY + _tam_ra * sin(angle); //random(height)//
    //r *= 1.01
    nodos[_n][i] = new Nodo(x, y, _max);
  }

  /* quadtree.clearQuadtree();
 for (let n = 0; n < nodos_n; n++) {
   for (let i = 0; i < nodos[n].length; i++) {
     let p = new Point(
       nodos[n][i].position.x,
       nodos[n][i].position.y,
       nodos[n][i]
     );
     quadtree.insert(p);
   }
 }  */

  if (pers_vivo[_n - 1]) {
    const _nu = n_numP[_n - 1]
    const _v1 = createVector(nodos[_n - 1][0].position.x, nodos[_n - 1][0].position.y)
    const _v2 = createVector(nodos[_n - 1][int(_nu / 2)].position.x, nodos[_n - 1][int(_nu / 2)].position.y)
    /*print(_v1.x, _v1.y, _v2.x, _v2.y)
    pg_pers.fill(255, 220, 220)
    pg_pers.circle(_v1.x, _v1.y, 10)
    pg_pers.fill(55, 120, 120)
    pg_pers.circle(_v2.x, _v2.y, 10)*/
    const _medio = p5.Vector.lerp(_v1, _v2, 0.5);
    /*pg_pers.fill(255, 0, 0)
    pg_pers.circle(_medio.x, _medio.y, 10)*/
    personas.push(new Persona(_medio.x, _medio.y))//(_ubicX, _ubicY))
  }
}

// music -----------------------------------------------
function Rep_nota0(_r) { //sampler
  intervalo_n0 = setInterval(() => {
    if (b_play) {
      const _voz = n_line[secu_n][0][n_cont]
      const _v = n_vol[secu_n][0][n_cont]
      const _t = "+" + str(0.5 * cos(frameCount * 0.08) + 0.5) // fade para espacios
      sampler_fN += sampler_fDir; sampler_fN = constrain(sampler_fN, 0, 7)
      sampler[sampler_fade[0][sampler_fN]].triggerAttackRelease(_voz, 1, _t, _v);// suena_nota(_voz)
      if (sampler_fN == 7 && n_cont % 3 == 1) sampler[2].triggerAttackRelease(_voz, 1, _t, _v);
      if (n_cont < 189) { n_cont++ }//199
      else {
        //print("llega a 199: ")
        if (secu_n < 3) { // el ultimo acorde no debe entar  secu.length - 2
          secu_n++, n_cont = 0//, b_desaf = true
          print("/// acorde: " + acorde[secu_n])
          //// print("--- Acorde: " + secu_n, notas_c[secu[secu_n][0]], notas_c[secu[secu_n][1]], notas_c[secu[secu_n][2]], notas_c[secu[secu_n][3]])
        }
        else if (nodos_n >= 25) { // rall final -------------------
          b_newTempo = true;
          clearInterval(intervalo_n0)
          Rep_nota0(15000 / BPM)
        }
      }
    }
  }, _r)
}

function Rep_nota1(_r) { //sampler

  intervalo_n1 = setInterval(() => {
    if (b_play) {
      const _voz = n_line[secu_n][1][n_cont]
      const _v = n_vol[secu_n][1][n_cont]
      const _t = "+" + str(0.5 * cos(frameCount * 0.065) + 0.5)
      sampler[sampler_fade[1][sampler_fN]].triggerAttackRelease(_voz, 1, _t, _v);// suena_nota(_voz)
      if (sampler_fN == 7 && n_cont % 3 == 1) sampler[2].triggerAttackRelease(_voz, 1, _t, _v);//sampler.triggerAttack(_voz, Tone.now(), 1);//  suena_nota(_voz)
      if (b_newTempo) {
        clearInterval(intervalo_n1)
        Rep_nota1(14400 / BPM)
      }
    }
  }, _r)
}

function Rep_nota2(_r) { //sampler
  intervalo_n2 = setInterval(() => {
    if (b_play) {
      const _voz = n_line[secu_n][2][n_cont]
      const _v = n_vol[secu_n][2][n_cont]
      const _t = "+" + str(0.5 * cos(frameCount * 0.045) + 0.5)
      sampler[sampler_fade[2][sampler_fN]].triggerAttackRelease(_voz, 1, _t, _v);// suena_nota(_voz)
      if (sampler_fN == 7 && n_cont % 3 == 2) sampler[2].triggerAttackRelease(_voz, 1, _t, _v);//sampler.triggerAttack(_voz, Tone.now(), 1);//  suena_nota(_voz)
      if (b_newTempo) {
        clearInterval(intervalo_n2)
        Rep_nota2(13750 / BPM)
      }
    }
  }, _r)
}

function Rep_nota3(_r) { //sampler
  intervalo_n3 = setInterval(() => {
    if (b_play) {
      const _voz = n_line[secu_n][3][n_cont]
      const _v = n_vol[secu_n][3][n_cont]
      const _t = "+" + str(0.5 * cos(frameCount * 0.03) + 0.5)
      sampler[sampler_fade[3][sampler_fN]].triggerAttackRelease(_voz, 1, Tone.now(), _v);// suena_nota(_voz)
      if (sampler_fN == 7 && n_cont % 3 == 0) sampler[2].triggerAttackRelease(_voz, 1, _t, _v);// sampler.triggerAttack(_voz, Tone.now(), 1);//  suena_nota(_voz)
      if (b_newTempo) {
        clearInterval(intervalo_n3)
        Rep_nota3(13000 / BPM)
      }
    }
  }, _r)
}

function glissando(_a, _n, _nA1, _nA2) { // nota afinada

  const _hertz1 = Tone.Frequency(_nA1, "midi").toFrequency()
  const _hertz2 = Tone.Frequency(_nA2, "midi").toFrequency()
  const _desde = 20 + int(sound_random() * 50) //int(random(20, 70)) // 60
  const _hasta = 120 + int(sound_random() * 50)//int(random(120, 170)) // 140
  let _m
  let b_griss = true
  if (abs(_nA1 - _nA2) > 5) b_griss = false // 4
  for (let i = 0; i < 190; i++) { //200
    let _v = 1
    if (b_griss) {
      if (i > _hasta) _m = _hertz2 + sound_random() * 4 - 2
      else if (i > _desde) _m = map(i, _desde, _hasta, _hertz1, _hertz2)// 0, _dif)
      else _m = _hertz1 + sound_random() * 4 - 2 //0
    } else {
      if (i < 95) { _m = _hertz1 + sound_random() * 4 - 2; _v = constrain(map(i, 50, 94, 1, 0), 0, 1) } //90
      else { _m = _hertz2 + sound_random() * 4 - 2; _v = constrain(map(i, 95, 155, 0, 1), 0, 1) }
    }
    n_line[_a][_n][i] = _m//_hertz1 + _m
    n_vol[_a][_n][i] = _v
  }
  //b_desaf = false
}

function fin_todo() {

  if (b_preview) {
    grabaImagen()
    $fx.preview()
    b_preview = false
  }

  clearInterval(intervalo_n0), clearInterval(intervalo_n1), clearInterval(intervalo_n2), clearInterval(intervalo_n3)
  noLoop()
}

function muestra_titulo() {
  pg_titulo.clear()
  pg_titulo.textSize(73)
  pg_titulo.fill(100, 0.7), pg_titulo.stroke(20, 0.6), pg_titulo.strokeWeight(5)
  pg_titulo.text("nnnnnnnnnnnnnnnn", pg_titulo.width / 2, pg_titulo.height - 240)
  pg_titulo.textSize(37)
  pg_titulo.fill(100, 0.7), pg_titulo.stroke(20, 0.6), pg_titulo.strokeWeight(5)
  const _t = int((titInicio - millis()) * 0.001);
  pg_titulo.text("CLICK TO START\nor wait (" + _t + ") seconds", pg_titulo.width / 2, pg_titulo.height - 155)
  if (_t <= 0) {
    hacia_jugando() //seccion = "jugando"
  }
  else image(pg_titulo, 0, 0)
}

function espacio_config(_e, _fN) {
  if (_e == "vague") {
    nodos_esp[0] = "vague"; _e = random(["small", "big"])
    if (_e == "big") { if (sampler_fN != 0) _fN = 7; else _fN = 0 } //
    else { if (sampler_fN != 7) _fN = 0; else _fN = 7 }
    //print(_e, _fN)
  }
  else nodos_esp[0] = _e;
  if (_e == "big") { nodos_color[3] = 0.6; nodos_esp[1] = 1; sampler_fN = _fN; sampler_fDir = 1 }
  else { nodos_color[3] = 0.95; nodos_esp[1] = 0.5; sampler_fN = _fN; sampler_fDir = -1 }
}

function arma_fondo() {

  pg_fondo = createGraphics(2160, 2160)
  pg_fondo.colorMode(HSB)
  //let _toB = 0; if (col_tipo == "light") _toB = 70
  const _cH = (nodos_color[0] + 180) % 360// ((col_H[col_Hn] + col_ra / 2) + 180) % 360
  let _nL = 60; if (col_tipo == "dark") _nL = 1 // 50 y 5
  let noiseLevel = 40 // 50
  let noiseScale = 0.001 //0.002
  pg_fondo.background(_cH, col_back[0], col_back[1])//0,100,100)//)col_back)//
  pg_fondo.noStroke()
  for (let _y = 0; _y < height + 15; _y += 30) {
    for (let _x = 0; _x < width + 15; _x += 30) {
      const nx = noiseScale * _x;
      const ny = noiseScale * _y;
      const _c = _nL + noiseLevel * noise(nx, ny);

      pg_fondo.fill(_cH, col_back[0], _c, 0.4)//(_c, 0.2)//, 0.1

      for (i = 0; i < 4; i++) { // 6
        pg_fondo.push()
        pg_fondo.translate(_x + random(-15, 15), _y + random(-15, 15))
        pg_fondo.rotate(random(PI))
        pg_fondo.beginShape()
        for (_ii = 0; _ii < TWO_PI; _ii += 1) {
          const _r = random(10, 40) // no 20 50
          const _x = cos(_ii) * _r
          const _y = sin(_ii) * _r
          pg_fondo.vertex(_x, _y)
        }
        pg_fondo.endShape(CLOSE);
        pg_fondo.pop();
      }
    }
  }
}

function arma_pg_clic() {
  pg_clic = createGraphics(width, height)
  pg_clic.colorMode(HSB)
  pg_clic.textSize(35)
  pg_clic.textAlign(CENTER)
  pg_clic.textFont('futura')
  pg_clic.fill(100, 0.7), pg_clic.stroke(5, 0.5), pg_clic.strokeWeight(5)
  pg_clic.text("(( CLICK TO TURN ON SOUND ))", width / 2, height - 55)
}

function sound_random() {

  sound_cont++
  if (sound_cont == 1000) sound_cont = 0
  return soundR[sound_cont]
}



/* function clic() {

  if (!b_sound && seccion == "jugando" && (millis() % 3000) < 1500) {
    image(pg_clic, width/2, 0)
  }
} */

function hacia_jugando() {
  pg_titulo.remove()
  frameCount = floor(random(850, 950))// 900 hacer un floor(random(850,950))
  print("/// acorde: " + acorde[secu_n])
  ///print("--- Acorde: " + secu_n, notas_c[secu[secu_n][0]], notas_c[secu[secu_n][1]], notas_c[secu[secu_n][2]], notas_c[secu[secu_n][3]])
  //Rep_nota0(15000 / BPM)
  //Rep_nota1(14400 / BPM) // mas rapido
  Rep_nota2(13750 / BPM) // mas rapido aun 
  //Rep_nota3(13000 / BPM) // mas rapido aun
  b_clic = true;
  seccion = "jugando"
}

function keyReleased() {

  if ((key == "p" || key == "P") && seccion == "jugando") {
    b_play = !b_play;
    if (b_play) {
      if (b_sound) vol_final.gain.rampTo(1.3, 0.05); // vol_final.mute = false
      loop();
    } else {
      vol_final.gain.rampTo(0, 0.05); // vol_final.mute = true

      //clearInterval(intervalo_n0) // bug agregado
      //clearInterval(intervalo_n1) // bug agregado
      noLoop();
    }
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen()
    fullscreen(!fs)
  }
  if (key == "s" || key == "S") {
    grabaImagen()
  }
  if (key == "a") { //bug
    personas.push(new Persona(mouseX, mouseY))
  }
  if (key == "r" || key == "R") { //bug
    bFrame = !bFrame
  }

  if (key == "e") { // bug provisorio
    if (nodos_esp[0] == "big") { espacio_config("small", 7); }
    else { espacio_config("big", 0); }
  }
}

function mouseClicked() {

  if (sampler_loaded[0] && sampler_loaded[1] && sampler_loaded[2] && b_play) {
    if (seccion == "cargando") {
      hacia_jugando()
    }
    b_sound = !b_sound
    if (b_sound) vol_final.gain.rampTo(1.3, 0.05); // vol_final.mute = false; else vol_final.mute = true;
    else vol_final.gain.rampTo(0, 0.05);
  }
}

function grabaImagen() {
  console.log("saving!")
  saveCanvas("nnn" + mi_seed + ".png")
}

// personas ----------------------------
class Persona {
  constructor(x, y) {
    this.pos = createVector(x, y);
    const _v = random(0.5, 1.2) * 0.5
    this.vel = createVector(random([-_v, _v]), random([-_v, _v]))
    this.accel = createVector(1, 1);
    this.lim = 3

    this.memo = []
    this.azar = []
    for (let i = 0; i < 130; i++) {
      this.memo[i] = { x: 0, y: 0 }
      this.azar[i] = i
    }
    this.azar = shuffle(this.azar)
    this.cont = 0
    this.libre = false
  }

  update() {
    //if (pers_pos != undefined) {
    // Obtener el color del pixel donde está el punto
    // let c = pg_fondo.get(floor(pers_pos.x), floor(pers_pos.y));

    // Get the 2D rendering context
    //let ctx = pg_fondo.drawingContext; //_ctx = pg_fondo.drawingContext;
    //let c = _ctx.getImageData(floor(pers_pos.x), floor(pers_pos.y), 1, 1);

    let ctx = pg_fondo.drawingContext
    let c = ctx.getImageData(floor(this.pos.x), floor(this.pos.y), 1, 1).data;

    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) this.libre = true

    if (!this.libre) {
      if (col_tipo == "light") { if (c[0] < 150 && c[1] < 150 && c[2] < 150) this.rebota() }
      else { if (c[0] > 100 && c[1] > 90 && c[2] > 90) this.rebota() }

      const _r = (noise(0.005 * frameCount) - 0.5) * 0.1;
      this.vel.rotate(_r);
    }

    if (abs(this.accel.x) < 2) this.accel.x *= 1.003
    if (abs(this.accel.y) < 2) this.accel.y *= 1.003

    this.vel.mult(this.accel);
    this.vel.limit(this.lim); // (3)
    this.pos.add(this.vel); // Mover el punto


    this.memo[this.cont].x = this.pos.x, this.memo[this.cont].y = this.pos.y     // guarda en memo
    pg_pers.erase()
    pg_pers.ellipse(this.memo[this.azar[this.cont]].x, this.memo[this.azar[this.cont]].y, 5, 5);
    this.cont++
    if (this.cont == 130) this.cont = 0
    pg_pers.noErase()

    // Dibujo del punto
    pg_pers.fill(col_pers[0], random(10, 30)) // 20, random(10, 30)
    pg_pers.ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  rebota() {
    this.lim = random([2, 3, 3, 3.5, 4, 4.5]) // ver random y seed
    this.accel.x = 1, this.accel.y = 1
    this.vel.rotate(PI), this.vel.mult(1.5)// this.vel.mult(0.5); // rotar 180 grados
    //this.pos.add(this.vel); // mover un paso para no quedar "pegado"
  }

  /* frena() {
    this.vel.mult(0.995)
  } */
}