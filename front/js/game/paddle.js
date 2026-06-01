var PaddleGfx = false;

var PADDLE_DEAD    = 0;
var PADDLE_PLAYING = 1;
var PADDLE_LONG    = 2;
var PADDLE_READY   = 3;
var PADDLE_STICKY  = 4;
var PADDLE_SHORT   = 5;
var PADDLE_INVERTED= 6;

function Paddle(theball, game){
	info('PADDLE', 'Initializing');
	this.self = this;
    this.game = game;
    
	this.tokenOsc = new Oscillator(0, 4, .125);
	this.tokenChange = 0.0;

	this.growSteps = 0;
    this.shrinkSteps = 0;
    this.sensitivity = 1.2;
	this.position = 0;
    
	this.delta = 0.0;
    this.lastPosition = 0;
	this.y = 224;
	
    this.warmUp = true; // Prevents accidental fire 
    
	this.status = PADDLE_READY; // 3 waiting for ball active
	this.width = 20;

	this.snap = new Snapshot(	'p____', 
								[this.position, this.delta],
								[this.growSteps, this.shrinkSteps, this.status],
								[this.warmUp]);
	this.spriteSheet = false;
	if(!game)return;
	if(!game.balls)return;
	this.game.balls.theBall.status = BALL_READY;
	
}

Paddle.prototype.snapshot = function(){
	return this.snap.update(	[this.position, this.delta],				
								[this.growSteps, this.shrinkSteps, this.status],
								[this.warmUp]);
}

Paddle.prototype.playback = function(s){
	if(!s)return;
	
	this.lastPosition 	= this.position;
	this.position 		= s.f[0];
	this.delta 			= s.f[1];
	
	this.growSteps 		= s.i[0];
	this.shrinkSteps	= s.i[1];
	this.status 		= s.i[2];
	
	this.warmUp			= s.b[0];
}

Paddle.prototype.reset = function(){
	
	this.growSteps = 0;
    this.shrinkSteps = 0;
    this.sensitivity = 1.2;
	this.position = 110;
    this.delta = 0.0;
    this.lastPosition = 0;
	this.y = 224;
	this.warmUp = true; // Prevents accidental fire 
    this.status = PADDLE_READY; // 3 waiting for ball active
	this.width = 20;
	this.spriteSheet = false;
	this.game.balls.theBall.status = BALL_READY;
	this.snapshot();
}

Paddle.prototype.processGraphics = function(me){
	info("PADDLE", "Processing graphic data");

	PaddleGfx = [];
	PaddleGfx[PADDLE_DEAD   ] = new Animation(me.spriteSheet, 0, 0, 0, 0, false,  1, false);
	PaddleGfx[PADDLE_PLAYING] = new Animation(me.spriteSheet, 0, 1, 0, 5, false,  5, true);
	PaddleGfx[PADDLE_LONG   ] = new Animation(me.spriteSheet, 0, 6, 0, 6, false,  1, false);
	PaddleGfx[PADDLE_READY  ] = new Animation(me.spriteSheet, 0, 7, 0, 7, false,  1, false);
	PaddleGfx[PADDLE_STICKY ] = new Animation(me.spriteSheet, 0, 8, 0, 8, false,  1, false);
	
	PaddleGfx[PADDLE_PLAYING].setPingPong(true);

	var i, totalFrames = 0;
	for(i=0; i<PaddleGfx.length; i++){
		totalFrames += PaddleGfx[i].frameCount;
	}
	
	cout('^3'+totalFrames+'^8 frames extracted');
	game.continueLoad();
}

Paddle.prototype.loadGraphics = function(){
	info("PADDLE", "Requesting graphic data");
	
	try {
		this.spriteSheet = new SpriteSheet("gfx/pad.png", 20, 4, [255,0,255], this.self);
	} catch(e) {
		complaint('PADDLE', 'Failed to load graphics', e);
		PaddleGfx = false;
	}
}

Paddle.prototype.setX = function(position) { this.position = position; }
Paddle.prototype.setY = function(y){ this.y = y; }
Paddle.prototype.setStatus = function(status){ this.status = status; }
Paddle.prototype.grow = function() {  if(this.width < 220) this.width+=2; }
Paddle.prototype.shrink = function(){	if(this.width > 10) this.width-=2;  }
Paddle.prototype.setWidth = function(width) { this.width = width; }

Paddle.prototype.setDelta = function(delta){ this.delta += delta; }
Paddle.prototype.addDelta = function(position) {
	this.delta += ((this.lastPosition - position) / this.sensitivity);
	this.lastPosition = parseInt(position);
}

Paddle.prototype.stop = function(position) {
	this.position = position;                         
	this.delta = 0.0;
}

Paddle.prototype.shoot = function(){
	
	var inv = this.game.inventory;
	
	switch(this.game.powerupType){
		case TOKEN_GROW:
			if(this.width >= 220) break;
			
			if(inv.grow > 0){
				this.growSteps+=8;
				if(!this.game.demo.playback)inv.grow--;
			} 
			break;
		
		case TOKEN_SHRINK:
			if(this.width <= 10) break;
			
			if(inv.shrink > 0){
				this.shrinkSteps+=8;
				if(!this.game.demo.playback)inv.shrink--;
			}
			break;
	 
		case TOKEN_SUBDIVIDE:
			if(inv.subdivide > 0){
				this.game.applyEffect(TOKEN_SUBDIVIDE);
				if(!this.game.demo.playback)inv.subdivide--;
			} 
			break;
		
		case TOKEN_ULTRABALL:
			if(this.game.balls.theBall.status == BALL_ULTRA) break;                
			
			if(inv.ultraball > 0) {
				this.game.applyEffect(TOKEN_ULTRABALL);
				if(!this.game.demo.playback)inv.ultraball--;
			}
			break;
		
		case TOKEN_STICKBALL:
			if(this.game.balls.theBall.status == BALL_STICKY) break;
			if(this.game.balls.theBall.status == BALL_STICKED) break;
			
			if(inv.stickyball > 0) {
				this.game.applyEffect(TOKEN_STICKBALL);
				if(!this.game.demo.playback)inv.stickyball--;
			}
			break;
		
		case TOKEN_COMMODIN:
			if(this.game.balls.theBall.status == BALL_MAGIC) break;
			
			if(inv.commodin > 0) {
				this.game.applyEffect(TOKEN_COMMODIN);
				if(!this.game.demo.playback)inv.commodin--;
			}
			break;
			
		case TOKEN_EXPLOSIVE:
			if(this.game.balls.theBall.status == BALL_EXPLOSIVE) break;
			
			if(inv.explosive > 0) {
				this.game.applyEffect(TOKEN_EXPLOSIVE);
				if(!this.game.demo.playback)inv.explosive--;
			}
			break;
		
		case TOKEN_SHOOT:
			if(inv.ammo > 0) {
				this.game.applyEffect(TOKEN_SHOOT);
				if(!this.game.demo.playback)inv.ammo--;
			}                
			break;
	  
		case TOKEN_MISSILE:
			if(inv.missile > 0) {
				this.game.applyEffect(TOKEN_MISSILE);
				if(!this.game.demo.playback)inv.missile--;
			}                
			break;
			
		case TOKEN_SHIELD:
			if(this.game.isFullShield()) break;
			
			if(inv.shield > 0) {
				this.game.applyEffect(TOKEN_SHIELD);
				if(!this.game.demo.playback)inv.shield--;
			}
			
		default:
			break;
	}        
}

Paddle.prototype.trigger = function(left) {
	
	var b;
	var balls = this.game.balls.balls;
	
	for(var i=0; i < MAX_BALLS; i++){
		b = balls[i];
		
		if(!b.isAlive)continue;
		
		if(b.status == BALL_STICKED){
			b.setDeltaX(-this.delta);
			b.setDeltaY(-1.0);
			b.setStatus(BALL_STICKY);
		} else if(b.status == BALL_READY ){
			b.setDeltaX(-this.delta);
			b.setDeltaY(-1.0);
			b.setStatus(BALL_NORMAL);
			this.status = PADDLE_PLAYING;
		}
	}
}


Paddle.prototype.test = function(x, y) {        
	if((y >= 224)&&(y <= 227)){
		
		var left = parseInt(this.position) - 4;
		var width = (this.width / 2); //4 = grace zone
		var px = parseInt(this.position);
		var left =  px - (width);
		var right = px + (width);
		
		if((x > left-5) && (x < right+2)) {
			return true;
		}
	}
	return false;
}

var tokenFrame = 0;

Paddle.prototype.render = function(g) {
	var halfwidth = this.width / 2;
   
	var a = PaddleGfx[this.status];
	
	BallGfx[BALL_NORMAL].draw(1 + this.position - (halfwidth+2), 224);
	BallGfx[BALL_NORMAL].draw(1 + this.position + (halfwidth-2), 224);
	a.drawStretch(1 + this.position - halfwidth , 224, this.width, 4);

	if(this.tokenChange > 0){
		g.setAlpha(this.tokenChange);
		tokenFrame+=.125;
		if(tokenFrame >TokenGfx[this.game.powerupType].frameCount-1) tokenFrame = 0;
		TokenGfx[this.game.powerupType].frame = parseInt(tokenFrame);
		TokenGfx[this.game.powerupType].drawStretch(	this.position-(7-(this.tokenOsc.current)), 
														this.y-(16-this.tokenOsc.current), 
														15-(this.tokenOsc.current*2),
														15-(this.tokenOsc.current*2));
		g.setAlpha(1);
		this.tokenChange -= 0.005;
		this.tokenOsc.update();
	}
}

Paddle.prototype.update = function() {
	if(this.status != PADDLE_DEAD) {
		
		
		
		if(this.delta < -0.01){
			this.delta *= 0.75;
		} else {
			if(this.delta > 0.01){
				this.delta *= 0.75;
			} else {
				this.delta = 0.0;
			}
		}
	
		// Move paddle
		this.position -= this.delta;	
	
		// Grow paddle
		if(this.growSteps > 0){
			this.grow();
			this.growSteps--;
		}
		if(this.shrinkSteps > 0){
			this.shrink();
			this.shrinkSteps--;
		}
	
		// Correct paddle position
		if(this.position > (this.width/2)+4) {
			if(this.position > 223.99 - (this.width/2)) {
				this.stop(224 - (this.width/2));
			} 
		} else {
			this.stop(( this.width/2)+4);
		}        
	}
	
	if(ACTION_ACTIVATE) {
		var ballsReady = false;            
		var ballArray = this.game.balls.balls;
		for(var i=0; i< MAX_BALLS; i++) {
			b = ballArray[i];
			if(!b.isAlive)continue;
			if((b.status == BALL_STICKED) || (b.status == BALL_READY)) {
				ballsReady = true;
				break;
			}
		}

		if(ballsReady) {
			this.trigger(false);
			if(this.status != PADDLE_STICKY) this.status = PADDLE_PLAYING;
			this.game.musicplayer.loud();
		} else if(this.status != PADDLE_READY){
			this.shoot();
		} 				
	} 
}