var SHOT_DEAD = 0;
var SHOT_EXPLODE = 1;
var SHOT_EXPLODING = 2;
var SHOT_TRAVELLING = 3;
    
function Projectile(x, y, dx, dy, angle, explosive) {
	this.x = x;
	this.y = y;
	this.dx = dx/2;
	this.dy = dy;
	this.angle = angle;
	this.isExplosive = explosive;
	this.status = SHOT_TRAVELLING;
	this.timeScale = 1.0;
	this.isAlive = true;
}

Projectile.prototype.initialize = function(x, y, dx, dy, angle, explosive) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.angle = angle;
	this.timeScale = 1.0;
	this.isAlive = true;
	this.isExplosive = explosive;
	this.status = SHOT_TRAVELLING;
}

Projectile.prototype.getStatus = function() {
	return this.status;
}

Projectile.prototype.getX = function() {
	return parseInt(this.x);
}

Projectile.prototype.getY = function() {
	return parseInt(this.y);
}

Projectile.prototype.getAngle = function() {
	return this.angle;
}

Projectile.prototype.getDamage = function() {
	return 1;
}

Projectile.prototype.getDeltaX = function() {
	return this.dx;
}

Projectile.prototype.getDeltaY = function() {
	return this.dy;
}

Projectile.prototype.setStatus = function(status) {
	this.status = status;
}

Projectile.prototype.setAngle = function(angle){
	this.angle = angle;
}

Projectile.prototype.setX = function(x) {
	this.x = x;
}

Projectile.prototype.setY = function(y) {
	this.y = y;
}

Projectile.prototype.setTimeScale = function(timeScale){
	this.timeScale = timeScale;
}

Projectile.prototype.update = function(delta) {
	this.x += this.dx * this.timeScale;
	this.y += this.dy * this.timeScale;
	
	if( this.y < 0  ) this.status = SHOT_DEAD;	else 
	if( this.y > 240) this.status = SHOT_DEAD;
		
	if( this.x < 0  ) this.status = SHOT_DEAD;	else 
	if( this.x > 220) this.status = SHOT_DEAD;
	
	if(this.status == SHOT_DEAD)this.isAlive = false;
}