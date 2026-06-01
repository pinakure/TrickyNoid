var ParticleGfx = false;

var MAX_PARTICLES = 2048;

function ParticleSystem(game){
	info('PARTICLESYSTEM', 'Initializing');
	this.self = this;
	
	this.timeScale = 1.0;
	this.game = game;
	
	this.particlePool = [];
	for(var i=0; i < MAX_PARTICLES; i++){
		this.particlePool[i] = new Particle(0,0,1);
		this.particlePool[i].isAlive = false;
	}
	
	this.debris = [];
	
	this.spriteSheet = false;
}

ParticleSystem.prototype.reset = function(){
	this.timeScale = 1.0;
	this.debris = [];
	this.spriteSheet = false;
}

ParticleSystem.prototype.processGraphics = function(me){
	info("PARTICLESYSTEM", "Processing graphic data");

	ParticleGfx = [];

	var x,y,i=0;
	var totalFrames = 0;
	for(y=0; y<5; y++){
		for(x=0; x<16; x++){
			ParticleGfx[i] = new Animation(	me.spriteSheet, 
											x, y, 
											x, y, 
											false, 1, false);
			totalFrames += ParticleGfx[i].frameCount;
			i++;
		}
	}
	
	cout('^3'+totalFrames+'^8 frames extracted');	
	game.continueLoad();
}

ParticleSystem.prototype.loadGraphics = function(){
	info("PARTICLESYSTEM", "Requesting graphic data");
	
	try {            
		this.spriteSheet = new SpriteSheet("gfx/particles.png",  2, 2, [255,0,255], this.self);	
	} catch(e) {
		complaint('PARTICLESYSTEM', 'Failed to load graphics', e);
		ParticleGfx = false;
	}
}

ParticleSystem.prototype.setTimeScale = function(timeScale){
	this.timeScale = timeScale;
}

ParticleSystem.prototype.render = function(g){	
	var i, p;
	
	for(i=0; i<this.debris.length; i++){
		p = this.debris[i]; 
		p.draw(g, p.getX(), p.getY());
	}	
}
    
ParticleSystem.prototype.update = function(delta){
	var i, p;
	this.timeScale = this.game.timeScale;
	
	for(i=0; i<this.debris.length; i++){
		p = this.debris[i];
		
		p.timeScale = this.timeScale;
		
		p.setAngle(p.getAngle() + 1);
		p.update();
		
		if(!p.isAlive) {
			/*TODO: We need some way to run this action! */
			this.debris.splice(i, 1);			
		}
	}
}

ParticleSystem.prototype.generate = function(type, x, y) {
	var i,p;
	
	for(i = 0; i< 8; i++){
		p = this.newParticle(type, x, y);
		if(p)this.debris[this.debris.length] = p;
	}
}
    
ParticleSystem.prototype.newParticle = function(type, x, y){
	var p;
	for(var i=0; i<MAX_PARTICLES; i++){
		if(!this.particlePool[i].isAlive){
			this.particlePool[i].initialize(x, y, -20 + (parseInt(Math.random() * 40)), type);
			this.particlePool[i].setSpeed(1.4);	
			return this.particlePool[i];
		}
	}
	return false;
}
