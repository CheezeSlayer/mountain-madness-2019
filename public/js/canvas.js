//	### CANVAS CODE --  DON'T TOUCH ###//
var cnv;

var x = 0;
var y = 400;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

/* ### VARIABLES ### */


// List user input variables in caps below
var USR_BG_COL;


// List CONSTANT variables
var PIXEL_TO_GRID_SCALE = 6;	// how many pixels wide is a grid pixel
var BACKGROUND_COL = 10;

// Other global variables
var grid = [];



/* ### FUNCTIONS ### */

function setup() {
  cnv = createCanvas(800, 500);
  centerCanvas();
  background(220);
  generate();
}

function initGrid()
{
	var column = [];

	for(row = 0; row < width / PIXEL_TO_GRID_SCALE; row++)
	{
		column[row] = USR_BG_COL * 10;
	}

	for(col = 0; col <  height / PIXEL_TO_GRID_SCALE; col++)
	{
		grid[col] = column;
	}
}


function drawGrid()
{
	for(col = 0; col < height / PIXEL_TO_GRID_SCALE; col++)
	{
		for(row = 0; row < width / PIXEL_TO_GRID_SCALE; row++)
		{
			var xPos = row * PIXEL_TO_GRID_SCALE;
			var yPos = col * PIXEL_TO_GRID_SCALE;
			push();
			stroke(100);
			strokeWeight(1);
			fill(grid[col][row]);
			rect(xPos, yPos, PIXEL_TO_GRID_SCALE, PIXEL_TO_GRID_SCALE);
			pop();
		}
	}
}

function generate() {
  USR_BG_COL = document.getElementById("cloudRange").value;
  initGrid();
  drawGrid();
}


function draw()
{
	//empty
}
