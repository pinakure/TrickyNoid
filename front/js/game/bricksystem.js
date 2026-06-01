var BrickGfx = false;/*static*/ 

var MAP_WIDTH  =  14;
var MAP_HEIGHT  = 26;
var SHIELD_POSITION = 25;

function BrickSystem(game) {    
	info('BRICKSYSTEM', 'Inititalizing');
	this.self = this;
	
	this.nullBrick = new Brick();
	this.game = game;    
	this.bricksLeft = 0;
	this.timeScale = 1.0;
	
	this.spriteSheet = false;/*static*/ 

	var i=0,x,y;
	// Create shield
	this.shield = [];
	for(x=0; x < 14; x++){
		this.shield[x] = new Brick(x, SHIELD_POSITION, 0x20, TOKEN_NONE, this.game);
	}

	// Create brick array
	this.bricks = [];
	for(y=0; y < MAP_HEIGHT; y++){
		for(x=0; x < MAP_WIDTH; x++){
			this.bricks[i] = new Brick(x, y, BRICK_NONE, TOKEN_NONE, this.game);
			i++;
		}
	}
	
	this.redraw = true;
}

BrickSystem.prototype.reset = function(){
	var i;
	
	this.redraw = true;
	this.bricksLeft = 0;
	this.timeScale = 1.0;	
	this.spriteSheet = false;
	if(game.game.map)
	game.game.bricks.loadBricks(game.game.map.map);	
}

BrickSystem.prototype.processGraphics = function(me){/*static*/ 
	info("BRICKSYSTEM", "Processing graphic data");

	var i,x,y;
	
	BrickGfx = [];

	var totalFrames = 0;
	i=0;
	for(y=0; y<10; y++){
		for(x=0; x<16; x++){                
			BrickGfx[i] = new Animation(me.spriteSheet, 
										x, y, 
										x, y, 
										false, 1, false);        
			totalFrames += BrickGfx[i].frameCount;
			i++;
		}
	}
	
	cout('^3'+totalFrames+'^8 frames extracted');		
	game.continueLoad();	
}

BrickSystem.prototype.loadGraphics = function(){/*static*/ 
	info("BRICKSYSTEM", "Requesting graphic data");

	try {
		this.spriteSheet = new SpriteSheet("gfx/bricks.png", 16, 8, [255,0,255], this.self);
	} catch(e) {
		complaint('BRICKSYSTEM', 'Failed to load graphics', e);
		BrickGfx = false;
	}
}


BrickSystem.prototype.loadBricks = function(map){
	var x, y, brickIndex = 0;
	var count = 0;
	var b;

	cout("^9Loading Bricks from "+map.fileName+" loaded:"+(map.isLoaded?'true':'no'));
	
	for(y=0; y<26; y++){
		for(x=0; x<14; x++){
			b = this.bricks[brickIndex];
			b.reset(x,y,map.getTileId(x,y,0), map.getTileId(x, y, 2) -  0x81);
			if(b.isDestructable()) count++;
			
			brickIndex++;
		}
	}
	
	this.setBricksLeft(count);
	//console.log(this.bricksLeft);
}

BrickSystem.prototype.getBricksLeft = function(){
	return this.brickLeft;
}

BrickSystem.prototype.get = function(index){
	return this.bricks[index];
}

BrickSystem.prototype.render = function(g){
	var i, b;
	var x, y;
	var bx, by;

	if(!this.redraw)return;
	this.redraw = false;
	
	g.clear(1);
	g.setColor(COLORS[COLOR_DARKGRAY]);
	
	for(i=0; i<this.bricks.length; i++){
		b = this.bricks[i];
		
		if(!b.isAlive())continue;
			
		// Calculate brick screen absolute position
		bx = 3 + parseInt( b.x * 16 );
		by = 3 + parseInt( b.y * 8 ) + b.getOffset();
		
		// Draw Brick
		/*if(b.getGraph() < 0x9C){
			// Draw brick (with damage and shadow)
			g.setDrawMode(g.MODE_SCREEN);
			BrickGfx[b.getGraph()-1].draw(bx, by);
		} else {
			// Draw 
		}*/
		g.setDrawMode(g.MODE_NORMAL);
		
		g.context[g.defaultContext].save();
		g.context[g.defaultContext].beginPath();
		g.context[g.defaultContext].lineWidth = 1;			
		g.context[g.defaultContext].rect(bx, by, 16, 8);
		g.context[g.defaultContext].clip();
  
		BrickGfx[b.getGraph()-1].draw(bx, by);
		
		// Draw Damage        
		g.setDrawMode(g.MODE_DESTINATION_IN);
		BrickGfx[0x90+(b.getDamage() * parseInt(4/b.getHealth()))].draw(bx, by);
	
		g.context[g.defaultContext].restore();
		
		
		// Draw shadow
		g.setAlpha(0.3);
		g.setDrawMode(g.MODE_DESTINATION_OVER);
		g.fillRect(bx+3, by+2, 16, 8);			
		g.setAlpha(1);
	}
	
	g.setDrawMode(g.MODE_NORMAL);	
}

BrickSystem.prototype.update = function(delta){
    var i, b;
	for(i=0; i<this.bricks.length; i++){
		b = this.bricks[i];
		
		b.update();
		
	}
	
	if(this.game.scheduledExplosions.size() > 0){
		this.game.addScheduledExplosions();
	}
}

BrickSystem.prototype.test = function(x, y) {
	var i, b;
	for(i=0; i<this.bricks.length; i++){
		b = this.bricks[i];
		if(b.test(x, y)){
			return b.isAlive();
		}
	}
	return false;
}

BrickSystem.prototype.hit = function(x, y) {
	var i;
	var brickX = parseInt(x/16);
	var brickY = parseInt(y/8);
	var brickId = (brickY * 14) + brickX;
	
	var causesBounce = false;
	
	if(brickX > 14) return true;
	if(brickX < 0 ) return true;
	if(brickY > 27) return true;
	if(brickY < 0 ) return true;
	
	if(brickId >= this.bricks.length) return false;
	var b = this.bricks[brickId];
	
	if(b.isAlive()){
		this.redraw = true;
		
		causesBounce = b.causesBounce();
		
		if(!b.isSticked()){
			b.fall();
		}
		
		if(b.isInverter()){
			if(!this.game.reaction.isExplosion)
			this.game.reaction.invertDeltas = true;
			//swapDeltas(game.reaction.target);                
		}
		
		if(b.isDestructable()) {     
			
			// Handle Magic Ball (COMMODIN)
			
			if(this.game.reaction.target.status == BALL_MAGIC){
				// Chain destruction (MAGIC BALL or COMMODIN)
				var targetType = b.type;
				var targetVariation = b.getVariation();
				
				var scheduledInterval = 4;
				var schedule = scheduledInterval;
				
				for(i=0; i<this.bricks.length; i++){
					if(this.bricks[i].type == targetType) {
						if(this.bricks[i].variation == targetVariation) {
							this.bricks[i].scheduleDestroy = schedule; 
							schedule += scheduledInterval;
						}
					}
				}
				b.destroy();
				
				this.game.reaction.target.setStatus(BALL_NORMAL);
				
			} else {
				
				if(b.isExplosive()){
					if(b.getDamage() == 0){
						// Spawn an explosion
						var ex = (b.getX())*16;
						var ey = (b.getY())*8;
						this.game.scheduledExplosions.add(new Explosion(ex, ey));
					}
				}
				
				var damage = this.game.reaction.target.getDamage();
				if(damage == 9) causesBounce = false;
				b.applyDamage(damage);
				this.game.particles.generate(b.getGraph(), x+2, y+2);
				this.game.backdrop.setColor(b.getGraph()-1);
			}
			
		} else b.hit();

		if(b.getDamage() >= 9) {
			b.destroy();
		}
	}
	
	return causesBounce;
}

BrickSystem.prototype.getBricksLeft = function(){
	return this.bricksLeft;
}

BrickSystem.prototype.add = function(brick){
	this.bricks[this.bricks.length] = brick;
}

/* ACCESOR METHODS */
BrickSystem.prototype.getBricks = function() {
	return this.bricks;
}

BrickSystem.prototype.get = function(index){
	return this.bricks[index];
}

BrickSystem.prototype.setBricksLeft = function(bricksLeft) {
	this.bricksLeft = bricksLeft;
}
