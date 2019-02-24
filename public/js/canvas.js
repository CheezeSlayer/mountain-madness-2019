var cnv;
var x = 0;
var y = 400;

var usrCloud;

var cloud = 0
var x_pos = [];
var y_pos = [];
var cloudHeight = [];
var cloudWidth = [];

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(800, 500);
  centerCanvas();
  background(220);
  generate();
}

function generate() {
  usrCloud = document.getElementById("cloudRange").value;
}
