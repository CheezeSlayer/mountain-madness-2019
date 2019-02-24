
var cnv;

var cnv_x = 0;
var cnv_y = 400;

function centerCanvas() {
  var cnv_x = (windowWidth - width) / 1.5;
  var cnv_y = (windowHeight - height) / 2;
  cnv.position(cnv_x, cnv_y);
}

/* ### VARIABLES ### */


// List user input variables in caps below
var USR_BG_COL;
var USR_ROCK_COL_WIDTH;


// List CONSTANT variables
var PIXEL_TO_GRID_SCALE = 15;	// how many pixels wide is a grid pixel
var BACKGROUND_COL = 10;

// Other global variables
var grid = [];	// array of COLUMNS
var g_width;
var g_height;
var x_offset = -100;
var y_offset = 0;
var first_col;	// first column to render
var last_col;
var first_row;	// first row to render
var last_row;
var INITIAL_GEN_WIDTH;
var INITIAL_GEN_HEIGHT;

// Canvas width and height


/* ### FUNCTIONS ### */

function setup() {
  cnv = createCanvas(800, 500);
  centerCanvas();
  INITIAL_GEN_WIDTH = width * 1;
  INITIAL_GEN_HEIGHT = height * 1;
  background(220);
  generate();
}



function initGrid()
{
  var cols = floor(INITIAL_GEN_WIDTH / PIXEL_TO_GRID_SCALE);
  var rows = floor(INITIAL_GEN_HEIGHT / PIXEL_TO_GRID_SCALE);

  var colIndex = 0;
  var rowIndex = 0;

  for ( colIndex = 0; colIndex < cols; colIndex++ )
  {
    grid[colIndex] = [];
    for ( rowIndex = 0; rowIndex < rows; rowIndex++ )
    {
      grid[colIndex][rowIndex] = USR_BG_COL*10;
    }
  }

  g_width = cols;
  g_height = rows;
}


function gRect(x, y, w, h, color) {

	var rounded_x = round(x);
	var rounded_y = round(y);
	var rounded_w = round(w);
	var rounded_h = round(h);

	for (var xindex = rounded_x; xindex < rounded_x + rounded_w; xindex++ )
	{
		for(var yindex = rounded_y; yindex < rounded_y + rounded_h; yindex++ )
		{
			if(xindex < g_width && yindex < g_height)
			{
		  		grid[xindex][yindex] = color;
			}
		}
	}
}

function drawGrid()
{
 	background(220);

// FIND FIRST AND LAST COL TO RENDER & CHECK VALID
	calculateColumnsToRender();

// FIND FIRST AND LAST ROW TO RENDER & CHECK VALID
  calculateRowsToRender();

// RENDER GRID
	for(col = first_col; col < last_col; col++)
	{
		for(row = first_row; row < last_row; row++)
		{
			var xPos = col * PIXEL_TO_GRID_SCALE + x_offset;
			var yPos = row * PIXEL_TO_GRID_SCALE + y_offset;
			push();
			stroke(100);
			strokeWeight(1);
			fill(grid[col][row]);	// take the color from the grid at that point
			rect(xPos, yPos, PIXEL_TO_GRID_SCALE, PIXEL_TO_GRID_SCALE);
			pop();
		}
	}
}


function calculateColumnsToRender()
{
	first_col = floor( -(x_offset / PIXEL_TO_GRID_SCALE));
	last_col = first_col + floor(width / PIXEL_TO_GRID_SCALE);
	if(first_col < 0){
		first_col = 0;
	}
	else if(first_col >= grid.length){
		first_col = grid.length;
	}

	if(last_col < 0){
		last_col = 0;
	}
	else if(last_col >= grid.length){
		last_col = grid.length;
	}
}

function calculateRowsToRender()
{
	first_row = floor( -(y_offset / PIXEL_TO_GRID_SCALE));
	last_row = first_row + floor(height / PIXEL_TO_GRID_SCALE);
	if(first_row < 0){
		first_row = 0;
	}
	else if(first_row >= grid[0].length){
		first_row = grid[0].length;
	}

	if(last_row < 0){
		last_row = 0;
	}
	else if(last_row >= grid[0].length){
		last_row = grid[0].length;
	}
}



/* ##### GENERATION FUNCTIONS ##### */


function drawRockColumns(col_begin, col_end)	// draw all columns
{
	for(var col = col_begin; col < col_end; col += USR_ROCK_COL_WIDTH)
	{
		drawSingleColumn(col, USR_ROCK_COL_WIDTH, random(g_height/2, g_height));
	}
}


function drawSingleColumn(grid_x, col_width, col_height)	// draw a single column
{
	gRect(grid_x, g_height - col_height, col_width, col_height, 255);
	//draw_small_rock(h, pos, pos+w, w * 0.1, w);
}




function generate() {
// GRAB USER INPUT
  USR_BG_COL = document.getElementById("regenRange").value;
  USR_ROCK_COL_WIDTH = document.getElementById("param2Range").value;

// Create and draw grid
  initGrid();
  drawRockColumns(0, g_width);
  drawGrid();
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    x_offset -= PIXEL_TO_GRID_SCALE;
    console.log(x_offset);
  } else if (keyCode === RIGHT_ARROW) {
    x_offset += PIXEL_TO_GRID_SCALE;
    console.log(x_offset);
  }

  if(key == 'a')
  {
  	console.log("x_offset: " + x_offset);
  	console.log("y_offset: "  + y_offset);
  	console.log("g_width: " + g_width);
  	console.log("g_height: "  + g_height);
  }
}


function mouseDragged()
{
	if(mouseX > 0 && mouseX < width)
	{
		if(mouseY > 0 && mouseY < height)
		{
			x_offset += (mouseX - pmouseX);
			y_offset += (mouseY - pmouseY);
		}
	}
}


function draw()
{
	drawGrid();
}
