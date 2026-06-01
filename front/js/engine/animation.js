function Animation(spriteSheet, x, y, dx, dy, horizontalScan, duration, autoUpdate){
	this.autoUpdate = autoUpdate;
	this.pingPong = false;
	this.looping = false;
	this.duration = duration;
	this.durationTimer = 0;
	this.horizontalScan = horizontalScan;
	this.spriteSheet = spriteSheet;
	this.frameWidth  = spriteSheet.tileWidth;
	this.frameHeight = spriteSheet.tileHeight;
	
	this.frameDirection = 1;
	
	this.frame = 0;
	this.frames = false;
	this.frameCount = 0;
	
	this.extractFrames(x,y,dx,dy);
	
	this.redraw = true;
}

Animation.prototype.restart = function(){ 
	this.durationTimer = 0;
	this.frameDirection = 1;
	this.frame = 0;	
	this.redraw = true;
}

Animation.prototype.extractFrames = function(x,y,dx,dy){
	
	this.frames = [];
	
	var ix, iy, i=0;
	
	for(iy = y; iy < dy+1; iy ++){
		for(ix = x; ix < dx+1; ix++){
			this.frames[i] = new Tile(	this.spriteSheet.image, 
										ix * this.frameWidth, iy * this.frameHeight, 
										this.frameWidth, this.frameHeight, 
										i);
			i++;
		}
	}
	this.frameCount = i;
}

Animation.prototype.drawStretch = function(x,y,w,h){ 
	this.frames[this.frame].renderStretched(x,y, w,h, 0, 0, game.graphics.defaultContext);
	this.redraw = false;
}
Animation.prototype.draw = function(x,y){ 
	this.frames[this.frame].render(x,y, 0, 0, game.graphics.defaultContext);
	this.redraw = false;
}

Animation.prototype.update = function(Delta){	
	if(this.autoUpdate){
		
		this.durationTimer++;
		if(this.durationTimer >= this.duration){
			this.durationTimer = 0;
			this.frame += this.frameDirection; 

			if(this.looping){
				if(this.frame == this.frameCount-1){
					this.frame = 0;
				} 
			} else {
				if(this.pingPong){
					if(this.frame == this.frameCount-1) this.frameDirection = -1;
					else if(this.frame == 0) this.frameDirection = 1;
				} else {
					this.autoUpdate = false;
					this.frame = this.frameCount - 1;
				}
			}
			this.redraw = true;
		}
	}
}

/*deprecated*/
Animation.prototype.setAutoUpdate = function(autoUpdate){	this.autoUpdate = autoUpdate;}
Animation.prototype.setPingPong = function(pingPong){	this.pingPong = pingPong;}
Animation.prototype.setLooping = function(looping){	this.looping = looping;}
Animation.prototype.setCurrentFrame = function(frame){ this.frame = frame;}
Animation.prototype.getFrame = function(){ return this.frame; }