/*
Créditos:
Pieza original: DUÉRMETE MI NENA de Rosa Farsac, compuesta en 1944 
Fuente de texto: Chopin Script Font
*/

let seccion = "cargando"
let modo = "sueño"
let clickCount = 0;
let startTime, duermeTime = 500;

let pg_background, fondo_noise = 0;

let colH, alfa = 0, fuente;

let midi, sampler = [], sampler_loaded = [false, false]
let count = -1
let _ac = 0, _next = 1
let notas = []
let vol // intensidad
const notas_c = [
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

function preload() {
  const channel = new Tone.Channel({ volume: 0, channelCount: 2 })
  const reverb = new Tone.Reverb({ decay: 1.4, wet: 0.7 })
  const comp = new Tone.Compressor({
    ratio: 12, threshold: -20, release: 0.25, attack: 0.003, knee: 3
  })

  sampler[0] = new Tone.Sampler({
    C1: 'piano_c1.mp3',
    C2: 'piano_c2.mp3',
    C3: 'piano_c3.mp3',
    C4: 'piano_c4.mp3',
    C5: 'piano_c5.mp3',
    C6: 'piano_c6.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[0] = true; }
  })
  sampler[0].chain(reverb, channel)

  sampler[1] = new Tone.Sampler({
    C1: 'piano_c1-p.mp3',
    C2: 'piano_c2-p.mp3',
    C3: 'piano_c3-p.mp3',
    C4: 'piano_c4-p.mp3',
    C5: 'piano_c5-p.mp3',
    C6: 'piano_c6-p.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded[1] = true; }
  })
  sampler[1].chain(reverb, channel)

  channel.chain(comp, Tone.Destination);
}


function setup() {

  createCanvas(windowWidth, windowHeight)
  /*  const cv = createCanvas(2160, 2160)
    cv.parent("cv")
   cv.id("---")
   cv.class("---")  */
  //pixelDensity(1);
  stroke(100)
  colorMode(HSB);
  textAlign(CENTER);
  colH = random(160, 280);
  fuente = loadFont('./assets/ChopinScript.ttf')
  textFont(fuente)
  textSize((displayWidth + displayHeight) * 0.025)

  startTone()
  fondo()
  startTime = millis();
}


function draw() {

  if (seccion == "cargando") {
    background(80);
    text("cargando...", windowWidth / 2, windowHeight / 2);
    if (sampler_loaded[0] && sampler_loaded[1]) seccion = "listo"
  }
  else if (seccion == "listo") {
    image(pg_background, 0, 0);

    duermeTime--
    let _a = map(duermeTime, 500, 300, 0, 0.7)
    _a = constrain(_a, 0, 0.7);
    noStroke(); fill(0, _a);
    textSize((displayWidth + displayHeight) * 0.017)
    text("Interpreta\nDuérmete mi niña\nde Rosa Farsac", windowWidth / 2, windowHeight * 0.15);
    textSize((displayWidth + displayHeight) * 0.025)
    if (frameCount % 60 < 40) text("clic para empezar", windowWidth / 2, windowHeight / 2);
    textSize((displayWidth + displayHeight) * 0.013)
    text("(Obra: Duérmete de Yamil Burguener)", windowWidth / 2, windowHeight * 0.75);
  }
  else if (seccion == "juego") {

    image(pg_background, 0, 0)//, windowWidth, windowHeight)
    duermeTime--;

    if (duermeTime < 0) {
      let _a = map(duermeTime, 0, -80, 0, 0.7)
      _a = constrain(_a, 0, 0.7);
      noStroke(); fill(0, _a);
      textSize((displayWidth + displayHeight) * 0.025)
      text("f f f", windowWidth / 2, windowHeight * 0.1);
      if (frameCount % 60 < 40) text("clic para continuar", windowWidth / 2, windowHeight / 2);
      text("ppp", windowWidth / 2, windowHeight * 0.9);
    }


    if (modo == "sueño") alfa -= 0.01; else alfa += 0.02;
    alfa = constrain(alfa, 0, 0.7);
    fill(0, 0, 0, alfa); noStroke()
    rect(0, 0, displayWidth, displayHeight);

    // verifica modo
    let elapsed = millis() - startTime;
    //text(int(elapsed), 200, 100); // bug prov
    //text(clickCount, 200, 150); // bug prov

    if (elapsed > 5000) {
      if (modo == "sueño") {
        if (clickCount > 15) modo = "pesadilla";
      } else {
        if (clickCount < 12) modo = "sueño";
      }
      clickCount = 0;
      startTime = millis();
    }
    for (let i = 0; i < notas.length; i++) {
      notas[i].dibuja();
      if (notas[i].final()) {
        notas.splice(i, 1);
      }
    }
  }
}


async function startTone() {
  //await Tone.start();
  //console.log("Tone started");
  midi = await Midi.fromUrl("./assets/duermeteQ.mid");
  //print(midi)
  //print(midi.tracks[0].notes[1].ticks)
}

function touchStarted() {
  if (seccion == "listo") {
    fullS()
    seccion = "juego"
  }
  if (seccion == "juego") {
    clickCount++;
    duermeTime = 500
    for (let touch of touches) {
      vol = map(touch.y, 0, windowHeight, 1, 0)
      circulo(touch.id, touch.x, touch.y);
    }
    midiPiano()
  }
}

/* function touchEnded() {
  for (let i = 0; i < notas.length; i++) {

    //notas[i].nota_stop();
  }
} */

function mousePressed() {
  if (seccion == "listo") {
    fullS()
    seccion = "juego";
  }
  if (seccion == "juego") {
    clickCount++;
    duermeTime = 500
    vol = map(mouseY, 0, windowHeight, 1, 0)
    midiPiano()
    circulo(0, mouseX, mouseY);
  }
}

function circulo(_id, _x, _y) {
  notas.push(new Nota(_id, _x, _y));
}

function midiPiano() {

  if (_ac != _next) {
    if (modo == "pesadilla") {
      if (random() < 0.7) count++
    } else { count++ }
  }
  suenaPiano(count, "+0")
  _ac = midi.tracks[0].notes[count].ticks // actual
  _next = midi.tracks[0].notes[count + 1].ticks

  let _ti = random(0.1)
  while (_ac == _next) {
    count++
    let _t = str("+" + _ti)
    suenaPiano(count, _t)
    if (count >= 771) count = -1 // antes: 161
    _next = midi.tracks[0].notes[count + 1].ticks
    _ti += random(0.1)
  }
}

function suenaPiano(_c, _st) {
  let _alt, _dur;
  let _no = midi.tracks[0].notes[_c].midi - 24
  if (modo == "sueño") {
    _alt = notas_c[_no]
    _dur = 2
  } else {
    _dur = random(0.05, 0.8)
    _no = abs((_no + random([-36, 24, 0, 24, 36])) % 120)
    if (random() < 0.35) _alt = desafina(_no); else _alt = notas_c[_no]
  }
  let _sa, _v;
  if (vol < 0.5) { // suave
    _sa = 1; _v = vol * 2.5

  } else { // fuerte
    _sa = 0; _v = vol
  }
  _v = constrain(_v, 0, 1) // _v puede tirar n negativo. ojo

  ////print(count, _no)
  sampler[_sa].triggerAttackRelease(_alt, _dur, _st, _v);
  if (modo == "pesadilla" && random() < 0.3) { // repetición
    let _tie = random(0.05, 0.2)
    let _ti = _tie
    const _f = random([4, 5, 6, 7, 10])
    const _arp = random([0.85, 0.9, 1, 1, 1.1, 1.15])
    for (let i = 0; i < _f; i++) {
      _ti += _tie
      let _t = str("+" + _ti)
      if ((typeof _alt) == "number") _alt *= _arp
      const _int = ((i % 2) + 1) * 0.5
      sampler[_sa].triggerAttackRelease(_alt, _dur, _t, _v * _int);
    }
    if (random() < 0.7) midiPiano()
  }
}

function desafina(_nA) { // nota afinada
  const _hertz = Tone.Frequency(_nA, "midi").toFrequency()
  _nD = _hertz * (0.975 + random(0.05))
  return _nD
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function (event) {
  event.preventDefault();
};

function fullS() {
  if (!fullscreen()) {
    fullscreen(true);
  }
}


function fondo() {

  pg_background = createGraphics(displayWidth, displayHeight)//windowWidth, windowHeight)
  pg_background.colorMode(HSB)
  pg_background.ellipseMode(CENTER)
  pg_background.pixelDensity(1)
  pg_background.background(0)
  pg_background.strokeWeight(1)
  let c1, c2, newc, _d = 0
  if (random() < 0.5) _d = 1
  c1 = color(colH, 70, 70)
  c2 = color(colH, 30, 30)
  for (let y = 0; y < displayHeight; y++) {
    const n = map(y, 0, displayHeight, 0, 1);
    if (_d == 0) newc = lerpColor(c1, c2, n); else newc = lerpColor(c2, c1, n)
    pg_background.stroke(newc);
    pg_background.line(0, y, displayWidth, y);
  }
  c1 = color(colH, 70, 70, 0.5)
  c2 = color(colH, 30, 30, 0.5)
  let viento_dir = 1// random([-1, 0, 1])
  let _onda = random(-20, 20); if (viento_dir != 0) _onda * 1.3
  for (let y = 0; y < displayHeight; y += int(random(15, 20))) {
    let to_y = 1
    for (let x = 0; x < displayWidth; x += int(random(15, 20))) {
      let _n = noise(fondo_noise) * _onda
      fondo_noise += 0.2
      if (random() < 0.85) {
        let _y1 = (y + to_y) % displayHeight
        if (_y1 < 0) _y1 = displayHeight + _y1
        const n = map(_y1, 0, displayHeight, 1, 0);
        if (_d == 0) newc = lerpColor(c1, c2, n); else newc = lerpColor(c2, c1, n)
        pg_background.stroke(newc)
        pg_background.noFill()
        to_y += _n
        let y1 = (y + to_y) % displayHeight, y2 = (y + to_y + random(-5, 5)) % displayHeight
        if (y1 < 0) y1 = displayHeight + y1; if (y2 < 0) y2 = displayHeight + y2
        if (random() < 0.7) {
          if (abs(y1 - y2) < 50) {
            // pg_background.line(x, y1, x + random(5, 15), y2)
            pg_background.bezier(x, y1, x + random(-5, 5), y2, x + random(10, 15), y2, x + random(10, 20), y1)
          }
        }
        else { pg_background.circle(x + random(-5, 5), y1, 3) }
      }
    }
    fondo_noise = 0
  }
}


class Nota {
  constructor(_id, _x, _y) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    const _vi = map(_y, 0, windowHeight, 100, 150)
    this.vida = _vi; // 100
    const _ra = map(_y, 0, windowHeight, 50, 15)
    this.r = _ra // 30
    this.velR = map(_y, 0, windowHeight, 3, 0.5)
  }

  //nota_stop() {
  //sampler[0].triggerRelease(this.frec, Tone.now());
  //this.vida = 0;
  //}

  dibuja() {
    noFill()
    stroke(100, this.vida * 0.005);
    ellipse(this.x, this.y, this.r + random(-6, 6), this.r + random(-6, 6));
    this.vida--, this.r += this.velR//2
  }

  final() {
    if (this.vida <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
