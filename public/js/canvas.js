
var cnv;



function centerCanvas() {
  var cnv_x = (windowWidth - width) / 1.5;
  var cnv_y = (windowHeight - height) / 2;
  cnv.position(cnv_x, cnv_y);
}

/* ### VARIABLES ### */


// List user input variables in caps below
var USR_ROCK_COL_WIDTH;
var USR_SIN_AMP;
var USR_SIN_FREQ;
var USR_SIN_DEVIATION;
var USR_MTN_HEIGHT;

var USR_CLOUD_NUM;
var USR_CLOUD_HEIGHT;
var USR_CLOUD_WIDTH;
var USR_CLOUD_SPACING;

// List CONSTANT variables
var PIXEL_TO_GRID_SCALE = 25;	// how many pixels wide is a grid pixel
var BACKGROUND_COL = 10;

// Other global variables
var grid = [];	// array of COLUMNS
var rock_heights = [];	// array of heights of ground level at every grid pixel
var g_width;
var g_height;
var x_offset = 0;
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
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent(document.getElementById("canvas-div"));
  INITIAL_GEN_WIDTH = width * 10;
  INITIAL_GEN_HEIGHT = height * 3;
  background(220);
  generate();
}



function initGrid()
{
  var cols = floor(INITIAL_GEN_WIDTH / PIXEL_TO_GRID_SCALE);
  var rows = floor(INITIAL_GEN_HEIGHT / PIXEL_TO_GRID_SCALE);
  console.log(cols, rows);
  var colIndex = 0;
  var rowIndex = 0;

  for ( colIndex = 0; colIndex < cols; colIndex++ )
  {
    grid[colIndex] = [];
    for ( rowIndex = 0; rowIndex < rows; rowIndex++ )
    {
      grid[colIndex][rowIndex] = color(0, 0, 0);
    }
  }

  g_width = cols;
  g_height = rows;
}


function gRect(x, y, w, h, r, g, b) {

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
		  		grid[xindex][yindex] = color(r, g, b);
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
	strokeWeight(0);
	for(col = first_col; col < last_col; col++)
	{
		for(row = first_row; row < last_row; row++)
		{
			var xPos = col * PIXEL_TO_GRID_SCALE + x_offset;
			var yPos = row * PIXEL_TO_GRID_SCALE + y_offset;
			fill(grid[col][row]);	// take the color from the grid at that point
			rect(xPos, yPos, PIXEL_TO_GRID_SCALE, PIXEL_TO_GRID_SCALE);
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

function drawSky()
{
	gRect(0, 0, g_width, g_height, 132, 198, 237);
}


function drawRockColumns(col_begin, col_end)	// draw all columns
{
	var counter = 0;
	var rock_col_heights = [];
	for(var col = 0; col < col_end; col += USR_ROCK_COL_WIDTH)
	{
		var random_offset = round(random(-USR_SIN_DEVIATION, USR_SIN_DEVIATION));
		rock_col_heights[counter] = random_offset + (USR_MTN_HEIGHT + round(USR_SIN_AMP * sin(col / USR_SIN_FREQ)));
		drawSingleColumn(col, USR_ROCK_COL_WIDTH, rock_col_heights[counter]);

		//console.log("for range: " + col + " - " + (col + USR_ROCK_COL_WIDTH));
		for(gcol = col; gcol < col + USR_ROCK_COL_WIDTH; gcol++)	// write heights to rock heights[]
		{
			//console.log("setting height at: " + gcol + " to: " + rock_col_heights[counter]);
			rock_heights[gcol] = rock_col_heights[counter];
			//console.log("rock_heights[" + gcol + "] = " + rock_col_heights[counter]);
		}
		counter++;
	}


	for(var col = 1; col < rock_col_heights.length; col++)
	{
		if(rock_col_heights[col -1] > rock_col_heights[col])
		{
			recursiveRockSmoothLeft(col * USR_ROCK_COL_WIDTH, rock_col_heights[col], USR_ROCK_COL_WIDTH, rock_col_heights[col -1] - rock_col_heights[col]);
		}
		if(rock_col_heights[col -1] < rock_col_heights[col])
		{
			recursiveRockSmoothRight((col -1) * USR_ROCK_COL_WIDTH, rock_col_heights[col -1], USR_ROCK_COL_WIDTH, rock_col_heights[col] - rock_col_heights[col -1]);
		}
	}
}


function recursiveRockSmoothLeft(x, h, w, step_size_left)
{

	for(col = x; col < x + w; col++)	// write heights to rock heights[]
	{
		rock_heights[col] = h;
	}


	if(step_size_left <= 1 || w <= 1)
	{
		return;	// finished if step is acceptable (goes down, or go up by only one)
	}
	// create a rectangle that has a random size and is nestled into the corner
	var new_chunk_height = floor(random(1, step_size_left));
	var new_chunk_width = floor(random(1, w));

  var r, g, b;
  r = round(random(90, 128));
  g = round(random(90, 128));
  b = round(random(90, 128));
	gRect(x, g_height - (h + new_chunk_height), new_chunk_width, new_chunk_height, r, b, g);



	// recursive call for new rectangle in both new corners
	recursiveRockSmoothLeft(x, h + new_chunk_height, new_chunk_width, step_size_left - new_chunk_height);
	recursiveRockSmoothLeft(x + new_chunk_width, h, w - new_chunk_width, new_chunk_height);
}


function recursiveRockSmoothRight(x, h, w, step_size_right)
{
	for(col = x; col < x + w; col++)	// write heights to rock heights[]
	{
		rock_heights[col] = h;
	}

	if(step_size_right <= 1 || w <= 1)
	{
		return;	// finished if step is acceptable (goes down, or go up by only one)
	}
	// create a rectangle that has a random size and is nestled into the corner
	var new_chunk_height = floor(random(1, step_size_right));
	var new_chunk_width = floor(random(1, w));

  var r, g, b;
  r = round(random(90, 128));
  g = round(random(90, 128));
  b = round(random(90, 128));
	gRect(x + (w - new_chunk_width), g_height - (h + new_chunk_height), new_chunk_width, new_chunk_height, r, b, g);

	// recursive call for new rectangle in both new corners
	recursiveRockSmoothRight(x + (w - new_chunk_width), h + new_chunk_height, new_chunk_width, step_size_right - new_chunk_height);
	recursiveRockSmoothRight(x, h, w - new_chunk_width, new_chunk_height);
}


// !!! Merge back into drawRockColumns()???
function drawSingleColumn(grid_x, col_width, col_height)	// draw a single column
{
  var r, g, b;
  r = round(random(90, 128));
  g = round(random(90, 128));
  b = round(random(90, 128));
	gRect(grid_x, g_height - col_height, col_width, col_height, r, g, b);
}

function drawCloud(cloudNum, cloudH, cloudW) {
  cloudNum = USR_CLOUD_NUM;
  cloudH = USR_CLOUD_HEIGHT;
  cloudW = USR_CLOUD_WIDTH;
  first_col = 0;
  first_row = 0;
  last_col = g_width;
  last_row = g_height/2;
  x_cloud = 0;
  y_cloud = 0;

  var cloudArr = [];
  for( var index = 0; index < cloudNum; index++ )
  {
    cloudH = round(random(0, USR_CLOUD_HEIGHT));
    cloudW = round(random(0, USR_CLOUD_WIDTH));
    x_cloud = round(random(first_col, last_col));
    y_cloud = round(random(first_row, last_row));
    //console.log(last_col, last_row);
    //console.log(x_cloud, y_cloud);
    /*var r , g , b;
    r = round(random(204, 255));
    g = round(random(204, 255));
    b = round(random(204, 255));*/
    cloudArr[index] = gRect(x_cloud, y_cloud, cloudW, cloudH, 255, 255, 255);
  }

  for ( var index = 0; index < cloudNum; index++ )
  {
    cloudArr[index] += 0.2;
  }
}



function generateTopsoil()
{
	for(num = 0; num < rock_heights.length; num++)
	{
    var r, g, b
		//console.log("height " + rock_heights[num]);
		//console.log("generating topsoil at: " + num + ", " + rock_heights[num]);
    r = round(random(102, 153));
    g = round(random(51, 102));
    b = round(random(0, 51));
		gRect(num, g_height - rock_heights[num], 1, 3, r, g, b);

    r = round(random(0, 102));
    g = round(random(153, 255));
    b = round(random(51, 102));
		gRect(num, g_height - rock_heights[num] - 1, 1, 1, r, g, b);

    var random_boolean = Math.random() > 0.8;

    var treeGrowChance = 0.5;
    var treeGrow = Math.random() > treeGrowChance;
    treeHeight = g_height - rock_heights[num] - 4

    var treeGreenChance = 0.4;
    var treeGreen = Math.random() > treeGreenChance;

    if ( random_boolean == true )
    {
      gRect(num, treeHeight, 1, 4, 102, 51, 0);
      while(treeGrow == true) {
        treeHeight = treeHeight - 1;
        gRect(num, treeHeight, 1, 4, 102, 51, 0);
        treeGrowChance = treeGrowChance + 0.1;
        treeGrow = Math.random() >treeGrowChance;
      }
      treeHeight = treeHeight - 1;
      console.log(num);

      if ( num - 1 > 0 ) {
        gRect(num-1, treeHeight, 3, 3, 0, 102, 0);

        while(treeGreen == true ) {
          treeHeight = treeHeight - 1;
          gRect(num-1, treeHeight, 3, 3, 0, 102, 0);
          treeGreenChance = treeGreenChance + 0.1;
          treeGreen = Math.random() > treeGreenChance;
        }
        treeHeight = treeHeight - 1;
        gRect(num, treeHeight, 1, 1, 0, 102, 0);
      }

    }

		//line(num * PIXEL_TO_GRID_SCALE, rock_heights[num], (num +1) * PIXEL_TO_GRID_SCALE, rock_heights[num]);
	}
}




function generate() {
// GRAB USER INPUT

  USR_ROCK_COL_WIDTH = document.getElementById("rockColWidthRange").valueAsNumber;
  USR_SIN_AMP = document.getElementById("sinAmpRange").valueAsNumber;
  USR_SIN_FREQ = document.getElementById("sinFreqRange").valueAsNumber;
  USR_SIN_DEVIATION = document.getElementById("sinDeviationRange").valueAsNumber;
  USR_MTN_HEIGHT = document.getElementById("mtnHeightRange").valueAsNumber;

  USR_CLOUD_NUM = document.getElementById("cloudNumRange").valueAsNumber;
  USR_CLOUD_HEIGHT = document.getElementById("cloudHeightRange").valueAsNumber;
  USR_CLOUD_WIDTH = document.getElementById("cloudWidthRange").valueAsNumber;
  USR_CLOUD_MAXH = document.getElementById("cloudMaxHRange").valueAsNumber;
  USR_CLOUD_MAXW = document.getElementById("cloudMaxWRange").valueAsNumber;

// Create and draw grid
  initGrid();
  drawSky();
  drawCloud(USR_CLOUD_NUM, USR_CLOUD_HEIGHT, USR_CLOUD_WIDTH);
  drawRockColumns(0, g_width);
  generateTopsoil();
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


function mouseWheel(event) {
	PIXEL_TO_GRID_SCALE -= event.delta / 100;
	console.log(event.delta);
}


function mouseDragged()
{
	if(mouseX > 250 && mouseX < width)
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

var rockColWidthSlider = document.getElementById("rockColWidthRange");
var rockColWidthOutput = document.getElementById("rockColWidthNumber");
rockColWidthOutput.innerHTML = rockColWidthSlider.value;
rockColWidthSlider.oninput = function() {
  rockColWidthOutput.innerHTML = this.value;
}

var sinAmpSlider = document.getElementById("sinAmpRange");
var sinAmpOutput = document.getElementById("sinAmpNumber");
sinAmpOutput.innerHTML = sinAmpSlider.value;
sinAmpSlider.oninput = function() {
  sinAmpOutput.innerHTML = this.value;
}

var sinFreqSlider = document.getElementById("sinFreqRange");
var sinFreqOutput = document.getElementById("sinFreqNumber");
sinFreqOutput.innerHTML = sinFreqSlider.value;
sinFreqSlider.oninput = function() {
  sinFreqOutput.innerHTML = this.value;
}

var sinDeviationSlider = document.getElementById("sinDeviationRange");
var sinDeviationOutput = document.getElementById("sinDeviationNumber");
sinDeviationOutput.innerHTML = sinDeviationSlider.value;
sinDeviationSlider.oninput = function() {
  sinDeviationOutput.innerHTML = this.value;
}

var mtnHeightSlider = document.getElementById("mtnHeightRange");
var mtnHeightOutput = document.getElementById("mtnHeightNumber");
mtnHeightOutput.innerHTML = mtnHeightSlider.value;
mtnHeightSlider.oninput = function() {
  mtnHeightOutput.innerHTML = this.value;
}

var cloudNumSlider = document.getElementById("cloudNumRange");
var cloudNumOutput = document.getElementById("cloudNumNumber");
cloudNumOutput.innerHTML = cloudNumSlider.value;
cloudNumSlider.oninput = function() {
  cloudNumOutput.innerHTML = this.value;
}

var cloudHeightSlider = document.getElementById("cloudHeightRange");
var cloudHeightOutput = document.getElementById("cloudHeightNumber");
cloudHeightOutput.innerHTML = cloudNumSlider.value;
cloudHeightSlider.oninput = function() {
  cloudHeightOutput.innerHTML = this.value;
}

var cloudWidthSlider = document.getElementById("cloudWidthRange");
var cloudWidthOutput = document.getElementById("cloudWidthNumber");
cloudWidthOutput.innerHTML = cloudWidthSlider.value;
cloudWidthSlider.oninput = function() {
  cloudWidthOutput.innerHTML = this.value;
}

var cloudMaxHSlider = document.getElementById("cloudMaxHRange");
var cloudMaxHOutput = document.getElementById("cloudMaxHNumber");
cloudMaxHOutput.innerHTML = cloudMaxHSlider.value;
cloudMaxHSlider.oninput = function() {
  cloudMaxHOutput.innerHTML = this.value;
}

var cloudMaxWSlider = document.getElementById("cloudMaxWRange");
var cloudMaxWOutput = document.getElementById("cloudMaxWNumber");
cloudMaxWOutput.innerHTML = cloudMaxWSlider.value;
cloudMaxWSlider.oninput = function() {
  cloudMaxWOutput.innerHTML = this.value;
}
