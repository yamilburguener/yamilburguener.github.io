let DURACION // bug
let mi_width, mi_height
let bVer = false // bug
let seccion = "cargando"
let b_preview = true
let modelo
let titInicio
let b_play = true
///let bFin = false
const pixel = 1
let cajas = []//, cajas_n = 0//, cajas_ac_n = 0, cajas_pos = [], 
let cajas_mo = [0, 1, 0, 1]//, cajas_fC = 40 // quien se mueve
let c_years //años
//let cajas_SW = 0 // 0 a 0.5 para lineas
let pos_x = [[], [], [], []]
let pos_y = [[], [], [], []]
let pos_n = -1////, pos_n4 = -0.25
let pos_dist = [1, 0.5, 0.25, 0.125] // para que se muevan menos cuanovayan par atras
let pos_red = 0.5 // porcentaje q reduce la caja
let pos_toX = [40, 40, 40, 40], pos_toY = [40, 40, 40, 40] // para mover las cajas , orig: 40
let pos_toXm = [20, 20, 20, 20], pos_toYm = [20, 20, 20, 20] // mitad orig: 20
let pos_fX = [], pos_fY = []// posicion final en X
let pos_desX = [], pos_desY = [] //para donde se desintegra
let p_dX_inc // inclinacion
let p_dCant // 15 para torres, 25 para boom
const p_ta = 140 // tamaño, puede ser 100 a 170
const p_dir = [[-p_ta, 0], [0, -p_ta], [p_ta, 0], [0, p_ta]] // direccion de las torres
let p_dir_pa = 0, p_dir_fo = [[1, 3], [1, 3, 3, 3, 3], [3, 1, 1, 1, 1]] //patron yforma
let pos_sin // cambiar para que las  sinusoides/mantañas se ubiquen en otro lugar
let pos_sL // 0.001 cambiar para la onda mas estirada
let pos_sA = 2 // amplitud del sin()
let pos_dN, pos_dNR
let pos_ini
let pos_gralP
let pos_rot = [[], []]
let dias, dias_memo
let b_rect = true // para version sin cuadrados
let gralR = [], gral_cont = 0
let txtR = [], txt_cont = 0
let repAR = [], repA_cont = 0
//let b_bang = true
//let cod_car = ["┐ ", "└ ", "┴ ", "┬ ", "├ ", "─ ", "┼ "]
const cod_car = ["×", "■", "o", "┐ ", "└", "┴", "┬", "├", "─", "┼", "│",
  "─", "─", "■", "o", "■", "─", "■",] // caracteres
let cod_sel = [] // se selecciona solo algunos caracteres de cod_car
let cod_cad = [] // se arma una cadena de codigos con cod_sel
let cod_n = 0 // contador
let col_gral = [] // para colores de cajas
let col_H = [10, 20, 20, 30, 30, 40, 40, 50, 180, 200, 330], col_Hn, col_sat = 0.2, col_Hsec = []
let col_ra = 20 //rango
let lin_opc = ["izq", "der", "arr", "aba"] // donde hacer la linea
let col_tipo = "", col_back = [], col_tit //dark //light
let inicioVel = 0.2, lim_fC = [800, 400, 500, 600, 700]// [400, 200, 250, 300, 350]
let fuente = [] // bug
let pg_fondo, pg_delete, pg_titulo
let color_get = []
let frame_cont = 0
let mov_vel
let solX, solY
let activo_c // cantidad de _ac     

//let sound_ON = true, 
let soundR = [], sound_cont = 0, repe_cont = -1, b_sound = false
let poly, panPo, reverb
let poly_cont = 0, poly_set = []
let sampler = [], sampler_set = [], sampler_loaded = [[false], [false]], feedbackDelay, panSa
const escala = [36, 38, 39, 41, 43, 46, 48, 50]// [36, 36, 38, 40, 43, 45, 47, 48]// 
let melodia = [], melo_cont = -1, intervalo_ar, melo_sig = -1
let subdivision
let pluck, panPl, intervalo_pl
let pluck_set = [
  [], // ritmo cantidad -0.02 0 -0.04 //_cnC  cantidad de notas pluck
  [], // resonancia
  [-3, -12, -6, -12]] // volumen [0, -6, -3, -6]]
let pluck_res // para resonancia
let membrana, memb_set = [[], [], [], []]//   bMemb_walk = false, let repe_cont5 = 0
let intervalo_A//, repe_cont4 = 0
let delay
let vol_final
const notas_c = [
  //"C-1", "C#-1", "D-1", "D#-1", "E-1", "F-1", "F#-1", "G-1", "G#-1", "A-1", "A#-1", "B-1",
  "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0",
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
  "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8",
  "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9", "G#9", "A9", "A#9", "B9"]
let BPM, bpmN, seccionM = "" // seccion musica
let ritmo = [[], [], []] // ritmo,nota
let desaf
let b_bajo = true, b_tenido = true, b_grano = true


p5.disableFriendlyErrors = false // bug: cambiar a true

function preload() {
  const channel = new Tone.Channel({ volume: 0, channelCount: 2 })

  // poly synth & pluck synth
  panPo = new Tone.Panner(0)
  reverb = new Tone.Reverb({ decay: 0.7, wet: 0.89 })
  poly = new Tone.PolySynth()
  poly.set({
    volume: -6,
    envelope: {
      attack: 0, decay: 0, sustain: 0.01, release: 0.001, releaseCurve: [1, 0]
    },
    oscillator: { type: "triangle16" },
  })
  poly.chain(panPo, reverb, channel);

  panPl = new Tone.Panner(0)
  pluck = new Tone.PluckSynth()
  pluck.chain(panPl, channel)

  // samplers
  panSa = new Tone.Panner(0)
  feedbackDelay = new Tone.FeedbackDelay({ wet: 0.5 })
  sampler[0] = new Tone.Sampler({
    C3: 'dirtyp_c1.mp3', C4: 'dirtyp_c2.mp3', C5: 'dirtyp_c3.mp3', C6: 'dirtyp_c4.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[0] = true; }
  })
  sampler[0].chain(panSa, feedbackDelay, channel)

  sampler[1] = new Tone.Sampler({
    C3: 'purep_c1.mp3', C4: 'purep_c2.mp3', C5: 'purep_c3.mp3', C6: 'purep_c4.mp3'

  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[1] = true; }
  })
  sampler[1].chain(panSa, feedbackDelay, channel)

  // membrane synth
  const filter = new Tone.Filter({ frequency: 500, type: "peaking", gain: 10 })
  membrana = new Tone.MembraneSynth({ pitchDecay: 0.01 })
  membrana.set({
    volume: -3, detune: -2400,
    envelope: {
      attack: 0.05, decay: 0.01, sustain: 0.1, release: 0.3,
      releaseCurve: [1, 0]
    },
  })
  membrana.chain(filter, channel)

  vol_final = new Tone.Volume(2)
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  })
  channel.chain(comp, vol_final, Tone.Destination)


  // seed ----------------------
  mi_seed =  Math.floor(9999999999 * $fx.rand())
   //5031263608, 5393399812, 2623904095, 937774893, 1623785141, 7502086168, 9434509439
  randomSeed(mi_seed)
  noiseSeed(mi_seed)


  // visual setting ------------------
  fuente[0] = '-apple-system' // loadFont('./assets/font/712_serif.ttf')//
  fuente[1] = loadFont('./assets/font/Ubuntu-L.ttf')// Ubuntu-L.ttf') //futura //Ubuntu-L.ttf
  let _rS = random()
  if (_rS < 0.5) { mi_width = 2160, mi_height = 2160 } //4x3 = 2160x2880  (1080x864)
  else if (_rS < 0.85) { mi_width = 2160, mi_height = 2700 }
  else { mi_width = 2700, mi_height = 2160 }

  modelo = random(["boom", "towers", "rain"])
  let _rY = random()
  if (_rY < 0.05) c_years = int(random(12, 20))
  else if (_rY < 0.25) c_years = int(random(20, 41))
  else if (_rY < 0.65) c_years = int(random(41, 61))
  else c_years = int(random(61, 81))
  col_Hn = int(random(col_H.length))
  if (random() < 0.6) { col_tipo = "light", col_back = [5, 90], col_tit = 0 }
  else { col_tipo = "dark", col_back = [5, 10], col_tit = 100 }
  if (random() < 0.05) b_rect = false
  pos_ini = int(random(80)) // en que lugar comienza la primera torre
  p_dX_inc = random([-40, -30, -15, -7, 7, 15, 30, 40])
  if (modelo == "boom") p_dX_inc *= 0.3 //
  let _pX, _pY = random(30, 60)
  let _pX_m = [200, 460]
  if (c_years > 69) _pX_m = [330, 490]
  print("_pY " + _pY) // amplitud en Y del infinito
  let _redX = 1; if (c_years < 30 && random() < 0.4) {
    if (modelo != "boom" && random() < 0.8) _redX = 0.25; else _redX = 2
  } //reduce
  if (modelo == "boom") { // modelo boom -----------
    _pX = random(_pX_m[0], _pX_m[1] - 110) //_pX = random(200, 350)
    for (let i = 0; i < 80; i++) { // 40
      pos_fX[i] = _pX * cos((i + pos_ini) * 0.31 * _redX) + mi_width * 0.25; //cos((i + pos_ini) * 0.31)
      pos_fY[i] = (_pY * 2) * sin((i + pos_ini) * 0.62) + mi_height * 0.25 // 60 *
    }
    col_ra = 80 //60
    pos_dNR = 0.6
    p_dCant = 25
    col_gral[2] = 50
    col_Hsec[0] = 120, col_Hsec[1] = 240
    p_dir_pa = int(random(4))
  }
  else {
    // modelo torres / lluvia
    _pX = random(_pX_m[0], _pX_m[1]) //490
    print("_px: " + _pX)
    let _yy = 0, _y1 = 0;
    let _y2 = 0; if (random() < 0.5) _y2 = random(0.01, 0.1)
    if (modelo == "rain") {
      const _m = map(_pX, 200, 460, 80, 180); _yy = _m
      if (_y2 != 0) _y2 += 0.15
    }
    else { const _m = map(_pX, 200, 460, 180, 80); _yy = mi_height / 2 - _m }
    print("espiral " + _y2)
    for (let i = 0; i < 80; i++) {
      if (modelo == "rain") _y1 += i * _y2; else _y1 -= i * _y2 // . para que se corra el circuito
      pos_fX[i] = _pX * cos((i + pos_ini) * 0.2 * _redX) + mi_width * 0.25 //cos((i + pos_ini) * 0.2)
      pos_fY[i] = _pY * sin((i + pos_ini) * 0.4) + _yy + _y1 // 30 *
    }
    col_ra = 20
    pos_dNR = 0.85
    p_dCant = 15
    if (random() < 0.35) { col_gral[2] = -15, col_Hsec[0] = 10, col_Hsec[1] = 350 }//0.3 mono claro suave  bug
    else { col_gral[2] = 50, col_Hsec[0] = 80, col_Hsec[1] = 280 }
  }
  if (random() < 0.2) col_gral[3] = random(10, 20); else col_gral[3] = 70

  if (modelo == "boom" || random() < 0.7) { pos_rot[0] = 0.05, pos_rot[1] = 0.1 }
  else { pos_rot[0] = 0.025, pos_rot[1] = 0.05 } // bug

  ajusta_limite()
  dias = random([5, 7, 7, 9, 10, 10, 15])
  if (c_years > 50 && dias == 15) c_years = int(c_years * 0.5)
  dias_memo = dias
  if (dias != 15) pos_gralP = 0.998; else pos_gralP = 0.9995
  activo_c = 0.07; if (random() < 0.5) activo_c = 0.07

  // sound setting -------------------
  bpmN = int(random(27, 33)); if (random() < 0.65) bpmN += 10 //  < 0.75
  Tone.Transport.bpm.value = bpmN * 2

  subdivision = random(["8n", "8n", "8t", "16n", "16n.", "16t", "32n", "32n."])
  subdivision = "8n"
  print("subdivision " + subdivision)
  const _m = map(bpmN, 30, 40, 0.4, 0.2) //0.3, 0.2
  if (modelo != "boom") {
    pluck_res = 8, desaf = 0.5, pluck_set[0] = -0.02,
      sampler_set[0] = 128, sampler_set[1] = 24, sampler_set[2] = 0.1, sampler_set[3] = _m
    // sampler[4] = ["+0.84", "+0.35", "+0.63"]    //Para cambiar las duracions??
    sampler_set[5] = 0; if (modelo == "rain") sampler_set[5] = 1 // tipo de sample
  }
  else {
    pluck_res = 15, desaf = 1, pluck_set[0] = -0.01//-0.035,
    sampler_set[0] = 64, sampler_set[1] = 32, sampler_set[2] = 0.12, sampler_set[3] = _m * 2
    sampler_set[5] = random([0, 1])
  }
  if (random() < 0.7) sampler_set[4] = 0.65; else sampler_set[4] = 0.1 // acordes tenidos
  for (let i = 0; i < pluck_res; i++) { pluck_set[1][i] = random(0.2) }
  let _r = random([0, 0, 1])
  for (let i = 0; i < 16; i++) {
    memb_set[0][i] = random([0.01, 0.2, 0.2])

    if (_r == 0) if (i % 4 == 0 && random() < 0.8) memb_set[1][i] = 1; else memb_set[1][i] = 0 // walk completo
    else if (_r == 1) if (i % 8 == 0 && random() < 0.9) memb_set[1][i] = 1; else memb_set[1][i] = 0 // walk 1/2
  }
  memb_set[2] = [0.01, 0.2]
  memb_set[3] = random([0, 4, 8])
  print("memb_set[3] " + memb_set[3])
  poly_set[0] = 128
  poly_set[1] = [0, 0, 12, 24, 24]
  poly_set[2] = [12, 11, 12, 13, 12]

  const _mp = random([-2, -1, 0, 1, 2])
  for (let i = 0; i < escala.length; i++) { // modular la melodia
    escala[i] = escala[i] + _mp
  }
  /* if (modelo != "boom") {
    sampler.disconnect()
    sampler.chain(channel) 
  } */


  // saque los creategrapphic de aca

  // fxhash features ---------------------
  let _cH = (col_H[col_Hn] + col_ra / 2) % 360; if (modelo == "boom") _cH += 40
  let _mc = int(_cH) + "s°"; if (!b_rect) _mc = "---"

  let _te = "fast"; if (bpmN < 35) _te = "slow"
  let _mf = "more stable"; if (modelo == "boom") _mf = "more chaotic"

  $fx.features({
    "size": mi_width + "x" + mi_height,
    "model": modelo,
    "background": col_tipo,
    "main color hue": _mc,
    "years": c_years,
    "calendar": dias + "x" + dias,
    "tempo": _te,
    "musical form": _mf
  })

  console.log("Gum calendar. Yamil Burguener. 2025")
  console.log("seed number: " + mi_seed)
  console.log(JSON.stringify($fx.getFeatures()))
}



function setup() {
  const cv = createCanvas(mi_width, mi_height)
  cv.parent("cv")
  cv.id("gc")
  cv.class("gc")
  pixelDensity(pixel)
  colorMode(HSB)
  strokeCap(SQUARE)
  // textos --------------
  textWrap(CHAR)
  noSmooth()
  cod_cad[0] = "" // estaba bien arriba esta linea al inicio de visual setting
  // saque de aca y lleve a preload()

  // loop setting --------------------
  for (let i = 0; i < 1000; i++) {
    soundR[i] = random()
    gralR[i] = random()
    txtR[i] = random()
    repAR[i] = random()
  }
  // ---------------------------
  pg_fondo = createGraphics(mi_width, mi_height)
  pg_fondo.colorMode(HSB)
  arma_fondo()
  pg_fondo.drawingContext.shadowOffsetX = random([-3, -2, 2, 3])
  pg_fondo.drawingContext.shadowOffsetY = random([-3, -2, 2, 3])
  if (col_tipo == "dark") pg_fondo.drawingContext.shadowColor = color("#eeeeee22")
  else pg_fondo.drawingContext.shadowColor = color("#22222233")
  pg_delete = createGraphics(mi_width, mi_height)
  arma_delete()

  pg_titulo = createGraphics(mi_width * 0.25, mi_height * 0.25) // createGraphics(540, 540)
  pg_titulo.colorMode(HSB)
  pg_titulo.textFont(fuente[1]), pg_titulo.textAlign(RIGHT)
  titInicio = millis() + 9999
  // -----------------------------------
  dias = 4
  genera_cajas()
}

// ------------------------------------------------
function draw() {
  image(pg_fondo, 0, 0)
  if (bVer) image(pg_delete, 0, 0) // bug

  if (seccion == "cargando") {
    for (let i = 0; i < cajas.length; i++) {
      cajas[i].dibuja()
    }
    arma_titulo()
  }
  else if (seccion == "jugando") {

    if (frame_cont % 20 == 0) { //(frameCount % cajas_fC == 0) 
      for (let n = 0; n < 4; n++) { cajas_mo[n] = int(gral_random() * 2) }
      //  cajas_fC = int(gral_random() * 40) + 20 // int(random(20, 60))
    }
    for (let n = 0; n < 4; n++) {
      for (let i = 1; i <= dias; i++) { // el 0 y 11 no se mueven
        const ii = int(i / 2) * 2

        if (cajas_mo[n] % 2 == 0 && gral_random() < 0.5) {

          let _pX = pos_x[n][i] + noise(mov_vel * frame_cont + (ii * 1000)) * pos_toX[n] - pos_toXm[n] //0.01. poner 0.05 para aumentar la vel
          if (_pX > (pos_x[n][i - 1] + 40) && _pX < (pos_x[n][i + 1] - 40)) pos_x[n][i] = _pX
        }
        else if (cajas_mo[n] % 2 == 1 && gral_random() < 0.5) {
          let _pY = pos_y[n][i] + noise(mov_vel * frame_cont + (ii * 1000)) * pos_toY[n] - pos_toYm[n]
          if (_pY > (pos_y[n][i - 1] + 40) && (_pY < pos_y[n][i + 1] - 40)) pos_y[n][i] = _pY
        }
      }
    }

    for (let i = 0; i < cajas.length; i++) {
      cajas[i].mueve_cajas()
      cajas[i].dibuja()
      if (cajas[i].final()) { cajas.splice(i, 1) }
    }

    if (frameCount > -1) {
      if (frameCount % lim_fC[0] == lim_fC[1]) {
        if (pos_n < c_years) genera_cajas()
        reduce_cajas((pos_n - 1) % 4)
      }
      else if (frameCount % lim_fC[0] == lim_fC[2] ||
        frameCount % lim_fC[0] == lim_fC[3]) { reduce_cajas((pos_n - 1) % 4) }
      else if (frameCount % lim_fC[0] == lim_fC[4]) {

        reduce_cajas((pos_n - 1) % 4)
        ajusta_limite()
      }
    }

    if (pos_n < c_years) click()

    // sound ------------------------------
    let _c = map(poly_cont, 500, 0, 2, 6) // 3,9
    _c = int(_c + sound_random() * _c) //int(random(_c, _c * 2)
    if (seccionM == "A") {
      if (poly_cont > 0 && poly_cont < 500) {
        poly_cont += 2
      }
      else if (poly_cont > 499) seccionB()
      //let _c = map(poly_cont, 500, 0, 2, 6) // 3,9
      //_c = int(_c + sound_random() * _c) //int(random(_c, _c * 2)
      if (frameCount % _c == 0) { //_c + 10
        if (pos_n % 12 != 11 || modelo == "boom") suena_poly() // sinte Poly 12 != 0
      }
    }
    else if (seccionM == "B") {
      if (poly_cont > 0) {
        //const _c = map(poly_cont, 500, 0, 2, 6)
        if (frameCount % _c == 0) {
          suena_poly() // sinte Poly
        }
        else poly_cont -= 1
        if (poly_cont == 400) {
          inicioVel = 0.3
          ////print("vel " + inicioVel)
        }
        else if (poly_cont == 0) poly_cont = 2
      }
    }
    // }
    frame_cont++
  }

  if (frameRate() < 50) {
    for (let i = 0; i < cajas.length; i++) {
      if (cajas[i].caja_bTexto()) cajas[i].saca_texto()
    }
  }
}

// sound --------------------------------
function suena_poly() { // sinte Poly
  //if (sound_ON) {
  panPo.set({ pan: -1 + sound_random() * 2 })//random(-1, 1) })
  const _re = 0.3 + sound_random() * 0.6
  reverb.set({ wet: _re })//random(0.5, 0.9) })

  let _n
  let _r = poly_set[1][int(sound_random() * 5)] //random([0, 0, 12, 24, 24]), _n //0, 2, 2, 2, 2
  if (_r == 0) _n = 80 + sound_random() * 5920;
  else _n = notas_c[melodia[melo_cont % melodia.length] + _r]

  let _v = map(_re, 0.3, 0.9, 0.2, 0.004) // 0.3, 0.9, 0.2, 0.008
  if (b_grano) poly.triggerAttackRelease(_n, 0.001, Tone.now(), _v) // dur: 0.01
  //}
}

function suena_armo(_d) { // sampler + poly

  if (melo_sig % 4 == 0) melo_cont++

  const _m = melodia[abs(melo_cont) % melodia.length]
  ///print("melo cont "+melo_cont, _m)
  if ((pos_n % 8 == 7 && repe_cont % 128 == 0) || (pos_n == c_years && repe_cont % 32 == 0)) { // agudo
    let _n = notas_c[_m + 60]
    if (sound_random() < desaf) _n = desafina(_m + 60)
    let _d1 = sound_random() + 0.3
    if (b_grano) poly.triggerAttackRelease(_n, _d1, "+0.08", 0.01)
  }

  // contramelo
  if (repe_cont % poly_set[0] == 0 && sound_random() < 0.95 && pos_n % 4 == 3) {
    const _r = poly_set[2][int(sound_random() * 5)]
    //const _n1 = notas_c[_m + _r]// random([12, 11, 12, 13, 12])] // 12, 24
    let _d = 0.01; if (repe_cont % 3 == 0) _d = 0.03
    if (b_grano) poly.triggerAttackRelease(notas_c[_m + _r], _d, "+0.01", 0.07)
    if (sound_random() < 0.9) poly_set[0] = 2; else poly_set[0] = 32
  }

  if (repe_cont % sampler_set[0] == 0 && pos_n < (c_years - 3)) {
    panSa.set({ pan: -0.8 + sound_random() * 1.6 }) // random(-0.75, 0.75) })
    //let _r = "16t"//(1  + cos(repe_cont * 0.001)) * 0.5// * sampler_set[3])
    //_r = constrain(_r, sampler_set[2], 1)
    let _r
    if (modelo != "boom") _r = subdivision;
    else _r = sampler_set[2] + sound_random() * (sampler_set[3] - sampler_set[2])
    if (pos_n > (c_years - 8)) _r = 0.7 + sound_random() * 0.3//, _r = constrain(_r, 0.1, 1)}//, print("sampler * 1.75 " + _r) }

    let _r1 = sampler_set[4]; if (seccionM == "B") _r1 = 0.35  // 0.8 -.... 0.4
    if (sound_random() < _r1) feedbackDelay.set({ delayTime: _r, feedback: 0.99 })//
    else {
      ////print("-frena")
      let _r2 = 0.1; if (modelo == "boom") _r2 = 0.06
      feedbackDelay.set({ delayTime: _r2, feedback: 0.9 })
      let _n = notas_c[melodia[1] - 19]
      if (b_tenido) poly.triggerAttackRelease(_n, 5, "+0.89", 0.032) // 0.02
      _d = 3
    }
    if (b_rect) {
      if (b_tenido) sampler[sampler_set[5]].triggerAttackRelease(notas_c[melodia[0]], _d, Tone.now(), 0.24)// 0.09
      let _n = notas_c[melodia[1] + 12]
      if (sound_random() < desaf + 0.2) _n = desafina(melodia[1] + 12)
      if (b_tenido) sampler[sampler_set[5]].triggerAttackRelease(_n, _d, "+0.02", 0.066)// "+0.35", 0.037) //+0.15     0.2
      _n = notas_c[_m + sampler_set[1]]  //notas_c[melodia[2] + sampler_set[1]]
      if (sound_random() < desaf + 0.2) _n = desafina(_m + sampler_set[1])//melodia[2] + sampler_set[1])
      if (b_tenido) sampler[sampler_set[5]].triggerAttackRelease(_n, _d, "+0.04", 0.05)//"+0.63", 0.024) // +0.23     0.2
    }
  }
}

function desafina(_nA) { // nota afinada
  const _hertz = Tone.Frequency(_nA, "midi").toFrequency()
  _nD = _hertz * (0.975 + sound_random() * 0.05)
  return _nD
}

function suena_pluck(_ri, _fr) {

  if (seccionM == "B") repe_cont++ //orig
  panPl.set({ pan: -1 + sound_random() * 2 }) // random(-1, 1) })
  let _re, _vo
  if (sound_random() > pos_n * 0.004) {
    _re = pluck_set[1][repe_cont % pluck_res]; _vo = pluck_set[2][repe_cont % 4]
  }
  else {
    _re = 0.1 + sound_random() * 0.8; _vo = pluck_set[2][repe_cont % 4] * 0.1
  }
  pluck.set({ resonance: _re })
  pluck.set({ volume: _vo })

  if (poly_cont == 0) {
    if (b_grano) pluck.triggerAttack(notas_c[(_ri + 24) % 120], Tone.now())
  } //_ri + 12
  else {
    const _f = 80 + sound_random() * (_fr - 80)
    if (b_grano) pluck.triggerAttack(_f, Tone.now())
  }
}

function suena_memb(_d, _v, _bool) { // sinte membrana

  if (_bool && frame_cont % 4 != 0) {
    let _t2 = "+0"; if (sound_random() < 0.5) _t2 = "+" + str(BPM / 93.75) //187.5
    if (b_tenido) sampler[(sampler_set[5] + 1) % 2].triggerAttackRelease(notas_c[melodia[melo_cont % melodia.length]], 1.5, _t2, _v * 0.38)
    ////print(notas_c[melodia[melo_cont % melodia.length]], _v, _t2)
  }
  let _su = 0.15; if (sound_random() < 0.5) _su = 0.001  //if (repe_cont % 64 == 32) _su = 0.001
  membrana.set({ envelope: { sustain: _su, release: 0.3 } })
  if (b_bajo) membrana.triggerAttackRelease(notas_c[melodia[melo_cont % melodia.length]], _d, "+0.01", _v)

}

function suena_memb2(_d, _v) { // sinte membrana

  const _r = memb_set[2][int(sound_random() * 2)]
  if (b_bajo) membrana.set({ envelope: { sustain: _r, release: memb_set[0][repe_cont % 9] } })
  let _n = int(noise(0.1 * repe_cont) * 36) + 36//* 48) + 36

  if (pos_n % 4 == 2) poly.triggerAttackRelease(notas_c[_n - 12 % 120], 0.25, "+0.01", 0.025)
  if (b_bajo) membrana.triggerAttackRelease(notas_c[_n], _d, Tone.now(), _v)
}


function Rep_armo(_r) { //sampler

  intervalo_ar = setInterval(() => {
    clearInterval(intervalo_ar)
    if (BPM > bpmN) { Rep_armo(60000 / BPM) }
    suena_armo(2)
  }, _r)
}

function Rep_pluck(_r) { // sinte Pluck

  intervalo_pl = setInterval(() => {
    clearInterval(intervalo_pl)
    if (BPM > 6) {
      if (repe_cont % 5 == 0) BPM -= 5
      Rep_pluck(3750 / BPM);
    }
    suena_pluck(0, 4000)//(4, 3000)
  }, _r)
}

function Rep_A(_r) { // loop asimetrico // bug cuidado no para con key "p"

  intervalo_A = setInterval(() => {
    repe_cont++

    const _nn = int(map(poly_cont, 0, 500, 1, 8))
    let _lo = ritmo[0].length
    if (poly_cont != 0) _lo = 16
    const _i = repe_cont % _lo// ritmo[0].length// - (_nn - 1)


    if (ritmo[2][_i] == 1) {
      let _d = map(pos_n % 30, 0, 30, 0.01, 0.5)//0.001, 0.4
      suena_armo(_d)//
    }
    let bPluck = true
    if (_i == 0 || (_i == (_lo - memb_set[3]) && repA_random() > 0.4)) { //gral_random() > 0.4
      if (pos_n > 2 && pos_n < (c_years - 4) && (pos_n % 8 != 7 || modelo == "boom")) {
        suena_memb(0.08, 0.15, (_i == 0))
        suena_pluck(ritmo[1][_i], 400); bPluck = false
      }
      if (_i == 0) melo_sig++
    }
    else if (modelo != "boom" && pos_n > 39 && pos_n < (c_years - 5)) { // bajo caminado walk
      if (memb_set[1][repe_cont % 16] && pos_n % 2 == 0) suena_memb2(0.05, 0.05) // 
    }

    if (bPluck && ritmo[0][_i % _lo] == 1 && pos_n % 20 != 0 && pos_n < (c_years - 1)) suena_pluck(ritmo[1][_i], _nn * 500)
  }, _r)
}

function arma_melo(_v) {

  let _r = 9 //int(random(6, 12)) // bug
  for (let i = 0; i < _r; i++) {
    //melodia[i] = escala[int(0.5 * escala.length)] + _v //bug
    melodia[i] = escala[int(gral_random() * escala.length)] + _v //gral_random() * esc.....
  }
  ////print("melodia " + sound_cont)
  /* else { // modula
    for (let i = 0; i < melodia.length; i++) {
      melodia[i] = melodia[i] + _v
    }
  } */
}

function arma_ritmo() { // cambiar todo a gral_sound?

  let _co = 32 // compas
  let _ri = [-24, 0, 0, 24, 36] // ver si lo paso a var global
  if (modelo == "boom") _co = 33 + int(gral_random() * 17) //33, 50)) // 24 a 36
  ////print("compas " + _co)
  //let _dirR = "desc"
  let _cn
  if (gral_random() < 0.5) {
    //_dirR = "asc" // ritmo asc o desacel hacia los extremos
    _cn = 0.33; pluck_set[0] = abs(pluck_set[0]) //_cn = 0.33
  } // orig: 0.66, 0.01
  else { _cn = 1 } //, -cn = 1 // cantidad notas 

  if (modelo == "boom") _cn *= 0.6
  //if (_dirR == "asc") {
  //  _cn = 0.33; if (modelo == "boom") _cn = 0
  //   pluck_set[0] = abs(pluck_set[0]) } // orig: 0.66, 0.01
  let _cS1 = 0, _cS2 = 0
  if (pos_n != 0) {// para que cambie solo la mitad
    if (gral_random() < 0.5) { _cS1 = 0, _cS2 = int(_co / 2) }
    else { _cS1 = int(_co / 2), _cS2 = 0 }
  }
  for (let i = _cS1; i < _co - _cS2; i++) {
    _cn = _cn + pluck_set[0] // -0.01 gradiente hacia inicio o fin
    ////print("cn " + _cn)
    if (i > 6 && i % 2 == 1) ritmo[0][i] = 0
    else if (gral_random() < _cn) ritmo[0][i] = 1; else ritmo[0][i] = 0
    ritmo[1][i] = melodia[i % melodia.length] + _ri[int(gral_random() * _ri.length)]// random([-24, 0, 0, 24, 36])
    //if (i % 2 == 1) ritmo[2][i] = 0
    //else if (sound_random() < 0.2) ritmo[2][i] = 1; else ritmo[2][i] = 0 // ritmo melo
    if (i % 8 != 0 && gral_random() < 0.4) ritmo[2][i] = 0; else ritmo[2][i] = 1
  }
}

function seccionA() {
  //print("A")
  seccionM = "A"
  clearInterval(intervalo_A) // frena seccion loop asimetrico
  clearInterval(intervalo_pl) // bug
  //if (sound_ON) 
  pluck.triggerRelease(Tone.now()) // bug
  repe_cont = -1 // bug?
  poly_cont = 0
  let _t = int(-1 + gral_random() * 2); if (pos_n == -1) _t = 0 ////random([-1, 1])
  arma_melo(_t)
  BPM = bpmN
  Rep_A(1875 / BPM)
}

function seccion_toB() {
  ///print("to B")
  inicioVel = 0.15
  melo_sig = 0// = true
  poly_cont = 1
}

function seccionB() {
  ///print("B")
  seccionM = "B"
  clearInterval(intervalo_A) // frena seccion loop asimetrico
  repe_cont = 0
  poly_cont = 500
  arma_melo(2)
  suena_armo(2)
  BPM = 120
  clearInterval(intervalo_ar)
  Rep_armo(15000 / BPM);
  clearInterval(intervalo_pl)
  Rep_pluck(15000 / BPM);
  suena_memb(4, 0.3, true)
  melo_sig = 0
}





// ------------------------------------------------------------------------
function genera_cajas() {

  // codigos --------------------------------
  for (let i = 0; i < 5; i++) {
    cod_sel[i] = cod_car[int(txt_random() * cod_car.length)]//random(cod_car.length))]
  }
  if (modelo != "boom") {
    gral_cont = 0 // reset
    frame_cont = 0// reset
  }
  cajas_mo = [0, 1, 0, 1]//, cajas_fC = 40 // reset bug

  // cajas -----------------------------
  if (random() < pos_dNR) pos_dN = 0.0625; else pos_dN = 0.125
  if (pos_n < c_years) {
    pos_n++;
    ////print("pos_n: " + pos_n)
  }
  pos_sin = int(random(20)) * 100, pos_sL = random(0.001, 0.003)

  if (pos_n < 40) { ///pos_n == 0{
    col_sat = 0.8 // mas desaturado
    mov_vel = 0.01
    if (seccionM == "A") inicioVel = 0.2
  }
  else if (pos_n < c_years) {
    col_sat = 0.2 //mas saturado
    mov_vel = 0.1 // mas histerico -> cuadrados con menos cambios
    if (seccionM == "A") {
      if (pos_n < (c_years - 6)) inicioVel = 0.11; else inicioVel = 0.22
    }
  }
  //ajusta_limite()
  ////pos_n4 += 0.25
  for (let i = 0; i < cajas.length; i++) {
    if (cajas[i].torre_fin()) { cajas.splice(i, 1) }   // elimina torre vieja
  }

  const _n = pos_n % 4
  pos_x[_n][0] = 1, pos_y[_n][0] = 1
  const _cX = width / dias, _cY = height / dias
  for (let i = 1; i <= dias; i++) {
    pos_x[_n][i] = i * _cX //random(2160)
    pos_y[_n][i] = i * _cY //random(2160)
  }
  //pos_x[_n][10] = 2160, pos_y[_n][10] = 2160 // como es < 11, no hace falta este
  pos_x[_n] = sort(pos_x[_n], pos_x[_n].length)
  pos_y[_n] = sort(pos_y[_n], pos_y[_n].length)
  pos_dist[_n] = 1
  pos_toX[_n] = 40, pos_toY[_n] = 40, pos_toXm[_n] = 20, pos_toYm[_n] = 20

  if (pos_n < c_years) {
    let _rD
    if (modelo == "towers") _rD = 1;
    else if (modelo == "rain") _rD = 3;
    else {
      if (p_dir_pa == 0) _rD = random([1, 3])
      else if (p_dir_pa == 1) _rD = p_dir_fo[0][pos_n % 2]
      else if (p_dir_pa == 2) _rD = p_dir_fo[1][pos_n % 5]
      else _rD = p_dir_fo[2][pos_n % 5]
    } //1= es para arriba
    pos_desX[pos_n] = p_dir[_rD][0], pos_desY[pos_n] = p_dir[_rD][1]

    let _oI = [] //  orden inicio
    for (let i = 0; i < dias * dias; i++) {
      if (i < 5) _oI[i] = 0; else _oI[i] = - int(gral_random() * 100)// * 200
    }

    _oI = shuffle(_oI)
    let _oI_cont = 0

    for (let xx = 0; xx < dias; xx++) {
      for (let yy = 0; yy < dias; yy++) {

        let _cL = 0 // color de rect / linea
        if (gral_random() < 0.2) _cL = 255
        let _ac = true // si esta activo
        if (gral_random() < activo_c) _ac = false //|| 0.07
        if (xx == 0 && yy == 0) { _ac = true; _cL = 255 }//if (xx == 5 && yy == 5) _ac = true

        cajas.push(new Caja(_ac, pos_x[_n][xx], pos_y[_n][yy],
          pos_x[_n][xx + 1] - pos_x[_n][xx], pos_y[_n][yy + 1] - pos_y[_n][yy],
          _cL, xx, yy, pos_n, _oI[_oI_cont]))
        _oI_cont++
      }
    }
  }

  if (seccion == "jugando") {
    if (pos_n % 8 == 0) {
      pos_sA = random([1, 2, 2, 2, 3, 4])

      //if (modelo == "boom") pos_sA *= 2
      ///print("pos_sA " + pos_sA)
    }

    // sound ----------------------------
    if (modelo == "boom") {
      if (pos_n == 14 || pos_n == 20 + 8 || pos_n == 34 + 8 || pos_n == 48 + 8
        || pos_n == 62 + 8) seccion_toB()
      else if (pos_n == 20 || pos_n == 34 || pos_n == 48 || pos_n == 62
        || pos_n == 76) seccionA()

      if (pos_n == 0 || seccionM == "B") arma_ritmo()
    }
    else if (pos_n % 16 == 0) arma_ritmo()

    //if (pos_n % 16 == 0) {
    /*let _cR
      for (let i = 0; i < pluck_res; i++) {
       if (sound_random() < pos_n * 0.005) { _cR = random([0.3, 0.3, 0.9]), print("wwww " + _cR) }
       else _cR = 0.001 + sound_random() * 0.1
       pluck_set[1][i] = _cR 
     } */ // bug: modificar random
    //}
  }
  if (pos_n == c_years && gral_random() < 0.6) {
    //grabaImagen() // bug provisorio
    prevista() 
  }
}

function ajusta_limite() {
  lim_fC = [800, 80, 160, 240, 320]// [800, 400, 500, 600, 700]//[400, 200, 250, 300, 350]
  for (let i = 0; i < 5; i++) { lim_fC[i] = int(lim_fC[i] * inicioVel) }
}

function elije_caja() {

  let _i = 0, _te = 0
  for (let i = 0; i < cajas.length; i++) {
    if (cajas[i].caja_bTexto()) _te++
  }
  if (_te >= 2) _i = 100 // hasta 2 textos en total

  while (_i < 99) {
    const _c = int(txt_random() * cajas.length)// int(random(cajas.length))
    _i = cajas[_c].caja_texto(_i)
    _i++
  }
}



function reduce_cajas(_d) {

  const _po = (pos_n - 1) //% 40
  pos_dist[_d] *= pos_red
  for (let i = 0; i <= dias; i++) { // 10 ????
    pos_x[_d][i] = pos_x[_d][i] * pos_red + pos_fX[_po]// 100 - 1030
    pos_y[_d][i] = pos_y[_d][i] * pos_red + pos_fY[_po]//height * 0.25 // + _pY
  }
  pos_toX[_d] *= pos_red * 1.5, pos_toXm[_d] *= pos_red * 1.5, pos_toY[_d] *= pos_red * 1.5, pos_toYm[_d] *= pos_red * 1.5
}

function busca_color(x, y) {  // color capture ----------------
  let _x = int(x), _y = int(y)
  //let _color
  //if (pixelDensity() != 0.5) {
  const _d = pixel
  const off = (_x * _d * 4) + (_y * width * pow(_d, 2) * 4)
  //_color = [color_get[off], color_get[off + 1], color_get[off + 2], color_get[off + 3]]
  //if (_color[0] == undefined) _color = [0, 10]
  if (color_get[off] == 0 && random() < 0.95) return true; else return false
  //}
  /*  else {
    _color = [0, 10]
  } */

  //return _color
}


function fin_todo() {

  const _dT = 0.03 + sound_random() * 0.04
  feedbackDelay.set({ delayTime: _dT, feedback: 0.8 })// feedbackDelay.set({ delayTime: 0.05, feedback: 0.8 })
  clearInterval(intervalo_A) // frena seccion loop asimetrico
  clearInterval(intervalo_pl) // bug
  clearInterval(intervalo_ar) // bug agudo loco quedó sonando
  pluck.triggerRelease(Tone.now()) // bug

  prevista()

  noLoop()
}

function prevista() {
  if (b_preview) {
    $fx.preview()
    grabaImagen() // bug provisorio
    print("DUR: " + ((millis() - DURACION) * 0.001) / 60) // bug provisorio
    b_preview = false
  }
}

function arma_delete() {
  pg_delete.background(255)

  // rayo ------------------
  let _sW = 30 // 20
  if (random() < 0.64) {
    const _v = [0, width]
    let _vT = int(random(2))
    let _dY
    // if (modelo == "towers") _dY = 0.4;
    // else if (modelo == "rain") _dY = 0.8; else _dY = random([0.4, 0.8])
    let _delX = _v[_vT], _delY = height * random(0.4, 0.8), _se = 1 // sentido

    if (_vT == 0) {
      while (_delX < width) {
        _sW *= 1.2, _se *= -1
        let _delX1 = _delX + random(200, 600), _delY1 = _delY + (random(100, 600) * _se)// 200,500 * _se
        pg_delete.strokeWeight(_sW), pg_delete.line(_delX, _delY, _delX1, _delY1)
        _delX = _delX1, _delY = _delY1
      }
    }
    else {
      while (_delX > 0) {
        _sW *= 1.2, _se *= -1
        let _delX1 = _delX + random(200, 600) * -1, _delY1 = _delY + (random(200, 500) * _se)
        pg_delete.strokeWeight(_sW), pg_delete.line(_delX, _delY, _delX1, _delY1)
        _delX = _delX1, _delY = _delY1
      }
    }
  } else _sW = 200

  // circulos
  pg_delete.strokeWeight(_sW * 0.6)
  const _fo = int(random(1, 4))
  for (let i = 0; i < _fo; i++) {
    if (random() < 0.5) {
      if (random() < 0.2) pg_delete.fill(0)
      pg_delete.circle(random(width), random(height), random(50, 500))
    }
  }

  if (random() < 0.35) { // < 0.2
    pg_delete.imageMode(CENTER)
    pg_delete.push()
    pg_delete.translate(width / 2, height / 2)
    pg_delete.rotate(HALF_PI)
    pg_delete.image(pg_delete, 0, 0)
    pg_delete.pop()
  }


  // sol ---------------------
  if (modelo != "towers") pg_delete.rect(solX - 20, solY - 20, 40, 40)

  // circulos borde
  if (abs(p_dX_inc) < 10) {
    let _cX
    for (let i = 0; i < 3; i++) {
      if (random() < 0.5) _cX = min(pos_fX) * 2; else _cX = max(pos_fX) * 2
      if (random() < 0.75) {
        if (random() < 0.2) pg_delete.fill(0)
        pg_delete.rotate(random(-0.15, 0.15))
        pg_delete.ellipse(_cX, random(400, height - 400), random(50, 200), random(300, 600))
      }
    }
  }
  pg_delete.loadPixels();
  let _d = pixel
  let _total = width * height * 4 * pow(_d, 2)
  for (let i = 0; i < _total; i += 4) {
    color_get[i] = pg_delete.pixels[i]
    //color_get[i + 1] = pg_delete.pixels[i + 1]
    //color_get[i + 2] = pg_delete.pixels[i + 2]
    //color_get[i + 3] = pg_delete.pixels[i + 3]
  }
  pg_delete.updatePixels()

}


function arma_fondo() {

  let a = 0, r = 7;
  //let _tX
  if (p_dX_inc > 0) solX = random(300, width / 2); else solX = random(width / 2, width - 300)
  solY = random(200, height * 0.25)
  let _toB = 0; if (col_tipo == "light") _toB = 70
  const _cH = ((col_H[col_Hn] + col_ra / 2) + 180) % 360
  let _nL = 50 // 60
  if (col_tipo == "dark") _nL = 5 //0
  let noiseLevel = 50 // 40
  let noiseScale = 0.001 //0.002
  pg_fondo.background(_cH, col_back[0], col_back[1])//0,100,100)//)col_back)//
  pg_fondo.noStroke()
  for (let _y = 0; _y < height + 15; _y += 30) {
    for (let _x = 0; _x < width + 15; _x += 30) {
      const nx = noiseScale * _x;
      const ny = noiseScale * _y;
      const _c = _nL + noiseLevel * noise(nx, ny);

      pg_fondo.fill(_cH, col_back[0], _c, 0.5)//(_c, 0.2)//, 0.1

      for (i = 0; i < 6; i++) {
        pg_fondo.push()
        pg_fondo.translate(_x + random(-15, 15), _y + random(-15, 15))
        pg_fondo.rotate(random(PI))
        pg_fondo.beginShape()
        for (_ii = 0; _ii < PI * 2; _ii += 1) {
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
  // ------------------------------------------------------------

  for (let i = 0; i < 1000; i++) { // sol

    const x = r * cos(a) + random(-30, 30);
    const y = r * sin(a) + random(-4, 4);

    a += random(0.1, 0.2)// cambio de la distancia entre puntos
    r *= 1.007// _m//random(1.0003, 1.008) //cambio de la amplitud del espiral

    pg_fondo.push()
    pg_fondo.translate(solX, solY);
    pg_fondo.rotate(random(0.2))
    pg_fondo.noStroke()
    const _H = col_H[col_Hn] + (random() * col_ra)
    const _a = map(i, 0, 1000, 0.001, 0.5)
    pg_fondo.fill(_H, random(10, 20 + _toB), random(40, 90) + _toB, _a)

    const _s1 = random(5, 10), _s2 = random(5, 10)
    pg_fondo.rect(x, y, _s1, _s2);

    pg_fondo.pop()
  }

  const _sCN = int(random(400)), _on = random(0.007, 0.04)//0.007, 0.015
  const _iniY = int(random(1000, 1500))
  let _ex = 0.8; if (modelo == "towers") _ex = 0.6
  for (let y = _iniY; y < height; y += 10) {
    let _sC = _sCN
    const _toX = map(y, _iniY, height, 20, 11) // 5, 20
    for (let x = 0; x < width; x += _toX) {

      const _rr = map(y, _iniY, height, 0.01, 1)
      if (random() < _rr) {
        const _H = col_H[col_Hn] + (random() * col_ra)
        const _m = map(y, _iniY, height, 300, 0)
        let _sY = _m * sin(_sC * _on) + y
        let _a = map(y, _iniY, height, 1, 0.2)//, 0.4, 1)

        const _t = map(y, _iniY, height, 5, 18)
        pg_fondo.push()
        pg_fondo.translate(x, _sY)
        pg_fondo.rotate(random(0.2))
        if (random() > _rr * 0.5) {
          pg_fondo.noStroke()
          pg_fondo.fill(_H, random([[1, 2, 3, 4, 5], [8], [9], [10], [8], [9], [10], [60, 70, 80]]), random(30) + _toB, _a)
          const _s1 = random(4, _t), _s2 = random(4, _t)
          pg_fondo.rect(0, 0, _s1, _s2);
        }
        if (y > height * _ex && random() < _a * 0.7) { // lineas
          if (y > height * 0.9 && random() < 0.5) _a *= 3
          if (modelo == "towers") _a = random(0.7, 1)
          pg_fondo.stroke(random([5, 95]), _a) // * 0.4
          //pg_fondo.stroke(95)
          const _t1 = map(y, height * 0.8, height, 20, 50)
          if (random() < 0.5) pg_fondo.line(20, 0, 20, _t1)// random(20, _t * 8))
          else pg_fondo.line(0, 20, -_t1, 20)// -random(20, _t * 8), 20)
        }
        pg_fondo.pop()
      }
      _sC++
    }
  }
}

function click() {

  if (!b_sound && seccion == "jugando" && (millis() % 3000) < 1500) {
    push()
    fill(col_tit), noStroke()
    // fill(100, 0.7), stroke(20, 0.2), strokeWeight(10),
    textAlign(CENTER)
    //textFont('Ubuntu')
    textSize(40), textFont(fuente[1])
    text("(( CLICK TO TURN ON SOUND ))", width / 2, height - 55)
    pop()
  }
}

function arma_titulo() {
  /*let cod_tit = []
  cod_tit[cod_n] = cod_tit[cod_n] + cod_sel[int(random(cod_sel.length))]
  text(cod_tit[cod_n], 0, 14, this.w, this.h)//this.x, this.y + 14, this.w, this.h)*/


  pg_titulo.clear()
  // pg_titulo.blendMode(DIFFERENCE)
  pg_titulo.fill(col_H[col_Hn] + col_ra / 2, 100, 100, 0.3), pg_titulo.noStroke()
  pg_titulo.rect(0, 0, pg_titulo.width, pg_titulo.height)

  pg_titulo.textSize(60) // 70
  //if (col_tipo == "light") 
  pg_titulo.fill(col_tit), pg_titulo.noStroke()// pg_titulo.stroke(100), pg_titulo.strokeWeight(1)
  pg_titulo.text("GUM CALENDAR\n ·",
    pg_titulo.width / 2 + 540 / 2 - 50, pg_titulo.height - 200)
  pg_titulo.textSize(40)
  //pg_titulo.fill(100, 0.7), pg_titulo.stroke(20, 0.6), pg_titulo.strokeWeight(5)
  const _t = int((titInicio - millis()) * 0.001);
  pg_titulo.text("CLICK TO START\nor wait (" + _t + ") seconds", pg_titulo.width / 2 + 540 / 2 - 50, pg_titulo.height - 100)
  // pg_titulo.blendMode(BLEND)
  image(pg_titulo, width / 2 + (width * 0.25), height / 2 + (height * 0.25))
  if (_t <= 0) {
    vol_final.mute = true;
    hacia_jugando()
    //pg_titulo.remove()
  }
}


function sound_random() {

  sound_cont++
  if (sound_cont == 1000) sound_cont = 0
  return soundR[sound_cont]
}

function gral_random() {

  gral_cont++
  if (gral_cont == 1000) gral_cont = 0
  return gralR[gral_cont]
}

function txt_random() {

  txt_cont++
  if (txt_cont == 1000) txt_cont = 0
  return txtR[txt_cont]
}

function repA_random() {

  repA_cont++
  if (repA_cont == 1000) repA_cont = 0
  return repAR[repA_cont]
}

function keyReleased() {
  if (key == "v") {
    bVer = !bVer
  }
  if (key == "s" || key == "S") {
    grabaImagen()
  }
  if (key == "f" || key == "F") {
    let fs = fullscreen()
    fullscreen(!fs)
  }
  if ((key == "p" || key == "P") && seccion == "jugando") {
    b_play = !b_play;
    if (b_play) {
      if (b_sound) vol_final.mute = false
      loop();
    } else {
      //sound_ON = false
      //feedbackDelay.set({ delayTime: 0, feedback: 0 }) // bug
      vol_final.mute = true
      noLoop();
    }
  }
  if (key == "1") {
    b_bajo = !b_bajo
  }
  if (key == "2") {
    b_tenido = !b_tenido
    if (!b_tenido) feedbackDelay.set({ delayTime: 0, feedback: 0 })
  }
  if (key == "3") {
    b_grano = !b_grano
  }
}

function hacia_jugando() {

  pg_titulo.remove()
  cajas.splice(0, cajas.length)
  frameCount = -200
  //sound_ON = !sound_ON
  seccion = "jugando"
  pos_n = -1, dias = dias_memo
  randomSeed(mi_seed) // repetir si empieza sin sonido
  noiseSeed(mi_seed)
  gral_cont = 0 // reset
  frame_cont = 0// reset
  seccionA()
  genera_cajas()
  DURACION = millis() // bug provisorio
}

function mouseClicked() {
  if (sampler_loaded[0] && sampler_loaded[1] && b_play) {
    if (seccion == "cargando") hacia_jugando()
    b_sound = !b_sound
    if (b_sound) vol_final.mute = false; else vol_final.mute = true;
  }
}
function grabaImagen() {
  console.log("saving!")
  saveCanvas("Gum_calendar" + mi_seed + ".png")
}








///////////////////////////////////////////////////////
class Caja {
  constructor(_ac, _x, _y, _w, _h, _cL, _xx, _yy, _pos_n, _oI) {
    this.ac = _ac // activo
    this.x = _x
    this.y = _y
    this.w = _w
    this.h = _h
    this.col = _cL//(_n % 2) * 255
    this.posX = _xx, this.posY = _yy // posicion en la grilla

    if (this.ac) this.vida = int(random(300, 500)) // 400
    else this.vida = 0//10

    this.nL = 0 //numero de lineas
    this.linea = []

    this.pos_n = _pos_n % 4
    this.posGral = _pos_n
    this.inicio = _oI //  orden inicio

    this.backH = (col_H[col_Hn] + (gral_random() * col_ra)) % 360, this.backS = 0, this.backB = 0
    if (modelo != "boom") { if (gral_random() < 0.95) this.col_princ(); else this.col_secs() }
    else { if (random() < 0.95) this.col_princ(); else this.col_secs() }
    /*  if (gral_random() < 0.95) { // bug gral_random????? 
       if (gral_random() < col_sat) col_gral[0] = 0; else col_gral[0] = col_gral[2] // 70
       if (gral_random() < 0.5) col_gral[1] = 0; else col_gral[1] = col_gral[3] //70   
       this.backS = abs(random() * 25 + col_gral[2])
       this.backB = random() * 30 + col_gral[1]
     } else {
       // colores secundarios
       if (random() < 0.5) this.backH = (this.backH + col_Hsec[0]) % 360
       else this.backH = (this.backH + col_Hsec[1]) % 360
       this.backS = random(25) + 70// random(30) + 70
       this.backB = random(30) + 40 //random(30) + 70
     } */
    if (this.posX == int(dias / 2) && this.posY == int(dias / 2) && seccionM != "B") {
      this.bTexto = true
    } else this.bTexto = false
    this.rot = -pos_rot[0] + gral_random() * pos_rot[1] //-0.025 + gral_random() * 0.05// random(-0.05, 0.05) //-0.025, 0.025
    this.desN = 0 //numero de desintegracion    
    this.mueve = true
  }

  col_princ() {
    if (gral_random() < col_sat) col_gral[0] = 0; else col_gral[0] = col_gral[2] // 70
    if (gral_random() < 0.5) col_gral[1] = 0; else col_gral[1] = col_gral[3] //70   
    this.backS = abs(random() * 25 + col_gral[2])
    this.backB = random() * 30 + col_gral[1]
  }
  col_secs() {
    // colores secundarios
    if (random() < 0.5) this.backH = (this.backH + col_Hsec[0]) % 360
    else this.backH = (this.backH + col_Hsec[1]) % 360
    this.backS = random(25) + 70// random(30) + 70
    this.backB = random(30) + 40 //random(30) + 70
  }

  dibuja() {
    if (this.inicio > 0 && this.ac) {
      if (pos_dist[this.pos_n] > pos_dN) {//0.0625 
        push()
        translate(this.x, this.y)
        if (pos_dist[this.pos_n] != 1) rotate(this.rot)
        if (this.col == 255) {
          rectMode(CORNER)
          if (b_rect) {
            let _a = 1;
            if (pos_dist[this.pos_n] == 1) _a = 0.4
            else if (pos_dist[this.pos_n] == 0.5) _a = 0.6
            else if (pos_dist[this.pos_n] == 0.25) _a = 0.8
            fill(this.backH, this.backS, this.backB, _a)
            noStroke()//(0, 11, 134)
            rect(0, 0, this.w, this.h)
          }
        }
        stroke(this.col), noFill()
        if (this.linea.length < 2 && gral_random() < 0.04) this.agrega_linea(this.nL) //< 3 ... < 0.04

        if (this.linea.length > 0) {
          for (let i = 0; i < this.linea.length; i++) {
            ////strokeWeight(1)//(this.linea[i].sW)// this.pg.strokeWeight(this.linea[i].sW)
            line(this.linea[i][0], this.linea[i][2], this.linea[i][1], this.linea[i][3])
          }
        }

        // text -------------------------------------------
        if (this.bTexto) {
          if (txt_random() < 0.95) {
            cod_cad[cod_n] = cod_cad[cod_n] + cod_sel[int(txt_random() * cod_sel.length)]
          } else {
            let _rn = int(txt_random() * 5)
            for (let i = 0; i < _rn; i++) { cod_cad[cod_n] += " " + pos_n + " " }
          }
          blendMode(DIFFERENCE)
          textFont(fuente[0])
          stroke(255), textSize(25) // orig:15 
          //  if (te_tipo == "dibujo") 
          text(cod_cad[cod_n], 0, 14, this.w, this.h)
          //  else text(cod_cad[cod_n], 50, 64, this.w - 50, this.h - 60)

          blendMode(BLEND)
          //colorMode(HSB)

          const _ta = textWidth(cod_cad[cod_n])

          if (this.w * this.h / 20 < _ta || _ta > 1500) { //_ta > 1000
            cod_n++// pasamos al siguiente codigo
            cod_cad[cod_n] = ""
            this.bTexto = false
            elije_caja()
          }
        }
        pop()

        if (!this.mueve) this.vida = 0;// print(this.mueve, this.pos_n) bug ojo!!!!

      }
      else if (frameCount % 3 == 0) {//% 3
        if (this.desN <= p_dCant) {
          this.mueve = false
          let _rC = map(this.desN, 0, p_dCant, 0, 1) // 15
          _rC = constrain(_rC, 0.01, 0.99)

          if (random() > _rC) {
            if (modelo == "boom") {
              pos_desX[this.posGral] *= pos_gralP// 0.999// 
              pos_desY[this.posGral] *= pos_gralP
              if (this.desN > p_dCant) this.vida = 0
            }
            const _bo = busca_color(this.x, this.y)
            if (!_bo) {
              pg_fondo.push()
              pg_fondo.translate(this.x, this.y)
              pg_fondo.rotate(this.rot * 3)
              pg_fondo.stroke(this.col)
              pg_fondo.strokeWeight(1)
              const _n = (sin((frameCount + pos_sin) * pos_sL) + 1) * pos_sA

              // const _n = noise(0.01 * frameCount) * 3// -height + 500 // + 200
              if (this.col == 255 && (this.desN < _n || random() < 0.05) && b_rect) {//< 0.2
                pg_fondo.rectMode(CORNER)
                pg_fondo.fill(this.backH, this.backS, this.backB, 0.9)
                pg_fondo.rect(0, 0, this.w, this.h)
              }
              let _ca = map(this.desN, 0, 20, 0.75, 0.1)//0,10
              _ca = constrain(_ca, 0.2, 0.75)

              for (let i = 0; i < this.linea.length; i++) {
                if (random() < _ca) { // if (i < 3 || random() < 0.75)
                  pg_fondo.line(this.linea[i][0], this.linea[i][2], this.linea[i][1], this.linea[i][3])
                }
              }
              pg_fondo.pop()
            }
          }
          let _x = p_dX_inc * sin(this.desN * 0.1) + pos_desX[this.posGral] // inclinacion
          this.x = this.x + _x//this.x = this.x + pos_desX[this.posGral]
          this.y = this.y + pos_desY[this.posGral]
          this.desN++

        }
        else {
          if (pos_n == c_years) this.vida -= 40//this.vida = 10 // bug parpadea 1º cuadro
          if (cajas.length < 20) fin_todo() // < 20 bug   
        }
      }
    }
    this.vida--
    this.inicio++
  }

  torre_fin() {
    if (pos_dist[this.pos_n] < 0.125) { return true }
    else { return false }
  }

  agrega_linea(_i) {
    this.linea.push([0, 0, 0, 0, 0, 0, 0, 0])
    const _r = frameCount % 4// int(this.loop_random() * 4)//random(lin_opc) // bug no sale 3??
    if (lin_opc[_r] == "izq") {
      this.linea[_i][4] = 0//- 0.1 + this.loop_random() * 0.2 //cajas[cajas.indexOf(this)].loop_random()
      this.linea[_i][5] = this.linea[_i][4]
      this.linea[_i][6] = 0//- 0.1 + this.loop_random() * 0.2
      this.linea[_i][7] = 1//1.1 - this.loop_random() * 0.2
    }
    else if (lin_opc[_r] == "der") {
      this.linea[_i][4] = 1//1.1 - this.loop_random() * 0.2
      this.linea[_i][5] = this.linea[_i][4]
      this.linea[_i][6] = 0//- 0.1 + this.loop_random() * 0.2
      this.linea[_i][7] = 1//1.1 - this.loop_random() * 0.2
    }
    else if (lin_opc[_r] == "arr") {
      this.linea[_i][4] = 0//- 0.1 + this.loop_random() * 0.2
      this.linea[_i][5] = 1//1.1 - this.loop_random() * 0.2
      this.linea[_i][6] = 0//- 0.1 + this.loop_random() * 0.2
      this.linea[_i][7] = this.linea[_i][6]
    }
    else {
      this.linea[_i][4] = 0//- 0.1 + this.loop_random() * 0.2
      this.linea[_i][5] = 1//1.1 - this.loop_random() * 0.2
      this.linea[_i][6] = 1//1.1 - this.loop_random() * 0.2
      this.linea[_i][7] = this.linea[_i][6]
    }

    this.linea[_i][0] = this.linea[_i][4] * this.w
    this.linea[_i][1] = this.linea[_i][5] * this.w
    this.linea[_i][2] = this.linea[_i][6] * this.h
    this.linea[_i][3] = this.linea[_i][7] * this.h

    /* this.linea[_i] = {
      x1: 0, y1: 0, x2: 0, y2: 0,//, dir: _d, sW: 1
      mX1: _mx1, mY1: _my1, mX2: _mx2, mY2: _my2
      //x1: _x, y1: 1, x2: _x, y2: this.h - 1//, dir: _d, sW: 1
    } */
    this.nL++
  }

  mueve_cajas() {
    if (this.mueve) {
      this.x = pos_x[this.pos_n][this.posX] //80 + pos_x[this.pos_n][this.posX]
      this.y = pos_y[this.pos_n][this.posY] //80 + pos_y[this.pos_n][this.posY]
      this.w = pos_x[this.pos_n][this.posX + 1] - pos_x[this.pos_n][this.posX]
      this.h = pos_y[this.pos_n][this.posY + 1] - pos_y[this.pos_n][this.posY]

      // mueve lineas --------------------------
      for (let _i = 0; _i < this.linea.length; _i++) {
        this.linea[_i][0] = this.linea[_i][4] * this.w
        this.linea[_i][1] = this.linea[_i][5] * this.w
        this.linea[_i][2] = this.linea[_i][6] * this.h
        this.linea[_i][3] = this.linea[_i][7] * this.h
      }
    }
  }

  grande(_i) { // si es grande, hace textos
    if (this.ac && this.w > 200 && this.h > 200) return _i = 100
    else return _i
  }

  /*  devuelve_pos_fX() {
     return this.pos_fX
   } */

  caja_texto(_i) { // si es grande, hace gestos
    if (this.ac && this.w > 100 && this.h > 100) {
      this.bTexto = true
      return 100
    }
    else return _i
  }

  saca_texto() {
    this.bTexto = false
  }

  caja_bTexto() {
    return this.bTexto
  }

  /*  loop_random() {
     this.loop_cont++
     if (this.loop_cont == 1000) this.loop_cont = 0
     return loopR[this.loop_cont]
   } */

  final() {
    if (this.vida <= 0) {
      if (this.bTexto) {
        cod_n++// pasamos al siguiente codigo   //cod_cad = ""
        cod_cad[cod_n] = ""
        this.bTexto = false
        elije_caja()
      }
      return true
    }
    else return false;
  }
}
