var SHOT_NORMAL 	= 0x0;
var SHOT_EXPLOSIVE 	= 0x1;

var ProjectileGfx = false;

var MAX_PROJECTILES = 364/*map bricks*/ + 32/*player*/;
 
function ProjectileSystem(game){
	info('PROJECTILESYSTEM', 'Initializing');
	this.self = this;

	this.shots = [];
	for(var i=0; i<MAX_PROJECTILES; i++){
		this.shots[i] = new Projectile(0,0,0,0,0,false);
		this.shots[i].isAlive = false;
	}
	
	this.game = game;
	this.timeScale = 1.0;
	
	this.spriteSheet = false;
}	

ProjectileSystem.prototype.reset = function(){
	var p;
	
	for(var i=0; i<MAX_PROJECTILES; i++){
		p = this.shots[i];
		p.initialize(0,0,0,0,0,false);
		this.shots[i].isAlive = false;
	}
	this.timeScale = 1.0;
	this.spriteSheet = false;
}

ProjectileSystem.prototype.processGraphics = function(me){
	info("PROJECTILESYSTEM", "Processing graphic data");
	
	ProjectileGfx = [];
	
	ProjectileGfx[SHOT_NORMAL   ] = new Animation(me.spriteSheet, 0xD, 0, 0xD, 0, false,  1, false);
	ProjectileGfx[SHOT_NORMAL   ] = new Animation(me.spriteSheet, 0xD, 0, 0xD, 0, false,  1, false);
	ProjectileGfx[SHOT_EXPLOSIVE] = new Animation(me.spriteSheet, 0xE, 0, 0xF, 0, false, 30, true);

	var i, totalFrames = 0;
	for(i=0; i<ProjectileGfx.length; i++){
		totalFrames += ProjectileGfx[i].frameCount;
	}
	
	cout('^3'+totalFrames+'^8 frames extracted');
	game.continueLoad();
}
ProjectileSystem.prototype.loadGraphics = function(){
	info("PROJECTILESYSTEM", "Requesting graphic data");

	try {            
		this.spriteSheet = new SpriteSheet("gfx/balls.png",  4, 4, [255,0,255], this.self);	
	} catch(e) { 
		complaint('PROJECTILESYSTEM', 'Failed to load graphics', e);            
		ProjectileGfx = false;
	}
}

var BRICK_WIDTH = 16;
var BRICK_HEIGHT = 8;

ProjectileSystem.prototype.update = function(Delta){
	var x,y;
	var bx, by;
	
	var cleanUp = false;
	
	var i, p;
	var o, b;	
	
	var bricks = this.game.bricks.bricks;
	var pool = this.shots;
		
	for(i=0; i < MAX_PROJECTILES; i++){
		
		p = pool[i];
		
		// Move projectile
		if(!p.isAlive) continue;            
		
		p.update();
		
		x = parseInt(p.x);
		y = parseInt(p.y);
	
		for(o=0; o < bricks.length; o++){
			
			b = bricks[o];
			
			if(b.type == BRICK_NONE)continue;
			
			bx = parseInt(b.x * BRICK_WIDTH);
			by = parseInt(b.y * BRICK_HEIGHT);
			
			if(x >= bx)
				// if(x <= bx + BRICK_WIDTH)
				if(x < bx + BRICK_WIDTH)
					if(y >= by)
						// if(y <= by + BRICK_HEIGHT) {
						if(y < by + BRICK_HEIGHT) {
							
							if(b.isChannel((p.dx == -1) || (p.dx == 1)))continue;
							
							this.game.reaction.target = new Ball(p);
							
							if(this.game.bricks.hit(x, y)){
								this.game.reaction.invertDeltas = false;
								
								if(p.isExplosive) {
									this.game.scheduledExplosions.add(new Explosion( parseInt(p.x), parseInt(p.y) ));
								}
								
								p.status = SHOT_DEAD;
								p.isAlive = false;
								cleanUp = true;
							}
						}
		}
	}	
}

ProjectileSystem.prototype.render = function(g){

	var x, y;
	var p, angle;
	
	//g.setDrawMode(Graphics.MODE_SCREEN);
	var pool = this.shots;
	for(var i=0; i < MAX_PROJECTILES; i++){
		p = pool[i];
		if(!p.isAlive) continue;
		
		x = parseInt(p.x);
		y = parseInt(p.y);
		
		angle = p.angle*Math.PI/180;
		
		g.context[g.defaultContext].save();
		g.context[g.defaultContext].translate(x, y);
		g.context[g.defaultContext].rotate(angle);
		g.context[g.defaultContext].translate(-x, -y);
		
		ProjectileGfx[ p.isExplosive?1:0 ].draw(x, y);		
	
		g.context[g.defaultContext].restore();
		//g.context[g.defaultContext].translate(-160, -120);
		//g.context[g.defaultContext].translate(x, y);
		
	}
	
	//g.setDrawMode(g.MODE_NORMAL);	
}

ProjectileSystem.prototype.setTimeScale = function(timeScale){
	var i, p;
	this.timeScale = timeScale;
	
	for(i=0; i < pool.length; i++){
		this.shots[i].setTimeScale(this.timeScale);
	}
}

ProjectileSystem.prototype.add = function(x, y, dx, dy, angle, explosive){
	var pool = this.shots;	
	for(var i=0; i<MAX_PROJECTILES; i++){
		if(!pool[i].isAlive){
			pool[i].initialize(x, y, dx, dy, angle, explosive);
			return;
		}
	}
}