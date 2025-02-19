let midi, sampler
let count = -1
let _ac = 0, _next = 1
let seccion = "cargando"
let notas = []
let colH
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

  sampler = new Tone.Sampler({
    C1: 'piano_c1.mp3',
    C2: 'piano_c2.mp3',
    C3: 'piano_c3.mp3',
    C4: 'piano_c4.mp3',
    C5: 'piano_c5.mp3',
    C6: 'piano_c6.mp3'
  }, {
    baseUrl: './assets/',
    onload: () => { sampler_loaded = true; }
  })
  sampler.chain(reverb, channel)
  channel.chain(comp, Tone.Destination);
}


function setup() {
  const cv = createCanvas(2160, 2160)
  cv.parent("cv")
  cv.id("---")
  cv.class("---")
  pixelDensity(1);
  stroke(100)
  colorMode(HSB);
  colH = random(360);

  startTone()
}


function draw() {
  //background(80);
  fill(colH, 50, 50);
  rect(0, 0, displayWidth, displayHeight);
  if (seccion == "juego") {
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
  midi = await Midi.fromUrl("duermeteQ.mid");//("midi-facil.mid");
  print(midi)
  //print(midi.tracks[0].notes[1].ticks)

}



/*  function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}  */

function touchStarted() {
  if (seccion == "cargando") {
    let fs = fullscreen();
    fullscreen(!fs);
    seccion = "juego";
  }

  for (let touch of touches) {
    midiPiano()
    circulo(touch.id, touch.x, touch.y);
  }
}

function touchEnded() {
  for (let i = 0; i < notas.length; i++) {

    //notas[i].nota_stop();
  }
}

function mousePressed() {
  if (seccion == "cargando") {
    //let fs = fullscreen()
    fullscreen();
    seccion = "juego";
  }
  midiPiano()
  circulo(0, mouseX, mouseY);
}

function mouseReleased() {
  for (let i = 0; i < notas.length; i++) {
    //if (notas[i].mi_id() == 0)
    //notas[i].nota_stop();
  }
}

function circulo(_id, _x, _y) {
  notas.push(new Nota(_id, _x, _y));
}

function midiPiano() {

  if (_ac != _next) count++
  suenaPiano(count, "+0")
  _ac = midi.tracks[0].notes[count].ticks // actual
  _next = midi.tracks[0].notes[count + 1].ticks

  let _ti = random(0.1)
  while (_ac == _next) {
    count++
    let _t = str("+" + _ti)
    suenaPiano(count, _t)
    if (count == 161) count = -1
    _next = midi.tracks[0].notes[count + 1].ticks
    _ti += random(0.1)
  }
}

function suenaPiano(_c, _st) {
  const _no = midi.tracks[0].notes[_c].midi
  sampler.triggerAttackRelease(notas_c[_no - 24], 2, _st, 1);
  //print(count, _no)
}

class Nota {
  constructor(_id, _x, _y) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.vida = 100;
    this.r = 30
  }

  nota_stop() {
    //sampler.triggerRelease(this.frec, Tone.now());
    //this.vida = 0;
  }

  dibuja() {
    noFill()
    stroke(100, this.vida * 0.005);
    circle(this.x, this.y, this.r);
    this.vida--, this.r += 2
  }

  final() {
    if (this.vida <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
