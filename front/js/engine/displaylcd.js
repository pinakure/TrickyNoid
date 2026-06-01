var FONT_LCD   	= 0;
var FONT_GREEN 	= 1;
var FONT_RED 	= 2;
var FONT_WHITE 	= 3;
var FONT_MONO 	= 4;

var FONT_FILES=['gfx/font/fontdigi.png',
				'gfx/font/fontg.png',
				'gfx/font/fontr.png',
				'gfx/font/fontw.png',
				'gfx/font/fontmono.png'];

var FONT_WIDTH 	= 80;
var FONT_HEIGHT	= 48;
var CHAR_WIDTH 	= 5;
var CHAR_HEIGHT	= 8;

var Fonts = [];

function Display(x, y, width, paddingChar, fontIndex){
	info('DISPLAY', 'Initializing');

	this.paddingChar = paddingChar;
	this.x = (x * CHAR_WIDTH);
	this.y = 2+(y * CHAR_HEIGHT);
	this.width = width;
	
	this.spriteSheet = false;
	this.self = this;
	
	this.currentFontIndex = fontIndex;
	
	this.isString = false;
	this.value = 0;
	this.memory = [];
	
	this.redraw = true;
	
	this.clear();
	
	this.spriteSheet = false;
}



Display.prototype.clear = function(){
	this.memory = "";
	for(var i = 0; i<this.width; i++){
		this.memory += this.paddingChar;
	}	
}

Display.prototype.update = function(){
	/* if value > width, scroll value ! */
}

Display.prototype.render = function(g){
	if(this.redraw) this.draw(g);
}

Display.prototype.draw = function(g){
	var xo = this.x;
	var font = Fonts[this.currentFontIndex];
	g.context[g.defaultContext].clearRect(this.x, this.y, 7*this.width,8);
	for(var i=0; i<this.width; i++){
		font.frame = ((this.memory.charCodeAt(i)) - 32)
		font.draw(xo, this.y);
		xo += CHAR_WIDTH;
	}
	this.redraw = false;
}

Display.prototype.set = function(value){
	if(this.isString) this.setString(value); 
	else this.setNumber(value);
}

Display.prototype.setString = function(value){
	this.isString = true;
	this.value = value;
	this.clear();
	this.memory = (this.memory + (this.value)).substr(-this.width);
	this.redraw = true;
}
Display.prototype.setNumber = function(value){
	this.isString = false;
	this.value = value;	
	this.clear();
	this.memory = (this.memory + (+this.value.toString(10))).substr(-this.width);
	this.redraw = true;
}
	
Display.prototype.loadGraphics = function(){
	this.loadFont(CHAR_WIDTH, CHAR_HEIGHT, this.currentFontIndex);
}	
	
Display.prototype.processGraphics = function(me){
	info('DISPLAY', 'Processing Graphic Data');

	Fonts[me.currentFontIndex] = new Animation(me.spriteSheet, 0, 0, 15, 5, false, 1, false);

	cout('^3' + Fonts[me.currentFontIndex].frames.length + '^8 glyphs extracted');	
	
	game.continueLoad();
}
	
Display.prototype.loadFont = function(width, height, fontIndex){
	info('DISPLAY', 'Requesting Graphic Data');

	try {
		this.currentFontIndex = fontIndex;
		this.spriteSheet = new SpriteSheet(FONT_FILES[this.currentFontIndex], CHAR_WIDTH, CHAR_HEIGHT, [255,0,255], this.self);
	} catch(e){
		complaint('DISPLAY', 'Failed to load font graphics', e);
		this.spriteSheet = false;
	}
}