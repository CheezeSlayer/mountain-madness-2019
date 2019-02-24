var cnv;
var x = 0;
var y = 400;
var r = 0;
var g = 250;

var cloud = 0

var on = true;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(800, 500);
  centerCanvas();
  background(220);
  cloudInit(5);
}

var on = true;

var x_pos = [];
var y_pos = [];
var cloudHeight = [];
var cloudWidth = [];

function cloudInit (cloudNum) {
  for (var index = 0; index < cloudNum; index++)
  {
    var x_val = random(0, width);
    var y_val = random(0, height);
    var cloud_height_val = random(50, 100);
    var cloud_width_val = random(100, 300);

    x_pos.push(x_val);
    y_pos.push(y_val);
    cloudHeight.push(cloud_height_val);
    cloudWidth.push(cloud_width_val);
  }

  for ( var index = 0; index < cloudNum; index++)
  {
    console.log(x_pos[index]);
    console.log(" ");
  }
}


function clouds(cloudNum) {
  for ( var index = 0; index < cloudNum; index++ )
  {
    noStroke();
    fill(245,250,250,200);
    ellipse(x_pos[index], y_pos[index], cloudWidth[index], cloudHeight[index]);
  }
}

function draw() {
  //sky
  if (on) {
  //r= map(mouseY,0,400,0,255);
  background(r+50,200,250);
  } else {
    background(0);
  strokeWeight(0);
  stroke(255);
  for (var d = 0; d <= width; d += 30) {
    for (var e = 0; e <= height; e += 30){
      fill(random(255), random(255), random(255));
      ellipse(d, e, 5, 5);
    }
  }
    }

  push();
  translate(cloud, -60);
  scale(1);
  clouds(5);
  pop();

if (cloud > width) {
	cloud = -50
}


	cloud += 0.2;

/*
  //sun
  fill(255, 250, 0);
  ellipse(200,mouseY,180,180);

  //mountain
  noStroke()
  fill(70,5,150);
  triangle(2,400,200,150,397,400);

  //mountain peek
  noStroke()
  fill(245,248,240);
  quad(143,220,200,150,250,210,200,190);
*/
}

function mousePressed() {
  if (mouseX > 2 && mouseX < 390 && mouseY > 293 && mouseY < 400){
  on=!on;
  }
}
