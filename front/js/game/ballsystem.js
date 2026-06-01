var BallGfx = false;

var MAX_BALLS = 512;

function BallSystem(game){
	info('BALLSYSTEM', 'Initializing');	
	this.self = this;
	

	this.balls = [];
	for(var i=0; i < MAX_BALLS; i++){
		this.balls[i] = new Ball(BALL_DEAD);
		this.balls[i].isAlive = false;		
	}
	
	this.theBall = false;
	this.findTheBall();
	
	this.timeScale = 1.0;
	this.drawTrail = false;
	
	/* External class references */
	this.map = false;

	this.game = game;
	
	this.spriteSheet = false;/*static*/ 
	
	this.snap = new Snapshot(	'bs___',
								[this.timeScale, this.theBall.x, this.theBall.y, this.theBall.deltaX, this.theBall.deltaY], 
								[this.theBall.status], 
								[]);
}

BallSystem.prototype.playback = function(s){
	if(!s) return;

	this.timeScale 		= s.f[0];
	this.theBall.x 		= s.f[1];
	this.theBall.y 		= s.f[2];
	this.theBall.deltaX	= s.f[3];
	this.theBall.deltaY	= s.f[4];
	
	this.theBall.status	= s.i[0];	
}

BallSystem.prototype.snapshot = function(){
	return this.snap.update(	[this.timeScale, this.theBall.x, this.theBall.y, this.theBall.deltaX, this.theBall.deltaY],
								[this.theBall.status],
								[]);
}

BallSystem.prototype.reset = function(){
	this.timeScale = 1.0;
	this.drawTrail = false;
	
	this.map = false;

	for(var i=0; i < MAX_BALLS; i++){
		this.balls[i].initialize(112,224,0,0,0);
		this.balls[i].isAlive = false;
		this.balls[i].snap.target = 'b_'+ (('___'+i.toString()).substring(-3));
		this.game.demo.targets[this.balls[i].snap.target] = this.balls[i];
	}
	this.theBall = this.balls[0];
	this.theBall.isAlive = true;
	this.theBall.status = BALL_READY;
	
	this.spriteSheet = false;/*static*/ 
	this.snapshot();
}

BallSystem.prototype.processGraphics = function(me){/*static*/ 
	info("BALLSYSTEM", "Processing graphic data");
	
	var i;
	var totalFrames = 0;
	for(i=0; i<BALL_MAGIC; i++){
		BallGfx[i] = new Animation(	me.spriteSheet, 
									i, 0, 
									i, 0, 
									false, 1, false);        
		totalFrames += BallGfx[i].frameCount;
	}
	
	BallGfx[BALL_MAGIC    ] = new Animation(me.spriteSheet, 
											4, 0, 
											8, 0, 
											true, 5, true);
	BallGfx[BALL_MAGIC].pingPong = true;
	totalFrames += BallGfx[BALL_MAGIC].frameCount;
	
	BallGfx[BALL_EXPLOSIVE] = new Animation(me.spriteSheet, 
											9, 0, 
											12, 0, 
											true, 5, true);
	BallGfx[BALL_EXPLOSIVE].pingPong = true;
	totalFrames += BallGfx[BALL_EXPLOSIVE].frameCount;
	
	BallGfx[BALL_HUDLIGHT] = new Animation(me.spriteSheet,
											16, 0,
											17, 0,
											false, 1, false);
	
	cout('^3'+totalFrames+'^8 frames extracted');	
	game.continueLoad();
}

BallSystem.prototype.loadGraphics = function(){/*static*/ 
	info("BALLSYSTEM", "Requesting graphic data");

	try {
		BallGfx = [];
		this.spriteSheet = new SpriteSheet("gfx/balls.png", 4, 4, [255,0,255], this.self);		
	} catch(e) {
		complaint('BALLSYSTEM', 'Failed to load graphics', e);
		BallGfx = false;
	}
}

BallSystem.prototype.setStatus = function(status){
	var i, b;
	for(i=0; i < MAX_BALLS; i++){
		b = this.balls[i];

		if(!b.isAlive)continue;

		b.setStatus(status);
	}
}

BallSystem.prototype.alter = function(x, y){        
	var i, b;
	for(i=0; i < MAX_BALLS; i++){

		b = this.balls[i];
		
		if(!b.isAlive)continue;

		if(b.status > 0) {            
			b.addDelta(x, y);
		}
	}
}

BallSystem.prototype.multiply = function() {
	var ballsAlive = [];
	var pool = this.balls, p,o=0;
	var i;
	
	for(i=0; i < MAX_BALLS; i++){
		p = pool[i];
		if((p.isAlive)){
			ballsAlive[o] = i;
			o++;
		}
	}
	
	var b;
	for(o=0; o < ballsAlive.length; o++){
		b = this.balls[ballsAlive[o]];
		for(i=0; i < MAX_BALLS; i++){
			p = pool[i];
			if(p.isAlive)continue;
			p.initialize(b.x, b.y, 
						-b.deltaX, -b.deltaY, 
						this.theBall.status);
			break;
		}
	}
}

BallSystem.prototype.divide = function() {
}    

BallSystem.prototype.subdivide = function() {
	var count = 0;
	for(var i=0;i<MAX_BALLS;i++){
		count += this.balls[i].isAlive?1:0;
	}
	if(count < MAX_BALLS/2) this.multiply();
}

BallSystem.prototype.findTheBall = function(){
	for(var i=0;i<MAX_BALLS;i++){
		if(this.balls[i].isAlive){
			this.theBall = this.balls[i];
			return;
		}
	}
}

BallSystem.prototype.render = function(g){
	var i, o, b;
	g.setContext(2);
	g.setDrawMode(g.MODE_NORMAL);
	if(this.drawTrail){            
		for(i=0; i < MAX_BALLS; i++){
			b = this.balls[i];
			if(!b.isAlive) continue;
			for(o=0; o < b.trailLength; o++) {
				BallGfx[BALL_ULTRA].draw(2 + b.trailX[o], 2+ b.trailY[o]);
			}
		}            
	}
	g.setDrawMode(g.MODE_NORMAL);
	
	if((this.game.timeScale < 1.0)&&
	   (this.game.bulletTime > 0.1)) {
		
		this.drawTrail = !this.drawTrail;
	} else {
		this.drawTrail = false;
	}       
	
	for(i=0; i < MAX_BALLS; i++){
		
		b = this.balls[i];
		
		if(!b.isAlive)continue;
		
		if(b.status >= 0)
		BallGfx[b.status % 10].draw(2 + parseInt(b.x), 2 + parseInt(b.y) );            
	}
	g.setContext(g.lastContext);
}    

BallSystem.prototype.swapDeltas = function(ball){
	var up = ball.deltaY < 0.00;
	var left = ball.deltaX < 0.00;
	var tempDeltaY;
	var tempDeltaX;

	if(up){ // Y < 0
		if(left){ // X < 0
			tempDeltaY = ball.deltaX; // -1 = -1 
			tempDeltaX = ball.deltaY; // -1 = -1
		} else { // X > 0
			tempDeltaY = -ball.deltaX;// -1 = -(1)
			tempDeltaX = -ball.deltaY;//  1 = -(-1)
		}
	} else { // Y > 0
		if(left){ // X < 0
			tempDeltaY = -ball.deltaX;//  1 = -(-1)
			tempDeltaX = -ball.deltaY;// -1 = -(1)
		} else { // X > 0
			tempDeltaY = ball.deltaX; //  1 = 1
			tempDeltaX = ball.deltaY; //  1 = 1                               
		}                        
	}

	ball.deltaX = tempDeltaX;
	ball.deltaY = tempDeltaY;
	
	this.game.reaction.invertDeltas = false;
}

BallSystem.prototype.update = function(Delta) {
	var bricks = this.game.bricks;
	this.map = this.game.map;
	
	var stillAlive = false;
	var i,b;

	var bx;     // Ball X position
	var by;     // Ball Y position
	
	var dx;   // Ball delta X
	var dy;   // Ball delta Y
	
	var idx; // Int converted delta X
	var idy; // Int converted delta Y
			
	var testY; // X Point to be tested
	var testX; // Y Point to be tested
			

	for(i=0; i < MAX_BALLS;i++){
		b = this.balls[i];
		
		if(!b.isAlive)continue;
		
		this.theBall = this.balls[i];

		// Apply timescale
		if(this.timeScale > 1.0) {
			b.timeScale = this.timeScale;
			b.setTrailStart(parseInt(b.x), parseInt(b.y));
		} else {
			b.timeScale = this.timeScale;
		}
		
		var ballStatus = b.status; 
		
		// Operate balls
		switch(ballStatus) {
			case BALL_DEAD:
				b.isAlive = false;
				break;
			 
			case BALL_STICKED:
				stillAlive = true;// If at least one ball is alive, the player is still alive
				
				b.setX( parseInt(this.game.paddle.position) + b.stickOffset);                    
				b.setY(219);
				break;
				
			case BALL_READY:
				stillAlive = true;// If at least one ball is alive, the player is still alive
				
				b.setX(parseInt(parseInt(this.game.paddle.position)-3));
				b.setY(219);
				break;
				
			default: //Moving balls
				stillAlive = true;// If at least one ball is alive, the player is still alive
				
				if(b.isStopped()){
					b.launch(1.0, -1.0);
				};
				/* UPDATE HORIZONTAL MOVEMENT ------------------------------- */

				// Move ball horizontally and get updated position
				b.update(Delta, false);
				bx = parseInt(b.x); 
				by = parseInt(b.y);

				dx = b.deltaX; 
				idx = parseInt(dx);

				// Set test points for horizontal bounce
				testY = by;

				if(dx < 0.0) 
					testX = bx - 2 + idx;
				else 
					testX = bx + 2 + idx;

				// Check if ball bounces with something
				if( bricks.test(testX, testY) ) {
					this.game.reaction.target = b;
					if( bricks.hit(testX, testY) ) {
						if(ballStatus == BALL_EXPLOSIVE){
							this.game.scheduledExplosions.add(new Explosion(parseInt(b.x), parseInt(b.y)));
							b.status = BALL_NORMAL;
						}
						b.bounceX();
					}
				}
				/* UPDATE VERTICAL MOVEMENT --------------------------------- */

				// Move ball vertically and get updated position
				b.update(Delta, true);
				//bx = parseInt(b.bx); 
				by = parseInt(b.y);

				// Update delta (
				dy = b.deltaY;
				idy = parseInt(dy);

				// Set test point for vertical check
				testX = bx;

				// Check vertical ball bounce
				if(dy < 0.0) 
					testY = by - 1 + idy;
				else 
					testY = by + 2 + idy;

				// Check if ball bounces with something vertically, or if the paddle hits the ball
				if( bricks.test(testX, testY) ) {
					this.game.reaction.target = b; 
					if( bricks.hit(testX, testY) ){ 
						if(ballStatus == BALL_EXPLOSIVE){
							this.game.scheduledExplosions.add(new Explosion(parseInt(b.x), parseInt(b.y)));
							b.status = BALL_NORMAL;
						}
						b.bounceY();
					}
				}
				else if((this.game.paddle.test(testX, testY+2)) & (dy > 0.0)) {
					// Paddle bounce
					switch(ballStatus) {
						case BALL_STICKY:
							// Stop ball at paddle                        
							b.status = BALL_STICKED;
							b.deltaX = 0.0;
							b.deltaY = 0.0;
							b.stickOffset = parseInt(b.x) - parseInt(this.game.paddle.position);
							break;
							
						default:
							var pd = this.game.paddle.delta * -0.25;   // Paddle delta, to add on bounce 
							b.bounceY();                        
							b.addDelta(pd, 0.0);
							break;
					}
				}

				if(this.game.reaction.invertDeltas) this.swapDeltas(b);
			 // End Of if(paddle.status == PADDLE_READY) ...
				break;
		} // EndSwitch
	} // EndFor

	// Check if balSystem is fully dead
	this.theBall = false;
	this.findTheBall();
	if(!this.theBall) {
		this.game.paddle.status = PADDLE_DEAD;
		this.game.oneDown(1);
		this.game.ready();
	}
}
