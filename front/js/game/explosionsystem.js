var ExplosionGfx = false; /*THIS IS WHERE THE EXPLOSION GRAPHICS WILL BE STORED GLOBALLY */

var EXPLOSION_DEAD = 0;
var EXPLOSION_SPAWN = 1; 	// First frames are inocuous
var EXPLOSION_DETONATE = 2;	// Splash calc here, just one step
var EXPLOSION_EXPAND = 3; 	// Rest of animation until dead

function ExplosionSystem(game){
	this.self = this;
	
	this.explosions = [];
	
	this.game = game;
	this.timeScale = 1.0;

	this.spriteSheet = false;	
}

ExplosionSystem.prototype.reset = function(){
	this.explosions = [];
	this.timeScale = 1.0;
	this.spriteSheet = false;
}

ExplosionSystem.prototype.processGraphics = function(me){
	info("EXPLOSIONSYSTEM", "Processing graphic data");
	
	ExplosionGfx = new Animation(	me.spriteSheet, 
									0, 0, 
									7, 0, 
									false, 25, false);
	
	cout('^3'+ExplosionGfx.frameCount+'^8 frames extracted');
	game.continueLoad();
}

ExplosionSystem.prototype.loadGraphics = function(){
	info("EXPLOSIONSYSTEM", "Requesting graphic data");
	
	try {
		this.spriteSheet = new SpriteSheet("gfx/explosion.png", 48, 24, [0, 0, 0], this.self);
	} catch(e) {
		complaint("EXPLOSION", "Cannot load graphics", e);
		ExplosionGfx = false;
	}
}

ExplosionSystem.prototype.getExplosions = function() { return this.explosions; }
ExplosionSystem.prototype.size = function(){ return this.explosions.length; }


ExplosionSystem.prototype.add = function(e, scheduledExplosions){
	if(scheduledExplosions != undefined){
		var i, ex;
		var explosions = scheduledExplosions.getExplosions();
		for(i = 0; i < explosions.length; i++){
			ex = explosions[i];
			this.explosions[this.explosions.length] = ex;
		}
	} else this.explosions[this.explosions.length] = e;
}


ExplosionSystem.prototype.setTimeScale = function(timeScale){
	var i, e;
	for(i = 0; i < this.explosions.length; i++){

		e = this.explosions[i];
		
		e.setTimeScale(this.timeScale);
	}
}

ExplosionSystem.prototype.update = function(Delta){
	
	var cleanUp = false;
	
	var dx, dy, i, e;
		   
	for(i = 0; i < this.explosions.length; i++){
		var e = this.explosions[i];
		
		// Process explosion
		e.update(Delta); // Increase frames
		
		if( e.getStatus() == EXPLOSION_DETONATE){
			
			//Check if explosion hits something			
			dx = e.getX();
			dy = e.getY();
			
			
			this.game.reaction.target = new Ball(Ball.BALL_ULTRA);
			this.game.reaction.invertDeltas = false;
			this.game.reaction.isExplosion = true;
			
			this.game.bricks.hit(dx,    dy);
			this.game.bricks.hit(dx+16, dy);
			this.game.bricks.hit(dx+32, dy);
			this.game.bricks.hit(dx,    dy+8);
			this.game.bricks.hit(dx+16, dy+8);
			this.game.bricks.hit(dx+32, dy+8);
			this.game.bricks.hit(dx,    dy+16);
			this.game.bricks.hit(dx+16, dy+16);
			this.game.bricks.hit(dx+32, dy+16);
			
			this.game.reaction.isExplosion = false;
			
			e.setStatus(EXPLOSION_EXPAND);
		}
		
		// Check if at least one explosion is dead to make system cleanup
		if(e.getStatus() == EXPLOSION_DEAD) cleanUp = true;
	}
	
	if(cleanUp){
		for(i=0; i < this.explosions.length; i++){
			
			e = this.explosions[i];
			
			if( e.getStatus() == EXPLOSION_DEAD) {
				this.explosions.splice(i, 1);
			}
		}
	}
}

ExplosionSystem.prototype.render = function(g){
	var i, ex;
	
	g.setContext(2);
	
	for(i = 0; i < this.explosions.length; i++){

		ex = this.explosions[i];
		
		if(ex.getStatus() != EXPLOSION_DEAD){
			ExplosionGfx.setCurrentFrame(ex.getCurrentFrame());
			ExplosionGfx.draw(2+ex.getX(), 2+ex.getY());                
		}
	}
	
	g.setContext(g.lastContext);	
}