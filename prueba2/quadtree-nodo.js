class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  contains(point) {
    let distX = Math.abs(this.x - point.x);
    let distY = Math.abs(this.y - point.y);
    let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    if (distance <= this.r) {
      return true;
    } else {
      return false;
    }
  }

  intersects(boundary) {
    let closeX = this.x;
    let closeY = this.y;

    if (this.x < boundary.x - boundary.w) {
      closeX = boundary.x - boundary.w;
    } else if (closeX > boundary.x + boundary.w) {
      closeX = boundary.x + boundary.w;
    }

    if (this.y > boundary.y + boundary.h) {
      closeY = boundary.y + boundary.h;
    } else if (this.y < boundary.y - boundary.h) {
      closeY = boundary.y - boundary.h;
    }

    let distX = Math.abs(this.x - closeX);
    let distY = Math.abs(this.y - closeY);
    let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    if (distance <= this.r) {
      return true;
    } else {
      return false;
    }

  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    if (point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h) {
      return true;
    } else {
      return false;
    }
  }

  intersects(boundary) {
    let boundaryR = boundary.x + boundary.w;
    let boundaryL = boundary.x - boundary.w;
    let boundaryT = boundary.y - boundary.h;
    let boundaryB = boundary.y + boundary.h;

    let rangeR = this.x + this.w;
    let rangeL = this.x - this.w;
    let rangeT = this.y - this.h;
    let rangeB = this.y + this.h;

    if (boundaryR >= rangeL &&
      boundaryL <= rangeR &&
      boundaryT <= rangeB &&
      boundaryB >= rangeT) {
      return true;
    } else {
      return false;
    }

  }
}

class QuadTree { // para que la performance funcione mejor? frameRate no baje tanto
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  clearQuadtree() {
    this.points = [];
    this.divided = false;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false
    }

    if (this.points.length < this.capacity) { // 10?
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }

    return false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    let northeastBoundary = new Rect(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(northeastBoundary, this.capacity);
    let northwestBoundary = new Rect(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(northwestBoundary, this.capacity);
    let southeastBoundary = new Rect(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(southeastBoundary, this.capacity);
    let southwestBoundary = new Rect(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(southwestBoundary, this.capacity);

    this.divided = true;

  }

  query(range, found) {
    if (!range.intersects(this.boundary)) {
      return false;
    } else {
      for (let i = 0; i < this.points.length; i++) {
        if (range.contains(this.points[i])) {
          found.push(this.points[i].userData);
        }
      }

      if (this.divided) {
        this.northeast.query(range, found);
        this.northwest.query(range, found);
        this.southeast.query(range, found);
        this.southwest.query(range, found);
      }
    }
    return found;
  }

 /*  setCapacity(_c) { bug mio
    this.capacity = _c;
  } */
}

// Nodo ----------------------------------------
class Nodo {
  constructor(x, y, _max, _n_num) {//, _n_num
    this.position = createVector(x, y)
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0);

    this.maxSpeed = _max; //1
    this.maxForce = _max; //1

    this.sep = 15; //bug
    //this.sepVel = 0.05

    this.sentido = "arriba";
    const _a = map(ancho, 525, 900, 0.25, 0.1); // menos cascadas en angostos 11 ojosN a 31, a 43  ...... 0.28, 0.1
    this.ojoNegro = false; if (_n_num == 8 && random() < _a) { this.ojoNegro = true; } // < 0.2
  }

  cohesion(_nodos) {

    let steering = createVector(0, 0); // p5 2.0
    let total = 2; // orig: total = 0;
    let thisIndex = _nodos.indexOf(this);
    let nextIndex = (thisIndex + 1) % _nodos.length;
    let prevIndex = (thisIndex - 1 + _nodos.length) % _nodos.length;
    steering.add(_nodos[nextIndex].position);
    steering.add(_nodos[prevIndex].position);
    //total += 2;

    //if (this.position.y < 200) cambia_sentido();//this.sentido = "abajo";
    if (this.sentido == "arriba") {
      if (this.sep > 15) this.position.y -= this.sep * 0.05;   //0.5;// bug
    } else {
      //if (this.sentido == "abajo") {
      if (this.sep > 15) this.position.y += this.sep * 0.4; //0.6
      /* if(this.position.y > height - marginB - 5) {
      // this.sepVel -= 0.02;
       this.position.y += 1; }
       else  {
       //this.sepVel += 0.1;
       this.position.y += 5;} */
      //}
    }


    //if (total > 0) {
    steering.div(total);
    // this.position.x += camaraX;// bug
    // if (this.position.x < margin) camaraX = 0.2; else if (this.position.x > width-margin) camaraX = -0.2; // bug

    steering.sub(this.position);
    steering.setMag(this.maxSpeed);
    steering.sub(this.velocity); // steering.sub(this.velocity.mult(1.1)); 
    steering.limit(this.maxForce); //steering.limit(this.maxForce * 0.9);// 

    //} 

    return steering; // entrepuente
  }

  setSeparacion(_s) {
    this.sep = _s;
  }

  getPosX() {
    return this.position.x;
  }

  getPosY() {
    return this.position.y;
  }

  getSentido() {
    return this.sentido;
  }

  getOjo() {
    return this.ojoNegro;
  }

  salto(_x, _y) {
    this.position.x = _x;
    this.position.y = _y;
  }

  setSentido(_se) {
    this.sentido = _se;
    // if (random()< 0.7)  this.sentido = "abajo";
    // else this.sentido = "nube";
    //
    //this.sep = 1;
  }

  /* cambia_marginW(_w) {
    this.marginW = _w;
  } */

  separation(neighbors) {

    let steering = createVector(0, 0); // p5 2.0
    let total = 0;
    for (let i = 0; i < neighbors.length; i++) {
      let distance = dist(this.position.x, this.position.y, neighbors[i].position.x, neighbors[i].position.y);
      if (this != neighbors[i] && distance < this.sep) {// bug separacion) {
        let diff = p5.Vector.sub(this.position, neighbors[i].position);
        if (distance * distance > 0) diff.div(distance * distance);
        steering.add(diff);
        total += 1;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  checkBorders(margin) {//, marginB) {
    let left = margin;
    let right = width - margin;
    let top = margin;
    let bottom = height - margin//  this.marginW// marginB; //bug

    //if (this.marginW != 150) this.marginW = 150;

    ////this.position.x += this.dir; //bug
    if (this.position.x > right) {
      this.position.x = right;
      ////this.dir = -1; // bug
      this.velocity.x *= -1;
    } else if (this.position.x < left) {
      this.position.x = left;
      ////this.dir = 1; // bug
      this.velocity.x *= -1;
    }

    if (this.position.y > bottom) {
      this.position.y = bottom;
      this.velocity.y *= -1;
    } else if (this.position.y < top) {
      this.position.y = top;
      this.velocity.y *= -1;
    }
  }

  update(_nodos, neighbors) {

    let separation = this.separation(neighbors);
    let cohesion = this.cohesion(_nodos);

    this.acceleration.add(separation);
    this.acceleration.add(cohesion);

    this.checkBorders(margin);//, marginB);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}