var cloud = 0
var x_pos = [];
var y_pos = [];
var cloudHeight = [];
var cloudWidth = [];

var usrCloud;

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

  background(50,200,250);
}
