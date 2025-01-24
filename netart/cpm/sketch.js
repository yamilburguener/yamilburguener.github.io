/* versión de las librerias: 
p5.js v0.5.14 August 28, 2017
p5.sound.js v0.3.5 2017-07-28 
p5.dom.js v0.3.4 Aug 11, 2017
*/

p5.disableFriendlyErrors = false;

var cnv; // canvas
var montania = []; // montania de links
var mont_total = 17; // cantidad de montanias
var cantMont = 0; // para cantidad de montanias
var sol, fondo; // imagenes
var man = []; // imagenes hombresitos
var man_stop; // = []; // imagen man parado
var man_vel = 0.6; // der = 0.6 o izq = -0.6
var solX, solY; // posicion sol
var n_avanzar = 0; // para la vel del avance de las montanias
//var vel_avanzar = 0; // velocidad del avance de las montanias
var stop_avanzar = 10; // maneja el mov de las montanias
var x_inicial = 200; // pos x de la primera montania

var letra = []; // arma palabra para url
var letra_u = []; // arma palabra para url desde letras del usuario
var palabra = ""; // arma url
var text_link = []; //textos .com .org, etc

var man_x; // = []; // posicion x
var man_y; // posicion en y
var manP; // para los textos del hombresito
var titulo_fade = 1; //fade del texto del man
var b_titulo = true;
var hand; // hand-bomba
var hand_x, hand_y; // inicial
var hand_xf, hand_yf; // final
var hand_cant = 0; // avance de la mano. orig = 0.05
var hand_vel = 0.02; // para que se vaya frenando. orig. 0.01
var hand_rot = 0; //rotación
var b_hand = 0;
var b_man_run = true; // par que se frene cuando uno esta sobre un link
//var man_fade_stop; // para que se frene de apoco
var man_impacto = 40; // para que luego de hacer impacto en el link se demore
var n_link_hide = -1; // nº de montania q se desmorona
var to_n_link;
var desmorona_map = 10; // vel desmoronamiento

var seccion = 1;
var new_sitio, input_sitio;
var boton_skip, boton_enter;
var text_intro0, text_intro1, text_intro2, text_intro3; // para createP
var subt_intro1, subt_intro2, subt_intro3; // textos intro
var b_input_sitio = false;
var subt_buscando = []; // texto mientras carga montanias
var to_buscando; // para texto mientras carga montanias
var userLang = navigator.language || navigator.userLanguage;
var idioma;
var mi_width = 5000;
var mi_height = 600;
var pantalla_pos = 0;

var text_buscando; // texto dinamico buscando... 100%
var n_carga = 0;
var mi_div;
var panelIntr;

var text_sound;
var text_puntaje;
var text_tiempo;
var flecha; // para guiar al usuario hacia la derecha
var n_puntos = 0;
var n_tiempo; // millis()
var total_tiempo = 40000; // orig: 20000
var b_tiempo = true;
var mis_sitios = [];
var b_sound = true;
//var s_link = []; // sonidos desmorona
var sonido = []; // sonidoss desmorona, fondo
var c_sonido = 0; // contador de sonidos en la carga
var text_titulo;
var titulo_tiempo;
var r_memo = 0;
var r_rate = 1.0;

var m2 = x_inicial;

// ======================== PRELOAD ===========================
function preload() {
  flecha = createImg("assets/flecha.gif");
  flecha.hide();
  hand = createImg("assets/hand.png");
  hand.hide();
  sol = createImg('assets/sol.png');
  sol.hide();
  text_titulo = createImg("assets/titulo.png");
  text_titulo.hide();
  for (var i = 0; i < 2; i++) {
    man[i] = createImg('assets/man' + i + '.gif');
    man[i].hide();
  }
  man_stop = createImg('assets/man_stop.png');
  man_stop.hide();
}

function carga_sound(filename) {
  loadSound(filename, soundLoaded);

  function soundLoaded(sound) {
    sonido.push(sound);
    //console.log(c_sonido + " : " + filename);
    c_sonido++;
  }
}


// ======================== SETUP =============================
function setup() {
  frameRate(100);
  letras();
  subtitulos();
  para_links();
  // carga de sonidos ---------------
  for (var i = 0; i < 10; i++) {
    if (i == 0) 
    carga_sound("assets/link1.wav"); // parar los links
    else
    carga_sound("assets/link.wav"); // parar los links
  }
  carga_sound('assets/base.mp3');

  colorMode(HSB);

  //  -------- ingresa nuevo sitio -------------
  panelIntr = createDiv("");
  panelIntr.id("panelIntro");
  text_intro0 = createP("COLINAS PUNTO MUERTO");
  text_intro0.style("text-align", "center");
  text_intro0.parent("panelIntro");
  text_intro1 = createP(subt_intro1);
  text_intro1.style("text-align", "justify");
  text_intro1.parent("panelIntro");
  text_intro2 = createP(subt_intro2);
  text_intro2.style("font", "13px TitilliumL");
  text_intro2.style("text-align", "justify");
  text_intro2.parent("panelIntro");
  text_intro3 = createP(subt_intro3);
  text_intro3.parent("panelIntro");
  input_sitio = createInput("");
  input_sitio.parent("panelIntro");
  input_sitio.style("text-transform", "lowercase"); //minúscula
  input_sitio.style("border-radius", "4px");
  input_sitio.style("width", "200px");
  input_sitio.style("margin", "5px");
  input_sitio.style("background-color", "#EEEEEE");
  //input_sitio.style("maxlength", "10"); // no funciona
  input_sitio.changed(text_enter);
  boton_skip = createButton("Skip");
  boton_skip.style("margin", "5px");
  boton_skip.class("btn");
  boton_skip.parent("panelIntro");
  boton_skip.mousePressed(seccion_buscando);
  boton_enter = createButton("Enter");
  boton_enter.style("margin", "5px");
  boton_enter.class("btn");
  boton_enter.parent("panelIntro");
  boton_enter.mousePressed(text_enter);

  text_titulo.style("z-index", "200");

  flecha.style("z-index", "200");

  // abre ventana de google -------
  var r = int(random(300, 600));
  var myWindow = window.open("https://support.google.com/chromebook/answer/95472?co=GENIE.Platform%3DDesktop&hl=es", "_blank ", "width = " + r + ", height = " + r);
  //myWindow.moveTo(int(random(0, windowWidth - r)), int(random(0, windowHeight - r)));
}


// ========================= DRAW =============================
function draw() {
  // ------------------ INTRO: seccion 1 -----------------------
  if (seccion == 1) {
    if (key == "\u001b" || key == "\r") seccion_buscando(); // escape o enter
  } else
  if (seccion == 2) {

    // ---------------------- montanias ------------------
    // --- nº de Montania, cantidad, ubic_x, expo(altura), size-font, scroll, z-index ---
    //montania.push(new Montania(0, 150, 600, 1.033, 14, 1.0, 1)); // media
    //montania.push(new Montania(1, 100, 250, 1.05, 9, 0.75, 1)); // atras
    if (cantMont <= 8) arma_montania_1();
    else if (cantMont <= 8 + 5) arma_montania_2();
    else if (cantMont == 8 + 5 + 1) {
      montania.push(new Montania(cantMont, 60, 1400, 1.0913, 40, 4.0, 3)); // grande
      cantMont++;
    } else if (cantMont == 8 + 5 + 2) {
      montania.push(new Montania(cantMont, 60, 2500, 1.09132, 40, 4.0, 3)); // grande
      cantMont++;
    } else if (cantMont == 8 + 5 + 3) {
      montania.push(new Montania(cantMont, 60, 4500, 1.0913, 41, 4.0, 3)); // grande  
      cantMont++;
    } else if (cantMont == 8 + 5 + 4) {
      montania.push(new Montania(cantMont, 60, 5800, 1.09128, 42, 4.0, 3)); // grande
      // carga montania del usuario ------
      //var r = int(random(montania.length)); // en qué montaña va el "link_usuario"
      //if (b_input_sitio) montania[r].link_usuario();
      escenario();
      seccion = 3;
      pantalla_pos = 0;
      n_tiempo = millis() + total_tiempo;
      titulo_tiempo = millis() + 10000;
    }

    var p = int(map(cantMont, 1, mont_total, 1, 100));
    text_buscando.html(to_buscando + " " + p + "%");

  } else
  // ------------------ GAME: seccion 3 -----------------------
  if (seccion == 3) {
    // ------- scroll----------
    Scroll(); //pantalla_pos = document.getScroll()[0];

    // -------------------- montanias -----------------------  
    for (var i = montania.length - 1; i >= 0; i--) {
      // desmoronamiento
      if (i == n_link_hide) {
        montania[i].desmorona();
        if (desmorona_map < 1) {
          n_link_hide = -1;
          desmorona_map = 10;
          //b_man_run = true;
          man_impacto = 39;
        }
      }
      // montanias
      montania[i].update();
    }
    // ------------------------ sol -----------------------
    var m = map(pantalla_pos, 0, mi_width, 0, 3000);
    if (m > 3000) m = 3000;
    sol.position(solX + m, solY);
    
    // ------------------- man -----------------------------
    if (b_man_run) {
      if (man_x < pantalla_pos + windowWidth / 2 - 50) man_vel = 1.4; //man_vel = 0.6;
      else if (man_x > pantalla_pos + windowWidth / 2 + 50) man_vel = -1.4; //man_vel = -0.6;
      else man_vel = 0;
      man_x = man_x + man_vel; // + vel_avanzar;
      //}
      var n;
      if (man_vel === 0) {
        man[0].hide();
        man[1].hide();
        man_stop.position(man_x, man_y);
        man_stop.show();
      } else {
        if (man_vel > 0) n = 0;
        else if (man_vel < 0) n = 1;
        man[n].position(man_x, man_y);
        man[n].show();
        man[(n + 1) % 2].hide();
        man_stop.hide();
      }
    }

    // luego de que man haga impacto en link------------
    if (man_impacto < 40) {
      man_impacto -= 0.2;
      if (man_impacto < 0) {
        b_hand = 0;
        b_tiempo = true;
        total_tiempo -= 2000; // c/prox link menos tiempo para hacer clic
        if (total_tiempo < 7000) total_tiempo = 7000;
        n_tiempo = millis() + total_tiempo;
        b_man_run = true;
        man_impacto = 40;
      } else if (man_impacto < 25) { // parpadeo del man despues de que hace impacto
        man_stop.position(man_x, man_y);
        if (floor(man_impacto % 2) === 0) man_stop.show();
        else man_stop.hide();
      }
    }
    // ----------------- hand --------------------
    if (b_hand == 1) {
      var mx = lerp(hand_x, hand_xf, hand_cant);
      var a = map(hand_cant, 0.0, 1.0, -250.0, 0.0); // para angulo del lanzamiento
      var my = lerp(hand_y, hand_yf + a, hand_cant);

      hand_cant += hand_vel;
      hand_vel -= 0.0001; // se va frenando orig. 0.00001
      if (hand_vel < 0.01) hand_vel = 0.01; // orig. 0.001
      if (hand_cant >= 1) { // hand llega al link!
        hand.hide();
        b_hand = 2;
        hand_vel = 0.06; //orig. 0.01
        hand_cant = 0;
        hand_rot = 0;
        man_fade_stop = 1;
        man_x = hand_xf; // pos x del man = al link cliqueado
        montania[to_n_link].openWin();
      }
      if (hand_x < hand_xf) hand_rot += 20;
      else hand_rot -= 20;
      hand.style("transform", "rotate(" + hand_rot + "deg");
      hand.position(mx, my);
    }

    // ------------------------- tiempo ---------------------------
    if (b_tiempo) {
      var n = n_tiempo - millis();
      n = floor(n * 0.001);
      if (n === 0) to_seccion_4();
      text_tiempo.html(n + " s");
    }

    // --------------------- sonido del sol ------------------------------ 
    /*if (b_sound) {
      var v = abs(map(pantalla_pos, 0, mi_width - windowWidth, -100, 50));
      if (v > 80) v = 80;
      v = map(v, 0, 80, 1.0, 0.0);
      sonido[10].setVolume(v); // sonido del sol

      var rr = random(10);
      if (rr < 0.5) {
        r_rate = r_rate * -1; //
        //rr = random(0.1, 1.0);
      } else if (rr < 1) {
        r_rate = 0.25;
      } else if (rr < 2) {
        r_rate = 1.0;
      }
      if (r_rate != r_memo) {
        sonido[10].rate(r_rate);
        //mi_sound[1].jump(0);
        //  print(r_rate);
      }
      r_memo = r_rate;
    }*/
    // ---------------- titulo  --------------
    if (b_titulo) {
      if (millis() < titulo_tiempo) {
        text_titulo.show();
        text_titulo.position(windowWidth / 2 - text_titulo.width / 2, 80);
      } else {
        text_titulo.position(windowWidth / 2 - text_titulo.width / 2, 80);
        if (titulo_fade <= 1) {
          titulo_fade -= 0.05;
          text_titulo.style("opacity", titulo_fade);
          if (titulo_fade <= 0) {
            text_titulo.hide();
            b_titulo = false;
          }
        }
      }
    }
    // flecha --------------
    if (pantalla_pos === 0) {
      flecha.position(windowWidth - 80, windowHeight / 2.5);
      flecha.show();
    } else flecha.hide();


  } else
  // ------------------ GAME OVER: seccion 4 -----------------------
  if (seccion == 4) {
    // -------------------- montanias -----------------------  
    for (var i = montania.length - 1; i >= 0; i--) {
      montania[i].update();
    }
    // ------------------------ sol -----------------------
    var m = map(pantalla_pos, 0, mi_width, 0, 3000);
    if (m > 3000) m = 3000;
    sol.position(solX + m, solY);

    // ------- scroll----------
    Scroll(); //pantalla_pos = document.getScroll()[0];
  }
}


// =================== arma montanias 1º y 2º plano ==================
function arma_montania_1() {
  // 1º plano -----------------
  //  m2 = x_inicial;
  //for (var i = 0; i < 8; i++) {
  var m1 = int(random(120, 135));
  var m3 = random(1.036, 1.04);
  montania.push(new Montania(cantMont, m1, m2 + random(200), m3, 14, 1.0, 1));
  cantMont++;
  m2 += 540; //orig: 640 (total:4480)

  if (cantMont == 9) m2 = 900;
}

function arma_montania_2() {
  // 2º plano -----------------
  var m1 = int(random(80, 100));
  var m3 = random(1.05, 1.053);
  montania.push(new Montania(cantMont, m1, m2 + random(250), m3, 9, 0.75, 1));
  cantMont++;
  m2 += 603; // orig: 720

}


// ======================== arma escenario ========================
function escenario() {
  text_buscando.remove(); //mi_div.remove();
  cnv = createCanvas(mi_width, mi_height);
  // cnv2.style("overflow-y", "hidden");
  cnv.style("z-index", "-1");
  //cnv.parent("sketch-holder");
  cnv.position(0, 20);
  // -------------------- montanias -----------------------  
  for (var i = montania.length - 1; i >= 0; i--) {
    montania[i].to_show();
  }

  // ----------------- man --------------------
  for (var i = 0; i < 2; i++) {
    man[i].style("z-index", "2");
  }
  man_stop.style("z-index", "2");

  man_x = -20;
  var s = createSpan("");
  s.id("centrado");
  man_y = mi_height - 22 - 20 + 20; // ventana - size_man - piso + margen html
  manP = createP("");
  manP.style("font-size", "26px");
  manP.style("z-index", "10");
  manP.parent("centrado");

  hand.style("z-index", "10");
  hand.hide();

  solX = displayWidth + 100;
  solY = mi_height - 20 - 400; //size_ventana - piso - size_sol
  sol.style('z-index', '0');
  sol.position(solX, solY);
  sol.show();

  fondo();

  // --------------- panel de control -------------
  var panelGra = createDiv("");
  panelGra.id("panelGral");
  text_tiempo = createP("10 s");
  text_tiempo.style("color", "#dddddd");
  text_tiempo.style("margin", "2px 1em 0 auto");
  text_tiempo.style("font", "13px TitilliumL");
  text_tiempo.parent("panelGral");
  text_puntaje = createP("score: 000");
  text_puntaje.style("color", "#dddddd");
  text_puntaje.style("margin", "2px 1em 0 auto");
  text_puntaje.style("font", "13px TitilliumL");
  text_puntaje.parent("panelGral");
  text_sound = createElement("bb", "sound ON");
  text_sound.style("margin", "2px 1em 0 auto");
  text_sound.parent("panelGral");
  text_sound.mousePressed(sound_press);
  var text_info = createElement('bb', 'info');
  text_info.style("margin", "2px 1em 0 auto");
  text_info.style("margin-right", "22px");
  text_info.parent("panelGral");
  text_info.mousePressed(info_press);

  // titulo ------------
  //text_titulo.show();
  text_titulo.parent("centrado");

  // sonidos -------------
  sonido[10].loop(); // viento
  ////sonido[10].setVolume(0); // sol
  ////sonido[10].loop();
  ////sonido[10].playMode('restart');
}


// ======================= funciones ===========================
function sound_press() {
  b_sound ^= true;
  if (b_sound) {
    text_sound.html("sound ON");
    sonido[10].setVolume(1.0);
    sonido[10].play();
    //}
  } else {
    text_sound.html("sound OFF");
    for (var i = 0; i < sonido.length; i++) {
      sonido[i].setVolume(0);
      sonido[i].pause();
    }
  }
}

function info_press() {
  var myWindow = window.open("https://yamilburguener.blogspot.com/2017/12/colinas-punto-muerto.html", "_blank");
}

function fondo() {
  background(18, 100, 130);
  for (var j = 0; j < mi_height; j++) { // j < windowHeight
    var b = map(j, 0, mi_height, 0, 130); // 0, 255
    stroke(18, 100, b); // stroke(random(250,225), b, 11);//
    //line(0, j+random(-5,5), mi_width, j+random(-5,5));
    strokeWeight(2);
    line(0, j, mi_width, j);
  }
  textSize(16);
  fill(55);
  textAlign(LEFT);
  text("LINKS CHATARRA >>>", 30, mi_height - 19);
  textAlign(RIGHT);
  text("<<< LINKS CHATARRA", mi_width - 30, mi_height - 19);

  // piso de letras ------
  textAlign(CENTER);
  noStroke();
  fill(0);
  textSize(14);
  var to_x = 24;
  for (var y = mi_height - 13; y < mi_height + 4; y = y + 4) {
    for (var x = 0; x < mi_width; x = x + to_x) {
      push();
      translate(x, y);
      rotate(random(-0.1, 0.1));

      var pal = "";
      var rFor = int(random(5, 16));
      for (var ii = 0; ii < rFor; ii++) {
        var r = int(random(letra.length));
        pal += letra[r];
      }
      fill(random(0, to_x));
      text(pal, 0, 0);
      pop();
    }
    to_x -= 4;
    if (to_x < 0) to_x = 0;
  }
}



// devuelve pos del scroll (codigo javaScript) -------------
/*document.getScroll = function() {
    if (window.pageYOffset != undefined) {
      return [pageXOffset, pageYOffset];
    } else {
      var sx, sy, d = document,
        r = d.documentElement,
        b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return [sx, sy];
    }
  }*/
function Scroll() {
  if (window.pageYOffset != undefined) {
    pantalla_pos = pageXOffset;
    //return [pageXOffset, pageYOffset];
  } else {
    var sx, sy, d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    print("pageYOffset == undefined: " + sx + ", " + sy) //return [sx, sy];
  }
}

// ------------------- function seccion 1 ---------------------
function text_enter() {
  new_sitio = input_sitio.value();
  new_sitio = new_sitio.toLowerCase(); // de MAYUSC a minuscula
  if (new_sitio.length === 0) {
    // si no ingresa nada, es como presionar "skip"
    b_input_sitio = false;
  } else {
    b_input_sitio = true;
    if (new_sitio.length > 40) { // corta los links largos
      new_sitio = new_sitio.slice(0, 40);
    }
    // saca los espacios y simbolos raros
    var new_sitio_limpio = "";
    for (var i = 0; i < new_sitio.length; i++) {
      var n = new_sitio.slice(i, i + 1);
      for (var ii = 0; ii < letra.length; ii++) {
        if (n == letra[ii]) {
          new_sitio_limpio += n;
          break;
        }
      }
    }
    new_sitio = new_sitio_limpio;
    // paso final: arma base de datos de las letras del usuario
    for (var i = 0; i < new_sitio.length; i++) {
      letra_u[i] = new_sitio.slice(i, i + 1);
    }
  }
  seccion_buscando();
}

function seccion_buscando() {
  text_intro0.remove();
  text_intro1.remove();
  text_intro2.remove();
  input_sitio.remove();
  boton_skip.remove();
  boton_enter.remove();
  panelIntro.remove();
  if (b_input_sitio) to_buscando = subt_buscando[0];
  else to_buscando = subt_buscando[1];
  text_buscando = createP(to_buscando + " 0%");
  var s = createSpan("");
  s.id("centrado");
  text_buscando.style("z-index", "1000");
  text_buscando.style("color", "#dddddd");
  text_buscando.style("font", "15px TitilliumB");
  text_buscando.parent("centrado");
  //text_buscando.style("cursor", "wait"); // no funciona
  seccion = 2;

}

function to_seccion_4() {

  flecha.hide();
  man[0].hide();
  man[1].hide();
  hand.hide();
  man_stop.position(man_x, man_y);
  man_stop.show();
  b_hand = 2; // para que no se pueda hacer clic en nuevos sitios

  panelIntr = createDiv("");
  panelIntr.id("panelIntro");
  var t = createP("FIN");
  t.style("font-size", "26px");
  t.style("text-align", "center");
  t.parent("panelIntro");

  var t = createP("puntaje: " + n_puntos);
  t.style("font-size", "15px");
  t.style("text-align", "center");
  t.parent("panelIntro");

  if (mis_sitios.length > 0) {
    var t = createP("¡Felicitaciones! Aquí la lista de sitios rescatados:");
    t.style("font", "15px TitilliumL");
    t.style("text-align", "center");
    t.parent("panelIntro");

    var tt = "";
    for (var i = 0; i < mis_sitios.length; i++) {
      if (i < mis_sitios.length - 1) tt = tt + mis_sitios[i] + " | ";
      else tt = tt + mis_sitios[i];
    }
    var t = createP(tt);
    t.style("text-align", "center");
    t.parent("panelIntro");

  } else {
    var t = createP("No has rescatado sitios");
    t.style("text-align", "center");
    t.parent("panelIntro");
  }

  seccion = 4;
}


// ======================== base de datos ====================
function letras() {
  letra[0] = "a";
  letra[1] = "b";
  letra[2] = "c";
  letra[3] = "d";
  letra[4] = "e";
  letra[5] = "f";
  letra[6] = "g";
  letra[7] = "h";
  letra[8] = "i";
  letra[9] = "j";
  letra[10] = "k";
  letra[11] = "l";
  letra[12] = "m";
  letra[13] = "n";
  letra[14] = "o";
  letra[15] = "p";
  letra[16] = "q";
  letra[17] = "r";
  letra[18] = "s";
  letra[19] = "t";
  letra[20] = "u";
  letra[21] = "v";
  letra[22] = "w";
  letra[23] = "x";
  letra[24] = "y";
  letra[25] = "z";
  letra[26] = "-";
  letra[27] = "_";
  letra[28] = "0";
  letra[29] = "1";
  letra[30] = "a";
  letra[31] = "e";
  letra[32] = "i";
  letra[33] = "o";
  letra[34] = "u";
}

function subtitulos() {
  idioma = subset(userLang, 0, 2);
  if (idioma == "es") {
    subt_intro1 = "Un diminuto ser corre entre montañas de URLs chatarra que nadie parece querer. Ayúdalo a rescatar algunos links. Para ello, solo tienes que abrirlos, y así -quizá- conocer e incluir nuevas experiencias en tu navegación. ¡Suerte!, pero ten cuidado de no hacer clic en virus y malewares.";
    subt_intro2 = "Nota: Para que funcione correctamente, configure el navegador para que permita PANTALLAS EMERGENTES, y luego refresque la página.";
    subt_intro3 = "Si desea, ingrese palabras claves para la busqueda:";
    subt_buscando[0] = "Buscando...";
    subt_buscando[1] = "Espere un momento...";
  } else { // para el resto de los idiomas va ingles
    subt_intro1 = "Over time, it has accumulated mountains of links like they were rubbish. Help rescue some links. Just click on the hyperlinks you want, but be careful not to open some casual virus or maleware.";
    subt_intro2 = "Note: To work properly, configure the browser to allow POP-UP WINDOWS, and then refresh this page.";
    subt_intro3 = "Enter keywords for the search, if you want:";
    subt_buscando[0] = "Searching...";
    subt_buscando[1] = "Wait a moment...";
  }
}

function para_links() {
  text_link[0] = ".com";
  text_link[1] = ".net";
  text_link[2] = ".org";
}