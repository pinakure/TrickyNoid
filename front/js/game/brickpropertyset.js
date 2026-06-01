var BrickProperties = false;

function BrickPropertySet(	index,
							isExplosive,
                            isInverter,
                            isSticked,
                            causesBounce,
                            blowable,
                            shootable,
                            shootAngle,
                            shootsMissile,
                            noise,
                            score,
                            graphic,
                            health,
                            destructable){
	this.index = index;
	this.isExplosive = isExplosive;   	// True if brick blows up when hit
	this.isSticked = isSticked;     	// True if brick is inmune to gravity
	this.isInverter = isInverter;    	// True if causes delta switching
	this.causesBounce = causesBounce;  	// Causes the ball to bounce when hit
	this.blowable = blowable;      		// Can be destroyed by an explosion splash
	this.shootable = shootable;     	// Can be destroyed by a shooted projectile
	this.shootAngle = shootAngle;    	// 0  - none, 1-Up, 2-Right, 3-Bottom, 4-Left
	this.shootsMissile = shootsMissile;	// true if this brick shoots a missile when hit
	this.noise = noise;         		// Noise index casted when hit
	this.score = score;         		// Score earned when this brick is destroyed
	this.graphic = graphic;       		// Graphic used by this brick
	this.health = health;        		// Brick health (0 or less causes a call to destroy() )
	this.destructable = destructable;
}

BrickPropertySet.prototype.addType = function(index,			isExplosive,	isInverter,		
												isSticked,		causesBounce,	blowable,		
												shootable,		shootAngle,		shootsMissile,	
												noise,			score,			graphic,
												health,			destructable) {
	BrickProperties[BrickProperties.length]=new BrickPropertySet(index, 
																isExplosive,
																isInverter,
																isSticked,
																causesBounce,
																blowable,
																shootable,
																shootAngle,
																shootsMissile,
																noise,
																score,
																graphic,
																health,
																destructable);
}

BrickPropertySet.prototype.initialize = function(){
	
	BrickProperties = [];
	
	var EXPLOSIVE	= true;
	var STICKED  	= true;
	var BOUNCE   	= true;
	var BLOWABLE 	= true;
	var SHOOTABLE	= true;
	var SHOOT_NONE 	= 0x00;
	var SHOOT_UP   	= 0x01;
	var SHOOT_RIGHT	= 0x02;
	var SHOOT_DOWN 	= 0x03;
	var SHOOT_LEFT 	= 0x04;
	var MISSILE		= true;
	var DEFAULTNOISE = 0x01;
	var DESTRUCTABLE = true;
	var DEFAULTGRAPH = 1;
	var HEALTH_ONE   = 1;
	var HEALTH_TWO   = 2;
	var HEALTH_THREE = 3;
	
	this.addType(BRICK_NONE,         false,  false,   STICKED, false , false,    false,     SHOOT_NONE, false,  		0x00,     0, 0x00, 0, 			false);
	this.addType(BRICK_GOO,          false,  false,   STICKED, false , BLOWABLE, SHOOTABLE, SHOOT_NONE, false,	DEFAULTNOISE,   150, 0x01, HEALTH_ONE,	DESTRUCTABLE);
	this.addType(BRICK_CLAY,         false,  false,   false,   BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,	DEFAULTNOISE,   200, 0x11, HEALTH_ONE,	DESTRUCTABLE);
	this.addType(BRICK_CLAY_STICKED, false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,	DEFAULTNOISE,   200, 0x21, HEALTH_TWO,	DESTRUCTABLE);
	this.addType(BRICK_STONE,        false,  false,   false,   BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,	DEFAULTNOISE,   300, 0x31, HEALTH_THREE,DESTRUCTABLE);
	this.addType(BRICK_STONE_STICKED,false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,	DEFAULTNOISE,   300, 0x41, HEALTH_THREE,DESTRUCTABLE);
	this.addType(BRICK_IRON,         false,  false,   false,   BOUNCE, BLOWABLE,     false, SHOOT_NONE, false,	DEFAULTNOISE,   300, 0x31, HEALTH_THREE,DESTRUCTABLE);
	this.addType(BRICK_IRON_STICKED, false,  false,   STICKED, BOUNCE, BLOWABLE,     false, SHOOT_NONE, false,	DEFAULTNOISE,   300, 0x41, HEALTH_THREE,false);
	
	this.addType(BRICK_SUP_STICKED,  false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_UP,   false,	DEFAULTNOISE,     5, 0x71, HEALTH_ONE,	false);
	this.addType(BRICK_SRIGHT_STICKED,false, false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_RIGHT,false,	DEFAULTNOISE,     5, 0x72, HEALTH_ONE,	false);
	this.addType(BRICK_SDOWN_STICKED,false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_DOWN, false,	DEFAULTNOISE,     5, 0x73, HEALTH_ONE,	false);
	this.addType(BRICK_SLEFT_STICKED,false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_LEFT, false,	DEFAULTNOISE,     5, 0x74, HEALTH_ONE,	false);
	this.addType(BRICK_SUP,          false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_UP,   false,	DEFAULTNOISE,     5, 0x75, HEALTH_ONE,	false);
	this.addType(BRICK_SRIGHT,       false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_RIGHT,false,	DEFAULTNOISE,     5, 0x76, HEALTH_ONE,	false);
	this.addType(BRICK_SDOWN,        false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_DOWN, false,	DEFAULTNOISE,     5, 0x77, HEALTH_ONE,	false);
	this.addType(BRICK_SLEFT,        false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_LEFT, false,	DEFAULTNOISE,     5, 0x78, HEALTH_ONE,	false);
	this.addType(BRICK_MUP_STICKED,  false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_UP,   MISSILE,	DEFAULTNOISE,     5, 0x79, HEALTH_ONE,	false);
	this.addType(BRICK_MRIGHT_STICKED,false, false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_RIGHT,MISSILE,	DEFAULTNOISE,     5, 0x7A, HEALTH_ONE,	false);
	this.addType(BRICK_MDOWN_STICKED,false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_DOWN, MISSILE,	DEFAULTNOISE,     5, 0x7B, HEALTH_ONE,	false);
	this.addType(BRICK_MLEFT_STICKED,false,  false,   STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_LEFT, MISSILE,	DEFAULTNOISE,     5, 0x7C, HEALTH_ONE,	false);
	this.addType(BRICK_MUP,          false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_UP,   MISSILE,	DEFAULTNOISE,     5, 0x7D, HEALTH_ONE,	false);
	this.addType(BRICK_MRIGHT,       false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_RIGHT,MISSILE,	DEFAULTNOISE,     5, 0x7E, HEALTH_ONE,	false);
	this.addType(BRICK_MDOWN,        false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_DOWN, MISSILE,	DEFAULTNOISE,     5, 0x7F, HEALTH_ONE,	false);
	this.addType(BRICK_MLEFT,        false,  false,     false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_LEFT, MISSILE,	DEFAULTNOISE,     5, 0x80, HEALTH_ONE,	false);
	
	this.addType(BRICK_BOOM,         EXPLOSIVE,false,   false, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,   DEFAULTNOISE,   250, 0x20, HEALTH_ONE,	DESTRUCTABLE);
	this.addType(BRICK_BOOM_STICKED, EXPLOSIVE,false, STICKED, BOUNCE, BLOWABLE, SHOOTABLE, SHOOT_NONE, false,   DEFAULTNOISE,   250, 0x30, HEALTH_ONE,	DESTRUCTABLE);
	this.addType(BRICK_INVERTER,     false,    true, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,   350, 0x40, HEALTH_ONE,	false);
	
	this.addType(BRICK_DIAMOND,      false,    false,   false, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,    15, 0x51, HEALTH_ONE,	false);
	this.addType(BRICK_DIAMOND_STICKED, false, false, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,    15, 0x61, HEALTH_ONE,	false);
	
	this.addType(BRICK_CHANNEL_H,    false,   false,    false, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,    15, 0x50, HEALTH_ONE,	false);
	this.addType(BRICK_CHANNEL_V,    false,   false,    false, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,    15, 0x60, HEALTH_ONE,	false);
	this.addType(BRICK_CHANNEL_HV,   false,   false,    false, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,    15, 0x70, HEALTH_ONE,	false);
   
	this.addType(BRICK_INVERTER_A,   false,    true, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,   350, 0x9C, HEALTH_ONE,   false);
	this.addType(BRICK_INVERTER_B,   false,    true, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,   350, 0x9D, HEALTH_ONE,   false);
	this.addType(BRICK_INVERTER_C,   false,    true, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,   350, 0x9E, HEALTH_ONE,   false);
	this.addType(BRICK_INVERTER_D,   false,    true, STICKED, BOUNCE,    false,     false, SHOOT_NONE, false,   DEFAULTNOISE,   350, 0x9F, HEALTH_ONE,	false);
}
