var TOKEN_NONE        = 0x10;
var TOKEN_GROW        = 0x00;
var TOKEN_SHRINK      = 0x01;
var TOKEN_SUBDIVIDE   = 0x02;
var TOKEN_SHOOT       = 0x03;
var TOKEN_MISSILE     = 0x04;
var TOKEN_EXPLOSIVE   = 0x05;
var TOKEN_ULTRABALL   = 0x06;
var TOKEN_STICKBALL   = 0x07;
var TOKEN_SHIELD      = 0x08;
var TOKEN_COMMODIN    = 0x09;
var TOKEN_DIVIDE      = 0x0A;
var TOKEN_ONEUP       = 0x0B;
var TOKEN_ONEDOWN     = 0x0C;
var TOKEN_DELTASWAP   = 0x0D;
var TOKEN_HALFSCORE   = 0x0E;
var TOKEN_DOUBLESCORE = 0x0F;

var TOKEN_WIDTH = 16;
var TOKEN_HEIGHT = 12;

var tokenNames = [	"     Grow     ",
                    "    Shrink    ",
                    "  Multi-Ball  ",
                    "     Shot     ",
                    "    Rocket    ",
                    "Explosive Ball",
                    "  Ultra Ball  ",
                    " Sticky  Ball ",
                    "    Shield    ",
                    "   Commodin   ",
                    " Divide Balls ",
                    "  Extra Live  ",
                    "  Live  Lost  ",
                    "  Delta Swap  ",
                    "  Half Score  ",
                    " Double Score "];
var TokenGfx = false;


var MAX_TOKENS = 364;

function TokenSystem(game){
	info('TOKENSYSTEM', 'Initializing');
	this.self = this;

	this.game = game;
	
	this.tokens = [];
	for(var i=0; i<MAX_TOKENS; i++){
		this.tokens[i] = new Token(TOKEN_NONE,0,0);
		this.tokens[i].isAlive = false;
	}
	
	this.timeScale = 1.0;

	this.spriteSheet = false;
}

TokenSystem.prototype.reset = function(){
	for(var i=0; i<MAX_TOKENS; i++){
		this.tokens[i].initialize();
		this.tokens[i].isAlive = false;
	}
	this.timeScale = 1.0;
	this.spriteSheet = false;
}

TokenSystem.prototype.processGraphics = function(me){
	info("TOKENSYSTEM", "Processing graphic data");
	
	TokenGfx = [];
	var i, totalFrames = 0;
	for(i=0; i < 0x10; i++) {
		TokenGfx[i] = new Animation(me.spriteSheet, 0, i, 19, i, false, 60, false);
		totalFrames += TokenGfx[i].frameCount;
	}
	
	cout('^3'+totalFrames+'^8 frames extracted');
	game.continueLoad();
}
TokenSystem.prototype.loadGraphics = function(){
	info("TOKENSYSTEM", "Requesting graphic data");	
	
	try {
		this.spriteSheet = new SpriteSheet("gfx/tokens.png", TOKEN_WIDTH, TOKEN_HEIGHT, [255,0,255], this.self);
	} catch(e){
		complaint('TOKEN', 'Failed to load graphics', e);
		TokenGfx = false;
	}
}

TokenSystem.prototype.drawToken = function(x, y, type){
	if(!TokenGfx[type])return;
	var last = TokenGfx[type].getFrame();
	TokenGfx[type].setCurrentFrame(0);
	TokenGfx[type].draw(x, y);
	TokenGfx[type].setCurrentFrame(last);
}
	
TokenSystem.prototype.setTimeScale = function(timeScale){
	this.timeScale = timeScale;
}

TokenSystem.prototype.render = function(g){
	var type, t;
	g.setContext(2);
	
	for(var i=0; i<MAX_TOKENS; i++){
		t = this.tokens[i];
		if(!t.isAlive) continue; 
		
		type = t.getType();            
		
		var tok = TokenGfx[type];
		tok.setCurrentFrame(t.getFrame());
		tok.draw(3 + t.getX(), 3 + t.getY());
	}
	g.setContext(g.lastContext);
}

TokenSystem.prototype.update = function(Delta){
	var i, t;
	
	if(Delta === 0)Delta = 1.0;

	for(var i=0; i<MAX_TOKENS; i++){
		t = this.tokens[i];
		if(!t.isAlive) continue; 
		
		t.update(Delta * this.game.timeScale);
		if(t.collides(this.game.paddle)){
			
			// Refill bullet time
			this.game.setBulletTime(1.0);
			
			this.game.inventory.inheritToken(t.getType());
			this.removeToken(i);
			continue;
		}          
		//console.log(t.getY());
		if(t.getY() >= 240) this.removeToken(i);
	}
}

TokenSystem.prototype.getTokens = function() {
	return this.tokens;
}
        
TokenSystem.prototype.removeToken = function(index){
	this.tokens[index].isAlive = false;	
}

TokenSystem.prototype.add = function(type, x, y){
	for(var i=0; i<MAX_TOKENS; i++){
		t = this.tokens[i];
		if(!t.isAlive){
			this.tokens[i].initialize(type, x, y);
			return;
		}
	}
}
    
    