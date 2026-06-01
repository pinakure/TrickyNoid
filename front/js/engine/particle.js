function Particle(width, height, type) {
	this.width = width;
	this.height = height;
	
	this.timeScale = 1.0;
	
	this.centerY = 120;
	this.centerX = 160;
	this.rotationY = this.centerY - (this.width / 2);
	this.rotationX = this.centerX - (this.height / 2);        
	
	// decay of deltaX (goes -friction until 0)
    this.friction = 1.0;
	
	this.type = type;
	
    // Initial particle position (useful to know when to kill the particle)
	this.originX = 0;  
    this.originY = 0;
	// Current position in the world
	this.x = 0;
	this.y = 0;
	// initial projectile speed
    this.speed = 0;    
    // angle in degrees
    this.angle = 0;      
    // angle in radians (to avoid recalc)
	this.radians = 0; 
    // angle variation        
	this.spread = 0;    
	// movement vector  
    this.deltaX = 0;   
    this.deltaY = 0;
    // decay of deltaY (goes +gravity until collision)    
    this.gravity = 0;  
	// max distance the projectile can exist
    this.range = 256.0;
	
	
	// true if particle has to be processed
	this.isAlive = true;	
	   
    this.gfx = false; //Animation[]
}

Particle.prototype.setTimeScale = function(timeScale) {
	this.timeScale = timeScale;
}
Particle.prototype.doLogic = function() {
	// Collision check must be done here. Called automatically once per update
	return false;
}

Particle.prototype.initialize = function(x, y, angle, type) {
	this.x = x;
	this.y = y;
	
	this.isAlive = true;
	
	this.type = type;
	
	this.originX = this.x;
	this.originY = this.y;
	
	this.angle = angle;
	
	// Randomize shot
	this.angle += (Math.random() * (this.spread*2) )-this.spread;
			
	// Do the math to calculate direction vectors
	this.radians = (this.angle * Math.PI)/180;
	var ty = this.y + ( (50) * Math.sin(this.radians)); 
	var tx = this.x + ( (50) * Math.cos(this.radians)); 
	
	this.gravity = 0.15;
	
	this.deltaX = this.angle / 10;
	this.deltaY = -2.0;
}

/**
 * Move particle
 * @return Returns 1 on colission
 */
Particle.prototype.update = function() {
	
	this.x += this.deltaX * this.timeScale;
	this.y += this.deltaY * this.timeScale;        
	
	this.deltaY += this.gravity ;
	this.deltaX *= this.friction;
	
	this.radians = this.angle;
	
	this.angle =  parseInt(Math.atan2(this.deltaY, this.deltaX)*(180/Math.PI));
	
	if(this.x > this.originX + this.range) this.isAlive = false; else
	if(this.x < this.originX - this.range) this.isAlive = false; else 
	if(this.y > this.originY + this.range) this.isAlive = false; else 
	if(this.y < this.originY - this.range) this.isAlive = false; 

	// return this.doLogic();
}

Particle.prototype.draw = function(g, px, py) {
	// g.drawAnimation(gfx[this.type], this.rotationX + this.x - px, this.rotationY + this.y -py);
	
	g.rotate(this.angle);
	ParticleGfx[this.type].draw(this.rotationX + this.x - px, this.rotationY + this.y -py);
	g.rotate(-this.angle);
}    
	
Particle.prototype.setSpeed = function(speed){
	this.speed = speed;
}

Particle.prototype.setAngle = function(angle){
	this.angle = angle;
}

Particle.prototype.isAlive = function(){
	return this.isAlive;
}

Particle.prototype.getAngle = function(){
	return this.angle;
}

Particle.prototype.getX = function(){
	return parseInt(this.centerX);
}

Particle.prototype.getY = function(){
	return parseInt(this.centerY);
}   