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
<<<<<<< HEAD
  noLoop();
=======
  rect(10, 10, 200, 200);
>>>>>>> 6777d4efa33967d6bfa70fa6387a6994c52e3807
}

function draw() {
  background(255);
  strokeWeight(5);
  translate(width/2,height);
  branch(0);
}

function windowResized() {
  centerCanvas();
}

function branch(depth){
  if (depth < 10) {
    line(0,0,0,-height/10); // draw a line going up
    {
      translate(0,-height/10); // move the space upwards
      rotate(random(-0.05,0.05));  // random wiggle

      if (random(1.0) < 0.6){ // branching
        rotate(0.3); // rotate to the right
        scale(0.8); // scale down

        push(); // now save the transform state
        branch(depth + 1); // start a new branch!
        pop(); // go back to saved state

        rotate(-0.6); // rotate back to the left

        push(); // save state
        branch(depth + 1);   // start a second new branch
        pop(); // back to saved state
     }
      else { // no branch - continue at the same depth
        branch(depth);
      }
    }
  }
}

function mouseReleased(){
  redraw();
}
