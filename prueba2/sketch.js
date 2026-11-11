let captureScheduled = false;
let mi_frameCount = 0;
let pixel = 1;
let bFrame = false // bug
let seccion = "cargando", sec_n = 0, sec_n_rall = 100, sec_name = "avanza", sec_cap;
let mi_seed;
let b_clic = false;
let nodos = [], nodos_color = [], nodos_n = -1
let n_ubicX = [], n_ubicY = []
let n_num = [8, 8, 22, 30]// [5, 5, 11, 15]; //[6, 6, 20, 28]; //[8, 8, 22, 30]// [14, 14, 19, 25]; // ojos, boca, cara
let n_numP = [];
let fuente;
let caras_in//, caras_music = [];
//let bSentido = true; //n_sentido = "arriba"

//let insertDistance = 10; // 5 (lo deje en 10)
let separacion = [] //10 * 4// insertDistance * 4; // separationDistance: mas grande menos atraccion // * 2
let sep_min, sep_max;
let margin//, marginB;

let quadtree;
let boundary;
let capacity = 10; // 10, cantidad de puntos por rectangulo. a menor numero subdivide más los cuadrados (mas proceso)

let pg_fondo, pg_clic, pg_titulo;
let titInicio;
let col_tipo = "", col_back = [], col_line = []
let col_caraH, col_caraB = [], colB = [40, 40, 40, 40, 90, 90, 90, 90];
let vel_fC = 40;  // velocidad del frameCount  //antes int(random(30, 50)); //bug anchos 45 a finos 35

let pg_pers, col_pers = []
let personas = [], pers_vivo = [], pers_cant = 0
//let pers_memo = [], pers_cont = 0, pers_azar = []//{x = 0, y = 0, cont = 0}
//let _ctx, cv
let esc_tam = 70 // escalones 60
let camaraX = -0.2, camaraY = -200;  // borrar
let grilla = [], grilla_n = 0;
let grilla_cant_n = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let ancho;
let salto_n = 0, salto_y, salto_x;
let punta = [];
let nube = [], _bN = [false, false, false];//, nube_y = [];
//let nube_dir = [-1, 1, 0];
let relleno;
let bPiso = false;

let soundR = [], sound_cont = 0
let b_play = true, b_sound = false
let seq = // notas del acorde
  //[[35, 39, 43, 50], [36, 39, 43, 45], [34, 36, 45, 53], [36, 40, 47, 48], // primeros
  //[36, 38, 40, 41], [35, 37, 38, 42], [36, 37, 40, 42], // cerrados
  //[36, 38, 40, 45], [36, 40, 44, 47], [36, 38, 39, 47], [38, 41, 45, 49], [36, 40, 42, 45], [40, 42, 43, 50], [37, 41, 43, 48]]
  [[47, 51, 55, 62], [48, 51, 55, 57], [46, 48, 57, 65], [48, 52, 59, 60], // primeros
  [48, 50, 52, 53], [47, 49, 50, 54], [48, 49, 52, 54], // cerrados
  [48, 50, 52, 57], [48, 52, 56, 59], [48, 50, 51, 59], [50, 53, 57, 61], [48, 52, 54, 57], [52, 54, 55, 62], [49, 53, 55, 60]]

//[24, 38, 40, 45], [28, 36, 44, 47], [24, 38, 39, 47], [26, 41, 45, 49], [24, 40, 42, 45], [28, 42, 43, 50], [25, 41, 43, 48]]

let seq_n = 0;
let g_cont = 0, g_total, g_in, g_out;
let acorde = [[""], [""], [""], [""]];
let g_line = [[[0], [0], [0], [0]], [[0], [0], [0], [0]],
[[0], [0], [0], [0]], [[0], [0], [0], [0]]] //[[0], [0], [0], [0]]
let g_vol = [[[0], [0], [0], [0]], [[0], [0], [0], [0]],
[[0], [0], [0], [0]], [[0], [0], [0], [0]]] //[[0], [0], [0], [0]]
//let voz = [0,0]
let sampler = [], sampler_loaded = []//, sampler_tipo; // si suena el 0 e el 1
let sampler_fade = [[0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1, 1, 1]]
//let sampler_fN = -1, sampler_fDir = 1
let vol_final
let BPM = 100; //int(map(ancho, 500, 900, 80, 120)); //100; //oj! variarlo finos -> 120 a anchos -> 80
let BPM_rall = 0.25 // 0.3;
let intervalo_n0, intervalo_n1, intervalo_n2, intervalo_n3
let b_newTempo = false

function preCarga() {// preload() {
  const channel = new Tone.Channel({ volume: 0, channelCount: 2 })
  const channel2 = new Tone.Channel({ volume: 0, channelCount: 2 })
  const reverb = new Tone.Reverb({ decay: 1, preDecay: 0.3, wet: 0.3 }) // decay: 2, wet:   
  //const reverb2 = new Tone.JCReverb({ roomSize: 1, wet: 1 })
  const reverb2 = new Tone.Reverb({ decay: 3, preDecay: 0.5, wet: 0.6 }) // decay: 2, wet: 1
  sampler[0] = new Tone.Sampler({
    // C0: 'piano_c1-p.mp3', C1: 'piano_c2-p.mp3', C2: 'piano_c3-p.mp3', C3: 'piano_c4-p.mp3', C4: 'piano_c5-p.mp3', C5: 'piano_c6-p.mp3'
    C1: 'piano_c1-p.mp3', C2: 'piano_c2-p.mp3', C3: 'piano_c3-p.mp3', C4: 'piano_c4-p.mp3', C5: 'piano_c5-p.mp3', C6: 'piano_c6-p.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[2] = true; }
  })
  sampler[0].volume.value = 6;
  sampler[0].chain(reverb, channel)

  sampler[1] = new Tone.Sampler({

    // C1: 'ma_c2.mp3', C2: 'ma_c3.mp3', C3: 'ma_c4.mp3', C4: 'ma_c5.mp3', C5: 'ma_c6.mp3'
    C2: 'ma_c2.mp3', C3: 'ma_c3.mp3', C4: 'ma_c4.mp3', C5: 'ma_c5.mp3', C6: 'ma_c6.mp3'
    //G1: 'violin_G2.mp3', C2: 'violin_C3.mp3', G2: 'violin_G3.mp3', G3: 'violin_G4.mp3', G4: 'violin_G5.mp3',
  }, {
    baseUrl: './assets/'
  })
  //sampler[1].volume.value = 0; //-15
  sampler[1].chain(channel);

  sampler[2] = new Tone.Sampler({
    // A0: 'choir_A1.mp3', A1: 'choir_A2.mp3', A2: 'choir_A3.mp3', A3: 'choir_A4.mp3', C4: 'choir_C5.mp3', C5: 'ma_c6.mp3'
    A1: 'choir_A1.mp3', A2: 'choir_A2.mp3', A3: 'choir_A3.mp3', A4: 'choir_A4.mp3', C5: 'choir_C5.mp3', C6: 'ma_c6.mp3'
  }, {
    baseUrl: './assets/'
  })
  sampler[2].volume.value = -14;
  sampler[2].chain(reverb2, channel2);

  channel2.chain(channel);
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  });
  vol_final = new Tone.Gain(1.3);
  const limiter = new Tone.Limiter(-0.5);
  channel.chain(comp, vol_final, limiter, Tone.Destination)
}


async function setup() {

  preCarga();

  //const cv = createCanvas(2160, 2160)
  let cv = createCanvas(2160, 2160);
  cv.parent("cv");

  ////// ->>>  cv.drawingContext.getContextAttributes().willReadFrequently = true; // por la advertencia de Canvas2D ¿?
  //cv.drawingContext.willReadFrequently = true;
  //cv.elt.getContext('2d', { willReadFrequently: true });
  frameRate(30);
  //pixel = 0.5 // bug
  if ($bootloader.isCapture) pixel = 0.25;//0.3 para 720px;
  pixelDensity(pixel);
  colorMode(HSB);
  fuente = await loadFont('./assets/Ubuntu-Regular.ttf')

  mi_seed = Math.floor(9999999999 * $bootloader.rnd()); //1269979099//
  randomSeed(mi_seed);
  noiseSeed(mi_seed);

  // visual config -----------------------------
  let _r = random();
  if (_r < 0.55) nodos_color[0] = random(20, 75);
  else if (_r < 0.9) nodos_color[0] = random(130, 170); else nodos_color[0] = random(320, 340); //= random(160, 200)
  nodos_color[1] = (nodos_color[0] + 60) % 360, nodos_color[2] = (nodos_color[0] + 300) % 360;

  col_caraH = int(random(35, 55)); //40,55
  nodos_color[4] = 0.04;

  if (random() < 0.6) { //0.6
    col_tipo = "light", col_back = [3, 85], col_line = [10, 90, 99, 10], col_pers = [20];
    nodos_color[3] = 0.6;
    relleno = random([0.6, 0.8, 0.8, 0.95, 0.95, 0.95, 0.95]);
    //  relleno = 0.6; //bug
    if (relleno == 0.6) { nodos_color[4] = 0.08; col_line[3] = 90; }
  } else {
    col_tipo = "dark", col_back = [5, 20], col_line = [80, 20, 66, random([80, 80, 80, 20])], col_pers = [230]
    nodos_color[3] = 0.8;
    relleno = random([0.55, 0.8, 0.8, 0.8, 0.8, 0.95, 0.95, 0.95]);
  }

  ancho = random([525, 600, 675, 675, 750, 750, 750, 825, 825, 900]);
  // ancho = 525 // bug
  if (ancho > 800) { sep_min = 10, sep_max = 30 }
  else if (ancho > 601) { sep_min = 9, sep_max = 29 }
  else { sep_min = 8, sep_max = 28 }

  let _g = 0, _desfY = 0, _lado = "izq";
  if (random() < 0.5) _lado = "der";
  for (let y = height - 200; y > 150; y -= 200) { // -180
    if (_lado == "izq") {
      for (let x = ancho; x < width - ancho; x += 75) {
        if (_desfY % 2 == 0) grilla[_g] = { x: x, y: y };
        else {
          grilla[_g] = { x: width - x, y: y };
        }
        _g++;
      }
    } else {
      for (let x = width - ancho; x > ancho; x -= 75) {
        if (_desfY % 2 == 0) grilla[_g] = { x: x, y: y };
        else {
          grilla[_g] = { x: width - x, y: y };
        }
        _g++;
      }
    }
    _desfY++;
  }

  salto_x = 220 + ((ancho - 525) * -155) / 375;// const _w = map(ancho, 525, 900, 220, 65)
  //print("salto_X: " + salto_x)
  let _rP = random([0, 0, 1, 1, 2]);
  if (ancho < 550) { _rP = 2 }//, nube_dir = [1, random([1, -1]), -1] } //1, random([1, -1]), -1
  let _pu = int(random(6)) * 10;
  if (_rP == 0) { punta = [-350 + _pu, 700 + ancho], salto_y = 900, nube_dir = [-1, -1, 1] } //-200, 1200
  else if (_rP == 1) { punta = [700 + ancho, -350 + _pu], salto_y = 900, nube_dir = [1, 1, -1] } //1200, -200
  else { punta = [350, 350], salto_y = 600 }
  // print("punta: " + punta)

  // left eye, right eye, mouth, and face
  for (let i = 0; i < 12; i++) {
    const _uX = grilla[i].x;
    const _uY = grilla[i].y;
    for (let j = 0; j < 4; j++) {
      if (j == 0) {
        n_ubicX[i * 4 + j] = _uX - 25; n_ubicY[i * 4 + j] = _uY - 20; // -100
      } else if (j == 1) {
        n_ubicX[i * 4 + j] = _uX + 25; n_ubicY[i * 4 + j] = _uY - 20; // + 100
      } else if (j == 2) {
        n_ubicX[i * 4 + j] = _uX; n_ubicY[i * 4 + j] = _uY + 20; //+ 33 orig: + 150
      } else if (j == 3) {
        n_ubicX[i * 4 + j] = _uX; n_ubicY[i * 4 + j] = _uY;// + 300;
      }
    }
  }

  for (let i = 0; i < 48; i++) {
    separacion[i] = 10;
    if (i % 4 <= 1 && random() < 0.8) { pers_vivo[i] = true; pers_cant++ } else { pers_vivo[i] = false } //i > 20  && 
  }
  let _nu = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44]; _nu = shuffle(_nu); //
  for (let i = 0; i < 3; i++) { // bug podria haber mas nubes si es mas ancho
    nube[i] = _nu[i]//, nube_y[i] = int(random(150, 250));
  }
  console.log(nube)//, nube_y)

  // ---------------------------
  margin = 150//, marginB = 150

  boundary = new Rect(width / 2, height / 2, width / 2, height / 2);
  quadtree = new QuadTree(boundary, capacity);
  caras_in = random([1, 1, 1, 2, 3])
  nueva_cara(caras_in);

  sec_cap = 11 + int(random(22, 31)); // bug! ojo, modifiqué. puse 11 +
  print("seccion capture hasta: " + sec_cap + " - 1")
  pg_pers = createGraphics(width, height)
  pg_pers.noStroke();
  // ---------------------------
  arma_fondo();
  arma_pg_clic();

  // music config -------------------------------
  for (let i = 0; i < 1000; i++) { soundR[i] = random(); }

  // create chords 
  if (relleno == 0.6) {
    // seq = [[48, 52, 55, 59], [50, 52, 55, 57], [50, 52, 57, 60], [48, 52, 59, 62], [52, 53, 55, 59]];
    seq = [[50, 54, 57, 59], [49, 53, 56, 57], [48, 52, 57, 59], [47, 51, 55, 58], [49, 52, 56, 59]]
    seq = shuffle(seq);
  } else {
    seq = shuffle(seq);
    let _tr = random([0, 1, 2, -1]); // transpone 1st arriba, un acorde: el 1º, 2º o 3º. -1 no transpone
    if (_tr != -1) {
      for (let i = 0; i < 4; i++) { seq[_tr][i] += 1; }
    }
  }
  let _t = random([0, 1, 2, 3, 4]) // 'tonalidad' de toda la secuencia //-2, -1, 0, 1, 2
  if (col_tipo == "light") _t += 12; else _t += 2;
  if (relleno == 0.6) _t -= 7; // soul bug

  for (let n = 0; n < seq.length; n++) {
    for (let i = 0; i < 4; i++) { seq[n][i] = seq[n][i] + _t; }
  }
  for (let a = 0; a < 4; a++) {
    for (let n = 0; n < 4; n++) {
      const nota = Tone.Frequency(seq[a][n], "midi").toNote();
      acorde[a][n] = nota;
    }
  }

  // create glissandos
  g_total = int(map(ancho, 525, 900, 140, 100));// orig g_total = 525, 900, 120, 80
  g_in = 20, g_out = g_total - 20;
  console.log("g_total: " + g_total)
  for (let a = 0; a < 4; a++) { // lo que era seq_n -> los acordes
    for (let n = 0; n < 4; n++) {
      glissando(a, n, seq[a][n], seq[a + 1][n]) // acorde, voz del acorde, notas del acorde, y notas deo a siguiente
    }
  }



  // features ---------------------
  console.log("Wax choir. Yamil Burguener. 2026")
  console.log("seed number: " + mi_seed);
  const _nC0 = int(int(nodos_color[0]) * 0.1) * 10;
  let _re = "wax"; if (relleno == 0.95) _re = "skeleton"; // esqueleto skeleton/ a little
  else if (relleno == 0.55) _re = "invisible"; else if (relleno == 0.6) _re = "soul";
  console.log('background:', col_tipo, '\nmain color hue:', _nC0 + "s°, " + col_caraH + "s°",
    '\nsize:', width - (ancho * 2), '\nfill:', _re);

  console.log('harmony: ' + '\n' + acorde[0] + '\n' + acorde[1] + '\n' + acorde[2] + '\n' + acorde[3]);

  $bootloader.setFeatures({
    'background': col_tipo,
    'main color hue': _nC0 + "s°, " + col_caraH + "s°",
    'size': width - (ancho * 2), //360 a 1360 
    'fill': _re
  });
  pg_titulo = createGraphics(width, height);

  if (!$bootloader.isCapture) { // modo live (!) 
    pg_titulo.colorMode(HSB), pg_titulo.textAlign(CENTER)
    pg_titulo.textFont(fuente)
    titInicio = millis() + 9999;
  } else {
    hacia_jugando();
  }

  let loadingDiv = document.getElementById('p5_loading');
  if (loadingDiv) loadingDiv.remove();
}

function draw() {

  if ($bootloader.isCapture) {// && !captureScheduled) { // modo captura
    console.log("🎬 MODO CAPTURA - Renderizando visuals (sin sonido)...");
    //captureScheduled = true;
    //finished = true;
    // Detén TODO el sonido PRIMERO
    try {
      Tone.Transport.stop();
      // clearInterval(intervalo_A);
      // clearInterval(intervalo_pl);
      // clearInterval(intervalo_ar);
    } catch (e) { }

    while (sec_n < sec_cap - 1) { //30 a 540px
      image(pg_fondo, 0, 0);
      //if (seccion == "jugando") {
      jugando();
      //}
    }
    //noLoop();
    //$bootloader.capture();//  animacion();//captura_final(); 
    //return;
  }
  // 🟢 MODO NORMAL: Rendering lento CON SONIDO
  //if (finished) return;

  else if (!sampler[0].loaded || !sampler[1].loaded || !sampler[2].loaded) return;

  if (bFrame && frameCount % 10 == 0) { // bug provisorio
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
  else if (seccion == "jugando") {

    /* pg_fondo.textSize(18)
    pg_fondo.textFont(fuente)
    pg_fondo.textAlign(CENTER)
    pg_fondo.noStroke();
    pg_fondo.fill(100-col_line[0], 0.1), pg_fondo.strokeWeight(1)
    let _y = map (sec_n, 0, 50, 500, height-150)
    if (_y < height-150) pg_fondo.text(acorde[seq_n], width/2, _y) */

    jugando();
  }

  if (!$bootloader.isCapture && !b_sound && b_clic && (millis() % 3000) > 2000) image(pg_clic, 0, 0);
}

function animacion() {

  if ($bootloader.isCapture && !captureScheduled) {
    $bootloader.capture();
    captureScheduled = true;

  }
}

function jugando() {
  // personas ----------------------------------
  if (sec_n > 4) {
    for (let i = 0; i < personas.length; i++) { personas[i].update(); }
    image(pg_pers, 0, 0);
  }
  quadtree.clearQuadtree();
  for (let n = 0; n <= nodos_n; n++) {
    for (let i = 0; i < nodos[n].length; i++) {
      let p = new Point(nodos[n][i].position.x, nodos[n][i].position.y, nodos[n][i]);
      quadtree.insert(p);
    }
  }

  for (let n = 0; n <= nodos_n; n++) {
    pg_fondo.beginShape();

    let _s = nodos[n][0].getSentido();
    if (_s == "arriba") pg_fondo.stroke(col_line[0], 0.25);
    else pg_fondo.stroke(col_line[0], nodos_color[4])//; 0.04  ... 0.05 antes 0.1

    if (random() < relleno || (_s == "abajo" && random() < 0.7)) { // 0.8, 0.95
      pg_fondo.noFill();
    } else {
      //pg_fondo.stroke(col_line[0], 0.25)//; 0.1
      if (random() < nodos_color[3]) {
        pg_fondo.fill(col_line[1], 0.15);
      }
      else {
        if (random() < 0.5) {
          pg_fondo.fill(nodos_color[0], random([9, 99]), col_line[2], 0.02); // , 0.05
        }
        else {
          const _r = random([nodos_color[1], nodos_color[2]]);
          pg_fondo.fill(_r, random([9, 99]), col_line[2], 0.03);
        }
      }
    }

    if (_s == "arriba") {
      if (n % 4 == 3) { //cara
        if (random() < 0.95) {
          pg_fondo.noStroke();
          if ((sec_n == 12 || sec_n > 14) && separacion[n] < 12 && random() < 0.5)
            pg_fondo.fill(col_caraH, random([col_line[0], 90, 90]), col_caraB[n], 0.05) // 0.1, 0.08)// col_line[2], 0.2)
        }
      }
      else if (sec_n < 4 && n % 4 == 2) {
        pg_fondo.noFill(), pg_fondo.noStroke();// no boca al inicio
      }
    }
    else if (_s == "abajo" && n % 4 < 2 && nodos[n][i].getOjo()) pg_fondo.fill(col_line[3], 0.5); // ojo 

    /*       if (nodos[n][i].getSentido() == "abajo" &&
          ((n >= nube[0] && n < nube[0] + 3) || (n >= nube[1] && n < nube[1] + 3) || (n >= nube[2] && n < nube[2] + 3)))
          pg_fondo.stroke(0, 90, 90, 0.5) // bug test nube    */


    let _end = nodos[n].length;
    if (n % 4 < 2 && sec_n % 3 > 0) _end = int(nodos[n].length / 2) + 1
    for (let i = 0; i < _end; i++) {//nodos[n].length; i++) {
      const n1 = nodos[n][i].position;
      const n2 = nodos[n][(i + 1) % nodos[n].length].position;
      const _d = dist(n1.x, n1.y, n2.x, n2.y)
      if (_d > 100) break; // > 50
      pg_fondo.splineVertex(n1.x, n1.y); //vertex(n1.x, n1.y)
    }
    pg_fondo.endShape();
  }


  let bMi_fC = false; if (mi_frameCount % vel_fC == 0) bMi_fC = true;
  let _a, _b;
  if (nodos_n >= 47 && mi_frameCount % vel_fC == 0) {

    salto_n = (salto_n + 1) % 12// = int(random(12))
    _a = grilla[grilla_cant_n[salto_n]];
    grilla_cant_n[salto_n] = (grilla_cant_n[salto_n] + 11) % grilla.length;
    _b = grilla[grilla_cant_n[salto_n]];

    /* _a = grilla[salto_n % grilla.length];
    salto_n = salto_n + 1
    _b = grilla[(salto_n + 12) % grilla.length] */

  }


  for (let n = 0; n <= nodos_n; n++) {

    // nube
    if (nodos[n][0].getSentido() == "abajo") {
      for (let iii = 0; iii < nube.length; iii++) {
        // let _plus = salto_x * nube_dir[iii]; //new
        if (n >= nube[iii] && n < nube[iii] + 4) {
          if (nodos[n][0].getPosY() > height - 155) {
            if (sec_name == "avanza") { sec_name = "rall"; bPiso = true; print(sec_name) }

            let _di = 1; if (n % 2 == 1) _di = -1;
            for (let ii = 0; ii < nodos[n].length; ii++) {
              const _y = nodos[n][ii].getPosY() - sec_n * 3;
              const _x = nodos[n][ii].getPosX() + sec_n * 0.25 * _di;
              // let _x2 = _x + _plus;
              // if (_x2 < ancho) { _x2 = _x2 + (width - ancho * 2), sec_fin++; }
              // else if (_x2 > width - ancho) { _x2 = _x2 - (width - ancho * 2), sec_fin++; }

              nodos[n][ii].salto(_x, _y);

              separacion[n] = sep_min;
              nodos[n][ii].setSeparacion(separacion[n]);
              // nodos[n][ii].setSentido("---");
            }

          }
        }
      }
    }

    for (let i = 0; i < nodos[n].length; i++) {

      if (bMi_fC) {
        const _sep = int(map(sin((mi_frameCount * (1 + int(n / 4) * 4)) * 0.75 / vel_fC), -1, 1, sep_min, sep_max)); //* 0.75 //floor()
        separacion[n] = _sep; //if (n == 0) print(_sep)
        //if (sec_name != "avanza" && n % 4 != 3) separacion[n] += 10;
        //print("sep: " + _sep + " " + n)
        nodos[n][i].setSeparacion(separacion[n]);

        if (nodos_n >= 47) {
          const _y = nodos[n][i].getPosY();
          const _x = nodos[n][i].getPosX();
          const _limY = map(_x, 0, width, punta[0], punta[1])

          if (_y < _limY) {//&& !saltando) {// < 350
            ////print("cambia sentido " + n)
            for (let ii = 0; ii < nodos[n].length; ii++) {
              nodos[n][ii].setSentido("abajo");
            }
          }
          // salto -------------
          else if (nodos[n][i].getSentido() == "arriba" && _y > salto_y && (n >= salto_n * 4 && n <= salto_n * 4 + 3)) {
            //if (n % 4 < 2 && random()< 0.3) saltando = true;
            let _x1 = _b.x - _a.x//grilla[_b].x - grilla[_a].x;
            let _y1 = _b.y - _a.y//grilla[_b].y - grilla[_a].y;
            //if (nodos[n][i].getSentido() == "abajo") if (abs(_x1) > 100 || abs(_y1) > 100) break; //saltando = true;//
            const _x2 = _x + _x1;
            const _y2 = _y + _y1;
            /* if (nodos[n][i].getSentido() == "nube") {
              nodos[n][i].salto(_x, _y2);
              if (abs(_x1) > 200) break; // tipo saltando
            } */
            nodos[n][i].salto(_x2, _y2);
          }
        }
      }

      let consulta = true;
      if (mi_frameCount % 2 == 1 && nodos[n][i].getSentido() == "abajo") consulta = false;
      if (consulta) {
        let range = new Circle(nodos[n][i].position.x, nodos[n][i].position.y, separacion[n]);
        let neighbors = [];
        quadtree.query(range, neighbors); //consulta
        nodos[n][i].update(nodos[n], neighbors);
      }

      // escalones arrugas----------------------
      if ((sec_n > 17 && sec_n != 19 && sec_n != 20 && sec_n != 22 && sec_n != 25)
        && n == mi_frameCount % nodos_n) {
        for (let nn = 0; nn <= nodos_n; nn++) { //
          if (sec_name != "avanza" && random() < 0.2) { break; } // 0.4
          if (n != nn && i > nodos[n].length * 0.5) {//i % 2 == 0) {
            let _d = dist(nodos[n][i].position.x, nodos[n][i].position.y,
              nodos[nn][i % nodos[nn].length].position.x, nodos[nn][i % nodos[nn].length].position.y)
            if (_d > 25 && _d < esc_tam) { // 70 a 120 segun separacion
              pg_fondo.stroke(col_line[0], 0.4);
              pg_fondo.line(nodos[n][i].position.x, nodos[n][i].position.y,
                nodos[nn][i % nodos[nn].length].position.x, nodos[nn][i % nodos[nn].length].position.y)
            }
          }
        }
      }
    }
    // nube
    /*  if (nodos[n][0].getSentido() == "abajo") {
       for (let iii = 0; iii < nube.length; iii++) {

         let _plus = salto_x * nube_dir[iii]; //new

         if (n >= nube[iii] && n < nube[iii] + 4) {
           let _yN = nodos[n][0].getPosY();
           let _xN = nodos[n][0].getPosX() + _plus
           if (_yN > height - 155) {// && _yN < height*0.6) {
             
             if (sec_name == "avanza") { sec_name = "rall"; print(sec_name) }
             
             
             let _r = random([1,3,7]);
             for (let ii = 0; ii < nodos[n].length; ii++) {
               const _y2 = nodos[n][ii].getPosY() - sec_n * _r;
               let _x = nodos[n][ii].getPosX();
               let _x2 = _x + _plus;
               if (_xN < ancho) { _x2 = _x + (width - ancho * 2), sec_fin++;}
               else if (_xN > width - ancho) { _x2 = _x - (width - ancho * 2), sec_fin++;}
 

               nodos[n][ii].salto(_x2, _y2);
             }

           }
         }
       }
     } */
  }
  //bSentido = true;
  ////if (margin < 600) {margin += 0.5; marginB += 0.5 } 

  // partitura -----------------------------------
  if (bMi_fC) {// % 70 a 122

    sec_n++;
    console.log("sec_n: " + sec_n, g_cont)

    // ingreso voces
    if (!$bootloader.isCapture) { // antes  nodos_n == de a uno 7, 11, 15, de a 2: 7, 15, 23, de a 3: 11, 23, 31
      if (sec_n == 2) Rep_nota1(14400 / BPM);
      else if (sec_n == 3) Rep_nota3(13000 / BPM);
      else if (sec_n == 4) Rep_nota0(15000 / BPM);
    }

    // ingreso caras
    if (nodos_n < 44) {
      nueva_cara(caras_in);
      /* for (let ii = 0; ii < 4; ii++) {
        nodos_n++
        nodos[nodos_n] = [];
        ordena(nodos_n);
      } */
    }

    let _fin_n = 0;
    if (sec_name == "rall") {
      for (let n = 0; n < nodos_n; n++) {
        let _yN = nodos[n][0].getPosY();
        if (_yN < height * 0.5) _fin_n++;
        // print ("------ "+_yN +" "+ _fin_n)
      }
      if (_fin_n < 10) { // si faltan solo 10 por pasar la mitad
       /// print("faltaron por pasar la mitad: " + _fin_n);
        sec_n_rall = sec_n;
        sec_name = "fin";
      }

      grave_final();
    }
  }

  // rall final -------------------
  if (sec_name == "fin") {// { // antes 35

    if (BPM > 5) BPM -= BPM_rall //0.1 ... 0.13 
    // print("rall " + int(BPM))
    b_clic = false;
    if (!$bootloader.isCapture) {
      b_newTempo = true;
      let _m;
      if (sec_n > sec_n_rall + 2) {// fade out. antes 40
        _m = map(sec_n, sec_n_rall + 2, sec_n_rall + 7, -10, -50);
        sampler[2].volume.value = _m;
      }
    }
    //// print("llegar a " + (sec_n_rall + 13))
    if (sec_n > sec_n_rall + 10) fin_todo()// antes sec_n > sec_n_rall + 8   bSec_fin /////
  }

  // piso
  if (bPiso) {
    pg_fondo.fill(col_line[3], 0.1);
    pg_fondo.ellipse(random(ancho - 50, width - ancho + 50), height - margin - random(7), 7, 3)
  }

  mi_frameCount++;

  if ($bootloader.isCapture && sec_n == sec_cap) animacion();
}

function nueva_cara(_g) { // grupos
  for (let c = 0; c < _g; c++) {
    for (let i = 0; i < 4; i++) {
      //nodos_n = i
      nodos_n++
      nodos[nodos_n] = [];
      ordena(nodos_n);
    }
  }
}

function ordena(_n) {

  let _max, _ubicX, _ubicY, _tam_ra;
  _max = 2// new bug constrain(map(_n, 0, 20, 7, 3), 3, 7)// mayor es mas organico - de 3 a 7
  _ubicX = n_ubicX[_n]; _ubicY = n_ubicY[_n];
  if (_n % 4 == 3) _tam_ra = 60; else if (_n % 4 == 2) _tam_ra = 35; else _tam_ra = 13; //380, 200, 90
  n_numP[_n] = n_num[_n % 4];

  const _ini = PI; //0.8 // PI para ojos cantando
  for (let i = 0; i < n_numP[_n]; i++) {
    let angle = _ini + (TWO_PI / n_numP[_n]) * i;
    let x = _ubicX + _tam_ra * cos(angle);
    let y = _ubicY + _tam_ra * sin(angle);

    nodos[_n][i] = new Nodo(x, y, _max, n_numP[_n]);
    col_caraB[_n] = colB[_n % 8];
  }

  if (pers_vivo[_n - 1]) {
    const _nu = n_numP[_n - 1]
    const _v1 = createVector(nodos[_n - 1][0].position.x, nodos[_n - 1][0].position.y)
    const _v2 = createVector(nodos[_n - 1][int(_nu / 2)].position.x, nodos[_n - 1][int(_nu / 2)].position.y)
    const _medio = p5.Vector.lerp(_v1, _v2, 0.5);
    personas.push(new Persona(_medio.x, _medio.y, (_n - 1)))
  }
}

// music -----------------------------------------------
function Rep_nota0(_r) {

  intervalo_n0 = setInterval(() => {
    if (b_play) {
      const _voz = g_line[seq_n][0][g_cont]
      const _v = g_vol[seq_n][0][g_cont]
      const _t = "+" + str(0.5 * cos(mi_frameCount * 0.027) + 0.5) // fade para espacios //* 0.08
      let _i = 0; if (sec_name != "avanza") _i = mi_frameCount % 2
      sampler[_i].triggerAttackRelease(_voz, 1, _t, _v);
      if (g_cont % 4 == 0) sampler[2].triggerAttackRelease(_voz, 2, _t, _v * 0.7);
      if (g_cont < g_total - 1) { g_cont++ }//189
      else {
        if (seq_n < 3) { // el ultimo acorde no debe entar  seq.length - 2
          seq_n++, g_cont = 0
          print("acorde: " + acorde[seq_n])
        }
      }
    }
    if (b_newTempo) {
      clearInterval(intervalo_n0);
      Rep_nota0(15000 / BPM);
    }
  }, _r)
}

function Rep_nota1(_r) {

  intervalo_n1 = setInterval(() => {
    if (b_play) {
      const _voz = g_line[seq_n][1][g_cont]
      const _v = g_vol[seq_n][1][g_cont]
      const _t = "+" + str(0.5 * cos(mi_frameCount * 0.031) + 0.5); //* 0.065
      let _i = 0; if (sec_name != "avanza") _i = mi_frameCount % 2
      sampler[_i].triggerAttackRelease(_voz, 1, _t, _v);
      if (g_cont % 4 == 2) sampler[2].triggerAttackRelease(_voz, 2, _t, _v);
    }
    if (b_newTempo) {
      clearInterval(intervalo_n1);
      Rep_nota1(14400 / BPM);
    }
  }, _r)
}

function Rep_nota2(_r) {

  intervalo_n2 = setInterval(() => {
    if (b_play) {
      const _voz = g_line[seq_n][2][g_cont]
      const _v = g_vol[seq_n][2][g_cont]
      const _t = "+" + str(0.5 * cos(mi_frameCount * 0.035) + 0.5);
      let _i = int(sound_random() * 2);
      sampler[_i].triggerAttackRelease(_voz, 1, _t, _v);
      if (g_cont % 3 == 2) sampler[2].triggerAttackRelease(_voz, 2, _t, _v);
    }
    if (b_newTempo) {
      clearInterval(intervalo_n2);
      Rep_nota2(13750 / BPM);
    }
  }, _r)
}

function Rep_nota3(_r) {

  intervalo_n3 = setInterval(() => {
    if (b_play) {
      const _voz = g_line[seq_n][3][g_cont]
      const _v = g_vol[seq_n][3][g_cont]
      const _t = "+" + str(0.5 * cos(mi_frameCount * 0.042) + 0.5);
      let _i = 0; if (sec_name != "avanza") _i = int(sound_random() * 2);
      sampler[_i].triggerAttackRelease(_voz, 1, Tone.now(), _v);
      if (g_cont % 3 == 1) sampler[2].triggerAttackRelease(_voz, 2, _t, _v);
    }
    if (b_newTempo) {
      clearInterval(intervalo_n3);
      Rep_nota3(13000 / BPM);
    }
  }, _r)
}

function grave_final() {
  if (!$bootloader.isCapture && b_play) {

    const _voz = g_line[3][0][0] * 0.0625; // * 0.25
   //// print("Bang " + sec_n % 2 + " " + _voz) // * 0.25, 0.125 3 octavas
    sampler[sec_n % 2].triggerAttack(_voz, Tone.now(), 0.6); //sampler[mi_frameCount % 2]
  }
}

function glissando(_a, _n, _nA1, _nA2) { // nota afinada

  // if (_a == 2 && _n == 0) { _nA2 -= 12; } baja una octava al final. no suena lindo
  //else if (_a == 3 && _n == 0) { _nA1 -= 12; seq[_a][_n] = _nA1; } baja una octava al final. no suena lindo
  const _hertz1 = Tone.Frequency(_nA1, "midi").toFrequency()
  const _hertz2 = Tone.Frequency(_nA2, "midi").toFrequency()
  const _desde = g_in + int(sound_random() * 20) //int(random(20, 70)) // 60 + int(sound_random() * 50)
  const _hasta = g_out + int(sound_random() * 20)//int(random(120, 170)) // 120
  let _m, b_griss = true;
  if (abs(_nA1 - _nA2) > 4) b_griss = false; // 4
  for (let i = 0; i < g_total; i++) { //190
    let _v = 1
    if (b_griss) {
      if (i > _hasta) _m = _hertz2 * (0.975 + sound_random() * 0.05); // mas suave -> (0.95 + sound_random() * 0.1) 
      else if (i > _desde) _m = map(i, _desde, _hasta, _hertz1, _hertz2)// 0, _dif)
      else _m = _hertz1 * (0.975 + sound_random() * 0.05); //0
    } else {
      if (i < g_total * 0.5) { _m = _hertz1 * (0.975 + sound_random() * 0.05); _v = constrain(map(i, g_in, g_total * 0.5, 1, 0), 0, 1) } //50, 94
      else { _m = _hertz2 * (0.975 + sound_random() * 0.05); _v = constrain(map(i, g_total * 0.5, g_out, 0, 1), 0, 1) }//95, 155
    }
    g_line[_a][_n][i] = _m;//_hertz1 + _m
    g_vol[_a][_n][i] = _v;
  }
}

function fin_todo() {

  grabaImagen();
  if (!$bootloader.isCapture) {
    clearInterval(intervalo_n0), clearInterval(intervalo_n1), clearInterval(intervalo_n2), clearInterval(intervalo_n3);
  }
  noLoop();
  //animacion()
  return; // lo agrego??
}

function muestra_titulo() {

  pg_titulo.clear();
  pg_titulo.textSize(60);
  pg_titulo.fill(col_line[0], 0.8), pg_titulo.noStroke();
  pg_titulo.text("WAX CHOIR", pg_titulo.width / 2, pg_titulo.height - 470);
  pg_titulo.textSize(30);
  const _t = int((titInicio - millis()) * 0.001);
  pg_titulo.text("CLICK TO START\nor wait (" + _t + ") seconds", pg_titulo.width / 2, pg_titulo.height - 400);
  let _r = random(14);
  pg_titulo.ellipse(pg_titulo.width / 2 + 118, pg_titulo.height - 518 - _r * 0.5, random(5), _r);
  if (_t <= 0) {
    vol_final.gain.rampTo(0, 0.05); // vol_final.pmute = true
    hacia_jugando(); //seccion = "jugando"
  }
  else image(pg_titulo, 0, 0);
}

function arma_fondo() {

  pg_fondo = createGraphics(2160, 2160)
  pg_fondo.colorMode(HSB)
  pg_fondo.elt.getContext('2d', { willReadFrequently: true });
  const _cH = (nodos_color[0] + 180) % 360;
  let _nL = 60; if (col_tipo == "dark") _nL = 1;
  const noiseLevel = 40;
  const noiseScale = 0.001;
  pg_fondo.background(_cH, col_back[0], col_back[1]);
  pg_fondo.noStroke();
  for (let _y = 0; _y < height + 15; _y += 30) {
    for (let _x = 0; _x < width + 15; _x += 30) {
      const nx = noiseScale * _x;
      const ny = noiseScale * _y;
      const _c = _nL + noiseLevel * noise(nx, ny);
      pg_fondo.fill(_cH, col_back[0], _c, 0.4);
      for (i = 0; i < 4; i++) { // 6
        pg_fondo.push()
        pg_fondo.translate(_x + random(-15, 15), _y + random(-15, 15))
        pg_fondo.rotate(random(PI))
        pg_fondo.beginShape()
        for (_ii = 0; _ii < TWO_PI; _ii += 1) {
          const _r = random(10, 40);
          const _x = cos(_ii) * _r;
          const _y = sin(_ii) * _r;
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
  pg_clic.textFont(fuente)
  pg_clic.noStroke();
  pg_clic.fill(col_line[0], 0.7), pg_clic.strokeWeight(2)
  pg_clic.text("(( click to turn on sound ))", width / 2, height - 50) //(( CLICK TO TURN ON SOUND ))", width / 2, height - 55)
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

  randomSeed(mi_seed);
  noiseSeed(mi_seed);
  pg_titulo.remove()
  mi_frameCount = floor(random(1, 500))// cambia el ritmo inicial de las voces
  print("acorde: " + acorde[seq_n])
  //Rep_nota0(15000 / BPM)
  //Rep_nota1(14400 / BPM) // mas rapido
  if (!$bootloader.isCapture) Rep_nota2(13750 / BPM) // mas rapido aun 
  //Rep_nota3(13000 / BPM) // mas rapido aun
  b_clic = true;
  seccion = "jugando";
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
  if (key == "r" || key == "R") { //bug
    bFrame = !bFrame
  }
}

function mouseClicked() {

  Tone.start();
  if (sampler[0].loaded && sampler[1].loaded && sampler[2].loaded && b_play) { //(sampler_loaded[0] && sampler_loaded[1] && sampler_loaded[2] && 
    if (seccion == "cargando") hacia_jugando();

    b_sound = !b_sound;
    if (b_sound) vol_final.gain.rampTo(1.3, 0.05); // vol_final.mute = false; else vol_final.mute = true;
    else vol_final.gain.rampTo(0, 0.05);
  }
}

function grabaImagen() {

  console.log("saving!")
  saveCanvas("wax_choir_" + mi_seed + ".png")
}

// personas ----------------------------
class Persona {
  constructor(x, y, _memoNodo) {
    this.pos = createVector(x, y);
    //this.posIni = createVector(x, y);
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

    this.mN = _memoNodo;
  }

  update() {
    //if (pers_pos != undefined) {


    // Get the 2D rendering context
    //let ctx = pg_fondo.drawingContext; //_ctx = pg_fondo.drawingContext;
    //let c = _ctx.getImageData(floor(pers_pos.x), floor(pers_pos.y), 1, 1);

    if (random() < 0.02) { // vuelve al ojo
      const _v1 = createVector(nodos[this.mN][0].getPosX(), nodos[this.mN][0].getPosY())
      const _v2 = createVector(nodos[this.mN][4].getPosX(), nodos[this.mN][4].getPosY())
      const _medio = p5.Vector.lerp(_v1, _v2, 0.5);
      this.pos.x = _medio.x;
      this.pos.y = _medio.y;
    }


    let c = pg_fondo.get(Math.floor(this.pos.x), Math.floor(this.pos.y));

    // activar para rebota
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) this.libre = true

    if (!this.libre) {
      if (col_tipo == "light") { if (c[0] < 150 && c[1] < 150 && c[2] < 150) this.rebota() }
      else { if (c[0] > 100 && c[1] > 90 && c[2] > 90) this.rebota() }

      const _r = (noise(0.005 * mi_frameCount) - 0.5) * 0.1;
      this.vel.rotate(_r);
    }

    //if (abs(this.accel.x) < 2) this.accel.x *= 1.003 no se justifica
    //if (abs(this.accel.y) < 2) this.accel.y *= 1.003

    this.vel.mult(this.accel);
    this.vel.limit(this.lim); // (3)
    this.pos.add(this.vel); // Mover el punto


    this.memo[this.cont].x = this.pos.x, this.memo[this.cont].y = this.pos.y     // guarda en memo
    pg_pers.erase()
    pg_pers.ellipse(this.memo[this.azar[this.cont]].x, this.memo[this.azar[this.cont]].y, 6, 6);//5, 5);
    this.cont++
    if (this.cont == 90) this.cont = 0 //if (this.cont == 130) this.cont = 0
    pg_pers.noErase()

    // Dibujo del punto
    pg_pers.fill(col_pers[0], random(10, 30)) // 20
    pg_pers.noStroke();
    pg_pers.ellipse(this.pos.x, this.pos.y, 6, 6);//5, 5);

    //pg_fondo.fill(nodos_color[0], random(0, 0.2))//pg_pers.fill(col_pers[0], random(10, 30)) // 20
    //pg_fondo.noStroke();
    //pg_fondo.ellipse(this.pos.x, this.pos.y, 6, 6);//5, 5);

  }

  rebota() {
    this.lim = random([2, 3, 3, 3.5, 4, 4.5]) // ver random y seed
    this.accel.x = 1, this.accel.y = 1;
    this.vel.rotate(PI), this.vel.mult(1.5)// this.vel.mult(0.5); // rotar 180 grados
    //this.pos.add(this.vel); // mover un paso para no quedar "pegado"
  }
}