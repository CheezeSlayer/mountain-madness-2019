var cnv;
var COL_WIDTH = 25;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}


function draw_border()
{
	line(0, 0, 0, height);	// left side
	line(0, height -1, width, height -1);	// bottom side
	line(width - 11, 0, width -11, height); //right side
	line(0, 0, width, 0);
}


function draw_base()
{
	background(116, 190, 237);
	
	push();
	stroke(0);
	strokeWeight(4);
	line(0, height - 10, width, height -10);
	pop();
	draw_columns();
}


function draw_columns()	// draw many columns and decide height distribution
{
	for(counter = 0; counter < width/ COL_WIDTH; counter++)
	{
		draw_column(counter * COL_WIDTH, COL_WIDTH, random(100, height));
	}
}

function draw_column(pos, w, h)	// draw a single column
{
	push();
	strokeWeight(0);
	fill(56, 47, 56);
	rect(pos, height - h, w, h);
	pop();
	
	draw_small_rock(h, pos, pos+w, w * 0.1, w);
}

function draw_small_rock(vpos, left_bound, right_bound, sizemin, sizemax)
{
	vsize = random(sizemin, sizemax);
	hsize = random(sizemin, sizemax);
	hpos = random(left_bound, right_bound - hsize);
	push();
	strokeWeight(0);
	fill(56, 47, 56);
	rect(hpos, height - vpos - vsize + 1, hsize, vsize);
	pop();
}


function setup() { 
  createCanvas(800, 450);
	draw_border();
	draw_base();
} 

function draw() { 
	
}


function windowResized() {
  centerCanvas();
}
