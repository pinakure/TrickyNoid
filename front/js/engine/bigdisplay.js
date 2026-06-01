var BigDisplayGfx = false;

var CHAR_OUT = 0;
var CHAR_ENTERING = 1;
var CHAR_IN = 2;
var CHAR_LEAVING = 3;
var CHAR_DEAD = 4;    
var CHAR_DIRECTION_DOWN = 0;
var CHAR_DIRECTION_UP = 1;
var CHAR_DIRECTION_LEFT = 2;
var CHAR_DIRECTION_RIGHT = 3;    

function BigDisplay(game){
	info('BIGDISPLAY', 'Initializing');
	this.self = this;
	
	this.game = game;
	this.top = [];
	this.bottom = [];
	
	this.top[0] = new BigChar(CHAR_DIRECTION_DOWN,  0x22,  40, -32, 90, 0);
	this.top[1] = new BigChar(CHAR_DIRECTION_DOWN,  0x1F,  72, -32, 90, 5);
	this.top[2] = new BigChar(CHAR_DIRECTION_DOWN,  0x25, 104, -32, 90, 10);
	this.top[3] = new BigChar(CHAR_DIRECTION_DOWN,  0x1E, 136, -32, 90, 15);
	this.top[4] = new BigChar(CHAR_DIRECTION_DOWN,  0x14, 168, -32, 90, 20);
	
	this.bottom[0] = new BigChar(CHAR_DIRECTION_UP, 0x13,  40, 240, 90, 20);
	this.bottom[1] = new BigChar(CHAR_DIRECTION_UP, 0x1C,  72, 240, 90, 15);
	this.bottom[2] = new BigChar(CHAR_DIRECTION_UP, 0x15, 104, 240, 90, 10);
	this.bottom[3] = new BigChar(CHAR_DIRECTION_UP, 0x11, 136, 240, 90, 5);
	this.bottom[4] = new BigChar(CHAR_DIRECTION_UP, 0x22, 168, 240, 90, 0);
	
	this.spriteSheet = false;
	
	//if(this.game) this.game.curtain.action();
}

BigDisplay.prototype.reset = function(){
	this.spriteSheet = false;
	if(this.game) this.game.curtain.action();
}
	
BigDisplay.prototype.processGraphics = function(me){
	info("BIGDISPLAY", "Processing graphic data");
	
	BigDisplayGfx = new Animation(	me.spriteSheet, 
								0, 0,
								15, 5,
								false, 1, false);
	BigDisplayGfx.autoUpdate = false;


	cout('^3'+BigDisplayGfx.frameCount+'^8 characters extracted');
	game.continueLoad();
}

BigDisplay.prototype.loadGraphics = function(){
	info("BIGDISPLAY", "Requesting graphic data");
	try {
		this.spriteSheet = new SpriteSheet("gfx/hud/bigfont.png", 32, 32, [0,0,0], this.self);
	} catch (e) {
		complaint('BIGDISPLAY', 'Failed to load graphics', e);
		BigDisplayGfx = false;
	}
}
    
BigDisplay.prototype.setText = function(topText, bottomText){
	this.top = [];
	this.bottom = [];
	
	var i, t, b;
	
	for(i=0; i<5; i++){
		t = parseInt(( topText.charCodeAt(i) - 0x30)) % 0x40;
		b = parseInt(( bottomText.charCodeAt(i) - 0x30)) % 0x40;
		t === 0 ? 0 : t; 
		b === 0 ? 0 : b; 
		t < 0 ? 0 : t; 
		b < 0 ? 0 : b; 
		this.top[ this.top.length ] = new BigChar( CHAR_DIRECTION_DOWN,  t,  40 + (i*32), -32, 90, 0 + (i*5));
		this.bottom[ this.bottom.length ] = new BigChar( CHAR_DIRECTION_UP, b,  40 + (i*32), 240, 90, 20 - (i*5));
	}
	
//    game.curtain.action();
}

BigDisplay.prototype.update = function(Delta){
	var i, b;
	for(i=0; i < this.top.length; i++){
		b = this.top[i];
		b.update(1);
	}
	
	for(i=0; i < this.bottom.length; i++){
		b = this.bottom[i];
		b.update(1);
	}
}

BigDisplay.prototype.isActive = function(){
	
	var i, b;
	for(i=0; i < this.top.length; i++){
		b = this.top[i];
		if(b.status != CHAR_IN) return false;
	}
	for(i=0; i < this.bottom.length; i++){
		b = this.bottom[i];
		if(b.status != CHAR_IN) return false;
	}
	
	return true;
}

BigDisplay.prototype.dispose = function() {
	var newTop = [];
	var newBottom = [];
	var delay = 0;
	var i, b;
			
	for(i=0; i < this.top.length; i++){
		b = this.top[i];
		newTop[i] = new BigChar(b.opposite(), b.index, parseInt(b.getX()), parseInt(b.getY()), 90, delay);
		delay += 5;
	}
	
	//delay = 0;
	for(i=0; i < this.bottom.length; i++){
		b = this.bottom[i];
		delay -= 5;
		newBottom[i] = new BigChar(b.opposite(), b.getIndex(), parseInt(b.getX()), parseInt(b.getY()), 90, delay);
	}
	
	this.bottom = newBottom;
	this.top = newTop;
}
    
BigDisplay.prototype.render = function(g){
	var i, b;
	
	g.setContext(3);
	g.setDrawMode(g.MODE_DESTINATION_OVER);
	g.setAlpha(0.5);
	
	/* Draw shadow */	
	for(i=0; i < this.top.length; i++){
		b = this.top[i];
		if(!isNaN(b.index)){	
			BigDisplayGfx.frame = b.index+0x30;
			BigDisplayGfx.draw(2 + parseInt(b.x), 3 + parseInt(b.y));
		}
	}
	for(i=0; i < this.bottom.length; i++){
		b = this.bottom[i];
		if(!isNaN(b.index)){
			BigDisplayGfx.frame = b.index+0x30;
			BigDisplayGfx.draw(2 + parseInt(b.x), 3 + parseInt(b.y));
		}
	}	
	g.setDrawMode(g.MODE_NORMAL);
	g.setAlpha(1);
	
	g.setContext(4);
	g.setDrawMode(g.MODE_NORMAL);
	/* Draw font */
	for(i=0; i < this.top.length; i++){
		b = this.top[i];
		if(!isNaN(b.index)){
			BigDisplayGfx.frame = b.index;
			BigDisplayGfx.draw(parseInt(b.x), parseInt(b.y));
		}
	}
	for(i=0; i < this.bottom.length; i++){
		b = this.bottom[i];
		if(!isNaN(b.index)){
			BigDisplayGfx.frame = b.index;		
			BigDisplayGfx.draw(parseInt(b.x), parseInt(b.y));
		}
	}
}
