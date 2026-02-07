/*
"Parachute waltz" - Yamil Burguener - 2026 
https://www.editart.xyz/user/tz1LXx82P2LHyzuGYYxjYFCbChTXWNpYKmTg
*/
let b_pausa = false, b_trigger = false, b_reset = false;
let gl, cv, pg, titInicio, interval_prev, intervalP = 0;
let seccion = "cargando";
let controles = [], cont_cant = 0, cont_co, cont_colEx = [90, 120, 240, 270], cont_cE_n;
let cont_ini_memo = []; let cont_ini = [], bCont_ini = true, cont_s = [];
let cont_modo = "", cont_mute = [false, false, false, false, false];
let cont_ro = [-0.001, 0, 0.001];
const contM = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];
let ini_rotZ;
let mi_m = [];
let fRateN = 0.5;
let cam, cam_rotZ = 0, cam_rotZn, cam_rotSe;
let cam_oscSe = [], cam_oscM = 0.025;
const cam_data = [[100, 0, 50], [0, 100, 52], [100, 0, 57], [0, 100, 60],
[-100, 200, 100], [200, -100, 125], [-200, 300, 140], [300, -200, 150]];
let cam_posM, cam_posIni;
let grilla = [], grilla_sub, grilla_memo = 0, grillaSp = 0, grillaJu = [], b_grillaJu;
let luz_alfa;
let col_data = [0, 0, 0, 0, 0, 0], col_modo;
let marco = [];

let sinte = [], sinte_pan = [], reverb, sinte_par = 0, sinte_parS, sinte_A, sinte_R, sinte_har = 0.7;
let interval_sin, intervalN = 0;
let sinte_osc, sinte_dur, sinte_var = [];
let delay, del_cont, del_var = [];
let subdiv = 0;
const pan_LR = [-0.9, 0.9];
let vol_final, b_sound = false;
const altura_var = [0.08, 0.16, 0.24, 0.3, 0.4];
let altura_modo;
let notas = [], notas_memo = [], notas_cont = 0, modulN = 0;
let tiempo_ms, tiempo_modo, tiempo_delay = 0;
let soundR = [], sound_cont = 0, delayTimeLFO, b_dLFO = false;

let myShader, sh;
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
#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
uniform vec4 uColorHSB; // H:0–360, S:0–100, B:0–100, A:0–1
uniform vec2 uResolution;
float mi_random(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
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

  float h = uColorHSB.x / 360.0;
  float s = uColorHSB.y / 100.0;
  float b = uColorHSB.z / 100.0;
  float a = uColorHSB.w;
  vec3 rgb = hsb2rgb(vec3(h, s, b));
  float r = mi_random(vUv * 1024.0);
  float density = 1.5;
  float threshold = pow(a, density);
  if (r > threshold) discard;
  gl_FragColor = vec4(rgb, 1.0);
}
`;


function preload() {

  const channel1 = new Tone.Channel({ volume: 0, channelCount: 2 });
  const channel2 = new Tone.Channel({ volume: 0, channelCount: 2 });
  const channel3 = new Tone.Channel({ volume: -3, channelCount: 2 });
  const channel4 = new Tone.Channel({ volume: 0, channelCount: 2 });
  const channel5 = new Tone.Channel({ volume: 0, channelCount: 2 })
  for (let i = 0; i < 3; i++) sinte_pan[i] = new Tone.Panner(0)
  let _PanLFO = new Tone.LFO(0.15, -0.75, 0.75).start(); _PanLFO.type = "sine";
  _PanLFO.connect(sinte_pan[2].pan);
  reverb = new Tone.Reverb({ decay: 1, preDelay: 0.02, wet: 0.95 });
  const lp = new Tone.Filter(600, "lowpass");
  const reverb2 = new Tone.Reverb({ decay: 0.5, wet: 0.5 });
  delay = new Tone.FeedbackDelay({ wet: 0 });
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  });
  vol_final = new Tone.Gain(1.1);
  const limiter = new Tone.Limiter(-0.5);

  sinte[0] = new Tone.PolySynth()
  sinte[0].set({
    envelope: {
      attack: 0.01, decay: 0.03, sustain: 0.25, release: 0.13, releaseCurve: [1, 0]
    },
    oscillator: { type: "sawtooth20" },
  })
  sinte[0].chain(channel1); sinte[0].chain(channel2);
  sinte[0].chain(channel3);

  sinte[1] = new Tone.AMSynth()
  sinte[1].set({
    portamento: 100,
    envelope: {
      attack: 0.001, decay: 0.3, sustain: 1, release: 0.1, releaseCurve: [1, 0]
    },
    oscillator: { type: "square" },
    harmonicity: sinte_har,
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.001, decay: 0.3, sustain: 1, release: 0
    }
  })
  sinte[1].chain(sinte_pan[1], channel4);

  channel1.chain(sinte_pan[0], channel5);
  channel2.chain(reverb, lp, channel5);
  channel3.chain(delay, sinte_pan[2], channel5);
  channel4.chain(reverb2, channel5);
  channel5.chain(comp, vol_final, limiter, Tone.Destination);
}


function setup() {

  console.log("::: Parachute waltz - Yamil Burguener 2026");

  setAttributes('preserveDrawingBuffer', true);
  let _size = 1080;
  cv = createCanvas(_size, _size, WEBGL);
  cv.parent("cv"); cv.id("pw"); cv.class("pw");
  gl = cv.GL;

  pixelDensity(1);
  colorMode(HSB);
  imageMode(CENTER);
  strokeWeight(1);

  pg = createGraphics(_size, _size);
  pg.pixelDensity(1);
  pg.colorMode(HSB);
  pg.textAlign(CENTER, CENTER);
  pg.rectMode(CENTER);
  let _fuente = loadFont('./Menlo-Regular.ttf');
  pg.textFont(_fuente);
  sh = createShader(vert, frag);
  myShader = baseStrokeShader().modify({
    'Inputs getPixelInputs': `(Inputs inputs) {
      float a = inputs.color.a;
      vec2 p = inputs.position.xy;
      vec3 p3  = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      float r = fract((p3.x + p3.y) * p3.z);
      inputs.color *= r > a ? 0.5 : 1.0;
      return inputs;
    }`
  });

  // camera config --------------------
  cam = createCamera();
  cam.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  let cameraZ = (height / 2) / tan((PI / 3) / 2.0);
  perspective(1.5, 1, cameraZ / 20, cameraZ * 5);

  let _plX = -85, _plY = -85;
  for (let i = 0; i < 17; i++) { marco[i] = createVector(_plX, _plY); _plX += 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17] = createVector(_plX, _plY); _plY += 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17 * 2] = createVector(_plX, _plY); _plX -= 10; }
  for (let i = 0; i < 17; i++) { marco[i + 17 * 3] = createVector(_plX, _plY); _plY -= 10; }

  frameRate(5);
  seedRandomness();
  prepara_sketch();
}


function prepara_sketch() {
  print(m0, m1, m2, m3, m4); // bug
  mi_m = [m0, m1, m2, m3, m4], cont_s = [m0, m1, m2, m3, m4];
  console.log("::: sound/visual setting");
  // sound setting -----------------------------------
  for (let i = 0; i < 1000; i++) { soundR[i] = randomFull(); }
  // slider1
  cont_ini_memo = [45, 65, 80, 95, 105];
  if (mi_m[0] < 0.5) {
    tiempo_ms = int(map(mi_m[0], 0, 0.5, 5, 15));
    const _de = map(mi_m[0], 0, 0.5, 0.01, 1.9);
    const _we = map(mi_m[0], 0, 0.5, 0, 0.95);
    reverb.set({ decay: _de, wet: _we });
    if (mi_m[0] < 0.1) { sinte_var = [84, 36, 0.3], cont_ini_memo[1] = -1, cont_ini_memo[3] = -1, cont_ini_memo[4] = -1; }
    else if (mi_m[0] < 0.3) { sinte_var = [36, 24, 0.15], cont_ini_memo[2] = -1, cont_ini_memo[4] = -1; }
    else { sinte_var = [24, 24, 0.1], cont_ini_memo[4] = -1; }
  } else {
    tiempo_ms = int(map(mi_m[0], 0.5, 1, 15, 21));
    const _re = map(mi_m[0], 0.5, 1, 1.5, 3);
    reverb.set({ decay: _re });
    sinte_var = [12, 24, 0.4];
  }
  sinte_dur = constrain(map(tiempo_ms, 10, 20, 0.01, 0.75), 0.01, 1);
  const _ro = constrain(map(tiempo_ms, 5, 11, 0.1, 0.001), 0.001, 0.025);
  cont_ro = [-_ro, 0, _ro];
  if (randomM0() < 0.5) cam_oscM = 0.025; else cam_oscM = map(tiempo_ms, 5, 20, 0.02, 0.05);
  const _ha = [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 8]; const _ha1 = int(map(tiempo_ms, 5, 20, 0, _ha.length - 1));
  sinte_har = _ha[_ha1];
  sinte[1].set({ harmonicity: sinte_har });
  console.log("[1] musical tempo (5-20): " + tiempo_ms + "ms");

  // slider2
  let _plus = 0;
  if (mi_m[1] > 0.8) {
    tiempo_modo = "free", altura_modo = 0.4;
    _plus = 0.6;
  } else if (mi_m[1] > 0.35) {
    const _nn = [0, 0.13, 0.25, 0.37, 0.5, 0.63, 0.75, 0.87];
    for (let i = 0; i < 5; i++) cont_s[i] = _nn[int(mi_m[i] * 8)]
    tiempo_modo = "8/4", altura_modo = 0.75;
  } else {
    const _nn = [0, 0.25, 0.5, 0.75];
    for (let i = 0; i < 5; i++) cont_s[i] = _nn[int(mi_m[i] * 4)];
    tiempo_modo = "4/4", altura_modo = 1;
  }
  // delay
  let _de;
  if (randomM1() + _plus < 0.75) {
    const _td = [0.087, 0.075, 0.0667, 0.05, 0.0334, 0.025];
    let _m = int(randomFull() * _td.length);
    tiempo_delay = tiempo_ms * _td[_m];
    if (tiempo_delay > 1) tiempo_delay *= 0.5;
    delay.set({ delayTime: tiempo_delay });
    _de = _m + 1;
    if (b_dLFO) delayTimeLFO.disconnect(delay.delayTime);
    b_dLFO = false;
  } else {
    let _frec = 0.002;
    if (tiempo_modo == "free") _frec = constrain(map(tiempo_ms, 5, 12, 0.08, 0.002), 0.002, 0.08);
    delayTimeLFO = new Tone.LFO(_frec, 0.0001, 0.99).start(); //0.002
    delayTimeLFO.type = "triangle";
    delayTimeLFO.connect(delay.delayTime);
    b_dLFO = true;
    _de = "LFO";
  }
  del_cont = int(randomM1() * 6000);
  console.log("[2] musical quantization: " + tiempo_modo + ", delay mode: " + _de);

  // harmony
  let _mod_txt = "--";
  if (mi_m[3] >= 0.65 && tiempo_ms >= 8) {
    const _m = [2, 3, 4, 5];
    modulN = _m[int(randomM3() * _m.length)];
    _mod_txt = modulN + "st";
  }
  let _arm = "";
  if (tiempo_ms < 8) { notas = [52 + 12, 52 + 1, 52, 52 - 1, 52 - 12]; _arm = "E unison" }
  else if (mi_m[4] < 0.1) { notas = [66, 62 + 1, 59, 55, 52]; _arm = "Emin 7M(9)" }
  else if (mi_m[4] < 0.55) { notas = [66, 62, 59, 55, 52]; _arm = "Emin 7(9)" }
  else if (mi_m[4] < 0.93) { notas = [66, 63, 59, 56, 52]; _arm = "Emaj 7(9)" }
  else if (mi_m[4] < 0.97) { notas = [66, 63 - 1, 59 + 1, 56, 52]; _arm = "Eaug 7(9)" }
  else {
    const _fr = [-1, 1];
    notas = [65 + _fr[int(randomM4() * _fr.length)], 63 + _fr[int(randomM4() * _fr.length)], 59 + _fr[int(randomM4() * _fr.length)],
    55 + _fr[int(randomM4() * _fr.length)], 52]; _arm = "E freak"
  }
  if (mi_m[4] < 0.4 && randomM4() < 0.3) { for (let i = 0; i < 5; i++) notas[i] -= 12; _arm += " bass"; }
  for (let i = 0; i < 5; i++) notas_memo[i] = notas[i];

  sinte_osc = int(randomFull() * 230);
  sinte_parS = 0.01 + randomFull() * 0.004;
  sinte_A = map(tiempo_ms, 5, 20, 0.0001, 0.01);
  sinte_R = map(tiempo_ms, 5, 20, 0.02, 0.03);

  // visual setting -------------------------------------
  // slider3
  cont_co = map(mi_m[2], 0, 1, 0, 360 + 70) % 360;
  const _cd5 = [180, 180, 180, 120, 240, 85, 265];
  col_data[5] = _cd5[int(cont_co) % _cd5.length];
  console.log("[3] color palette: " + int(cont_co) + "º & " + int(cont_co + col_data[5]) % 360 + "º");
  luz_alfa = map(tiempo_ms, 5, 20, 0.04, 0.015);
  del_var[0] = map(mi_m[2], 0, 1, 0.05, 0.3);
  del_var[1] = del_var[0] * 2;

  // slider4
  let _da = "";
  if (mi_m[3] < 0.65) {
    cont_modo = "spins";
    _da = cont_modo;
  }
  else {
    cont_modo = "jumps";
    _da = cont_modo;
    let _ti;
    let _r = randomM3();
    if (_r < 0.4) {
      let _n = 0;
      for (let x = 5; x >= -5; x--) {
        for (let y = 5; y >= -5; y--) {
          grillaJu[_n] = createVector(x * 30, y * 30);
          _n++;
        }
      }
      _da += "10x10"; b_grillaJu = true, _ti = 4;
    }
    else {
      if (_r < 0.52) grilla = [[0, 0], [-100, 0], [100, -100], [0, -100], [-100, -100], [100, 100], [0, 100], [-100, 100], [100, 0]];
      else if (_r < 0.64) grilla = [[0, 0], [100, 100], [0, 100], [-100, 100], [-100, 0], [-100, -100], [0, -100], [100, -100], [100, 0]];
      else if (_r < 0.76) grilla = [[0, 0], [100, -100], [0, -100], [-100, -100], [-100, 0], [-100, 100], [0, 100], [100, 100], [100, 0]];
      else if (_r < 0.88) grilla = [[0, 0], [100, 100], [-100, 100], [0, 0], [100, -100], [-100, -100]];
      else grilla = [[0, 0], [100, -100], [0, -100], [-100, -100], [0, 0], [0, 100]];
      const _zo = constrain(0.5 + randomM3(), 0, 1);
      for (let i = 0; i < grilla.length; i++) { grilla[i][0] *= _zo; grilla[i][1] *= _zo; }

      const _g = [0.05, 0.1, 0.2, 0.25, 0.5, 1];
      const _g2 = int(map(mi_m[3], 0.65, 1, 0, _g.length));
      grilla_sub = _g[_g2];
      _da = cont_modo + grilla_sub; b_grillaJu = false, _ti = 1.75;
    }
    for (let i = 0; i < 5; i++) cont_ini_memo[i] = int(cont_ini_memo[i] * _ti);
  }
  // rotation speed (clock)
  ini_rotZ = 11 + int(randomM3() * 4) * 5;
  if (randomM3() < 0.5) cam_rotSe = 1; else cam_rotSe = -1;
  let _vG, _vG1;
  if (cont_modo == "spins") {
    _vG = [0.02, 0.015, 0.0125, 0.015, 0.01, 0.01, 0.01, 0.007, 0.005];
    _vG1 = int(map(mi_m[0], 0, 1, _vG.length - 1, 0))
  }
  else {
    _vG = [0.01, 0.01, 0.01, 0.0075, 0.005, 0.004, 0.002];
    _vG1 = int(map(mi_m[0], 0, 1, _vG.length - 1, 0))
  }
  cam_rotZn = _vG[_vG1];

  // object position/movement from camera
  let _ca = [0, 6]; if (cont_modo == "jumps") _ca = [3, 8];
  cam_posIni = 20 + int(randomM3() * 30);
  cam_oscSe[2] = abs(cam_oscSe[2]);
  cam_oscSe = cam_data[int(map(randomM3(), 0, 1, _ca[0], _ca[1]))];
  if (mi_m[3] < 0.35 || mi_m[3] > 0.85) cam_oscSe[2] *= -1;

  if (b_grillaJu) {
    cam_oscSe[3] = 0; cam_rotZn *= 0.5;
  } else {
    let _r = randomM3();
    if (_r < 0.17) cam_oscSe[3] = 0; else if (_r < 0.34) cam_oscSe[3] = 100; else cam_oscSe[3] = 50;
  }
  let _r = randomM3();
  if (_r < 0.22) cam_oscSe[4] = 0.2; else if (_r < 0.5) cam_oscSe[4] = 0.1; else cam_oscSe[4] = 0.05;
  const _cr = int(map(cam_rotZn, 0.01, 0.00001, 100, 1));
  console.log("[4] sliders movement: " + _da + ", rotation: ", _cr * cam_rotSe + "%, data: " + cam_oscSe);

  // slider5
  if (mi_m[4] < 0.4) {
    col_modo = "dark", col_data = [100, 90, 1, 5, -4, col_data[5]];
  } else {
    col_modo = "light", col_data = [0, 10, 99, 95, 4, col_data[5]];
  }
  console.log("[5] background: " + col_modo + ", harmony: " + _arm + ", mod: " + _mod_txt);

  for (let i = 0; i < 5; i++) cont_ini[i] = cont_ini_memo[i];
  const _ta = [5, 5, 5, 5, 5];
  controles = [];
  controles.push(new Control(0, cont_s[0], cont_s[1], cont_s[2], cont_s[3], cont_s[4],
    0, 0, 0, cont_co, 0, _ta));

  // reset
  intervalN = 0, intervalP = 0, notas_cont = 0, cont_cant = 0, cont_cE_n = 14, bCont_ini = true;
  cont_mute = [false, false, false, false, false], b_reset = false, cam_rotZ = 0;
  sinte_par = 0, subdiv = 0, grillaSp = 0;
  cam.setPosition(0, 0, 300);
  clearInterval(interval_sin); interval_sin = null; clearInterval(interval_prev); interval_prev = null;
  if (seccion == "jugando") { Rep_sinte(tiempo_ms); Para_preview(); }
  background(col_data[1]);
  titInicio = millis() + 9999;
}


function draw() {

  gl.depthMask(true);
  gl.clearDepth(1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  if (resetAnimation) {
    prepara_sketch();
    resetAnimation = false;
  }

  if (seccion == "cargando") {
    background(col_data[1]);
    intro();
    for (let i = 0; i < controles.length; i++) controles[i].dibuja();
  }
  else {
    renderScene();
  }

  if (frameCount % 1000 === 0) { gl.flush(); gl.finish(); print("gl.flush()") } //bug

  if (intervalP >= 7000 && !b_trigger) {
    clearInterval(interval_prev); interval_prev = null;
    b_trigger = true;
    gl.finish();

    if (typeof triggerPreview === "function") {
      triggerPreview();
    }
    grabaImagen();//bug
  }
}


function renderScene() {
  if (cam_rotZ != 0) {
    cam_rotZ += cam_rotZn * cam_rotSe;
    rotateZ(cam_rotZ);
  }

  let _int = 0;
  if (notas_cont > cam_posIni) {
    // camera swing
    _int = intervalN * cam_posM - cam_posIni;
    const cam_osc = 50 - sin(_int * cam_oscM) * 50;
    const _ang = map(cam_osc, cam_oscSe[0], cam_oscSe[1], HALF_PI, -HALF_PI);
    const camY = 300 * sin(_ang);
    const camZ = 300 * cos(_ang);
    cam.setPosition(0, camY, camZ);
    for (let i = 0; i < controles.length; i++) { controles[i].set_z(cam_osc) }
  }
  else {
    cam_posM = cam_posIni / intervalN;
    for (let i = 0; i < controles.length; i++) { controles[i].set_z(cam_oscSe[3]) }
  }

  if (cont_modo == "spins") {
    const _oscX = cam_oscSe[2] * sin(_int * cam_oscSe[4]);
    if (tiempo_ms < 12 && frameCount % tiempo_ms == 0) {
      grillaSp -= 20;
      if (grillaSp < -100) grillaSp = 100;
    }
    cam.lookAt(_oscX, grillaSp, 0);
  } else {
    if (b_grillaJu) {
      let _n = ((60 + notas_cont) % 110)
      cam.lookAt(grillaJu[_n].x, grillaJu[_n].y, 0);
    }
    else {
      const _i = int(notas_cont * grilla_sub) % grilla.length;
      cam.lookAt(grilla[_i][0], grilla[_i][1], 0);
      if (_i != grilla_memo) {
        let _m = 0;
        if (grilla[_i][1] > 0) _m = modulN; else if (grilla[_i][1] < 0) _m = -modulN;
        for (let i = 0; i < notas.length; i++) {
          notas[i] = notas_memo[i] + _m;
        }
      }
      grilla_memo = _i;
    }
  }

  // controls: drawing, reset, etc.
  if (bCont_ini) {
    if (sinte_par == 3 || b_reset) {
      cont_cant = 0;
      bCont_ini = false;
      if (b_reset) b_reset = false;
      for (let i = controles.length; i > 0; i--) controles.splice(i, 1);
      for (let i = 0; i < 5; i++) { cont_ini[i] = cont_ini_memo[i] + notas_cont - 20; }
    }
  }
  else {
    if (sinte_par == 4) bCont_ini = true;
  }
  for (let i = 0; i < controles.length; i++) controles[i].dibuja();

  // trail
  let _e, _a;
  //if (notas_cont > 200) _e = 200; else if (notas_cont > 160) _e = 60;
  //else if (notas_cont > 80) _e = 20; else _e = 2;
  if (notas_cont > 30) { int(_e = 200 * fRateN); _a = 0.05 }
  else if (notas_cont > 10) { _e = 1; _a = 0.1 }
  else { _e = 1; _a = 0.2 };
  if (frameCount % _e == 0) estela(_a); else { estela(0); }
}

// sound --------------------------------
function suena_sinte(_no) {

  // delay
  let _we = 0.75;
  if (notas_cont <= cam_posIni) _we = constrain(map(notas_cont, 10, cam_posIni - 1, 0, 0.75), 0, 0.75);
  let _d = 0.5 + sin(del_cont * 0.01) * 0.5;
  del_cont++;
  const _f = map(_d, 0, 1, del_var[0], del_var[1]);
  delay.set({ feedback: _f, wet: _we });

  let _pa = -0.5 + sound_random();
  let _at = sinte_A + cos(sinte_osc * 0.0495) * (sinte_A * 0.3)
  let _re = sinte_R + sin(sinte_osc * 0.01) * sinte_R;
  const _va = constrain(map(intervalN % 15000, 1000, 15000, 0, altura_modo), 0, altura_modo);
  let _vol = 0.5, _desaf = false, _repeat = false;
  const _r = sound_random();
  if (_r < altura_var[0] * _va) {
    _no += sinte_var[0]; _vol = sinte_var[2]; bEstela = false;
    if (_no > 100) _no -= 36;
    _at = 0.3; _re = 1.5;
  }
  else if (_r < altura_var[1] * _va) {
    _no -= sinte_var[1]; _vol = 0.9; _pa = 0; _at *= 2;
    delay.set({ feedback: 0, wet: 0.3 });
  }
  else if (_r < altura_var[2] * _va) { _no += 1; }
  else if (_r < altura_var[3] * _va) { _no -= 1; }
  else if (_r < altura_var[4] * _va) { _no += 12, _repeat = true, _at *= 0.3, _re *= 0.3; }
  else if (notas_cont > 20 && sound_random() < 0.05) _desaf = true;

  let _hertz = constrain(Tone.Frequency(_no, "midi").toFrequency(), 20, 40000);
  if (intervalN % (25 - tiempo_ms) == 0) _at *= 0.25;
  sinte_par = int(15 + sin(sinte_osc * sinte_parS) * 12);
  envelope(0, _at, _re);
  sinte[0].set({ oscillator: { type: "sawtooth" + sinte_par } });
  sinte_osc++;
  if (_desaf) _hertz = _hertz * (0.975 + sound_random() * 0.05);

  sinte_pan[0].pan.rampTo(_pa, 0.025);
  if (b_sound) sinte[0].triggerAttackRelease(_hertz, sinte_dur, Tone.now(), _vol);

  if (b_sound && _repeat) {
    let _p = int(sound_random() * 2);
    sinte_pan[1].set({ pan: pan_LR[_p] });
    envelope(1, _at, _re);
    let _ti = ["+" + str(_f * 0.5), "+" + str(_f), "+" + str(_f * 1.5), "+" + str(_f * 2)];
    const _r = constrain(int(sound_random() * 7), 1, 4);
    sinte[1].triggerRelease();
    for (let i = 0; i < _r; i++) {
      sinte[1].triggerAttackRelease(_hertz, _f * 0.4, _ti[i], 0.6);
    }
  }
}

function envelope(_n, _at, _re) {

  sinte[_n].set({ envelope: { attack: _at, release: _re } });
}

function Rep_sinte(_ms) {

  interval_sin = setInterval(() => {
    let _n = [];
    for (let i = 0; i < 5; i++) {
      if (!cont_mute[i]) _n[i] = int(cont_s[i] * 100);
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

        if (notas_cont == ini_rotZ) { cam_rotZ = 0.000001 * cam_rotSe; }

        if (notas_cont % 740 >= 720) posicion_reset();

        if (notas_cont % 160 == 140) {
          const _r = int(sound_random() * contM.length);
          for (let i = 0; i < 5; i++) {
            if (i == contM[_r][0] && sound_random() < 0.5 || i == contM[_r][1] && sound_random() < 0.5) cont_mute[i] = true;
          }
        } else if (notas_cont % 160 == 0) {
          cont_mute = [false, false, false, false, false];
        }
        notas_cont++;
      }
    }
    subdiv++;
    if (subdiv == 100) subdiv = 0;
    intervalN++;
  }, _ms)
}

function Para_preview() {
  interval_prev = setInterval(() => {
    intervalP++;
  }, 15)
}

function estela(_a) {

  push();
  rotateZ(-cam_rotZ);
  translate(cam.eyeX, cam.eyeY, cam.eyeZ);
  const dx = cam.centerX - cam.eyeX;
  const dy = cam.centerY - cam.eyeY;
  const dz = cam.centerZ - cam.eyeZ;
  const yaw = atan2(dx, dz);
  const pitch = -atan2(dy, sqrt(dx * dx + dz * dz));
  rotateY(yaw);
  rotateX(pitch);
  translate(0, 0, 95);
  noStroke();
  if (_a != 0) {
    fill((cont_co + 30) % 360, 2, col_data[2], _a);
    plane(160, 160);
  }
  if (frameCount % int(4 * fRateN) == 0) {
    const _f = int(frameCount * 0.25 / fRateN) % marco.length;
    translate(marco[_f].x, marco[_f].y);
    fill(col_data[1], 0.4);
    plane(10, 10)
  }
  pop();
}

function intro() {

  push();
  noStroke();
  fill((cont_co + 30) % 360, 2, col_data[2], 1);
  plane(160 * 3.15, 160 * 3.15);
  muestra_titulo();
  texture(pg);
  plane(320, 320);
  pop();
}

function posicion_reset() {

  cam_posM = cam_posIni / intervalN;
  cam_posIni = notas_cont;
  cam_rotZ = 0;
  controles[0].reset_z();
  ini_rotZ = notas_cont + 6;
  bCont_ini = true;
  b_reset = true;
}

function crea_controles() {

  let i = cont_cant % 5;
  const _tx = -50 + cont_s[i] * abs(-50 * 2);
  const _ty = [-40, -20, 0, 20, 40];
  const _tz = [100, 150, 200, 240, 270];
  cont_cant++;
  let _zPlus = controles[0].get_z();
  const _rot = cont_ro[int(randomFull() * cont_ro.length)];
  let _ta = constrain(5 - i, 1, 4);
  const _ta1 = [_ta, _ta, _ta, _ta, _ta];
  controles.push(new Control(cont_cant, cont_s[0], cont_s[1], cont_s[2], cont_s[3], cont_s[4],
    _tx, _ty[i % 5], _tz[i % 5] + _zPlus, cont_co, _rot, _ta1));
}

function muestra_titulo() {

  const _t = int((titInicio - millis()) * 0.001);
  if (_t <= 0) {
    seccion = "jugando"; Rep_sinte(tiempo_ms); Para_preview();
    frameRate(30);
  } else {
    pg.clear();
    pg.fill(col_data[0]);
    pg.stroke((cont_co + 30) % 360, 2, col_data[2], 0.5);
    pg.rect(pg.width / 2 - 135, pg.height / 2 + 340, 270, 60);
    pg.rect(pg.width / 2 + 135, pg.height / 2 + 340, 270, 60);
    pg.rect(pg.width / 2 - 135, pg.height / 2 + 400, 270, 60);
    pg.rect(pg.width / 2 + 135, pg.height / 2 + 400, 270, 60);
    pg.fill((cont_co + 30) % 360, 2, col_data[2], 0.5)
    pg.textSize(22);
    pg.text("PARACHUTE WALTZ", pg.width / 2 - 135, pg.height / 2 + 340);
    pg.text("by yamil burguener", pg.width / 2 + 135, pg.height / 2 + 340);
    pg.textSize(20);
    pg.text("click for high-Q", pg.width / 2 - 135, pg.height / 2 + 400);
    pg.text("or wait " + _t + " for low-Q", pg.width / 2 + 135, pg.height / 2 + 400);
  }
}

function sound_random() {

  sound_cont++;
  if (sound_cont > 999) sound_cont = 0;
  return soundR[sound_cont];
}

function grabaImagen() {

  console.log("saving!")
  let now = new Date();
  let seedName = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
  saveCanvas("Parachute_waltz_" + seedName + ".png")
}

function mouseClicked() {

  if (seccion == "cargando") {
    seccion = "jugando"; Rep_sinte(tiempo_ms); Para_preview();
    pg.clear(); //pg.remove();
    mas_definicion(); //frameRate(30);
  }
  b_sound = !b_sound;
  if (b_sound) { vol_final.gain.rampTo(1.1, 0.05); }
  else { vol_final.gain.rampTo(0, 0.05); }
}

function mas_definicion() {
  frameRate(60);
  cv = resizeCanvas(1620, 1620);
  gl = _renderer.GL;
  background(col_data[1]);
  estela(1);
}

function menos_definicion() {
  frameRate(30);
  cv = resizeCanvas(1080, 1080);
  gl = _renderer.GL;
  background(col_data[1]);
  estela(1);
}

function keyReleased() {

  if (key == "q") { // DELETE THIS SECTION bug!!!
    let mi_seed = Math.floor(9999999999 * random());
    print("seed: " + mi_seed);
    randomSeed(mi_seed);
    m0 = random(), m1 = random(), m2 = random(), m3 = random(), m4 = random();
    //5757609933 lindos colores
    seedRandomness();
    prepara_sketch();
  }
  if (key == "s" || key == "S") {
    grabaImagen();
  }
  if (seccion == "jugando" && (key == "p" || key == "P")) {
    b_pausa = !b_pausa;
    if (!b_pausa) { Rep_sinte(tiempo_ms); loop(); }
    else { clearInterval(interval_sin); interval_sin = null; noLoop(); }
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if (key == "l" || key == "L") {
    fRateN = 0.5;
    console.log("set framerate = 30, canvas 1080x1080");
    menos_definicion();
  }
  else if (key == "h" || key == "H") {
    fRateN = 1;
    console.log("set framerate= 60, canvas 1620x1620");
    mas_definicion();
  }
}

function windowResizedUser() {
  // Handle resizing if needed, but since canvas is fixed at 1080x1080, maybe nothing
  // resizeCanvas(canvasWidth, canvasHeight); // If dynamic, but here fixed
}


// ----------------------------------------------
class Control {

  constructor(_index, _m0, _m1, _m2, _m3, _m4, _tx, _ty, _tz, _coBo, _rot, _ta) {
    this.m = [_m0, _m1, _m2, _m3, _m4];
    this.x = [-50, -50, -50, -50, -50];
    this.y = [-40, -20, 0, 20, 40];
    this.alfa = [0, 0, 0, 0, 0];
    this.tx = _tx; this.ty = _ty; this.tz = _tz;
    this.vida = 0;
    this.rot = 0;
    this.rotN = _rot;
    this.ta = _ta;
    this.taM = [this.ta[0], this.ta[0], this.ta[0], this.ta[0], this.ta[0]];
    let _al = [0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
    this.al = _al[_index % 6];
    let _co = [1, 12, 23, 34, 45, 56];
    if (col_modo == "dark") for (let i = 0; i < 6; i++) _co[i] = 100 - _co[i];
    this.co = [];
    // color buttons
    let _c = [];
    if (tiempo_modo != "free") _c = [0, 5, 10, 15, 20]; else _c = [0, 15, 30, 45, 60];
    this.coBo = [_coBo, (_coBo + _c[1]) % 360, (_coBo + _c[2]) % 360, (_coBo + _c[3]) % 360, (_coBo + _c[4]) % 360];
    this.coBmemo = [];
    for (let i = 0; i < 5; i++) this.coBmemo[i] = this.coBo[i];
    // color lines
    for (let i = 0; i < 5; i++) {
      if (i == 1 || i == 3) this.co[i] = (this.coBo[i] + col_data[5]) % 360;
      else this.co[i] = _co[_index % 6] + i * col_data[4];
    }
    this.s = [0, 85, 0, 25, 0];
    if (col_modo == "light") this.b = [0, 25, 0, 85, 0];
    else this.b = [100, 25, 100, 85, 100];
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
    // line base
    shader(myShader);
    if (notas_cont % 32 < 30) stroke(this.co[0], this.alfa[0] * this.al); else stroke(col_data[3], 0.25)
    if (controles.indexOf(this) != 0) {
      let _z1 = 0;
      if (this.vida < 75) _z1 = map(this.vida, 0, 75, -this.tz, 0);
      line(0, 0, _z1, 0, 0, -this.tz + controles[0].get_z())
    }
    // lines
    for (let i = 0; i < 5; i++) {
      if (notas_cont == ini_rotZ || notas_cont % 50 > 44) stroke(col_data[3], 0.25);
      else stroke(this.co[i], this.s[i], this.b[i], this.alfa[i] * this.al);
      if (controles.indexOf(this) != 0) {
        let _x = 0;
        if (this.vida < 75) { } else
          if (this.vida < 150) {
            _x = map(this.vida, 75, 150, 50, 0);
            line(this.x[i] + _x, this.y[i], this.x[i] + 100 - _x, this.y[i])
          }
          else { this.pinta_linea(i); }
      }
      else {
        if (seccion == "cargando") stroke(col_data[0]);
        this.pinta_linea(i);
      }
    }

    noStroke();
    if (controles.indexOf(this) == 0 || ((controles.indexOf(this) != 0) && this.vida > 200)) {
      for (let i = 0; i < 5; i++) {
        push();
        translate(this.x[i] + this.m[i] * abs(this.x[i] * 2), this.y[i], 2);
        if (seccion == "jugando") {
          shader(sh);
          let _hsba = [];
          if (this.alfa[i] > 0.1) {
            const _sa = map(this.alfa[i], 1, 0.1, this.alfa[i] * 30, 80);
            const _br = map(this.alfa[i], 1, 0.1, 100, this.alfa[i] * 50);
            const _al = map(this.alfa[i], 1, 0.1, this.alfa[i] * 0.5, this.alfa[i] * 0.8);
            _hsba = [this.coBo[i], _sa, _br, _al];
          }

          if (this.alfa[i] > 0.1) {
            sh.setUniform("uColorHSB", _hsba);
            sh.setUniform("uResolution", [width, height]);
            plane(this.ta[i], this.ta[i]);
            this.ta[i] += 0.1;
          }
          this.alfa[i] -= luz_alfa;
        }
        else { fill(col_data[0]); plane(5, 5); }
        pop();
      }
    }
    pop();

    this.vida++;
  }

  pinta_linea(i) {
    line(this.x[i], this.y[i], this.x[i] + 100, this.y[i]);
    stroke(this.co[i], 0.4);
    point(this.x[i], this.y[i]); point(this.x[i] + 100, this.y[i]);
  }

  set_luz(i) {

    if (notas_cont % 20 == cont_cE_n) {
      const _c = cont_colEx[int(randomFull() * 4)];
      this.coBo[i] = (this.coBo[i] + _c) % 360;
    }
    else if (notas_cont % 20 == cont_cE_n + 5) {
      for (let j = 0; j < 5; j++) { this.coBo[j] = this.coBmemo[j] };
      cont_cE_n = (cont_cE_n + 1) % 5;
    }
    this.alfa[i] = 1;
    this.ta[i] = this.taM[i];
  }

  busca_rota() {

    return this.rot;
  }

  set_z(_z) {

    if (_z > 50) this.tz += 0.1; else if (_z < 50) this.tz -= 0.1;
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