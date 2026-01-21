/*
https://tonejs.github.io/docs/15.1.22/modules.html
// */

let b_pausa = false, b_trigger = false;
let controles = [], cont_cant = 0, cont_co, cont_colEx = [90, 120, 240, 270], cont_cE_n; // = 34
let cont_ini_memo = [45, 65, 85, 100, 115]; let cont_ini = [], bCont_ini = true, cont_s = [];
let cont_modo = "", cont_mute = [false, false, false, false, false];
let cont_ro = [-0.001, 0, 0.001];
const contM = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];//, [-1, -1], [-1, -1]];//-1 no mutea nada
let bReset = false; // posiciona los sliders derechos, al frente
let cont_rotZ;
let seccion = "cargando";
let mi_m = []
let pg, titInicio;
let fuente;

let cam, cam_rotZ = 0, cam_rotZn, cam_rotSe//, cam_rMar;
let cam_oscSe = [], cam_oscM = 0.025;
const cam_data = [[100, 0, 50], [0, 100, 50], [0, 100, 60], [-100, 200, 120], [200, -100, 150], [-200, 300, 150], [300, -200, 150]]; //el tercer parametro es para lookAt    //para que NO rote agregar:-200,300t
let cam_posM, cam_posIni;
//let plane_alf = 0.1;
let grilla = [], grilla_sub, grilla_memo = 0;
let luz_alfa;
let col_data = [[], [], [], [], []], col_modo;
let planeR = [], plane_cont = 0;
let marco = [];

let sinte = [], sinte_pan = [], reverb, sinte_par = 0, sinte_parS, sinte_A, sinte_R, sinte_har = 0.7;
//let cheby;//pluck;
let interval_sin, intervalN = 0;
let sinte_osc, sinte_dur, sinte_var = [];
let delay, del_cont, del_var = [];
let subdiv = 0;
const pan_LR = [-0.9, 0.9];
let vol_final = [], b_sound = false;
const altura_var = [0.08, 0.16, 0.24, 0.3, 0.4]; //[0.05, 0.1, 0.15, 0.2]
let altura_modo;
let notas = [], notas_memo = [], notas_cont = 0, modulN = 0; // modul = 0, 
let tiempo_ms, tiempo_modo, tiempo_delay = 0;
let soundR = [], sound_cont = 0
let delayTimeLFO;

let myShader;
let sh;
const vert = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec2 vUv;

void main() {
  vUv = aTexCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const frag = `
precision mediump float;
varying vec2 vUv;
uniform vec4 uColorHSB;   // H:0–360, S:0–100, B:0–100, A:0–1
uniform vec2 uResolution;

// hash mi_random
float mi_random(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// HSB → RGB (expects normalized values)
vec3 hsb2rgb(vec3 c) {
  vec3 rgb = clamp(
    abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0,
    0.0,
    1.0
  );
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {

  // --- normalizar HSB p5.js ---
  float h = uColorHSB.x / 360.0;
  float s = uColorHSB.y / 100.0;
  float b = uColorHSB.z / 100.0;
  float a = uColorHSB.w;
  vec3 rgb = hsb2rgb(vec3(h, s, b));

  // dithering por alpha
  float r = mi_random(gl_FragCoord.xy);
  if (r > a) discard;
  gl_FragColor = vec4(rgb, 1.0);
}
`;

function preload() {

  const channel = new Tone.Channel({ volume: 0, channelCount: 2 })
  const channel2 = new Tone.Channel({ volume: 0, channelCount: 2 })
  const channel3 = new Tone.Channel({ volume: 0, channelCount: 2 })
  //const channel4 = new Tone.Channel({ volume: 0, channelCount: 2 })
  // poly synth & pluck synth
  sinte_pan[0] = new Tone.Panner(0); sinte_pan[1] = new Tone.Panner(0)
  reverb = new Tone.Reverb({ decay: 1.9, wet: 0.95 })
  delay = new Tone.FeedbackDelay({ wet: 0 })//.toDestination();

  sinte[0] = new Tone.PolySynth()
  sinte[0].set({
    //volume: -3,
    envelope: {
      attack: 0.01, decay: 0.03, sustain: 0.25, release: 0.13, releaseCurve: [1, 0]
    },
    oscillator: { type: "sawtooth20" }, // hasta 32 parciales
  })
  sinte[0].chain(sinte_pan[0], channel); //reverb, 

  for (let i = 0; i < 3; i++) vol_final[i] = new Tone.Volume(2);
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  })

  sinte[1] = new Tone.AMSynth()//AMSynth(), FMSynth(), MonoSynth
  sinte[1].set({
    portamento: 100,
    envelope: {
      attack: 0.001, decay: 0.3, sustain: 1, release: 0.1, releaseCurve: [1, 0]
    },
    oscillator: { type: "square" }, //sawtooth, triangle, square, sine
    harmonicity: sinte_har,
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.001, decay: 0.3, sustain: 1, release: 0//0.3
    }
  })
  sinte[1].chain(sinte_pan[1], channel3);

  for (let i = 0; i < 3; i++) vol_final[i] = new Tone.Volume(2);

  channel.chain(reverb, comp, vol_final[0], Tone.Destination)//channel.chain(comp, Tone.Destination)
  channel2.chain(channel, delay, vol_final[1], Tone.Destination)  //channel2.chain(channel, delay, Tone.Destination) // channel, delay


  //pluck = new Tone.PluckSynth()//.toDestination();//MetalSynth
  //pluck.chain(channel3);
  //cheby = new Tone.Chebyshev(0)// 300 ¿? set({ order: 100})
  const reverb2 = new Tone.Reverb({ decay: 0.5, wet: 0.5 }) //1, 0.75
  channel3.chain(reverb2, vol_final[2], Tone.Destination)//channel, cheby, reverb2, vol_final[2], Tone.Destination)
}



function setup() {

  let cv = createCanvas(1620, 1620, WEBGL);
  cv.parent("cv"); cv.id("sl"); cv.class("sl");
  // cv.imageSmoothingEnabled = false // bug ¿?
  pixelDensity(1);
  colorMode(HSB);
  imageMode(CENTER);
  rectMode(CENTER);
  //noSmooth();
  strokeWeight(1);

  pg = createGraphics(1620, 1620);
  pg.pixelDensity(1);
  pg.colorMode(HSB);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(22);
  pg.rectMode(CENTER);
  fuente = loadFont('./Menlo-Regular.ttf');
  pg.textFont(fuente);
  sh = createShader(vert, frag);

  myShader = baseStrokeShader().modify({
    'float random': `(vec2 p) {
      vec3 p3  = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }`,
    'Inputs getPixelInputs': `(Inputs inputs) {
      // Replace alpha in the color with dithering by
      // randomly setting pixel colors to 0 based on opacity
      float a = inputs.color.a;
      //inputs.color.a = 1.0;
      inputs.color *= random(inputs.position.xy) > a ? 0.5 : 1.0;
      return inputs;
    }`
  });

  // camera config --------------------
  cam = createCamera();
  cam.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  let cameraZ = (height / 2) / tan((PI / 3) / 2.0);
  perspective(1.5, 1, cameraZ / 20, cameraZ * 5) //cameraZ / 10.0, cameraZ * 10 -> 187 a 18706

  for (let i = 0; i < 3; i++) vol_final[i].mute = true; //sacar bug

  // arma marco
  let _plX = -85, _plY = -85;
  for (let i = 0; i < 17; i++) { marco[i] = createVector(_plX, _plY); _plX += 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17] = createVector(_plX, _plY); _plY += 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17 * 2] = createVector(_plX, _plY); _plX -= 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17 * 3] = createVector(_plX, _plY); _plY -= 10; }

  let mi_seed = Math.floor(9999999999 * random());
  // 6738271180 , 8815953958!! 6483520730,  new
  // 249764199, 7930900029! 2878231690 new2
  print("seed: " + mi_seed);
  randomSeed(mi_seed);
  m0 = random(), m1 = random(), m2 = random(), m3 = random(), m4 = random();
  //  m0 = 0.5; m1 = 0.5, m2 = 0.5, m3 = 0.5, m4 = 0.5; // poner delay tipo 5
  //m0 = 0.666666666//, 
  //m2 = 0.8683887438382953// color lindo bug

  seedRandomness();
  prepara_sketch();
}


function prepara_sketch() {
  print(m0, m1, m2, m3, m4); // bug
  mi_m = [m0, m1, m2, m3, m4], cont_s = [m0, m1, m2, m3, m4];
  console.log("::: Sliders - Yamil Burguener 2026");

  // sound setting -----------------------------------
  console.log("::: sound/visual setting")
  // slider1 , si aumenta tiempo, bajar del sinte release y duracion
  if (mi_m[0] < 0.5) {
    tiempo_ms = int(map(mi_m[0], 0, 0.5, 5, 15)); //5, 15
    const _de = map(mi_m[0], 0, 0.5, 0.01, 1.9);
    const _we = map(mi_m[0], 0, 0.5, 0, 0.95);
    reverb.set({ decay: _de, wet: _we });
    if (mi_m[0] < 0.2) { sinte_var = [84, 36, 0.3], cont_ini_memo[2] = -1, cont_ini_memo[3] = -1, cont_ini_memo[4] = -1; } // anula los ultimos
    else if (mi_m[0] < 0.35) { sinte_var = [36, 24, 0.15], cont_ini_memo[3] = -1, cont_ini_memo[4] = -1; }
    else { sinte_var = [24, 24, 0.1], cont_ini_memo[4] = -1; }
  } else {
    tiempo_ms = int(map(mi_m[0], 0.5, 1, 15, 21)); //15, 21
    const _re = map(mi_m[0], 0.5, 1, 1.5, 0.5);
    reverb.set({ decay: _re });
    sinte_var = [12, 24, 0.4];
  }
  sinte_dur = constrain(map(tiempo_ms, 10, 20, 0.01, 0.75), 0.01, 1);
  const _ro = constrain(map(tiempo_ms, 5, 11, 0.1, 0.001), 0.001, 0.05); // rotacion de los hijos controladores
  cont_ro = [-_ro, 0, _ro];
  if (randomFull() < 0.35) cam_oscM = 0.025; else cam_oscM = map(tiempo_ms, 5, 20, 0.02, 0.05); // antes todo a 0.025. mayor se mueve mas
  print("*** cam_oscM ", cam_oscM)
  let _ha = [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 8]; let _ha1 = int(map(tiempo_ms, 5, 20, 0, _ha.length - 1))
  sinte_har = _ha[_ha1] //_ha[int(randomFull() * _ha.length)];
  sinte[1].set({ harmonicity: sinte_har });
  //let _be = int (1000/tiempo_ms) //5-20
  console.log("[1] musical tempo (5-20): " + tiempo_ms + "ms");

  // slider2
  let _plus = 0;
  if (mi_m[1] > 0.8) { // 0.75
    tiempo_modo = "free"
    altura_modo = 0.4;
    if (tiempo_ms < 8) _plus = 0.5;
  } else if (mi_m[1] > 0.35) {
    const _nn = [0, 0.13, 0.25, 0.48, 0.5, 0.63, 0.75, 0.87]; // mueve los sliders
    for (let i = 0; i < 5; i++) cont_s[i] = _nn[int(mi_m[i] * 8)]
    tiempo_modo = "8/4"; //cuantizado en corcheas
    altura_modo = 0.75;
  } else {
    const _nn = [0, 0.25, 0.5, 0.75];  // mueve los sliders
    for (let i = 0; i < 5; i++) cont_s[i] = _nn[int(mi_m[i] * 4)];
    tiempo_modo = "4/4"; // cuantizado en negras
    altura_modo = 1;
  }

  // delay
  let _de, _deR = randomFull();
  if (_deR + _plus < 0.75) {
    let _m = int(map(_deR, 0, 0.75, 0, 6));
    set_delay(_m);// fija el delay
    _de = _m + 1;
  } else {
    delayTimeLFO = new Tone.LFO(0.002, 0.0001, 0.99).start();  // LFO entre 0.1 y 1 segundos
    delayTimeLFO.connect(delay.delayTime);
    _de = "LFO";
  }
  console.log("[2] musical quantization: " + tiempo_modo + ", delay mode: " + _de);

  // harmony
  let _mod_txt = "--";
  if (mi_m[3] >= 0.7 && tiempo_ms >= 8) { // depende de si es "jumper" en visual
    const _m = [2, 3, 4, 5];
    modulN = _m[int(randomFull() * _m.length)]; //int(map(mi_m[4], 0.7, 1, 6, 2)) //
    _mod_txt = modulN + "st";
  } //else { modulN = 12; }
  let _arm = "";
  if (tiempo_ms < 8) { notas = [52 + 12, 52 + 1, 52, 52 - 1, 52 - 12]; _arm = "E unison" }
  else if (mi_m[4] < 0.1) { notas = [66, 62 + 1, 59, 55, 52]; _arm = "Emin 7M(9)" } //< 0.15
  else if (mi_m[4] < 0.51) { notas = [66, 62, 59, 55, 52]; _arm = "Emin 7(9)" } //["F#5", "D5", "B4", "G4", "E4"];
  else if (mi_m[4] < 0.9) { notas = [66, 63, 59, 56, 52]; _arm = "Emaj 7(9)" } // maj,7 9 -> "F#5", "D#5", "B4", "G#4", "E4" < 0.85
  else { notas = [66, 63 - 1, 59 + 1, 56, 52]; _arm = "Eaug 7(9)" }
  for (let i = 0; i < 5; i++) notas_memo[i] = notas[i];

  del_cont = int(randomFull() * 6000); // valor inicial del delay
  sinte_osc = int(randomFull() * 6000); // valor inicial
  sinte_parS = 0.01 + randomFull() * 0.004;   // valor inicial parciales 0.01-0.014
  sinte_A = map(tiempo_ms, 5, 20, 0, 0.01); // 0, 0.1
  sinte_R = map(tiempo_ms, 5, 20, 0.02, 0.5); // 0.05, 0.5

  // visual setting -------------------------------------
  // slider3
  cont_co = map(mi_m[2], 0, 1, 0, 360 + 70) % 360;
  console.log("[3] color palette: " + int(cont_co));
  luz_alfa = map(tiempo_ms, 5, 20, 0.04, 0.01);// 0.01 a 0.05
  del_var[0] = map(mi_m[2], 0, 1, 0.05, 0.3);
  del_var[1] = del_var[0] * 2;

  // slider4
  let _da = "";
  if (mi_m[3] < 0.7) {
    cont_modo = "Spinning top"; //trompo
    _da = cont_modo;
  }
  else {
    cont_modo = "jumper"; //jumper
    let _r = randomFull();
    if (_r < 0.2) grilla = [[0, 0], [-100, 0], [100, -100], [0, -100], [-100, -100], [100, 100], [0, 100], [-100, 100], [100, 0]]; //tipo texto
    else if (_r < 0.4) grilla = [[0, 0], [100, 100], [0, 100], [-100, 100], [-100, 0], [-100, -100], [0, -100], [100, -100], [100, 0]]; //giro reloj
    else if (_r < 0.6) grilla = [[0, 0], [100, -100], [0, -100], [-100, -100], [-100, 0], [-100, 100], [0, 100], [100, 100], [100, 0]]; //giro -reloj
    else if (_r < 0.8) grilla = [[0, 0], [100, 100], [-100, 100], [0, 0], [100, -100], [-100, -100]]; //giro 8
    else grilla = [[0, 0], [100, -100], [0, -100], [-100, -100], [0, 0], [0, 100]]; //giro triangulo
    const _zo = constrain(0.5 + randomFull(), 0, 1);//randomFull o map mi_m3??? bug
    for (let i = 0; i < grilla.length; i++) { grilla[i][0] *= _zo; grilla[i][1] *= _zo; }
    for (let i = 0; i < 5; i++) cont_ini_memo[i] = int(cont_ini_memo[i] * 2.25); //* 2.5 ... * 3

    const _g = [0.05, 0.1, 0.2, 0.25, 0.5, 1]; //a menor numero cambia menos de lugar la grilla
    const _g2 = int(map(mi_m[3], 0.7, 1, 0, _g.length));
    grilla_sub = _g[_g2];
    _da = cont_modo + " "+ grilla_sub;
  }

  // rotation speed (clock)
  cont_rotZ = 16 + int(randomFull() * 16) * 5; // en que frame empieza a girar
  if (randomFull() < 0.5) cam_rotSe = 1; else cam_rotSe = -1;
  let _vG;
  if (cont_modo == "Spinning top") _vG = [0.02, 0.015, 0.0125, 0.015, 0.01, 0.01, 0.01, 0.005, 0.002]; // vel giro * 0.01 orig
  else _vG = [0.01, 0.01, 0.01, 0.0075, 0.005, 0.001, 0.0001, 0.00001]; //0.0002, 
  cam_rotZn = _vG[int(randomFull() * _vG.length)];
  const _cr = int(map(cam_rotZn, 0.01, 0.00001, 100, 1));

  // object position/movement from camera
  let _ca = [0, 5]; if (cont_modo == "jumper") _ca = [2, 7];
  cam_oscSe = cam_data[int(map(randomFull(), 0, 1, _ca[0], _ca[1]))]; //_cS[int(randomFull() * _cS.length)];
  cam_posIni = 20 + int(randomFull() * 60); // en que frame empieza a rotar hacia abajo
  if (randomFull() < 0.5) cam_oscSe[2] *= -1; // sentido
  let _r = randomFull();
  if (_r < 0.2) { cam_oscSe[3] = 0; }
  else if (_r > 0.8) { cam_oscSe[3] = 100; } else { cam_oscSe[3] = 50; }
  _r = randomFull();
  if (_r < 0.22) { cam_oscSe[4] = 0.1; }
  else if (_r > 0.55) { cam_oscSe[4] = 0.05; } else { cam_oscSe[4] = 0.01; }
  console.log("[4] sliders movement: " + _da +
    ", rotation: ", _cr * cam_rotSe + "%, data: " + cam_oscSe);

  // slider5
  if (mi_m[4] < 0.4) {
    col_modo = "dark";// oscuro
    col_data = [100, 90, 1, 5, -4];
    // color background, fondo, col plane B, line, sentido de this.co
  } else {
    col_modo = "light";// claro
    col_data = [0, 10, 99, 95, 4];
  }
  let _cd5 = [180, 180, 180, 120, 240, 85, 265];
  col_data[5] = _cd5[int(cont_co) % _cd5.length];
  //col_data[5] = 180//bug
  console.log("[5] background: " + col_modo + col_data[5] +
    ", harmony: " + _arm + ", mod: " + _mod_txt);

  // loop setting --------------------
  for (let i = 0; i < 1000; i++) { soundR[i] = randomFull(); }
  for (let i = 0; i < 1000; i++) { planeR[i] = randomFull(); }
  for (let i = 0; i < 5; i++) cont_ini[i] = cont_ini_memo[i];

  controles = [];
  controles.push(new Control(0, cont_s[0], cont_s[1], cont_s[2], cont_s[3], cont_s[4], 0, 0, 0, cont_co));

  background(col_data[1]);
  titInicio = millis() + 9999

  // reset
  intervalN = 0, notas_cont = 0, cont_cant = 0, cont_cE_n = 14, bCont_ini = true;
  cont_mute = [false, false, false, false, false], bReset = false, cam_rotZ = 0;
  sinte_par = 0, subdiv = 0;
}


function draw() {

  if (resetAnimation) {
    prepara_sketch();
    resetAnimation = false;
  }

  if (seccion == "cargando") {
    for (let i = 0; i < controles.length; i++) controles[i].dibuja();
    estela(0.05);
    muestra_titulo();
  }
  else {
    if (cam_rotZ != 0) {
      ////if (abs(cam_rotZ) > HALF_PI) cam_rotZ = 0; // bug
      cam_rotZ += cam_rotZn * cam_rotSe; //para que vaya cambiando 
      rotateZ(cam_rotZ);
    }

    let _int = 0;
    //if (notas_cont % 10 > 1) { _prueba = intervalN * cam_posM - cam_posIni;} // bug
    if (notas_cont > cam_posIni) {

      // vaiven de camara
      _int = intervalN * cam_posM - cam_posIni;//
      const cam_osc = 50 - sin(_int * cam_oscM) * 50; // 100 - 0 (empieza en 50) //* 0.025 bug! ver feature

      const _ang = map(cam_osc, cam_oscSe[0], cam_oscSe[1], HALF_PI, -HALF_PI);// HALF_PI, 0
      const camY = 300 * sin(_ang); //cos
      const camZ = 300 * cos(_ang); //sin

      cam.setPosition(0, camY, camZ); //_oscX. camY, camZ

      for (let i = 0; i < controles.length; i++) { controles[i].set_z(cam_osc) }
    }
    else {
      cam_posM = cam_posIni / intervalN; // M de multiplicacion
      for (let i = 0; i < controles.length; i++) { controles[i].set_z(cam_oscSe[3]) }// 0,[50],100
    }

    if (cont_modo == "Spinning top") {
      const _oscX = cam_oscSe[2] * sin(_int * cam_oscSe[4]); //10 bug!! 50 * .... 0.01
      cam.lookAt(_oscX, 0, 0);//0,0,0
    } else {
      const _i = int(notas_cont * grilla_sub) % grilla.length;
      cam.lookAt(grilla[_i][0], grilla[_i][1], 0);
      if (_i != grilla_memo) {// && _i % grilla.length == 0) {
        // modul = (modul + modulN) % 12; // modula
        let _m = 0;
        if (grilla[_i][1] > 0) _m = modulN; else if (grilla[_i][1] < 0) _m = -modulN;
        for (let i = 0; i < notas.length; i++) {
          notas[i] = notas_memo[i] + _m; // + modul;
          /*  if (notas[4] >= 64) {
             for (let i = 0; i < notas.length; i++) notas[i] = notas[i] - 12;
           } */
        }
      }
      grilla_memo = _i;
    }

    // controles: drawing, reset, etc.
    if (bCont_ini) {
      if (sinte_par == 3 || bReset) {
        if (sinte_par == 3) print("solo ") //bug
        cont_cant = 0; //new
        bCont_ini = false;
        if (bReset) bReset = false;
        for (let i = controles.length; i > 0; i--) controles.splice(i, 1);
        for (let i = 0; i < 5; i++) { cont_ini[i] = cont_ini_memo[i] + notas_cont - 20; }
      }
    }
    else {
      if (sinte_par == 4) bCont_ini = true;
    }
    for (let i = 0; i < controles.length; i++) controles[i].dibuja();

    // estela
    let _e, _a; // 0.01 ... 0.025 .... 0.1
    if (notas_cont > 200) { _e = 200, _a = 0.05 } // 0.025
    else if (notas_cont > 160) { _e = 60, _a = 0.05 } //0.03
    else if (notas_cont > 80) { _e = 12, _a = 0.05 }
    else { _e = 2; _a = 0.1 }

    if (frameCount % _e == 0) estela(_a); else { estela(0); }
  }
}

// sound --------------------------------
function suena_sinte(_no) { // = nota

  ////const _or = int(50 - cos(notas_cont * 0.01) * 50); bug
  ////cheby.set({ order: _or }) bug

  // delay
  let _we = 0.75;
  if (notas_cont <= cam_posIni) _we = constrain(map(notas_cont, 10, cam_posIni - 1, 0, 0.75), 0, 0.75);
  let _d = 0.5 + sin(del_cont * 0.01) * 0.5;
  del_cont++;
  const _f = map(_d, 0, 1, del_var[0], del_var[1]); //0.6, 0.2
  delay.set({ feedback: _f, wet: _we });

  let _pa = -0.5 + sound_random();
  let _at = sinte_A + cos(sinte_osc * 0.0495) * (sinte_A * 0.3)// 0.055 + cos(sinte_osc * 0.0495) * 0.045; // 0.01 a 0.1
  let _re = sinte_R + sin(sinte_osc * 0.01) * sinte_R;  //  * 0.5 // 0.01 a 1

  const _va = constrain(map(intervalN % 15000, 1000, 15000, 0, altura_modo), 0, altura_modo); //% 11000, 1000, 10000
  ////if (bEstela) { _r = -1; print("estela") } // para que suenen agudos con la estela NO ANDA bug
  let _vol = 0.5, _desaf = false, _repeat = false; //_n = 0, 

  const _r = sound_random();
  if (_r < altura_var[0] * _va) {
    _no += sinte_var[0]; _vol = sinte_var[2]; bEstela = false;
    if (_no > 100) { _no -= 36; }
    _at = 0.3; _re = 1.5;
  } //12
  else if (_r < altura_var[1] * _va) {
    _no -= sinte_var[1]; _vol = 0.9; _pa = 0; _at *= 2;
    if (_no < 0) { _no = int(sound_random() * 12); print("bajo " + _no) }
    delay.set({ feedback: 0, wet: 0.3 });
  } //48 
  else if (_r < altura_var[2] * _va) { _no += 1; }
  else if (_r < altura_var[3] * _va) { _no -= 1; }
  else if (_r < altura_var[4] * _va) { _no += 12, _repeat = true, _at *= 0.3, _re *= 0.3; }
  else _desaf = true;

  let _hertz = constrain(Tone.Frequency(_no, "midi").toFrequency(), 20, 40000);

  if (intervalN % (25 - tiempo_ms) == 0) _at *= 0.25;  //variacion
  sinte_par = int(15 + sin(sinte_osc * sinte_parS) * 12); // 12 + .... * 0.012) * 9 
  envelope(0, _at, _re);
  sinte[0].set({ oscillator: { type: "sawtooth" + sinte_par } });
  sinte_osc++;

  if (_desaf && sound_random() < 0.05) _hertz = _hertz * (0.975 + sound_random() * 0.05);

  sinte_pan[0].set({ pan: _pa })
  sinte[0].triggerAttackRelease(_hertz, sinte_dur, Tone.now(), _vol); //


  if (_repeat) {
    //delay.set({ feedback: _f * 0.1 });
    let _p = int(randomFull() * 2);
    sinte_pan[1].set({ pan: pan_LR[_p] });// + sound_random() * 2 })
    envelope(1, _at, _re);
    let _ti = ["+" + str(_f * 0.5), "+" + str(_f), "+" + str(_f) * 1.5, "+" + str(_f * 2)];
    const _r = constrain(int(randomFull() * 8), 0, 4); //int(randomFull() * 8);
    sinte[1].triggerRelease();

    for (let i = 0; i < _r; i++) {
      sinte[1].triggerAttackRelease(_hertz, _f * 0.4, _ti[i], 1);//_vol * 0.75); //sinte_dur * 0.15
    }
  }
}

function envelope(_n, _at, _re) {
  sinte[_n].set({ envelope: { attack: _at, release: _re } });
}

function Rep_sinte(_r) {

  interval_sin = setInterval(() => {

    //entra cada 15 ms. si frameRate esta a 60, entra minimamente mas veces que el frame

    //clearInterval(interval_sin)
    //interval_sin = null; // agragado
    //Rep_sinte(tiempo_ms);
    // if (true) { Rep_sinte(60000 / BPM) } //(BPM > bpmN)
    let _n = []
    for (let i = 0; i < 5; i++) {
      if (!cont_mute[i]) _n[i] = int(cont_s[i] * 100); // mi_m[i]
    }

    for (let i = 0; i < 5; i++) {
      if (_n[i] == subdiv) {
        suena_sinte(notas[i]);
        for (let j = 0; j < controles.length; j++) { controles[j].set_luz(i); }

        if (notas_cont == cont_ini[0]) crea_controles();
        else if (notas_cont == cont_ini[1]) crea_controles();
        else if (notas_cont == cont_ini[2]) crea_controles();
        else if (notas_cont == cont_ini[3]) crea_controles();
        else if (notas_cont == cont_ini[4]) crea_controles();

        if (notas_cont == cont_rotZ) {   // 16 a 96 .... antes == 20
          cam_rotZ = 0.000001 * cam_rotSe//  (0.0001 + randomFull() * 0.0001) * cam_rotSe[int(randomFull() * 2)];
        }

        if (notas_cont % 740 >= 720) {// 600 bug eran 12 notas, ahora 20
          posicion_reset();
        }

        if (notas_cont % 160 == 140) {
          const _r = int(randomFull() * contM.length);
          for (let i = 0; i < 5; i++) {
            if (i == contM[_r][0] && randomFull() < 0.5 || i == contM[_r][1] && randomFull() < 0.5) cont_mute[i] = true;
          }
          // print(cont_mute)
        } else if (notas_cont % 160 == 0) {
          cont_mute = [false, false, false, false, false];
        }
        notas_cont++;
      }
    }
    //if (subdiv % 4 == 0)  suena_pluck();

    subdiv++;
    if (subdiv == 100) subdiv = 0; // 4/4 0 25 50 75

    intervalN++; // simil frame Count

    if (intervalN == 14300 && !b_trigger) { //11000  (calculo: 720*100/5 = 14400)
      b_trigger = true;
      triggerPreview();
      grabaImagen(); // bug
    }
  }, _r)
}

function estela(_a) {
  //if (_a == 0.02 && seccion == "jugando") bEstela = true;


  push();
  // ir a la posición de la cámara
  rotateZ(-cam_rotZ);
  translate(cam.eyeX, cam.eyeY, cam.eyeZ);

  // orientar el plano como la cámara
  const dx = cam.centerX - cam.eyeX;
  const dy = cam.centerY - cam.eyeY;
  const dz = cam.centerZ - cam.eyeZ;
  const yaw = atan2(dx, dz);
  const pitch = -atan2(dy, sqrt(dx * dx + dz * dz));
  rotateY(yaw)// + random(-0.05,0.05));
  rotateX(pitch)//+ random(-0.05,0.05));

  /*   if (seccion == "jugando") {
      const _ro = constrain(map(notas_cont, 0, 180, 0.03, 0.06), 0, 0.06);
      rotateX(-_ro + plane_random() * _ro * 2);
      rotateY(-_ro + plane_random() * _ro * 2);
      translate(0, 0, 110);//0,0,95// 0,0,50 /1080x1080
    } else { */
  // adelantar el plano frente a la cámara
  translate(0, 0, 95);
  //}
  noStroke();

  if (_a != 0) { //if (bPlano) {
    //print("borra", _a)
    //let _ta = 160;
    /* if (notas_cont > 100) {
      if (_taR == 1) _ta = int(100 + plane_random() * 60);
      print("entro", _ta)
      _a = 0.2//_a * randomFull()*0.9
      const _hsba = [(cont_co + 30) % 360, 2, col_data[2], _a]
      shader(sh);
      sh.setUniform("uColorHSB", _hsba);
      sh.setUniform("uResolution", [width, height]);
    } else  */
    fill((cont_co + 30) % 360, 2, col_data[2], _a); // orig
    plane(160, 160); // 160, 160 .....  85,85 /1080x1080
    if (seccion == "cargando") {
      rotateY(PI);
      texture(pg);
      plane(160, 160);
    }
  } //else {
  if (frameCount % 4 == 0) {
    /* const _s = [-1, 1];
    let _plX, _plY;
    _plX = (plane_random() * 85) * _s[int(plane_random() * 2)];
    _plY = 85 * _s[int(plane_random() * 2)] //(81 + plane_random() * 7) * _s[int(plane_random() * 2)];
    if (plane_random() < 0.5) { let _m = _plX; _plX = _plY; _plY = _m; }
    translate(_plX, _plY); */
    const _f = int(frameCount * 0.25) % marco.length;
    translate(marco[_f].x, marco[_f].y);
    fill(col_data[1], 0.4); //fill(0, 100, 100, 0.5);
    plane(10, 10)
  }
  // }

  pop();

}

function posicion_reset() {
  cam_posM = cam_posIni / intervalN;
  cam_posIni = notas_cont;
  cam_rotZ = 0;// 0.000001 * cam_rotSe;
  controles[0].reset_z();
  cont_rotZ = notas_cont + 6; // + 1
  bCont_ini = true;
  bReset = true;
}

function crea_controles() {
  let i = cont_cant % 5;
  const _tx = -50 + cont_s[i] * abs(-50 * 2);
  const _ty = [-40, -20, 0, 20, 40];
  const _tz = [50, 100, 150, 200, 250];
  cont_cant++;
  let _zPlus = controles[0].get_z();
  controles.push(new Control(cont_cant, cont_s[0], cont_s[1], cont_s[2], cont_s[3], cont_s[4],
    _tx, _ty[i % 5], _tz[i % 5] + _zPlus, cont_co));
}

function muestra_titulo() {
  pg.clear();
  pg.fill(col_data[0]);
  pg.stroke((cont_co + 30) % 360, 2, col_data[2], 0.5)//pg.stroke(col_data[2]);
  //pg.rect(pg.width / 2, pg.height / 2 + 400, 500, 120);
  pg.rect(pg.width / 2 - 135, pg.height / 2 + 340, 270, 60);
  pg.rect(pg.width / 2 + 135, pg.height / 2 + 340, 270, 60);
  pg.rect(pg.width / 2 - 135, pg.height / 2 + 400, 270, 60);
  pg.rect(pg.width / 2 + 135, pg.height / 2 + 400, 270, 60);
  pg.fill((cont_co + 30) % 360, 2, col_data[2], 0.5)
  //pg.fill(col_data[2])//; pg.noStroke();
  pg.text("S L I D E R S", pg.width / 2 - 135, pg.height / 2 + 340);
  pg.text("by yamil burguener", pg.width / 2 + 135, pg.height / 2 + 340);
  const _t = int((titInicio - millis()) * 0.001);
  pg.text("CLICK TO START", pg.width / 2 - 135, pg.height / 2 + 400);
  pg.text("or wait (" + _t + ") seconds", pg.width / 2 + 135, pg.height / 2 + 400);
  if (_t <= 0) {
    seccion = "jugando"; Rep_sinte(tiempo_ms); // ms independiente de draw()
    pg.clear(); //pg.remove(); // 
    //vol_final.mute = true;
    //hacia_jugando()
  }
}

function set_delay(_i) {
  let _td = [0.025, 0.0334, 0.05, 0.0667, 0.075, 0.08];
  //let _r = int(randomFull() * _td.length);

  tiempo_delay = tiempo_ms * _td[_i];
  if (tiempo_delay > 1) tiempo_delay *= 0.5; // bug por si es > 1
  delay.set({ delayTime: tiempo_delay });

}

function sound_random() {

  sound_cont++;
  if (sound_cont > 999) sound_cont = 0;
  return soundR[sound_cont];
}

function plane_random() {

  plane_cont++;
  if (plane_cont > 998) { plane_cont = 0; print("********* reset 0") };
  //print(plane_cont, planeR[plane_cont])
  return planeR[plane_cont];
}

function grabaImagen() {

  console.log("saving!")
  let now = new Date();
  let seedName = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
  saveCanvas("Sliders_" + seedName + ".png")
}

function mouseClicked() {

  if (seccion == "cargando") {
    seccion = "jugando"; Rep_sinte(tiempo_ms); // ms independiente de draw()
    pg.clear();//pg.remove();
  }

  b_sound = !b_sound;
  if (b_sound) { for (let i = 0; i < 3; i++) vol_final[i].mute = false; }
  else { for (let i = 0; i < 3; i++) vol_final[i].mute = true; }
  // print("entro", b_sound)
}

function keyReleased() {

  if (key == "s" || key == "S") {
    grabaImagen();
  }
  if (seccion == "jugando" && (key == "p" || key == "P")) {
    b_pausa = !b_pausa;
    if (!b_pausa) {Rep_sinte(tiempo_ms); loop(); }
    else { clearInterval(interval_sin); interval_sin = null; noLoop(); }
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
class Control {

  constructor(_index, _m0, _m1, _m2, _m3, _m4, _tx, _ty, _tz, _coBo) {
    this.m = [_m0, _m1, _m2, _m3, _m4];
    this.x = [-50, -50, -50, -50, -50];
    this.y = [-40, -20, 0, 20, 40];
    this.alfa = [0, 0, 0, 0, 0]; //

    this.tx = _tx; this.ty = _ty; this.tz = _tz;

    this.vida = 0;

    this.rot = 0
    const _ro = cont_ro;
    if (_index != 0) { this.rotN = _ro[int(randomFull() * _ro.length)]; this.ta = [3, 3, 3, 3, 3]; } // = 2
    else { this.rotN = 0; this.ta = [5, 5, 5, 5, 5]; }
    this.taM = [this.ta[0], this.ta[0], this.ta[0], this.ta[0], this.ta[0]]; // memo. para que exploten
    let _al = [0.5, 0.4, 0.3, 0.2, 0.1, 0.05];//[0.7, 0.65, 0.4, 0.2, 0.15, 0.1];
    this.al = _al[_index % 6];
    let _co = [1, 12, 23, 34, 45, 56]; // 15, 30, 45, 60, 70];
    if (col_modo == "dark") for (let i = 0; i < 6; i++) _co[i] = 100 - _co[i];
    this.co = [];


    let _c = []; // color botones
    if (tiempo_modo != "free") _c = [0, 5, 10, 15, 20]; else _c = [0, 15, 30, 45, 60];

    this.coBo = [_coBo, (_coBo + _c[1]) % 360, (_coBo + _c[2]) % 360, (_coBo + _c[3]) % 360, (_coBo + _c[4]) % 360]; //[30,35,40,45,50]
    this.coBmemo = [];
    for (let i = 0; i < 5; i++) this.coBmemo[i] = this.coBo[i];
    // color lineas
    for (let i = 0; i < 5; i++) {
      if (i == 1 || i == 3) this.co[i] = (this.coBo[i] + col_data[5]) % 360;
      else this.co[i] = _co[_index % 6] + i * col_data[4]; //4
    }

    this.s = [0, 85, 0, 25, 0];
    if (col_modo == "light") this.b = [0, 25, 0, 85, 0];
    else this.b = [100, 25, 100, 85, 100];
    //this.s = [0, 85, 0, 25, 0]; antes
    //this.b = [0, 25, 0, 85, 0];

  }

  dibuja() {

    push();
    let thisIndex = controles.indexOf(this);
    if (thisIndex > 0) {
      let _z = controles[0].busca_rota()
      rotateZ(_z);
    }

    translate(this.tx, this.ty, this.tz);
    rotateZ(this.rot);
    this.rot += this.rotN;
    // linea base
    shader(myShader);
    if (notas_cont % 32 < 30) stroke(this.co[0], this.alfa[0] * this.al); else stroke(col_data[3], 0.25)
    if (controles.indexOf(this) != 0) {
      let _z1 = 0;
      if (this.vida < 100) _z1 = map(this.vida, 0, 100, -this.tz, 0);
      line(0, 0, _z1, 0, 0, -this.tz + controles[0].get_z())
    }

    // lineas
    for (let i = 0; i < 5; i++) {
      ////print("lineas blancas")
      if (notas_cont == cont_rotZ || notas_cont % 50 > 44) // % 70 > 66
      { stroke(col_data[3], 0.25); }// //100, 0.25
      else stroke(this.co[i], this.s[i], this.b[i], this.alfa[i] * this.al);
      if (controles.indexOf(this) != 0) {
        let _x = 0;

        if (this.vida < 100) { } else
          if (this.vida < 200) {
            _x = map(this.vida, 100, 200, 50, 0);
            line(this.x[i] + _x, this.y[i], this.x[i] + 100 - _x, this.y[i])
          }
          else {
            line(this.x[i], this.y[i], this.x[i] + 100, this.y[i]); // todo duplicad abajo, arreglar
            stroke(this.co[i], 0.3)//, noFill();
            point(this.x[i], this.y[i]), point(this.x[i] + 100, this.y[i])
          }
      }
      else {
        if (seccion == "cargando") stroke(col_data[0]); //  bug era 0
        line(this.x[i], this.y[i], this.x[i] + 100, this.y[i]);
        stroke(this.co[i], 0.3)
        point(this.x[i], this.y[i]), point(this.x[i] + 100, this.y[i])
      }
    }

    noStroke();
    if (controles.indexOf(this) == 0 || ((controles.indexOf(this) != 0) && this.vida > 200)) {
      for (let i = 0; i < 5; i++) {
        push();
        // if (notas_cont % 81 < 78) fill(this.co[i], 100, 0, this.al); else fill(100, 0.25);
        translate(this.x[i] + this.m[i] * abs(this.x[i] * 2), this.y[i], 2);
        //// plane(4, 4);

        if (seccion == "jugando") {
          shader(sh);
          let _hsba = [];
          //  if (this.alfa[i] > 0.8) { //> 0.9
          //    _hsba = [this.coBo[i], this.alfa[i] * 30, 100, this.alfa[i] * 0.5];
          //  } else 
          if (this.alfa[i] > 0.1) { // > 0.4
            const _sa = map(this.alfa[i], 1, 0.1, this.alfa[i] * 30, 85);
            const _br = map(this.alfa[i], 1, 0.1, 100, this.alfa[i] * 90);
            const _al = map(this.alfa[i], 1, 0.1, this.alfa[i] * 0.5, this.alfa[i] * 0.8);
            //  sh.setUniform("uColorHSB", [this.coBo[i], 100, this.alfa[i] * 70, constrain(this.alfa[i], 0.7, 0.3)]);
            _hsba = [this.coBo[i], _sa, _br, _al];
            ////_hsba = [this.coBo[i], 85, this.alfa[i] * 90, this.alfa[i] * 0.8]
          }

          if (this.alfa[i] > 0.1) { // > 0.4
            sh.setUniform("uColorHSB", _hsba);
            sh.setUniform("uResolution", [width, height]);
            plane(this.ta[i], this.ta[i]);
            this.ta[i] += 0.1;
          }
          this.alfa[i] -= luz_alfa;
        }
        else { fill(col_data[0]); plane(5, 5); } // fill 0

        pop();
      }
    }
    pop();

    this.vida++;
  }

  set_luz(i) {
    if (notas_cont % 20 == cont_cE_n) { //% 40 == 34
      const _c = cont_colEx[int(randomFull() * 4)];
      this.coBo[i] = (this.coBo[i] + _c) % 360;
    } // 
    else if (notas_cont % 20 == cont_cE_n + 5) { //% 40 == 39
      for (let j = 0; j < 5; j++) { this.coBo[j] = this.coBmemo[j] };
      cont_cE_n = (cont_cE_n + 1) % 5; //% 35 ....decia:% 75
      //print(" no "+cont_cE_n)
    }
    this.alfa[i] = 1;
    this.ta[i] = this.taM[i];
  }

  busca_rota() {

    return this.rot;
  }

  set_z(_z) {
    if (_z > 50) this.tz += 0.12; else if (_z < 50) this.tz -= 0.12; //0.2
    // if (controles.indexOf(this) == 0) print(this.tz)
  }

  get_z() {
    return this.tz;
  }

  reset_z() {
    this.tz = 0;
  }


  final() {

    if (this.vida < 0) { return true; }
    else { return false; }
  }
}
