function Explosion(x, y) {
	this.gfx = false; /* STATIC!!! THIS MUST BE AT EXPLOSIONSYSTEM!!! */
	
	this.currentFrame=0;
        
	this.x = x / 16;
    this.y = y / 8;

    this.x--;
    this.y--;

    this.x *= 16;
    this.y *= 8;

	this.isAlive = true;
	
    this.timeScale = 1.0;
	this.status = EXPLOSION_SPAWN;
}

Explosion.prototype.initialize = function(x,y) {
    this.timeScale = 1.0;
	this.status = EXPLOSION_SPAWN;
	this.isAlive = true;
	this.currentFrame=0;
	
	this.x = x / 16;
    this.y = y / 8;

    this.x--;
    this.y--;

    this.x *= 16;
    this.y *= 8;
}

Explosion.prototype.getTimeScale = function() {
	return this.timeScale;
}

Explosion.prototype.setTimeScale = function(timeScale) {
	this.timeScale = timeScale;
}

Explosion.prototype.getX = function() {
	return this.x;
}

Explosion.prototype.getY = function() {
	return this.y;
}

Explosion.prototype.getCurrentFrame = function() {
	return parseInt(this.currentFrame);
}

Explosion.prototype.getStatus = function() {
	return this.status;
}

Explosion.prototype.setStatus = function(status) {
	this.status = status;
}

Explosion.prototype.update = function(Delta) {
	this.currentFrame += 0.5 * this.timeScale;

	if( this.status == EXPLOSION_SPAWN) {        
		if( this.currentFrame > 4.0) this.status = EXPLOSION_DETONATE;
	} else {        
		if( this.currentFrame >= 6.0) this.status = EXPLOSION_DEAD;
	}
}