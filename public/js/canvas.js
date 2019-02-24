var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(800, 500);
  centerCanvas();
  background(220);
  rect(10, 10, 200, 200);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
    ellipse(mouseX, mouseY, 5, 5);
  }
}


function windowResized() {
  centerCanvas();
}
