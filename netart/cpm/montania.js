function Montania(_n, _cant, _ubic_x, _expo, _sFont, _avanzar, _z) {
  this.n = _n; // nº de montania
  this.cant = _cant; // cantidad de links por montania
  this.ubic_x = _ubic_x; // posicion inicial del x de c/montaia
  this.expo = _expo; // hasta donde sube la montania
  this.sFont = _sFont; // size de los links de la montania
  this.avanzar = _avanzar; // velocidad que avanza la montania segun si esta mas lejos
  this.z_index = _z; // layer de cada montania
  this.rLink_x = 0; // forma triangular de la montania (muchos abajo, pocos arriba)

  var link = [];
  var link_hide; // p/link que se borra cuando se hace clic
  var text_link_clic;

  var to_expo = this.expo;
  //var rLink_x = this.cant; // forma triangular de la montania (muchos abajo, pocos arriba)
  if (this.avanzar <= 1) this.rLink_x = this.cant;
  else this.rLink_x = this.cant * 2;

  for (var i = 0; i < this.cant; i++) {
    palabra = "www.";

    var r;
    if (b_input_sitio) r = 2; // si el usuario ingresó palabras
    else r = 1;

    if (int(random(r)) == 0) {
      var rFor = int(random(5, 16));
      for (var ii = 0; ii < rFor; ii++) {
        var r = int(random(letra.length));
        palabra += letra[r];
      }
    } else { // arma la palabras con las letras del usuario
      var rFor = int(random(1,5));
      for (var ii = 0; ii < rFor; ii++) {
        var r = int(random(letra_u.length));
        palabra += letra_u[r];
        palabra += letra_u[(r + 1) % letra_u.length];
        if (int(random(2)) == 0) palabra += letra_u[(r + 2) % letra_u.length];
        if (int(random(3)) == 0) palabra += letra[(int(random(letra_u.length)))];
      }
    }
    var r = int(random(text_link.length));
    palabra += text_link[r]; //suma .com, .org, etc....
    //link[i] = createA('http://www.' + palabra + text_link[r], 'www.' + palabra + text_link[r], '_blank');
    link[i] = createElement('aa', palabra);
    link[i].hide();
    //link[i] = createA("http://www.yamilburguener.com.ar", "rferger", "_blank, width=100,height=100");
    //palabra = "";
    link[i]._e = { // mis _events
      n: this.n, // nº de montania
      nL: i, // nº de link
      cant: this.cant, // cant de link en la montania
      expo: this.expo,
      avanzar: _avanzar,
      x: this.ubic_x,
      y: 0
    };
    // ------ x ------
    link[i]._e.x = link[i]._e.x + random(-this.rLink_x, this.rLink_x);
    this.rLink_x -= 1;
    if (this.rLink_x < 4) this.rLink_x = 4;
    // ------ y ------
    this.expo *= to_expo;
    link[i]._e.y = map(this.expo, 1, this.cant * 0.7, mi_height - 10, mi_height - this.cant * 2.6);
    if (this.avanzar <= 1) link[i]._e.x += this.expo; // medianos y chicos  están torcidos
    else link[i]._e.x += this.expo / 2;
    link[i]._e.expo = this.expo; // carga expo al _event expo

    link[i].position(link[i]._e.x, link[i]._e.y);
    // ------ rotate ------
    mi_rotate(i);

    link[i].style("font-size", this.sFont + "px");
    link[i].style("z-index", this.z_index);
    link[i].mousePressed(to_openWin);
  }

  function to_openWin() {
    if (b_hand === 0) {
      man[0].hide();
      man[1].hide();
      man_stop.hide();
      b_man_run = false;
      // mano - bomba ------------------
      b_hand = 1;
      hand_x = man_x;
      hand_y = man_y;
      hand_xf = mouseX;
      hand_yf = mouseY;
      // hand_arco = abs(hand_xf - hand_x);
      hand.position(hand_x, hand_y);
      hand.show();
      // montania se desmorona ---------
      link_hide = this._e.nL;
      //link[link_hide].hide();
      to_n_link = this._e.n; //n_link_hide = this._e.n;
      desmorona_map = 10;
      text_link_clic = this.elt.textContent;
      mis_sitios.push(text_link_clic);
    }
  }

  this.openWin = function() {
    b_tiempo = false; // el tiempo se detiene
    // montania se desmorona ---------
    n_link_hide = to_n_link;
    link[link_hide].hide();
    // se abre una nueva ventana -------
    var r = int(random(150, 350));

    var myWindow = window.open("http://" + text_link_clic, "_blank", "width=" + r + ", height=" + r);
    myWindow.moveTo(int(random(0, windowWidth - r)), int(random(0, windowHeight - r)));
    // puntaje -------
    n_puntos += 100;
    text_puntaje.html("score: " + n_puntos);
  }

  function mi_rotate(_i) {
    var gra = map(link[_i]._e.expo, 1, link[_i]._e.cant * 0.7, 1, 89);
    var rGra = map(i, 0, link[_i]._e.cant, 40, 1);
    var rr = random(2);
    if (rr < 1) {
      link[_i].style("rotate", gra + random(-rGra, rGra));
    } else {
      link[_i].style("rotate", -gra + random(-rGra, rGra));
    }
  }

  this.desmorona = function() {

    for (var i = link_hide + 1; i < link[link_hide]._e.cant; i++) {
      if (random(20) < 1) mi_rotate(i);
      var yy = map(link[i]._e.y, 0, mi_height, desmorona_map, 1); // links de arriba caen mas
      yy *= this.avanzar;
      link[i]._e.y += random(yy - 2, yy + 2);
      if (this.avanzar == 1.0) link[i].position(link[i]._e.x, link[i]._e.y);

      if (b_sound) {
        var ii = int(random(10));
        sonido[ii].rate(random(1.5, 3));
        sonido[ii].pan(random(-1, 1));
        var v = this.avanzar * 0.05;
        sonido[ii].setVolume(v); // (0.05)
        sonido[ii].play();
      }
    }

    desmorona_map -= 1;
    if (desmorona_map < 0) desmorona_map = 0;
  }

  this.update = function() {
    if (this.avanzar < 1.0) { // las montanias chicas
      var m = map(pantalla_pos, 0, mi_width - windowWidth, -400, 400);
      for (var i = 0; i < this.cant; i++) {
        var xx = link[i]._e.x + m; //vel_avanzar * this.avanzar; // avance normal
        link[i].position(xx, link[i]._e.y);
      }
    } else
    if (this.avanzar > 1.0) { // las montanias en 1º plano
      var m = map(pantalla_pos, 0, mi_width - windowWidth, 1400, -1400);
      for (var i = 0; i < this.cant; i++) {
        var xx = link[i]._e.x + m;
        link[i].position(xx, link[i]._e.y);
      }
    }
  }

  this.to_show = function() {
    for (var i = 0; i < this.cant; i++) {
      link[i].show();
    }
  }

  this.to_hide = function() {
    for (var i = 0; i < this.cant; i++) {
      link[i].hide();
    }
  }
}