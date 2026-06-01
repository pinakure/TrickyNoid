var BALL_DEAD = -1;
var BALL_READY = 0;
var BALL_NORMAL = 1;
var BALL_ULTRA = 2;
var BALL_STICKY = 3;
var BALL_EXPLOSIVE = 4;
var BALL_MAGIC = 5; //Commodin ball
var BALL_HUDLIGHT = 20; //Auxiliary graphic for HUD record displays

var BALL_STICKED = 13;



function Ball(status, shot){
    
	this.x = 112;
    this.y = 224;
    this.deltaX = 0.0;
    this.deltaY = 0.0;
    this.timeScale = 0.0;
    this.maxSpeed = 0.0;
	
	this.lockTimer = 0;
    
    this.trailTimer = 0;
   
    this.stickOffset = 0;
    
    this.trailX = [];
    this.trailY = [];
    this.trailLength = 0;
    
	this.isAlive = true;
    this.status = 0;

	this.x = 0;
	this.y = 0;
	
	if(shot != undefined){
		this.x = shot.getX();
        this.y = shot.getY();
        this.deltaX = shot.getDeltaX();
        this.deltaY = shot.getDeltaY();
        this.status = shot.getStatus();
        this.maxSpeed = 4.00;
        this.trailLength = 1;        
	} else {
		this.status = status;
        this.maxSpeed = 2.00;
        this.trailLength = 32;
        
	}
	
	this.encoded = new ArrayBuffer(9 * 4);
	this.datafloat = new Float32Array(this.encoded);
	this.dataascii = new Uint16Array(this.encoded);
	
	this.snap = new Snapshot(	'b_',
								[this.deltaX, this.deltaY, this.maxSpeed], 
								[this.status], 
								[this.isAlive]);
}

Ball.prototype.playback = function(s) {
	if(!s)return;

	this.deltaX			= s.f[0];
	this.deltaY 		= s.f[1];
	this.maxSpeed 		= s.f[2];
	
	this.status 		= s.i[0];
	
	this.isAlive 		= s.b[0];
}

Ball.prototype.snapshot = function() {
	return this.snap.update(	[this.deltaX, this.deltaY, this.maxSpeed],
								[this.status],
								[this.isAlive]);	
}

Ball.prototype.initialize = function(x,y,dx,dy,status) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.status = status;
	this.isAlive = true;
	this.trailTimer = 0;
	this.snapshot();
}

Ball.prototype.update = function(Delta, vertical) {
	var lockCheckX = parseInt(this.x);
	var lockCheckY = parseInt(this.y);
	
	if(vertical) {
		
		this.moveY(Delta);
		
		if( this.y < 0.01) {
			this.bounceY();
			this.y = 0.0;
		} else if( this.y > 238.0) {
			//bounceY();
			this.y = 240.0;
			this.status = -1;
		}
		
	} else {

		this.moveX(Delta);
		
		if( this.x < 0.01) {
			this.bounceX();
			this.x = 0.0;            
		} else if( this.x > 220.99) {
			if( this.deltaX > 0.0) {
				this.bounceX();
			}
			this.x = 220.0;
		}
	}
	
	if(ACTION_BALLTIME) return;
	/* This is a measure taken for cases when the ball gets sucked inside a wall o_O */
	if((parseInt(this.x)==lockCheckX)&&(parseInt(this.y) ==lockCheckY)){
		this.lockTimer++;
		if(this.lockTimer > 10){
			this.status = BALL_DEAD;
			cout("^9The was sucked into a wall and collapsed. Shit happens.");
		}
	} else {
		this.lockTimer = 0;
	}
}


Ball.prototype.moveY = function(Delta) {
	this.y = this.nextY();

	if(this.trailTimer < 200){
		this.trailTimer += Delta;
	} else {
		this.trailTimer = 0;
		this.addTrailStep(parseInt(this.x),parseInt(this.y));
	}        
} 

Ball.prototype.moveX = function(Delta) {
	this.x = this.nextX();
	
	if(this.trailTimer < 200){
		this.trailTimer += Delta;
	} else {
		this.trailTimer = 0;
		this.addTrailStep(parseInt(this.x),parseInt(this.y));
	}
}
Ball.prototype.addDelta = function(deltaX, deltaY) {
	if(deltaX)this.deltaX += deltaX;
	if(deltaY)this.deltaY += deltaY;
	
	// Clamp delta...
	if(this.deltaX >  this.maxSpeed) this.deltaX =  this.maxSpeed; else 
	if(this.deltaX < -this.maxSpeed) this.deltaX = -this.maxSpeed;
	if(this.deltaY >  this.maxSpeed) this.deltaY =  this.maxSpeed; else 
	if(this.deltaY < -this.maxSpeed) this.deltaY = -this.maxSpeed;
}

Ball.prototype.getDamage = function(){
	switch(this.status){
		default:
		case BALL_NORMAL: return 1;
		case BALL_ULTRA: return 9;
	}
}

Ball.prototype.getDirection = function() {
	if((this.deltaX < 0.0) && (this.deltaY < 0.0))return 0; else 
	if((this.deltaX > 0.0) && (this.deltaY < 0.0))return 1; else 
	if((this.deltaX < 0.0) && (this.deltaY > 0.0))return 2; else 
	if((this.deltaX > 0.0) && (this.deltaY > 0.0))return 3; else 
	return -1;
}

Ball.prototype.addTrailStep = function(x, y){
	var i;
	for(i = 1; i < this.trailLength; i++){
		this.trailX[i] = this.trailX[i-1];
		this.trailY[i] = this.trailY[i-1];
	}
	this.trailX[0] = x;
	this.trailY[0] = y;
}

Ball.prototype.setStickOffset = function(stickOffset) {
	this.stickOffset = stickOffset;
}

Ball.prototype.setTrailStart = function(x, y){
	var i;
	for(i = 0; i < this.trailLength; i++){
		this.trailX[i] = x;
		this.trailY[i] = y;
	}        
}

Ball.prototype.isStopped = function(){
	return ((this.deltaX == 0.00) && (this.deltaY == 0.00));
}

Ball.prototype.launch = function(deltaX, deltaY){
	this.deltaX = deltaX;
	this.deltaY = deltaY;
}

Ball.prototype.nextX = function() {
	return this.x + (this.deltaX * this.timeScale);
}

Ball.prototype.nextY = function() {
	return this.y + (this.deltaY * this.timeScale);
}

Ball.prototype.setDeltaX = function(deltaX) {
	if(deltaX >  this.maxSpeed) deltaX =  this.maxSpeed; else 
	if(deltaX < -this.maxSpeed) deltaX = -this.maxSpeed;
	this.deltaX = deltaX;
}

Ball.prototype.setDeltaY = function(deltaY) {
	this.deltaY = deltaY;
}

Ball.prototype.bounceX = function(){
	this.deltaX *= -1.0;
}

Ball.prototype.bounceY = function(){
	this.deltaY *= -1.0;
}

Ball.prototype.setStatus = function(status) {
	this.status = status;
}

Ball.prototype.setX = function(x) {
	this.x = x;
}

Ball.prototype.setY = function(y) {
	this.y = y;
}    
