var BRICK_NONE          = 0x00;
var BRICK_GOO           = 0x01; // health:1 bounce:false sticked:true  
var BRICK_CLAY          = 0x02; // health:1 bounce:true  sticked:false
var BRICK_CLAY_STICKED  = 0x03; // health:2 bounce:true  sticked:true
var BRICK_STONE         = 0x04; // health:3 bounce:true  sticked:false
var BRICK_STONE_STICKED = 0x05; // health:4 bounce:true  sticked:true
var BRICK_IRON          = 0x06; // destructable:false bounce:true  sticked:false
var BRICK_IRON_STICKED  = 0x07; // destructable:false bounce:true  sticked:true
var BRICK_SUP           = 0x08; // destructable:false bounce:true  sticked:false shootAngle = 1
var BRICK_SRIGHT        = 0x09; // destructable:false bounce:true  sticked:false shootAngle = 2
var BRICK_SDOWN         = 0x0A; // destructable:false bounce:true  sticked:false shootAngle = 3
var BRICK_SLEFT         = 0x0B; // destructable:false bounce:true  sticked:false shootAngle = 4
var BRICK_SUP_STICKED   = 0x0C; // destructable:false bounce:true  sticked:true  shootAngle = 1
var BRICK_SRIGHT_STICKED= 0x0D; // destructable:false bounce:true  sticked:true  shootAngle = 2
var BRICK_SDOWN_STICKED = 0x0E; // destructable:false bounce:true  sticked:true  shootAngle = 3
var BRICK_SLEFT_STICKED = 0x0F; // destructable:false bounce:true  sticked:true  shootAngle = 4
var BRICK_MUP           = 0x10; // destructable:false bounce:true  sticked:false shootAngle = 1
var BRICK_MRIGHT        = 0x11; // destructable:false bounce:true  sticked:false shootAngle = 2
var BRICK_MDOWN         = 0x12; // destructable:false bounce:true  sticked:false shootAngle = 3
var BRICK_MLEFT         = 0x13; // destructable:false bounce:true  sticked:false shootAngle = 4
var BRICK_MUP_STICKED   = 0x14; // destructable:false bounce:true  sticked:true  shootAngle = 1
var BRICK_MRIGHT_STICKED= 0x15; // destructable:false bounce:true  sticked:true  shootAngle = 2
var BRICK_MDOWN_STICKED = 0x16; // destructable:false bounce:true  sticked:true  shootAngle = 3
var BRICK_MLEFT_STICKED = 0x17; // destructable:false bounce:true  sticked:true  shootAngle = 4
var BRICK_BOOM          = 0x18; // explosive:true bounce:true  sticked:false
var BRICK_BOOM_STICKED  = 0x19; // explosive:true bounce:true  sticked:true
var BRICK_INVERTER      = 0x1A; // explosive:true bounce:true  sticked:true
var BRICK_DIAMOND       = 0x1B; // destructable:false bounce:true  sticked:false
var BRICK_DIAMOND_STICKED=0x1C; // destructable:false bounce:true  sticked:true
var BRICK_CHANNEL_H     = 0x1D; // destructable:false bounce:true  sticked:true  
var BRICK_CHANNEL_V     = 0x1E; // destructable:false bounce:true  sticked:true
var BRICK_CHANNEL_HV    = 0x1F; // destructable:false bounce:true  sticked:true  
var BRICK_INVERTER_A    = 0x20; // explosive:true bounce:true  sticked:true
var BRICK_INVERTER_B    = 0x21; // explosive:true bounce:true  sticked:true
var BRICK_INVERTER_C    = 0x22; // explosive:true bounce:true  sticked:true
var BRICK_INVERTER_D    = 0x23; // explosive:true bounce:true  sticked:true

var BRICK_WIDTH = 16;
var BRICK_HEIGHT = 8;
	
function Brick(x, y, type, token, game){
    // Brick relative (tile) position
	this.x = x;
	this.y = y;
	this.game = game;
    this.type = type; // 0x00: No brick  
    this.token = token; // Token which is dropped when destroyed 0x00-0x0f (0x00: none)
	this.offset = 0;
	this.damage = 0;
    this.variation = 0;//Graphical variation
	this.isFalling = false;
	this.scheduleDestroy = 0;
	this.cooling = false;
        
	this.setType(type);
}

Brick.prototype.reset = function(x, y, type, token) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.token = token;
	this.offset = 0;
	this.damage = 0;
	this.scheduleDestroy = 0;
    this.variation = 0;//Graphical variation
	this.isFalling = false;
	this.setType(type);
}

Brick.prototype.test = function(x, y) {
	var bx = (this.x * BRICK_WIDTH);
	var by = (this.y * BRICK_HEIGHT) + this.offset;
	
	return	(x >= bx) && 
			(x < bx + BRICK_WIDTH) && 
			(y >= by) && 
			(y < by + BRICK_HEIGHT);
}

Brick.prototype.fall = function(){
	return;
	/*isFalling = true;
	
	if(offset < 8){
		offset++;
	} else {
		y++;
		offset=0;
	}
	*/
}

Brick.prototype.update = function(){
	if(!this.isAlive())return;
	
	// Check fall
	if(this.isFalling){
		//this.fall();
	}

	
	if(this.scheduleDestroy > 1){
		this.scheduleDestroy--;
	} else if(this.scheduleDestroy == 1) {
		this.destroy();
		this.scheduleDestroy = 0;
	}
	
	this.iscooling = false;
}

Brick.prototype.hit = function(){
	var is = this.isShooter(this.x*16,this.y*8);
	if(is) {		
		this.game.shots.add(is[0], is[1], is[2], is[3], is[4], is[5]);
		this.cooling = true;
	}	
}

Brick.prototype.destroy = function() {
	// Rest a brick to the brick count
	this.game.setBricksLeft(this.game.bricks.bricksLeft - 1);
	
	// Add brick score value  
	this.game.addScore(this.getScore());
	
	// Generate brick debris
	this.game.getParticles().generate(this.getGraph(), this.x*16, this.y*8);
	
	// Alter background depending on the brick type
	this.game.getBackdrop().setColor(this.getGraph() - 1);
	
	if(this.hasToken()) {
		this.game.addToken(this.token, this.x * 16, this.y * 8);		
	}
	
	// Set type to 0
	this.variation = 0;
	this.type = BRICK_NONE;
	this.game.bricks.redraw = true;
}

/*Deprecated*/
//Brick.prototype.generateToken = function() { return new Token(this.token, this.x*16, this.y*8); }


Brick.prototype.isChannel = function(horizontal){
	if(this.type == BRICK_CHANNEL_HV) return true;
	if((this.type == BRICK_CHANNEL_H)&&horizontal)return true;
	if((this.type == BRICK_CHANNEL_V)&&!horizontal)return true;
	return false;
}

Brick.prototype.isShooter = function(x,y){	
	if((this.type == BRICK_SUP		)||(this.type == BRICK_SUP_STICKED		)) return [x+10,   y, 		 0,	-1,   0, false]; else
	if((this.type == BRICK_SRIGHT	)||(this.type == BRICK_SRIGHT_STICKED	)) return [	x+18,	y+6,	 1,  0,  90, false]; else 
	if((this.type == BRICK_SDOWN	)||(this.type == BRICK_SDOWN_STICKED	)) return [x+12,	y+10,	 0,  1, 180, false]; else 
	if((this.type == BRICK_SLEFT	)||(this.type == BRICK_SLEFT_STICKED	)) return [   x,	y+6,	-1,  0, 270, false]; else 
	if((this.type == BRICK_MUP		)||(this.type == BRICK_MUP_STICKED		)) return [	x+10,   y, 		 0,	-1,   0, true]; else
	if((this.type == BRICK_MRIGHT	)||(this.type == BRICK_MRIGHT_STICKED	)) return [	x+18,	y+6,	 1,  0,  90, true]; else 
	if((this.type == BRICK_MDOWN	)||(this.type == BRICK_MDOWN_STICKED	)) return [	x+12,	y+10,	 0,  1, 180, true]; else
	if((this.type == BRICK_MLEFT	)||(this.type == BRICK_MLEFT_STICKED	)) return [   x,	y+6,	-1,  0, 270, true]; else 
	return false;
}

Brick.prototype.setType = function(type){
	/* Note: the type sent by here is the GRAPHIC representation used, so real type must be 
	deduced from there */
	if(type == 0){
		this.type = 0;
		return;
	}
	
	if(type % 0x10 != 0) this.variation = (type-1) & 0xF;
	
	if(type > 0x00 & type < 0x10){
		this.type = BRICK_GOO;            
	} else if(type > 0x10 & type < 0x20) {
		this.type = BRICK_CLAY;
	} else if(type > 0x20 & type < 0x30) {
		this.type = BRICK_CLAY_STICKED;
	} else if(type > 0x30 & type < 0x40) {
		this.type = BRICK_IRON;
	} else if(type > 0x40 & type < 0x50) {
		this.type = BRICK_IRON_STICKED;
	} else if(type > 0x50 & type < 0x60) {
		this.type = BRICK_DIAMOND;
	} else if(type > 0x60 & type < 0x70) {
		this.type = BRICK_DIAMOND_STICKED;
	} else if(type == 0x10) type = BRICK_CLAY;
	else if(type == 0x20){ this.type = BRICK_BOOM; this.variation = 0;}
	else if(type == 0x30){ this.type = BRICK_BOOM_STICKED; this.variation = 0;}
	else if(type == 0x40){ this.type = BRICK_INVERTER;   this.variation = 0;}
	else if(type == 0x50){ this.type = BRICK_CHANNEL_H;  this.variation = 0;}
	else if(type == 0x60){ this.type = BRICK_CHANNEL_V;  this.variation = 0;}
	else if(type == 0x70){ this.type = BRICK_CHANNEL_HV; this.variation = 0;}
	else if(type > 0x70 & type <= 0x80) {
		this.type = BRICK_SUP + (type - 0x71);
		this.variation = 0;
	} else if(type > 0x9B & type < 0xA0) {
		this.type = BRICK_INVERTER_A + type-0x9C;
		this.variation = 0;
	} else {            
		this.type = 0x00;
		this.variation = 0;
	} 
}
  
Brick.prototype.applyDamage= function(appliedDamage) {
	this.damage += appliedDamage;
	if(this.damage > BrickProperties[this.type].health) this.damage = 9;
}

Brick.prototype.setX = function(x) { this.x = x; }
Brick.prototype.setY = function(y) { this.y = y; }
Brick.prototype.getX = function() { return this.x; }
Brick.prototype.getY = function() { return this.y; }
Brick.prototype.isAlive = function(){ return this.type != BRICK_NONE; }
Brick.prototype.getType = function(){	return this.type; }
Brick.prototype.hasToken = function(){ return this.token > 0x00; }    
Brick.prototype.getGraph = function() { if(BrickProperties.length < 1) return 0x00; return BrickProperties[this.type].graphic + this.variation; }
Brick.prototype.getScore = function(){ return BrickProperties[this.type].score; }
Brick.prototype.getHealth = function(){ return BrickProperties[this.type].health; }
Brick.prototype.getDamage = function(){ return this.damage; }
Brick.prototype.getOffset = function() { return this.offset; }
Brick.prototype.isFalling = function() { return this.isFalling; }
Brick.prototype.isSticked = function(){ return BrickProperties[this.type].isSticked; }
Brick.prototype.isInverter = function(){ return BrickProperties[this.type].isInverter; }
Brick.prototype.isExplosive = function(){ return BrickProperties[this.type].isExplosive; }
Brick.prototype.getVariation = function(){ return this.variation; }
Brick.prototype.getTokenType = function(){ return this.token; }
Brick.prototype.causesBounce = function(){ return BrickProperties[this.type].causesBounce; }
Brick.prototype.isDestructable = function(){  return BrickProperties[this.type].destructable; }
Brick.prototype.setScheduledDestroy = function(time){ this.scheduleDestroy = time+1; }