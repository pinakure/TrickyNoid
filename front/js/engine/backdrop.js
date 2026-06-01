var BACKDROP_TOTAL = 0x40;
var BackdropGfx = false;

function Backdrop(tempo){
	info('BACKDROP', 'Initializing');	
	this.self = this;
	
	this.backdropColor = COLORS[2];
	this.backdropActive = 0;
	this.backdropSpeed =  tempo;
	this.backdropAlteration = 1;    
	this.backdropTimer = 0;
	this.backdropLastFrame = 0;
	this.backdropAlternate = 0;
	
	this.spriteSheet = false;
}    

Backdrop.prototype.processGraphics = function(me){
	info("BACKDROP", "Processing graphic data");

	BackdropGfx = [];
	
	var totalFrames = 0;
	var i;
	for(i=0; i < BACKDROP_TOTAL; i++){
		BackdropGfx[i] = new Animation(	me.spriteSheet, 
										0, i, 
										7, i, 
										true, 4, true);
	
		if(i%3 != 2) {                    
			BackdropGfx[i].pingPong = true;
		} else {                    
			BackdropGfx[i].looping = true;
			BackdropGfx[i].pingPong = false;
		}           
		totalFrames += BackdropGfx[i].frameCount;
	}	
	
	cout('^3'+totalFrames+'^8 frames extracted');	
	game.continueLoad();
}
	
Backdrop.prototype.loadGraphics = function(){
	info("BACKDROP", "Requesting graphic data");
	
	try {
		this.spriteSheet = new SpriteSheet("gfx/backdrop.png", 16, 16, [0,0,0], this.self);
	} catch(e) {            
		complaint('BACKDROP', 'Failed to load graphics', e);
		BackdropGfx = false;
	}
}


Backdrop.prototype.render = function(g){
	var b;
	var b1;
	var b2;
	var frame, e;
	var i=0;
	var x, y;
	
	g.setContext(0);
	
	b1 = BackdropGfx[this.backdropActive];
	b2 = BackdropGfx[this.backdropAlternate];
	
	this.backdropLastFrame = BackdropGfx[this.backdropActive].frame;
	for(y=0; y < 15; y++){
		i++;
		for(x=0; x < 14; x++){
			if(i%2 == 0) b = b1;
			else b = b2;
	
			frame = (b.frame + this.backdropAlteration)%8;
			b.frame = frame;
			b.draw(3+(x*16), 3+(y*16));
			i++;
		}          
	}
	
	g.setDrawMode(g.MODE_ALPHA_BLEND);
	
	g.drawGradientLine(	3,	   3, this.backdropColor.getHex(1), 
						224, 240, this.backdropColor.getHexScaled(0.025));
	
	
	b1.frame = this.backdropLastFrame;
	b2.frame = this.backdropLastFrame;

	g.setDrawMode(g.MODE_NORMAL);        
	g.setContext(g.lastContext);
}

Backdrop.prototype.update = function(Delta, musicplayer, timeScale){
	//TODO: Reenable musicplayer.isPlaying() condition below when music is working again
	//if(musicplayer.isPlaying() ){
		this.backdropTimer += 1;//Delta;
		if( this.backdropTimer > this.backdropSpeed){
			this.backdropTimer = 0;
			this.backdropActive = parseInt(Math.random() * (BACKDROP_TOTAL - 1));
			if( parseInt(Math.random()*3)==0) this.backdropAlternate = parseInt(Math.random() * (BACKDROP_TOTAL - 1));
			else backdropAlternate = this.backdropActive;
			this.backdropActive %= BACKDROP_TOTAL;
			this.backdropAlteration = parseInt(Math.random() * 7)+1;
			BackdropGfx[ this.backdropActive ].restart();
		} 
	//} else {
	//	this.backdropTimer = 0;
	//}
	
	BackdropGfx[ this.backdropActive].update(parseInt(Delta * timeScale));
}

Backdrop.prototype.setSpeed = function(speed){
	this.backdropSpeed = speed;
	this.backdropTimer = 0;
}

Backdrop.prototype.setColor = function(index){ index %= 16; this.backdropColor = COLORS[index]; }