// Esquirla class --------------------------------------------------
function Esquirla(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.t = millis() + 5000; // tiempo de vida
  this.r = int(random(10, 20));

  if (random(2) < 1) this.r *= -1;

  this.sprite = createSprite(this.x, this.y);
  this.sprite.addImage(img_esquirla);
  this.sprite.setSpeed(random(4, 15), random(180, 360));
  this.sprite.rotationSpeed = this.r;
  //this.sprite.scale = random(0.5, 1);
  //this.sprite.mass = this.sprite.scale;
  this.sprite.restitution = 1.9;

  this.contacto = function(_ii) {
    this.sprite.velocity.y += GRAVITY * 0.0001;

    if (this.sprite.bounce(plataforma[_ii])) {
      this.sprite.bounce(plataforma[_ii]);
      Cambia_vocal(_ii);
    }
    //
  }

  this.isFinished = function() {
    if (millis() > this.t) {
      this.sprite.remove();
      return true;
    } else {
      return false;
    }
  }
}