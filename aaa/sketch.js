function setup() {
  createCanvas(windowWidth, windowHeight);//360, 640);
  colorMode(HSB);
  textAlign(CENTER);
}

function draw() {
  background(0,100,0);
  fill(255, 255, 0);
  ellipse(width/2, height/2, 150, 150);
}

function touchStarted () {
  if (!fullscreen()) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};
