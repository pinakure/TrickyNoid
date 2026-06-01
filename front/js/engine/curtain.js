var CurtainGfx = false;

var CURTAIN_OFF = 0;
var CURTAIN_ON = 1;

function Curtain(game){
	info('CURTAIN', 'Initializing');
	this.self = this;
	
	this.dx = [];

	this.maxCurtainFrames = 24*15;
	this.curtainFrame = [];
	for(var i=0; i < this.maxCurtainFrames; i++){                        
		this.curtainFrame[i] = 0;
	}
	
	this.game = game;
	this.status = CURTAIN_OFF;
	this.jump = 0;
	this.fade = 0.0;
	
	this.spriteSheet = false;
	
	this.action();
	this.reset();
	
	this.gfx = CurtainGfx;
}

Curtain.prototype.reset = function(){
	this.status = CURTAIN_OFF;
	this.jump = 0;
	this.fade = 0.0;
	for(var i=0; i < this.maxCurtainFrames; i++){                        
		this.curtainFrame[i] = 0;
	}
	this.spriteSheet = false;
}

Curtain.prototype.processGraphics = function(me){
	info("CURTAIN", "Processing graphic data");

	CurtainGfx = new Animation(	me.spriteSheet,
								0, 0,
								8, 0,
								false,30,false);
	
	CurtainGfx.autoUpdate = false;

	cout('^3'+CurtainGfx.frameCount+'^8 frames extracted');				
	game.continueLoad();
}
Curtain.prototype.loadGraphics = function(){
	info("CURTAIN", "Requesting graphic data");

	try {
		this.spriteSheet = new SpriteSheet("gfx/hud/curtain.png", 16, 16, [0,0,0], this.self);
	} catch(e) {
		complaint("CURTAIN", "Failed to load graphics", e);
		CurtainGfx = false;
	}
}

Curtain.prototype.action = function() {
	var i;
	if(this.status == CURTAIN_ON) {
		this.fade = 1.0;
		for(i=0; i < this.maxCurtainFrames; i++){                        
			this.curtainFrame[i] = 8.0+(i*0.0222222222222222);
			this.dx[i] = -0.25;                
		}
		this.status = CURTAIN_OFF;
		
	} else {
		this.fade = 0.0;
		for(i=0; i< this.maxCurtainFrames; i++){        
			this.curtainFrame[i] = 0.0-(i*0.0222222222222222);
			this.dx[i] = 0.25;
		}
		
		this.status = CURTAIN_ON;
	}
}

Curtain.prototype.update = function(Delta){
	
	var fullProcess = true;
	var i;
	
	for(i=0; i < this.maxCurtainFrames; i++){        
		
	   	this.curtainFrame[i] += this.dx[i];
		
		if(this.status == CURTAIN_ON) {
			if( this.fade < 1.0) this.fade += 0.00003;
			else this.fade = 1.0;
							
			if( this.curtainFrame[i] > 8) {
				this.curtainFrame[i] = 8.0;
				this.dx[i] = 0.0;
			} 
		} else {
			if( this.fade > 0.0) this.fade -= 0.00003;
			else this.fade = 0.0;
			
			if( this.curtainFrame[i] < 0.0) {
				this.curtainFrame[i] = 0.0;                
				this.dx[i] = 0.0;
			}
		}
		
		if( this.dx[i] != 0.0) this.fullProcess = false;
	}
}

Curtain.prototype.render = function(g){
	var x, y, i;
	var frame;
	
	i = 0;
	for(y = 0; y < 24; y++) {
		for(x = 0; x < 15; x++) {
			frame = parseInt(this.curtainFrame[i]);
			
			if(frame < 0) frame = 0;
			if(frame > 8) frame = 8;
			
			CurtainGfx.frame = frame;
			CurtainGfx.draw((x*16)-1, (y*16)-1);
			i++;
		}
	}
	
	g.setDrawMode(g.MODE_COLOR_MULTIPLY);	
	var white = new Color(255,255,255);
	var fader = new Color(64,64,64);
	fader = fader.getHexScaled(this.fade);
	white = white.getHex();

    g.setAlpha(this.fade);
	g.drawGradientLine(2, 2,   fader, 229, 119, white);
	g.drawGradientLine(2, 121, white, 229, 240, fader);
	g.setAlpha(1);
	
	g.setDrawMode(g.MODE_NORMAL);	
}